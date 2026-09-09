import type { Metadata } from 'next'
import { privacidad } from '@/content/privacidad'
import { PAGES, pageMetadata } from '@/seo/metadata'
import { breadcrumbs, organization, webSite } from '@/seo/jsonld'
import { JsonLd } from '@/seo/json-ld'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'

export const metadata: Metadata = pageMetadata('privacidad')

export default function Privacidad() {
  return (
    <>
      <JsonLd data={[organization(), webSite(), breadcrumbs(PAGES.privacidad)]} />
      <Breadcrumbs current={PAGES.privacidad} />
      <article className="container container--narrow" style={{ paddingBlock: 'var(--space-6) var(--space-24)' }}>
        <Eyebrow>Legal</Eyebrow>
        <h1>{privacidad.h1}</h1>
        <p className="lede" style={{ marginTop: 'var(--space-5)' }}>{privacidad.lede}</p>
        <p className="prose__meta">Última actualización: <time dateTime={privacidad.updated}>{privacidad.updated}</time></p>
        <div className="prose" style={{ marginTop: 'var(--space-8)' }}>
          {privacidad.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.h2}</h2>
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>
      </article>
    </>
  )
}
