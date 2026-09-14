/**
 * LA PUERTA DEL CATÁLOGO VIVO.
 *
 * Las pruebas de `npm test` verifican el método contra la semilla del código. Esta puerta verifica
 * los PRECIOS contra la base de datos real, que es donde ahora viven y donde pueden cambiar sin que
 * nadie toque una línea de código.
 *
 * Comprueba dos cosas:
 *   1. El caso de referencia del principio 16 — 600 empleados, madurez inicial, arranque en 4 meses,
 *      diagnóstico de IA → EXACTAMENTE 28.000 – 35.000 € (CA-01, CA-19).
 *   2. La exhaustiva del principio 15 — ninguna combinación se sale de su rango oficial (CA-16).
 *
 * **Nunca se salta en silencio** (CA-15). Si no se puede alcanzar el catálogo vivo, esta puerta
 * FALLA diciendo que no pudo ejecutarse. Una puerta que se salta a sí misma cuando falta una
 * credencial no es una puerta: es un adorno que da luz verde por no haber mirado.
 *
 * Uso:  node scripts/catalog-gate.ts
 */
import { validateCatalog } from '../src/core/catalog-validation.ts'
import { priceService } from '../src/core/pricing.ts'
import { resolveService } from '../src/core/service-resolver.ts'
import type { Catalog } from '../src/core/catalog-types.ts'
import type { Challenge, Maturity, Need, Size, Timing } from '../src/core/types.ts'

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

/** El caso de referencia, literal. Si esto cambia, cambia la constitución, no este fichero. */
const REFERENCIA = {
  challenge: 'ia' as Challenge,
  need: 'diagnostico' as Need,
  size: '250-999' as Size, // 600 empleados
  maturity: 'inicial' as Maturity,
  timing: '3-6m' as Timing, // arranque en 4 meses
  esperado: { low: 28000, high: 35000 },
}

function morir(mensaje: string, detalle: string[] = []): never {
  console.error('')
  console.error('═══ PUERTA DEL CATÁLOGO: ROJA ═══')
  console.error('')
  console.error(`  ${mensaje}`)
  for (const d of detalle) console.error(`    ${d}`)
  console.error('')
  process.exit(1)
}

async function catálogoVivo(): Promise<Catalog> {
  const url = process.env.SUPABASE_URL
  const readKey = process.env.SUPABASE_CATALOG_READ_KEY

  if (!url || !readKey) {
    // CA-15. Esto NO es «no aplica»: es «no lo sé», y no saberlo no puede salir en verde.
    morir('NO SE PUDO EJECUTAR: no hay forma de alcanzar el catálogo vivo.', [
      `Falta ${!url ? 'SUPABASE_URL' : 'SUPABASE_CATALOG_READ_KEY'}.`,
      '',
      'Esta puerta no se salta cuando faltan credenciales, a propósito. Desde que el catálogo',
      'vive en la base de datos, un precio puede cambiar sin que nadie toque el código, y esta',
      'es la única comprobación que lo vería. Saltarla sería declarar verde algo que no se miró.',
    ])
  }

  const base = url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '')
  let res: Response
  try {
    res = await fetch(`${base}/rest/v1/rpc/catalogo_vigente`, {
      method: 'POST',
      headers: {
        apikey: readKey,
        Authorization: `Bearer ${readKey}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
      signal: AbortSignal.timeout(ESPERA_MS),
    })
  } catch (e) {
    morir('NO SE PUDO EJECUTAR: la base de datos no respondió.', [
      e instanceof Error ? e.message : String(e),
    ])
  }

  if (!res.ok) morir(`NO SE PUDO EJECUTAR: Supabase respondió ${res.status}.`)

  const v = validateCatalog(await res.json())
  if (!v.ok) morir('El catálogo vivo NO ES VÁLIDO.', [v.reason])
  return v.catalog
}

const catalog = await catálogoVivo()

// ── 1. El caso de referencia (constitution 16 · CA-01 · CA-19) ────────────────────────────────
const r = resolveService(catalog, REFERENCIA.challenge, REFERENCIA.need)
if (r.kind !== 'service') morir('El caso de referencia ya no resuelve a ningún servicio.')

const precio = priceService(
  catalog,
  r.service,
  REFERENCIA.size,
  REFERENCIA.maturity,
  REFERENCIA.timing,
)

if (precio.low !== REFERENCIA.esperado.low || precio.high !== REFERENCIA.esperado.high) {
  morir('EL CASO DE REFERENCIA HA CAMBIADO.', [
    `Esperado: ${REFERENCIA.esperado.low} – ${REFERENCIA.esperado.high} €`,
    `Obtenido: ${precio.low} – ${precio.high} €`,
    '',
    'QUÉ HACER — y esto importa:',
    '  · Si el precio se cambió A PROPÓSITO en la base de datos, hay que actualizar la cifra',
    '    esperada aquí Y en el principio 16 de la constitución, y explicar el cambio en el commit.',
    '  · Si NADIE cambió nada a propósito, algo se ha movido solo y hay que averiguar qué antes',
    '    de seguir.',
    '',
    'Lo que NUNCA es la respuesta es borrar esta comprobación. Existe justamente para que un',
    'cambio de precio no pase inadvertido, así que verla roja es que está funcionando.',
  ])
}

// ── 2. La exhaustiva (constitution 15 · CA-16) ────────────────────────────────────────────────
const RETOS: Challenge[] = ['ia', 'ciberseguridad', 'esg', 'estrategia_operaciones']
const NECESIDADES: (Need | null)[] = [null, 'diagnostico', 'implantacion', 'acompanamiento', 'desarrollo']
const TAMAÑOS: Size[] = ['<50', '50-249', '250-999', '>=1000']
const MADUREZ: Maturity[] = ['inicial', 'en_desarrollo', 'avanzada']
const PLAZOS: Timing[] = ['<3m', '3-6m', '>6m']

const violaciones: string[] = []
let combinaciones = 0

for (const challenge of RETOS) {
  for (const need of NECESIDADES) {
    const res = resolveService(catalog, challenge, need)
    if (res.kind !== 'service') continue
    const s = res.service

    for (const size of TAMAÑOS) {
      for (const maturity of MADUREZ) {
        for (const timing of PLAZOS) {
          combinaciones += 1
          const p = priceService(catalog, s, size, maturity, timing)
          const dónde = `${s.id}/${size}/${maturity}/${timing}`

          if (p.low < s.officialMin) violaciones.push(`${dónde}: ${p.low} < mínimo ${s.officialMin}`)
          if (s.officialMax !== null && p.high !== null && p.high > s.officialMax) {
            violaciones.push(`${dónde}: ${p.high} > máximo ${s.officialMax}`)
          }
          if (p.high !== null && p.low > p.high) violaciones.push(`${dónde}: mínimo por encima del máximo`)
          if (s.openEnded && p.high !== null) violaciones.push(`${dónde}: rango abierto con techo publicado`)
        }
      }
    }
  }
}

if (violaciones.length > 0) {
  morir(
    `${violaciones.length} combinaciones se salen del rango oficial con el catálogo vivo (CA-16).`,
    violaciones.slice(0, 10),
  )
}

console.log('')
console.log('═══ PUERTA DEL CATÁLOGO: VERDE ═══')
console.log(`  · Caso de referencia: ${precio.low} – ${precio.high} € (constitution 16)`)
console.log(`  · Exhaustiva: ${combinaciones} combinaciones, ninguna fuera de rango (constitution 15)`)
console.log(`  · Catálogo vivo, caducidad declarada: ${catalog.expiresOn}`)
console.log('')
