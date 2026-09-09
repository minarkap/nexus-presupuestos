/**
 * Tipos del snapshot, congelados con la forma que tenían el 2026-08-26.
 *
 * Existen para que la página-museo sea INMUNE a los cambios del dominio vivo: `Contact` ya no es
 * esto (ganó `consent`), y si el museo importara los tipos actuales, dejaría de compilar cada vez
 * que el producto evoluciona — o peor, se «arreglaría» solo y dejaría de ser el antes.
 */
import type { BudgetAnswer, Challenge, Maturity, Need, Size, Sponsor, Timing } from '@/core/types'

export interface LegacyContact {
  readonly name: string
  readonly email: string
  readonly company: string
}

export interface LegacyAnswers {
  readonly challenge: Challenge
  readonly need: Need | null
  readonly size: Size
  readonly maturity: Maturity
  readonly timing: Timing
  readonly sponsor: Sponsor
  readonly budget: BudgetAnswer
  readonly contact: LegacyContact
}

export interface LegacyOutcome {
  readonly kind: 'qualified' | 'not_qualified' | 'uncatalogued'
  readonly rangeText: string | null
  readonly disclaimer: string
  readonly bodyText: string
  readonly showCalendar: boolean
}

export type LegacySubmitResult =
  | LegacyOutcome
  | { readonly kind: 'validation_error'; readonly field: string; readonly message: string }
