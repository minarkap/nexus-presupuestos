import type { Metadata } from 'next'
import Link from 'next/link'
import './_legacy/legacy.css'
import { LegacyApp } from './_legacy/LegacyApp'

/**
 * Página-museo: el estimador tal como se entregó el 2026-08-26, antes del rediseño.
 * Existe para poder enseñar el antes y el después en la misma sesión. Fuera del sitemap y sin
 * indexar: no es una página del producto.
 */
export const metadata: Metadata = {
  title: 'Antes del rediseño · snapshot',
  description: 'El estimador de presupuesto tal como se entregó el 26 de agosto de 2026, antes de aplicar la marca Nexus Consulting.',
  robots: { index: false, follow: false },
}

export default function Antes() {
  return (
    <>
      <aside
        style={{
          position: 'sticky', top: 0, zIndex: 200, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)',
          alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-6)', background: 'var(--surface-sunken)',
          borderBottom: '1px solid var(--border-default)', color: 'var(--text-body)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
        }}
      >
        <span>
          <strong style={{ color: 'var(--text-strong)' }}>Antes del rediseño.</strong>{' '}
          Snapshot del 26 de agosto de 2026, sin la marca. El envío está simulado: no manda correos.
        </span>
        <Link href="/presupuesto" style={{ color: 'var(--text-link)', whiteSpace: 'nowrap' }}>
          Ver el estimador actual →
        </Link>
      </aside>
      <div className="legacy">
        <LegacyApp />
      </div>
    </>
  )
}
