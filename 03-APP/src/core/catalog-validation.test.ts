import { describe, it, expect } from 'vitest'
import { validateCatalog } from './catalog-validation'
import { SEED_CATALOG } from './catalog-seed'

/** Copia profunda editable de la semilla, para estropear un campo cada vez. */
function semillaCon(mutar: (c: Record<string, unknown>) => void): unknown {
  const copia = JSON.parse(JSON.stringify(SEED_CATALOG)) as Record<string, unknown>
  mutar(copia)
  return copia
}

/**
 * Acceso a un servicio dentro de la copia editable.
 *
 * Existe porque `noUncheckedIndexedAccess` obliga a tratar cada índice como posiblemente ausente, y
 * salpicar el fichero de `!` escondería justo el fallo que estas pruebas buscan: un servicio que
 * falta. Aquí, si falta, se dice en voz alta.
 */
function svc(c: Record<string, unknown>, id: string): Record<string, unknown> {
  const s = (c.services as Record<string, Record<string, unknown>>)[id]
  if (!s) throw new Error(`la semilla no tiene el servicio ${id}`)
  return s
}

function razónDe(input: unknown): string {
  const r = validateCatalog(input)
  if (r.ok) throw new Error('se esperaba que NO validara, y validó')
  return r.reason
}

describe('validateCatalog — acepta lo bueno', () => {
  it('acepta la semilla y devuelve un catálogo igual', () => {
    const r = validateCatalog(JSON.parse(JSON.stringify(SEED_CATALOG)))
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.catalog).toEqual(SEED_CATALOG)
  })

  it('acepta el rango abierto: techo nulo con openEnded', () => {
    const r = validateCatalog(SEED_CATALOG)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.catalog.services.custom_ai_solutions.officialMax).toBeNull()
  })

  it('convierte los números que Postgres manda como cadena (R-2)', () => {
    const r = validateCatalog(
      semillaCon((c) => {
        svc(c, 'ai_opportunity_assessment').officialMin = '18000'
        ;(c.sizeFactor as Record<string, unknown>)['<50'] = '0.8'
        c.margin = '0.12'
      }),
    )
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.catalog.services.ai_opportunity_assessment.officialMin).toBe(18000)
      expect(r.catalog.sizeFactor['<50']).toBe(0.8)
      expect(r.catalog.margin).toBe(0.12)
    }
  })
})

describe('validateCatalog — rechaza lo imposible (CA-03, CA-04, CA-05, CA-12)', () => {
  it('rechaza lo que ni siquiera es un objeto', () => {
    expect(razónDe(null)).toMatch(/objeto/i)
    expect(razónDe('catálogo')).toMatch(/objeto/i)
    expect(razónDe(42)).toMatch(/objeto/i)
  })

  it('CA-03 — rechaza un mínimo por encima de su máximo', () => {
    const razón = razónDe(
      semillaCon((c) => {
        svc(c, 'ai_opportunity_assessment').officialMin = 99000
      }),
    )
    expect(razón).toMatch(/ai_opportunity_assessment/)
    expect(razón).toMatch(/mínimo/i)
  })

  it('CA-04 — rechaza una cifra negativa en un rango', () => {
    expect(
      razónDe(
        semillaCon((c) => {
          svc(c, 'esg_strategy_compliance').officialMin = -1
        }),
      ),
    ).toMatch(/esg_strategy_compliance/)
  })

  it('CA-04 — rechaza una puntuación negativa fuera de [-10, 10]', () => {
    expect(razónDe(semillaCon((c) => ((c.sponsorPoints as Record<string, unknown>).si = -99)))).toMatch(
      /sponsorPoints/,
    )
  })

  it('CA-05 — rechaza techo nulo sin rango abierto', () => {
    const razón = razónDe(
      semillaCon((c) => {
        svc(c, 'esg_strategy_compliance').officialMax = null
      }),
    )
    expect(razón).toMatch(/esg_strategy_compliance/)
    expect(razón).toMatch(/abierto/i)
  })

  it('CA-05 — rechaza rango abierto CON techo publicado', () => {
    const razón = razónDe(
      semillaCon((c) => {
        svc(c, 'custom_ai_solutions').officialMax = 500000
      }),
    )
    expect(razón).toMatch(/custom_ai_solutions/)
  })

  it('C-2 — rechaza un multiplicador disparatado (50)', () => {
    expect(razónDe(semillaCon((c) => ((c.sizeFactor as Record<string, unknown>)['<50'] = 50)))).toMatch(
      /sizeFactor/,
    )
  })

  it('C-2 — rechaza un multiplicador de cero: anularía el precio en silencio', () => {
    expect(razónDe(semillaCon((c) => ((c.maturityFactor as Record<string, unknown>).inicial = 0)))).toMatch(
      /maturityFactor/,
    )
  })

  it('CA-12 — rechaza un catálogo al que le falta un servicio', () => {
    const razón = razónDe(
      semillaCon((c) => {
        delete (c.services as Record<string, unknown>).cyber_resilience_assessment
      }),
    )
    expect(razón).toMatch(/cyber_resilience_assessment/)
    expect(razón).toMatch(/falta/i)
  })

  it('CA-12 — rechaza un servicio que no está en el catálogo oficial', () => {
    expect(
      razónDe(
        semillaCon((c) => {
          ;(c.services as Record<string, unknown>).consultoria_fiscal = {
            id: 'consultoria_fiscal',
            label: 'Inventado',
            officialMin: 1000,
            officialMax: 2000,
            unit: 'total',
            openEnded: false,
          }
        }),
      ),
    ).toMatch(/consultoria_fiscal/)
  })

  it('rechaza una unidad inventada', () => {
    const razón = razónDe(
      semillaCon((c) => {
        svc(c, 'ai_executive_advisory').unit = 'semana'
      }),
    )
    expect(razón).toMatch(/ai_executive_advisory/)
    expect(razón).toMatch(/unidad/i)
  })

  it('R-2 — rechaza una cadena que no es un número', () => {
    expect(razónDe(semillaCon((c) => (c.margin = 'doce por ciento')))).toMatch(/margin/)
  })

  it('R-2 — rechaza NaN e infinito', () => {
    expect(razónDe(semillaCon((c) => (c.roundingStep = 'NaN')))).toMatch(/roundingStep/)
    expect(razónDe(semillaCon((c) => (c.roundingStep = 'Infinity')))).toMatch(/roundingStep/)
  })

  it('rechaza un umbral por encima de la puntuación máxima: nadie cualificaría jamás', () => {
    expect(razónDe(semillaCon((c) => (c.threshold = 99)))).toMatch(/threshold/)
  })

  it('rechaza que falte un bloque entero de factores', () => {
    expect(razónDe(semillaCon((c) => delete c.timingFactor))).toMatch(/timingFactor/)
  })

  it('rechaza que falte una clave dentro de un bloque', () => {
    expect(
      razónDe(semillaCon((c) => delete (c.sizeFactor as Record<string, unknown>)['>=1000'])),
    ).toMatch(/sizeFactor/)
  })

  it('nunca lanza, pase lo que pase', () => {
    for (const basura of [undefined, [], () => {}, Symbol('x'), { services: 'no' }, new Date()]) {
      expect(() => validateCatalog(basura)).not.toThrow()
      expect(validateCatalog(basura).ok).toBe(false)
    }
  })
})
