// Misma barrera de compilación que el registro: este módulo habla con la base de datos con la clave
// de servidor, así que un componente de cliente que lo importe debe romper la compilación, no
// empaquetar la credencial en el navegador.
import 'server-only'
import { normalizeSupabaseUrl, type SupabaseConfig } from './registry'
import type { AttemptCounts } from '@/core/rate-limit'

/**
 * Conteo de intentos de envío por huella de origen.
 *
 * **Una sola operación**: anotar el intento y devolver los contadores resultantes. No son dos pasos
 * a propósito — leer y luego escribir en dos viajes es un *comprobar-luego-actuar*, y la revisión
 * adversarial del 2026-09-14 demostró que treinta peticiones simultáneas lo atraviesan entero. La
 * atomicidad la da la base de datos; aquí sólo se la pide.
 *
 * Quién decide si los contadores pasan del tope es `src/core/rate-limit.ts`, que es puro.
 *
 * **Lanza** cuando falla, en vez de devolver ceros. La diferencia importa: unos contadores a cero
 * significan «no ha habido intentos» y un fallo significa «no lo sé», y quien llama tiene que poder
 * distinguirlos para decidir abrir a conciencia (`CA-L6`).
 */
export interface RateLimitPort {
  registerAndCount(fingerprint: string): Promise<AttemptCounts>
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
  async registerAndCount(): Promise<AttemptCounts> {
    return { enHora: 0, enDia: 0 }
  }
}

/** El doble con el que se desarrolla sin base de datos. */
export class FakeRateLimitPort implements RateLimitPort {
  private readonly cuenta = new Map<string, number>()

  async registerAndCount(fingerprint: string): Promise<AttemptCounts> {
    const n = (this.cuenta.get(fingerprint) ?? 0) + 1
    this.cuenta.set(fingerprint, n)
    // El doble no distingue ventanas: en pruebas todo ocurre en el mismo instante.
    return { enHora: n, enDia: n }
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
   * Anota el intento y devuelve los contadores, **en una sola transacción de la base de datos**.
   *
   * La función `registrar_intento` inserta y cuenta dentro de la misma sentencia, así que dos
   * peticiones simultáneas no pueden ver ambas el contador de antes: la segunda ve lo que anotó la
   * primera. Es lo que convierte el tope en un tope de verdad.
   */
  async registerAndCount(fingerprint: string): Promise<AttemptCounts> {
    const res = await this.fetchImpl(`${this.base}/rest/v1/rpc/registrar_intento`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ huella: fingerprint }),
    })
    if (!res.ok) throw new Error(`Supabase respondió ${res.status} al contar intentos`)

    const filas = (await res.json()) as { en_hora: number; en_dia: number }[]
    const fila = filas[0]
    if (!fila) throw new Error('Supabase no devolvió contadores de intentos')
    return { enHora: Number(fila.en_hora), enDia: Number(fila.en_dia) }
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
