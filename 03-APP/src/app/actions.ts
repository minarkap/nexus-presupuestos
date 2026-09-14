'use server'

import { headers } from 'next/headers'
import { DedupCache, submitLead, type SubmitResult } from '@/core/submit'
import { fingerprintFor } from '@/core/rate-limit'
import { selectEmailPort } from '@/ports/email'
import { selectRegistryPort } from '@/ports/registry'
import { selectRateLimitPort } from '@/ports/rate-limit'
import type { Answers } from '@/core/types'

/**
 * Frontera de confianza. Todo lo que hay debajo de esta función corre en servidor:
 * factores, tabla de puntos y umbral no cruzan nunca (constitution 8).
 */

const cache = new DedupCache()

const INTERNAL_MAILBOX = process.env.NEXUS_INTERNAL_MAILBOX ?? 'oportunidades@nexus.ad'

/**
 * La huella del origen, calculada AQUÍ y sólo aquí.
 *
 * Es el único punto con acceso a las cabeceras de la petición, y mantenerlo aquí es lo que permite
 * que `src/core` siga siendo probable sin servidor: al núcleo le llega una cadena, no una petición.
 *
 * La dirección en claro no se guarda, no se registra y no sale de esta función (`CA-L5`).
 */
async function huellaDelOrigen(): Promise<string | null> {
  const h = await headers()
  // `x-forwarded-for` es una lista; el cliente real es la primera entrada.
  const reenviada = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = reenviada || h.get('x-real-ip')?.trim()

  const sal = process.env.RATE_LIMIT_SALT
  if (ip && !sal) {
    // Mismo error que nos mordió con el registro: una protección apagada que no avisa no existe.
    console.error('[nexus] RATE_LIMIT_SALT sin definir: el límite de frecuencia está DESACTIVADO')
  }
  return fingerprintFor(ip, sal)
}

export async function submitAction(answers: Answers, submissionId: string): Promise<SubmitResult> {
  return submitLead(
    answers,
    submissionId,
    {
      emailPort: selectEmailPort(process.env),
      registryPort: selectRegistryPort(process.env),
      rateLimitPort: selectRateLimitPort(process.env),
      fingerprint: await huellaDelOrigen(),
      internalMailbox: INTERNAL_MAILBOX,
      now: () => new Date(),
      onDispatch: (report) => {
        if (Object.values(report).includes('failed')) {
          // Sin almacén duradero, el log del servidor es donde el fallo se hace visible (CA-17).
          console.error('[nexus] despacho incompleto', report)
        }
      },
    },
    cache,
  )
}
