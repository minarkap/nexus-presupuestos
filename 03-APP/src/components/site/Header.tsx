import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/content/site'
import { PAGES } from '@/seo/metadata'
import { Button } from '@/components/ui/Button'

const NAV = [PAGES.servicios, PAGES['como-trabajamos'], PAGES.presupuesto] as const

export function Header({ current }: { current?: string }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="lockup" aria-label={`${siteConfig.name}, inicio`}>
          <Image src="/brand/nexus-isotype.png" alt="" width={34} height={34} priority />
          <span>
            <span className="lockup__word">NEXUS</span>
            <span className="lockup__desc">CONSULTING</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Principal">
          {NAV.map((p) => (
            <Link key={p.path} href={p.path} aria-current={current === p.path ? 'page' : undefined}>{p.name}</Link>
          ))}
        </nav>
        <span className="header__cta"><Button href="/presupuesto" size="sm">Calcular mi estimación</Button></span>
        <details className="menu">
          <summary aria-label="Abrir menú">Menú</summary>
          <nav className="menu__panel" aria-label="Principal (móvil)">
            {NAV.map((p) => <Link key={p.path} href={p.path}>{p.name}</Link>)}
            <Link href="/presupuesto">Calcular mi estimación</Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
