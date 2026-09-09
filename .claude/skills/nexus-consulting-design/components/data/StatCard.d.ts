import * as React from 'react';

/**
 * Dashboard metric tile — uppercase label, large mono value, trend delta, accent bar.
 * @startingPoint section="Data" subtitle="KPI / metric tile for dashboards" viewport="700x180"
 */
export interface StatCardProps {
  /** Uppercase metric label. */
  label: string;
  /** The main figure (string or number). */
  value: string | number;
  /** Optional unit suffix, e.g. "%" or "h". */
  unit?: string;
  /** Change figure, e.g. "12%". */
  delta?: string;
  /** @default "up" */
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
  /** Left accent bar color. @default "cyan" */
  accent?: 'cyan' | 'blue';
  style?: React.CSSProperties;
}

/**
 * Dashboard metric tile — uppercase label, large mono value, trend delta, accent bar.
 */
export function StatCard(props: StatCardProps): JSX.Element;
