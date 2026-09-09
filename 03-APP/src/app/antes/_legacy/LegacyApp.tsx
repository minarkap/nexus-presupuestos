/* SNAPSHOT — el recorrido original de Eric (2026-08-26), recuperado de `main`.
   Único cambio: los tipos vienen de `./types` (congelados) en vez del dominio vivo.
   No lo edites para "mejorarlo": es el antes de la comparación. */
'use client'

import { useState } from 'react'
import { simulateSubmit } from './simulate'
import { FormWizard } from './FormWizard'
import { Landing } from './Landing'
import { ResultScreen } from './ResultScreen'
import type { LegacyOutcome as RedactedOutcome } from './types'

type Stage = 'landing' | 'form' | 'result'

export function LegacyApp() {
  const [stage, setStage] = useState<Stage>('landing')
  const [outcome, setOutcome] = useState<RedactedOutcome | null>(null)
  /** Acuñado al montar: es la clave de deduplicación de esta sesión (CA-18). */
  const [submissionId] = useState(() => crypto.randomUUID())

  if (stage === 'result' && outcome) {
    return <ResultScreen outcome={outcome} calendarUrl={undefined} />
  }

  if (stage === 'form') {
    return (
      <FormWizard
        submissionId={submissionId}
        onSubmit={simulateSubmit}
        onDone={(o) => {
          setOutcome(o)
          setStage('result')
        }}
      />
    )
  }

  return <Landing onStart={() => setStage('form')} />
}
