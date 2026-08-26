import { describe, it, expect } from 'vitest'
import { scoreLead } from './scoring'
import type { BusinessAnswers } from './types'

const base: BusinessAnswers = {
  challenge: 'ia',
  need: 'diagnostico',
  size: '50-249',
  maturity: 'inicial',
  timing: '3-6m',
  sponsor: 'si',
  budget: 'asignado',
}

describe('ScoringEngine — los dos perfiles del spec', () => {
  it('sponsor comprometido (+3), presupuesto asignado (+3), arranque 3-6 meses (+2) → 8 (CA-10)', () => {
    expect(scoreLead(base).total).toBe(8)
  })

  it('sin sponsor, sin presupuesto y arranque urgente → 0, nunca negativo (CA-11)', () => {
    const flojo: BusinessAnswers = { ...base, sponsor: 'no', budget: 'sin', timing: '<3m' }
    expect(scoreLead(flojo).total).toBe(0)
  })
})

describe('ScoringEngine — el desglose es obligatorio (CA-16)', () => {
  it('devuelve una línea por cada señal evaluada, incluidas las que aportan 0', () => {
    const s = scoreLead({ ...base, sponsor: 'no', budget: 'sin' })
    expect(s.breakdown).toHaveLength(5)
    expect(s.breakdown.filter((b) => b.points === 0).length).toBeGreaterThan(0)
  })

  it('nombra las cinco señales del método', () => {
    const señales = scoreLead(base).breakdown.map((b) => b.signal)
    expect(señales).toEqual(['sponsor', 'presupuesto', 'plazo', 'madurez', 'tamaño'])
  })

  it('cada línea lleva la respuesta que la produjo, para poder discutir la decisión', () => {
    const s = scoreLead(base)
    for (const línea of s.breakdown) {
      expect(línea.answer).toBeTruthy()
    }
  })
})

describe('ScoringEngine — la urgencia resta a propósito', () => {
  it('adelantar el arranque a menos de 3 meses BAJA la puntuación', () => {
    const urgente = scoreLead({ ...base, timing: '<3m' })
    const holgado = scoreLead({ ...base, timing: '3-6m' })
    expect(urgente.total).toBeLessThan(holgado.total)
  })

  it('la línea del plazo urgente aparece en negativo en el desglose', () => {
    const s = scoreLead({ ...base, timing: '<3m' })
    expect(s.breakdown.find((b) => b.signal === 'plazo')?.points).toBe(-1)
  })
})

describe('ScoringEngine — invariantes', () => {
  it('el total nunca pasa de 10 ni baja de 0', () => {
    const máximo = scoreLead({ ...base, maturity: 'avanzada', size: '>=1000' })
    expect(máximo.total).toBeLessThanOrEqual(10)
    expect(máximo.total).toBeGreaterThanOrEqual(0)
  })

  it('el total es la suma del desglose, acotada', () => {
    const s = scoreLead(base)
    const suma = s.breakdown.reduce((acc, b) => acc + b.points, 0)
    expect(s.total).toBe(Math.min(10, Math.max(0, suma)))
  })

  it('sponsor y presupuesto valen 6 de los 10 puntos posibles', () => {
    const sinLosDos = scoreLead({ ...base, sponsor: 'no', budget: 'sin' })
    expect(scoreLead(base).total - sinLosDos.total).toBe(6)
  })
})
