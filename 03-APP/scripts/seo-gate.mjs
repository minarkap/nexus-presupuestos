#!/usr/bin/env node
// Puerta SEO/GEO (constitution 32-33 · spec CA-06..CA-23). Comprueba lo que un rastreador ve, contra un servidor real.
const BASE = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const PAGES = ['/', '/presupuesto', '/servicios', '/como-trabajamos', '/privacidad']
const AGENTS = ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai']
const INTERNAL = ['QUALIFICATION_THRESHOLD', 'MARGIN_PCT', 'ROUNDING_STEP', 'SIZE_FACTORS', 'MATURITY_FACTORS', 'TIMING_FACTORS', 'POINTS', '/10']
let fails = 0
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++ }
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
const get = async (p) => { const r = await fetch(BASE + p, { redirect: 'manual' }); return { status: r.status, type: r.headers.get('content-type') ?? '', body: await r.text() } }

const titles = new Set(), descs = new Set(), h1s = new Set()
for (const p of PAGES) {
  const r = await get(p)
  ok(r.status === 200, `${p} responde 200`)
  const h1 = [...r.body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]).trim())
  ok(h1.length === 1, `${p} tiene exactamente un H1`)
  ok(!h1s.has(h1[0]), `${p} H1 distinto del resto`); h1s.add(h1[0])
  ok(/<h2/.test(r.body), `${p} tiene al menos un H2`)
  const levels = [...r.body.matchAll(/<h([1-6])/g)].map((m) => Number(m[1]))
  let jump = false; for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) jump = true
  ok(!jump, `${p} sin saltos en la jerarquía de encabezados`)
  const imgs = [...r.body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  ok(imgs.every((i) => /\salt=/.test(i)), `${p} toda <img> lleva alt (${imgs.length})`)
  const title = (r.body.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? ''
  ok(title.length > 0 && title.length <= 60 && !titles.has(title), `${p} <title> ≤ 60 y único («${title}»)`); titles.add(title)
  const desc = (r.body.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? ''
  ok(desc.length > 0 && desc.length <= 160 && !descs.has(desc), `${p} description ≤ 160 y única`); descs.add(desc)
  ok(/<link rel="canonical" href="https:\/\/[^"]+"/.test(r.body), `${p} canónica absoluta`)
  ok(/<meta property="og:image" content="[^"]+"/.test(r.body), `${p} og:image declarado`)
  ok(/<html lang="es"/.test(r.body), `${p} lang=es`)
  const ld = [...r.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]) } catch { return null } })
  ok(ld.length > 0 && ld.every(Boolean), `${p} JSON-LD válido (${ld.length} bloques)`)
  const types = ld.map((d) => d && d['@type'])
  ok(types.includes('Organization') && types.includes('WebSite'), `${p} JSON-LD con Organization y WebSite`)
  if (p !== '/') ok(types.includes('BreadcrumbList'), `${p} BreadcrumbList`)
  if (p === '/servicios') ok(types.filter((t) => t === 'Service').length === 6, `${p} seis Service`)
  if (p === '/como-trabajamos') ok(types.includes('FAQPage'), `${p} FAQPage`)
  const body = text(r.body)
  ok(!/Strategy & Technology/.test(r.body), `${p} sin la marca anterior`)
  ok(!INTERNAL.some((s) => r.body.includes(s)), `${p} sin identificadores/valores internos del motor`)
  if (p === '/') ok(body.split(' ').length >= 600, `/ ≥ 600 palabras (${body.split(' ').length})`)
  if (p === '/como-trabajamos') ok((r.body.match(/<h3/g) ?? []).length >= 6, `/como-trabajamos ≥ 6 preguntas`)
  if (p === '/presupuesto') ok(/¿Cuál es el reto/.test(body), `/presupuesto sirve la primera pregunta en el HTML`)
}
const reto = await get('/presupuesto?reto=ia')
ok(/¿Qué necesitas exactamente\?/.test(text(reto.body)), '/presupuesto?reto=ia sirve la segunda pregunta con la primera conservada')
const rb = await get('/robots.txt')
ok(rb.status === 200 && AGENTS.every((a) => rb.body.includes(a)) && /Sitemap: https:\/\//.test(rb.body), 'robots.txt permite los siete rastreadores y enlaza el sitemap')
const sm = await get('/sitemap.xml')
ok(sm.status === 200 && (sm.body.match(/<loc>/g) ?? []).length === 5 && !/agenda-demo/.test(sm.body), 'sitemap.xml lista exactamente cinco URLs')
const ll = await get('/llms.txt')
ok(ll.status === 200 && /text\/plain/.test(ll.type) && (ll.body.match(/\]\(https:\/\//g) ?? []).length === 5, 'llms.txt text/plain con cinco enlaces')
const og = await fetch(BASE + '/opengraph-image')
ok(og.status === 200 && /image\/png/.test(og.headers.get('content-type') ?? ''), 'opengraph-image responde 200 image/png')
for (const p of ['/agenda-demo', '/recursos', '/no-existe']) { const r = await get(p); ok(r.status === 404 && /presupuesto/.test(r.body), `${p} → 404 de marca con enlace al estimador`) }
console.log(fails === 0 ? '\n═══ SEO-GATE: VERDE ═══' : `\n═══ SEO-GATE: ROJO (${fails}) ═══`)
process.exit(fails === 0 ? 0 : 1)
