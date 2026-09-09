import { absoluteUrl, siteConfig } from '@/content/site'
import type { PublicService } from '@/content/services.public'
import type { FaqItem } from '@/content/como-trabajamos'
import { PAGES } from './metadata'

type JsonLd = Record<string, unknown>
const CTX = 'https://schema.org'
const ORG_ID = `${absoluteUrl('/')}#organization`

export function organization(): JsonLd {
  return {
    '@context': CTX, '@type': 'Organization', '@id': ORG_ID,
    name: siteConfig.name, url: absoluteUrl('/'), logo: absoluteUrl('/brand/nexus-isotype.png'), slogan: siteConfig.claim,
    address: { '@type': 'PostalAddress', addressLocality: 'Andorra la Vella', addressCountry: siteConfig.contact.country },
    contactPoint: { '@type': 'ContactPoint', email: siteConfig.contact.email, telephone: siteConfig.contact.phone, contactType: 'sales', availableLanguage: ['es'] },
  }
}

export function webSite(): JsonLd {
  return { '@context': CTX, '@type': 'WebSite', name: siteConfig.name, url: absoluteUrl('/'), inLanguage: 'es', publisher: { '@id': ORG_ID } }
}

/** Un Service por servicio publicado. `offers` solo cuando el rango está cerrado por arriba (openEnded=false). */
export function services(list: readonly PublicService[]): JsonLd[] {
  return list.map((s) => ({
    '@context': CTX, '@type': 'Service', name: s.label, description: s.forWhom, provider: { '@id': ORG_ID }, inLanguage: 'es',
    url: `${absoluteUrl('/servicios')}#${s.id}`,
    ...(s.openEnded || s.officialMax === null ? {} : {
      offers: {
        '@type': 'Offer', priceCurrency: 'EUR',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'EUR', minPrice: s.officialMin, maxPrice: s.officialMax, ...(s.unit === 'month' ? { unitText: 'mes' } : {}) },
        description: `Rango orientativo 2026, sujeto a alcance: ${s.rangeText}.`,
      },
    }),
  }))
}

export function faqPage(items: readonly FaqItem[]): JsonLd {
  return { '@context': CTX, '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
}


/** Siempre dos niveles: Inicio › página (spec C-04). */
export function breadcrumbs(current: { name: string; path: string }): JsonLd {
  return {
    '@context': CTX, '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: PAGES.home.name, item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: current.name, item: absoluteUrl(current.path) },
    ],
  }
}
