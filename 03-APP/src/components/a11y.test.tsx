import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormWizard } from './FormWizard'

afterEach(cleanup)

const outcome = {
  kind: 'qualified' as const, rangeText: '1 €', disclaimer: 'd', bodyText: 'b', showCalendar: false,
}

function montar() {
  render(<FormWizard submissionId="s1" onSubmit={vi.fn(async () => outcome)} onDone={vi.fn()} />)
  return userEvent.setup()
}

async function irAlContacto(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText('Ciberseguridad'))
  await user.click(screen.getByText('De 50 a 249'))
  await user.click(screen.getByText(/Inicial/))
  await user.click(screen.getByText('De 3 a 6 meses'))
  await user.click(screen.getByText(/Todavía no/))
  await user.click(screen.getByText('Asignado y aprobado'))
}

describe('Accesibilidad — nombre accesible de cada control (WCAG 2.2 AA)', () => {
  it('toda opción es un botón con texto, no un div pinchable', () => {
    montar()
    const botones = screen.getAllByRole('button')
    expect(botones.length).toBeGreaterThan(0)
    for (const b of botones) {
      expect(b.textContent?.trim()).toBeTruthy()
    }
  })

  it('cada campo de contacto tiene su etiqueta asociada, y sólo su etiqueta', async () => {
    const user = montar()
    await irAlContacto(user)
    for (const etiqueta of ['Tu nombre', 'Correo de trabajo', 'Organización']) {
      const campo = screen.getByLabelText(etiqueta)
      expect(campo.tagName).toBe('INPUT')
      expect(campo).toHaveAccessibleName(etiqueta)
    }
  })

  it('el campo del correo se anuncia como correo, no como texto genérico', async () => {
    const user = montar()
    await irAlContacto(user)
    expect(screen.getByLabelText('Correo de trabajo')).toHaveAttribute('type', 'email')
  })
})

describe('Accesibilidad — navegación con teclado', () => {
  it('se puede elegir una opción sin tocar el ratón', async () => {
    const user = montar()
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByText('¿Qué necesitas exactamente?')).toBeInTheDocument()
  })

  it('se puede recorrer los tres campos de contacto con el tabulador', async () => {
    const user = montar()
    await irAlContacto(user)
    await user.click(screen.getByLabelText('Tu nombre'))
    await user.tab()
    expect(screen.getByLabelText('Correo de trabajo')).toHaveFocus()
    await user.tab()
    expect(screen.getByLabelText('Organización')).toHaveFocus()
  })
})

describe('Accesibilidad — estado y errores', () => {
  it('la opción elegida se comunica con aria-pressed, no sólo con color', async () => {
    const user = montar()
    await user.click(screen.getByText('Ciberseguridad'))
    await user.click(screen.getByText('De 250 a 999'))
    await user.click(screen.getByRole('button', { name: 'Atrás' }))
    expect(screen.getByRole('button', { name: 'De 250 a 999' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('el error de validación se anuncia y queda enlazado al campo', async () => {
    const onSubmit = vi.fn(async () => ({
      kind: 'validation_error' as const, field: 'email' as const, message: 'Revisa el correo.',
    }))
    const user = userEvent.setup()
    render(<FormWizard submissionId="s1" onSubmit={onSubmit} onDone={vi.fn()} />)
    await irAlContacto(user)
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Ver mi estimación' }))

    const campo = screen.getByLabelText('Correo de trabajo')
    const alerta = screen.getByRole('alert')
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(campo.getAttribute('aria-describedby')).toBe(alerta.id)
    // el nombre accesible NO se contamina con el mensaje de error
    expect(campo).toHaveAccessibleName('Correo de trabajo')
  })

  it('el progreso se expone como encabezado, legible fuera de contexto visual', () => {
    montar()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Pregunta \d+ de \d+/)
  })
})
