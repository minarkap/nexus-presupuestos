import { describe, it, expect } from 'vitest'
import {
  EXPIRES_ON,
  QUALIFICATION_THRESHOLD,
  SERVICES,
  SIZE_FACTOR,
  MATURITY_FACTOR,
  TIMING_FACTOR,
  SPONSOR_POINTS,
  BUDGET_POINTS,
  TIMING_POINTS,
} from './catalog'

describe('CatalogConfig — los seis rangos oficiales 2026', () => {
  it('tiene exactamente seis servicios catalogados', () => {
    expect(Object.keys(SERVICES)).toHaveLength(6)
  })

  it.each([
    ['ai_opportunity_assessment', 18000, 35000, 'total', false],
    ['ai_transformation_program', 90000, 350000, 'total', false],
    ['ai_executive_advisory', 6000, 15000, 'month', false],
    ['cyber_resilience_assessment', 20000, 60000, 'total', false],
    ['esg_strategy_compliance', 25000, 80000, 'total', false],
    ['custom_ai_solutions', 40000, null, 'total', true],
  ] as const)('%s → %i–%s (%s, abierto=%s)', (id, min, max, unit, openEnded) => {
    const s = SERVICES[id]
    expect(s.officialMin).toBe(min)
    expect(s.officialMax).toBe(max)
    expect(s.unit).toBe(unit)
    expect(s.openEnded).toBe(openEnded)
  })

  it('sólo Custom AI Solutions tiene rango abierto por arriba', () => {
    const abiertos = Object.values(SERVICES).filter((s) => s.openEnded)
    expect(abiertos.map((s) => s.id)).toEqual(['custom_ai_solutions'])
  })

  it('sólo AI Executive Advisory se expresa como cuota mensual', () => {
    const mensuales = Object.values(SERVICES).filter((s) => s.unit === 'month')
    expect(mensuales.map((s) => s.id)).toEqual(['ai_executive_advisory'])
  })
})

describe('CatalogConfig — umbral y caducidad', () => {
  it('el umbral vigente es 6', () => {
    expect(QUALIFICATION_THRESHOLD).toBe(6)
  })

  it('caduca el 31 de diciembre de 2026', () => {
    expect(EXPIRES_ON).toBe('2026-12-31')
  })
})

describe('CatalogConfig — factores y puntos', () => {
  it('los factores de tamaño son los del método', () => {
    expect(SIZE_FACTOR).toEqual({ '<50': 0.8, '50-249': 0.9, '250-999': 1.05, '>=1000': 1.25 })
  })

  it('la madurez inicial encarece y la avanzada abarata', () => {
    expect(MATURITY_FACTOR.inicial).toBeGreaterThan(1)
    expect(MATURITY_FACTOR.avanzada).toBeLessThan(1)
  })

  it('la urgencia encarece la estimación', () => {
    expect(TIMING_FACTOR['<3m']).toBe(1.15)
  })

  it('la urgencia RESTA un punto, a propósito', () => {
    expect(TIMING_POINTS['<3m']).toBe(-1)
  })

  it('sponsor y presupuesto pesan 6 de los 10 puntos', () => {
    expect(SPONSOR_POINTS.si + BUDGET_POINTS.asignado).toBe(6)
  })
})
