import { describe, it, expect } from 'vitest'
import { SEED_CATALOG } from './catalog-seed'
import { priceService } from './pricing'

describe('PricingEngine — el caso de referencia del catálogo (CA-01)', () => {
  it('600 empleados, madurez inicial, arranque en 4 meses, diagnóstico de IA → 28.000 – 35.000 €', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_opportunity_assessment, '250-999', 'inicial', '3-6m')
    expect(r.low).toBe(28000)
    expect(r.high).toBe(35000)
    expect(r.unit).toBe('total')
  })
})

describe('PricingEngine — el anclaje se aplica DOS veces (CA-02)', () => {
  it('los factores no pueden empujar la cifra por encima del techo oficial', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_opportunity_assessment, '>=1000', 'inicial', '<3m')
    expect(r.high).toBe(35000)
    expect(r.high!).toBeLessThanOrEqual(SEED_CATALOG.services.ai_opportunity_assessment.officialMax!)
  })

  it('el redondeo del extremo inferior no puede bajar del suelo oficial', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_opportunity_assessment, '<50', 'avanzada', '>6m')
    expect(r.low).toBe(18000)
    expect(r.low).toBeGreaterThanOrEqual(SEED_CATALOG.services.ai_opportunity_assessment.officialMin)
  })

  it('devuelve siempre low <= high cuando hay techo', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.esg_strategy_compliance, '50-249', 'en_desarrollo', '3-6m')
    expect(r.low).toBeLessThanOrEqual(r.high!)
  })
})

describe('PricingEngine — rango abierto por arriba (CA-03)', () => {
  it('Custom AI Solutions no publica techo', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.custom_ai_solutions, '250-999', 'inicial', '3-6m')
    expect(r.high).toBeNull()
  })

  it('parte del mínimo, no de un punto medio inexistente, y nunca baja de él', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.custom_ai_solutions, '<50', 'avanzada', '>6m')
    expect(r.low).toBe(40000)
  })
})

describe('PricingEngine — cuota mensual (CA-04)', () => {
  it('AI Executive Advisory se expresa en €/mes', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_executive_advisory, '250-999', 'inicial', '3-6m')
    expect(r.unit).toBe('month')
  })

  it('la cuota mensual también respeta su rango oficial', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_executive_advisory, '<50', 'avanzada', '>6m')
    expect(r.low).toBeGreaterThanOrEqual(6000)
    expect(r.high!).toBeLessThanOrEqual(15000)
  })
})

describe('PricingEngine — bordes de los tramos (CA-21, CA-22)', () => {
  it('el tramo «De 250 a 999» encarece un 5 %', () => {
    const conTramo250 = priceService(SEED_CATALOG, SEED_CATALOG.services.cyber_resilience_assessment, '250-999', 'en_desarrollo', '3-6m')
    const conTramo50 = priceService(SEED_CATALOG, SEED_CATALOG.services.cyber_resilience_assessment, '50-249', 'en_desarrollo', '3-6m')
    expect(conTramo250.low).toBeGreaterThan(conTramo50.low)
  })

  it('el tramo «De 3 a 6 meses» es neutro: no encarece ni abarata', () => {
    const neutro = priceService(SEED_CATALOG, SEED_CATALOG.services.cyber_resilience_assessment, '250-999', 'en_desarrollo', '3-6m')
    const urgente = priceService(SEED_CATALOG, SEED_CATALOG.services.cyber_resilience_assessment, '250-999', 'en_desarrollo', '<3m')
    const holgado = priceService(SEED_CATALOG, SEED_CATALOG.services.cyber_resilience_assessment, '250-999', 'en_desarrollo', '>6m')
    expect(urgente.low).toBeGreaterThan(neutro.low)
    expect(holgado.low).toBeLessThan(neutro.low)
  })
})

describe('PricingEngine — determinismo y redondeo', () => {
  it('mismas entradas producen el mismo resultado', () => {
    const a = priceService(SEED_CATALOG, SEED_CATALOG.services.esg_strategy_compliance, '250-999', 'inicial', '<3m')
    const b = priceService(SEED_CATALOG, SEED_CATALOG.services.esg_strategy_compliance, '250-999', 'inicial', '<3m')
    expect(a).toEqual(b)
  })

  it('ambos extremos caen en millares exactos', () => {
    const r = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_transformation_program, '250-999', 'inicial', '3-6m')
    expect(r.low % 1000).toBe(0)
    expect(r.high! % 1000).toBe(0)
  })
})
