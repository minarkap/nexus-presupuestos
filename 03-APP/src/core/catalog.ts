import type {
  BudgetAnswer,
  Maturity,
  ServiceRef,
  Size,
  Sponsor,
  Timing,
} from './types'

/**
 * Fuente única de los datos comerciales internos (constitution 9, 10).
 * NUNCA debe importarse desde un componente marcado 'use client'.
 * Caduca el 2026-12-31: son datos con fecha, no constantes.
 */

export const EXPIRES_ON = '2026-12-31' as const

/** Umbral de cualificación. Único punto de configuración (constitution 9, CA-13). */
export const QUALIFICATION_THRESHOLD = 6

/** Margen del rango entregado y paso de redondeo (plan §0). */
export const MARGIN_PCT = 0.12
export const ROUNDING_STEP = 1000

export const SERVICES: Readonly<Record<ServiceRef['id'], ServiceRef>> = {
  ai_opportunity_assessment: {
    id: 'ai_opportunity_assessment',
    label: 'AI Opportunity Assessment',
    officialMin: 18000,
    officialMax: 35000,
    unit: 'total',
    openEnded: false,
  },
  ai_transformation_program: {
    id: 'ai_transformation_program',
    label: 'AI Transformation Program',
    officialMin: 90000,
    officialMax: 350000,
    unit: 'total',
    openEnded: false,
  },
  ai_executive_advisory: {
    id: 'ai_executive_advisory',
    label: 'AI Executive Advisory',
    officialMin: 6000,
    officialMax: 15000,
    unit: 'month',
    openEnded: false,
  },
  cyber_resilience_assessment: {
    id: 'cyber_resilience_assessment',
    label: 'Cyber Resilience Assessment',
    officialMin: 20000,
    officialMax: 60000,
    unit: 'total',
    openEnded: false,
  },
  esg_strategy_compliance: {
    id: 'esg_strategy_compliance',
    label: 'ESG Strategy & Compliance',
    officialMin: 25000,
    officialMax: 80000,
    unit: 'total',
    openEnded: false,
  },
  custom_ai_solutions: {
    id: 'custom_ai_solutions',
    label: 'Custom AI Solutions',
    officialMin: 40000,
    officialMax: null,
    unit: 'total',
    openEnded: true,
  },
}

/** Factores multiplicativos. Como mucho uno por bloque (plan §0). */
export const SIZE_FACTOR: Readonly<Record<Size, number>> = {
  '<50': 0.8,
  '50-249': 0.9,
  '250-999': 1.05,
  '>=1000': 1.25,
}

export const MATURITY_FACTOR: Readonly<Record<Maturity, number>> = {
  inicial: 1.15,
  en_desarrollo: 1.0,
  avanzada: 0.9,
}

export const TIMING_FACTOR: Readonly<Record<Timing, number>> = {
  '<3m': 1.15,
  '3-6m': 1.0,
  '>6m': 0.95,
}

/** Tabla de puntos. La urgencia resta a propósito (spec §El cálculo). */
export const SPONSOR_POINTS: Readonly<Record<Sponsor, number>> = {
  si: 3,
  en_proceso: 1,
  no: 0,
}

export const BUDGET_POINTS: Readonly<Record<BudgetAnswer, number>> = {
  asignado: 3,
  previsto: 2,
  sin: 0,
}

export const TIMING_POINTS: Readonly<Record<Timing, number>> = {
  '<3m': -1,
  '3-6m': 2,
  '>6m': 1,
}

export const MATURITY_POINTS: Readonly<Record<Maturity, number>> = {
  inicial: 0,
  en_desarrollo: 1,
  avanzada: 1,
}

export const SIZE_POINTS: Readonly<Record<Size, number>> = {
  '<50': 0,
  '50-249': 0,
  '250-999': 1,
  '>=1000': 1,
}

export const MAX_SCORE = 10
