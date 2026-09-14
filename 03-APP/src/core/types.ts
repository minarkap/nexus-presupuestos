/** Tipos del dominio. Las claves son estables: aparecen en el plan §0 y en config. */

export type Challenge = 'ia' | 'ciberseguridad' | 'esg' | 'estrategia_operaciones'
export type Need = 'diagnostico' | 'implantacion' | 'acompanamiento' | 'desarrollo'

export type Size = '<50' | '50-249' | '250-999' | '>=1000'
export type Maturity = 'inicial' | 'en_desarrollo' | 'avanzada'
export type Timing = '<3m' | '3-6m' | '>6m'
export type Sponsor = 'si' | 'en_proceso' | 'no'
export type BudgetAnswer = 'asignado' | 'previsto' | 'sin'

/**
 * Frenos que el lead declara por su cuenta. Deliberadamente FUERA de `BusinessAnswers`: ese es el
 * tipo que lee el motor de puntuación, y la spec `pregunta-frenos-lead` decide que este dato no
 * puntúa. Dejarlo fuera convierte esa decisión en algo que el compilador sostiene, no la disciplina.
 */
export type Blocker = 'sin_perfiles' | 'dudas_legales' | 'sin_punto_de_partida' | 'intento_fallido'

export type ServiceId =
  | 'ai_opportunity_assessment'
  | 'ai_transformation_program'
  | 'ai_executive_advisory'
  | 'cyber_resilience_assessment'
  | 'esg_strategy_compliance'
  | 'custom_ai_solutions'

export interface ServiceRef {
  readonly id: ServiceId
  readonly label: string
  readonly officialMin: number
  /** null sólo en rango abierto por arriba (Custom AI Solutions). */
  readonly officialMax: number | null
  readonly unit: 'total' | 'month'
  readonly openEnded: boolean
}

export interface Uncatalogued {
  readonly kind: 'uncatalogued'
}

export interface PriceRange {
  readonly low: number
  /** null en rango abierto: el techo se rotula, no se calcula. */
  readonly high: number | null
  readonly unit: 'total' | 'month'
}

export interface SignalContribution {
  readonly signal: string
  readonly answer: string
  readonly points: number
}

export interface Score {
  readonly total: number
  readonly breakdown: readonly SignalContribution[]
}

export interface Contact {
  readonly name: string
  readonly email: string
  readonly company: string
  /** Consentimiento explícito al aviso de privacidad (spec CA-12). Se exige en cliente y en servidor. */
  readonly consent: boolean
}

export interface BusinessAnswers {
  readonly challenge: Challenge
  readonly need: Need | null
  readonly size: Size
  readonly maturity: Maturity
  readonly timing: Timing
  readonly sponsor: Sponsor
  readonly budget: BudgetAnswer
}

export interface Answers extends BusinessAnswers {
  readonly contact: Contact
  /** Multi-valor y saltable: la lista vacía es una respuesta, no un hueco. */
  readonly blockers: readonly Blocker[]
}

/** Lo ÚNICO que cruza al navegador. Ningún otro campo puede existir aquí. */
export interface RedactedOutcome {
  readonly kind: 'qualified' | 'not_qualified' | 'uncatalogued'
  readonly rangeText: string | null
  readonly disclaimer: string
  readonly bodyText: string
  readonly showCalendar: boolean
}

/** Lo que viaja al aviso interno y al registro. NUNCA al cliente. */
export interface LeadRecord {
  readonly submittedAt: string
  readonly contact: Contact
  readonly answers: BusinessAnswers
  readonly serviceLabel: string | null
  readonly rangeText: string | null
  readonly score: Score
  readonly blockers: readonly Blocker[]
}

export interface EmailMessage {
  readonly to: string
  readonly subject: string
  readonly body: string
}
