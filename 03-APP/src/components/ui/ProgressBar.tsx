export function ProgressBar({ value, max, label, showLabel = true }: { value: number; max: number; label: string; showLabel?: boolean }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div className="progress">
      {showLabel && (
        <div className="progress__meta">
          <span>{label}</span>
          <span className="mono">{pct}%</span>
        </div>
      )}
      <div className="progress__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
