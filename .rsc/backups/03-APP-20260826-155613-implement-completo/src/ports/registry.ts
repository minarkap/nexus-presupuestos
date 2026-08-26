import { createSign } from 'node:crypto'
import type { LeadRecord } from '@/core/types'

export interface RegistryPort {
  append(row: LeadRecord): Promise<void>
}

export class FakeRegistryPort implements RegistryPort {
  readonly rows: LeadRecord[] = []
  async append(row: LeadRecord): Promise<void> {
    this.rows.push(row)
  }
}

export class MisconfiguredRegistryPort implements RegistryPort {
  constructor(private readonly reason: string) {}
  async append(): Promise<void> {
    throw new Error(`RegistryPort sin configurar: ${this.reason}`)
  }
}

/** Aplana un lead a la fila que el equipo lee en la hoja, sin ser técnico. */
export function toSheetRow(row: LeadRecord): string[] {
  return [
    row.submittedAt,
    row.contact.name,
    row.contact.email,
    row.contact.company,
    row.serviceLabel ?? 'Sin catalogar',
    row.rangeText ?? 'Sin cifra',
    String(row.score.total),
    row.score.breakdown.map((b) => `${b.signal}: ${b.answer} (${b.points})`).join(' | '),
    row.answers.challenge,
    row.answers.need ?? '—',
    row.answers.size,
    row.answers.maturity,
    row.answers.timing,
    row.answers.sponsor,
    row.answers.budget,
  ]
}

interface ServiceAccount {
  readonly client_email: string
  readonly private_key: string
}

/** Token de servicio de Google firmado con la clave de la cuenta. Sin dependencias externas. */
async function fetchAccessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const unsigned = `${b64(header)}.${b64(claim)}`
  const signature = createSign('RSA-SHA256')
    .update(unsigned)
    .sign(account.private_key, 'base64url')

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  })
  if (!res.ok) throw new Error(`Google OAuth respondió ${res.status}`)
  const json = (await res.json()) as { access_token?: string }
  if (!json.access_token) throw new Error('Google OAuth no devolvió access_token')
  return json.access_token
}

export class GoogleSheetsRegistryPort implements RegistryPort {
  constructor(
    private readonly account: ServiceAccount,
    private readonly sheetId: string,
  ) {}

  async append(row: LeadRecord): Promise<void> {
    const token = await fetchAccessToken(this.account)
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}` +
      `/values/A1:append?valueInputOption=RAW`

    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [toSheetRow(row)] }),
    })
    if (!res.ok) throw new Error(`Google Sheets respondió ${res.status}: ${await res.text()}`)
  }
}

export interface RegistryEnv {
  readonly NODE_ENV?: string | undefined
  readonly GOOGLE_SERVICE_ACCOUNT_JSON?: string | undefined
  readonly GOOGLE_SHEET_ID?: string | undefined
  readonly USE_FAKE_ADAPTERS?: string | undefined
}

/** Misma regla que el correo: en producción sin credencial se falla ruidosamente (F-1). */
export function selectRegistryPort(env: RegistryEnv): RegistryPort {
  const isProd = env.NODE_ENV === 'production'

  if (env.USE_FAKE_ADAPTERS === '1' && !isProd) return new FakeRegistryPort()

  if (env.GOOGLE_SERVICE_ACCOUNT_JSON && env.GOOGLE_SHEET_ID) {
    try {
      const account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccount
      if (account.client_email && account.private_key) {
        return new GoogleSheetsRegistryPort(account, env.GOOGLE_SHEET_ID)
      }
    } catch {
      // credencial ilegible: se trata igual que ausente
    }
  }

  if (isProd) {
    return new MisconfiguredRegistryPort('faltan GOOGLE_SERVICE_ACCOUNT_JSON y/o GOOGLE_SHEET_ID')
  }

  return new FakeRegistryPort()
}
