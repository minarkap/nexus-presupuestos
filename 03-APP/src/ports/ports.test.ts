import { describe, it, expect } from 'vitest'
import {
  FakeEmailPort, MisconfiguredEmailPort, ResendEmailPort, selectEmailPort,
} from './email'
import {
  FakeRegistryPort, MisconfiguredRegistryPort, GoogleSheetsRegistryPort,
  selectRegistryPort, toSheetRow,
} from './registry'
import type { LeadRecord } from '@/core/types'

const lead: LeadRecord = {
  submissionId: 'env-1',
  submittedAt: '2026-08-26T10:00:00.000Z',
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

describe('EmailPort — el falso captura lo enviado', () => {
  it('registra destino, asunto y cuerpo', async () => {
    const port = new FakeEmailPort()
    await port.send({ to: 'a@b.c', subject: 'Asunto', body: 'Cuerpo' })
    expect(port.sent).toHaveLength(1)
    expect(port.sent[0]).toEqual({ to: 'a@b.c', subject: 'Asunto', body: 'Cuerpo' })
  })
})

describe('Selección de adaptador — la corrección de F-1', () => {
  it('PRODUCCIÓN con credencial → adaptador real', () => {
    const port = selectEmailPort({
      NODE_ENV: 'production', RESEND_API_KEY: 're_x', RESEND_FROM: 'no-reply@nexus-st.com',
    })
    expect(port).toBeInstanceOf(ResendEmailPort)
  })

  it('PRODUCCIÓN sin credencial → adaptador que SIEMPRE falla, nunca el falso', () => {
    const port = selectEmailPort({ NODE_ENV: 'production' })
    expect(port).toBeInstanceOf(MisconfiguredEmailPort)
    expect(port).not.toBeInstanceOf(FakeEmailPort)
  })

  it('el adaptador mal configurado lanza al intentar enviar, y dice por qué', async () => {
    const port = selectEmailPort({ NODE_ENV: 'production' })
    await expect(port.send({ to: 'a@b.c', subject: 's', body: 'b' })).rejects.toThrow(/RESEND_API_KEY/)
  })

  it('en producción NO se puede forzar el falso ni pidiéndolo', () => {
    const port = selectEmailPort({ NODE_ENV: 'production', USE_FAKE_ADAPTERS: '1' })
    expect(port).not.toBeInstanceOf(FakeEmailPort)
  })

  it('fuera de producción y sin credencial → falso, para poder desarrollar', () => {
    expect(selectEmailPort({ NODE_ENV: 'development' })).toBeInstanceOf(FakeEmailPort)
  })

  it('el registro sigue exactamente la misma regla', () => {
    expect(selectRegistryPort({ NODE_ENV: 'production' })).toBeInstanceOf(MisconfiguredRegistryPort)
    expect(selectRegistryPort({ NODE_ENV: 'development' })).toBeInstanceOf(FakeRegistryPort)
    expect(
      selectRegistryPort({
        NODE_ENV: 'production',
        GOOGLE_SHEET_ID: 'sheet123',
        GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'a@b.iam', private_key: 'k' }),
      }),
    ).toBeInstanceOf(GoogleSheetsRegistryPort)
  })

  it('una credencial de Google ilegible se trata como ausente, no como válida', () => {
    const port = selectRegistryPort({
      NODE_ENV: 'production', GOOGLE_SHEET_ID: 'x', GOOGLE_SERVICE_ACCOUNT_JSON: '{roto',
    })
    expect(port).toBeInstanceOf(MisconfiguredRegistryPort)
  })
})

describe('RegistryPort — la fila que lee el equipo', () => {
  it('aplana el lead con el desglose legible', () => {
    const fila = toSheetRow(lead)
    expect(fila[1]).toBe('Marta Vives')
    expect(fila[6]).toBe('8')
    expect(fila[7]).toContain('sponsor: Identificado y comprometido (3)')
  })

  it('la rama sin catalogar deja constancia en vez de dejar huecos', () => {
    const fila = toSheetRow({ ...lead, serviceLabel: null, rangeText: null })
    expect(fila[4]).toBe('Sin catalogar')
    expect(fila[5]).toBe('Sin cifra')
  })
})
