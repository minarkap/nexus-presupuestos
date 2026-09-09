import type { Metadata } from 'next'
import { absoluteUrl, siteConfig } from '@/content/site'

export type PageKey = 'home' | 'presupuesto' | 'servicios' | 'como-trabajamos' | 'privacidad'

export interface PageDef { readonly path: string; readonly title: string; readonly description: string; readonly lastModified: string; readonly name: string }

/** Fuente única para metadatos, sitemap, llms.txt y migas (constitution 33). */
export const PAGES: Record<PageKey, PageDef> = {
  home: { path: '/', name: 'Inicio', title: 'Nexus Consulting · Software, IA y automatización', description: 'Consultoría tecnológica en Andorra la Vella: software a medida, IA aplicada, automatización e integración. Estimación orientativa en dos minutos.', lastModified: '2026-09-02' },
  presupuesto: { path: '/presupuesto', name: 'Estimador', title: 'Estimador de presupuesto orientativo', description: 'Siete preguntas y un rango orientativo del catálogo 2026 de Nexus Consulting. Sin precio cerrado ni plazos prometidos: los presupuestos se cierran hablando.', lastModified: '2026-09-02' },
  servicios: { path: '/servicios', name: 'Servicios', title: 'Servicios y rangos orientativos 2026', description: 'Seis servicios con rango oficial 2026 publicado en IA, ciberseguridad y ESG, y una línea de estrategia sin cifra a propósito. Qué incluye cada uno.', lastModified: '2026-09-02' },
  'como-trabajamos': { path: '/como-trabajamos', name: 'Cómo trabajamos', title: 'Cómo trabajamos y preguntas frecuentes', description: 'Las cuatro fases del método de Nexus Consulting, qué es la llamada de alcance de 30 minutos y respuestas a las preguntas que recibimos antes de hablar.', lastModified: '2026-09-02' },
  privacidad: { path: '/privacidad', name: 'Privacidad', title: 'Aviso de privacidad', description: 'Qué datos recoge el estimador de Nexus Consulting, con qué base legal, quién los recibe, cuánto se conservan y cómo ejercer tus derechos.', lastModified: '2026-09-02' },
}

const SUFFIX = ` · ${siteConfig.name}`

export function fullTitle(key: PageKey): string {
  return key === 'home' ? PAGES[key].title : `${PAGES[key].title}${SUFFIX}`
}

export function pageMetadata(key: PageKey): Metadata {
  const p = PAGES[key]
  const title = fullTitle(key)
  if (title.length > 60) throw new Error(`Título demasiado largo (${title.length}): ${title}`)
  if (p.description.length > 160) throw new Error(`Descripción demasiado larga (${p.description.length}): ${key}`)
  const url = absoluteUrl(p.path)
  const image = { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: `${siteConfig.name}. ${siteConfig.claim}` }
  return {
    title: key === 'home' ? { absolute: title } : p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description: p.description, siteName: siteConfig.name, locale: siteConfig.locale, images: [image] },
    twitter: { card: 'summary_large_image', title, description: p.description, images: [image.url] },
  }
}
