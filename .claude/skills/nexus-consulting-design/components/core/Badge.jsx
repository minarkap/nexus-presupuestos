import React from 'react';

/**
 * Nexus Consulting — Badge
 * Compact status / category label. Tones: accent, cyan, neutral, success, warning, danger.
 */
export function Badge({
  children,
  tone = 'accent',
  variant = 'soft',
  dot = false,
  style = {},
  ...rest
}) {
  const palettes = {
    accent:  { c: 'var(--nx-blue-400)',  bg: 'rgba(20,92,255,0.16)',  bd: 'rgba(20,92,255,0.34)' },
    cyan:    { c: 'var(--nx-cyan-400)',  bg: 'rgba(33,212,253,0.14)', bd: 'rgba(33,212,253,0.34)' },
    neutral: { c: 'var(--nx-slate-200)', bg: 'rgba(148,163,184,0.14)', bd: 'rgba(148,163,184,0.26)' },
    success: { c: 'var(--nx-success)',   bg: 'rgba(45,212,167,0.14)', bd: 'rgba(45,212,167,0.34)' },
    warning: { c: 'var(--nx-warning)',   bg: 'rgba(251,191,84,0.14)', bd: 'rgba(251,191,84,0.34)' },
    danger:  { c: 'var(--nx-danger)',    bg: 'rgba(251,106,106,0.14)', bd: 'rgba(251,106,106,0.34)' },
  };
  const pal = palettes[tone] || palettes.accent;

  const solid = variant === 'solid';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12,
        lineHeight: 1,
        letterSpacing: '0.02em',
        padding: '5px 10px',
        borderRadius: 'var(--radius-pill)',
        color: solid ? 'var(--nx-night)' : pal.c,
        background: solid ? pal.c : pal.bg,
        border: `1px solid ${solid ? 'transparent' : pal.bd}`,
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: solid ? 'var(--nx-night)' : pal.c,
          boxShadow: solid ? 'none' : `0 0 8px ${pal.c}`,
        }} />
      )}
      {children}
    </span>
  );
}
