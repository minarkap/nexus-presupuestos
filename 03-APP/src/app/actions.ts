'use server'

import { DedupCache, submitLead, type SubmitResult } from '@/core/submit'
import { selectEmailPort } from '@/ports/email'
import { selectRegistryPort } from '@/ports/registry'
import type { Answers } from '@/core/types'

/**
 * Frontera de confianza. Todo lo que hay debajo de esta función corre en servidor:
 * factores, tabla de puntos y umbral no cruzan nunca (constitution 8).
 */

const cache = new DedupCache()

const INTERNAL_MAILBOX = process.env.NEXUS_INTERNAL_MAILBOX ?? 'oportunidades@nexus.ad'

export async function submitAction(answers: Answers, submissionId: string): Promise<SubmitResult> {
  return submitLead(
    answers,
    submissionId,
    {
      emailPort: selectEmailPort(process.env),
      registryPort: selectRegistryPort(process.env),
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
