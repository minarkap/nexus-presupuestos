'use client'

import { useState } from 'react'
import { submitAction } from '@/app/actions'
import { FormWizard } from './FormWizard'
import { ResultScreen } from './ResultScreen'
import type { Challenge, RedactedOutcome } from '@/core/types'

type Stage = 'form' | 'result'

/** El único island con estado del sitio: recorrido del estimador → resultado. */
export function Estimator({ initialChallenge, calendarUrl }: { initialChallenge?: Challenge; calendarUrl?: string | undefined }) {
  const [stage, setStage] = useState<Stage>('form')
  const [outcome, setOutcome] = useState<RedactedOutcome | null>(null)
  /** Acuñado al montar: clave de deduplicación de esta sesión (CA-18 del antecesor). */
  const [submissionId] = useState(() => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`))

  if (stage === 'result' && outcome) return <ResultScreen outcome={outcome} calendarUrl={calendarUrl} />
  return (
    <FormWizard
      submissionId={submissionId}
      initialChallenge={initialChallenge}
      onSubmit={submitAction}
      onDone={(o) => { setOutcome(o); setStage('result') }}
    />
  )
}
