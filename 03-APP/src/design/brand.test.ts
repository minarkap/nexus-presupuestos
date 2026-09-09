import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = join(__dirname, '..')
function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|css)$/.test(e)) out.push(p)
  }
  return out
}
/**
 * El snapshot del diseño anterior (`app/antes/_legacy/`) queda FUERA de estas comprobaciones a
 * propósito: es una copia congelada del estado del 2026-08-26 para poder enseñar el antes y el
 * después, y contiene por definición la marca anterior y sus hex. No es copy vivo ni fuente de
 * estilo de nada; su ruta no se indexa y no entra en el sitemap. Si algún día se borra el museo,
 * esta exclusión se borra con él.
 */
const MUSEO = 'app/antes/_legacy'
const files = walk(ROOT).filter((f) => !/\.test\.tsx?$/.test(f) && !f.includes(MUSEO))
const rel = (f: string) => relative(ROOT, f)

describe('Marca (constitution 30, 31 · CA-01, CA-05)', () => {
  it('ningún fichero de la app menciona la marca anterior', () => {
    const hits = files.filter((f) => readFileSync(f, 'utf8').includes('Strategy & Technology')).map(rel)
    expect(hits).toEqual([])
  })
  it('ningún color hexadecimal fuera de tokens.css', () => {
    const hits = files
      .filter((f) => !f.endsWith('app/tokens.css'))
      .filter((f) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(f, 'utf8').replace(/\/\/.*$/gm, '').replace(/https?:\/\/\S+/g, '').replace(/#[a-z][\w-]*/g, '')))
      .map(rel)
    expect(hits).toEqual([])
  })
  it('sin emoji en el contenido', () => {
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u
    const hits = files.filter((f) => f.includes('/content/')).filter((f) => emoji.test(readFileSync(f, 'utf8'))).map(rel)
    expect(hits).toEqual([])
  })
  it('ninguna imagen fuera de public/brand (sin stock)', () => {
    const hits = files.filter((f) => /<img|next\/image|<Image/.test(readFileSync(f, 'utf8'))).filter((f) => {
      const src = readFileSync(f, 'utf8')
      const srcs = [...src.matchAll(/src=\{?["'`]([^"'`]+)["'`]/g)].map((m) => m[1]!)
      return srcs.some((s) => !s.startsWith('/brand/') && !s.startsWith('data:') && !s.startsWith('{'))
    }).map(rel)
    expect(hits).toEqual([])
  })
})
