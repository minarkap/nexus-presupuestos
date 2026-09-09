import React from 'react';

/**
 * Nexus Consulting — ProgressBar
 * Gradient track fill for capacity / completion. Optional label + value.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  tone = 'gradient',
  size = 'md',
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const fills = {
    gradient: 'var(--accent-gradient)',
    cyan: 'var(--nx-cyan-500)',
    blue: 'var(--nx-blue-500)',
    success: 'var(--nx-success)',
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)', ...style }} {...rest}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {label && <span style={{ fontSize: 13, color: 'var(--text-body)' }}>{label}</span>}
          {showValue && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{
        height: h, width: '100%', borderRadius: 'var(--radius-pill)',
        background: 'var(--nx-navy-700)', overflow: 'hidden',
        boxShadow: 'var(--inset-hairline)',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: fills[tone] || fills.gradient,
          borderRadius: 'var(--radius-pill)',
          boxShadow: tone === 'gradient' || tone === 'cyan' ? 'var(--glow-cyan-sm)' : 'none',
          transition: 'width var(--dur-slow) var(--ease-emphasis)',
        }} />
      </div>
    </div>
  );
}
