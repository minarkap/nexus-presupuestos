import { QUALIFICATION_THRESHOLD } from './catalog'
import { formatRange } from './format'
import type { PriceRange, RedactedOutcome, Score, ServiceRef } from './types'

/** Advertencia obligatoria en toda salida con cifra (constitution 5, CA-05). */
const DISCLAIMER =
  'Es un rango orientativo y sujeto a alcance. La cifra concreta se cierra al entender el problema, ' +
  'nunca antes.'

const DISCLAIMER_SIN_CIFRA =
  'Preferimos no dar un número antes de entender el problema. Es criterio de la casa, no una evasiva.'

const CUERPO_CUALIFICADO =
  'Con lo que nos has contado, este es el orden de magnitud en el que se mueve un encargo así. ' +
  'Puedes reservar ahora mismo un hueco con un socio para contrastarlo.'

const CUERPO_NO_CUALIFICADO =
  'Con lo que nos has contado, este es el orden de magnitud en el que se mueve un encargo así. ' +
  'Te enviamos la propuesta por correo; si quieres avanzar, basta con responder a ese mensaje.'

const CUERPO_SIN_CATALOGAR =
  'Lo que nos planteas entra en nuestra línea de estrategia y operaciones, donde el alcance varía ' +
  'demasiado entre encargos como para dar una cifra de partida honesta. Por eso no te damos ninguna: ' +
  'te proponemos una llamada de alcance de 30 minutos, sin coste, para ver si encajamos y qué haría ' +
  'falta para acotar tu caso.'

/**
 * Construye la ÚNICA estructura que cruza al navegador.
 *
 * La puntuación, el umbral, los factores y el identificador interno del servicio no aparecen aquí
 * porque NO EXISTEN en la estructura devuelta — no están ocultos, están ausentes. Es lo que
 * convierte el principio 8 en una propiedad estructural en vez de una disciplina que recordar.
 */
export function mapOutcome(
  service: ServiceRef | null,
  price: PriceRange | null,
  score: Score,
): RedactedOutcome {
  const showCalendar = score.total >= QUALIFICATION_THRESHOLD

  if (service === null || price === null) {
    return {
      kind: 'uncatalogued',
      rangeText: null,
      disclaimer: DISCLAIMER_SIN_CIFRA,
      bodyText: CUERPO_SIN_CATALOGAR,
      showCalendar,
    }
  }

  return {
    kind: showCalendar ? 'qualified' : 'not_qualified',
    rangeText: formatRange(price),
    disclaimer: DISCLAIMER,
    bodyText: showCalendar ? CUERPO_CUALIFICADO : CUERPO_NO_CUALIFICADO,
    showCalendar,
  }
}
