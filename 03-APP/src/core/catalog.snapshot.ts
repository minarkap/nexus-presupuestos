// ─────────────────────────────────────────────────────────────────────────────
// FICHERO GENERADO — no editar a mano.
// Lo escribe `scripts/snapshot-catalog.ts` en cada publicación (`prebuild`).
//
// Es la FOTO del catálogo: lo que se usa para calcular cuando la base de datos no responde,
// no valida o tarda más de la cuenta. El aviso interno de cada lead declara que se usó y de
// cuándo es (spec `catalogo-en-supabase`, CA-06).
//
// Procedencia de esta foto: semilla del código (sin credenciales)
// ─────────────────────────────────────────────────────────────────────────────

// Lleva multiplicadores, tabla de puntos y umbral: no puede cruzar al navegador (constitution 8).
import 'server-only'
import type { CatalogSnapshot } from '@/ports/catalog'

export const CATALOG_SNAPSHOT: CatalogSnapshot = {
  takenAt: "semilla del código (sin fecha de toma)",
  catalog: {
    "services": {
      "ai_opportunity_assessment": {
        "id": "ai_opportunity_assessment",
        "label": "AI Opportunity Assessment",
        "officialMin": 18000,
        "officialMax": 35000,
        "unit": "total",
        "openEnded": false
      },
      "ai_transformation_program": {
        "id": "ai_transformation_program",
        "label": "AI Transformation Program",
        "officialMin": 90000,
        "officialMax": 350000,
        "unit": "total",
        "openEnded": false
      },
      "ai_executive_advisory": {
        "id": "ai_executive_advisory",
        "label": "AI Executive Advisory",
        "officialMin": 6000,
        "officialMax": 15000,
        "unit": "month",
        "openEnded": false
      },
      "cyber_resilience_assessment": {
        "id": "cyber_resilience_assessment",
        "label": "Cyber Resilience Assessment",
        "officialMin": 20000,
        "officialMax": 60000,
        "unit": "total",
        "openEnded": false
      },
      "esg_strategy_compliance": {
        "id": "esg_strategy_compliance",
        "label": "ESG Strategy & Compliance",
        "officialMin": 25000,
        "officialMax": 80000,
        "unit": "total",
        "openEnded": false
      },
      "custom_ai_solutions": {
        "id": "custom_ai_solutions",
        "label": "Custom AI Solutions",
        "officialMin": 40000,
        "officialMax": null,
        "unit": "total",
        "openEnded": true
      }
    },
    "sizeFactor": {
      "<50": 0.8,
      "50-249": 0.9,
      "250-999": 1.05,
      ">=1000": 1.25
    },
    "maturityFactor": {
      "inicial": 1.15,
      "en_desarrollo": 1,
      "avanzada": 0.9
    },
    "timingFactor": {
      "<3m": 1.15,
      "3-6m": 1,
      ">6m": 0.95
    },
    "sponsorPoints": {
      "si": 3,
      "en_proceso": 1,
      "no": 0
    },
    "budgetPoints": {
      "asignado": 3,
      "previsto": 2,
      "sin": 0
    },
    "timingPoints": {
      "<3m": -1,
      "3-6m": 2,
      ">6m": 1
    },
    "maturityPoints": {
      "inicial": 0,
      "en_desarrollo": 1,
      "avanzada": 1
    },
    "sizePoints": {
      "<50": 0,
      "50-249": 0,
      "250-999": 1,
      ">=1000": 1
    },
    "threshold": 6,
    "maxScore": 10,
    "margin": 0.12,
    "roundingStep": 1000,
    "expiresOn": "2026-12-31"
  },
}
