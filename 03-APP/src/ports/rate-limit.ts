// Misma barrera de compilación que el registro: este módulo habla con la base de datos con la clave
// de servidor, así que un componente de cliente que lo importe debe romper la compilación, no
// empaquetar la credencial en el navegador.
import 'server-only'
import { normalizeSupabaseUrl, type SupabaseConfig } from './registry'

/**
 * Conteo de intentos de envío por huella de origen.
 *
 * Dos operaciones y ninguna decisión: leer los intentos recientes y anotar uno. **Quién decide si
 * eso pasa del tope es `src/core/rate-limit.ts`**, que es una función pura — el puerto sólo entra y
 * sale de la base de datos.
 *
 * `recentAttempts` **lanza** cuando falla, en vez de devolver una lista vacía. La diferencia importa:
 * una lista vacía significa «no ha habido intentos» y un fallo significa «no lo sé», y quien llama
 * tiene que poder distinguirlos para decidir abrir a conciencia (`CA-L6`).
 */
export interface RateLimitPort {
  recentAttempts(fingerprint: string, since: Date): Promise<readonly string[]>
  record(fingerprint: string): Promise<void>
}

/**
 * El tope apagado. Nunca devuelve intentos, así que nunca bloquea.
 *
 * Es lo que se obtiene cuando faltan credenciales — **deliberadamente al revés que el correo y el
 * registro**, que en producción fallan a gritos (regla `F-1`). El motivo es que el daño es distinto:
 * un registro que falla pierde un lead para siempre; un tope que falla sólo deja pasar un envío de
 * más. Entre perder un lead y aceptar uno de más, se acepta uno de más.
 */
export class DisabledRateLimitPort implements RateLimitPort {
  async recentAttempts(): Promise<readonly string[]> {
    return []
  }
  async record(): Promise<void> {
    // Nada que anotar: no hay dónde.
  }
}

/** El doble con el que se desarrolla sin base de datos. */
export class FakeRateLimitPort implements RateLimitPort {
  private readonly intentos = new Map<string, string[]>()

  async recentAttempts(fingerprint: string, since: Date): Promise<readonly string[]> {
    const todos = this.intentos.get(fingerprint) ?? []
    return todos.filter((s) => new Date(s).getTime() >= since.getTime())
  }

  async record(fingerprint: string): Promise<void> {
    const previos = this.intentos.get(fingerprint) ?? []
    this.intentos.set(fingerprint, [...previos, new Date().toISOString()])
  }
}

/** Conteo real sobre la segunda tabla. Sin SDK, igual que el registro. */
export class SupabaseRateLimitPort implements RateLimitPort {
  constructor(
    private readonly config: SupabaseConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private get base(): string {
    return normalizeSupabaseUrl(this.config.url)
  }

  private get headers(): Record<string, string> {
    return {
      apikey: this.config.serviceRoleKey,
      Authorization: `Bearer ${this.config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Una sola petición para las dos ventanas: se piden las marcas del último día y se cuentan en
   * memoria. Son como mucho quince filas, así que traerlas no cuesta nada y ahorra un viaje.
   */
  async recentAttempts(fingerprint: string, since: Date): Promise<readonly string[]> {
    const url =
      `${this.base}/rest/v1/submission_attempts` +
      `?fingerprint=eq.${encodeURIComponent(fingerprint)}` +
      `&attempted_at=gte.${encodeURIComponent(since.toISOString())}` +
      `&select=attempted_at`

    const res = await this.fetchImpl(url, { headers: this.headers })
    if (!res.ok) throw new Error(`Supabase respondió ${res.status} al contar intentos`)

    const filas = (await res.json()) as { attempted_at: string }[]
    return filas.map((f) => f.attempted_at)
  }

  /** Se escribe la huella y nada más: la fecha la pone la propia base de datos. */
  async record(fingerprint: string): Promise<void> {
    const res = await this.fetchImpl(`${this.base}/rest/v1/submission_attempts`, {
      method: 'POST',
      headers: { ...this.headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ fingerprint }),
    })
    if (!res.ok) throw new Error(`Supabase respondió ${res.status} al anotar el intento`)
  }
}

export interface RateLimitEnv {
  readonly NODE_ENV?: string | undefined
  readonly SUPABASE_URL?: string | undefined
  readonly SUPABASE_SERVICE_ROLE_KEY?: string | undefined
  readonly USE_FAKE_ADAPTERS?: string | undefined
}

export function selectRateLimitPort(env: RateLimitEnv): RateLimitPort {
  const isProd = env.NODE_ENV === 'production'

  if (env.USE_FAKE_ADAPTERS === '1' && !isProd) return new FakeRateLimitPort()

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    return new SupabaseRateLimitPort({
      url: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    })
  }

  return new DisabledRateLimitPort()
}
