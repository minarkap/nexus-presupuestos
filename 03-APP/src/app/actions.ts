'use server'

import { headers } from 'next/headers'
import { DedupCache, submitLead, type SubmitResult } from '@/core/submit'
import { fingerprintFor } from '@/core/rate-limit'
import { selectEmailPort } from '@/ports/email'
import { selectRegistryPort } from '@/ports/registry'
import { selectRateLimitPort } from '@/ports/rate-limit'
import { loadCatalog } from '@/ports/catalog'
import type { Answers } from '@/core/types'

/**
 * Frontera de confianza. Todo lo que hay debajo de esta función corre en servidor:
 * factores, tabla de puntos y umbral no cruzan nunca (constitution 8).
 */

const cache = new DedupCache()

// El defecto apunta a un buzón que RECIBE correo de verdad. El anterior
// (`oportunidades@nexus.ad`) era un dominio sin correo: cualquier despliegue que olvidara la
// variable perdía todos los leads en silencio, que es el único fallo de este sistema que nadie ve.
const INTERNAL_MAILBOX = process.env.NEXUS_INTERNAL_MAILBOX ?? 'jose.sanchis@executivelab.ai'

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

/**
 * Carga el catálogo sin dejar que un fallo escape hacia el visitante.
 *
 * `loadCatalog` lanza cuando no hay ni catálogo vivo ni foto utilizable, y eso está bien: quien
 * llama tiene que poder distinguir «no hay catálogo» de «hay uno vacío». Lo que no puede pasar es
 * que esa excepción suba hasta la acción de servidor, porque entonces el visitante vería un error y
 * **su lead se perdería**. Aquí se convierte en `null`, y `submitLead` sabe qué hacer con eso.
 */
async function catálogoParaEsteEnvío(): Promise<Awaited<ReturnType<typeof loadCatalog>> | null> {
  try {
    return await loadCatalog()
  } catch (e) {
    console.error('[nexus] sin catálogo: ni vivo ni en foto —', e instanceof Error ? e.message : e)
    return null
  }
}

export async function submitAction(answers: Answers, submissionId: string): Promise<SubmitResult> {
  // El catálogo se carga UNA vez por envío, aquí, y se pasa hacia abajo. Todo lo que hay debajo
  // de esta línea calcula con el mismo catálogo de principio a fin (CA-10). Si la base no responde,
  // `loadCatalog` se repliega a la foto y lo declara; sólo lanza cuando no queda nada que entregar,
  // y entonces el lead se registra igual pero sin cifra (CA-09).
  return submitLead(
    answers,
    submissionId,
    {
      catalog: await catálogoParaEsteEnvío(),
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
