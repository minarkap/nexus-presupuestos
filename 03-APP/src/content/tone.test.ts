import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PROHIBIDAS } from './tone'

const dir = __dirname
const contentFiles = readdirSync(dir).filter((f) => /\.ts$/.test(f) && !/\.test\.ts$/.test(f) && f !== 'tone.ts').map((f) => join(dir, f))
const coreCopy = ['outcome.ts', 'proposal.ts', 'submit.ts'].map((f) => join(dir, '../core', f))

/**
 * Las superficies del acta de tono que NO viven en `src/content/`.
 *
 * Estaban fuera de esta prueba hasta el 2026-09-14, mientras la propia acta afirmaba que «las
 * pruebas automáticas cazan el léxico prohibido» en las catorce superficies. Cazaban ocho. Ninguna
 * de las seis descubiertas tenía un hallazgo —se comprobaron una por una antes de añadirlas—, así
 * que esto no arregla un defecto: arregla una prueba que decía cubrir más de lo que cubría, que es
 * la clase de fallo que no se nota hasta que alguien escribe «disruptivo» en una etiqueta.
 */
const otrasSuperficies = [
  '../core/options.ts',              // S8  etiquetas de las opciones
  '../components/FormWizard.tsx',    // S7 y S13  enunciados de las nueve pantallas
  '../components/ResultScreen.tsx',  // S9  las tres pantallas de resultado
  '../seo/metadata.ts',              // S12 títulos y descripciones
  '../app/llms.txt/route.ts',        // S12 texto para modelos
  '../app/opengraph-image.tsx',      // S12 tarjeta social
].map((f) => join(dir, f))
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

describe('Tono de marca (constitution 27, 36 · CA-04, CA-05)', () => {
  it.each([...contentFiles, ...coreCopy, ...otrasSuperficies].map((f) => [f.split('/').slice(-2).join('/'), f]))('%s no contiene léxico prohibido', (_n, f) => {
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
