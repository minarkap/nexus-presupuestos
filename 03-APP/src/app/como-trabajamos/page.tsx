import type { Metadata } from 'next'
import { comoTrabajamos, faq, llamada } from '@/content/como-trabajamos'
import { PAGES, pageMetadata } from '@/seo/metadata'
import { breadcrumbs, faqPage, organization, webSite } from '@/seo/jsonld'
import { JsonLd } from '@/seo/json-ld'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { Method } from '@/components/site/sections'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = pageMetadata('como-trabajamos')

export default function ComoTrabajamos() {
  return (
    <>
      <JsonLd data={[organization(), webSite(), breadcrumbs(PAGES['como-trabajamos']), faqPage(faq)]} />
      <Breadcrumbs current={PAGES['como-trabajamos']} />
      <header className="container" style={{ paddingBlock: 'var(--space-6) var(--space-12)' }}>
        <div className="section__head" style={{ marginBottom: 0 }}>
          <Eyebrow>{comoTrabajamos.eyebrow}</Eyebrow>
          <h1>{comoTrabajamos.h1}</h1>
          <p className="lede" style={{ marginTop: 'var(--space-5)' }}>{comoTrabajamos.lede}</p>
        </div>
      </header>
      <Section tone="sunken" labelledBy="metodo-title">
        <h2 id="metodo-title" className="sr-only">El método en cuatro fases</h2>
        <Method compact />
      </Section>
      <Section labelledBy="llamada-title">
        <Card variant="node" padding="lg">
          <Eyebrow>{llamada.eyebrow}</Eyebrow>
          <h2 id="llamada-title">{llamada.h2}</h2>
          <div className="stack" style={{ marginTop: 'var(--space-5)', maxWidth: '62ch' }}>
            <p>{llamada.p1}</p>
            <p>{llamada.p2}</p>
          </div>
          <div style={{ marginTop: 'var(--space-8)' }}><Button href="/presupuesto" size="lg">Empezar por la estimación</Button></div>
        </Card>
      </Section>
      <Section tone="raised" labelledBy="faq-title">
        <div className="section__head">
          <Eyebrow>Antes de la primera conversación</Eyebrow>
          <h2 id="faq-title">{comoTrabajamos.faqH2}</h2>
          <p>{comoTrabajamos.faqP}</p>
        </div>
        <div className="faq">
          {faq.map((f) => (
            <details className="faq__item" key={f.id} id={f.id}>
              <summary><h3>{f.q}</h3></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  )
}
