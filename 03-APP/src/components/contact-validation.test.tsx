import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormWizard } from './FormWizard'

afterEach(cleanup)

async function llegarAlContacto(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText('Ciberseguridad'))
  await user.click(screen.getByText('De 50 a 249'))
  await user.click(screen.getByText(/Inicial/))
  await user.click(screen.getByText('De 3 a 6 meses'))
  await user.click(screen.getByText(/Todavía no/))
  await user.click(screen.getByText('Asignado y aprobado'))
}

describe('Validación de contacto — avisa sin perder lo ya respondido', () => {
  it('señala el campo del correo y lo anuncia a un lector de pantalla', async () => {
    const onSubmit = vi.fn(async () => ({
      kind: 'validation_error' as const, field: 'email' as const, message: 'Revisa el correo.',
    }))
    const user = userEvent.setup()
    render(<FormWizard submissionId="s1" onSubmit={onSubmit} onDone={vi.fn()} />)
    await llegarAlContacto(user)

    await user.type(screen.getByLabelText('Tu nombre'), 'Marta')
    await user.type(screen.getByLabelText('Correo de trabajo'), 'roto')
    await user.type(screen.getByLabelText('Organización'), 'Acme')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Ver mi estimación' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Revisa el correo.')
    expect(screen.getByLabelText('Correo de trabajo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('conserva los otros campos tras el error', async () => {
    const onSubmit = vi.fn(async () => ({
      kind: 'validation_error' as const, field: 'email' as const, message: 'Revisa el correo.',
    }))
    const user = userEvent.setup()
    render(<FormWizard submissionId="s1" onSubmit={onSubmit} onDone={vi.fn()} />)
    await llegarAlContacto(user)
    await user.type(screen.getByLabelText('Tu nombre'), 'Marta')
    await user.type(screen.getByLabelText('Correo de trabajo'), 'roto')
    await user.type(screen.getByLabelText('Organización'), 'Acme')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Ver mi estimación' }))

    expect(screen.getByLabelText('Tu nombre')).toHaveValue('Marta')
    expect(screen.getByLabelText('Organización')).toHaveValue('Acme')
  })
})

describe('Abandono a media pregunta (spec §Caminos de error)', () => {
  it('desmontar el formulario sin llegar al final no despacha nada', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    const { unmount } = render(<FormWizard submissionId="s1" onSubmit={onSubmit} onDone={vi.fn()} />)
    await user.click(screen.getByText('Ciberseguridad'))
    await user.click(screen.getByText('De 50 a 249'))
    unmount()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
