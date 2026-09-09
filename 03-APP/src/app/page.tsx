import type { Metadata } from 'next'
import { publicLines } from '@/content/services.public'
import { pageMetadata } from '@/seo/metadata'
import { organization, webSite } from '@/seo/jsonld'
import { JsonLd } from '@/seo/json-ld'
import { Section } from '@/components/ui/Section'
import { BeforeTheCall, CtaBand, Hero, Method, ServiceLines, Thesis } from '@/components/site/sections'

export const metadata: Metadata = pageMetadata('home')

export default function Home() {
  const lines = publicLines()
  return (
    <>
      <JsonLd data={[organization(), webSite()]} />
      <Hero />
      <Section labelledBy="thesis-title"><Thesis /></Section>
      <Section tone="sunken" labelledBy="lines-title"><ServiceLines lines={lines} /></Section>
      <Section labelledBy="method-title"><Method /></Section>
      <Section tone="raised" labelledBy="before-title" id="antes-de-la-llamada"><BeforeTheCall /></Section>
      <Section labelledBy="cta-title"><CtaBand /></Section>
    </>
  )
}
