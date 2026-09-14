import type { Catalog } from './catalog-types'
import type { Challenge, Need, ServiceId, ServiceRef, Uncatalogued } from './types'

export type ServiceResolution = { kind: 'service'; service: ServiceRef } | Uncatalogued

const UNCATALOGUED: Uncatalogued = { kind: 'uncatalogued' }

/**
 * El MAPA de respuestas a servicios, que es código y no catálogo.
 *
 * Aquí viven identificadores, no servicios: qué reto lleva a qué línea es una decisión de producto
 * y vive en el código; cuánto cuesta esa línea es catálogo y vive en la base de datos. Por eso
 * retirar un servicio del catálogo **no es un cambio de precio**: dejaría a un reto apuntando al
 * vacío, y por eso la base lo rechaza (spec `catalogo-en-supabase`, CA-12, clarify C-5).
 */
const IA_BY_NEED: Readonly<Record<Need, ServiceId>> = {
  diagnostico: 'ai_opportunity_assessment',
  implantacion: 'ai_transformation_program',
  acompanamiento: 'ai_executive_advisory',
  desarrollo: 'custom_ai_solutions',
}

/** Las otras dos líneas catalogadas resuelven a un único servicio, sea cual sea la necesidad. */
const SINGLE_SERVICE: Readonly<Partial<Record<Challenge, ServiceId>>> = {
  ciberseguridad: 'cyber_resilience_assessment',
  esg: 'esg_strategy_compliance',
}

/**
 * Deriva mecánicamente el servicio aplicable. Total: toda combinación resuelve, nunca lanza.
 * `estrategia_operaciones` no tiene catálogo y NUNCA se aproxima por semejanza (constitution 4).
 */
export function resolveService(
  catalog: Catalog,
  challenge: Challenge,
  need: Need | null,
): ServiceResolution {
  if (challenge === 'ia') {
    if (need === null) return UNCATALOGUED
    return { kind: 'service', service: catalog.services[IA_BY_NEED[need]] }
  }

  const single = SINGLE_SERVICE[challenge]
  if (single) return { kind: 'service', service: catalog.services[single] }

  return UNCATALOGUED
}
