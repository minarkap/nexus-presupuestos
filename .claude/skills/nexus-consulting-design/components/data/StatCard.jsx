import React from 'react';

/**
 * Nexus Consulting — StatCard
 * Metric tile for dashboards: label, big mono value, delta trend, optional icon.
 */
export function StatCard({
  label,
  value,
  unit,
  delta,
  trend = 'up',
  icon = null,
  accent = 'cyan',
  style = {},
  ...rest
}) {
  const accents = {
    cyan: 'var(--nx-cyan-500)',
    blue: 'var(--nx-blue-400)',
  };
  const trendColor = trend === 'down' ? 'var(--nx-danger)' : 'var(--nx-success)';
  const arrow = trend === 'down' ? '▾' : '▴';

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        ...style,
      }}
      {...rest}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
        background: accents[accent] || accents.cyan, opacity: 0.85,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{
          fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>{label}</span>
        {icon && <span style={{ color: accents[accent] || accents.cyan, display: 'flex' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 34,
          color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1,
        }}>{value}</span>
        {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-muted)' }}>{unit}</span>}
      </div>
      {delta != null && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: trendColor, fontSize: 13, fontWeight: 600 }}>{arrow} {delta}</span>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>vs. mes anterior</span>
        </div>
      )}
    </div>
  );
}
