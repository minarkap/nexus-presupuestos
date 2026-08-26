import {
  BUDGET_POINTS,
  MATURITY_POINTS,
  MAX_SCORE,
  SIZE_POINTS,
  SPONSOR_POINTS,
  TIMING_POINTS,
} from './catalog'
import type { BusinessAnswers, Score, SignalContribution } from './types'

/** Etiquetas legibles del desglose. Van al aviso interno, nunca al lead. */
const SPONSOR_LABEL: Record<BusinessAnswers['sponsor'], string> = {
  si: 'Identificado y comprometido',
  en_proceso: 'En proceso de identificar',
  no: 'No hay',
}

const BUDGET_LABEL: Record<BusinessAnswers['budget'], string> = {
  asignado: 'Asignado y aprobado',
  previsto: 'Partida prevista, sin cerrar',
  sin: 'Sin presupuesto',
}

const TIMING_LABEL: Record<BusinessAnswers['timing'], string> = {
  '<3m': 'Menos de 3 meses',
  '3-6m': 'De 3 a 6 meses',
  '>6m': 'Más de 6 meses',
}

const MATURITY_LABEL: Record<BusinessAnswers['maturity'], string> = {
  inicial: 'Inicial — sin datos gobernados',
  en_desarrollo: 'En desarrollo — pilotos en marcha',
  avanzada: 'Avanzada — casos en producción',
}

const SIZE_LABEL: Record<BusinessAnswers['size'], string> = {
  '<50': 'Menos de 50',
  '50-249': 'De 50 a 249',
  '250-999': 'De 250 a 999',
  '>=1000': '1.000 o más',
}

/**
 * Puntuación sobre 10 a partir de las señales que da el propio cliente.
 *
 * El desglose NUNCA se omite: sin él el equipo comercial no puede discutir la decisión,
 * y un aviso que sólo diga «5 puntos» es inservible (CA-16).
 *
 * La urgencia resta un punto a propósito. Es la única señal contraintuitiva del sistema
 * y no se «arregla»: encarece la estimación y baja la puntuación a la vez.
 */
export function scoreLead(answers: BusinessAnswers): Score {
  const breakdown: SignalContribution[] = [
    {
      signal: 'sponsor',
      answer: SPONSOR_LABEL[answers.sponsor],
      points: SPONSOR_POINTS[answers.sponsor],
    },
    {
      signal: 'presupuesto',
      answer: BUDGET_LABEL[answers.budget],
      points: BUDGET_POINTS[answers.budget],
    },
    {
      signal: 'plazo',
      answer: TIMING_LABEL[answers.timing],
      points: TIMING_POINTS[answers.timing],
    },
    {
      signal: 'madurez',
      answer: MATURITY_LABEL[answers.maturity],
      points: MATURITY_POINTS[answers.maturity],
    },
    {
      signal: 'tamaño',
      answer: SIZE_LABEL[answers.size],
      points: SIZE_POINTS[answers.size],
    },
  ]

  const raw = breakdown.reduce((acc, b) => acc + b.points, 0)
  const total = Math.min(MAX_SCORE, Math.max(0, raw))

  return { total, breakdown }
}
