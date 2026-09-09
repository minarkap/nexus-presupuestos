import 'server-only'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Lee un token del ÚNICO fichero de estilo (constitution 31) para los sitios donde el CSS no llega:
 * la imagen Open Graph (Satori no resuelve custom properties). Así el valor sigue teniendo una sola
 * fuente de verdad en vez de un hex copiado a mano.
 */
let cache: Map<string, string> | null = null

function load(): Map<string, string> {
  if (cache) return cache
  const css = readFileSync(join(process.cwd(), 'src/app/tokens.css'), 'utf8')
  const map = new Map<string, string>()
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const name = m[1]
    const value = m[2]
    if (name && value) map.set(name, value.trim())
  }
  cache = map
  return map
}

export function readToken(name: string): string {
  const value = load().get(name)
  if (!value) throw new Error(`Token desconocido: ${name}`)
  return value
}
