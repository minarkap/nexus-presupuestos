import type { Blocker, BudgetAnswer, Challenge, Maturity, Need, Size, Sponsor, Timing } from './types'

export interface Option<T> {
  readonly value: T
  readonly label: string
}

/**
 * Las opciones que ve el lead. Redactadas SIN SOLAPE (spec C-03): los tramos heredados
 * del catálogo contenían el 250 y el 6 en dos casillas a la vez.
 * Los factores y puntos NO viven aquí: viven en catalog.ts, que nunca cruza al navegador.
 */

export const CHALLENGE_OPTIONS: readonly Option<Challenge>[] = [
  { value: 'ia', label: 'IA y transformación digital' },
  { value: 'ciberseguridad', label: 'Ciberseguridad' },
  { value: 'esg', label: 'Sostenibilidad y ESG' },
  { value: 'estrategia_operaciones', label: 'Estrategia y operaciones' },
]

export const NEED_OPTIONS: readonly Option<Need>[] = [
  { value: 'diagnostico', label: 'Un diagnóstico' },
  { value: 'implantacion', label: 'Una implantación' },
  { value: 'acompanamiento', label: 'Acompañamiento continuo' },
  { value: 'desarrollo', label: 'Desarrollo a medida' },
]

export const SIZE_OPTIONS: readonly Option<Size>[] = [
  { value: '<50', label: 'Menos de 50' },
  { value: '50-249', label: 'De 50 a 249' },
  { value: '250-999', label: 'De 250 a 999' },
  { value: '>=1000', label: '1.000 o más' },
]

export const MATURITY_OPTIONS: readonly Option<Maturity>[] = [
  { value: 'inicial', label: 'Inicial — todavía sin datos gobernados' },
  { value: 'en_desarrollo', label: 'En desarrollo — hay pilotos en marcha' },
  { value: 'avanzada', label: 'Avanzada — ya hay casos en producción' },
]

export const TIMING_OPTIONS: readonly Option<Timing>[] = [
  { value: '<3m', label: 'Menos de 3 meses' },
  { value: '3-6m', label: 'De 3 a 6 meses' },
  { value: '>6m', label: 'Más de 6 meses' },
]

export const SPONSOR_OPTIONS: readonly Option<Sponsor>[] = [
  {
    value: 'si',
    label: 'Sí: hay una persona del comité de dirección que ya conoce este proyecto y lo respalda',
  },
  {
    value: 'en_proceso',
    label: 'En proceso: hay interés interno, pero todavía nadie de dirección lo ha hecho suyo',
  },
  { value: 'no', label: 'Todavía no: no se ha hablado de esto con dirección' },
]

export const BUDGET_OPTIONS: readonly Option<BudgetAnswer>[] = [
  { value: 'asignado', label: 'Asignado y aprobado' },
  { value: 'previsto', label: 'Hay partida prevista, sin cerrar' },
  { value: 'sin', label: 'Todavía sin presupuesto' },
]

/**
 * Frenos declarados. Lista cerrada y sin «otro»: el texto libre no se puede contar ni comparar
 * entre leads, y abre una entrada de datos personales que nadie ha previsto.
 *
 * No incluye «el presupuesto no está aprobado» ni «resistencia interna al cambio», que venían en el
 * encargo: las preguntas 6 y 7 ya los preguntan y SÍ puntúan, así que repetirlos aquí permitía que
 * un mismo lead afirmase y negase el mismo hecho en dos pantallas (spec `pregunta-frenos-lead`).
 */
export const BLOCKER_OPTIONS: readonly Option<Blocker>[] = [
  { value: 'sin_perfiles', label: 'No tenemos perfiles técnicos' },
  { value: 'dudas_legales', label: 'Dudas legales o de protección de datos' },
  { value: 'sin_punto_de_partida', label: 'No sabemos por dónde empezar' },
  { value: 'intento_fallido', label: 'Ya lo intentamos y salió mal' },
]

/** Etiqueta legible de un freno, para el aviso interno y el registro. */
export const BLOCKER_LABEL: Readonly<Record<Blocker, string>> = Object.fromEntries(
  BLOCKER_OPTIONS.map((o) => [o.value, o.label]),
) as Readonly<Record<Blocker, string>>

/**
 * Los tramos como PARTICIÓN: toda plantilla cae en exactamente uno.
 * 250 pertenece a «De 250 a 999» y a ningún otro (CA-21).
 */
export function sizeBucketFor(employees: number): Size {
  if (employees < 50) return '<50'
  if (employees <= 249) return '50-249'
  if (employees <= 999) return '250-999'
  return '>=1000'
}

/** 6 meses pertenece a «De 3 a 6 meses» y a ningún otro (CA-22). */
export function timingBucketFor(months: number): Timing {
  if (months < 3) return '<3m'
  if (months <= 6) return '3-6m'
  return '>6m'
}
