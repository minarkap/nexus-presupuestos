import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { SupabaseRegistryPort } from './registry'
import type { LeadRecord } from '@/core/types'

/**
 * Invariantes de seguridad del registro, comprobadas sobre el CÓDIGO FUENTE.
 *
 * Encargo explícito de Jose (2026-09-14): «que no quede expuesta la BBDD a fuera». La clave
 * `service_role` se salta las reglas de acceso de la tabla por diseño, así que su única defensa es
 * no salir nunca del servidor. Estas pruebas convierten esa frase en algo que falla solo.
 *
 * La comprobación complementaria —sobre el paquete ya compilado— vive en `scripts/secret-gate.mjs`
 * y la ejecuta `verify.sh`.
 */

const SRC = join(process.cwd(), 'src')

function ficheros(dir: string): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) return ficheros(ruta)
    return /\.(ts|tsx)$/.test(entrada) ? [ruta] : []
  })
}

describe('La base de datos no se expone al navegador', () => {
  it('ningún fichero marca una credencial del registro como pública', () => {
    const culpables = ficheros(SRC).filter((f) => {
      const texto = readFileSync(f, 'utf8')
      return /NEXT_PUBLIC_(SUPABASE|GOOGLE_SERVICE|GOOGLE_SHEET|RESEND)/.test(texto)
    })
    expect(culpables).toEqual([])
  })

  it('el módulo del registro es inimportable desde un componente de cliente', () => {
    const fuente = readFileSync(join(SRC, 'ports', 'registry.ts'), 'utf8')
    expect(fuente).toMatch(/^import 'server-only'$/m)
  })

  it('ningún componente de cliente importa el registro', () => {
    const culpables = ficheros(SRC).filter((f) => {
      const texto = readFileSync(f, 'utf8')
      if (f.endsWith('.test.ts') || f.endsWith('.test.tsx')) return false
      return /^'use client'/m.test(texto) && /from '@\/ports\/registry'/.test(texto)
    })
    expect(culpables).toEqual([])
  })

  it('la credencial no viaja en el mensaje de ningún error del adaptador', async () => {
    const clave = 'clave-de-servicio-que-no-debe-verse'
    const lead = {
      submissionId: 's1',
      submittedAt: '2026-09-14T10:00:00.000Z',
      contact: { name: 'n', email: 'e@x.ad', company: 'c', consent: true },
      answers: {
        challenge: 'ia', need: null, size: '<50', maturity: 'inicial',
        timing: '<3m', sponsor: 'no', budget: 'sin',
      },
      serviceLabel: null,
      rangeText: null,
      blockers: [],
      score: { total: 0, breakdown: [] },
    } satisfies LeadRecord

    const fetchRoto = (async () =>
      new Response('detalle interno', { status: 401 })) as unknown as typeof fetch

    const port = new SupabaseRegistryPort(
      { url: 'https://p.supabase.co', serviceRoleKey: clave },
      fetchRoto,
    )

    // El fallo tiene que ser legible para quien lo depura y mudo sobre la credencial.
    await expect(port.append(lead)).rejects.toThrow(/401/)
    await expect(port.append(lead)).rejects.not.toThrow(new RegExp(clave))
  })
})
