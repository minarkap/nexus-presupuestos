import type { Catalog } from './catalog-types'

/**
 * EL CATÁLOGO SEMILLA — los valores de la edición 2026, congelados en el código.
 *
 * Cumple dos papeles y conviene no confundirlos:
 *
 *  1. **Semilla de la base de datos.** Es de aquí de donde se siembra `catalogo_servicios` y sus
 *     tres tablas hermanas, nunca tecleando a mano. Un dígito mal copiado produce rangos
 *     equivocados con el membrete de Nexus, que es el peor fallo posible de este proyecto
 *     (riesgo R-1 del plan).
 *  2. **Respaldo de última instancia.** Si no hay catálogo vivo Y tampoco foto utilizable, es
 *     esto lo que queda. En ese caso el aviso interno lo declara.
 *
 * Lo que NO es: la fuente de verdad. Desde la spec `catalogo-en-supabase` la fuente de verdad es
 * la base de datos, y cambiar un precio aquí no cambia nada en producción.
 *
 * Fuente comercial: `02-DOCS/wiki/comercial/Catalogo de Servicios y Rangos 2026.md`.
 * Caduca el 2026-12-31 (constitution 10).
 */
export const SEED_CATALOG: Catalog = {
  services: {
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
      // Siempre cuota mensual, nunca importe total. Es la particularidad del catálogo que más
      // fácil se pierde en una mudanza, y por eso viaja como dato y no como convención.
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
      // Sin techo publicable: se rotula «a confirmar en llamada de alcance». Un nulo aquí es un
      // dato VÁLIDO, no un dato incompleto — la validación tiene que distinguirlo.
      officialMax: null,
      unit: 'total',
      openEnded: true,
    },
  },

  sizeFactor: {
    '<50': 0.8,
    '50-249': 0.9,
    '250-999': 1.05,
    '>=1000': 1.25,
  },
  maturityFactor: {
    inicial: 1.15,
    en_desarrollo: 1.0,
    avanzada: 0.9,
  },
  timingFactor: {
    '<3m': 1.15,
    '3-6m': 1.0,
    '>6m': 0.95,
  },

  sponsorPoints: {
    si: 3,
    en_proceso: 1,
    no: 0,
  },
  budgetPoints: {
    asignado: 3,
    previsto: 2,
    sin: 0,
  },
  // La urgencia RESTA. Es la única señal contraintuitiva del sistema y no se «arregla»:
  // encarece la estimación y baja la puntuación a la vez.
  timingPoints: {
    '<3m': -1,
    '3-6m': 2,
    '>6m': 1,
  },
  maturityPoints: {
    inicial: 0,
    en_desarrollo: 1,
    avanzada: 1,
  },
  sizePoints: {
    '<50': 0,
    '50-249': 0,
    '250-999': 1,
    '>=1000': 1,
  },

  threshold: 6,
  maxScore: 10,
  margin: 0.12,
  roundingStep: 1000,
  expiresOn: '2026-12-31',
}
