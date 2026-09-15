import type {
  BudgetAnswer,
  Maturity,
  ServiceId,
  ServiceRef,
  Size,
  Sponsor,
  Timing,
} from './types'

/**
 * El catálogo comercial COMPLETO, como un dato plano que se pasa de mano en mano.
 *
 * Antes de la spec `catalogo-en-supabase` esto eran doce constantes sueltas importadas
 * directamente por ocho módulos del núcleo. Ahora es un valor: se carga una vez en la frontera de
 * servidor y se inyecta hacia abajo (decisión `S-0034`).
 *
 * La diferencia no es cosmética. Con constantes importadas, dos funciones del mismo cálculo podían
 * acabar leyendo el catálogo en instantes distintos el día que dejara de ser constante. Siendo un
 * parámetro, usar dos catálogos dentro de un mismo cálculo es **imposible de escribir**, que es una
 * garantía distinta de recordar no hacerlo (CA-10).
 *
 * NUNCA debe cruzar al navegador: lleva multiplicadores, tabla de puntos y umbral
 * (constitution 8). Lo sostiene `RedactedOutcome`, que no tiene dónde meterlos.
 */
export interface Catalog {
  /** Los seis servicios catalogados. Siempre los seis: un catálogo incompleto es inválido. */
  readonly services: Readonly<Record<ServiceId, ServiceRef>>

  /** Factores multiplicativos. Como mucho uno de cada bloque entra en un cálculo. */
  readonly sizeFactor: Readonly<Record<Size, number>>
  readonly maturityFactor: Readonly<Record<Maturity, number>>
  readonly timingFactor: Readonly<Record<Timing, number>>

  /** Tabla de puntos. La urgencia resta a propósito; no es un error de signo. */
  readonly sponsorPoints: Readonly<Record<Sponsor, number>>
  readonly budgetPoints: Readonly<Record<BudgetAnswer, number>>
  readonly timingPoints: Readonly<Record<Timing, number>>
  readonly maturityPoints: Readonly<Record<Maturity, number>>
  readonly sizePoints: Readonly<Record<Size, number>>

  /** Umbral de cualificación. Único punto de configuración (constitution 9). */
  readonly threshold: number
  readonly maxScore: number

  /** Margen del rango entregado y paso de redondeo. */
  readonly margin: number
  readonly roundingStep: number

  /**
   * Fecha de caducidad del catálogo. DECORATIVA a propósito: viaja con el catálogo y no
   * desencadena nada (spec `catalogo-en-supabase` §Non-goals). Que tenga consecuencias es una
   * función nueva y merece su propio ciclo.
   */
  readonly expiresOn: string
}

/**
 * Un catálogo con su procedencia. Es lo que viaja por la aplicación, no el catálogo pelado.
 *
 * La procedencia existe para que el aviso interno pueda declarar «esta cifra se calculó con la foto
 * del 1 de septiembre» (CA-06). Un repliegue que no se nota no existe hasta que cuesta caro: es la
 * misma lección que dejó el registro de leads.
 *
 * Llega al equipo comercial y **jamás** al lead (constitution 11).
 */
export type LoadedCatalog =
  | { readonly catalog: Catalog; readonly source: 'live' }
  | {
      readonly catalog: Catalog
      readonly source: 'snapshot'
      /** Cuándo se tomó la foto, en ISO. Es lo que el aviso interno enseña. */
      readonly takenAt: string
      /** Por qué se recurrió a ella. Va al log del servidor, no al correo. */
      readonly reason: string
    }
