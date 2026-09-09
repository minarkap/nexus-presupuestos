import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/content/site'
import { PAGES } from '@/seo/metadata'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <span className="lockup">
              <Image src="/brand/nexus-isotype.png" alt="" width={30} height={30} />
              <span><span className="lockup__word">NEXUS</span><span className="lockup__desc">CONSULTING</span></span>
            </span>
            <p className="footer__claim">{siteConfig.essence} {siteConfig.claim}</p>
          </div>
          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav">Navegación</h2>
            <ul>
              {[PAGES.servicios, PAGES['como-trabajamos'], PAGES.presupuesto, PAGES.privacidad].map((p) => (
                <li key={p.path}><Link href={p.path}>{p.name === 'Estimador' ? 'Estimador de presupuesto' : p.name}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>Contacto</h2>
            <ul>
              <li><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
              <li><a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}>{siteConfig.contact.phone}</a></li>
              <li><span className="muted" style={{ fontSize: 'var(--text-sm)' }}>{siteConfig.contact.address}</span></li>
            </ul>
          </div>
        </div>
        <div className="footer__legal">
          <span>© 2026 {siteConfig.name} · Andorra la Vella</span>
          <Link href={PAGES.privacidad.path}>Aviso de privacidad</Link>
        </div>
      </div>
    </footer>
  )
}
