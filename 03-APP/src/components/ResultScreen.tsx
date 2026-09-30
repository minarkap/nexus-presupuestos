import type { RedactedOutcome } from '@/core/types'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'

export interface ResultScreenProps {
  outcome: RedactedOutcome
  /** Página de citas compartida del equipo (C-07). Ausente → no se incrusta nada. */
  calendarUrl?: string | undefined
}

/** Sólo recibe RedactedOutcome: aquí no hay puntuación ni umbral que ocultar porque no llegan (constitution 8, 11). */
export function ResultScreen({ outcome, calendarUrl }: ResultScreenProps) {
  const tieneCifra = outcome.rangeText !== null
  return (
    <section className="result container" aria-labelledby="result-heading">
      <div className="wizard__frame">
        <Eyebrow>Tu estimación</Eyebrow>
        <h1 id="result-heading">{tieneCifra ? 'Esto es lo que suele costar' : 'Aquí no te vamos a dar un número'}</h1>
        {tieneCifra && <p className="result__range">{outcome.rangeText}</p>}
        <div className="result__body stack">
          <p>{outcome.bodyText}</p>
          <p className="disclaimer">{outcome.disclaimer}</p>
        </div>
        {outcome.showCalendar && (
          <Card variant="node" padding="lg" className="calendar">
            {/* Sin página de reservas, un título que invitara a reservar prometería lo que el párrafo de
                debajo desmiente (acta de tono S9, 2026-09-30). */}
            <h2>{calendarUrl ? 'Reserva un hueco' : 'Una conversación con un socio'}</h2>
            <p style={{ marginTop: 'var(--space-3)' }}>Treinta minutos con un socio para ver si encajamos. Sin coste y sin presentación comercial.</p>
            {calendarUrl ? (
              <>
                <iframe src={calendarUrl} title="Reservar una llamada con un socio de Nexus" style={{ marginTop: 'var(--space-6)' }} />
                <p className="muted" style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                  ¿No ves el calendario? <a href={calendarUrl} target="_blank" rel="noreferrer">Ábrelo en una pestaña nueva</a>.
                </p>
              </>
            ) : (
              <p style={{ marginTop: 'var(--space-4)' }}>Te escribimos con la disponibilidad del equipo en cuanto revisemos tu caso.</p>
            )}
          </Card>
        )}
      </div>
    </section>
  )
}
