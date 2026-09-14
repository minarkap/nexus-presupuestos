import { describe, it, expect } from 'vitest'
import {
  FakeRegistryPort, GoogleSheetsRegistryPort, MisconfiguredRegistryPort,
  SupabaseRegistryPort, selectRegistryPort, toLeadRow,
} from './registry'
import type { LeadRecord } from '@/core/types'

const lead: LeadRecord = {
  submissionId: 'env-123',
  submittedAt: '2026-09-14T10:00:00.000Z',
  contact: { name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme', consent: true },
  answers: {
    challenge: 'ia', need: 'diagnostico', size: '250-999', maturity: 'inicial',
    timing: '3-6m', sponsor: 'si', budget: 'asignado',
  },
  serviceLabel: 'AI Opportunity Assessment',
  rangeText: '28.000 – 35.000 €',
  blockers: ['sin_perfiles'],
  score: { total: 8, breakdown: [{ signal: 'sponsor', answer: 'Identificado y comprometido', points: 3 }] },
}

const CLAVE = 'service-role-secretísima'
const config = { url: 'https://proyecto.supabase.co', serviceRoleKey: CLAVE, table: 'leads' }

/** `fetch` de mentira: captura la petición y devuelve el estado que se le pida. */
function espía(status: number, body = '') {
  const llamadas: { url: string; init: RequestInit }[] = []
  const impl = async (url: string | URL | Request, init?: RequestInit) => {
    llamadas.push({ url: String(url), init: init ?? {} })
    return new Response(body, { status })
  }
  return { llamadas, impl: impl as unknown as typeof fetch }
}

describe('toLeadRow — el lead como fila de base de datos', () => {
  it('lleva el identificador de envío, que es lo que hace idempotente el guardado', () => {
    expect(toLeadRow(lead).submission_id).toBe('env-123')
  })

  it('desglosa el contacto y el consentimiento en columnas propias', () => {
    const fila = toLeadRow(lead)
    expect(fila.contact_name).toBe('Marta Vives')
    expect(fila.contact_email).toBe('marta@acme.ad')
    expect(fila.contact_company).toBe('Acme')
    expect(fila.consent).toBe(true)
  })

  it('guarda las siete respuestas de negocio y los frenos como lista', () => {
    const fila = toLeadRow(lead)
    expect(fila.challenge).toBe('ia')
    expect(fila.need).toBe('diagnostico')
    expect(fila.size).toBe('250-999')
    expect(fila.maturity).toBe('inicial')
    expect(fila.timing).toBe('3-6m')
    expect(fila.sponsor).toBe('si')
    expect(fila.budget).toBe('asignado')
    expect(fila.blockers).toEqual(['sin_perfiles'])
  })

  it('conserva el desglose de puntuación entero, no aplanado a texto', () => {
    const fila = toLeadRow(lead)
    expect(fila.score_total).toBe(8)
    expect(fila.score_breakdown).toEqual([
      { signal: 'sponsor', answer: 'Identificado y comprometido', points: 3 },
    ])
  })

  it('la rama sin catalogar deja nulos explícitos, no cadenas inventadas', () => {
    const fila = toLeadRow({ ...lead, serviceLabel: null, rangeText: null, blockers: [] })
    expect(fila.service_label).toBeNull()
    expect(fila.range_text).toBeNull()
    expect(fila.blockers).toEqual([])
  })
})

describe('SupabaseRegistryPort — la petición que guarda el lead', () => {
  it('escribe en la tabla configurada del proyecto', async () => {
    const { llamadas, impl } = espía(201)
    await new SupabaseRegistryPort(config, impl).append(lead)
    expect(llamadas).toHaveLength(1)
    expect(llamadas[0]?.url).toBe('https://proyecto.supabase.co/rest/v1/leads?on_conflict=submission_id')
    expect(llamadas[0]?.init.method).toBe('POST')
  })

  it('se autentica con la clave de servidor en las dos cabeceras que exige la API', async () => {
    const { llamadas, impl } = espía(201)
    await new SupabaseRegistryPort(config, impl).append(lead)
    const headers = llamadas[0]?.init.headers as Record<string, string>
    expect(headers.apikey).toBe(CLAVE)
    expect(headers.Authorization).toBe(`Bearer ${CLAVE}`)
  })

  it('pide que un envío repetido no cree una segunda fila', async () => {
    const { llamadas, impl } = espía(201)
    await new SupabaseRegistryPort(config, impl).append(lead)
    const headers = llamadas[0]?.init.headers as Record<string, string>
    expect(headers.Prefer).toContain('resolution=ignore-duplicates')
    // Sin nombrar la columna del choque, la cabecera anterior es decorativa: la API devuelve 409
    // en vez de ignorar. Comprobado contra el Supabase real.
    expect(llamadas[0]?.url).toContain('on_conflict=submission_id')
  })

  it('manda la fila completa en el cuerpo', async () => {
    const { llamadas, impl } = espía(201)
    await new SupabaseRegistryPort(config, impl).append(lead)
    expect(JSON.parse(String(llamadas[0]?.init.body))).toEqual(toLeadRow(lead))
  })

  /**
   * El conflicto significa «esta fila ya está», que es exactamente lo que se pedía. Tratarlo como
   * error haría que el aviso interno dijera «no se ha guardado» de un lead que sí está guardado
   * (CA-S3 al revés), que es peor que no avisar.
   */
  it('un envío duplicado es ÉXITO, no fallo: la fila ya existe', async () => {
    const { impl } = espía(409, '{"code":"23505"}')
    await expect(new SupabaseRegistryPort(config, impl).append(lead)).resolves.toBeUndefined()
  })

  it('un error del servidor sí lanza, y dice el código', async () => {
    const { impl } = espía(500, 'boom')
    await expect(new SupabaseRegistryPort(config, impl).append(lead)).rejects.toThrow(/500/)
  })

  it('el mensaje de error NUNCA incluye la clave de servicio (R-S1)', async () => {
    const { impl } = espía(500, `fallo con ${CLAVE} dentro`)
    await expect(new SupabaseRegistryPort(config, impl).append(lead)).rejects.not.toThrow(
      new RegExp(CLAVE),
    )
  })
})

describe('selectRegistryPort — precedencia con Supabase delante', () => {
  const supa = { SUPABASE_URL: 'https://p.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'k' }
  const google = {
    GOOGLE_SHEET_ID: 'sheet123',
    GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'a@b.iam', private_key: 'k' }),
  }

  it('con credenciales de Supabase, en producción, elige Supabase', () => {
    expect(selectRegistryPort({ NODE_ENV: 'production', ...supa }))
      .toBeInstanceOf(SupabaseRegistryPort)
  })

  it('Supabase gana a la hoja de cálculo cuando están las dos', () => {
    expect(selectRegistryPort({ NODE_ENV: 'production', ...supa, ...google }))
      .toBeInstanceOf(SupabaseRegistryPort)
  })

  it('la hoja sigue viva como parche cuando Supabase no está configurado', () => {
    expect(selectRegistryPort({ NODE_ENV: 'production', ...google }))
      .toBeInstanceOf(GoogleSheetsRegistryPort)
  })

  it('media credencial de Supabase no es una credencial', () => {
    expect(selectRegistryPort({ NODE_ENV: 'production', SUPABASE_URL: 'https://p.supabase.co' }))
      .toBeInstanceOf(MisconfiguredRegistryPort)
  })

  it('PRODUCCIÓN sin nada sigue fallando ruidosamente, nunca al falso (F-1, CA-S6)', () => {
    const port = selectRegistryPort({ NODE_ENV: 'production' })
    expect(port).toBeInstanceOf(MisconfiguredRegistryPort)
    expect(port).not.toBeInstanceOf(FakeRegistryPort)
  })

  it('en producción no se puede forzar el falso ni pidiéndolo', () => {
    expect(selectRegistryPort({ NODE_ENV: 'production', USE_FAKE_ADAPTERS: '1' }))
      .not.toBeInstanceOf(FakeRegistryPort)
  })

  it('el motivo del puerto mal configurado nombra a Supabase, que es lo que hay que rellenar', async () => {
    const port = selectRegistryPort({ NODE_ENV: 'production' })
    await expect(port.append(lead)).rejects.toThrow(/SUPABASE/)
  })

  it('usa la tabla por defecto cuando no se configura otra', async () => {
    const { llamadas, impl } = espía(201)
    const port = new SupabaseRegistryPort({ url: config.url, serviceRoleKey: CLAVE }, impl)
    await port.append(lead)
    expect(llamadas[0]?.url).toContain('/rest/v1/leads')
  })
})

describe('La URL del proyecto se normaliza (caso real, 2026-09-14)', () => {
  /**
   * El panel de Supabase ofrece la URL del proyecto y la de la API en sitios distintos, y es fácil
   * pegar la segunda. Pasó de verdad en la puesta en marcha: `SUPABASE_URL` acabó valiendo
   * `https://…supabase.co/rest/v1/`, el adaptador construía `…/rest/v1/rest/v1/leads` y Supabase
   * devolvía 404 «la tabla no existe» — un mensaje que manda a buscar el problema donde no está.
   *
   * Se normaliza en vez de validar y rechazar: las dos URLs son la misma intención escrita de dos
   * maneras, y un fallo de despliegue por una barra de más no es una lección para nadie.
   */
  const casos = [
    ['https://p.supabase.co', 'URL base, la correcta'],
    ['https://p.supabase.co/', 'con barra final'],
    ['https://p.supabase.co/rest/v1', 'con la ruta de la API pegada'],
    ['https://p.supabase.co/rest/v1/', 'con la ruta de la API y barra final'],
  ] as const

  for (const [url, descripción] of casos) {
    it(`${descripción} → siempre la misma dirección`, async () => {
      const { llamadas, impl } = espía(201)
      await new SupabaseRegistryPort({ url, serviceRoleKey: CLAVE }, impl).append(lead)
      expect(llamadas[0]?.url).toBe('https://p.supabase.co/rest/v1/leads?on_conflict=submission_id')
    })
  }

  it('el selector normaliza igual que el adaptador', async () => {
    const port = selectRegistryPort({
      NODE_ENV: 'production',
      SUPABASE_URL: 'https://p.supabase.co/rest/v1/',
      SUPABASE_SERVICE_ROLE_KEY: CLAVE,
    })
    expect(port).toBeInstanceOf(SupabaseRegistryPort)
  })
})
