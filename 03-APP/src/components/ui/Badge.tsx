import type { ReactNode } from 'react'

export function Badge({ tone = 'cyan', dot, children }: { tone?: 'accent' | 'cyan' | 'neutral'; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`badge badge--${tone}`}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
