import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'solid' | 'gradient' | 'node'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  as?: 'div' | 'article' | 'section' | 'li'
  children: ReactNode
}

export function Card({ variant = 'solid', padding = 'md', interactive, as: Tag = 'div', className, children, ...rest }: CardProps) {
  const cls = ['card', variant !== 'solid' ? `card--${variant}` : '', padding !== 'none' ? `card--pad-${padding}` : '', interactive ? 'card--interactive' : '', className ?? '']
    .filter(Boolean).join(' ')
  return <Tag {...rest} className={cls}>{children}</Tag>
}
