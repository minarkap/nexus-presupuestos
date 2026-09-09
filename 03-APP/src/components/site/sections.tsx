import Link from 'next/link'
import { home } from '@/content/home'
import { metodo } from '@/content/como-trabajamos'
import { CHALLENGE_OPTIONS } from '@/core/options'
import type { PublicLine } from '@/content/services.public'
import { siteConfig } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Icon, type IconName } from '@/components/ui/Icon'
import { NodeField } from '@/components/ui/NodeField'

const LINE_ICON: Record<string, IconName> = { ia: 'brain-circuit', ciberseguridad: 'shield-check', esg: 'leaf', estrategia_operaciones: 'compass' }

export function Hero() {
  const h = home.hero
  return (
    <section className="hero" aria-labelledby="hero-title">
      <NodeField />
      <div className="container">
        <div className="hero__content">
          <Badge tone="cyan" dot>{h.eyebrow}</Badge>
          <h1 id="hero-title" style={{ marginTop: 'var(--space-6)' }}>
            {h.h1Lead} <span className="gradient-text">{h.h1Accent}</span>
          </h1>
          <p className="lede">{h.lede}</p>
          <div className="hero__actions">
            <Button href={h.primary.href} size="lg" iconRight={<Icon name="arrow-right" size={18} />}>{h.primary.label}</Button>
            <Button href={h.secondary.href} size="lg" variant="outline">{h.secondary.label}</Button>
          </div>
          <div className="hero__facts">
            {h.facts.map((f) => <span key={f}><span className="node-dot" aria-hidden="true" />{f}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Thesis() {
  const t = home.thesis
  return (
    <div className="reveal">
      <div className="section__head">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h2 id="thesis-title">{t.h2}</h2>
        <p className="lede">{t.p}</p>
      </div>
      <div className="signals">
        {t.signals.map((s) => (
          <div className="signal" key={s.h3}>
            <span className="signal__icon"><Icon name={s.icon} size={22} /></span>
            <h3>{s.h3}</h3>
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ServiceLines({ lines }: { lines: readonly PublicLine[] }) {
  const l = home.lines
  return (
    <div className="reveal">
      <div className="section__head">
        <Eyebrow>{l.eyebrow}</Eyebrow>
        <h2 id="lines-title">{l.h2}</h2>
        <p>{l.p}</p>
      </div>
      <ul className="lines" style={{ listStyle: 'none', padding: 0 }}>
        {lines.map((line) => (
          <Card as="li" variant="gradient" padding="lg" interactive key={line.key}>
            <div className="line">
              <span className="line__icon"><Icon name={LINE_ICON[line.key] ?? 'network'} size={24} /></span>
              <h3>{line.name}</h3>
              <p>{line.short}</p>
              <div className="line__caps">{line.capabilities.slice(0, 3).map((c) => <Badge key={c} tone="neutral">{c}</Badge>)}</div>
              <Link className="line__more" href={`/servicios#${line.key}`}>{line.priced ? l.more : 'Ver por qué no tiene rango'} <Icon name="arrow-right" size={16} /></Link>
            </div>
          </Card>
        ))}
      </ul>
    </div>
  )
}

export function Method({ compact }: { compact?: boolean }) {
  const m = home.method
  return (
    <div className="reveal">
      {!compact && (
        <div className="section__head">
          <Eyebrow>{m.eyebrow}</Eyebrow>
          <h2 id="method-title">{m.h2}</h2>
          <p>{m.p}</p>
        </div>
      )}
      <ol className="method" style={{ listStyle: 'none', padding: 0 }}>
        {metodo.map((s) => (
          <li className="step" key={s.num}>
            <div className="step__num">{s.num}</div>
            <h3>{s.h3}</h3>
            <p>{s.p}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** La primera pregunta del estimador, como enlaces: indexable sin JS y con la respuesta conservada (spec C-03). */
export function BeforeTheCall() {
  const b = home.before
  return (
    <div className="before reveal">
      <div>
        <Eyebrow>{b.eyebrow}</Eyebrow>
        <h2 id="before-title">{b.h2}</h2>
        <p className="lede" style={{ marginTop: 'var(--space-4)' }}>{b.p}</p>
        <p className="muted" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{b.notAsked}</p>
      </div>
      <Card variant="node" padding="lg">
        <p className="before__q">{b.question}</p>
        <div className="choices">
          {CHALLENGE_OPTIONS.map((o) => (
            <Link key={o.value} href={`/presupuesto?reto=${o.value}`} className="choice">
              <span>{o.label}</span>
              <span className="choice__arrow"><Icon name="arrow-right" size={18} /></span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function CtaBand() {
  const c = home.cta
  return (
    <Card variant="gradient" padding="lg" className="cta-band">
      <div className="cta-band__grid">
        <div>
          <h2 id="cta-title">{c.h2}</h2>
          <p style={{ marginTop: 'var(--space-4)' }}>{c.p}</p>
          <div className="contact-list">
            <a href={`mailto:${siteConfig.contact.email}`}><Icon name="mail" size={16} />{siteConfig.contact.email}</a>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}><Icon name="phone" size={16} />{siteConfig.contact.phone}</a>
            <span><Icon name="map-pin" size={16} />{siteConfig.contact.address}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <Button href={c.primary.href} size="lg" full iconRight={<Icon name="arrow-right" size={18} />}>{c.primary.label}</Button>
          <Button href={`mailto:${siteConfig.contact.email}`} size="lg" variant="outline" full>Escríbenos</Button>
        </div>
      </div>
    </Card>
  )
}
