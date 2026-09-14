/**
 * Toma la FOTO del catálogo y la deja cocida dentro de la publicación.
 *
 * Es la red de la que depende que un corte de Supabase no deje al visitante sin cifra
 * (spec `catalogo-en-supabase`, CA-06). Corre en `prebuild`, antes de compilar.
 *
 * Regla dura (CA-08): **en producción, sin foto no se publica.** Publicar sin red dejaría el sitio
 * sin lo que la spec promete, y hacerlo en silencio es peor que no publicar. En desarrollo, en
 * cambio, se escribe la semilla y se avisa a gritos: quien desarrolla no puede quedarse sin
 * pantalla de resultado porque no tenga credenciales.
 *
 * Uso:  node scripts/snapshot-catalog.ts
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { validateCatalog } from '../src/core/catalog-validation.ts'
import { SEED_CATALOG } from '../src/core/catalog-seed.ts'

const AQUÍ = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUÍ, '..', 'src', 'core', 'catalog.snapshot.ts')

/**
 * Carga `.env.local` si existe. Node lo hace nativo desde la 20.6; sin esto, la puerta pediría las
 * credenciales por el entorno del shell y en local nunca las encontraría, que es la forma más
 * tonta de que una puerta quede roja para siempre y alguien acabe quitándola.
 */
try {
  process.loadEnvFile(new URL('../.env.local', import.meta.url).pathname)
} catch {
  // No hay .env.local. Es normal en integración continua, donde las variables vienen del entorno.
}

const ESPERA_MS = 10_000

/** ¿Es esto una publicación de verdad? Entonces la foto no es opcional. */
function esProducción(): boolean {
  return (
    process.env.VERCEL === '1' ||
    process.env.NODE_ENV === 'production' ||
    process.env.NEXUS_REQUIRE_LIVE_CATALOG === '1'
  )
}

function morir(mensaje: string): never {
  console.error('')
  console.error('✗ NO SE PUDO TOMAR LA FOTO DEL CATÁLOGO — la publicación se detiene aquí.')
  console.error(`  ${mensaje}`)
  console.error('')
  console.error('  Publicar sin foto dejaría el sitio sin respaldo: el día que Supabase no responda,')
  console.error('  el formulario dejaría de dar cifras en vez de replegarse. Es CA-08 de la spec')
  console.error('  `catalogo-en-supabase`, y es a propósito.')
  console.error('')
  console.error('  Si esto es desarrollo y no una publicación, quita NEXUS_REQUIRE_LIVE_CATALOG.')
  console.error('')
  process.exit(1)
}

function escribir(catalogo: unknown, takenAt: string, procedencia: string): void {
  const cuerpo = `// ─────────────────────────────────────────────────────────────────────────────
// FICHERO GENERADO — no editar a mano.
// Lo escribe \`scripts/snapshot-catalog.ts\` en cada publicación (\`prebuild\`).
//
// Es la FOTO del catálogo: lo que se usa para calcular cuando la base de datos no responde,
// no valida o tarda más de la cuenta. El aviso interno de cada lead declara que se usó y de
// cuándo es (spec \`catalogo-en-supabase\`, CA-06).
//
// Procedencia de esta foto: ${procedencia}
// ─────────────────────────────────────────────────────────────────────────────

// Lleva multiplicadores, tabla de puntos y umbral: no puede cruzar al navegador (constitution 8).
import 'server-only'
import type { CatalogSnapshot } from '@/ports/catalog'

export const CATALOG_SNAPSHOT: CatalogSnapshot = {
  takenAt: ${JSON.stringify(takenAt)},
  catalog: ${JSON.stringify(catalogo, null, 2).split('\n').join('\n  ')},
}
`
  writeFileSync(DESTINO, cuerpo, 'utf8')
}

async function leerVivo(url: string, readKey: string): Promise<unknown> {
  const base = url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '')
  const res = await fetch(`${base}/rest/v1/rpc/catalogo_vigente`, {
    method: 'POST',
    headers: {
      apikey: readKey,
      Authorization: `Bearer ${readKey}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
    signal: AbortSignal.timeout(ESPERA_MS),
  })
  if (!res.ok) morir(`Supabase respondió ${res.status} al leer el catálogo.`)
  return res.json()
}

const url = process.env.SUPABASE_URL
const readKey = process.env.SUPABASE_CATALOG_READ_KEY

if (!url || !readKey) {
  if (esProducción()) {
    morir(`Faltan credenciales de lectura: ${!url ? 'SUPABASE_URL' : 'SUPABASE_CATALOG_READ_KEY'}.`)
  }
  // Desarrollo. Se escribe la semilla, PERO se dice en voz alta: una foto de la semilla no refleja
  // ningún cambio de precio hecho en la base, y confundirla con la de verdad sería el fallo.
  console.warn('')
  console.warn('⚠️  Sin credenciales de lectura: la foto del catálogo se toma de la SEMILLA del código.')
  console.warn('    Vale para desarrollo. En una publicación real esto habría fallado (CA-08).')
  console.warn('')
  // Marca FIJA, no `new Date()`. Con una fecha viva, cada `npm run build` local reescribiría este
  // fichero con una marca nueva y ensuciaría el repositorio en cada compilación — y un fichero que
  // sale sucio siempre acaba commiteado sin mirar. Con la marca fija, la foto sólo cambia cuando
  // cambia la semilla, que es cuando de verdad ha cambiado algo.
  escribir(SEED_CATALOG, 'semilla del código (sin fecha de toma)', 'semilla del código (sin credenciales)')
  process.exit(0)
}

const crudo = await leerVivo(url, readKey)
const v = validateCatalog(crudo)
if (!v.ok) morir(`El catálogo vivo no es válido: ${v.reason}`)

const takenAt = new Date().toISOString()
escribir(v.catalog, takenAt, 'catálogo vivo de Supabase')
console.log(`✓ Foto del catálogo tomada del catálogo vivo — ${takenAt}`)
