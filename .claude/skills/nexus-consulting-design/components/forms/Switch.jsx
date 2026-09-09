import React from 'react';

/**
 * Nexus Consulting — Switch
 * Toggle with gradient "on" state and cyan glow.
 */
export function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  size = 'md',
  style = {},
  ...rest
}) {
  const dims = size === 'sm'
    ? { w: 36, h: 20, k: 14 }
    : { w: 46, h: 26, k: 20 };

  const toggle = () => { if (!disabled && onChange) onChange(!checked); };

  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)', userSelect: 'none', ...style,
    }} {...rest}>
      <span
        role="switch"
        aria-checked={checked}
        onClick={toggle}
        style={{
          position: 'relative', width: dims.w, height: dims.h, flex: 'none',
          borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--accent-gradient)' : 'var(--nx-navy-600)',
          border: `1px solid ${checked ? 'transparent' : 'var(--border-default)'}`,
          boxShadow: checked ? 'var(--glow-cyan-sm)' : 'none',
          transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        }}
      >
        <span style={{
          position: 'absolute', top: '50%', left: checked ? dims.w - dims.k - 3 : 3,
          transform: 'translateY(-50%)',
          width: dims.k, height: dims.k, borderRadius: '50%',
          background: 'var(--nx-white)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'left var(--dur-base) var(--ease-out)',
        }} />
      </span>
      {label && <span style={{ fontSize: 14, color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}
