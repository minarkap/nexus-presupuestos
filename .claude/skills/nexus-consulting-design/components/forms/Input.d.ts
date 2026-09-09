import * as React from 'react';

/**
 * Text input on dark surfaces with cyan focus ring, optional label, leading icon, hint/error.
 * @startingPoint section="Forms" subtitle="Text field with label, icon, focus ring" viewport="700x150"
 */
export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** @default "text" */
  type?: string;
  iconLeft?: React.ReactNode;
  /** Helper text below the field. */
  hint?: string;
  /** Error message — turns the field red and overrides hint. */
  error?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * Text input on dark surfaces with cyan focus ring, optional label, leading icon, hint/error.
 */
export function Input(props: InputProps): JSX.Element;
