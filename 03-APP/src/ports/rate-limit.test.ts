import { describe, it, expect } from 'vitest'
import {
  DisabledRateLimitPort, FakeRateLimitPort, SupabaseRateLimitPort, selectRateLimitPort,
  type RateLimitPort,
} from './rate-limit'

const CLAVE = 'sb_secret_de_pruebas'
const config = { url: 'https://proyecto.supabase.co', serviceRoleKey: CLAVE }
const HUELLA = 'a'.repeat(32)

function espía(status: number, body = '[]') {
  const llamadas: { url: string; init: RequestInit }[] = []
  const impl = async (url: string | URL | Request, init?: RequestInit) => {
    llamadas.push({ url: String(url), init: init ?? {} })
    return new Response(body, { status, headers: { 'Content-Type': 'application/json' } })
  }
  return { llamadas, impl: impl as unknown as typeof fetch }
}

const CUENTAS = '[{"en_hora":3,"en_dia":7}]'

describe('SupabaseRateLimitPort — anotar y contar en UNA operación', () => {
  /**
   * Que sea una sola llamada es el arreglo, no un detalle: dos viajes —leer y luego anotar— es un
   * comprobar-luego-actuar, y treinta peticiones simultáneas lo atraviesan entero.
   */
  it('llama a la función que inserta y cuenta en la misma transacción', async () => {
    const { llamadas, impl } = espía(200, CUENTAS)
    await new SupabaseRateLimitPort(config, impl).registerAndCount(HUELLA)
    expect(llamadas).toHaveLength(1)
    expect(llamadas[0]?.url).toContain('/rest/v1/rpc/registrar_intento')
    expect(llamadas[0]?.init.method).toBe('POST')
  })

  it('manda sólo la huella, jamás la dirección ni nada identificativo (CA-L5)', async () => {
    const { llamadas, impl } = espía(200, CUENTAS)
    await new SupabaseRateLimitPort(config, impl).registerAndCount(HUELLA)
    const cuerpo = JSON.parse(String(llamadas[0]?.init.body))
    expect(Object.keys(cuerpo)).toEqual(['huella'])
    expect(cuerpo.huella).toBe(HUELLA)
  })

  it('devuelve los dos contadores', async () => {
    const { impl } = espía(200, CUENTAS)
    const c = await new SupabaseRateLimitPort(config, impl).registerAndCount(HUELLA)
    expect(c).toEqual({ enHora: 3, enDia: 7 })
  })

  it('se autentica con la clave de servidor', async () => {
    const { llamadas, impl } = espía(200, CUENTAS)
    await new SupabaseRateLimitPort(config, impl).registerAndCount(HUELLA)
    const headers = llamadas[0]?.init.headers as Record<string, string>
    expect(headers.apikey).toBe(CLAVE)
    expect(headers.Authorization).toBe(`Bearer ${CLAVE}`)
  })

  it('normaliza la URL igual que el registro', async () => {
    const { llamadas, impl } = espía(200, CUENTAS)
    const port = new SupabaseRateLimitPort(
      { url: 'https://proyecto.supabase.co/rest/v1/', serviceRoleKey: CLAVE }, impl,
    )
    await port.registerAndCount(HUELLA)
    expect(llamadas[0]?.url).not.toContain('/rest/v1/rest/v1/')
  })

  it('un error del servidor LANZA, para que quien llama decida abrir', async () => {
    const { impl } = espía(500, 'boom')
    await expect(new SupabaseRateLimitPort(config, impl).registerAndCount(HUELLA))
      .rejects.toThrow(/500/)
  })

  it('una respuesta vacía también lanza: no se inventan contadores a cero', async () => {
    const { impl } = espía(200, '[]')
    await expect(new SupabaseRateLimitPort(config, impl).registerAndCount(HUELLA))
      .rejects.toThrow()
  })

  it('el mensaje de error nunca lleva la credencial', async () => {
    const { impl } = espía(500, `explota con ${CLAVE}`)
    await expect(new SupabaseRateLimitPort(config, impl).registerAndCount(HUELLA))
      .rejects.not.toThrow(new RegExp(CLAVE))
  })
})

describe('DisabledRateLimitPort — cuando no hay con qué contar, se abre', () => {
  // Se prueba a través del contrato, no de la clase: lo que importa es que cumpla `RateLimitPort`.
  const desactivado: RateLimitPort = new DisabledRateLimitPort()

  it('devuelve contadores a cero, así que nunca bloquea', async () => {
    expect(await desactivado.registerAndCount(HUELLA)).toEqual({ enHora: 0, enDia: 0 })
  })
})

describe('FakeRateLimitPort — el doble con el que se desarrolla', () => {
  it('cuenta hacia arriba con cada intento', async () => {
    const port = new FakeRateLimitPort()
    expect(await port.registerAndCount(HUELLA)).toMatchObject({ enHora: 1 })
    expect(await port.registerAndCount(HUELLA)).toMatchObject({ enHora: 2 })
  })

  it('no mezcla huellas distintas', async () => {
    const port = new FakeRateLimitPort()
    await port.registerAndCount(HUELLA)
    expect(await port.registerAndCount('b'.repeat(32))).toMatchObject({ enHora: 1 })
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
