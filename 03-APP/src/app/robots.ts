import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/content/site'

/** Rastreadores de buscadores y de motores generativos, permitidos explícitamente (constitution 33). */
export const AI_CRAWLERS = ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai'] as const

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }, { userAgent: [...AI_CRAWLERS], allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
