import { describe, it, expect } from 'vitest'
import { SEED_CATALOG } from './catalog-seed'
import { priceService } from './pricing'
import { resolveService } from './service-resolver'
import type { Challenge, Maturity, Need, Size, Timing } from './types'

const CHALLENGES: Challenge[] = ['ia', 'ciberseguridad', 'esg', 'estrategia_operaciones']
const NEEDS: (Need | null)[] = [null, 'diagnostico', 'implantacion', 'acompanamiento', 'desarrollo']
const SIZES: Size[] = ['<50', '50-249', '250-999', '>=1000']
const MATURITIES: Maturity[] = ['inicial', 'en_desarrollo', 'avanzada']
const TIMINGS: Timing[] = ['<3m', '3-6m', '>6m']

/**
 * CA-02 / constitution 15. El espacio es finito y pequeño: se recorre ENTERO, no se muestrea.
 * Es la prueba que impide que una combinación de factores publique una cifra fuera de catálogo.
 */
describe('Prueba exhaustiva — ninguna combinación se sale del rango oficial (CA-02)', () => {
  it('recorre todas las combinaciones de las preguntas 1 a 5', () => {
    let combinacionesConCifra = 0
    const violaciones: string[] = []

    for (const challenge of CHALLENGES) {
      for (const need of NEEDS) {
        const resolution = resolveService(SEED_CATALOG, challenge, need)
        if (resolution.kind !== 'service') continue
        const service = resolution.service

        for (const size of SIZES) {
          for (const maturity of MATURITIES) {
            for (const timing of TIMINGS) {
              combinacionesConCifra += 1
              const r = priceService(SEED_CATALOG, service, size, maturity, timing)
              const donde = `${service.id}/${size}/${maturity}/${timing}`

              if (r.low < service.officialMin) {
                violaciones.push(`${donde}: low ${r.low} < mínimo ${service.officialMin}`)
              }
              if (service.officialMax !== null && r.high !== null && r.high > service.officialMax) {
                violaciones.push(`${donde}: high ${r.high} > máximo ${service.officialMax}`)
              }
              if (r.high !== null && r.low > r.high) {
                violaciones.push(`${donde}: low ${r.low} > high ${r.high}`)
              }
              if (service.openEnded && r.high !== null) {
                violaciones.push(`${donde}: rango abierto con techo publicado`)
              }
            }
          }
        }
      }
    }

    expect(violaciones).toEqual([])
    // 14 pares (reto, necesidad) que producen cifra × 4 tamaños × 3 madureces × 3 plazos.
    // Son 14 y no 6 porque ciberseguridad y ESG resuelven también con necesidad sin declarar:
    // el espacio que CA-02 exige recorrer es el de RESPUESTAS, no el de servicios.
    expect(combinacionesConCifra).toBe(504)
  })

  it('la rama sin catalogar no produce ninguna cifra, en ninguna combinación', () => {
    for (const need of NEEDS) {
      expect(resolveService(SEED_CATALOG, 'estrategia_operaciones', need).kind).toBe('uncatalogued')
    }
  })

  it('todo servicio del catálogo es alcanzable desde alguna respuesta', () => {
    const alcanzables = new Set<string>()
    for (const challenge of CHALLENGES) {
      for (const need of NEEDS) {
        const r = resolveService(SEED_CATALOG, challenge, need)
        if (r.kind === 'service') alcanzables.add(r.service.id)
      }
    }
    expect(alcanzables.size).toBe(Object.keys(SEED_CATALOG.services).length)
  })
})
