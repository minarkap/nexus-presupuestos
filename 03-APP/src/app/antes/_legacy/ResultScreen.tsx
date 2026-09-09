/* SNAPSHOT — el resultado original de Eric (2026-08-26), recuperado de `main`.
   Único cambio: los tipos vienen de `./types` (congelados) en vez del dominio vivo.
   No lo edites para "mejorarlo": es el antes de la comparación. */
import type { LegacyOutcome as RedactedOutcome } from './types'

export interface ResultScreenProps {
  outcome: RedactedOutcome
  /** Página de citas compartida del equipo (C-07). Ausente → no se incrusta nada. */
  calendarUrl?: string | undefined
}

/**
 * Sólo recibe RedactedOutcome. No hay puntuación ni umbral que ocultar aquí porque
 * no llegan hasta este punto (constitution 8, 11 · CA-06, CA-14).
 */
export function ResultScreen({ outcome, calendarUrl }: ResultScreenProps) {
  const tieneCifra = outcome.rangeText !== null

  return (
    <section className="result shell" aria-labelledby="result-heading">
      <p className="eyebrow">Tu estimación</p>
      <h1 id="result-heading">
        {tieneCifra ? 'Esto es lo que suele costar' : 'Aquí no te vamos a dar un número'}
      </h1>

      {tieneCifra && <p className="range">{outcome.rangeText}</p>}

      <p>{outcome.bodyText}</p>
      <p className="disclaimer">{outcome.disclaimer}</p>

      {outcome.showCalendar && (
        <div className="calendar">
          <h2>Reserva un hueco</h2>
          <p>
            Treinta minutos con un socio para ver si encajamos. Sin coste y sin presentación
            comercial.
          </p>
          {calendarUrl ? (
            <>
              <iframe src={calendarUrl} title="Reservar una llamada con un socio de Nexus" />
              <p>
                {/* Plan B del riesgo R-3: si la página de citas rechaza incrustarse. */}
                ¿No ves el calendario?{' '}
                <a href={calendarUrl} target="_blank" rel="noreferrer">
                  Ábrelo en una pestaña nueva
                </a>
                .
              </p>
            </>
          ) : (
            <p>Te escribimos con la disponibilidad del equipo en cuanto revisemos tu caso.</p>
          )}
        </div>
      )}
    </section>
  )
}
