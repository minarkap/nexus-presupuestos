import { describe, it, expect, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach } from 'vitest'
import { FormWizard } from './FormWizard'
import type { Answers } from '@/core/types'
import type { SubmitResult } from '@/core/submit'

afterEach(cleanup)

const outcome = {
  kind: 'qualified' as const, rangeText: '28.000 – 35.000 €',
  disclaimer: 'orientativo', bodyText: 'cuerpo', showCalendar: true,
}

type SubmitFn = (answers: Answers, submissionId: string) => Promise<SubmitResult>

function setup(onSubmit = vi.fn<SubmitFn>(async () => outcome)) {
  const onDone = vi.fn()
  render(<FormWizard submissionId="s1" onSubmit={onSubmit} onDone={onDone} />)
  return { onSubmit, onDone, user: userEvent.setup() }
}

describe('FormWizard — la pregunta 2 es condicional (CA-07, CA-08)', () => {
  it('el reto de IA abre la pregunta de qué necesitas', async () => {
    const { user } = setup()
    await user.click(screen.getByText('IA y transformación digital'))
    expect(screen.getByText('¿Qué necesitas exactamente?')).toBeInTheDocument()
  })

  it('ciberseguridad se la salta y va directo al tamaño', async () => {
    const { user } = setup()
    await user.click(screen.getByText('Ciberseguridad'))
    expect(screen.queryByText('¿Qué necesitas exactamente?')).not.toBeInTheDocument()
    expect(screen.getByText('¿Cuánta gente sois en la organización?')).toBeInTheDocument()
  })

  it('las líneas sin ramificación tienen una pregunta menos en el contador', async () => {
    const { user } = setup()
    await user.click(screen.getByText('Sostenibilidad y ESG'))
    expect(screen.getByText(/de 7$/)).toBeInTheDocument()
  })
})

describe('FormWizard — retroceder no pierde lo respondido', () => {
  it('vuelve atrás y conserva la elección anterior marcada', async () => {
    const { user } = setup()
    await user.click(screen.getByText('Ciberseguridad'))
    await user.click(screen.getByText('De 250 a 999'))
    await user.click(screen.getByRole('button', { name: 'Atrás' }))
    expect(screen.getByRole('button', { name: 'De 250 a 999' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('cambiar de IA a otra línea descarta la respuesta de la pregunta 2', async () => {
    const { user, onSubmit } = setup()
    await user.click(screen.getByText('IA y transformación digital'))
    await user.click(screen.getByText('Una implantación'))
    // volver al principio y cambiar de línea
    await user.click(screen.getByRole('button', { name: 'Atrás' }))
    await user.click(screen.getByRole('button', { name: 'Atrás' }))
    await user.click(screen.getByText('Ciberseguridad'))
    await user.click(screen.getByText('De 50 a 249'))
    await user.click(screen.getByText(/Inicial/))
    await user.click(screen.getByText('De 3 a 6 meses'))
    await user.click(screen.getByText(/Todavía no/))
    await user.click(screen.getByText('Asignado y aprobado'))
    await user.type(screen.getByLabelText('Tu nombre'), 'Marta')
    await user.type(screen.getByLabelText('Correo de trabajo'), 'marta@acme.ad')
    await user.type(screen.getByLabelText('Organización'), 'Acme')
    await user.click(screen.getByRole('button', { name: 'Ver mi estimación' }))

    const enviado = onSubmit.mock.calls[0]?.[0] as Answers
    expect(enviado.challenge).toBe('ciberseguridad')
    expect(enviado.need).toBeNull()
  })
})

describe('FormWizard — se ve por dónde va', () => {
  it('muestra la posición desde la primera pantalla', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Pregunta 1 de 7')
  })

  it('el total crece a 8 al entrar en la línea de IA, que tiene una pregunta más', async () => {
    const { user } = setup()
    await user.click(screen.getByText('IA y transformación digital'))
    // Es honesto que cambie: el formulario ramifica de verdad y el lead ve el recorrido real.
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Pregunta 2 de 8')
  })
})
