import * as React from 'react';

/**
 * Primary call-to-action button for Nexus Consulting interfaces.
 * @startingPoint section="Core" subtitle="Buttons — primary, secondary, ghost, outline" viewport="700x150"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  /** Stretch to fill container width. */
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Primary call-to-action button for Nexus Consulting interfaces.
 * Use `primary` (blue→cyan gradient w/ glow) for the main action, `secondary`/`outline` for
 * supporting actions, `ghost` for low-emphasis, `danger` for destructive.
 */
export function Button(props: ButtonProps): JSX.Element;
