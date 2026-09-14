import { mapOutcome } from './outcome'
import { priceService } from './pricing'
import { composeProposal } from './proposal'
import { resolveService } from './service-resolver'
import { scoreLead } from './scoring'
import type { EmailPort } from '@/ports/email'
import type { RegistryPort } from '@/ports/registry'
import type { RateLimitPort } from '@/ports/rate-limit'
import { excedeElTope } from './rate-limit'
import { BLOCKER_LABEL, BLOCKER_OPTIONS } from './options'
import type { Answers, Blocker, LeadRecord, RedactedOutcome, Score } from './types'
import type { LoadedCatalog } from './catalog-types'

export type ValidationField =
  | 'name' | 'email' | 'company' | 'consent'
  | 'challenge' | 'need' | 'size' | 'maturity' | 'timing' | 'sponsor' | 'budget' | 'blockers'
  /** No es una pregunta del formulario: es el identificador del envío, que también se valida. */
  | 'submissionId'

export interface ValidationError {
  readonly kind: 'validation_error'
  readonly field: ValidationField
  readonly message: string
}

/**
 * Lo que ve quien cruza el tope de envíos. Lleva SIEMPRE una vía alternativa de contacto: un lead
 * legítimo puede caer aquí sin haber hecho nada malo —varias personas de una misma empresa comparten
 * una sola dirección pública— y no puede quedarse sin camino hasta el equipo (`CA-L3`).
 */
export interface RateLimited {
  readonly kind: 'rate_limited'
  readonly message: string
  readonly contactEmail: string
}

export type SubmitResult = RedactedOutcome | ValidationError | RateLimited

export interface DispatchReport {
  readonly clientEmail: 'ok' | 'failed'
  readonly internalEmail: 'ok' | 'failed'
  readonly registry: 'ok' | 'failed'
}

export interface SubmitDeps {
  /**
   * El catálogo con su procedencia, cargado UNA sola vez por envío en la frontera de servidor.
   *
   * Que llegue aquí como dependencia y no se busque solo es lo que garantiza CA-10: las cuatro
   * funciones del núcleo reciben el mismo objeto, así que es imposible que dos partes del mismo
   * cálculo usen catálogos distintos. No es una convención que recordar, es una imposibilidad.
   *
   * **`null` significa «no hay catálogo, ni vivo ni en foto»** (CA-09). No debería ocurrir nunca —la
   * publicación falla antes que quedarse sin foto— pero si ocurre, el lead se registra igual y sin
   * cifra. Perder un lead porque la base de datos tuvo un mal día sería el peor desenlace posible.
   */
  readonly catalog: LoadedCatalog | null
  readonly emailPort: EmailPort
  readonly registryPort: RegistryPort
  readonly rateLimitPort: RateLimitPort
  readonly internalMailbox: string
  /** Huella del origen. `null` cuando no se pudo identificar: entonces no se aplica tope. */
  readonly fingerprint: string | null
  readonly now: () => Date
  readonly onDispatch?: (report: DispatchReport) => void
}

/**
 * La puntuación cuando no hubo catálogo con el que calcularla.
 *
 * No es un cero: un cero significa «lead flojo» y aquí significa «no lo sabemos». Guardar un 0 raso
 * en la base de datos convertiría una avería en un juicio comercial sobre alguien, y nadie que leyera
 * la fila mañana podría distinguirlos. El desglose lo dice con todas las letras.
 */
const SIN_PUNTUACIÓN: Score = {
  total: 0,
  breakdown: [
    {
      signal: 'catálogo',
      answer: 'NO DISPONIBLE — ni catálogo vivo ni foto utilizable en el momento del envío',
      points: 0,
    },
  ],
}

/** Sin catálogo no se da cifra. Es el mismo desenlace que un reto sin catalogar (CA-09). */
const DESENLACE_SIN_CATÁLOGO: RedactedOutcome = {
  kind: 'uncatalogued',
  rangeText: null,
  disclaimer:
    'Preferimos no dar un número antes de entender el problema. Es criterio de la casa, no una evasiva.',
  bodyText:
    'Hemos recibido tu solicitud y la tenemos guardada. En este momento no podemos calcularte un ' +
    'rango orientativo, así que te llamamos para verlo contigo — sin coste y sin compromiso.',
  showCalendar: false,
}

/** Buzón público al que se manda a quien cruza el tope. No es el interno de oportunidades. */
const BUZÓN_PÚBLICO = 'hola@nexus.ad'

const MENSAJE_TOPE =
  'Hemos recibido varios envíos desde tu conexión en poco rato. Prueba de nuevo dentro de unos ' +
  'minutos — o escríbenos directamente y te atendemos igual.'

/**
 * ¿Hay que frenar este envío?
 *
 * Anota y cuenta en una sola operación atómica. **Antes eran dos viajes** —leer el contador y luego
 * anotar— y la revisión adversarial del 2026-09-14 demostró que eso se atraviesa entero: treinta
 * peticiones simultáneas leen todas el mismo contador antes de que ninguna haya anotado, y las
 * treinta se creen por debajo del tope. En Vercel cada una corre en una instancia distinta, así que
 * lo único que puede coordinarlas es la propia base de datos.
 *
 * Se abre ante cualquier duda: sin huella no hay tope, y si el conteo falla tampoco. El daño de los
 * dos casos no es simétrico — bloquear a un lead legítimo cuesta un cliente, dejar pasar un envío de
 * más cuesta una fila (`CA-L6`).
 */
async function superaElTope(
  fingerprint: string | null,
  port: RateLimitPort,
): Promise<boolean> {
  if (!fingerprint) return false
  try {
    return excedeElTope(await port.registerAndCount(fingerprint))
  } catch {
    return false
  }
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

const FRENOS_ADMISIBLES: readonly string[] = BLOCKER_OPTIONS.map((o) => o.value)

const ERROR_OPCIONES = 'Esa respuesta no es una de las opciones. Vuelve a empezar el formulario.'

/**
 * Valida los frenos declarados. Es el único campo multi-valor, y el único donde «nada» es una
 * respuesta válida: la pantalla se puede saltar. Lo que no vale es que el campo no exista —la lista
 * vacía se declara— ni que traiga repetidos: es un conjunto, y un duplicado sólo puede venir de algo
 * que no es el formulario.
 */
function validateBlockers(answers: Answers): ValidationError | null {
  const valor = (answers as unknown as Record<string, unknown>).blockers
  const inválido: ValidationError = {
    kind: 'validation_error',
    field: 'blockers',
    message: ERROR_OPCIONES,
  }

  if (!Array.isArray(valor)) return inválido

  // `Array.from` materializa los huecos de un array disperso como `undefined`. Sin esto, `.some()`
  // los SALTA —y por tanto no ve nada inválido— mientras que `new Set()` sí los cuenta: un
  // `[, 'sin_perfiles']` pasaba el guardián y dejaba un separador huérfano en el aviso interno.
  const items = Array.from(valor)
  if (items.some((v) => typeof v !== 'string' || !FRENOS_ADMISIBLES.includes(v))) return inválido
  if (new Set(items).size !== items.length) return inválido
  return null
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
        message: ERROR_OPCIONES,
      }
    }
  }
  return validateBlockers(answers)
}

/**
 * Topes de tamaño de los campos libres.
 *
 * No son cosmética del formulario: desde que el registro escribe de verdad en una base de datos, una
 * acción de servidor —que es un endpoint HTTP público, y el formulario no es su única vía de
 * entrada— permite insertar filas con campos de cientos de kilobytes. El límite del correo es el de
 * la norma; los otros dos son holgados para un nombre y una razón social reales.
 */
const MAX = { name: 120, email: 254, company: 160, submissionId: 100 } as const

const ERROR_LARGO = 'Ese valor es demasiado largo. Revísalo, por favor.'

export function validateContact(answers: Answers): ValidationError | null {
  const { name, email, company } = answers.contact
  if (!name.trim()) {
    return { kind: 'validation_error', field: 'name', message: 'Necesitamos tu nombre.' }
  }
  if (name.length > MAX.name) {
    return { kind: 'validation_error', field: 'name', message: ERROR_LARGO }
  }
  if (email.length > MAX.email) {
    return { kind: 'validation_error', field: 'email', message: ERROR_LARGO }
  }
  if (company.length > MAX.company) {
    return { kind: 'validation_error', field: 'company', message: ERROR_LARGO }
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
 * ninguna puede impedir que el lead vea su resultado (CA-17).
 *
 * El registro va PRIMERO desde la spec `leads-en-supabase`: es la única forma de que el aviso
 * interno pueda declarar si el lead quedó guardado (CA-S3). El riesgo `C-01`/`S-0006` —«sin almacén
 * duradero, un fallo simultáneo de correo y registro pierde el lead»— deja de aplicar en cuanto hay
 * base de datos configurada; mientras no la haya, sigue vigente tal cual.
 */
export async function submitLead(
  answers: Answers,
  submissionId: string,
  deps: SubmitDeps,
  cache: DedupCache,
): Promise<SubmitResult> {
  // El identificador lo genera el navegador, así que quien llame a la acción lo controla — y viaja
  // a la base de datos como clave única. Se acota igual que los demás campos libres.
  if (typeof submissionId !== 'string' || !submissionId.trim() || submissionId.length > MAX.submissionId) {
    return { kind: 'validation_error', field: 'submissionId', message: ERROR_OPCIONES }
  }

  const invalidAnswers = validateAnswers(answers)
  if (invalidAnswers) return invalidAnswers

  const invalid = validateContact(answers)
  if (invalid) return invalid

  // El doble clic se resuelve ANTES del tope a propósito: es el mismo envío, y gastarle cupo a
  // alguien por tener el ratón nervioso sería castigarle por nuestra cuenta.
  const cached = cache.get(submissionId)
  if (cached) return cached

  const ahora = deps.now()

  if (await superaElTope(deps.fingerprint, deps.rateLimitPort)) {
    return { kind: 'rate_limited', message: MENSAJE_TOPE, contactEmail: BUZÓN_PÚBLICO }
  }

  // UN solo catálogo de principio a fin de este cálculo (CA-10).
  const cargado = deps.catalog
  const catalog = cargado?.catalog ?? null

  // Sin catálogo no hay servicio, no hay precio y no hay puntuación que calcular. Lo que sí hay es
  // un lead con sus respuestas, y eso se guarda (CA-09). El desenlace es el mismo que el de un reto
  // sin catalogar: ninguna cifra y una llamada de alcance — desde fuera no se distingue, y no tiene
  // por qué: al visitante no se le cuenta que nuestra base de datos se cayó.
  const service = catalog
    ? (() => {
        const r = resolveService(catalog, answers.challenge, answers.need)
        return r.kind === 'service' ? r.service : null
      })()
    : null
  const price =
    catalog && service
      ? priceService(catalog, service, answers.size, answers.maturity, answers.timing)
      : null

  const score = catalog ? scoreLead(catalog, answers) : SIN_PUNTUACIÓN
  const outcome = catalog
    ? mapOutcome(catalog, service, price, score)
    : DESENLACE_SIN_CATÁLOGO
  const proposal = composeProposal(answers.contact, service, price, outcome.kind)

  const lead: LeadRecord = {
    submissionId,
    submittedAt: ahora.toISOString(),
    contact: answers.contact,
    answers,
    serviceLabel: service?.label ?? null,
    rangeText: outcome.rangeText,
    score,
    blockers: answers.blockers,
  }

  // El guardado va PRIMERO, y no por gusto: el aviso interno tiene que poder declarar si este lead
  // ha quedado registrado (CA-S3), y con el orden anterior el correo se redactaba antes de saberlo.
  const registry = await attempt(() => deps.registryPort.append(lead))

  const report: DispatchReport = {
    registry,
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
        body: buildInternalNotice(lead, registry, deps.catalog),
      }),
    ),
  }

  deps.onDispatch?.(report)
  cache.set(submissionId, outcome)
  return outcome
}

/**
 * Los frenos, en la línea del aviso interno. Cuando no hay ninguno se dice con todas las letras:
 * una línea ausente se lee como un fallo de envío, y el comercial no puede distinguir «no le frena
 * nada» de «esto se ha roto» (spec `pregunta-frenos-lead`, CA-3).
 */
function frenosLegibles(blockers: readonly Blocker[]): string {
  if (blockers.length === 0) return 'ninguno — el lead no marcó ninguna opción'
  return blockers.map((b) => BLOCKER_LABEL[b]).join(' · ')
}

/**
 * El aviso de que este lead no está guardado en ninguna parte.
 *
 * Va ARRIBA DEL TODO y sólo cuando falla. Las dos cosas son la decisión: al final se lee tarde, y un
 * aviso que apareciera siempre dejaría de leerse a la tercera vez (`CA-S2`/`CA-S3`, riesgo R-S2).
 */
function avisoDeNoGuardado(): readonly string[] {
  return [
    '⚠️  ESTE LEAD NO ha quedado guardado en el registro. Este correo es la ÚNICA copia:',
    '    guárdalo o pásalo al CRM a mano antes de archivarlo.',
    '',
  ]
}

/**
 * Aviso al equipo de que esta cifra NO se calculó con el catálogo vivo.
 *
 * Va arriba del todo y sin rodeos. La lección es la misma que dejó el registro de leads: un
 * repliegue que no se nota no existe hasta que cuesta caro, y aquí lo que está en juego es una
 * cifra con el membrete de Nexus calculada con precios que pueden tener meses (CA-06).
 *
 * El lead NUNCA ve nada de esto (constitution 11): recibe su rango con normalidad.
 */
function avisoDeSinCatálogo(): string[] {
  return [
    '🛑 NO SE PUDO CALCULAR: no había catálogo vivo NI foto utilizable en el momento del envío.',
    '    Este lead está guardado con todas sus respuestas, pero SIN servicio, SIN rango y SIN',
    '    puntuación. Hay que calcularlo a mano y llamar. Y hay que mirar por qué falló la foto:',
    '    la publicación debería haber fallado antes de dejar el sitio sin respaldo (CA-08).',
    '',
  ]
}

function avisoDeFoto(takenAt: string): string[] {
  return [
    '⚠️  ESTA CIFRA SE CALCULÓ CON LA FOTO DEL CATÁLOGO, NO CON EL CATÁLOGO VIVO.',
    `    Procedencia de la foto: ${takenAt}. Si desde entonces se ha cambiado algún precio, esta`,
    '    estimación NO lo refleja. Contrástala antes de usarla en una conversación comercial.',
    '',
  ]
}

/** El aviso interno sin desglose es inservible (CA-16). */
export function buildInternalNotice(
  lead: LeadRecord,
  registry: 'ok' | 'failed',
  catalog: LoadedCatalog | null,
): string {
  const líneas = lead.score.breakdown.map((b) => `  - ${b.signal}: ${b.answer} → ${b.points > 0 ? '+' : ''}${b.points}`)
  return [
    ...(catalog === null ? avisoDeSinCatálogo() : []),
    ...(catalog?.source === 'snapshot' ? avisoDeFoto(catalog.takenAt) : []),
    ...(registry === 'failed' ? avisoDeNoGuardado() : []),
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
    `Frenos declarados: ${frenosLegibles(lead.blockers)}`,
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
