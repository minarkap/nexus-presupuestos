import { describe, it, expect, beforeEach } from 'vitest'
import { submitLead, DedupCache, validateContact, buildInternalNotice, type SubmitDeps } from './submit'
import { FakeEmailPort } from '@/ports/email'
import { FakeRegistryPort } from '@/ports/registry'
import { FakeRateLimitPort } from '@/ports/rate-limit'
import { RATE_LIMIT } from './rate-limit'
import type { Answers, EmailMessage } from './types'
import type { EmailPort } from '@/ports/email'

const answers: Answers = {
  challenge: 'ia', need: 'diagnostico', size: '250-999', maturity: 'inicial',
  timing: '3-6m', sponsor: 'si', budget: 'asignado', blockers: [],
  contact: { name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme', consent: true },
}

let email: FakeEmailPort
let registry: FakeRegistryPort
let cache: DedupCache

const deps = () => ({
  emailPort: email,
  registryPort: registry,
  // Sin huella por defecto: el tope no se aplica y las pruebas anteriores a esta función siguen
  // midiendo lo que medían. Las del tope la ponen explícitamente.
  rateLimitPort: new FakeRateLimitPort(),
  fingerprint: null as string | null,
  internalMailbox: 'oportunidades@nexus-st.com',
  now: () => new Date('2026-08-26T10:00:00.000Z'),
})

beforeEach(() => {
  email = new FakeEmailPort()
  registry = new FakeRegistryPort()
  cache = new DedupCache()
})

describe('SubmitAction — los dos correos (CA-15)', () => {
  it('un envío completo emite exactamente dos correos', async () => {
    await submitLead(answers, 's1', deps(), cache)
    expect(email.sent).toHaveLength(2)
  })

  it('uno va al lead y otro al buzón interno', async () => {
    await submitLead(answers, 's1', deps(), cache)
    const destinos = email.sent.map((m) => m.to)
    expect(destinos).toContain('marta@acme.ad')
    expect(destinos).toContain('oportunidades@nexus-st.com')
  })
})

describe('SubmitAction — el aviso interno lleva el desglose (CA-16)', () => {
  it('contiene contacto, respuestas, servicio, rango, total y una línea por señal', async () => {
    await submitLead(answers, 's1', deps(), cache)
    const interno = email.sent.find((m) => m.to === 'oportunidades@nexus-st.com') as EmailMessage
    expect(interno.body).toContain('Marta Vives')
    expect(interno.body).toContain('AI Opportunity Assessment')
    expect(interno.body).toContain('28.000')
    // 3 sponsor + 3 presupuesto + 2 plazo + 0 madurez + 1 tamaño(250-999) = 9
    expect(interno.body).toContain('9/10')
    for (const señal of ['sponsor', 'presupuesto', 'plazo', 'madurez', 'tamaño']) {
      expect(interno.body).toContain(señal)
    }
  })

  it('un aviso que sólo dijera «8 puntos» sería inservible: hay 5 líneas de desglose', () => {
    const notice = buildInternalNotice({
      submissionId: 'env-1',
      submittedAt: '2026-08-26T10:00:00.000Z',
      contact: answers.contact,
      answers,
      serviceLabel: 'X',
      rangeText: 'Y',
      blockers: [],
      score: { total: 8, breakdown: [
        { signal: 'sponsor', answer: 'a', points: 3 },
        { signal: 'presupuesto', answer: 'b', points: 3 },
        { signal: 'plazo', answer: 'c', points: 2 },
        { signal: 'madurez', answer: 'd', points: 0 },
        { signal: 'tamaño', answer: 'e', points: 1 },
      ] },
    }, 'ok')
    expect(notice.split('\n').filter((l) => l.trim().startsWith('- ') && l.includes('→'))).toHaveLength(5)
  })
})

describe('SubmitAction — el lead ve su resultado pase lo que pase (CA-17)', () => {
  class BrokenEmailPort implements EmailPort {
    async send(): Promise<void> { throw new Error('proveedor caído') }
  }

  it('con el correo roto, devuelve igualmente el resultado', async () => {
    const r = await submitLead(answers, 's1', { ...deps(), emailPort: new BrokenEmailPort() }, cache)
    expect(r).toHaveProperty('kind', 'qualified')
  })

  it('el fallo queda reflejado en el informe de despacho, no se traga', async () => {
    let report: unknown = null
    await submitLead(
      answers, 's1',
      { ...deps(), emailPort: new BrokenEmailPort(), onDispatch: (r) => { report = r } },
      cache,
    )
    expect(report).toEqual({ clientEmail: 'failed', internalEmail: 'failed', registry: 'ok' })
  })

  it('el registro sigue recibiendo el lead aunque el correo falle', async () => {
    await submitLead(answers, 's1', { ...deps(), emailPort: new BrokenEmailPort() }, cache)
    expect(registry.rows).toHaveLength(1)
  })

  it('si falla el registro, los correos siguen saliendo: las vías son independientes', async () => {
    const roto = { append: async () => { throw new Error('sheets caído') } }
    let report: unknown = null
    await submitLead(answers, 's1', { ...deps(), registryPort: roto, onDispatch: (r) => { report = r } }, cache)
    expect(email.sent).toHaveLength(2)
    expect(report).toEqual({ clientEmail: 'ok', internalEmail: 'ok', registry: 'failed' })
  })
})

describe('SubmitAction — doble envío (CA-18)', () => {
  it('el mismo submissionId no despacha dos veces', async () => {
    await submitLead(answers, 'misma-sesion', deps(), cache)
    await submitLead(answers, 'misma-sesion', deps(), cache)
    expect(email.sent).toHaveLength(2)
    expect(registry.rows).toHaveLength(1)
  })

  it('devuelve el mismo resultado en ambos envíos', async () => {
    const a = await submitLead(answers, 'misma-sesion', deps(), cache)
    const b = await submitLead(answers, 'misma-sesion', deps(), cache)
    expect(a).toEqual(b)
  })

  it('dos sesiones distintas sí son dos leads distintos', async () => {
    await submitLead(answers, 's1', deps(), cache)
    await submitLead(answers, 's2', deps(), cache)
    expect(registry.rows).toHaveLength(2)
  })

  it('pasado el TTL, la deduplicación caduca', () => {
    let ahora = 0
    const corta = new DedupCache(1000, () => ahora)
    const outcome = { kind: 'qualified' as const, rangeText: null, disclaimer: '', bodyText: '', showCalendar: true }
    corta.set('s1', outcome)
    expect(corta.get('s1')).not.toBeNull()
    ahora = 2000
    expect(corta.get('s1')).toBeNull()
  })
})

describe('SubmitAction — validación de contacto', () => {
  it.each([
    ['name', { ...answers.contact, name: '  ' }],
    ['email', { ...answers.contact, email: 'no-es-un-correo' }],
    ['company', { ...answers.contact, company: '', consent: true }],
  ])('señala el campo %s sin calcular nada', async (field, contact) => {
    const r = await submitLead({ ...answers, contact }, 's1', deps(), cache)
    expect(r).toMatchObject({ kind: 'validation_error', field })
    expect(email.sent).toHaveLength(0)
  })

  it('acepta un contacto correcto', () => {
    expect(validateContact(answers)).toBeNull()
  })
})

describe('SubmitAction — la rama sin catalogar', () => {
  it('no produce cifra pero sí los dos correos y la fila', async () => {
    const r = await submitLead(
      { ...answers, challenge: 'estrategia_operaciones', need: null }, 's1', deps(), cache,
    )
    expect(r).toHaveProperty('kind', 'uncatalogued')
    expect(email.sent).toHaveLength(2)
    expect(registry.rows[0]?.serviceLabel).toBeNull()
  })
})

/**
 * Frenos declarados (spec `pregunta-frenos-lead`). El dato es para el comercial: entra en el aviso
 * interno, no toca el cálculo y no vuelve al lead por ninguna vía.
 */
describe('Frenos declarados — informativos, nunca una señal de cualificación', () => {
  const interno = (e: FakeEmailPort) => e.sent.find((m) => m.to === 'oportunidades@nexus-st.com')!
  const alLead = (e: FakeEmailPort) => e.sent.find((m) => m.to === 'marta@acme.ad')!

  it('el aviso interno nombra los frenos marcados y ningún otro (CA-2)', async () => {
    await submitLead({ ...answers, blockers: ['sin_perfiles', 'intento_fallido'] }, 's1', deps(), cache)
    const cuerpo = interno(email).body
    expect(cuerpo).toMatch(/No tenemos perfiles técnicos/)
    expect(cuerpo).toMatch(/Ya lo intentamos y salió mal/)
    expect(cuerpo).not.toMatch(/Dudas legales/)
    expect(cuerpo).not.toMatch(/No sabemos por dónde empezar/)
  })

  it('sin frenos marcados lo dice expresamente, no calla (CA-3)', async () => {
    await submitLead({ ...answers, blockers: [] }, 's1', deps(), cache)
    expect(interno(email).body).toMatch(/Frenos declarados: ninguno/)
  })

  it('dos leads idénticos con frenos distintos obtienen la misma cifra y la misma puntuación (CA-4)', async () => {
    const a = await submitLead({ ...answers, blockers: [] }, 'sa', deps(), cache)
    const b = await submitLead({ ...answers, blockers: ['dudas_legales', 'sin_punto_de_partida'] }, 'sb', deps(), new DedupCache())
    expect(a).toEqual(b)

    const puntuaciones = email.sent
      .filter((m) => m.to === 'oportunidades@nexus-st.com')
      .map((m) => m.body.match(/Puntuación: (\d+)\/10/)?.[1])
    expect(puntuaciones[0]).toBe(puntuaciones[1])
  })

  it('el correo del lead no menciona sus frenos por ninguna vía (CA-6)', async () => {
    await submitLead({ ...answers, blockers: ['sin_perfiles', 'dudas_legales'] }, 's1', deps(), cache)
    const cuerpo = alLead(email).body
    expect(cuerpo).not.toMatch(/perfiles técnicos|Dudas legales|freno|Freno/i)
  })

  it('el registro de respaldo se lleva los frenos en su propia columna', async () => {
    await submitLead({ ...answers, blockers: ['intento_fallido'] }, 's1', deps(), cache)
    expect(registry.rows[0]?.blockers).toEqual(['intento_fallido'])
  })
})

describe('El guardado va primero y el aviso interno lo declara (spec leads-en-supabase)', () => {
  /** Puertos que anotan en qué orden se les llama. */
  const conTestigo = () => {
    const orden: string[] = []
    const registryPort = { append: async () => { orden.push('registro') } }
    const emailPort: EmailPort = { send: async (m: EmailMessage) => { orden.push(`correo:${m.to}`) } }
    return { orden, registryPort, emailPort }
  }

  it('el lead se guarda ANTES de que salga ningún correo', async () => {
    const { orden, registryPort, emailPort } = conTestigo()
    await submitLead(answers, 's1', { ...deps(), registryPort, emailPort }, cache)
    expect(orden[0]).toBe('registro')
  })

  it('CA-S3 · si el guardado falla, el correo interno lo dice con todas las letras', async () => {
    const roto = { append: async () => { throw new Error('supabase caído') } }
    await submitLead(answers, 's1', { ...deps(), registryPort: roto }, cache)
    const interno = email.sent.find((m) => m.to === 'oportunidades@nexus-st.com')
    expect(interno?.body).toMatch(/NO ha quedado guardado/i)
  })

  it('CA-S3 · el aviso va arriba del todo, no enterrado al final', async () => {
    const roto = { append: async () => { throw new Error('supabase caído') } }
    await submitLead(answers, 's1', { ...deps(), registryPort: roto }, cache)
    const interno = email.sent.find((m) => m.to === 'oportunidades@nexus-st.com')
    const líneas = (interno?.body ?? '').split('\n')
    const posición = líneas.findIndex((l) => /NO ha quedado guardado/i.test(l))
    expect(posición).toBeGreaterThanOrEqual(0)
    expect(posición).toBeLessThan(3)
  })

  it('CA-S2 · cuando el guardado funciona, el correo interno NO gana ningún aviso', async () => {
    await submitLead(answers, 's1', deps(), cache)
    const interno = email.sent.find((m) => m.to === 'oportunidades@nexus-st.com')
    expect(interno?.body).not.toMatch(/NO ha quedado guardado/i)
  })

  it('CA-S7 · un fallo de guardado no altera lo que ve el visitante', async () => {
    const roto = { append: async () => { throw new Error('supabase caído') } }
    const conFallo = await submitLead(answers, 'sa', { ...deps(), registryPort: roto }, cache)
    const sinFallo = await submitLead(answers, 'sb', deps(), new DedupCache())
    expect(conFallo).toEqual(sinFallo)
  })

  it('el identificador de envío viaja al registro: es la clave que lo hace idempotente', async () => {
    await submitLead(answers, 'envio-42', deps(), cache)
    expect(registry.rows[0]?.submissionId).toBe('envio-42')
  })
})

describe('Topes de tamaño — la acción pública ahora escribe en una base de datos real', () => {
  /**
   * Hallazgo de la revisión adversarial de seguridad (2026-09-14): antes de este ciclo el registro
   * nunca escribía de verdad en producción, así que un campo libre enorme sólo engordaba un correo.
   * Ahora inserta una fila real, y `validateContact` no imponía ningún máximo: una acción de
   * servidor es un endpoint HTTP público, y el formulario no es su única vía de entrada.
   */
  const largo = (n: number) => 'a'.repeat(n)

  it('un nombre desmesurado se rechaza en servidor', async () => {
    const contact = { ...answers.contact, name: largo(500) }
    const r = await submitLead({ ...answers, contact }, 's1', deps(), cache)
    expect(r).toMatchObject({ kind: 'validation_error', field: 'name' })
  })

  it('una organización desmesurada se rechaza en servidor', async () => {
    const contact = { ...answers.contact, company: largo(500) }
    const r = await submitLead({ ...answers, contact }, 's1', deps(), cache)
    expect(r).toMatchObject({ kind: 'validation_error', field: 'company' })
  })

  it('un correo más largo que el máximo de la norma se rechaza', async () => {
    const contact = { ...answers.contact, email: `${largo(250)}@acme.ad` }
    const r = await submitLead({ ...answers, contact }, 's1', deps(), cache)
    expect(r).toMatchObject({ kind: 'validation_error', field: 'email' })
  })

  it('un identificador de envío desmesurado se rechaza: también viaja a la base de datos', async () => {
    const r = await submitLead(answers, largo(500), deps(), cache)
    expect(r).toMatchObject({ kind: 'validation_error' })
  })

  it('nada de esto llega a escribirse: el registro se queda vacío', async () => {
    await submitLead({ ...answers, contact: { ...answers.contact, name: largo(500) } }, 's1', deps(), cache)
    expect(registry.rows).toHaveLength(0)
  })

  it('los valores normales siguen pasando sin rozar el tope', async () => {
    const r = await submitLead(answers, 's1', deps(), cache)
    expect(r).not.toMatchObject({ kind: 'validation_error' })
  })
})

describe('Límite de frecuencia (spec limite-de-frecuencia)', () => {
  const HUELLA = 'a'.repeat(32)
  const conTope = (extra: Partial<SubmitDeps> = {}): SubmitDeps => ({
    ...deps(), rateLimitPort: limiter, fingerprint: HUELLA, ...extra,
  })
  let limiter: FakeRateLimitPort

  beforeEach(() => { limiter = new FakeRateLimitPort() })

  /** Llena el cupo de la hora para esa huella. */
  const agotarCupo = async () => {
    for (let i = 0; i < RATE_LIMIT.perHour; i++) await limiter.record(HUELLA)
  }

  it('CA-L1 · un origen limpio no nota nada', async () => {
    const r = await submitLead(answers, 's1', conTope(), cache)
    expect(r).not.toMatchObject({ kind: 'rate_limited' })
    expect(registry.rows).toHaveLength(1)
  })

  it('CA-L2 · por encima del tope no se crea NINGUNA fila', async () => {
    await agotarCupo()
    const r = await submitLead(answers, 's1', conTope(), cache)
    expect(r).toMatchObject({ kind: 'rate_limited' })
    expect(registry.rows).toHaveLength(0)
  })

  it('CA-L2 · por encima del tope no sale NINGÚN correo', async () => {
    await agotarCupo()
    await submitLead(answers, 's1', conTope(), cache)
    expect(email.sent).toHaveLength(0)
  })

  it('CA-L3 · el bloqueo lleva mensaje Y vía alternativa de contacto', async () => {
    await agotarCupo()
    const r = await submitLead(answers, 's1', conTope(), cache)
    expect(r).toMatchObject({ kind: 'rate_limited' })
    if ('contactEmail' in r) {
      expect(r.message.length).toBeGreaterThan(20)
      expect(r.contactEmail).toContain('@')
    } else {
      throw new Error('el resultado bloqueado debe ofrecer una vía alternativa')
    }
  })

  it('cada envío aceptado consume cupo', async () => {
    await submitLead(answers, 's1', conTope(), cache)
    expect(await limiter.recentAttempts(HUELLA, new Date(0))).toHaveLength(1)
  })

  it('un envío RECHAZADO por validación no consume cupo: no es culpa de nadie', async () => {
    const contact = { ...answers.contact, email: 'no-es-un-correo' }
    await submitLead({ ...answers, contact }, 's1', conTope(), cache)
    expect(await limiter.recentAttempts(HUELLA, new Date(0))).toHaveLength(0)
  })

  it('un doble clic NO consume cupo dos veces: es el mismo envío', async () => {
    await submitLead(answers, 'misma-sesion', conTope(), cache)
    await submitLead(answers, 'misma-sesion', conTope(), cache)
    expect(await limiter.recentAttempts(HUELLA, new Date(0))).toHaveLength(1)
  })

  it('CA-L6 · si el conteo está caído, el envío PASA', async () => {
    const roto = {
      recentAttempts: async () => { throw new Error('supabase caído') },
      record: async () => { throw new Error('supabase caído') },
    }
    const r = await submitLead(answers, 's1', conTope({ rateLimitPort: roto }), cache)
    expect(r).not.toMatchObject({ kind: 'rate_limited' })
    expect(registry.rows).toHaveLength(1)
  })

  it('sin huella (no se pudo identificar el origen) el envío PASA', async () => {
    await agotarCupo()
    const r = await submitLead(answers, 's1', conTope({ fingerprint: null }), cache)
    expect(r).not.toMatchObject({ kind: 'rate_limited' })
  })

  it('el bloqueo ocurre ANTES de tocar el registro', async () => {
    await agotarCupo()
    const orden: string[] = []
    const testigo = { append: async () => { orden.push('registro') } }
    await submitLead(answers, 's1', conTope({ registryPort: testigo }), cache)
    expect(orden).toEqual([])
  })

  it('el tope es por origen: otra huella tiene su propio cupo', async () => {
    await agotarCupo()
    const r = await submitLead(answers, 's1', conTope({ fingerprint: 'b'.repeat(32) }), cache)
    expect(r).not.toMatchObject({ kind: 'rate_limited' })
  })
})
