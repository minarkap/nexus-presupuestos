import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(__dirname, '_legacy/legacy.css'), 'utf8')
const rules = css.replace(/\/\*[\s\S]*?\*\//g, '').split('}').map((r) => r.split('{')[0]!.trim()).filter(Boolean)

/**
 * El museo comparte nombres de clase con el sitio vivo (.hero, .cta, .choice, .wizard, .result,
 * .progress, .field, .nav). Sin acotar y sin ganar en especificidad, las reglas del sitio nuevo se
 * cuelan y pintan texto claro sobre papel crema — que es exactamente el fallo que esto vigila.
 */
describe('Snapshot del diseño anterior — aislado del sitio vivo', () => {
  it('toda regla está acotada bajo .legacy.legacy (salvo la que oculta el chrome actual)', () => {
    const fuera = rules.filter((r) => !r.startsWith('.legacy.legacy') && !r.startsWith('body:has(.legacy)'))
    expect(fuera).toEqual([])
  })
  it('restituye el color heredado en los elementos que el sitio nuevo pinta claro', () => {
    expect(css).toMatch(/\.legacy\.legacy :where\([^)]*\bh1\b[^)]*\blegend\b[^)]*\)\s*\{\s*color: var\(--ink\)/)
  })
  it('conserva el papel crema y la tinta del original', () => {
    expect(css).toMatch(/--paper: #faf9f7/)
    expect(css).toMatch(/--ink: #14161a/)
  })
  it('no deja selectores mal formados por el acotado', () => {
    expect(css).not.toMatch(/:where\([^)]*\.legacy\.legacy/)
  })
})
