// El secreto del webhook no puede acabar en el navegador: si un componente de cliente importara esto,
// la compilación fallaría en vez de empaquetarlo (mismo cierre que `registry.ts`).
import 'server-only'
import type { LeadNoticeV1, TeamNoticeResult } from '@/core/team-notice'

/**
 * El aviso al canal del equipo (spec `agenda-y-preparacion-de-llamadas`, S-0041). La web solo avisa a
 * n8n; lo que pase después —Slack— es cosa de W1. **Nunca lanza**: el lead jamás depende de que este
 * aviso salga, y un fallo se traduce a un resultado que el correo interno declara (CA-09).
 */
export interface TeamNoticePort {
  notify(notice: LeadNoticeV1): Promise<TeamNoticeResult>
}

/** Desarrollo y pruebas: graba lo recibido y devuelve lo que se le pida. */
export class FakeTeamNoticePort implements TeamNoticePort {
  readonly sent: LeadNoticeV1[] = []
  constructor(private readonly result: TeamNoticeResult = 'ok') {}
  async notify(notice: LeadNoticeV1): Promise<TeamNoticeResult> {
    this.sent.push(notice)
    return this.result
  }
}

/** Sin configuración: no manda nada y lo dice. No lanza, a diferencia del correo: aquí no se pierde ningún lead. */
export class OffTeamNoticePort implements TeamNoticePort {
  async notify(notice: LeadNoticeV1): Promise<TeamNoticeResult> {
    void notice // no va a ninguna parte: ese es el punto
    return 'not_configured'
  }
}

/**
 * Petición a W1. «ok» solo con 2xx, y W1 responde DESPUÉS de publicar en Slack: «ok» significa «está
 * en el canal». Tope de 5 s por defecto para no dejar al visitante esperando a n8n (plan, R-8).
 */
export class N8nWebhookTeamNoticePort implements TeamNoticePort {
  constructor(
    private readonly url: string,
    private readonly secret: string,
    private readonly timeoutMs = 5000,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async notify(notice: LeadNoticeV1): Promise<TeamNoticeResult> {
    try {
      const res = await this.fetchImpl(this.url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.secret}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
        signal: AbortSignal.timeout(this.timeoutMs),
      })
      return res.ok ? 'ok' : 'failed'
    } catch {
      // Red caída, tope de tiempo o lo que sea: no se relanza ni se registra el error, que podría
      // arrastrar la URL con datos. El resultado basta para que el correo interno lo declare.
      return 'failed'
    }
  }
}

export interface TeamNoticeEnv {
  readonly NODE_ENV?: string | undefined
  readonly N8N_LEAD_WEBHOOK_URL?: string | undefined
  readonly N8N_LEAD_WEBHOOK_SECRET?: string | undefined
}

/**
 * Con URL y secreto → el real. En producción sin los dos → apagado (nunca el falso: un falso en
 * producción diría «ok» mientras el canal no se entera de nada). En desarrollo → el falso.
 */
export function selectTeamNoticePort(env: TeamNoticeEnv): TeamNoticePort {
  const url = env.N8N_LEAD_WEBHOOK_URL?.trim()
  const secret = env.N8N_LEAD_WEBHOOK_SECRET?.trim()
  if (url && secret) return new N8nWebhookTeamNoticePort(url, secret)
  if (env.NODE_ENV === 'production') return new OffTeamNoticePort()
  return new FakeTeamNoticePort()
}
