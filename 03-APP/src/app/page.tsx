import type { Metadata } from 'next'
import { publicLines } from '@/content/services.public'
import { loadCatalog } from '@/ports/catalog'
import { pageMetadata } from '@/seo/metadata'
import { organization, webSite } from '@/seo/jsonld'
import { JsonLd } from '@/seo/json-ld'
import { Section } from '@/components/ui/Section'
import { BeforeTheCall, CtaBand, Hero, Method, ServiceLines, Thesis } from '@/components/site/sections'

export const metadata: Metadata = pageMetadata('home')


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

export default async function Home() {
  const { catalog } = await loadCatalog()
  const lines = publicLines(catalog)
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
