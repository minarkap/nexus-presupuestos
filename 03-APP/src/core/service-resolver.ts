import { SERVICES } from './catalog'
import type { Challenge, Need, ServiceRef, Uncatalogued } from './types'

export type ServiceResolution = { kind: 'service'; service: ServiceRef } | Uncatalogued

const UNCATALOGUED: Uncatalogued = { kind: 'uncatalogued' }

/** Sólo la línea de IA ramifica por necesidad (catálogo §De la petición al servicio). */
const IA_BY_NEED: Readonly<Record<Need, ServiceRef>> = {
  diagnostico: SERVICES.ai_opportunity_assessment,
  implantacion: SERVICES.ai_transformation_program,
  acompanamiento: SERVICES.ai_executive_advisory,
  desarrollo: SERVICES.custom_ai_solutions,
}

/** Las otras dos líneas catalogadas resuelven a un único servicio, sea cual sea la necesidad. */
const SINGLE_SERVICE: Readonly<Partial<Record<Challenge, ServiceRef>>> = {
  ciberseguridad: SERVICES.cyber_resilience_assessment,
  esg: SERVICES.esg_strategy_compliance,
}

/**
 * Deriva mecánicamente el servicio aplicable. Total: toda combinación resuelve, nunca lanza.
 * `estrategia_operaciones` no tiene catálogo y NUNCA se aproxima por semejanza (constitution 4).
 */
export function resolveService(challenge: Challenge, need: Need | null): ServiceResolution {
  if (challenge === 'ia') {
    if (need === null) return UNCATALOGUED
    return { kind: 'service', service: IA_BY_NEED[need] }
  }

  const single = SINGLE_SERVICE[challenge]
  if (single) return { kind: 'service', service: single }

  return UNCATALOGUED
}
