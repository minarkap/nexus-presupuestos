// Barrera de compilación, no una convención: si algún día un componente de cliente importa este
// módulo —directa o indirectamente—, la compilación de producción FALLA en vez de empaquetar la
// credencial del registro en el navegador. Es lo que sostiene CA-S5 sin depender de la disciplina.
import 'server-only'
import { createSign } from 'node:crypto'
import { BLOCKER_LABEL } from '@/core/options'
import type { LeadRecord, SignalContribution } from '@/core/types'

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
    row.blockers.length === 0 ? 'ninguno' : row.blockers.map((b) => BLOCKER_LABEL[b]).join(' · '),
  ]
}

/** La fila tal y como la recibe la base de datos. Las claves son los nombres de columna. */
export interface LeadRow {
  readonly submission_id: string
  readonly submitted_at: string
  readonly contact_name: string
  readonly contact_email: string
  readonly contact_company: string
  readonly consent: boolean
  readonly challenge: string
  readonly need: string | null
  readonly size: string
  readonly maturity: string
  readonly timing: string
  readonly sponsor: string
  readonly budget: string
  readonly blockers: readonly string[]
  readonly service_label: string | null
  readonly range_text: string | null
  readonly score_total: number
  readonly score_breakdown: readonly SignalContribution[]
}

/**
 * El lead como fila de base de datos. A diferencia de `toSheetRow`, aquí NO se aplana nada a texto
 * legible: la hoja de cálculo la lee una persona, la tabla la consulta una pregunta. El desglose de
 * puntuación se conserva entero, y «sin catalogar» se representa con un nulo explícito en vez de con
 * una cadena que luego nadie puede distinguir de un dato real.
 */
export function toLeadRow(row: LeadRecord): LeadRow {
  return {
    submission_id: row.submissionId,
    submitted_at: row.submittedAt,
    contact_name: row.contact.name,
    contact_email: row.contact.email,
    contact_company: row.contact.company,
    consent: row.contact.consent,
    challenge: row.answers.challenge,
    need: row.answers.need,
    size: row.answers.size,
    maturity: row.answers.maturity,
    timing: row.answers.timing,
    sponsor: row.answers.sponsor,
    budget: row.answers.budget,
    blockers: row.blockers,
    service_label: row.serviceLabel,
    range_text: row.rangeText,
    score_total: row.score.total,
    score_breakdown: row.score.breakdown,
  }
}

export interface SupabaseConfig {
  readonly url: string
  readonly serviceRoleKey: string
  readonly table?: string | undefined
}

/**
 * Deja la URL del proyecto en su forma base, venga como venga.
 *
 * El panel de Supabase enseña la URL del proyecto y la de la API en pantallas distintas, y es fácil
 * pegar la segunda. Pasó en la puesta en marcha real: `SUPABASE_URL` acabó valiendo
 * `https://…supabase.co/rest/v1/`, la petición se construía contra `…/rest/v1/rest/v1/leads` y la
 * respuesta era un 404 «la tabla no existe» — un mensaje que manda a buscar el fallo donde no está.
 *
 * Se normaliza en vez de rechazar: las dos formas son la misma intención escrita de dos maneras, y
 * un despliegue roto por una barra de más no le enseña nada a nadie.
 */
export function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '')
}

/**
 * Registro sobre la API REST de Supabase. Sin SDK: es un `POST`, y añadir un árbol de dependencias
 * para hacer un `POST` no se paga (plan §0).
 *
 * La clave de servicio se salta las reglas de acceso de la tabla por diseño, así que vive sólo aquí,
 * en servidor, y no aparece nunca en un mensaje de error (R-S1).
 */
export class SupabaseRegistryPort implements RegistryPort {
  constructor(
    private readonly config: SupabaseConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async append(row: LeadRecord): Promise<void> {
    const tabla = this.config.table ?? 'leads'
    const base = normalizeSupabaseUrl(this.config.url)
    // `on_conflict` nombra la columna del choque. SIN ESTO la cabecera `ignore-duplicates` no hace
    // nada: comprobado contra el Supabase real el 2026-09-14, un reenvío devolvía 409 en vez de
    // ignorarse. Con `on_conflict` el duplicado es un 201 limpio y Postgres no registra un error.
    const res = await this.fetchImpl(`${base}/rest/v1/${tabla}?on_conflict=submission_id`, {
      method: 'POST',
      headers: {
        apikey: this.config.serviceRoleKey,
        Authorization: `Bearer ${this.config.serviceRoleKey}`,
        'Content-Type': 'application/json',
        // `ignore-duplicates` es lo que hace que un reintento del mismo envío no cree una segunda
        // fila: choca contra la restricción única de `submission_id` y la API lo ignora.
        Prefer: 'return=minimal,resolution=ignore-duplicates',
      },
      body: JSON.stringify(toLeadRow(row)),
    })

    // El 409 se sigue aceptando como red: significa «esa fila ya está», que es justo lo que se
    // pedía. Tratarlo como fallo haría que el aviso interno declarase perdido un lead que sí está
    // guardado — peor que no avisar.
    if (res.ok || res.status === 409) return

    throw new Error(`Supabase respondió ${res.status} al guardar el lead`)
  }
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
  readonly SUPABASE_URL?: string | undefined
  readonly SUPABASE_SERVICE_ROLE_KEY?: string | undefined
  readonly SUPABASE_LEADS_TABLE?: string | undefined
  readonly GOOGLE_SERVICE_ACCOUNT_JSON?: string | undefined
  readonly GOOGLE_SHEET_ID?: string | undefined
  readonly USE_FAKE_ADAPTERS?: string | undefined
}

/**
 * Misma regla que el correo: en producción sin credencial se falla ruidosamente (F-1).
 *
 * Precedencia (plan §4.1): Supabase primero; la hoja de cálculo queda por debajo, dormida, como el
 * parche barato que la spec deja escrito. Media credencial no es una credencial.
 */
export function selectRegistryPort(env: RegistryEnv): RegistryPort {
  const isProd = env.NODE_ENV === 'production'

  if (env.USE_FAKE_ADAPTERS === '1' && !isProd) return new FakeRegistryPort()

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    return new SupabaseRegistryPort({
      url: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
      table: env.SUPABASE_LEADS_TABLE,
    })
  }

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
    return new MisconfiguredRegistryPort(
      'faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY (o, en su defecto, las credenciales de Google)',
    )
  }

  return new FakeRegistryPort()
}
