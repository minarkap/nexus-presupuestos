import type { ReactNode } from 'react'

interface SectionProps {
  tone?: 'base' | 'sunken' | 'raised'
  id?: string
  labelledBy?: string
  narrow?: boolean
  className?: string
  children: ReactNode
}

/** Sección con ritmo: el tono alterna fondo y hairlines para que la página no sea una sola franja. */
export function Section({ tone = 'base', id, labelledBy, narrow, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={['section', tone !== 'base' ? `section--${tone}` : '', className ?? ''].filter(Boolean).join(' ')}>
      <div className={narrow ? 'container container--narrow' : 'container'}>{children}</div>
    </section>
  )
}
