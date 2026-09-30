import type { Metadata } from 'next'
import { CHALLENGE_OPTIONS } from '@/core/options'
import type { Challenge } from '@/core/types'
import { PAGES, pageMetadata } from '@/seo/metadata'
import { breadcrumbs, organization, webSite } from '@/seo/jsonld'
import { JsonLd } from '@/seo/json-ld'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { Estimator } from '@/components/Estimator'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { normalizeBookingUrl } from '@/app/booking-url'

export const metadata: Metadata = pageMetadata('presupuesto')

const VALID = new Set<string>(CHALLENGE_OPTIONS.map((o) => o.value))

export default async function Presupuesto({ searchParams }: { searchParams: Promise<{ reto?: string | string[] | undefined }> }) {
  const { reto } = await searchParams
  const candidate = Array.isArray(reto) ? reto[0] : reto
  const initialChallenge = candidate && VALID.has(candidate) ? (candidate as Challenge) : undefined
  return (
    <>
      <JsonLd data={[organization(), webSite(), breadcrumbs(PAGES.presupuesto)]} />
      <Breadcrumbs current={PAGES.presupuesto} />
      <header className="container" style={{ paddingBlock: 'var(--space-4) 0' }}>
        <div className="wizard__frame">
          <Eyebrow>Estimador de presupuesto</Eyebrow>
          <h1>Un orden de magnitud, no un precio.</h1>
          <p className="lede" style={{ marginTop: 'var(--space-4)' }}>
            Siete preguntas sobre tu reto y tu organización. Al final, el rango orientativo del servicio de nuestro catálogo 2026 que encaja con tu caso, y la propuesta por correo. La cifra concreta se cierra hablando.
          </p>
        </div>
      </header>
      <Estimator initialChallenge={initialChallenge} calendarUrl={normalizeBookingUrl(process.env.NEXT_PUBLIC_CALENDAR_URL) ?? undefined} />
    </>
  )
}
