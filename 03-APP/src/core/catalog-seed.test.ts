import { describe, it, expect } from 'vitest'
import {
  BUDGET_POINTS,
  EXPIRES_ON,
  MARGIN_PCT,
  MATURITY_FACTOR,
  MATURITY_POINTS,
  MAX_SCORE,
  QUALIFICATION_THRESHOLD,
  ROUNDING_STEP,
  SERVICES,
  SIZE_FACTOR,
  SIZE_POINTS,
  SPONSOR_POINTS,
  TIMING_FACTOR,
  TIMING_POINTS,
} from './catalog'
import { SEED_CATALOG } from './catalog-seed'

/**
 * PRUEBA DE TRANSCRIPCIÓN — riesgo R-1 del plan `catalogo-en-supabase`.
 *
 * La semilla se escribió a mano copiando doce constantes. Un dígito mal copiado produce rangos
 * equivocados que salen con el membrete de Nexus, y el fichero dorado lo atraparía sólo si la
 * cifra mal copiada llega a afectar a un resultado — un `maxScore` erróneo, por ejemplo, no movería
 * ningún rango y pasaría inadvertido.
 *
 * Esta prueba muere con `catalog.ts`: en cuanto el último consumidor use el catálogo inyectado, ya
 * no habrá dos sitios que comparar, y entonces la que vigila es el dorado.
 */
describe('La semilla transcribe EXACTAMENTE las constantes que sustituye (R-1)', () => {
  it('los seis servicios, campo a campo', () => {
    expect(SEED_CATALOG.services).toEqual(SERVICES)
  })

  it('los tres bloques de factores', () => {
    expect(SEED_CATALOG.sizeFactor).toEqual(SIZE_FACTOR)
    expect(SEED_CATALOG.maturityFactor).toEqual(MATURITY_FACTOR)
    expect(SEED_CATALOG.timingFactor).toEqual(TIMING_FACTOR)
  })

  it('los cinco bloques de la tabla de puntos', () => {
    expect(SEED_CATALOG.sponsorPoints).toEqual(SPONSOR_POINTS)
    expect(SEED_CATALOG.budgetPoints).toEqual(BUDGET_POINTS)
    expect(SEED_CATALOG.timingPoints).toEqual(TIMING_POINTS)
    expect(SEED_CATALOG.maturityPoints).toEqual(MATURITY_POINTS)
    expect(SEED_CATALOG.sizePoints).toEqual(SIZE_POINTS)
  })

  it('los cinco ajustes sueltos, que el dorado NO vigila por sí solo', () => {
    expect(SEED_CATALOG.threshold).toBe(QUALIFICATION_THRESHOLD)
    expect(SEED_CATALOG.maxScore).toBe(MAX_SCORE)
    expect(SEED_CATALOG.margin).toBe(MARGIN_PCT)
    expect(SEED_CATALOG.roundingStep).toBe(ROUNDING_STEP)
    expect(SEED_CATALOG.expiresOn).toBe(EXPIRES_ON)
  })
})
