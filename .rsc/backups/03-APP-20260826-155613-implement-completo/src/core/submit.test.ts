import { describe, it, expect, beforeEach } from 'vitest'
import { submitLead, DedupCache, validateContact, buildInternalNotice } from './submit'
import { FakeEmailPort } from '@/ports/email'
import { FakeRegistryPort } from '@/ports/registry'
import type { Answers, EmailMessage } from './types'
import type { EmailPort } from '@/ports/email'

const answers: Answers = {
  challenge: 'ia', need: 'diagnostico', size: '250-999', maturity: 'inicial',
  timing: '3-6m', sponsor: 'si', budget: 'asignado',
  contact: { name: 'Marta Vives', email: 'marta@acme.ad', company: 'Acme' },
}

let email: FakeEmailPort
let registry: FakeRegistryPort
let cache: DedupCache

const deps = () => ({
  emailPort: email,
  registryPort: registry,
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
      submittedAt: '2026-08-26T10:00:00.000Z',
      contact: answers.contact,
      answers,
      serviceLabel: 'X',
      rangeText: 'Y',
      score: { total: 8, breakdown: [
        { signal: 'sponsor', answer: 'a', points: 3 },
        { signal: 'presupuesto', answer: 'b', points: 3 },
        { signal: 'plazo', answer: 'c', points: 2 },
        { signal: 'madurez', answer: 'd', points: 0 },
        { signal: 'tamaño', answer: 'e', points: 1 },
      ] },
    })
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
    ['company', { ...answers.contact, company: '' }],
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
