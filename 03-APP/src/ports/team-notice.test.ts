import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  FakeTeamNoticePort, OffTeamNoticePort, N8nWebhookTeamNoticePort, selectTeamNoticePort,
} from './team-notice'
import type { LeadNoticeV1 } from '@/core/team-notice'

const aviso: LeadNoticeV1 = {
  version: 1, submission_id: 'env-9', submitted_at: '2026-09-30T10:00:00.000Z',
  contact: { name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme' },
  service_label: 'AI Opportunity Assessment', range_text: '28.000 – 35.000 €',
  score: { total: 9, breakdown: [] }, outcome_kind: 'qualified', booking_offered: true,
  client_email: 'ok', registry: 'ok',
}
const SECRETO = 'secreto-del-webhook-que-no-debe-salir'
const URL_W1 = 'https://nexus.example/webhook/nexus/lead'

function espía(respuesta: () => Promise<Response>) {
  const llamadas: { url: string; init: RequestInit }[] = []
  const impl = async (url: string | URL | Request, init?: RequestInit) => {
    llamadas.push({ url: String(url), init: init ?? {} })
    return respuesta()
  }
  return { llamadas, impl: impl as unknown as typeof fetch }
}

afterEach(() => vi.useRealTimers())

describe('N8nWebhookTeamNoticePort — la petición a W1', () => {
  it('manda el aviso entero por POST, con el secreto en la cabecera de autorización', async () => {
    const f = espía(async () => new Response('{"ok":true}', { status: 200 }))
    expect(await new N8nWebhookTeamNoticePort(URL_W1, SECRETO, 5000, f.impl).notify(aviso)).toBe('ok')
    expect(f.llamadas[0]?.url).toBe(URL_W1)
    expect(f.llamadas[0]?.init.method).toBe('POST')
    expect(new Headers(f.llamadas[0]?.init.headers).get('authorization')).toBe(`Bearer ${SECRETO}`)
    expect(JSON.parse(String(f.llamadas[0]?.init.body))).toEqual(aviso)
  })

  it('una respuesta distinta de 2xx es un fallo (W1 responde 502 si Slack no publicó)', async () => {
    const f = espía(async () => new Response('slack', { status: 502 }))
    expect(await new N8nWebhookTeamNoticePort(URL_W1, SECRETO, 5000, f.impl).notify(aviso)).toBe('failed')
  })

  it('un fallo de red NUNCA lanza: se convierte en «failed» y el lead sigue su camino', async () => {
    const f = espía(async () => { throw new TypeError('fetch failed') })
    await expect(new N8nWebhookTeamNoticePort(URL_W1, SECRETO, 5000, f.impl).notify(aviso)).resolves.toBe('failed')
  })

  it('pasado el tope de tiempo, es un fallo: el formulario no espera a n8n indefinidamente', async () => {
    const lento = (async (_u: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_, rechazar) => {
        init?.signal?.addEventListener('abort', () => rechazar(new DOMException('timeout', 'TimeoutError')))
      })) as unknown as typeof fetch
    const t0 = Date.now()
    expect(await new N8nWebhookTeamNoticePort(URL_W1, SECRETO, 50, lento).notify(aviso)).toBe('failed')
    expect(Date.now() - t0).toBeLessThan(2000)
  })
})

describe('Los adaptadores sin red', () => {
  it('el falso graba lo que recibe y devuelve el resultado pedido', async () => {
    const falso = new FakeTeamNoticePort('failed')
    expect(await falso.notify(aviso)).toBe('failed')
    expect(falso.sent).toEqual([aviso])
  })

  it('el apagado no manda nada y lo dice: «not_configured»', async () => {
    expect(await new OffTeamNoticePort().notify(aviso)).toBe('not_configured')
  })
})

describe('selectTeamNoticePort — nunca un falso silencioso en producción', () => {
  it('con URL y secreto, el adaptador real', () => {
    expect(selectTeamNoticePort({ NODE_ENV: 'production', N8N_LEAD_WEBHOOK_URL: URL_W1, N8N_LEAD_WEBHOOK_SECRET: SECRETO }))
      .toBeInstanceOf(N8nWebhookTeamNoticePort)
  })

  it('en producción sin configurar, apagado (y el correo interno lo dirá), jamás el falso', () => {
    expect(selectTeamNoticePort({ NODE_ENV: 'production' })).toBeInstanceOf(OffTeamNoticePort)
  })

  it('media configuración no es configuración', () => {
    expect(selectTeamNoticePort({ NODE_ENV: 'production', N8N_LEAD_WEBHOOK_URL: URL_W1 })).toBeInstanceOf(OffTeamNoticePort)
    expect(selectTeamNoticePort({ NODE_ENV: 'production', N8N_LEAD_WEBHOOK_SECRET: SECRETO })).toBeInstanceOf(OffTeamNoticePort)
  })

  it('en desarrollo sin configurar, el falso', () => {
    expect(selectTeamNoticePort({ NODE_ENV: 'development' })).toBeInstanceOf(FakeTeamNoticePort)
  })
})
