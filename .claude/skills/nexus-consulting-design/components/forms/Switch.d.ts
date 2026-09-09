import * as React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/**
 * Toggle switch — gradient fill + cyan glow when on. Controlled via `checked` + `onChange(next)`.
 */
export function Switch(props: SwitchProps): JSX.Element;
