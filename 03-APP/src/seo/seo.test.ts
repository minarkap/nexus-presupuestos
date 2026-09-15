import { describe, it, expect } from 'vitest'
import { SEED_CATALOG } from '@/core/catalog-seed'
import { PAGES, fullTitle, pageMetadata, type PageKey } from './metadata'
import { breadcrumbs, faqPage, organization, services, webSite } from './jsonld'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { GET as llms } from '@/app/llms.txt/route'
import { faq } from '@/content/como-trabajamos'
import { publicServices } from '@/content/services.public'

const keys = Object.keys(PAGES) as PageKey[]

describe('Metadatos por página (CA-15, constitution 33)', () => {
  it('títulos ≤ 60 y únicos, descripciones ≤ 160 y únicas, canónica absoluta', () => {
    const titles = new Set<string>(), descs = new Set<string>()
    for (const k of keys) {
      const m = pageMetadata(k)
      const t = fullTitle(k)
      expect(t.length, t).toBeLessThanOrEqual(60)
      expect(PAGES[k].description.length, k).toBeLessThanOrEqual(160)
      titles.add(t); descs.add(PAGES[k].description)
      expect(String(m.alternates?.canonical)).toMatch(/^https:\/\//)
    }
    expect(titles.size).toBe(keys.length)
    expect(descs.size).toBe(keys.length)
  })
})

describe('robots, sitemap, llms.txt (CA-16, CA-17, CA-20)', () => {
  it('robots permite a los siete rastreadores y enlaza el sitemap', () => {
    const r = robots()
    const agents = (Array.isArray(r.rules) ? r.rules : [r.rules]).flatMap((x) => (Array.isArray(x.userAgent) ? x.userAgent : [x.userAgent]))
    for (const a of ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai']) expect(agents).toContain(a)
    expect(String(r.sitemap)).toMatch(/\/sitemap\.xml$/)
  })
  it('el sitemap lista exactamente las cinco páginas', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls).toHaveLength(5)
    for (const k of keys) expect(urls.some((u) => u.endsWith(PAGES[k].path) || (PAGES[k].path === '/' && /\/$/.test(u)))).toBe(true)
    expect(urls.join(' ')).not.toMatch(/agenda-demo/)
  })
  it('llms.txt es texto plano con cinco enlaces absolutos', async () => {
    const res = llms()
    expect(res.headers.get('Content-Type')).toMatch(/text\/plain/)
    const body = await res.text()
    expect(body.match(/\]\(https:\/\/[^)]+\)/g)).toHaveLength(5)
  })
})

describe('JSON-LD coherente con lo visible (CA-18)', () => {
  it('FAQPage replica las preguntas visibles', () => {
    const f = faqPage(faq) as { mainEntity: { name: string }[] }
    expect(f.mainEntity.map((q) => q.name)).toEqual(faq.map((q) => q.q))
  })
  it('Service solo lleva oferta si el rango está cerrado por arriba', () => {
    for (const s of services(publicServices(SEED_CATALOG))) {
      const has = 'offers' in s
      const src = publicServices(SEED_CATALOG).find((p) => p.label === s.name)!
      expect(has).toBe(!src.openEnded)
    }
  })
  it('migas de dos niveles y organización con dirección en Andorra', () => {
    const b = breadcrumbs(PAGES.servicios) as { itemListElement: unknown[] }
    expect(b.itemListElement).toHaveLength(2)
    expect(JSON.stringify(organization())).toMatch(/Andorra la Vella/)
    expect(webSite()).toHaveProperty('@type', 'WebSite')
  })
})
