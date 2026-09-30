import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ResultScreen } from './ResultScreen'
import type { RedactedOutcome } from '@/core/types'
import { SEED_CATALOG } from '@/core/catalog-seed'
import { mapOutcome } from '@/core/outcome'
import { priceService } from '@/core/pricing'
import { scoreLead } from '@/core/scoring'
import { CITA_DADA_POR_HECHA } from '@/content/tone'

afterEach(cleanup)

const conCifra: RedactedOutcome = {
  kind: 'qualified',
  rangeText: '28.000 – 35.000 €',
  disclaimer: 'Es un rango orientativo y sujeto a alcance.',
  bodyText: 'Con lo que nos cuentas, este es el orden de magnitud.',
  showCalendar: true,
}

const sinCifra: RedactedOutcome = {
  kind: 'uncatalogued',
  rangeText: null,
  disclaimer: 'Preferimos no dar un número antes de entender el problema.',
  bodyText: 'Te proponemos una llamada de 30 minutos, sin coste.',
  showCalendar: false,
}

describe('ResultScreen — la rama sin catalogar no muestra euros (CA-09)', () => {
  it('no renderiza ningún símbolo de euro', () => {
    const { container } = render(<ResultScreen outcome={sinCifra} />)
    expect(container.textContent).not.toContain('€')
  })

  it('dice claramente que no va a dar un número', () => {
    render(<ResultScreen outcome={sinCifra} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/no te vamos a dar un número/i)
  })
})

describe('ResultScreen — la advertencia acompaña siempre a la cifra (CA-05)', () => {
  it('muestra el rango y su advertencia juntos', () => {
    render(<ResultScreen outcome={conCifra} />)
    expect(screen.getByText('28.000 – 35.000 €')).toBeInTheDocument()
    expect(screen.getByText(/orientativo y sujeto a alcance/i)).toBeInTheDocument()
  })
})

describe('ResultScreen — el calendario (CA-11, CA-12)', () => {
  it('sin cualificar NO monta el calendario', () => {
    const noCual: RedactedOutcome = { ...conCifra, kind: 'not_qualified', showCalendar: false }
    const { container } = render(<ResultScreen outcome={noCual} calendarUrl="https://calendar.example/x" />)
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('cualificado con URL lo incrusta y ofrece el plan B en pestaña nueva', () => {
    render(<ResultScreen outcome={conCifra} calendarUrl="https://calendar.example/x" />)
    expect(screen.getByTitle(/Reservar una llamada/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pestaña nueva/i })).toHaveAttribute('target', '_blank')
  })

  it('cualificado SIN URL configurada no rompe: ofrece salida por correo', () => {
    const { container } = render(<ResultScreen outcome={conCifra} />)
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByText(/disponibilidad del equipo/i)).toBeInTheDocument()
  })

  it('sin catalogar pero cualificado ve calendario y sigue sin cifra (CA-12)', () => {
    const cualSinCifra: RedactedOutcome = { ...sinCifra, showCalendar: true }
    const { container } = render(<ResultScreen outcome={cualSinCifra} calendarUrl="https://c.example/x" />)
    expect(container.querySelector('iframe')).not.toBeNull()
    expect(container.textContent).not.toContain('€')
  })
})

describe('ResultScreen — nada interno llega a la pantalla (CA-14)', () => {
  it('no muestra puntuación ni umbral', () => {
    const { container } = render(<ResultScreen outcome={conCifra} calendarUrl="https://c.example/x" />)
    const texto = (container.textContent ?? '').toLowerCase()
    expect(texto).not.toContain('puntuación')
    expect(texto).not.toContain('umbral')
    expect(texto).not.toContain('/10')
  })
})

describe('ResultScreen — con el texto REAL del núcleo, nada promete una reserva que no existe (spec agenda-y-preparacion-de-llamadas, CA-04)', () => {
  // Con el cuerpo real, no con un fixture: el fallo estaba en el texto de `outcome.ts`, que decía
  // «Puedes reservar ahora mismo» encima de un calendario que en producción no existía.
  const precioReal = priceService(SEED_CATALOG, SEED_CATALOG.services.ai_opportunity_assessment, '250-999', 'inicial', '3-6m')
  const fuerteReal = { challenge: 'ia', need: 'diagnostico', size: '250-999', maturity: 'inicial', timing: '3-6m', sponsor: 'si', budget: 'asignado' } as const
  const real = mapOutcome(SEED_CATALOG, SEED_CATALOG.services.ai_opportunity_assessment, precioReal, scoreLead(SEED_CATALOG, fuerteReal))

  it('el cualificado sin enlace configurado no lee «puedes reservar ahora mismo»', () => {
    expect(real.showCalendar).toBe(true)
    const { container } = render(<ResultScreen outcome={real} />)
    expect(container.textContent).not.toMatch(/ahora mismo|puedes reservar/i)
    expect(container.textContent).toMatch(/disponibilidad del equipo/i)
    for (const patrón of CITA_DADA_POR_HECHA) expect(container.textContent).not.toMatch(patrón)
  })

  it('el cualificado con enlace sigue viendo el calendario', () => {
    const { container } = render(<ResultScreen outcome={real} calendarUrl="https://calendar.example/x" />)
    expect(container.querySelector('iframe')).not.toBeNull()
  })

  it('sin enlace, el título de la tarjeta no invita a reservar lo que no se puede reservar', () => {
    render(<ResultScreen outcome={real} />)
    expect(screen.getByRole('heading', { level: 2 })).not.toHaveTextContent(/reserva/i)
  })

  it('con enlace, el título sí invita a reservar', () => {
    render(<ResultScreen outcome={real} calendarUrl="https://calendar.example/x" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/reserva/i)
  })
})
