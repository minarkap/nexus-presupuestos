import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ResultScreen } from './ResultScreen'
import type { RedactedOutcome } from '@/core/types'

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
