import type { EmailMessage } from '@/core/types'

export interface EmailPort {
  send(message: EmailMessage): Promise<void>
}

/** Adaptador falso: sólo para desarrollo y pruebas. Registra lo enviado. */
export class FakeEmailPort implements EmailPort {
  readonly sent: EmailMessage[] = []
  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message)
  }
}

/**
 * Adaptador que SIEMPRE falla. Es lo que se usa en producción cuando falta la credencial.
 * Existe para que la ausencia de configuración sea ruidosa: un falso silencioso en producción
 * haría que el informe de despacho dijese «ok» mientras cada lead desaparece (finding F-1).
 */
export class MisconfiguredEmailPort implements EmailPort {
  constructor(private readonly reason: string) {}
  async send(): Promise<void> {
    throw new Error(`EmailPort sin configurar: ${this.reason}`)
  }
}

/** Adaptador real sobre la API REST de Resend (decisión S-0012). */
export class ResendEmailPort implements EmailPort {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        text: message.body,
      }),
    })
    if (!res.ok) {
      throw new Error(`Resend respondió ${res.status}: ${await res.text()}`)
    }
  }
}

export interface EmailEnv {
  readonly NODE_ENV?: string | undefined
  readonly RESEND_API_KEY?: string | undefined
  readonly RESEND_FROM?: string | undefined
  readonly USE_FAKE_ADAPTERS?: string | undefined
}

/**
 * Selección del adaptador (plan §3, corrige F-1):
 *   producción + credencial   → adaptador real
 *   producción SIN credencial → adaptador que siempre falla
 *   no-producción             → adaptador falso
 */
export function selectEmailPort(env: EmailEnv): EmailPort {
  const isProd = env.NODE_ENV === 'production'

  if (env.USE_FAKE_ADAPTERS === '1' && !isProd) return new FakeEmailPort()

  if (env.RESEND_API_KEY && env.RESEND_FROM) {
    return new ResendEmailPort(env.RESEND_API_KEY, env.RESEND_FROM)
  }

  if (isProd) {
    return new MisconfiguredEmailPort('faltan RESEND_API_KEY y/o RESEND_FROM')
  }

  return new FakeEmailPort()
}
