import Link from 'next/link'
import { PAGES } from '@/seo/metadata'

export function Breadcrumbs({ current }: { current: { name: string; path: string } }) {
  return (
    <nav className="crumbs container" aria-label="Migas de pan">
      <ol>
        <li><Link href="/">{PAGES.home.name}</Link></li>
        <li aria-current="page">{current.name}</li>
      </ol>
    </nav>
  )
}
