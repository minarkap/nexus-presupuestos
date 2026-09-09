import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/content/site'
import { PAGES } from '@/seo/metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES).map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: new Date(p.lastModified),
    changeFrequency: p.path === '/' ? 'weekly' : 'monthly',
    priority: p.path === '/' ? 1 : p.path === '/presupuesto' ? 0.9 : 0.7,
  }))
}
