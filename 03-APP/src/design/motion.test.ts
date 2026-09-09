import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const files = ['globals.css', 'ui.css', 'site.css'].map((f) => [f, readFileSync(join(__dirname, '../app', f), 'utf8')] as const)

/** constitution 35: movimiento con propósito, compositor-only, reducible. */
describe('Movimiento reducible y sin transition: all', () => {
  it.each(files)('%s no usa transition: all', (_n, css) => {
    expect(css).not.toMatch(/transition\s*:\s*all/)
    expect(css).not.toMatch(/transition-all/)
  })
  it('toda @keyframes y toda animation viven dentro de prefers-reduced-motion: no-preference', () => {
    for (const [name, css] of files) {
      // quitamos los bloques protegidos y comprobamos que no queda ninguna animación fuera
      let depth = 0, i = 0, out = ''
      // enfoque simple: elimina cada bloque @media(...no-preference){...} con balance de llaves
      let s = css
      for (;;) {
        const idx = s.indexOf('@media (prefers-reduced-motion: no-preference)')
        if (idx < 0) break
        const j = s.indexOf('{', idx); depth = 1; i = j + 1
        while (depth > 0 && i < s.length) { if (s[i] === '{') depth++; else if (s[i] === '}') depth--; i++ }
        s = s.slice(0, idx) + s.slice(i)
      }
      out = s
      expect(out, `${name}: @keyframes fuera del guard`).not.toMatch(/@keyframes/)
      expect(out.replace(/animation-timeline|animation-range/g, ''), `${name}: animation fuera del guard`).not.toMatch(/\banimation\s*:/)
    }
  })
  it('las transiciones solo tocan propiedades de compositor o color/borde', () => {
    for (const [name, css] of files) {
      for (const m of css.matchAll(/transition-property:\s*([^;]+);/g)) {
        for (const prop of m[1]!.split(',').map((p) => p.trim())) {
          expect(['transform', 'opacity', 'filter', 'box-shadow', 'background-color', 'border-color', 'color'], `${name}: ${prop}`).toContain(prop)
        }
      }
    }
  })
})
