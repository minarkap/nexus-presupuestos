import type { Metadata } from 'next'
import Link from 'next/link'
import { servicios } from '@/content/servicios'
import { publicLines, publicServices } from '@/content/services.public'
import { loadCatalog } from '@/ports/catalog'
import { PAGES, pageMetadata } from '@/seo/metadata'
import { breadcrumbs, organization, services, webSite } from '@/seo/jsonld'
import { JsonLd } from '@/seo/json-ld'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export const metadata: Metadata = pageMetadata('servicios')


/**
 * Los rangos publicados salen del MISMO catálogo que los estimados.
 *
 * Con `revalidate`, la página se sigue sirviendo como HTML estático —constitution 32 exige que todo
 * el contenido viaje en el HTML inicial— pero se rehace sola cada pocos minutos. Sin esto, cambiar
 * un precio en la base actualizaría la estimación del formulario y dejaría esta página anunciando
 * la cifra vieja: dos precios para el mismo servicio en el mismo sitio (ver `S-0035`).
 *
 * Si la base no responde durante una revalidación, el puerto se repliega a la foto y la página se
 * rehace igual. Nunca se queda sin renderizar.
 */
export const revalidate = 300

export default async function Servicios() {
  const { catalog } = await loadCatalog()
  const lines = publicLines(catalog)
  const all = publicServices(catalog)
  return (
    <>
      <JsonLd data={[organization(), webSite(), breadcrumbs(PAGES.servicios), ...services(all)]} />
      <Breadcrumbs current={PAGES.servicios} />
      <header className="container" style={{ paddingBlock: 'var(--space-6) var(--space-12)' }}>
        <div className="section__head" style={{ marginBottom: 0 }}>
          <Eyebrow>{servicios.eyebrow}</Eyebrow>
          <h1>{servicios.h1}</h1>
          <p className="lede" style={{ marginTop: 'var(--space-5)' }}>{servicios.lede}</p>
          <p className="muted" style={{ marginTop: 'var(--space-4)' }}>{servicios.capabilitiesIntro}</p>
        </div>
      </header>
      {lines.map((line) => (
        <section key={line.key} id={line.key} className="service-line" aria-labelledby={`line-${line.key}`}>
          <div className="container">
            <div className="service-line__head">
              <h2 id={`line-${line.key}`}>{line.name}</h2>
              <p className="lede">{line.short}</p>
              <p className="muted">{line.forWhom}</p>
              <div className="line__caps">{line.capabilities.map((c) => <Badge key={c} tone="neutral">{c}</Badge>)}</div>
            </div>
            {line.priced ? (
              <div className="services">
                {line.services.map((s) => (
                  <Card as="article" key={s.id} id={s.id} variant="gradient" padding="lg">
                    <div className="service">
                      <div className="service__top">
                        <h3>{s.label}</h3>
                        <p className="service__range">{s.rangeText}<small>Rango orientativo 2026, sujeto a alcance</small></p>
                      </div>
                      <p>{s.forWhom}</p>
                      <ul>{s.includes.map((i) => <li key={i}>{i}</li>)}</ul>
                      <p className="service__when">{s.whenApplies}</p>
                      <div><Button href={`/presupuesto?reto=${line.key}`} variant="outline" size="sm" iconRight={<Icon name="arrow-right" size={16} />}>{servicios.estimateCta}</Button></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="node" padding="lg">
                <div className="service">
                  <div className="service__top">
                    <h3>Sin rango publicado, a propósito</h3>
                    <p className="service__range">Llamada de alcance<small>30 minutos, sin coste</small></p>
                  </div>
                  <p>{line.reason}</p>
                  <div><Button href="/presupuesto?reto=estrategia_operaciones" variant="outline" size="sm" iconRight={<Icon name="arrow-right" size={16} />}>Contarnos el reto</Button></div>
                </div>
              </Card>
            )}
          </div>
        </section>
      ))}
      <div className="container" style={{ paddingBlock: 'var(--space-12) var(--space-24)' }}>
        <p className="disclaimer">{servicios.disclaimer} <Link href="/como-trabajamos#rango-no-precio">Por qué un rango y no un precio.</Link></p>
      </div>
    </>
  )
}
