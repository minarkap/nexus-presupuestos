import { describe, it, expect } from 'vitest'
import { composeProposal } from './proposal'
import { priceService } from './pricing'
import { SERVICES } from './catalog'
import type { Contact } from './types'

const contacto: Contact = { name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme' }
const precio = priceService(SERVICES.ai_opportunity_assessment, '250-999', 'inicial', '3-6m')

const ROTULOS = ['Tesis', 'Problema', 'Enfoque', 'Diferenciación', 'Resultado esperado', 'Siguiente paso']

describe('ProposalComposer — se lee como un texto, no como una plantilla (CA-20)', () => {
  it('no lleva ninguna sección etiquetada', () => {
    const t = composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'qualified')
    for (const rotulo of ROTULOS) {
      expect(t).not.toContain(`${rotulo}:`)
      expect(t).not.toContain(`## ${rotulo}`)
      expect(t).not.toContain(`**${rotulo}**`)
    }
  })

  it('se dirige a la persona por su nombre', () => {
    const t = composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'qualified')
    expect(t).toContain('Marta')
  })

  it('nombra el servicio aplicable', () => {
    const t = composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'qualified')
    expect(t).toContain('AI Opportunity Assessment')
  })
})

describe('ProposalComposer — la cifra y su advertencia (CA-05)', () => {
  it('incluye el rango y la advertencia de orientativo', () => {
    const t = composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'qualified')
    expect(t).toContain('28.000')
    expect(t).toMatch(/orientativ/i)
  })

  it('el cualificado ve confirmada su cita; el no cualificado, una invitación a responder', () => {
    const cual = composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'qualified')
    const noCual = composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'not_qualified')
    expect(cual).toMatch(/cita|hueco|agenda/i)
    expect(noCual).toMatch(/responder|responde/i)
  })
})

describe('ProposalComposer — la rama sin cifra (CA-24)', () => {
  it('explica por qué no hay número en vez de omitirlo', () => {
    const t = composeProposal(contacto, null, null, 'uncatalogued')
    expect(t).toMatch(/no.*(cifra|número)/i)
    expect(t).toContain('30 minutos')
  })

  it('no contiene ninguna cantidad en euros', () => {
    const t = composeProposal(contacto, null, null, 'uncatalogued')
    expect(t).not.toContain('€')
  })
})

describe('ProposalComposer — casos que la redacción tiene que resolver', () => {
  it('la cuota mensual se dice «al mes», no como importe total (CA-04)', () => {
    const mensual = priceService(SERVICES.ai_executive_advisory, '250-999', 'inicial', '3-6m')
    const t = composeProposal(contacto, SERVICES.ai_executive_advisory, mensual, 'qualified')
    expect(t).toMatch(/al mes/)
  })

  it('un nombre de una sola palabra no rompe el saludo', () => {
    const t = composeProposal(
      { name: 'Marta', email: 'marta@acme.ad', company: 'Acme' },
      SERVICES.ai_opportunity_assessment, precio, 'qualified',
    )
    expect(t.startsWith('Marta,')).toBe(true)
  })

  it('el rango abierto se explica sin inventar un techo', () => {
    const abierto = priceService(SERVICES.custom_ai_solutions, '250-999', 'inicial', '3-6m')
    const t = composeProposal(contacto, SERVICES.custom_ai_solutions, abierto, 'qualified')
    expect(t).toMatch(/desde/)
    expect(t).toMatch(/techo por cerrar/)
  })
})

describe('ProposalComposer — anti-patrones prohibidos (CA-19)', () => {
  it('ninguna variante promete resultado, descuento, urgencia ni plazo de entrega', () => {
    const variantes = [
      composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'qualified'),
      composeProposal(contacto, SERVICES.ai_opportunity_assessment, precio, 'not_qualified'),
      composeProposal(contacto, null, null, 'uncatalogued'),
      composeProposal(contacto, SERVICES.custom_ai_solutions,
        priceService(SERVICES.custom_ai_solutions, '<50', 'avanzada', '>6m'), 'qualified'),
    ]
    for (const t of variantes) {
      expect(t).not.toMatch(/descuento|rebaja|oferta especial/i)
      expect(t).not.toMatch(/garantizamos|multiplica|ROI del \d+/i)
      expect(t).not.toMatch(/plazas limitadas|sólo por hoy|últim/i)
      expect(t).not.toMatch(/entregamos en \d+|en \d+ semanas|en \d+ días/i)
    }
  })
})
