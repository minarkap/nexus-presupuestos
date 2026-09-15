import { describe, it, expect } from 'vitest'
import { SEED_CATALOG } from './catalog-seed'
import { resolveService } from './service-resolver'
import type { Challenge, Need } from './types'

describe('ServiceResolver — la línea de IA ramifica por necesidad (CA-07)', () => {
  it.each([
    ['diagnostico', 'ai_opportunity_assessment'],
    ['implantacion', 'ai_transformation_program'],
    ['acompanamiento', 'ai_executive_advisory'],
    ['desarrollo', 'custom_ai_solutions'],
  ] as const)('IA + %s → %s', (need, expected) => {
    const r = resolveService(SEED_CATALOG, 'ia', need)
    expect(r.kind).toBe('service')
    if (r.kind === 'service') expect(r.service.id).toBe(expected)
  })
})

describe('ServiceResolver — las otras líneas resuelven a servicio único (CA-08)', () => {
  it.each([
    ['ciberseguridad', 'cyber_resilience_assessment'],
    ['esg', 'esg_strategy_compliance'],
  ] as const)('%s → %s con cualquier necesidad', (challenge, expected) => {
    const needs: Need[] = ['diagnostico', 'implantacion', 'acompanamiento', 'desarrollo']
    for (const need of needs) {
      const r = resolveService(SEED_CATALOG, challenge, need)
      expect(r.kind).toBe('service')
      if (r.kind === 'service') expect(r.service.id).toBe(expected)
    }
  })

  it('ignora la necesidad aunque venga informada, y también si es null', () => {
    const conNecesidad = resolveService(SEED_CATALOG, 'ciberseguridad', 'desarrollo')
    const sinNecesidad = resolveService(SEED_CATALOG, 'ciberseguridad', null)
    expect(conNecesidad).toEqual(sinNecesidad)
  })
})

describe('ServiceResolver — Estrategia y operaciones no tiene catálogo (CA-09)', () => {
  it('devuelve uncatalogued siempre, con y sin necesidad', () => {
    const needs: (Need | null)[] = [null, 'diagnostico', 'implantacion', 'acompanamiento', 'desarrollo']
    for (const need of needs) {
      expect(resolveService(SEED_CATALOG, 'estrategia_operaciones', need).kind).toBe('uncatalogued')
    }
  })

  it('NUNCA aproxima por semejanza a otro servicio', () => {
    const r = resolveService(SEED_CATALOG, 'estrategia_operaciones', 'diagnostico')
    expect(r).not.toHaveProperty('service')
  })
})

describe('ServiceResolver — totalidad', () => {
  it('resuelve toda combinación sin lanzar', () => {
    const challenges: Challenge[] = ['ia', 'ciberseguridad', 'esg', 'estrategia_operaciones']
    const needs: (Need | null)[] = [null, 'diagnostico', 'implantacion', 'acompanamiento', 'desarrollo']
    for (const c of challenges) {
      for (const n of needs) {
        expect(() => resolveService(SEED_CATALOG, c, n)).not.toThrow()
      }
    }
  })

  it('IA sin necesidad declarada no inventa servicio', () => {
    expect(resolveService(SEED_CATALOG, 'ia', null).kind).toBe('uncatalogued')
  })
})
