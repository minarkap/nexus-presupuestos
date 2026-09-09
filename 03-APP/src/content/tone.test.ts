import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PROHIBIDAS } from './tone'

const dir = __dirname
const contentFiles = readdirSync(dir).filter((f) => /\.ts$/.test(f) && !/\.test\.ts$/.test(f) && f !== 'tone.ts').map((f) => join(dir, f))
const coreCopy = ['outcome.ts', 'proposal.ts', 'submit.ts'].map((f) => join(dir, '../core', f))
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

describe('Tono de marca (constitution 27, 36 · CA-04, CA-05)', () => {
  it.each([...contentFiles, ...coreCopy].map((f) => [f.split('/').slice(-2).join('/'), f]))('%s no contiene léxico prohibido', (_n, f) => {
    const text = norm(readFileSync(f, 'utf8'))
    const hits = PROHIBIDAS.filter((re) => new RegExp(norm(re.source), re.flags).test(text)).map(String)
    expect(hits).toEqual([])
  })
  it('toda cifra en euros del contenido va acompañada de «orientativo» en el mismo fichero', () => {
    for (const f of contentFiles) {
      const text = readFileSync(f, 'utf8')
      if (/\d\s?€|€\s?\d|\beuros?\b/.test(text)) expect(text, f).toMatch(/orientativ/i)
    }
  })
  it('no promete plazos ni resultados', () => {
    for (const f of contentFiles) {
      const text = readFileSync(f, 'utf8')
      expect(text, f).not.toMatch(/garantiz|en \d+ (semanas|días|meses) (lo|te|os)/i)
    }
  })
})
