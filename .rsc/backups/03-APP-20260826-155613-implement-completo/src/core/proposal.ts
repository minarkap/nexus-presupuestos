import type { Contact, PriceRange, ServiceRef } from './types'

export type OutcomeKind = 'qualified' | 'not_qualified' | 'uncatalogued'

function formatRange(price: PriceRange): string {
  const sufijo = price.unit === 'month' ? ' al mes' : ''
  if (price.high === null) {
    return `desde ${price.low.toLocaleString('es-ES')} €${sufijo}, con el techo por cerrar en una conversación`
  }
  return `entre ${price.low.toLocaleString('es-ES')} y ${price.high.toLocaleString('es-ES')} €${sufijo}`
}

/**
 * Redacta la propuesta con la estructura de la casa —tesis, problema, enfoque, diferenciación,
 * resultado esperado y siguiente paso— SIN ETIQUETAR NINGUNA (CA-20). El orden está ahí; los
 * rótulos no. Debe leerse como un texto escrito por una persona, no como una plantilla rellenada.
 */
export function composeProposal(
  contact: Contact,
  service: ServiceRef | null,
  price: PriceRange | null,
  kind: OutcomeKind,
): string {
  // split(' ', 1).join('') devuelve siempre una cadena: sin rama muerta y sin aserción de tipo.
  // La validación de contacto ya garantiza que el nombre no viene vacío.
  const nombre = contact.name.trim().split(' ', 1).join('')

  if (kind === 'uncatalogued' || service === null || price === null) {
    return [
      `${nombre},`,
      '',
      'gracias por contarnos lo que tenéis entre manos. Lo que nos planteas cae en nuestra línea de ' +
        'estrategia y operaciones, y ahí el alcance cambia tanto de un encargo a otro que cualquier ' +
        'cifra de partida sería inventada.',
      '',
      'Así que no te damos ninguna, y preferimos decírtelo claro: dar un número antes de entender el ' +
        'problema es la forma más rápida de equivocarse en los dos sentidos. Lo que sí podemos hacer ' +
        'ya es escucharte con calma.',
      '',
      'Te proponemos una llamada de 30 minutos, sin coste, para ver si encajamos y qué haría falta ' +
        'para acotar tu caso. No es una presentación comercial: es una conversación para saber si ' +
        'somos la firma adecuada para esto.',
      '',
      'Un saludo,',
      'Nexus Strategy & Technology',
    ].join('\n')
  }

  const cierre =
    kind === 'qualified'
      ? 'Tienes tu cita confirmada con uno de nuestros socios; ahí contrastamos el alcance y la cifra ' +
        'deja de ser una horquilla.'
      : 'Si quieres avanzar, responde a este correo y lo vemos. No hace falta que prepares nada.'

  return [
    `${nombre},`,
    '',
    `por lo que nos cuentas de ${contact.company}, el encargo que encaja es ${service.label}.`,
    '',
    'El punto de partida que describes —la madurez actual, el tamaño de la organización y el momento ' +
      'en que queréis arrancar— es el que determina el esfuerzo real, y por eso lo preguntamos antes ' +
      'de hablar de dinero.',
    '',
    `Con esos datos, un encargo así se mueve ${formatRange(price)}. Es un rango orientativo y sujeto ` +
      'a alcance: no es un precio cerrado y no pretende serlo.',
    '',
    'Trabajamos con equipos de dirección, no con departamentos aislados, y eso cambia el tipo de ' +
      'conversación que vas a tener con nosotros. Lo que te llevas no es un informe: es una decisión ' +
      'que podéis defender internamente.',
    '',
    cierre,
    '',
    'Un saludo,',
    'Nexus Strategy & Technology',
  ].join('\n')
}
