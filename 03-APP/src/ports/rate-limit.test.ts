import { describe, it, expect } from 'vitest'
import {
  DisabledRateLimitPort, FakeRateLimitPort, SupabaseRateLimitPort, selectRateLimitPort,
  type RateLimitPort,
} from './rate-limit'

const CLAVE = 'sb_secret_de_pruebas'
const config = { url: 'https://proyecto.supabase.co', serviceRoleKey: CLAVE }
const HUELLA = 'a'.repeat(32)
const DESDE = new Date('2026-09-13T12:00:00.000Z')

function espía(status: number, body = '[]') {
  const llamadas: { url: string; init: RequestInit }[] = []
  const impl = async (url: string | URL | Request, init?: RequestInit) => {
    llamadas.push({ url: String(url), init: init ?? {} })
    return new Response(body, { status, headers: { 'Content-Type': 'application/json' } })
  }
  return { llamadas, impl: impl as unknown as typeof fetch }
}

describe('SupabaseRateLimitPort — leer los intentos recientes', () => {
  it('pregunta sólo por esa huella y sólo desde la fecha dada', async () => {
    const { llamadas, impl } = espía(200, '[]')
    await new SupabaseRateLimitPort(config, impl).recentAttempts(HUELLA, DESDE)
    const url = llamadas[0]?.url ?? ''
    expect(url).toContain('/rest/v1/submission_attempts')
    expect(url).toContain(`fingerprint=eq.${HUELLA}`)
    expect(url).toContain(`attempted_at=gte.${encodeURIComponent(DESDE.toISOString())}`)
    expect(url).toContain('select=attempted_at')
  })

  it('devuelve las marcas de tiempo tal cual', async () => {
    const { impl } = espía(200, '[{"attempted_at":"2026-09-14T11:00:00Z"},{"attempted_at":"2026-09-14T11:30:00Z"}]')
    const marcas = await new SupabaseRateLimitPort(config, impl).recentAttempts(HUELLA, DESDE)
    expect(marcas).toEqual(['2026-09-14T11:00:00Z', '2026-09-14T11:30:00Z'])
  })

  it('normaliza la URL igual que el registro', async () => {
    const { llamadas, impl } = espía(200, '[]')
    const port = new SupabaseRateLimitPort(
      { url: 'https://proyecto.supabase.co/rest/v1/', serviceRoleKey: CLAVE }, impl,
    )
    await port.recentAttempts(HUELLA, DESDE)
    expect(llamadas[0]?.url).toContain('https://proyecto.supabase.co/rest/v1/submission_attempts')
    expect(llamadas[0]?.url).not.toContain('/rest/v1/rest/v1/')
  })

  it('un error del servidor LANZA, para que quien llama decida abrir', async () => {
    const { impl } = espía(500, 'boom')
    await expect(new SupabaseRateLimitPort(config, impl).recentAttempts(HUELLA, DESDE))
      .rejects.toThrow(/500/)
  })

  it('el mensaje de error nunca lleva la credencial', async () => {
    const { impl } = espía(500, `explota con ${CLAVE}`)
    await expect(new SupabaseRateLimitPort(config, impl).recentAttempts(HUELLA, DESDE))
      .rejects.not.toThrow(new RegExp(CLAVE))
  })
})

describe('SupabaseRateLimitPort — anotar un intento', () => {
  it('escribe sólo la huella, jamás la dirección ni nada identificativo (CA-L5)', async () => {
    const { llamadas, impl } = espía(201, '')
    await new SupabaseRateLimitPort(config, impl).record(HUELLA)
    const cuerpo = JSON.parse(String(llamadas[0]?.init.body))
    expect(Object.keys(cuerpo)).toEqual(['fingerprint'])
    expect(cuerpo.fingerprint).toBe(HUELLA)
  })

  it('se autentica con la clave de servidor', async () => {
    const { llamadas, impl } = espía(201, '')
    await new SupabaseRateLimitPort(config, impl).record(HUELLA)
    const headers = llamadas[0]?.init.headers as Record<string, string>
    expect(headers.apikey).toBe(CLAVE)
    expect(headers.Authorization).toBe(`Bearer ${CLAVE}`)
  })
})

describe('DisabledRateLimitPort — cuando no hay con qué contar, se abre', () => {
  // Se prueba a través del contrato, no de la clase: lo que importa es que cumpla `RateLimitPort`.
  const desactivado: RateLimitPort = new DisabledRateLimitPort()

  it('no devuelve ningún intento, así que nunca bloquea', async () => {
    expect(await desactivado.recentAttempts(HUELLA, DESDE)).toEqual([])
  })

  it('anotar no hace nada y no rompe', async () => {
    await expect(desactivado.record(HUELLA)).resolves.toBeUndefined()
  })
})

describe('FakeRateLimitPort — el doble con el que se desarrolla', () => {
  it('recuerda lo que se le anota', async () => {
    const port = new FakeRateLimitPort()
    await port.record(HUELLA)
    await port.record(HUELLA)
    expect(await port.recentAttempts(HUELLA, DESDE)).toHaveLength(2)
  })

  it('no mezcla huellas distintas', async () => {
    const port = new FakeRateLimitPort()
    await port.record(HUELLA)
    expect(await port.recentAttempts('b'.repeat(32), DESDE)).toHaveLength(0)
  })
})

describe('selectRateLimitPort — sin credenciales NO hay tope, y se dice', () => {
  const supa = { SUPABASE_URL: 'https://p.supabase.co', SUPABASE_SERVICE_ROLE_KEY: CLAVE }

  it('con credenciales de Supabase, cuenta de verdad', () => {
    expect(selectRateLimitPort({ NODE_ENV: 'production', ...supa }))
      .toBeInstanceOf(SupabaseRateLimitPort)
  })

  /**
   * Aquí NO se sigue la regla F-1 del correo y el registro, y es deliberado: un registro que falla
   * pierde un lead, y por eso grita. Un tope que falla sólo deja pasar un envío de más. Entre perder
   * un lead y aceptar uno de más, se acepta uno de más (CA-L6).
   */
  it('sin credenciales, en producción, se DESACTIVA en vez de bloquear a todo el mundo', () => {
    expect(selectRateLimitPort({ NODE_ENV: 'production' }))
      .toBeInstanceOf(DisabledRateLimitPort)
  })

  it('media credencial no es una credencial', () => {
    expect(selectRateLimitPort({ NODE_ENV: 'production', SUPABASE_URL: 'https://p.supabase.co' }))
      .toBeInstanceOf(DisabledRateLimitPort)
  })

  it('fuera de producción con adaptadores falsos, el doble', () => {
    expect(selectRateLimitPort({ NODE_ENV: 'development', USE_FAKE_ADAPTERS: '1' }))
      .toBeInstanceOf(FakeRateLimitPort)
  })
})
