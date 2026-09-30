import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { normalizeBookingUrl } from './booking-url'

/**
 * El enlace de reservas lo leen DOS sitios: la pantalla (`/presupuesto`) y el correo (`actions.ts`).
 * Si cada uno lo interpretara a su manera, un espacio pegado por error en el panel de Vercel haría que
 * el correo dijera «te escribimos con disponibilidad» mientras la pantalla incrusta un calendario roto
 * (hallazgo de la revisión del PR 1, 2026-09-30).
 */
describe('normalizeBookingUrl — un solo criterio para «hay enlace de reservas»', () => {
  it('sin variable, no hay enlace', () => {
    expect(normalizeBookingUrl(undefined)).toBeNull()
  })

  it('vacía o solo espacios, no hay enlace', () => {
    expect(normalizeBookingUrl('')).toBeNull()
    expect(normalizeBookingUrl('   ')).toBeNull()
  })

  it('con espacios alrededor, se queda el enlace limpio', () => {
    expect(normalizeBookingUrl('  https://calendar.app.google/x \n')).toBe('https://calendar.app.google/x')
  })
})

describe('Pantalla y correo leen el enlace por el MISMO camino', () => {
  const src = (f: string) => readFileSync(join(__dirname, f), 'utf8')
  const LLAMADA = 'normalizeBookingUrl(process.env.NEXT_PUBLIC_CALENDAR_URL)'

  it.each(['presupuesto/page.tsx', 'actions.ts'])('%s usa normalizeBookingUrl y no lee la variable a pelo', (f) => {
    const texto = src(f)
    expect(texto).toContain(LLAMADA)
    expect(texto.split('process.env.NEXT_PUBLIC_CALENDAR_URL').length - 1).toBe(1)
  })
})
