import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(__dirname, '../app/tokens.css'), 'utf8')
const tokens = new Map<string, string>()
for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) tokens.set(m[1]!, m[2]!)

function lum(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}
export function ratio(a: string, b: string): number {
  const [la, lb] = [lum(a), lum(b)]
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}
const t = (n: string) => { const v = tokens.get(n); if (!v) throw new Error(`token ${n} ausente`); return v }

/** Los pares que el sitio usa de verdad (plan §0). Texto normal ≥ 4,5; grande/UI ≥ 3 (constitution 34). */
describe('Contraste WCAG 2.2 AA sobre los tokens reales', () => {
  const normal: [string, string][] = [
    ['--nx-white', '--nx-night'], ['--nx-white', '--nx-navy-850'], ['--nx-white', '--nx-navy-800'],
    ['--nx-slate-300', '--nx-night'], ['--nx-slate-300', '--nx-navy-850'], ['--nx-slate-300', '--nx-navy-800'],
    ['--nx-cyan-400', '--nx-night'], ['--nx-cyan-400', '--nx-navy-850'], ['--nx-cyan-500', '--nx-night'],
    ['--nx-white', '--nx-blue-500'], ['--nx-danger', '--nx-night'], ['--nx-blue-300', '--nx-navy-800'],
  ]
  it.each(normal)('%s sobre %s ≥ 4,5:1 (texto normal)', (fg, bg) => {
    expect(ratio(t(fg), t(bg))).toBeGreaterThanOrEqual(4.5)
  })
  const large: [string, string][] = [['--nx-blue-500', '--nx-night'], ['--nx-slate-400', '--nx-night']]
  it.each(large)('%s sobre %s ≥ 3:1 (solo display / UI)', (fg, bg) => {
    expect(ratio(t(fg), t(bg))).toBeGreaterThanOrEqual(3)
  })
  it('el foco cian sobre navy supera 3:1 con holgura', () => {
    expect(ratio(t('--nx-cyan-500'), t('--nx-night'))).toBeGreaterThan(7)
  })
  it('documenta por qué el botón primario es sólido: blanco sobre cian falla AA', () => {
    expect(ratio(t('--nx-white'), t('--nx-cyan-500'))).toBeLessThan(3)
  })
})
