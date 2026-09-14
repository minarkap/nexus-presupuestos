// Misma barrera que el registro y el tope: este módulo habla con la base de datos, así que un
// componente de cliente que lo importe debe ROMPER la compilación en vez de empaquetar la
// credencial en el navegador. Y aquí importa el doble: por debajo viaja el catálogo entero, con
// multiplicadores, tabla de puntos y umbral (constitution 8).
import 'server-only'
import { validateCatalog } from '@/core/catalog-validation'
import type { LoadedCatalog } from '@/core/catalog-types'
import { normalizeSupabaseUrl } from './registry'
import { CATALOG_SNAPSHOT } from '@/core/catalog.snapshot'

/**
 * De dónde sale el catálogo con el que se calcula cada estimación.
 *
 * **Replegarse es su trabajo, no un accidente.** Si la base no responde, no valida o tarda
 * demasiado, este puerto entrega la foto de la última publicación y lo DICE. Sólo lanza cuando no
 * queda nada que entregar (CA-09): entre no dar cifra y dar una inventada, no se da cifra.
 */
export interface CatalogPort {
  load(): Promise<LoadedCatalog>
}

/**
 * La foto del catálogo tomada al publicar el sitio.
 *
 * `catalog` viaja como `unknown` a propósito: es un fichero generado, y darlo por bueno porque «lo
 * escribimos nosotros» es exactamente la clase de confianza que hace que un fallo aparezca en
 * producción. Se valida igual que lo que viene de la red.
 */
export interface CatalogSnapshot {
  readonly takenAt: string
  readonly catalog: unknown
}

export interface CatalogConfig {
  readonly url: string
  /** Llave de SOLO LECTURA. Nunca la de servicio: con aquélla el sitio podría escribir precios. */
  readonly readKey: string
}

/** Espera máxima de la consulta, en milisegundos (plan §0, clarify C-6). */
export const ESPERA_MÁXIMA_MS = 3000

function mensajeDe(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * Convierte una foto en un catálogo cargado, o en nada.
 *
 * Devuelve `null` —en vez de lanzar— para que quien llama decida: replegarse a la foto es una cosa,
 * quedarse sin nada es otra, y el mensaje de error tiene que poder decir cuál de las dos pasó.
 */
function desdeLaFoto(foto: CatalogSnapshot | null, reason: string): LoadedCatalog | null {
  if (!foto) return null
  const v = validateCatalog(foto.catalog)
  if (!v.ok) return null
  return { catalog: v.catalog, source: 'snapshot', takenAt: foto.takenAt, reason }
}

function sinNadaQueEntregar(motivoVivo: string, foto: CatalogSnapshot | null): never {
  const porLaFoto = foto ? 'la foto tampoco valida' : 'no hay foto'
  throw new Error(
    `No hay ni catálogo vivo ni foto utilizable: ${motivoVivo}; ${porLaFoto}. ` +
      'No se entrega ninguna cifra a propósito — una inventada sería peor.',
  )
}

/**
 * El catálogo vivo, leído de la base de datos en cada cálculo.
 *
 * **Una sola llamada.** La función `catalogo_vigente()` lee las cuatro tablas en una sentencia, así
 * que lo que llega es una instantánea coherente: nunca medio catálogo, nunca una mezcla de dos
 * ediciones (CA-07). Pedir las cuatro tablas por separado habría sido cuatro viajes y cuatro
 * instantáneas distintas.
 *
 * Es el mismo camino que `SupabaseRateLimitPort`: RPC sobre la API REST, sin SDK.
 */
export class SupabaseCatalogPort implements CatalogPort {
  constructor(
    private readonly config: CatalogConfig,
    private readonly snapshot: CatalogSnapshot | null,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly timeoutMs: number = ESPERA_MÁXIMA_MS,
  ) {}

  async load(): Promise<LoadedCatalog> {
    const motivo = await this.intentarVivo()
    if (typeof motivo !== 'string') return motivo

    const conFoto = desdeLaFoto(this.snapshot, motivo)
    if (conFoto) return conFoto
    return sinNadaQueEntregar(motivo, this.snapshot)
  }

  /** Devuelve el catálogo vivo, o la RAZÓN por la que no se pudo. Nunca lanza. */
  private async intentarVivo(): Promise<LoadedCatalog | string> {
    const base = normalizeSupabaseUrl(this.config.url)

    try {
      const res = await this.fetchImpl(`${base}/rest/v1/rpc/catalogo_vigente`, {
        method: 'POST',
        headers: {
          apikey: this.config.readKey,
          Authorization: `Bearer ${this.config.readKey}`,
          'Content-Type': 'application/json',
        },
        body: '{}',
        // Sin esto, una base que acepta la conexión y no contesta deja al visitante esperando
        // indefinidamente. Un fallo limpio es mejor que una espera sin final (clarify C-6).
        signal: AbortSignal.timeout(this.timeoutMs),
      })

      if (!res.ok) return `Supabase respondió ${res.status} al leer el catálogo`

      const json: unknown = await res.json()
      const v = validateCatalog(json)
      if (!v.ok) return `el catálogo vivo no valida: ${v.reason}`

      return { catalog: v.catalog, source: 'live' }
    } catch (e) {
      // `AbortSignal.timeout` llega aquí como un TimeoutError. Se nombra la espera en el mensaje
      // para que quien lea el log no confunda «tardó» con «falló».
      return `no se pudo leer el catálogo (espera máxima ${this.timeoutMs} ms): ${mensajeDe(e)}`
    }
  }
}

/**
 * Sólo la foto. Es lo que se obtiene en desarrollo, sin credenciales.
 *
 * Deliberadamente NO falla a gritos, al revés que el correo y el registro: sin catálogo no hay
 * pantalla de resultado que enseñar, y quien desarrolla no puede trabajar. Lo que sí hace es
 * declararse como foto en cada carga, de modo que el aviso interno lo diga siempre.
 */
export class SnapshotOnlyCatalogPort implements CatalogPort {
  constructor(
    private readonly snapshot: CatalogSnapshot | null,
    private readonly reason: string,
  ) {}

  async load(): Promise<LoadedCatalog> {
    const conFoto = desdeLaFoto(this.snapshot, this.reason)
    if (conFoto) return conFoto
    return sinNadaQueEntregar(this.reason, this.snapshot)
  }
}

/**
 * Elige el puerto según lo que haya en el entorno.
 *
 * **La llave de servicio no sirve aquí, aunque esté presente.** Es una decisión, no un descuido: esa
 * llave se salta las reglas de acceso por diseño, así que usarla para leer el catálogo dejaría al
 * sitio publicado capaz de escribir precios. CA-14 dice que no puede, y la forma de que no pueda es
 * que no tenga con qué.
 */
export function selectCatalogPort(
  env: Record<string, string | undefined>,
  snapshot: CatalogSnapshot | null = null,
  fetchImpl: typeof fetch = fetch,
): CatalogPort {
  const url = env.SUPABASE_URL
  const readKey = env.SUPABASE_CATALOG_READ_KEY

  if (url && readKey) {
    return new SupabaseCatalogPort({ url, readKey }, snapshot, fetchImpl)
  }

  const falta = !url ? 'falta SUPABASE_URL' : 'falta SUPABASE_CATALOG_READ_KEY'
  return new SnapshotOnlyCatalogPort(snapshot, `sin catálogo vivo: ${falta}`)
}

/**
 * El catálogo tal y como lo obtiene la aplicación: puerto elegido del entorno, foto de la última
 * publicación como respaldo.
 *
 * Es el único sitio donde se cablea la foto. Que `selectCatalogPort` la reciba por parámetro en vez
 * de importarla es lo que permite probarlo con fotos inventadas sin tocar la de verdad.
 */
export async function loadCatalog(fetchImpl: typeof fetch = fetch): Promise<LoadedCatalog> {
  return selectCatalogPort(process.env, CATALOG_SNAPSHOT, fetchImpl).load()
}
