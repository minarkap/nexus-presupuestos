import type { LegacyAnswers, LegacySubmitResult } from './types'

/**
 * El envío del museo NO sale a la calle.
 *
 * El estimador original no pedía consentimiento —el actual sí, y el servidor lo exige (CA-12)—, así
 * que enchufar esta pantalla a la acción real crearía una vía que se salta ese requisito. Aquí sólo
 * se valida el contacto, como hacía el original, y se devuelve el caso de referencia del catálogo
 * (600 empleados, madurez inicial, arranque en 4 meses, diagnóstico de IA → 28.000 – 35.000 €).
 * Los textos son los que había el 2026-08-26.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function simulateSubmit(answers: LegacyAnswers): Promise<LegacySubmitResult> {
  const { name, email, company } = answers.contact
  if (!name.trim()) return { kind: 'validation_error', field: 'name', message: 'Necesitamos tu nombre.' }
  if (!EMAIL_RE.test(email.trim())) {
    return { kind: 'validation_error', field: 'email', message: 'Revisa el correo: no podemos enviarte la propuesta a esa dirección.' }
  }
  if (!company.trim()) return { kind: 'validation_error', field: 'company', message: 'Necesitamos el nombre de tu organización.' }

  return {
    kind: 'qualified',
    rangeText: '28.000 – 35.000 €',
    disclaimer:
      'Es un rango orientativo y sujeto a alcance. La cifra concreta se cierra al entender el problema, nunca antes.',
    bodyText:
      'Con lo que nos has contado, este es el orden de magnitud en el que se mueve un encargo así. ' +
      'Puedes reservar ahora mismo un hueco con un socio para contrastarlo.',
    showCalendar: true,
  }
}
