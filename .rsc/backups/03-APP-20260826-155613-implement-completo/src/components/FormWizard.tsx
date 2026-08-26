'use client'

import { useMemo, useState } from 'react'
import {
  BUDGET_OPTIONS, CHALLENGE_OPTIONS, MATURITY_OPTIONS, NEED_OPTIONS,
  SIZE_OPTIONS, SPONSOR_OPTIONS, TIMING_OPTIONS, type Option,
} from '@/core/options'
import type { Answers, BudgetAnswer, Challenge, Contact, Maturity, Need, RedactedOutcome, Size, Sponsor, Timing } from '@/core/types'
import type { SubmitResult } from '@/core/submit'

type Draft = {
  challenge: Challenge | null
  need: Need | null
  size: Size | null
  maturity: Maturity | null
  timing: Timing | null
  sponsor: Sponsor | null
  budget: BudgetAnswer | null
}

const EMPTY: Draft = {
  challenge: null, need: null, size: null, maturity: null, timing: null, sponsor: null, budget: null,
}

type StepKey = keyof Draft

const STEPS: { key: StepKey; question: string; options: readonly Option<never>[] }[] = [
  { key: 'challenge', question: '¿Cuál es el reto que tienes delante?', options: CHALLENGE_OPTIONS as never },
  { key: 'need', question: '¿Qué necesitas exactamente?', options: NEED_OPTIONS as never },
  { key: 'size', question: '¿Cuánta gente sois en la organización?', options: SIZE_OPTIONS as never },
  { key: 'maturity', question: '¿En qué punto estáis con los datos y la IA?', options: MATURITY_OPTIONS as never },
  { key: 'timing', question: '¿Cuándo querríais arrancar?', options: TIMING_OPTIONS as never },
  { key: 'sponsor', question: '¿Hay alguien de dirección detrás de esto?', options: SPONSOR_OPTIONS as never },
  { key: 'budget', question: '¿Cómo estáis de presupuesto?', options: BUDGET_OPTIONS as never },
]

export interface FormWizardProps {
  submissionId: string
  onSubmit: (answers: Answers, submissionId: string) => Promise<SubmitResult>
  onDone: (outcome: RedactedOutcome) => void
}

export function FormWizard({ submissionId, onSubmit, onDone }: FormWizardProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [contact, setContact] = useState<Contact>({ name: '', email: '', company: '' })
  const [index, setIndex] = useState(0)
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null)
  const [sending, setSending] = useState(false)

  /** La pregunta 2 sólo existe en la línea de IA (CA-07, CA-08). */
  const steps = useMemo(
    () => STEPS.filter((s) => s.key !== 'need' || draft.challenge === 'ia'),
    [draft.challenge],
  )

  const total = steps.length + 1 // + la pantalla de contacto
  const onContactStep = index >= steps.length
  const current = steps[index]

  function choose(key: StepKey, value: string) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value } as Draft
      // Salir de IA descarta la respuesta de la pregunta 2: deja de contar (spec §Caminos de error).
      if (key === 'challenge' && value !== 'ia') next.need = null
      return next
    })
    setIndex((i) => Math.min(i + 1, total - 1))
  }

  async function send() {
    setFieldError(null)
    setSending(true)
    const answers = {
      challenge: draft.challenge as Challenge,
      need: draft.need,
      size: draft.size as Size,
      maturity: draft.maturity as Maturity,
      timing: draft.timing as Timing,
      sponsor: draft.sponsor as Sponsor,
      budget: draft.budget as BudgetAnswer,
      contact,
    } satisfies Answers

    const result = await onSubmit(answers, submissionId)
    setSending(false)

    if ('field' in result) {
      setFieldError({ field: result.field, message: result.message })
      return
    }
    onDone(result)
  }

  const pct = Math.round(((index + 1) / total) * 100)

  return (
    <section className="wizard shell" aria-labelledby="wizard-heading">
      <h2 id="wizard-heading" className="progress">
        Pregunta {index + 1} de {total}
      </h2>
      <div className="progress-track" role="presentation">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {onContactStep ? (
        <fieldset>
          <legend>¿A quién le enviamos la estimación?</legend>
          <ContactField
            id="name" label="Tu nombre" value={contact.name} error={fieldError}
            onChange={(v) => setContact((c) => ({ ...c, name: v }))}
          />
          <ContactField
            id="email" label="Correo de trabajo" type="email" value={contact.email} error={fieldError}
            onChange={(v) => setContact((c) => ({ ...c, email: v }))}
          />
          <ContactField
            id="company" label="Organización" value={contact.company} error={fieldError}
            onChange={(v) => setContact((c) => ({ ...c, company: v }))}
          />
          <div className="nav">
            <button type="button" className="ghost" onClick={() => setIndex((i) => i - 1)}>
              Atrás
            </button>
            <button type="button" className="cta" onClick={send} disabled={sending}>
              {sending ? 'Calculando…' : 'Ver mi estimación'}
            </button>
          </div>
        </fieldset>
      ) : (
        current && (
          <fieldset>
            <legend>{current.question}</legend>
            <div className="choices">
              {current.options.map((o: Option<string>) => (
                <button
                  key={o.value}
                  type="button"
                  className="choice"
                  aria-pressed={draft[current.key] === o.value}
                  onClick={() => choose(current.key, o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {index > 0 && (
              <div className="nav">
                <button type="button" className="ghost" onClick={() => setIndex((i) => i - 1)}>
                  Atrás
                </button>
              </div>
            )}
          </fieldset>
        )
      )}
    </section>
  )
}

function ContactField({
  id, label, value, onChange, error, type = 'text',
}: {
  id: string; label: string; value: string; type?: string
  onChange: (v: string) => void
  error: { field: string; message: string } | null
}) {
  const invalid = error?.field === id
  // El mensaje de error va FUERA del <label>: dentro contaminaría el nombre accesible del campo,
  // que pasaría a leerse «Correo de trabajo Revisa el correo». Se enlaza con aria-describedby.
  return (
    <div className="field">
      <label htmlFor={id}>
        <span>{label}</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {invalid && (
        <p className="error" id={`${id}-error`} role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
