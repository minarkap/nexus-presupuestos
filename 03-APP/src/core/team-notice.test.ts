import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildLeadNotice } from './team-notice'
import type { LeadRecord } from './types'

const lead: LeadRecord = {
  submissionId: 'env-9',
  submittedAt: '2026-09-30T10:00:00.000Z',
  contact: { name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme', consent: true },
  answers: {
    challenge: 'ia', need: 'diagnostico', size: '250-999', maturity: 'inicial',
    timing: '3-6m', sponsor: 'si', budget: 'asignado',
  },
  serviceLabel: 'AI Opportunity Assessment',
  rangeText: '28.000 – 35.000 €',
  blockers: [],
  outcomeKind: 'qualified', bookingOffered: true, privacyVersion: '2026-09-02', researchAllowed: false,
  score: { total: 9, breakdown: [{ signal: 'sponsor', answer: 'Identificado y comprometido', points: 3 }, { signal: 'plazo', answer: 'En menos de 3 meses', points: -1 }] },
}

/**
 * El contrato vive FUERA de la web (`01-TOOLS/N8N/contracts/`), porque lo leen los dos lados. Esta
 * prueba es la que ata la web a él: si alguien añade, quita o renombra un campo del aviso sin cambiar
 * de versión, falla aquí y no en producción a las tres de la mañana.
 */
const esquema = JSON.parse(readFileSync(join(__dirname, '../../../01-TOOLS/N8N/contracts/lead-notice.v1.schema.json'), 'utf8')) as Esquema

type Esquema = {
  type?: string | string[]; const?: unknown; enum?: unknown[]; required?: string[]
  additionalProperties?: boolean; properties?: Record<string, Esquema>; items?: Esquema
}

/** Validador mínimo para el subconjunto de JSON Schema que usa el contrato. Sin dependencias nuevas. */
function validar(s: Esquema, v: unknown, ruta = '$'): string[] {
  const errores: string[] = []
  const tipoDe = (x: unknown) => (x === null ? 'null' : Array.isArray(x) ? 'array' : Number.isInteger(x) ? 'integer' : typeof x)
  if (s.const !== undefined && v !== s.const) errores.push(`${ruta}: debe valer ${JSON.stringify(s.const)}`)
  if (s.enum && !s.enum.includes(v)) errores.push(`${ruta}: ${JSON.stringify(v)} no está en ${JSON.stringify(s.enum)}`)
  if (s.type) {
    const tipos = Array.isArray(s.type) ? s.type : [s.type]
    const t = tipoDe(v)
    if (!tipos.includes(t) && !(t === 'integer' && tipos.includes('number'))) errores.push(`${ruta}: tipo ${t}, se esperaba ${tipos.join('|')}`)
  }
  if (tipoDe(v) === 'object' && s.properties) {
    const o = v as Record<string, unknown>
    for (const r of s.required ?? []) if (!(r in o)) errores.push(`${ruta}.${r}: falta`)
    if (s.additionalProperties === false) for (const k of Object.keys(o)) if (!(k in s.properties)) errores.push(`${ruta}.${k}: no está en el contrato`)
    for (const [k, sub] of Object.entries(s.properties)) if (k in o) errores.push(...validar(sub, o[k], `${ruta}.${k}`))
  }
  if (tipoDe(v) === 'array' && s.items) (v as unknown[]).forEach((x, i) => errores.push(...validar(s.items as Esquema, x, `${ruta}[${i}]`)))
  return errores
}

describe('El validador del contrato sabe fallar (una puerta que nunca se vio fallar no se sabe si funciona)', () => {
  it('detecta un campo que falta, uno que sobra y un enum fuera de rango', () => {
    const malo = { ...buildLeadNotice(lead, { registry: 'ok', clientEmail: 'ok' }), extra: 1, outcome_kind: 'vip' } as Record<string, unknown>
    delete malo['booking_offered']
    const errores = validar(esquema, malo)
    expect(errores.some((e) => e.includes('booking_offered: falta'))).toBe(true)
    expect(errores.some((e) => e.includes('extra: no está en el contrato'))).toBe(true)
    expect(errores.some((e) => e.includes('outcome_kind'))).toBe(true)
  })
})

describe('buildLeadNotice — el aviso cumple el contrato v1 (CA-06)', () => {
  it('un cualificado cumple el esquema sin un solo error', () => {
    expect(validar(esquema, buildLeadNotice(lead, { registry: 'ok', clientEmail: 'ok' }))).toEqual([])
  })

  it('la rama sin cifra (nulos explícitos) también lo cumple', () => {
    const sinCifra: LeadRecord = { ...lead, serviceLabel: null, rangeText: null, outcomeKind: 'uncatalogued' }
    expect(validar(esquema, buildLeadNotice(sinCifra, { registry: 'failed', clientEmail: 'failed' }))).toEqual([])
  })

  it('lleva lo que el equipo necesita para decidir: contacto, servicio, rango, puntuación con desglose y la marca', () => {
    const n = buildLeadNotice(lead, { registry: 'ok', clientEmail: 'failed' })
    expect(n.contact).toEqual({ name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme' })
    expect(n.service_label).toBe('AI Opportunity Assessment')
    expect(n.range_text).toBe('28.000 – 35.000 €')
    expect(n.score.total).toBe(9)
    expect(n.score.breakdown).toHaveLength(2)
    expect(n.booking_offered).toBe(true)
    expect(n.client_email).toBe('failed')
  })

  it('la marca de cualificado es el veredicto guardado, no una comparación nueva con el umbral', () => {
    // Mismo 9/10, pero la web decidió «no ofrecer» (p. ej. umbral subido a 10): el aviso obedece.
    const n = buildLeadNotice({ ...lead, bookingOffered: false, outcomeKind: 'not_qualified' }, { registry: 'ok', clientEmail: 'ok' })
    expect(n.booking_offered).toBe(false)
  })

  it('no manda nada que el contrato no pida: ni el consentimiento, ni las respuestas, ni los frenos', () => {
    const texto = JSON.stringify(buildLeadNotice({ ...lead, blockers: ['sin_perfiles'] }, { registry: 'ok', clientEmail: 'ok' }))
    expect(texto).not.toContain('consent')
    expect(texto).not.toContain('maturity')
    expect(texto).not.toContain('sin_perfiles')
  })
})
