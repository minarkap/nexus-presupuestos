'use client'

import { useState } from 'react'
import { submitAction } from './actions'
import { FormWizard } from '@/components/FormWizard'
import { Landing } from '@/components/Landing'
import { ResultScreen } from '@/components/ResultScreen'
import type { RedactedOutcome } from '@/core/types'

type Stage = 'landing' | 'form' | 'result'

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing')
  const [outcome, setOutcome] = useState<RedactedOutcome | null>(null)
  /** Acuñado al montar: es la clave de deduplicación de esta sesión (CA-18). */
  const [submissionId] = useState(() => crypto.randomUUID())

  if (stage === 'result' && outcome) {
    return <ResultScreen outcome={outcome} calendarUrl={process.env.NEXT_PUBLIC_CALENDAR_URL} />
  }

  if (stage === 'form') {
    return (
      <FormWizard
        submissionId={submissionId}
        onSubmit={submitAction}
        onDone={(o) => {
          setOutcome(o)
          setStage('result')
        }}
      />
    )
  }

  return <Landing onStart={() => setStage('form')} />
}
