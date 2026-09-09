import { mapOutcome } from './outcome'
import { priceService } from './pricing'
import { composeProposal } from './proposal'
import { resolveService } from './service-resolver'
import { scoreLead } from './scoring'
import type { EmailPort } from '@/ports/email'
import type { RegistryPort } from '@/ports/registry'
import type { Answers, LeadRecord, RedactedOutcome } from './types'

export type ValidationField =
  | 'name' | 'email' | 'company' | 'consent'
  | 'challenge' | 'need' | 'size' | 'maturity' | 'timing' | 'sponsor' | 'budget'

export interface ValidationError {
  readonly kind: 'validation_error'
  readonly field: ValidationField
  readonly message: string
}

export type SubmitResult = RedactedOutcome | ValidationError

export interface DispatchReport {
  readonly clientEmail: 'ok' | 'failed'
  readonly internalEmail: 'ok' | 'failed'
  readonly registry: 'ok' | 'failed'
}

export interface SubmitDeps {
  readonly emailPort: EmailPort
  readonly registryPort: RegistryPort
  readonly internalMailbox: string
  readonly now: () => Date
  readonly onDispatch?: (report: DispatchReport) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Valores admisibles de cada respuesta de negocio.
 *
 * Esto NO es paranoia sobre el formulario: una acción de servidor es un endpoint HTTP público y
 * el formulario no es su única vía de entrada. Sin esta comprobación, un valor inventado en el
 * tramo de tamaño produce `NaN` al aplicar el factor, y de ahí sale un «NaN – NaN €» en pantalla y en
 * un correo con el membrete de Nexus. El catálogo existe justamente para que no salga de la firma
 * una cifra improvisada (constitution 4, 5 · CA-02).
 */
const ADMISIBLES: Readonly<Record<string, readonly string[]>> = {
  challenge: ['ia', 'ciberseguridad', 'esg', 'estrategia_operaciones'],
  need: ['diagnostico', 'implantacion', 'acompanamiento', 'desarrollo'],
  size: ['<50', '50-249', '250-999', '>=1000'],
  maturity: ['inicial', 'en_desarrollo', 'avanzada'],
  timing: ['<3m', '3-6m', '>6m'],
  sponsor: ['si', 'en_proceso', 'no'],
  budget: ['asignado', 'previsto', 'sin'],
}

/** Valida las respuestas de negocio. `need` puede ser null: sólo la línea de IA ramifica. */
export function validateAnswers(answers: Answers): ValidationError | null {
  for (const [campo, valores] of Object.entries(ADMISIBLES)) {
    const valor = (answers as unknown as Record<string, unknown>)[campo]
    if (campo === 'need' && valor === null) continue
    if (typeof valor !== 'string' || !valores.includes(valor)) {
      return {
        kind: 'validation_error',
        field: campo as ValidationField,
        message: 'Esa respuesta no es una de las opciones. Vuelve a empezar el formulario.',
      }
    }
  }
  return null
}

export function validateContact(answers: Answers): ValidationError | null {
  const { name, email, company } = answers.contact
  if (!name.trim()) {
    return { kind: 'validation_error', field: 'name', message: 'Necesitamos tu nombre.' }
  }
  if (!EMAIL_RE.test(email.trim())) {
    return {
      kind: 'validation_error',
      field: 'email',
      message: 'Revisa el correo: no podemos enviarte la propuesta a esa dirección.',
    }
  }
  if (!company.trim()) {
    return { kind: 'validation_error', field: 'company', message: 'Necesitamos el nombre de tu organización.' }
  }
  if (answers.contact.consent !== true) {
    return {
      kind: 'validation_error',
      field: 'consent',
      message: 'Necesitamos tu consentimiento para enviarte la estimación.',
    }
  }
  return null
}

/** Deduplicación por sesión de formulario. Cubre doble clic y recarga (CA-18). */
export class DedupCache {
  private readonly entries = new Map<string, { outcome: RedactedOutcome; at: number }>()

  constructor(
    private readonly ttlMs = 10 * 60 * 1000,
    private readonly clock: () => number = () => Date.now(),
  ) {}

  get(id: string): RedactedOutcome | null {
    const hit = this.entries.get(id)
    if (!hit) return null
    if (this.clock() - hit.at > this.ttlMs) {
      this.entries.delete(id)
      return null
    }
    return hit.outcome
  }

  set(id: string, outcome: RedactedOutcome): void {
    this.entries.set(id, { outcome, at: this.clock() })
  }
}

async function attempt(fn: () => Promise<void>): Promise<'ok' | 'failed'> {
  try {
    await fn()
    return 'ok'
  } catch {
    return 'failed'
  }
}

/**
 * Único punto de entrada de un envío. NUNCA lanza hacia el cliente.
 *
 * El despacho es best-effort e independiente por vía: el fallo de una no cancela las otras, y
 * ninguna puede impedir que el lead vea su resultado (CA-17). Sin almacén duradero, un fallo
 * simultáneo de correo y registro pierde el lead: riesgo aceptado y escrito (C-01 / S-0006).
 */
export async function submitLead(
  answers: Answers,
  submissionId: string,
  deps: SubmitDeps,
  cache: DedupCache,
): Promise<SubmitResult> {
  const invalidAnswers = validateAnswers(answers)
  if (invalidAnswers) return invalidAnswers

  const invalid = validateContact(answers)
  if (invalid) return invalid

  const cached = cache.get(submissionId)
  if (cached) return cached

  const resolution = resolveService(answers.challenge, answers.need)
  const service = resolution.kind === 'service' ? resolution.service : null
  const price = service
    ? priceService(service, answers.size, answers.maturity, answers.timing)
    : null

  const score = scoreLead(answers)
  const outcome = mapOutcome(service, price, score)
  const proposal = composeProposal(answers.contact, service, price, outcome.kind)

  const lead: LeadRecord = {
    submittedAt: deps.now().toISOString(),
    contact: answers.contact,
    answers,
    serviceLabel: service?.label ?? null,
    rangeText: outcome.rangeText,
    score,
  }

  const report: DispatchReport = {
    clientEmail: await attempt(() =>
      deps.emailPort.send({
        to: answers.contact.email,
        subject: 'Tu estimación orientativa — Nexus Consulting',
        body: proposal,
      }),
    ),
    internalEmail: await attempt(() =>
      deps.emailPort.send({
        to: deps.internalMailbox,
        subject: `Nuevo lead · ${answers.contact.company} · ${score.total}/10`,
        body: buildInternalNotice(lead),
      }),
    ),
    registry: await attempt(() => deps.registryPort.append(lead)),
  }

  deps.onDispatch?.(report)
  cache.set(submissionId, outcome)
  return outcome
}

/** El aviso interno sin desglose es inservible (CA-16). */
export function buildInternalNotice(lead: LeadRecord): string {
  const líneas = lead.score.breakdown.map((b) => `  - ${b.signal}: ${b.answer} → ${b.points > 0 ? '+' : ''}${b.points}`)
  return [
    `Contacto: ${lead.contact.name} <${lead.contact.email}> — ${lead.contact.company}`,
    `Recibido: ${lead.submittedAt}`,
    `Consentimiento: sí (${lead.submittedAt})`,
    '',
    `Servicio aplicable: ${lead.serviceLabel ?? 'Sin catalogar — llamada de alcance'}`,
    `Rango estimado: ${lead.rangeText ?? 'Sin cifra'}`,
    '',
    `Puntuación: ${lead.score.total}/10`,
    ...líneas,
    '',
    'Respuestas completas:',
    `  - Reto: ${lead.answers.challenge}`,
    `  - Necesidad: ${lead.answers.need ?? '—'}`,
    `  - Tamaño: ${lead.answers.size}`,
    `  - Madurez: ${lead.answers.maturity}`,
    `  - Plazo: ${lead.answers.timing}`,
    `  - Sponsor: ${lead.answers.sponsor}`,
    `  - Presupuesto: ${lead.answers.budget}`,
  ].join('\n')
}
