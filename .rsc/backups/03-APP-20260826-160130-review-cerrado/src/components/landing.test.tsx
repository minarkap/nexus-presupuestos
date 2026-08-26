import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Landing } from './Landing'

afterEach(cleanup)

describe('Landing — una sola llamada a la acción', () => {
  it('tiene exactamente una CTA primaria', () => {
    const { container } = render(<Landing onStart={vi.fn()} />)
    expect(container.querySelectorAll('.cta')).toHaveLength(1)
  })

  it('la CTA abre el formulario', async () => {
    const onStart = vi.fn()
    render(<Landing onStart={onStart} />)
    screen.getByRole('button', { name: /Calcular mi estimación/i }).click()
    expect(onStart).toHaveBeenCalledOnce()
  })
})

describe('Landing — las cuatro líneas de servicio', () => {
  it('presenta las cuatro, incluida la que no tiene tarifa', () => {
    render(<Landing onStart={vi.fn()} />)
    for (const línea of [
      'IA y transformación digital', 'Ciberseguridad',
      'Sostenibilidad y ESG', 'Estrategia y operaciones',
    ]) {
      expect(screen.getByText(línea)).toBeInTheDocument()
    }
  })
})

describe('Landing — la voz de la firma (CA-19)', () => {
  it('no promete resultados, ni urgencia, ni descuentos, ni plazos', () => {
    const { container } = render(<Landing onStart={vi.fn()} />)
    const texto = container.textContent ?? ''
    expect(texto).not.toMatch(/multiplica|garantizamos|ROI del|x\d+ tu/i)
    expect(texto).not.toMatch(/plazas limitadas|sólo por hoy|no te lo pierdas/i)
    expect(texto).not.toMatch(/descuento|oferta|gratis para siempre/i)
    expect(texto).not.toMatch(/en \d+ semanas|en \d+ días/i)
  })

  it('dice explícitamente que el rango es orientativo, no un presupuesto', () => {
    render(<Landing onStart={vi.fn()} />)
    expect(screen.getByText(/rango orientativo, no un presupuesto/i)).toBeInTheDocument()
  })
})
