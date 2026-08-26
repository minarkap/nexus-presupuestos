import { describe, it, expect } from 'vitest'
import { mapOutcome } from './outcome'
import { priceService, } from './pricing'
import { scoreLead } from './scoring'
import { SERVICES, QUALIFICATION_THRESHOLD, SIZE_FACTOR } from './catalog'
import type { BusinessAnswers } from './types'

const fuerte: BusinessAnswers = {
  challenge: 'ia', need: 'diagnostico', size: '250-999', maturity: 'inicial',
  timing: '3-6m', sponsor: 'si', budget: 'asignado',
}
const flojo: BusinessAnswers = { ...fuerte, sponsor: 'no', budget: 'sin', timing: '<3m' }

const precio = priceService(SERVICES.ai_opportunity_assessment, '250-999', 'inicial', '3-6m')

describe('OutcomeMapper — las tres salidas', () => {
  it('cualificado con servicio catalogado ve cifra y calendario (CA-10)', () => {
    const o = mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(fuerte))
    expect(o.kind).toBe('qualified')
    expect(o.showCalendar).toBe(true)
    expect(o.rangeText).toContain('28.000')
  })

  it('no cualificado ve cifra pero NO calendario (CA-11)', () => {
    const o = mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(flojo))
    expect(o.kind).toBe('not_qualified')
    expect(o.showCalendar).toBe(false)
    expect(o.rangeText).not.toBeNull()
  })

  it('sin catalogar no muestra ninguna cifra en euros (CA-09)', () => {
    const o = mapOutcome(null, null, scoreLead(flojo))
    expect(o.kind).toBe('uncatalogued')
    expect(o.rangeText).toBeNull()
    expect(o.bodyText).not.toContain('€')
  })

  it('sin catalogar que supera el umbral SÍ ve calendario, y sigue sin cifra (CA-12)', () => {
    const o = mapOutcome(null, null, scoreLead(fuerte))
    expect(o.kind).toBe('uncatalogued')
    expect(o.showCalendar).toBe(true)
    expect(o.rangeText).toBeNull()
  })
})

describe('OutcomeMapper — la frontera de confianza (CA-06, CA-14)', () => {
  it('lo serializado NO contiene la puntuación ni el umbral', () => {
    const score = scoreLead(fuerte)
    const serializado = JSON.stringify(mapOutcome(SERVICES.ai_opportunity_assessment, precio, score))
    expect(serializado).not.toContain(`"total"`)
    expect(serializado).not.toContain(`"breakdown"`)
    expect(serializado).not.toContain(`"umbral"`)
    expect(serializado).not.toContain(`"threshold"`)
    // y el propio objeto no expone el total por ninguna vía
    expect(Object.values(mapOutcome(SERVICES.ai_opportunity_assessment, precio, score)))
      .not.toContain(score.total)
  })

  it('lo serializado NO contiene ningún multiplicador de la tabla interna', () => {
    const serializado = JSON.stringify(mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(fuerte)))
    for (const factor of Object.values(SIZE_FACTOR)) {
      expect(serializado).not.toContain(String(factor))
    }
  })

  it('lo serializado NO nombra ninguna señal de la tabla de puntos', () => {
    const serializado = JSON.stringify(mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(fuerte)))
    // Buscar dígitos sueltos sería ruido: el rango entregado los contiene por definición.
    // Lo que delata una fuga es el VOCABULARIO interno, no las cifras del propio resultado.
    for (const señal of ['sponsor', 'presupuesto', 'plazo', 'madurez', 'points', 'puntuación']) {
      expect(serializado.toLowerCase()).not.toContain(señal.toLowerCase())
    }
  })

  it('la estructura devuelta tiene EXACTAMENTE las cinco claves permitidas', () => {
    const o = mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(fuerte))
    expect(Object.keys(o).sort()).toEqual(
      ['bodyText', 'disclaimer', 'kind', 'rangeText', 'showCalendar'].sort(),
    )
  })

  it('no filtra el identificador interno del servicio', () => {
    const serializado = JSON.stringify(mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(fuerte)))
    expect(serializado).not.toContain('ai_opportunity_assessment')
  })
})

describe('OutcomeMapper — el umbral vive en un único punto (CA-13)', () => {
  it('la rama depende sólo del umbral configurado', () => {
    const justo = { total: QUALIFICATION_THRESHOLD, breakdown: [] }
    const debajo = { total: QUALIFICATION_THRESHOLD - 1, breakdown: [] }
    expect(mapOutcome(SERVICES.ai_opportunity_assessment, precio, justo).showCalendar).toBe(true)
    expect(mapOutcome(SERVICES.ai_opportunity_assessment, precio, debajo).showCalendar).toBe(false)
  })
})

describe('OutcomeMapper — particularidades de presentación', () => {
  it('toda salida con cifra lleva la advertencia de orientativo (CA-05)', () => {
    const o = mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(fuerte))
    expect(o.disclaimer).toMatch(/orientativ/i)
    expect(o.disclaimer).toMatch(/alcance/i)
  })

  it('AI Executive Advisory se presenta como cuota mensual (CA-04)', () => {
    const mensual = priceService(SERVICES.ai_executive_advisory, '250-999', 'inicial', '3-6m')
    const o = mapOutcome(SERVICES.ai_executive_advisory, mensual, scoreLead(fuerte))
    expect(o.rangeText).toMatch(/mes/i)
  })

  it('Custom AI Solutions sustituye el techo por la llamada de alcance (CA-03)', () => {
    const abierto = priceService(SERVICES.custom_ai_solutions, '250-999', 'inicial', '3-6m')
    const o = mapOutcome(SERVICES.custom_ai_solutions, abierto, scoreLead(fuerte))
    expect(o.rangeText).toMatch(/desde/i)
    expect(o.rangeText).toMatch(/alcance/i)
  })

  it('la rama sin catalogar nombra los 30 minutos y no promete análisis (CA-24)', () => {
    const o = mapOutcome(null, null, scoreLead(fuerte))
    expect(o.bodyText).toContain('30 minutos')
    expect(o.bodyText).not.toMatch(/informe|análisis detallado/i)
  })

  it('ninguna salida promete plazos de entrega ni descuentos (CA-19)', () => {
    for (const o of [
      mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(fuerte)),
      mapOutcome(SERVICES.ai_opportunity_assessment, precio, scoreLead(flojo)),
      mapOutcome(null, null, scoreLead(flojo)),
    ]) {
      const texto = `${o.bodyText} ${o.disclaimer} ${o.rangeText ?? ''}`
      expect(texto).not.toMatch(/descuento|oferta|garantizamos|en \d+ semanas/i)
    }
  })
})
