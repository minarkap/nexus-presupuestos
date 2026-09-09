import * as React from 'react';

export interface ProgressBarProps {
  value?: number;
  /** @default 100 */
  max?: number;
  label?: string;
  /** Show the percentage. @default true */
  showValue?: boolean;
  /** Fill color. @default "gradient" */
  tone?: 'gradient' | 'cyan' | 'blue' | 'success';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

/**
 * Progress / capacity bar with gradient fill + cyan glow. Optional label and percentage.
 */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
