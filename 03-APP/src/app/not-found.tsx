import type { Metadata } from 'next'
import { notFound } from '@/content/not-found'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'

export const metadata: Metadata = { title: 'Página no encontrada', robots: { index: false } }

export default function NotFound() {
  return (
    <section className="notfound container">
      <div className="stack">
        <Eyebrow>{notFound.eyebrow}</Eyebrow>
        <h1>{notFound.h1}</h1>
        <p className="lede">{notFound.p}</p>
        <div className="hero__actions" style={{ justifyContent: 'center' }}>
          <Button href="/presupuesto" size="lg">{notFound.estimate}</Button>
          <Button href="/" size="lg" variant="outline">{notFound.home}</Button>
        </div>
      </div>
    </section>
  )
}
