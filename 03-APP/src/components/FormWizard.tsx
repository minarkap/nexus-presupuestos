'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BLOCKER_OPTIONS, BUDGET_OPTIONS, CHALLENGE_OPTIONS, MATURITY_OPTIONS, NEED_OPTIONS,
  SIZE_OPTIONS, SPONSOR_OPTIONS, TIMING_OPTIONS, type Option,
} from '@/core/options'
import type { Answers, Blocker, BudgetAnswer, Challenge, Contact, Maturity, Need, RedactedOutcome, Size, Sponsor, Timing } from '@/core/types'
import type { SubmitResult } from '@/core/submit'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Icon } from '@/components/ui/Icon'

type Draft = {
  challenge: Challenge | null
  need: Need | null
  size: Size | null
  maturity: Maturity | null
  timing: Timing | null
  sponsor: Sponsor | null
  budget: BudgetAnswer | null
  blockers: readonly Blocker[]
}

const EMPTY: Draft = {
  challenge: null, need: null, size: null, maturity: null, timing: null,
  sponsor: null, budget: null, blockers: [],
}

/** Las de respuesta única, que avanzan solas al elegir. `blockers` no está: admite varias. */
type SingleKey = Exclude<keyof Draft, 'blockers'>

type Step =
  | { kind: 'single'; key: SingleKey; question: string; options: readonly Option<never>[] }
  | { kind: 'multi'; key: 'blockers'; question: string; hint: string; options: readonly Option<Blocker>[] }

const STEPS: readonly Step[] = [
  { kind: 'single', key: 'challenge', question: '¿Cuál es el reto que tienes delante?', options: CHALLENGE_OPTIONS as never },
  { kind: 'single', key: 'need', question: '¿Qué necesitas exactamente?', options: NEED_OPTIONS as never },
  { kind: 'single', key: 'size', question: '¿Cuánta gente sois en la organización?', options: SIZE_OPTIONS as never },
  { kind: 'single', key: 'maturity', question: '¿En qué punto estáis con los datos y la IA?', options: MATURITY_OPTIONS as never },
  { kind: 'single', key: 'timing', question: '¿Cuándo querríais arrancar?', options: TIMING_OPTIONS as never },
  { kind: 'single', key: 'sponsor', question: '¿Hay alguien de dirección detrás de esto?', options: SPONSOR_OPTIONS as never },
  { kind: 'single', key: 'budget', question: '¿Cómo estáis de presupuesto?', options: BUDGET_OPTIONS as never },
  {
    kind: 'multi',
    key: 'blockers',
    question: '¿Qué os está frenando ahora mismo?',
    hint: 'Marca todas las que apliquen. Si no encaja ninguna, puedes continuar sin marcar nada.',
    options: BLOCKER_OPTIONS,
  },
]

const VALID_CHALLENGES = new Set<string>(CHALLENGE_OPTIONS.map((o) => o.value))

export interface FormWizardProps {
  submissionId: string
  onSubmit: (answers: Answers, submissionId: string) => Promise<SubmitResult>
  onDone: (outcome: RedactedOutcome) => void
  /** Primera respuesta ya dada en la página de inicio (spec C-03). Se ignora si no es una opción válida. */
  initialChallenge?: Challenge | undefined
}

export function FormWizard({ submissionId, onSubmit, onDone, initialChallenge }: FormWizardProps) {
  const seeded = initialChallenge !== undefined && VALID_CHALLENGES.has(initialChallenge)
  const [draft, setDraft] = useState<Draft>(seeded ? { ...EMPTY, challenge: initialChallenge } : EMPTY)
  const [contact, setContact] = useState<Contact>({ name: '', email: '', company: '', consent: false })
  const [index, setIndex] = useState(seeded ? 1 : 0)
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null)
  /** Bloqueo por exceso de envíos. No es el error de un campo: no ha escrito nada mal. */
  const [blocked, setBlocked] = useState<{ message: string; contactEmail: string } | null>(null)
  const [sending, setSending] = useState(false)

  /** La pregunta 2 sólo existe en la línea de IA (CA-07, CA-08 del antecesor). */
  const steps = useMemo(() => STEPS.filter((s) => s.key !== 'need' || draft.challenge === 'ia'), [draft.challenge])

  const total = steps.length + 1
  const onContactStep = index >= steps.length
  const current = steps[index]

  function toggle(value: Blocker) {
    setDraft((prev) => ({
      ...prev,
      blockers: prev.blockers.includes(value)
        ? prev.blockers.filter((b) => b !== value)
        : [...prev.blockers, value],
    }))
  }

  function choose(key: SingleKey, value: string) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value } as Draft
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
      blockers: draft.blockers,
      contact,
    } satisfies Answers
    const result = await onSubmit(answers, submissionId)
    setSending(false)
    if ('field' in result) { setFieldError({ field: result.field, message: result.message }); return }
    if (result.kind === 'rate_limited') {
      setBlocked({ message: result.message, contactEmail: result.contactEmail })
      return
    }
    onDone(result)
  }

  const consentInvalid = fieldError?.field === 'consent'

  return (
    <section className="wizard container" aria-labelledby="wizard-heading">
      <div className="wizard__frame">
        <div className="progress__meta" style={{ marginBottom: 'var(--space-2)' }}>
          <h2 id="wizard-heading" style={{ font: 'inherit', color: 'inherit', letterSpacing: 'inherit' }}>Pregunta {index + 1} de {total}</h2>
          <span className="mono">{Math.round(((index + 1) / total) * 100)}%</span>
        </div>
        <ProgressBar value={index + 1} max={total} label="Progreso del estimador" showLabel={false} />

        {onContactStep ? (
          <fieldset>
            <legend>¿A quién le enviamos la estimación?</legend>
            <div className="stack">
              <ContactField id="name" label="Tu nombre" value={contact.name} error={fieldError} onChange={(v) => setContact((c) => ({ ...c, name: v }))} />
              <ContactField id="email" label="Correo de trabajo" type="email" value={contact.email} error={fieldError} onChange={(v) => setContact((c) => ({ ...c, email: v }))} />
              <ContactField id="company" label="Organización" value={contact.company} error={fieldError} onChange={(v) => setContact((c) => ({ ...c, company: v }))} />
              <div className="field">
                <label className="check" htmlFor="consent">
                  <input
                    id="consent" type="checkbox" checked={contact.consent}
                    aria-invalid={consentInvalid} aria-describedby={consentInvalid ? 'consent-error' : undefined}
                    onChange={(e) => setContact((c) => ({ ...c, consent: e.target.checked }))}
                  />
                  <span>He leído el <Link href="/privacidad" target="_blank" rel="noreferrer">aviso de privacidad</Link> y acepto que Nexus Consulting use estos datos para enviarme la estimación y contactarme sobre ella.</span>
                </label>
                {consentInvalid && <p className="field__error" id="consent-error" role="alert">{fieldError?.message}</p>}
              </div>
            </div>
            {blocked && (
              <div className="field__error" role="alert" style={{ marginTop: 'var(--space-4)' }}>
                <p>{blocked.message}</p>
                <p style={{ marginTop: 'var(--space-2)' }}>
                  <a href={`mailto:${blocked.contactEmail}`}>{blocked.contactEmail}</a>
                </p>
              </div>
            )}
            <div className="wizard__nav">
              <Button variant="ghost" onClick={() => setIndex((i) => i - 1)}>Atrás</Button>
              <Button onClick={send} disabled={sending || !contact.consent} iconRight={<Icon name="arrow-right" size={16} />}>
                {sending ? 'Calculando…' : 'Ver mi estimación'}
              </Button>
            </div>
          </fieldset>
        ) : (
          current && (current.kind === 'multi' ? (
            <fieldset aria-describedby="blockers-hint">
              <legend>{current.question}</legend>
              <p className="field__hint" id="blockers-hint">{current.hint}</p>
              <div className="choices">
                {current.options.map((o) => (
                  <button
                    key={o.value} type="button" className="choice"
                    aria-pressed={draft.blockers.includes(o.value)}
                    onClick={() => toggle(o.value)}
                  >
                    <span>{o.label}</span>
                  </button>
                ))}
              </div>
              <div className="wizard__nav">
                {index > 0 && <Button variant="ghost" onClick={() => setIndex((i) => i - 1)}>Atrás</Button>}
                <Button onClick={() => setIndex((i) => Math.min(i + 1, total - 1))} iconRight={<Icon name="arrow-right" size={16} />}>
                  Continuar
                </Button>
              </div>
            </fieldset>
          ) : (
            <fieldset>
              <legend>{current.question}</legend>
              <div className="choices">
                {current.options.map((o: Option<string>) => (
                  <button key={o.value} type="button" className="choice" aria-pressed={draft[current.key] === o.value} onClick={() => choose(current.key, o.value)}>
                    <span>{o.label}</span>
                    <span className="choice__arrow"><Icon name="arrow-right" size={18} /></span>
                  </button>
                ))}
              </div>
              {index > 0 && (
                <div className="wizard__nav">
                  <Button variant="ghost" onClick={() => setIndex((i) => i - 1)}>Atrás</Button>
                </div>
              )}
            </fieldset>
          ))
        )}
      </div>
    </section>
  )
}

function ContactField({ id, label, value, onChange, error, type = 'text' }: {
  id: string; label: string; value: string; type?: string
  onChange: (v: string) => void
  error: { field: string; message: string } | null
}) {
  const invalid = error?.field === id
  // El error va FUERA del <label> para no contaminar el nombre accesible; se enlaza con aria-describedby.
  return (
    <div className="field">
      <label htmlFor={id}><span className="field__label">{label}</span></label>
      <input id={id} type={type} value={value} className="field__input" aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} onChange={(e) => onChange(e.target.value)} />
      {invalid && <p className="field__error" id={`${id}-error`} role="alert">{error.message}</p>}
    </div>
  )
}
