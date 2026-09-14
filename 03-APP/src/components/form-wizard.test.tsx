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
    expect(screen.getByText(/de 8$/)).toBeInTheDocument()
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
    // La pregunta de frenos es saltable: se continúa sin marcar nada (spec pregunta-frenos-lead, CA-1).
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.type(screen.getByLabelText('Tu nombre'), 'Marta')
    await user.type(screen.getByLabelText('Correo de trabajo'), 'marta@acme.ad')
    await user.type(screen.getByLabelText('Organización'), 'Acme')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Ver mi estimación' }))

    const enviado = onSubmit.mock.calls[0]?.[0] as Answers
    expect(enviado.challenge).toBe('ciberseguridad')
    expect(enviado.need).toBeNull()
  })
})

describe('FormWizard — se ve por dónde va', () => {
  it('muestra la posición desde la primera pantalla', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Pregunta 1 de 8')
  })

  it('el total crece a 9 al entrar en la línea de IA, que tiene una pregunta más', async () => {
    const { user } = setup()
    await user.click(screen.getByText('IA y transformación digital'))
    // Es honesto que cambie: el formulario ramifica de verdad y el lead ve el recorrido real.
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Pregunta 2 de 9')
  })
})

/**
 * Pregunta de frenos (spec `pregunta-frenos-lead`). Es la única pantalla que NO avanza sola al
 * pulsar: admite varias respuestas, así que hace falta decir cuándo se ha terminado de marcar.
 */
describe('FormWizard — la pregunta de frenos admite varias respuestas y se puede saltar', () => {
  async function hastaFrenos(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByText('Ciberseguridad'))
    await user.click(screen.getByText('De 50 a 249'))
    await user.click(screen.getByText(/Inicial/))
    await user.click(screen.getByText('De 3 a 6 meses'))
    await user.click(screen.getByText(/Todavía no/))
    await user.click(screen.getByText('Asignado y aprobado'))
  }

  async function rellenarContacto(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('Tu nombre'), 'Marta')
    await user.type(screen.getByLabelText('Correo de trabajo'), 'marta@acme.ad')
    await user.type(screen.getByLabelText('Organización'), 'Acme')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Ver mi estimación' }))
  }

  it('aparece justo después de presupuesto y antes de pedir los datos', async () => {
    const { user } = setup()
    await hastaFrenos(user)
    expect(screen.getByText('¿Qué os está frenando ahora mismo?')).toBeInTheDocument()
    expect(screen.queryByLabelText('Tu nombre')).not.toBeInTheDocument()
  })

  it('se continúa sin marcar nada y se llega al contacto sin error (CA-1)', async () => {
    const { user, onSubmit } = setup()
    await hastaFrenos(user)
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByLabelText('Tu nombre')).toBeInTheDocument()
    await rellenarContacto(user)
    const enviado = onSubmit.mock.calls[0]?.[0] as Answers
    expect(enviado.blockers).toEqual([])
  })

  it('marcar dos no cierra la pantalla: siguen ambas marcadas', async () => {
    const { user } = setup()
    await hastaFrenos(user)
    await user.click(screen.getByRole('button', { name: 'No tenemos perfiles técnicos' }))
    await user.click(screen.getByRole('button', { name: 'Ya lo intentamos y salió mal' }))
    expect(screen.getByRole('button', { name: 'No tenemos perfiles técnicos' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Ya lo intentamos y salió mal' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('¿Qué os está frenando ahora mismo?')).toBeInTheDocument()
  })

  it('lo marcado viaja en el envío', async () => {
    const { user, onSubmit } = setup()
    await hastaFrenos(user)
    await user.click(screen.getByRole('button', { name: 'No tenemos perfiles técnicos' }))
    await user.click(screen.getByRole('button', { name: 'Dudas legales o de protección de datos' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await rellenarContacto(user)
    const enviado = onSubmit.mock.calls[0]?.[0] as Answers
    expect(enviado.blockers).toEqual(['sin_perfiles', 'dudas_legales'])
  })

  it('volver a pulsar desmarca', async () => {
    const { user, onSubmit } = setup()
    await hastaFrenos(user)
    const freno = () => screen.getByRole('button', { name: 'No sabemos por dónde empezar' })
    await user.click(freno())
    await user.click(freno())
    expect(freno()).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await rellenarContacto(user)
    expect((onSubmit.mock.calls[0]?.[0] as Answers).blockers).toEqual([])
  })

  it('retroceder desde el contacto conserva lo marcado', async () => {
    const { user } = setup()
    await hastaFrenos(user)
    await user.click(screen.getByRole('button', { name: 'Ya lo intentamos y salió mal' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.click(screen.getByRole('button', { name: 'Atrás' }))
    expect(screen.getByRole('button', { name: 'Ya lo intentamos y salió mal' })).toHaveAttribute('aria-pressed', 'true')
  })
})
