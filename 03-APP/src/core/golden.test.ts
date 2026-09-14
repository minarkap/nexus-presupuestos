import { describe, it, expect } from 'vitest'
import { SEED_CATALOG } from './catalog-seed'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { mapOutcome } from './outcome'
import { priceService } from './pricing'
import { resolveService } from './service-resolver'
import { scoreLead } from './scoring'
import type {
  BudgetAnswer,
  Challenge,
  Maturity,
  Need,
  Size,
  Sponsor,
  Timing,
} from './types'

/**
 * FICHERO DORADO — la única prueba de que la mudanza del catálogo a la base de datos
 * no cambió ni una cifra (spec `catalogo-en-supabase`, CA-11; plan §5, riesgo R-1).
 *
 * Se generó el 2026-09-14 desde el código ANTERIOR a la mudanza, cuando el catálogo todavía
 * vivía en constantes de `src/core/catalog.ts`. A partir de ese momento es inmutable: si esta
 * prueba se pone roja, la mudanza cambió un resultado, y eso es un fallo y no una tolerancia.
 *
 * Por qué existe: comparar el código nuevo consigo mismo no demuestra nada. Una vez tocado
 * `catalog.ts` ya no hay forma de volver a generarlo desde «el código de antes», así que este
 * fichero es irrepetible — por eso se generó primero, antes de cualquier otro cambio.
 *
 * Regenerarlo es, por tanto, casi siempre un error. Si un cambio de precio DELIBERADO obliga a
 * ello, se hace con `GOLDEN_WRITE=1 npx vitest run src/core/golden.test.ts` y se explica en el
 * mensaje del commit por qué la cifra cambió. Borrar la prueba nunca es la respuesta.
 */

const CHALLENGES: Challenge[] = ['ia', 'ciberseguridad', 'esg', 'estrategia_operaciones']
const NEEDS: (Need | null)[] = [null, 'diagnostico', 'implantacion', 'acompanamiento', 'desarrollo']
const SIZES: Size[] = ['<50', '50-249', '250-999', '>=1000']
const MATURITIES: Maturity[] = ['inicial', 'en_desarrollo', 'avanzada']
const TIMINGS: Timing[] = ['<3m', '3-6m', '>6m']
const SPONSORS: Sponsor[] = ['si', 'en_proceso', 'no']
const BUDGETS: BudgetAnswer[] = ['asignado', 'previsto', 'sin']

const RUTA = join(__dirname, '__golden__', 'antes-de-la-mudanza.json')

/**
 * Recorre el espacio COMPLETO de respuestas y aplana cada resultado observable a una línea.
 *
 * Se guarda todo lo que el sistema decide —servicio, extremos del rango, unidad, puntuación,
 * desenlace y si se ofrece agenda—, no sólo el rango: una mudanza que conservara los precios y
 * moviera el umbral seguiría siendo un cambio de comportamiento, y el dorado tiene que verlo.
 */
function recorrerTodo(): Record<string, string> {
  const salida: Record<string, string> = {}

  for (const challenge of CHALLENGES) {
    for (const need of NEEDS) {
      for (const size of SIZES) {
        for (const maturity of MATURITIES) {
          for (const timing of TIMINGS) {
            for (const sponsor of SPONSORS) {
              for (const budget of BUDGETS) {
                const resolution = resolveService(SEED_CATALOG, challenge, need)
                const service = resolution.kind === 'service' ? resolution.service : null
                const price = service ? priceService(SEED_CATALOG, service, size, maturity, timing) : null
                const score = scoreLead(SEED_CATALOG, { challenge, need, size, maturity, timing, sponsor, budget })
                const outcome = mapOutcome(SEED_CATALOG, service, price, score)

                const clave = [challenge, need ?? '—', size, maturity, timing, sponsor, budget].join('|')
                salida[clave] = [
                  service?.id ?? '—',
                  price?.low ?? '—',
                  price?.high ?? '—',
                  price?.unit ?? '—',
                  score.total,
                  outcome.kind,
                  outcome.showCalendar ? 'agenda' : 'sin-agenda',
                  outcome.rangeText ?? '—',
                ].join('|')
              }
            }
          }
        }
      }
    }
  }

  return salida
}

describe('Fichero dorado — la mudanza del catálogo no cambia ni un resultado (CA-11)', () => {
  const actual = recorrerTodo()

  if (process.env.GOLDEN_WRITE === '1') {
    it('REGENERA el dorado (GOLDEN_WRITE=1) — no debería correr en una pasada normal', () => {
      writeFileSync(RUTA, `${JSON.stringify(actual, null, 0)}\n`, 'utf8')
      expect(Object.keys(actual).length).toBeGreaterThan(0)
    })
    return
  }

  it('recorre el espacio completo de respuestas', () => {
    // 4 retos × 5 necesidades × 4 tamaños × 3 madureces × 3 plazos × 3 patrocinios × 3 presupuestos
    expect(Object.keys(actual).length).toBe(4 * 5 * 4 * 3 * 3 * 3 * 3)
  })

  it('cada combinación da exactamente el mismo resultado que antes de la mudanza', () => {
    const dorado = JSON.parse(readFileSync(RUTA, 'utf8')) as Record<string, string>

    const divergencias: string[] = []
    for (const [clave, esperado] of Object.entries(dorado)) {
      const obtenido = actual[clave]
      if (obtenido !== esperado) divergencias.push(`${clave}\n    antes: ${esperado}\n    ahora: ${obtenido}`)
    }
    for (const clave of Object.keys(actual)) {
      if (!(clave in dorado)) divergencias.push(`${clave}: combinación NUEVA, no existía antes`)
    }

    // Se enseñan como mucho diez: una lista de seis mil líneas no se lee, y con diez ya se ve el patrón.
    expect(divergencias.slice(0, 10)).toEqual([])
    expect(divergencias.length).toBe(0)
  })
})
