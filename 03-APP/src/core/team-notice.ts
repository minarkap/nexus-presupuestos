import type { LeadRecord } from './types'

/**
 * Cómo acabó el aviso al equipo. `not_configured` no es un fallo de red: es que no hay a dónde
 * mandarlo. El correo interno lo declara igual (CA-09), porque desde fuera las dos cosas se ven
 * idénticas: el canal no se entera del lead.
 */
export type TeamNoticeResult = 'ok' | 'failed' | 'not_configured'

/**
 * El aviso de un lead, versión 1. Contrato compartido con n8n W1:
 * `01-TOOLS/N8N/contracts/lead-notice.v1.schema.json`. Cambiar un campo es cambiar de versión.
 */
export interface LeadNoticeV1 {
  readonly version: 1
  readonly submission_id: string
  readonly submitted_at: string
  readonly contact: { readonly name: string; readonly email: string; readonly company: string }
  readonly service_label: string | null
  readonly range_text: string | null
  readonly score: {
    readonly total: number
    readonly breakdown: readonly { readonly signal: string; readonly answer: string; readonly points: number }[]
  }
  readonly outcome_kind: LeadRecord['outcomeKind']
  readonly booking_offered: boolean
  readonly client_email: 'ok' | 'failed'
  readonly registry: 'ok' | 'failed'
}

/**
 * Construye el aviso a partir del lead YA decidido. `booking_offered` es el veredicto que se guardó,
 * no una comparación nueva con el umbral (constitution 9). Solo lleva lo que el contrato pide: ni el
 * consentimiento, ni las respuestas, ni los frenos —esos siguen en el correo interno—.
 */
export function buildLeadNotice(
  lead: LeadRecord,
  report: { readonly registry: 'ok' | 'failed'; readonly clientEmail: 'ok' | 'failed' },
): LeadNoticeV1 {
  return {
    version: 1,
    submission_id: lead.submissionId,
    submitted_at: lead.submittedAt,
    contact: { name: lead.contact.name, email: lead.contact.email, company: lead.contact.company },
    service_label: lead.serviceLabel,
    range_text: lead.rangeText,
    score: {
      total: lead.score.total,
      breakdown: lead.score.breakdown.map((b) => ({ signal: b.signal, answer: b.answer, points: b.points })),
    },
    outcome_kind: lead.outcomeKind,
    booking_offered: lead.bookingOffered,
    client_email: report.clientEmail,
    registry: report.registry,
  }
}
