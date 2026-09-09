import * as React from 'react';

/**
 * Modular content surface — the building block of Nexus dashboards and layouts.
 * @startingPoint section="Core" subtitle="Modular card surfaces — solid, glass, gradient, node" viewport="700x260"
 */
export interface CardProps {
  children?: React.ReactNode;
  /** Surface treatment. @default "solid" */
  variant?: 'solid' | 'glass' | 'gradient' | 'node';
  /** Inner padding. @default "md" */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Lift + cyan border + glow on hover. */
  interactive?: boolean;
  /** Apply blue connection glow instead of neutral shadow. */
  glow?: boolean;
  style?: React.CSSProperties;
}

/**
 * Modular content surface — the building block of Nexus dashboards and marketing layouts.
 * `glass` for overlays on imagery, `gradient` for hero/feature cards, `node` adds the subtle
 * connection-dot pattern. Set `interactive` for clickable cards.
 */
export function Card(props: CardProps): JSX.Element;
