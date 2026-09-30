import { describe, it, expect } from 'vitest'
import { SEED_CATALOG } from './catalog-seed'
import { composeProposal, type BookingOffer } from './proposal'
import { CITA_DADA_POR_HECHA } from '@/content/tone'
import { priceService } from './pricing'
import type { Contact } from './types'

const contacto: Contact = { name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme', consent: true }
const precio = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_opportunity_assessment, '250-999', 'inicial', '3-6m')

const ENLACE = 'https://calendar.app.google/nexus-prueba'
const CON_ENLACE: BookingOffer = { url: ENLACE }
const SIN_ENLACE: BookingOffer = { url: null }

const ROTULOS = ['Tesis', 'Problema', 'Enfoque', 'Diferenciación', 'Resultado esperado', 'Siguiente paso']

describe('ProposalComposer — se lee como un texto, no como una plantilla (CA-20)', () => {
  it('no lleva ninguna sección etiquetada', () => {
    const t = composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'qualified', CON_ENLACE)
    for (const rotulo of ROTULOS) {
      expect(t).not.toContain(`${rotulo}:`)
      expect(t).not.toContain(`## ${rotulo}`)
      expect(t).not.toContain(`**${rotulo}**`)
    }
  })

  it('se dirige a la persona por su nombre', () => {
    const t = composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'qualified', CON_ENLACE)
    expect(t).toContain('Marta')
  })

  it('nombra el servicio aplicable', () => {
    const t = composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'qualified', CON_ENLACE)
    expect(t).toContain('AI Opportunity Assessment')
  })
})

describe('ProposalComposer — la cifra y su advertencia (CA-05)', () => {
  it('incluye el rango y la advertencia de orientativo', () => {
    const t = composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'qualified', CON_ENLACE)
    expect(t).toContain('28.000')
    expect(t).toMatch(/orientativ/i)
  })

  // Sustituye a «el cualificado ve confirmada su cita»: esa prueba protegía el fallo que corrige la spec
  // `agenda-y-preparacion-de-llamadas` (CA-05). El correo sale ANTES de que nadie reserve nada.
  it('el cualificado recibe una invitación a reservar; el no cualificado, una invitación a responder', () => {
    const cual = composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'qualified', CON_ENLACE)
    const noCual = composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'not_qualified', null)
    expect(cual).toMatch(/reserv/i)
    expect(noCual).toMatch(/responder|responde/i)
  })
})

describe('ProposalComposer — la rama sin cifra (CA-24)', () => {
  it('explica por qué no hay número en vez de omitirlo', () => {
    const t = composeProposal(contacto, null, null, 'uncatalogued', null)
    expect(t).toMatch(/no.*(cifra|número)/i)
    expect(t).toContain('30 minutos')
  })

  it('no contiene ninguna cantidad en euros', () => {
    const t = composeProposal(contacto, null, null, 'uncatalogued', null)
    expect(t).not.toContain('€')
  })
})

describe('ProposalComposer — casos que la redacción tiene que resolver', () => {
  it('la cuota mensual se dice «al mes», no como importe total (CA-04)', () => {
    const mensual = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_executive_advisory, '250-999', 'inicial', '3-6m')
    const t = composeProposal(contacto, SEED_CATALOG.services.ai_executive_advisory, mensual, 'qualified', CON_ENLACE)
    expect(t).toMatch(/al mes/)
  })

  it('un nombre de una sola palabra no rompe el saludo', () => {
    const t = composeProposal(
      { name: 'Marta', email: 'marta@acme.ad', company: 'Acme', consent: true },
      SEED_CATALOG.services.ai_opportunity_assessment, precio, 'qualified', CON_ENLACE,
    )
    expect(t.startsWith('Marta,')).toBe(true)
  })

  it('el rango abierto se explica sin inventar un techo', () => {
    const abierto = priceService(SEED_CATALOG, SEED_CATALOG.services.custom_ai_solutions, '250-999', 'inicial', '3-6m')
    const t = composeProposal(contacto, SEED_CATALOG.services.custom_ai_solutions, abierto, 'qualified', CON_ENLACE)
    expect(t).toMatch(/desde/)
    expect(t).toMatch(/techo por cerrar/)
  })
})

describe('ProposalComposer — anti-patrones prohibidos (CA-19)', () => {
  it('ninguna variante promete resultado, descuento, urgencia ni plazo de entrega', () => {
    const variantes = [
      composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'qualified', CON_ENLACE),
      composeProposal(contacto, SEED_CATALOG.services.ai_opportunity_assessment, precio, 'not_qualified', null),
      composeProposal(contacto, null, null, 'uncatalogued', null),
      composeProposal(contacto, SEED_CATALOG.services.custom_ai_solutions,
        priceService(SEED_CATALOG, SEED_CATALOG.services.custom_ai_solutions, '<50', 'avanzada', '>6m'), 'qualified', CON_ENLACE),
    ]
    for (const t of variantes) {
      expect(t).not.toMatch(/descuento|rebaja|oferta especial/i)
      expect(t).not.toMatch(/garantizamos|multiplica|ROI del \d+/i)
      expect(t).not.toMatch(/plazas limitadas|sólo por hoy|últim/i)
      expect(t).not.toMatch(/entregamos en \d+|en \d+ semanas|en \d+ días/i)
    }
  })
})

describe('ProposalComposer — la oferta de reserva (spec agenda-y-preparacion-de-llamadas)', () => {
  const servicio = SEED_CATALOG.services.ai_opportunity_assessment

  it('CA-01: el cualificado con enlace configurado recibe el enlace para reservar', () => {
    const t = composeProposal(contacto, servicio, precio, 'qualified', CON_ENLACE)
    expect(t).toContain(ENLACE)
    expect(t).toMatch(/reserv/i)
  })

  it('CA-02: el no cualificado no recibe ningún enlace de reserva', () => {
    const t = composeProposal(contacto, servicio, precio, 'not_qualified', null)
    expect(t).not.toContain('http')
    expect(t).not.toMatch(/reserv/i)
  })

  it('CA-03: el sin catalogar que supera el umbral recibe el enlace igual que un cualificado', () => {
    const t = composeProposal(contacto, null, null, 'uncatalogued', CON_ENLACE)
    expect(t).toContain(ENLACE)
    expect(t).not.toContain('€')
  })

  it('CA-02: el sin catalogar que no supera el umbral no recibe enlace, pero sí un camino para hablar', () => {
    const t = composeProposal(contacto, null, null, 'uncatalogued', null)
    expect(t).not.toContain('http')
    expect(t).toMatch(/responde/i)
  })

  it('CA-04: sin enlace configurado no se promete nada: el equipo escribirá con disponibilidad', () => {
    for (const t of [
      composeProposal(contacto, servicio, precio, 'qualified', SIN_ENLACE),
      composeProposal(contacto, null, null, 'uncatalogued', SIN_ENLACE),
    ]) {
      expect(t).not.toContain('http')
      expect(t).toMatch(/disponibilidad/i)
    }
  })

  it('CA-05: ninguna rama da una reserva por hecha — el correo sale antes de que nadie reserve', () => {
    const ofertas: readonly BookingOffer[] = [CON_ENLACE, SIN_ENLACE, null]
    const kinds = ['qualified', 'not_qualified'] as const
    const textos = [
      ...ofertas.flatMap((o) => kinds.map((k) => composeProposal(contacto, servicio, precio, k, o))),
      ...ofertas.map((o) => composeProposal(contacto, null, null, 'uncatalogued', o)),
    ]
    expect(textos).toHaveLength(9)
    for (const t of textos) {
      for (const patrón of CITA_DADA_POR_HECHA) expect(t).not.toMatch(patrón)
    }
  })
})
