import React from 'react';

/**
 * Nexus Consulting — Tabs
 * Underline tab bar with animated cyan indicator.
 * items: [{ id, label }]. Controlled via `value` + `onChange`.
 */
export function Tabs({
  items = [],
  value,
  onChange,
  style = {},
  ...rest
}) {
  const active = value ?? items[0]?.id;

  return (
    <div
      role="tablist"
      style={{
        display: 'flex', gap: 4, position: 'relative',
        borderBottom: '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-display)', ...style,
      }}
      {...rest}
    >
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange && onChange(it.id)}
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 16px',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 14,
              color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
              transition: 'color var(--dur-base) var(--ease-out)',
            }}
          >
            {it.label}
            <span style={{
              position: 'absolute', left: 12, right: 12, bottom: -1, height: 2,
              borderRadius: 2,
              background: isActive ? 'var(--accent-gradient)' : 'transparent',
              boxShadow: isActive ? 'var(--glow-cyan-sm)' : 'none',
              transition: 'background var(--dur-base) var(--ease-out)',
            }} />
          </button>
        );
      })}
    </div>
  );
}
