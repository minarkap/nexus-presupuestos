import React from 'react';

/**
 * Nexus Consulting — Button
 * Variants: primary (gradient), secondary (graphite), ghost, outline, danger.
 * Sizes: sm, md, lg.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  full = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 13, padding: '8px 14px', height: 34, gap: 7, radius: 'var(--radius-sm)' },
    md: { fontSize: 14, padding: '11px 20px', height: 42, gap: 9, radius: 'var(--radius-md)' },
    lg: { fontSize: 16, padding: '15px 28px', height: 52, gap: 11, radius: 'var(--radius-md)' },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: s.fontSize,
    letterSpacing: '0.01em',
    lineHeight: 1,
    height: s.height,
    padding: s.padding,
    borderRadius: s.radius,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const variants = {
    primary: {
      background: 'var(--accent-gradient)',
      color: 'var(--text-on-accent)',
      boxShadow: 'var(--glow-blue-sm)',
    },
    secondary: {
      background: 'var(--surface-raised)',
      color: 'var(--text-strong)',
      borderColor: 'var(--border-default)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
    },
    danger: {
      background: 'var(--nx-danger)',
      color: '#360B0B',
    },
  };

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const hoverFx = !disabled && hover ? {
    primary: { boxShadow: 'var(--glow-blue-lg)' },
    secondary: { background: 'var(--nx-navy-700)', borderColor: 'var(--border-strong)' },
    outline: { borderColor: 'var(--border-accent)', color: 'var(--text-strong)' },
    ghost: { background: 'rgba(148,163,184,0.10)', color: 'var(--text-strong)' },
    danger: { filter: 'brightness(1.08)' },
  }[variant] : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...base,
        ...variants[variant],
        ...hoverFx,
        transform: active && !disabled ? 'translateY(1px) scale(0.99)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
