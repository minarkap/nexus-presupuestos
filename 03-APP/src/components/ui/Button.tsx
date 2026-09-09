import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Base {
  variant?: Variant
  size?: Size
  full?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  className?: string
  children: ReactNode
}
type AsButton = Base & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>
type AsLink = Base & { href: string; target?: string; rel?: string }

function classes({ variant = 'primary', size = 'md', full, className }: Base): string {
  return ['btn', `btn--${variant}`, `btn--${size}`, full ? 'btn--full' : '', className ?? ''].filter(Boolean).join(' ')
}

/** Botón del design system. Con `href` se renderiza como enlace (misma apariencia, semántica correcta). */
export function Button(props: AsButton | AsLink) {
  const { iconLeft, iconRight, children } = props
  const inner = (
    <>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </>
  )
  if (props.href !== undefined) {
    const { href, target, rel } = props
    return (
      <Link href={href} className={classes(props)} target={target} rel={rel}>
        {inner}
      </Link>
    )
  }
  const OWN = new Set(['variant', 'size', 'full', 'iconLeft', 'iconRight', 'className', 'children', 'href'])
  const rest = Object.fromEntries(Object.entries(props).filter(([k]) => !OWN.has(k))) as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type="button" {...rest} className={classes(props)}>
      {inner}
    </button>
  )
}
