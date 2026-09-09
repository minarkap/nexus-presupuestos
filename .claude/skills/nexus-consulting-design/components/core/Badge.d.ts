import * as React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  /** Color tone. @default "accent" */
  tone?: 'accent' | 'cyan' | 'neutral' | 'success' | 'warning' | 'danger';
  /** Fill style. @default "soft" */
  variant?: 'soft' | 'solid';
  /** Show a leading status dot (glows in soft variant). */
  dot?: boolean;
  style?: React.CSSProperties;
}

/**
 * Compact status / category label. Use `dot` for live-status pills (e.g. "Activo").
 */
export function Badge(props: BadgeProps): JSX.Element;
