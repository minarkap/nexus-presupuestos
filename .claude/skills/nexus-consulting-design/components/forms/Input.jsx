import React from 'react';

/**
 * Nexus Consulting — Input
 * Text field with optional label, leading icon, hint/error, on dark surfaces.
 */
export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  iconLeft = null,
  hint,
  error,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const fieldId = id || reactId;

  const borderColor = error
    ? 'var(--nx-danger)'
    : focus
      ? 'var(--border-accent)'
      : 'var(--border-default)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontFamily: 'var(--font-body)', ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{
          fontSize: 13, fontWeight: 500, color: 'var(--text-body)', letterSpacing: '0.01em',
        }}>{label}</label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--nx-navy-900)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: '0 14px', height: 44,
        boxShadow: focus ? `0 0 0 3px var(--ring-accent)` : 'none',
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        opacity: disabled ? 0.5 : 1,
      }}>
        {iconLeft && <span style={{ display: 'flex', color: 'var(--text-faint)', flex: 'none' }}>{iconLeft}</span>}
        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text-strong)', fontFamily: 'var(--font-body)', fontSize: 14,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 12, color: error ? 'var(--nx-danger)' : 'var(--text-faint)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
