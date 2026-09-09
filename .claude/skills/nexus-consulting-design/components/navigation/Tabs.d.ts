import * as React from 'react';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  /** Active tab id (defaults to first item). */
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

/**
 * Underline tab bar with gradient/cyan active indicator. Controlled via `value` + `onChange`.
 */
export function Tabs(props: TabsProps): JSX.Element;
