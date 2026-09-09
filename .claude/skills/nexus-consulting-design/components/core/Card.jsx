import React from 'react';

/**
 * Nexus Consulting — Card
 * Modular surface. Variants: solid (default), glass (blur), gradient (accent edge), node (pattern).
 */
export function Card({
  children,
  variant = 'solid',
  padding = 'md',
  interactive = false,
  glow = false,
  style = {},
  ...rest
}) {
  const pads = { none: 0, sm: 16, md: 24, lg: 32 };
  const p = pads[padding] ?? 24;

  const [hover, setHover] = React.useState(false);

  const variants = {
    solid: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
    },
    glass: {
      background: 'var(--surface-overlay)',
      border: '1px solid var(--border-default)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
    },
    gradient: {
      background: 'linear-gradient(160deg, var(--nx-navy-800) 0%, var(--nx-navy-900) 100%)',
      border: '1px solid var(--border-default)',
    },
    node: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      backgroundImage: 'radial-gradient(circle, rgba(33,212,253,0.10) 1px, transparent 1.4px)',
      backgroundSize: '20px 20px',
    },
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        padding: p,
        boxShadow: glow ? 'var(--glow-blue-sm)' : 'var(--shadow-md)',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        ...variants[variant],
        ...(interactive && hover
          ? { transform: 'translateY(-3px)', borderColor: 'var(--border-accent)', boxShadow: 'var(--glow-blue-lg)', cursor: 'pointer' }
          : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
