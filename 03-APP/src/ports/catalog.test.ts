import { describe, it, expect, vi } from 'vitest'
import { SupabaseCatalogPort, SnapshotOnlyCatalogPort, selectCatalogPort } from './catalog'
import { SEED_CATALOG } from '@/core/catalog-seed'

const config = { url: 'https://proyecto.supabase.co', readKey: 'sb_publishable_x' }
const FOTO = { takenAt: '2026-09-01T00:00:00.000Z', catalog: SEED_CATALOG as unknown }

function respuesta(body: unknown, status = 200): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })) as unknown as typeof fetch
}

describe('SupabaseCatalogPort — el camino bueno', () => {
  it('devuelve el catálogo vivo cuando la base responde bien', async () => {
    const port = new SupabaseCatalogPort(config, FOTO, respuesta(SEED_CATALOG))
    const r = await port.load()
    expect(r.source).toBe('live')
    expect(r.catalog.services.ai_opportunity_assessment.officialMin).toBe(18000)
  })

  it('un cambio en la base llega al catálogo devuelto (CA-02)', async () => {
    const cambiado = JSON.parse(JSON.stringify(SEED_CATALOG)) as typeof SEED_CATALOG
    ;(cambiado.services.ai_opportunity_assessment as { officialMin: number }).officialMin = 19000
    const port = new SupabaseCatalogPort(config, FOTO, respuesta(cambiado))
    const r = await port.load()
    expect(r.source).toBe('live')
    expect(r.catalog.services.ai_opportunity_assessment.officialMin).toBe(19000)
  })

  it('hace UNA sola llamada de red por carga', async () => {
    const espía = vi.fn(respuesta(SEED_CATALOG))
    await new SupabaseCatalogPort(config, FOTO, espía as unknown as typeof fetch).load()
    expect(espía).toHaveBeenCalledTimes(1)
  })
})

describe('SupabaseCatalogPort — se repliega a la foto (CA-06, CA-07)', () => {
  it('CA-06 — la base responde con error', async () => {
    const port = new SupabaseCatalogPort(config, FOTO, respuesta({ message: 'boom' }, 500))
    const r = await port.load()
    expect(r.source).toBe('snapshot')
    if (r.source === 'snapshot') {
      expect(r.takenAt).toBe('2026-09-01T00:00:00.000Z')
      expect(r.reason).toMatch(/500/)
    }
  })

  it('CA-06 — la red se cae del todo', async () => {
    const rota = (async () => {
      throw new Error('ECONNREFUSED')
    }) as unknown as typeof fetch
    const r = await new SupabaseCatalogPort(config, FOTO, rota).load()
    expect(r.source).toBe('snapshot')
    if (r.source === 'snapshot') expect(r.reason).toMatch(/ECONNREFUSED/)
  })

  it('CA-07 — la base responde, pero con un catálogo que no valida', async () => {
    const roto = JSON.parse(JSON.stringify(SEED_CATALOG)) as Record<string, unknown>
    delete (roto.services as Record<string, unknown>).esg_strategy_compliance

    const r = await new SupabaseCatalogPort(config, FOTO, respuesta(roto)).load()
    expect(r.source).toBe('snapshot')
    if (r.source === 'snapshot') expect(r.reason).toMatch(/esg_strategy_compliance/)
    // Y no se ha adoptado NADA del catálogo inválido: los seis siguen ahí.
    expect(Object.keys(r.catalog.services)).toHaveLength(6)
  })

  it('CA-07 — la base responde algo que ni siquiera es JSON', async () => {
    const basura = (async () =>
      new Response('<html>502 Bad Gateway</html>', { status: 200 })) as unknown as typeof fetch
    const r = await new SupabaseCatalogPort(config, FOTO, basura).load()
    expect(r.source).toBe('snapshot')
  })
})

describe('SupabaseCatalogPort — la espera máxima (CA-13)', () => {
  it('a los 3 segundos deja de esperar y usa la foto', async () => {
    vi.useFakeTimers()
    try {
      // Una base que acepta la conexión y no contesta jamás. Sin tope, esto colgaría al visitante
      // indefinidamente, que es peor que un fallo limpio (clarify C-6).
      const muda = ((_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('The operation was aborted')))
        })) as unknown as typeof fetch

      const port = new SupabaseCatalogPort(config, FOTO, muda, 3000)
      const prometido = port.load()
      await vi.advanceTimersByTimeAsync(3001)
      const r = await prometido

      expect(r.source).toBe('snapshot')
      if (r.source === 'snapshot') expect(r.reason).toMatch(/3000|abort/i)
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('Sin catálogo vivo Y sin foto utilizable (CA-09)', () => {
  it('lanza en vez de inventarse un catálogo', async () => {
    const rota = (async () => {
      throw new Error('sin red')
    }) as unknown as typeof fetch
    const fotoRota = { takenAt: '2026-09-01T00:00:00.000Z', catalog: { services: 'no' } }

    await expect(new SupabaseCatalogPort(config, fotoRota, rota).load()).rejects.toThrow(
      /ni catálogo vivo ni foto/i,
    )
  })

  it('lanza también si no hay foto ninguna', async () => {
    const rota = (async () => {
      throw new Error('sin red')
    }) as unknown as typeof fetch
    await expect(new SupabaseCatalogPort(config, null, rota).load()).rejects.toThrow(
      /ni catálogo vivo ni foto/i,
    )
  })
})

describe('SnapshotOnlyCatalogPort — el doble con el que se desarrolla sin base', () => {
  it('devuelve siempre la foto, declarándola como tal', async () => {
    const r = await new SnapshotOnlyCatalogPort(FOTO, 'sin credenciales').load()
    expect(r.source).toBe('snapshot')
    if (r.source === 'snapshot') expect(r.reason).toBe('sin credenciales')
  })
})

describe('selectCatalogPort — qué puerto sale de cada entorno', () => {
  it('con credenciales, el de Supabase', () => {
    const p = selectCatalogPort({ SUPABASE_URL: 'https://x.supabase.co', SUPABASE_CATALOG_READ_KEY: 'k' })
    expect(p).toBeInstanceOf(SupabaseCatalogPort)
  })

  it('sin credenciales, el de la foto: en desarrollo se trabaja sin base', () => {
    expect(selectCatalogPort({})).toBeInstanceOf(SnapshotOnlyCatalogPort)
  })

  it('NUNCA usa la clave de servicio, aunque esté a mano (CA-14)', () => {
    // La clave de servicio se salta las reglas de acceso por diseño: con ella el sitio PODRÍA
    // escribir precios. Que esté en el entorno no la convierte en la llave de este puerto.
    const p = selectCatalogPort({
      SUPABASE_URL: 'https://x.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_peligrosa',
    })
    expect(p).toBeInstanceOf(SnapshotOnlyCatalogPort)
  })
})
