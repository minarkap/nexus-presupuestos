import { absoluteUrl, siteConfig } from '@/content/site'
import { PAGES } from '@/seo/metadata'

export const dynamic = 'force-static'

export function GET(): Response {
  const lines = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.tagline} Consultoría tecnológica con sede en Andorra la Vella. ${siteConfig.claim}`,
    '',
    'Publicamos los rangos orientativos de nuestro catálogo 2026 y un estimador de siete preguntas. Ninguna cifra es un precio cerrado.',
    '',
    '## Páginas',
    ...Object.values(PAGES).map((p) => `- [${p.title}](${absoluteUrl(p.path)}): ${p.description}`),
    '',
    `## Contacto`,
    `- ${siteConfig.contact.email} · ${siteConfig.contact.phone} · ${siteConfig.contact.address}`,
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
