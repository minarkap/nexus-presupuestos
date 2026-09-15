import { describe, it, expect } from 'vitest'
import { SEED_CATALOG } from './catalog-seed'
import type { LoadedCatalog } from './catalog-types'
import { submitLead, DedupCache, validateAnswers } from './submit'
import { FakeEmailPort } from '@/ports/email'
import { FakeRegistryPort } from '@/ports/registry'
import { FakeRateLimitPort } from '@/ports/rate-limit'
import type { Answers } from './types'

/** El catálogo de estas pruebas: la semilla, dada por viva. Lo que se mide aquí es la
 *  validación de entradas, no de dónde salen los precios. */
const catálogoVivo: LoadedCatalog = { catalog: SEED_CATALOG, source: 'live' }

const válidas: Answers = {
  challenge: 'ia', need: 'diagnostico', size: '250-999', maturity: 'inicial',
  timing: '3-6m', sponsor: 'si', budget: 'asignado', blockers: [],
  contact: { name: 'Marta', email: 'marta@acme.ad', company: 'Acme', consent: true },
}

function conBasura(campo: string, valor: unknown): Answers {
  return { ...válidas, [campo]: valor } as unknown as Answers
}

/**
 * Una acción de servidor es un endpoint HTTP público: cualquiera puede llamarla con lo que
 * quiera. El formulario nunca produciría esto, pero el formulario no es la única vía de entrada.
 */
describe('Validación de respuestas — la acción de servidor es pública', () => {
  it.each([
    ['size', 'TAMAÑO-INVENTADO'],
    ['maturity', 'ninguna'],
    ['timing', 'mañana'],
    ['sponsor', 'quizá'],
    ['budget', 'infinito'],
    ['challenge', 'otra-cosa'],
    ['need', 'algo-raro'],
  ])('rechaza un valor inventado en %s', (campo, valor) => {
    const error = validateAnswers(conBasura(campo, valor))
    expect(error).not.toBeNull()
    expect(error?.field).toBe(campo)
  })

  it('rechaza valores ausentes', () => {
    expect(validateAnswers(conBasura('size', undefined))).not.toBeNull()
    expect(validateAnswers(conBasura('sponsor', null))).not.toBeNull()
  })

  it('acepta las respuestas legítimas', () => {
    expect(validateAnswers(válidas)).toBeNull()
  })

  it('acepta need nulo cuando el reto no es IA', () => {
    expect(validateAnswers({ ...válidas, challenge: 'ciberseguridad', need: null })).toBeNull()
  })
})

describe('NUNCA sale una cifra improvisada de la firma (constitution 5, CA-02)', () => {
  it('con un tramo inventado NO se calcula, NO se envía correo y NO aparece NaN', async () => {
    const email = new FakeEmailPort()
    const registry = new FakeRegistryPort()

    const r = await submitLead(conBasura('size', 'INVENTADO'), 'adv1', {
      catalog: catálogoVivo,
      emailPort: email, registryPort: registry, rateLimitPort: new FakeRateLimitPort(), fingerprint: null,
      internalMailbox: 'o@n.com', now: () => new Date('2026-01-01'),
    }, new DedupCache())

    expect(r).toMatchObject({ kind: 'validation_error' })
    expect(JSON.stringify(r)).not.toContain('NaN')
    expect(email.sent).toHaveLength(0)
    expect(registry.rows).toHaveLength(0)
  })

  it('ninguna entrada, ni inventada, produce un rango con NaN', async () => {
    for (const campo of ['size', 'maturity', 'timing']) {
      const email = new FakeEmailPort()
      const r = await submitLead(conBasura(campo, 'X'), `adv-${campo}`, {
        catalog: catálogoVivo,
        emailPort: email, registryPort: new FakeRegistryPort(), rateLimitPort: new FakeRateLimitPort(), fingerprint: null,
        internalMailbox: 'o@n.com', now: () => new Date('2026-01-01'),
      }, new DedupCache())
      expect(JSON.stringify(r)).not.toContain('NaN')
      expect(email.sent).toHaveLength(0)
    }
  })
})

/**
 * Frenos declarados (spec `pregunta-frenos-lead`, CA-1 y CA-5). Es el único campo multi-valor del
 * formulario: la lista vacía es una respuesta legítima —la pantalla se puede saltar— y por eso no
 * puede colarse por el mismo hueco por el que se cuela un valor inventado.
 */
describe('Validación de frenos — multi-valor sobre lista cerrada', () => {
  it('acepta la lista vacía: la pregunta es saltable (CA-1)', () => {
    expect(validateAnswers({ ...válidas, blockers: [] })).toBeNull()
  })

  it('acepta un freno', () => {
    expect(validateAnswers({ ...válidas, blockers: ['sin_perfiles'] })).toBeNull()
  })

  it('acepta los cuatro a la vez', () => {
    const todos = ['sin_perfiles', 'dudas_legales', 'sin_punto_de_partida', 'intento_fallido'] as const
    expect(validateAnswers({ ...válidas, blockers: todos })).toBeNull()
  })

  it('rechaza un freno inventado (CA-5)', () => {
    const error = validateAnswers(conBasura('blockers', ['sin_perfiles', 'pereza']))
    expect(error).not.toBeNull()
    expect(error?.field).toBe('blockers')
  })

  it('rechaza que no sea una lista', () => {
    const error = validateAnswers(conBasura('blockers', 'sin_perfiles'))
    expect(error?.field).toBe('blockers')
  })

  it('rechaza el campo ausente: la lista vacía es explícita, no implícita', () => {
    const sinCampo = { ...válidas } as Record<string, unknown>
    delete sinCampo.blockers
    expect(validateAnswers(sinCampo as unknown as Answers)?.field).toBe('blockers')
  })

  it('rechaza duplicados: es un conjunto, no una cesta', () => {
    const error = validateAnswers(conBasura('blockers', ['sin_perfiles', 'sin_perfiles']))
    expect(error?.field).toBe('blockers')
  })

  it('rechaza un array disperso, aunque sus elementos presentes sean válidos', () => {
    // El hueco es intencionado: `no-sparse-arrays` no está activo en esta configuración, así que
    // no hace falta silenciarlo — y un `eslint-disable` que no tapa nada es un aviso en sí mismo.
    const conHueco = [, 'sin_perfiles'] as unknown[]
    expect(validateAnswers(conBasura('blockers', conHueco))?.field).toBe('blockers')
  })

  it('un freno fuera de lista no produce ni cifra ni aviso (CA-5 entero)', async () => {
    const email = new FakeEmailPort()
    const registry = new FakeRegistryPort()
    const resultado = await submitLead(
      conBasura('blockers', ['pereza']),
      's-frenos',
      { catalog: catálogoVivo, emailPort: email, registryPort: registry, rateLimitPort: new FakeRateLimitPort(), fingerprint: null, internalMailbox: 'x@y.z', now: () => new Date() },
      new DedupCache(),
    )
    expect(resultado).toMatchObject({ kind: 'validation_error', field: 'blockers' })
    expect(email.sent).toHaveLength(0)
    expect(registry.rows).toHaveLength(0)
  })
})
