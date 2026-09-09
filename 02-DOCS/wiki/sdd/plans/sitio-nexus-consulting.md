---
type: plan
title: Plan — Sitio web de Nexus Consulting (marca, páginas, copy y SEO/GEO)
description: Plan a nivel de estructura para convertir el estimador en el sitio de Nexus Consulting — arquitectura por capas (tokens, UI, contenido, SEO, estimador), contratos, flujo del lead y del rastreador, estrategia de pruebas y riesgos.
tags: [sdd, plan, marca, seo, geo, diseño]
timestamp: 2026-09-02T15:40:00Z
topic: sdd
slug: sitio-nexus-consulting
status: approved
---

# Plan — Sitio web de Nexus Consulting

> Spec: [../specs/sitio-nexus-consulting.md](../specs/sitio-nexus-consulting.md) · Constitution: [../constitution.md](../constitution.md) v1.1.0 · Status: **approved** (autopilot, 2026-09-02)
> Last updated: 2026-09-02

## 0. Global Constraints

Valores exactos que **toda tarea** hereda. El implementador aislado y su revisor leen esto antes que nada.

- **Stack canon:** Next.js **16.3.3** App Router · React **19.2** · TypeScript `strict` + `noUncheckedIndexedAccess` · npm, un solo `package-lock.json` · Node ≥ 24 · Vitest 4 + Testing Library · ESLint `next/core-web-vitals` + `typescript`, **cero avisos**. Antes de escribir código de Next: leer `03-APP/node_modules/next/dist/docs/` para la API tocada (regla de `03-APP/AGENTS.md`); `params`/`searchParams` son **Promise** y se `await`; sin `use cache` ni `cacheComponents` (modelo v16 sin activar; nada que cachear).
- **Rama:** todo el trabajo en `feat/sitio-nexus-consulting`, nunca en `main` (constitución 18). **Commits: autoría humana** (Carlos del Corral), sin `Co-Authored-By` ni pie de IA (20). Mensajes con gitmoji (guard del arnés): `✨ feat(...)`, `♻️ refactor(...)`, `📝 docs(...)`, `✅ test(...)`.
- **Marca:** nombre visible **«Nexus Consulting»**; esencia *«El punto donde todo conecta.»*; claim *«Tecnología que conecta. Soluciones que avanzan.»*; frase *«Software, IA y automatización para empresas que quieren operar mejor.»*. Contacto: `hola@nexus.ad` · `+376 123 456` · *Andorra la Vella, Andorra*. **Prohibido** en `03-APP/src`: la cadena `Strategy & Technology` (30). Buzón interno: `NEXUS_INTERNAL_MAILBOX`, valor por defecto **`oportunidades@nexus.ad`**. URL canónica: `NEXT_PUBLIC_SITE_URL`, valor por defecto **`https://nexus.ad`**.
- **Estilo (31):** un único fichero de tokens `03-APP/src/app/tokens.css` con las custom properties del DS **copiadas verbatim** de `.claude/skills/nexus-consulting-design/tokens/*.css` (colors, typography, spacing, effects). **Ningún hex, radio, sombra ni curva escrito a mano** fuera de `tokens.css`. Fuentes por `next/font/google`: **Sora** (300–800) → `--font-display`, **Inter** (400–700) → `--font-body`, **IBM Plex Mono** (400–600) → `--font-mono`, `display: swap`, subset `latin`. Tema **oscuro** único (`color-scheme: dark`). Iconos: **`lucide-react`**, trazo 1.6. Nunca emoji. El isotipo se usa desde `public/brand/nexus-isotype.png` (copiado del DS), **nunca redibujado**.
- **Contraste (34)** — pares medidos sobre los tokens reales (WCAG 2.1 fórmula):

| Par | Ratio | Uso permitido |
|---|---|---|
| `white` #F5F8FF sobre `night` #07111F | **17.81:1** | AA texto normal |
| `body` #C8D4E6 sobre `night` #07111F | **12.64:1** | AA texto normal |
| `muted` #94A3B8 sobre `night` #07111F | **7.39:1** | AA texto normal |
| `faint` #64748B sobre `night` #07111F | **3.98:1** | AA solo grande/UI (≥3:1) |
| `cyan` #21D4FD sobre `night` #07111F | **10.73:1** | AA texto normal |
| `cyan400` #5FE2FE sobre `night` #07111F | **12.44:1** | AA texto normal |
| `blue` #145CFF sobre `night` #07111F | **3.61:1** | AA solo grande/UI (≥3:1) |
| `blue400` #4A82FF sobre `night` #07111F | **5.35:1** | AA texto normal |
| `danger` #FB6A6A sobre `night` #07111F | **6.65:1** | AA texto normal |
| `white` #F5F8FF sobre `card` #0A192C | **16.62:1** | AA texto normal |
| `body` #C8D4E6 sobre `card` #0A192C | **11.79:1** | AA texto normal |
| `muted` #94A3B8 sobre `card` #0A192C | **6.89:1** | AA texto normal |
| `white` #F5F8FF sobre `raised` #0E2238 | **15.14:1** | AA texto normal |
| `body` #C8D4E6 sobre `raised` #0E2238 | **10.74:1** | AA texto normal |
| `muted` #94A3B8 sobre `raised` #0E2238 | **6.28:1** | AA texto normal |
| `white` #F5F8FF sobre `blue` #145CFF | **4.93:1** | AA texto normal |
| `night` #07111F sobre `cyan` #21D4FD | **10.73:1** | AA texto normal |
| `night` #07111F sobre `blue` #145CFF | **3.61:1** | AA solo grande/UI (≥3:1) |
| `white` #F5F8FF sobre `cyan` #21D4FD | **1.66:1** | FALLA |
| `cyan` #21D4FD sobre `card` #0A192C | **10.01:1** | AA texto normal |
| `success` #2DD4A7 sobre `night` #07111F | **10.00:1** | AA texto normal |
| `warning` #FBBF54 sobre `night` #07111F | **11.44:1** | AA texto normal |

  Consecuencias **obligatorias**: (a) el **botón primario es sólido `--accent-primary` (#145CFF) con texto blanco** (4.93:1), con `--glow-blue-*` en reposo/hover — **no** degradado azul→cian bajo texto blanco (1.66:1 en el extremo cian); (b) el **degradado de marca solo se recorta sobre texto display ≥ 30 px** (azul sobre navy 3.6:1 ≥ 3:1 para texto grande) y en líneas, barra de progreso y anillo de foco; (c) `--text-faint` (#64748B) solo para texto ≥ 24 px o elementos no textuales; (d) `--text-muted` (#94A3B8) es el mínimo para texto normal; (e) foco: `outline: 2px solid var(--nx-cyan-500); outline-offset: 2px` (10.73:1 sobre navy, 10.01:1 sobre card).
- **Movimiento (35):** solo `transform`, `opacity`, `filter`; **nunca** `transition: all` / `transition-all`; toda animación CSS dentro de `@media (prefers-reduced-motion: no-preference)`; el canvas de nodos comprueba `matchMedia('(prefers-reduced-motion: reduce)')` y **no arranca** si está activo; reveals por `animation-timeline: view()` bajo `@supports`, con el estado final visible por defecto. Duraciones: 120/200/360/600 ms; curvas: las del DS.
- **Copy (27, 36):** tú/nosotros, verbos delante, *sentence case*, sin emoji, sin puntos suspensivos decorativos, sin guiones largos como muletilla. **Palabras prohibidas** (test automático, insensible a mayúsculas/acentos): `disruptiv`, `revolucion`, `360`, `siguiente nivel`, `sin límites`, `mágic`, `transformación digital 360`, `todopoderos`, `solución definitiva`, `futuro de los negocios`, `game-changer`, `cutting-edge`, `seamless`, `unlock`, `supercharge`, `elevate`, `multiplica`, `garantizamos`, `plazas limitadas`, `sólo por hoy`, `descuento`, `oferta especial`, `en \d+ semanas`, `en \d+ días`. Toda cifra en € va acompañada en el mismo bloque de la palabra **«orientativo»**. Ninguna métrica de negocio inventada. Fórmula: problema real + beneficio concreto + tecnología como medio.
- **Núcleo intocable (4–16):** `src/core/catalog.ts`, `pricing.ts`, `scoring.ts`, `service-resolver.ts`, `options.ts` y sus pruebas **no cambian**. Cambios permitidos en core: **solo copy** en `outcome.ts` (cuerpos), `proposal.ts` (firma) y `submit.ts` (asuntos, firma, línea de consentimiento); **una** extracción pura `formatRange` → `core/format.ts` (sin cambio de comportamiento); **un** campo nuevo `consent` en `Contact` + su validación. Ningún multiplicador, punto ni umbral cruza al navegador (8): todo lo que lee `catalog.ts` lleva `import 'server-only'`.
- **Pruebas (CA-21):** total **≥ 156**; cobertura `src/core/**` ≥ 95 % líneas (umbrales de `vitest.config.ts`); las pruebas de motores no se editan; las de recorrido/salida/correo solo cambian aserciones de marca/copy.
- **Rutas públicas — exactamente seis:** `/`, `/presupuesto`, `/servicios`, `/como-trabajamos`, `/recursos/seo-frente-a-geo`, `/privacidad`. Más: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/opengraph-image` (imagen). **Se elimina `/agenda-demo`.** `/recursos` y cualquier otra → 404 de marca.
- **SEO técnico (33):** `<title>` ≤ 60 caracteres con plantilla `%s · Nexus Consulting` (la home sin plantilla); `description` ≤ 160; `alternates.canonical` absoluta; `openGraph` + `twitter` (`summary_large_image`) con imagen 1200×630; `lang="es"`; un H1 por página; JSON-LD por página según §3; `robots` permite `Googlebot, Bingbot, GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai` y `*`; `sitemap` lista las seis rutas con `lastModified`.
- **Contenido en HTML (32):** todas las páginas son Server Components; el único island de cliente con estado es el estimador (`FormWizard`) más `NodeField` (canvas) y `JsonLd` no cuenta (es un `<script>` inerte). La navegación móvil usa `<details>/<summary>`: cero JS.

## 1. Context & constraints

- **Criterios que dan forma al diseño:** CA-07/CA-32 (600+ palabras y todo en HTML → Server Components y contenido tipado), CA-08 (una sola dirección para el estimador; primera pregunta en `/` como enlaces), CA-09 + C-08 (rangos leídos del catálogo, no copiados), CA-12 + C-02 (consentimiento cliente **y** servidor), CA-15–CA-20 (capa de metadatos y datos estructurados derivada del mismo contenido), CA-21 (motores intactos), CA-22 (server-only), CA-02/CA-03 (contraste medido y movimiento reducible).
- **Barras no funcionales:** sin presupuesto de rendimiento (constitución 26) — pero 32 exige HTML completo, lo que de facto da LCP textual. AA en todo el sitio (34). Sin residencia de datos (22). Publicación bloqueada sin privacidad (23) — `/privacidad` entra en este ciclo.
- **Constitución en juego:** 1–3 (stack), 4–11 (producto), 12–17 (calidad), 18–20 (git/autoría), 21–23 (secretos/privacidad), 24/34 (AA), 26 (sin CWV), 27–29 (voz, decisiones), 30–36 (marca y visibilidad).
- **Fuera de alcance que el diseño no debe invadir:** páginas por servicio, analítica/cookies, otro idioma, despliegue/dominio real, anti-spam, cambios en catálogo/rangos/umbral, fotografía, banner de cookies.

## 2. Architecture

```text
                       ┌──────────────────────── 03-APP (Next 16 App Router) ────────────────────────┐
  Googlebot / GPTBot…  │  app/                                                                        │
  ───GET /*──────────▶ │   layout.tsx  (fonts · tokens.css · globals.css · metadataBase · <Header/> <Footer/>) │
                       │   page.tsx (/)  servicios/  como-trabajamos/  recursos/seo-frente-a-geo/  privacidad/  │
                       │   presupuesto/page.tsx ──▶ <Estimator initialChallenge/> (CLIENT island)           │
                       │   not-found.tsx · robots.ts · sitemap.ts · opengraph-image.tsx · llms.txt/route.ts │
                       │        │ lee                │ lee                      │ lee                     │
                       │        ▼                    ▼                          ▼                         │
                       │  src/content/*  ◀─────  src/seo/*  (metadata + JSON-LD builders, mismos objetos)  │
                       │  (copy tipado ES, FAQ,  services.public.ts ─▶ core/catalog.ts  [server-only])      │
                       │   site.ts config/env)                                                             │
                       │        │ usa                                                                      │
                       │        ▼                                                                          │
                       │  src/components/ui/*  (Button Card Badge Eyebrow Section ProgressBar Icon NodeField*)  │
                       │  src/app/tokens.css (DS verbatim) + globals.css (base · utilidades · motion)          │
                       │                                                                                    │
  Lead ──/presupuesto─▶│  FormWizard (client) ──submitAction (server action)──▶ core/submit ──▶ ports/email,registry │
                       └────────────────────────────────────────────────────────────────────────────────────┘
  * NodeField = client, canvas, pausado con reduced-motion y fuera de pantalla.
```

- **`app/layout.tsx`** (interno) — carga fuentes y tokens, fija `metadataBase`, `title.template`, OG por defecto, `lang="es"`; envuelve con `Header`/`Footer`. Server.
- **Páginas `app/**/page.tsx`** (interno) — Server Components que componen secciones a partir de `src/content/*` y emiten `metadata` + `<JsonLd/>`. Cero estado.
- **`src/content/`** (interno) — **el copy es datos tipados**: un módulo por página con títulos, párrafos, FAQ, migas; `site.ts` (nombre, claim, contacto, URL desde env con default); `services.public.ts` (vista pública de los servicios derivada de `catalog.ts`, **server-only**, expone solo `{ id, label, officialMin, officialMax, unit, openEnded, rangeText }` + copy por servicio).
- **`src/seo/`** (interno) — `metadata.ts` (`pageMetadata(key)` → `Metadata` con longitudes validadas), `jsonld.ts` (builders `organization()`, `webSite()`, `service(s)`, `faqPage(items)`, `article(a)`, `breadcrumbs(items)`), `JsonLd.tsx` (renderiza `<script type="application/ld+json">`). Los builders reciben **los mismos objetos de `content/`** que la página pinta → coherencia por construcción (CA-18).
- **`src/components/ui/`** (interno) — port a TSX + CSS de los componentes del DS: `Button` (variantes primary sólido / secondary / outline / ghost; tamaños sm/md/lg; `asChild` para enlaces), `Card` (solid/gradient/node, `interactive`), `Badge`, `Eyebrow`, `Section` (ritmo: `tone` base/sunken/raised, `bleed`), `ProgressBar`, `Icon` (envoltorio de `lucide-react` con `strokeWidth 1.6` y `aria-hidden`), `NodeField` (client). Estilos en CSS Modules o clases globales — **siempre tokens**.
- **`src/components/site/`** (interno) — `Header` (server; nav `<details>` en móvil), `Footer`, `Breadcrumbs`, `Hero`, `ServiceLines`, `Method`, `FaqList`, `BeforeTheCall` (primera pregunta como enlaces a `/presupuesto?reto=`), `CtaBand`.
- **`src/components/FormWizard.tsx`, `ResultScreen.tsx`** (interno, existentes) — re-vestidos con UI kit; `FormWizard` gana `initialChallenge` y la casilla de consentimiento; `ResultScreen` gana tipografía mono para el rango. `Landing.tsx` **desaparece** (su contenido pasa a `app/page.tsx` + `site/*`).
- **`src/core/*`** (interno, motores) — intocable salvo lo listado en §0. **`core/format.ts`** nuevo: `formatRange` extraído para compartirlo entre `outcome.ts` y `services.public.ts`.
- **`src/ports/*`** (interno) — sin cambios.
- **Resend / Google Sheets / calendario de citas** (externos) — sin cambios de contrato; solo cambia el remitente/firma en el texto.
- **`scripts/seo-gate.mjs`** (interno, herramienta) — la puerta de indexabilidad: sirve el build y comprueba CA-06/07/09/10/13–20/22/23 contra HTML real.

**Decisión arquitectónica principal:** **Server Components por defecto y contenido como módulos TypeScript tipados, con la capa SEO derivada de esos mismos objetos.** Elegida porque (a) el 32 exige que todo viaje en el HTML inicial — un Server Component lo garantiza sin esfuerzo y un island lo rompe; (b) CA-18 exige JSON-LD coherente con lo visible — si página y builder consumen el mismo objeto, la incoherencia es imposible por construcción; (c) el copy tiene que ser **testeable** (36: palabras prohibidas, «orientativo» junto a cada cifra) — un módulo TS se importa en una prueba, un MDX no sin tooling extra. Alternativa considerada: MDX/CMS para el artículo y las FAQ — descartada: añade dependencias para una sola página y pierde el tipado que hace las FAQ reutilizables en `FAQPage`. Segunda decisión: **el estimador vive en una sola URL** (`/presupuesto`), la home solo enlaza la primera pregunta (C-03) — evita duplicar la máquina de estados y da al estimador una dirección canónica.

## 3. Interfaces & contracts

```text
content/site.ts
  siteConfig: { name: "Nexus Consulting", essence, claim, tagline, url: URL, contact: { email, phone, address } }
  - url = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexus.ad"); nunca relativa
  - invariant (capa web): toda página, metadato, JSON-LD y pie importan nombre y contacto de aquí. Fuera de la capa web, `core/proposal.ts` y `core/submit.ts` firman con el literal «Nexus Consulting» porque `core/` no importa de `content/` (dirección de dependencias); la prueba de marca (T008) vigila que ambos digan lo mismo.

content/services.public.ts   [import 'server-only']
  publicServices(): PublicService[]   // 6 con rango + 1 sin rango, orden del catálogo
  PublicService = { id, line: LineKey, label, officialMin, officialMax|null, unit: 'total'|'month', openEnded, rangeText, forWhom, includes[], whenApplies }
  - rangeText = formatRange({ low: officialMin, high: officialMax, unit })   ← core/format.ts, la misma función que usa outcome.ts
  - postcondición: ningún campo de factores, puntos ni umbral en el tipo (comprobable por tipo y por grep del HTML)
  publicLines(): PublicLine[]   // 4 líneas: ia, ciberseguridad, esg, estrategia_operaciones; la 4ª con priced=false y reason

core/format.ts   (extracción pura)
  formatRange(price: PriceRange) -> string
  - idéntico byte a byte al comportamiento actual de outcome.ts (las pruebas de outcome lo demuestran sin cambiar)

core/types.ts · core/submit.ts
  Contact = { name, email, company, consent: boolean }
  ValidationField += 'consent'
  validateContact(answers) -> ValidationError | null
  - nueva regla: consent !== true → { field: 'consent', message: 'Necesitamos tu consentimiento para enviarte la estimación.' }
  - orden de comprobación: name → email → company → consent
  buildInternalNotice(lead) añade la línea `Consentimiento: sí (<submittedAt>)`
  subjects: cliente 'Tu estimación orientativa — Nexus Consulting'; interno sin cambios de forma
  composeProposal: firma 'Nexus Consulting' (dos ramas); cuerpo sin cambios de estructura

components/FormWizard.tsx
  props: { submissionId, onSubmit, onDone, initialChallenge?: Challenge }
  - si initialChallenge ∈ CHALLENGE_OPTIONS → draft.challenge preseleccionado e index = 1 (segunda pregunta); si no → ignorado
  - pantalla de contacto: checkbox `consent` con label que enlaza a /privacidad; botón enviar deshabilitado hasta marcarla; error 'consent' anunciado como los demás (role=alert, aria-describedby)
  - accesibilidad: sin cambios de contrato (nombres accesibles, aria-pressed, teclado)

app/presupuesto/page.tsx   (server)
  searchParams: Promise<{ reto?: string }>  → await → initialChallenge validado
  - HTML inicial contiene: H1, explicación (dos frases) y la primera pregunta con sus opciones (renderizadas por el island en SSR)

seo/metadata.ts
  pageMetadata(key: PageKey) -> Metadata
  - title ≤ 60 (con sufijo aplicado), description ≤ 160, alternates.canonical = siteConfig.url + path, openGraph { type, url, title, description, locale 'es_ES', siteName }, twitter { card: 'summary_large_image' }
  - lanza en build si se viola una longitud (prueba unitaria + comprobación en el builder)

seo/jsonld.ts
  organization() -> Organization { name, url, logo, address(Andorra la Vella, AD), contactPoint(email) }
  webSite() -> WebSite { name, url, inLanguage: 'es' }
  services(list: PublicService[]) -> Service[]  { name, provider: Organization ref, areaServed, description, offers?: solo si openEnded=false → PriceSpecification con minPrice/maxPrice/priceCurrency EUR y la advertencia en description }
  faqPage(items: FaqItem[]) -> FAQPage   // exactamente los items visibles
  article(a: ArticleMeta) -> Article { headline, datePublished, dateModified, author: Organization, inLanguage }
  breadcrumbs(items: [{ name, path }]) -> BreadcrumbList   // siempre 2 niveles: Inicio › página
  - invariante: cada builder recibe el objeto que la página pinta; ningún literal duplicado

app/robots.ts -> MetadataRoute.Robots
  rules: [{ userAgent: '*', allow: '/' }, { userAgent: [Googlebot, Bingbot, GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai], allow: '/' }]; sitemap: siteConfig.url + '/sitemap.xml'
app/sitemap.ts -> MetadataRoute.Sitemap   // exactamente las 6 rutas, lastModified = fecha de contenido de cada página
app/llms.txt/route.ts -> text/plain   // nombre, qué hace, 6 enlaces absolutos con una línea cada uno, contacto
app/opengraph-image.tsx -> ImageResponse 1200×630   // isotipo (public/brand/nexus-isotype.png) + «Nexus Consulting» + claim; fondo #07111F desde token (única excepción a §0: Satori no lee CSS vars → el valor se importa de un módulo `tokens.ts` generado del CSS, no se escribe a mano)
app/not-found.tsx   // H1 «Esta página no existe», enlaces a / y /presupuesto, marca

components/ui/NodeField.tsx   (client)
  props: { density?, className? }
  - no arranca si prefers-reduced-motion: reduce; pausa con IntersectionObserver fuera de pantalla; ≤ 60 nodos; dpr ≤ 2; limpia RAF y listeners al desmontar
  - aria-hidden; pointer-events none; el hero es legible sin él (fallback: gradiente radial estático)

scripts/seo-gate.mjs
  entrada: BASE_URL (default http://localhost:3000)  salida: exit 0/1 + informe por criterio
  comprueba: 200 en las 6 rutas; 1 H1 único por página; H2 ≥ 1; jerarquía sin saltos (ningún H3 antes de un H2, ningún salto H1→H3); toda <img> con alt no vacío; <title> ≤ 60 y único; description ≤ 160 y única; canonical absoluta; og:image responde 200 image/png; JSON-LD parsea y @type esperado por página; ≥ 600 palabras en /; ≥ 6 preguntas en /como-trabajamos; robots contiene los 7 agentes y el sitemap; sitemap = exactamente 6 URLs; /llms.txt responde 200 text/plain con 6 enlaces; /agenda-demo y /recursos → 404; ninguna cadena 'Strategy & Technology'; ninguno de los identificadores/valores internos de CA-22 (§5); HTML de /presupuesto contiene la primera pregunta y el de ?reto=ia la segunda
```

## 4. Data model & flow

**Entidades**

- **SiteConfig** — nombre, esencia, claim, frase, URL canónica, contacto. Una instancia.
- **PageContent** (por página) — `key`, `path`, `title`, `description`, `h1`, `sections[]`, `breadcrumbs`, `dates` (artículo). Solo texto y estructura; sin estilo.
- **PublicLine** (×4) — clave de reto del motor (`Challenge`), nombre, para quién, capacidades (las 5 áreas del masterprompt como etiquetas), `priced`, `services: PublicService[]`.
- **PublicService** (×6 + 1 sin rango) — derivado de `ServiceRef` del catálogo + copy editorial; **la cifra nunca se escribe en el copy**, se formatea desde `officialMin/Max`.
- **FaqItem** (≥ 6) — `q`, `a` (autocontenida), usado por la página y por `FAQPage`.
- **ArticleMeta** — `headline`, `datePublished`, `dateModified`, secciones con citas (`source`, `year`, `id` arXiv).
- **Contact** — gana `consent: boolean`. **LeadRecord** — sin cambios de forma (el consentimiento viaja dentro de `contact`).

**Flujo primario — el lead** (`spec §Behaviour › páginas 1–2`)

1. `GET /` → Server Component pinta hero, tesis, 4 líneas, método, **«Antes de la llamada»** con las 4 opciones de reto como **enlaces** `/presupuesto?reto=<Challenge>` → HTML completo, sin JS necesario.
2. Clic en «IA y transformación digital» → `GET /presupuesto?reto=ia` → la página `await`ea `searchParams`, valida `reto` contra `CHALLENGE_OPTIONS`, y monta `<FormWizard initialChallenge="ia">` en SSR con la **segunda** pregunta visible.
3. El lead responde, llega a contacto, marca **consentimiento**, envía → `submitAction` (server) → `submitLead` valida (incl. consent) → motores → `RedactedOutcome` → `ResultScreen` (rango en mono + advertencia + calendario si procede).
4. En paralelo, `submitLead` despacha correo al lead (firma Nexus Consulting), aviso interno (con línea de consentimiento) y registro. Igual que hoy.

**Flujo secundario — el rastreador** (`spec §Users › Los motores`)

1. `GET /robots.txt` → permitido, `Sitemap:` apunta a `/sitemap.xml`.
2. `GET /sitemap.xml` → seis URLs absolutas.
3. `GET /servicios` → HTML con los 7 bloques, cada rango con «orientativo» en el mismo bloque; `<script type="application/ld+json">` con `Organization`, `WebSite`, `BreadcrumbList`, `Service[]` construidos **del mismo array** que pintó la página.
4. `GET /como-trabajamos` → FAQ visible + `FAQPage` con las mismas preguntas.

- **Fronteras de consistencia:** contenido ↔ JSON-LD (misma fuente); `/servicios` ↔ motor (misma función de formato y mismos `ServiceRef`); `Contact.consent` se valida en cliente y servidor.
- **Impacto de migración:** ninguna base de datos. Cambios de forma: `Contact` (+1 campo), `ValidationField` (+1 literal). `toSheetRow` no cambia columnas. Ficheros eliminados: `app/agenda-demo/`, `components/Landing.tsx`, `landing.test.tsx` (sustituida por pruebas de las nuevas secciones).

## 5. Testing strategy

| Criterio | Nivel | Asserta | Fakes |
|---|---|---|---|
| CA-01 marca/hex | unit (script en test) | grep sobre `src/**`: sin `Strategy & Technology`; sin `#hex` fuera de `tokens.css` (`design/tokens.ts` solo lee, no declara) | — |
| CA-02 contraste | unit | parsea `tokens.css`, calcula ratios de los pares de §0 y exige ≥ 4.5 / ≥ 3 según uso | — |
| CA-03 reduced motion | unit + manual | CSS: toda `animation`/`@keyframes` dentro del media query (grep estructural); `NodeField` no llama `requestAnimationFrame` si `matchMedia` devuelve reduce (mock) | `matchMedia` |
| CA-04 tono | unit + **acta humana** | palabras prohibidas ausentes en todos los módulos de `content/` y en `outcome/proposal/submit`; «orientativo» presente junto a cada `€` de `content/` | — |
| CA-05 emoji/stock | unit | regex emoji sobre `content/`; sin `<img>` fuera de `public/brand/` | — |
| CA-06 6 rutas + H1 | integration (`seo-gate`) | 200 ×6; `h1` count = 1; H1 distintos | servidor real (`next start`) |
| CA-07 600 palabras | integration | recuento sobre texto visible de `/` | servidor real |
| CA-08 primera pregunta | unit + integration | `/` contiene 4 enlaces `/presupuesto?reto=…`; `FormWizard initialChallenge='ia'` muestra la 2ª pregunta y «Atrás» vuelve a la 1ª; `?reto=xyz` se ignora | `onSubmit` fake |
| CA-09 rangos = motor | unit | para cada `ServiceRef` del catálogo, `publicServices()[i].rangeText === formatRange(oficial)`; 6 con cifra, 1 sin; cada bloque contiene «orientativo» | — |
| CA-10 FAQ ≥ 6 | unit + integration | `faq.length ≥ 6`; ninguna `a` referencia «anterior/arriba»; texto de llamada de alcance contiene «30 minutos», «sin coste» | — |
| CA-11 artículo citas | unit | cada `%` del artículo va en un párrafo que contiene `arXiv:2311.09735` o «Princeton»; fechas presentes y `dateModified ≥ datePublished` | — |
| CA-12 privacidad + consentimiento | unit (RTL) + unit (core) | secciones obligatorias presentes en `content/privacidad`; `validateContact` rechaza `consent:false`; botón enviar deshabilitado sin marcar; el error se anuncia | `onSubmit` fake |
| CA-13 404 | integration | `/no-existe` → 404 con enlaces a `/` y `/presupuesto` | servidor real |
| CA-14 360 px | manual (checklist de `verify`) | sin scroll horizontal en las 6 páginas y el estimador | navegador |
| CA-15 metadatos | unit + integration | `pageMetadata()` longitudes y canónica; en HTML: `<title>`, description, canonical, `og:image` 200 | servidor real |
| CA-16 robots | unit + integration | función `robots()` contiene los 7 agentes y el sitemap; `/robots.txt` sirve lo mismo | — |
| CA-17 sitemap | unit + integration | `sitemap()` = 6 URLs exactas; XML válido servido | — |
| CA-18 JSON-LD | unit + integration | builders devuelven `@type` esperado y **los mismos textos** que el contenido; HTML parsea todos los bloques | — |
| CA-19 jerarquía/alt | integration | sin saltos H1→H3; toda `<img>` con `alt` | servidor real |
| CA-20 llms.txt | integration | `text/plain`, 6 enlaces absolutos | servidor real |
| CA-21 sin regresión | unit | `vitest run` ≥ 156 pruebas; cobertura core ≥ 95 %; `pricing.test` caso de referencia intacto | — |
| CA-22 nada interno | integration | HTML de las 6 rutas y de `/presupuesto?reto=ia` no contiene ninguno de estos identificadores ni valores: `QUALIFICATION_THRESHOLD`, `MARGIN_PCT`, `ROUNDING_STEP`, `SIZE_FACTORS`, `MATURITY_FACTORS`, `TIMING_FACTORS`, `POINTS`, la cadena `/10`, ni los literales numéricos de los factores del catálogo (los rangos oficiales **sí** se publican: CA-09) | servidor real |
| CA-23 agenda-demo | integration | `/agenda-demo` → 404 | servidor real |
| CA-24 correos | unit | `composeProposal` firma «Nexus Consulting», sin «Strategy»; `buildInternalNotice` incluye consentimiento; asunto nuevo | — |

- **La línea e2e:** no se añade Playwright (dependencia pesada para un ciclo). La **puerta de integración es `scripts/seo-gate.mjs` contra `next build` + `next start`** — es lo que un rastreador ve, y es exactamente lo que CA-06…CA-20 exigen. `verify.sh` gana un paso que compila, arranca en un puerto libre, ejecuta la puerta y apaga.
- **Debe ser real:** el servidor de producción (no `dev`) para la puerta SEO — el HTML de `dev` incluye overlays y difiere en streaming de metadatos. Las fuentes de Google se descargan en `next build`: **hace falta red en el build**.
- **Debe ser humano:** el acta de tono (CA-04, principio 28/36) y el recorrido a 360 px (CA-14). Ambos son bloqueos de `ship`, no de `implement`.

## 6. Sequencing & dependencies

1. **Aislar**: rama `feat/sitio-nexus-consulting` desde `main` (`worktrees`); restaurar `package-lock.json` limpio con `npm ci`; añadir `lucide-react` — depends on: none — serial.
2. **Fundamentos**: `tokens.css` (verbatim DS) + `design/tokens.ts` (**lector** del CSS para Satori; no contiene valores), `globals.css` (reset, base tipográfica, utilidades de layout/ritmo, motion con guards), fuentes `next/font`, `content/site.ts` + env (`NEXT_PUBLIC_SITE_URL`, `NEXUS_INTERNAL_MAILBOX` default nuevo), `public/brand/` (isotipo, logo horizontal copiados del DS), `layout.tsx` con metadata base, `not-found.tsx`; **borrar `app/agenda-demo/`** — depends on: #1 — serial (todo lo demás cuelga de aquí).
3. **UI kit**: `Button`, `Card`, `Badge`, `Eyebrow`, `Section`, `ProgressBar`, `Icon`, `NodeField` (+ pruebas de contraste y reduced-motion) — depends on: #2 — **parallelizable** con #4 y #5.
4. **Contenido**: `core/format.ts` (extracción) → `content/services.public.ts`, `content/home.ts`, `content/servicios.ts`, `content/como-trabajamos.ts` (FAQ ≥ 6), `content/articulo-seo-geo.ts`, `content/privacidad.ts` (con skill `gdpr-privacy`), `content/not-found.ts`; pruebas de tono, «orientativo», rangos = motor — depends on: #2 — **parallelizable** con #3 y #5.
5. **Capa SEO**: `seo/metadata.ts`, `seo/jsonld.ts`, `JsonLd.tsx`, `robots.ts`, `sitemap.ts`, `llms.txt/route.ts`, `opengraph-image.tsx` + pruebas unitarias — depends on: #2 (+ tipos de #4 para builders) — **parallelizable** con #3.
6. **Sitio**: `Header`, `Footer`, `Breadcrumbs`, secciones (`Hero`, `ServiceLines`, `Method`, `BeforeTheCall`, `FaqList`, `CtaBand`) y las **cinco páginas de contenido** (`/`, `/servicios`, `/como-trabajamos`, `/recursos/seo-frente-a-geo`, `/privacidad`) con metadata + JSON-LD — depends on: #3, #4, #5 — serial dentro, **parallelizable** con #7.
7. **Estimador**: `Contact.consent` + `validateContact` + aviso interno (pruebas core de validación/submit ajustadas: solo aserciones), `composeProposal`/asuntos con marca, `FormWizard` re-vestido con `initialChallenge` y consentimiento, `ResultScreen` re-vestido, `app/presupuesto/page.tsx` con `searchParams`; pruebas de recorrido actualizadas — depends on: #3, #4 (site.ts) — **parallelizable** con #6.
8. **Wiki y lista de tono**: reescribir `sdd/tone-checklist.md` sobre S1–S12; actualizar `producto/Landing de Captacion de Leads.md` (ahora «sitio»), crear `stack/nextjs.md` y `stack/design.md` (decisiones de diseño: tokens, botón sólido, motion), actualizar `index.md`, `log.md`, `gaps.md` (hueco de contraste cerrado) — depends on: #2 — **parallelizable** con todo.
9. **Puerta SEO**: `scripts/seo-gate.mjs` + integración en `scripts/verify.sh` — depends on: #6, #7 — serial.
10. **verify** (`verify.sh` = lint + tipos + cobertura + build + seo-gate) → **review** (subagentes refutadores: corrección, seguridad —server-only, secretos—, pruebas) → **ship** (Carlos revisa, firma el acta de tono y commitea) — depends on: #9 — serial.

- **Candidatos paralelos:** {#3, #4, #5} tras #2; {#6, #7} tras {#3,#4,#5}; #8 en cualquier momento tras #2. Fan-out con `parallel` en worktrees por tarea, disjuntos por carpeta.
- **Orden duro y por qué:** #2 antes que todo (tokens y layout son la base compartida); `core/format.ts` (#4) antes que `services.public.ts` y antes de tocar `outcome.ts`; #9 solo tiene sentido con las páginas hechas.

## 7. Risks & open decisions

**Riesgos** (ordenados)

| Riesgo | Disparador | Impacto | Mitigación / spike |
|---|---|---|---|
| El botón degradado del DS falla AA con texto blanco (1.66:1 en el extremo cian) | Copiar el `Button` del kit tal cual | Viola 34 y CA-02 en la acción principal de todo el sitio | Decidido en §0: primario **sólido azul** + glow; degradado solo en display ≥ 30 px, líneas, barra y foco. Prueba de contraste automática. |
| `NodeField` (canvas + O(n²) enlaces) come CPU en móvil y activa el ventilador en la clase | Hero con 70 nodos a 60 fps | Sensación de web pesada; INP alto | ≤ 60 nodos, `dpr ≤ 2`, pausa fuera de pantalla, no arranca con reduced-motion; medir en el recorrido manual. |
| Pruebas heredadas fallan por selectores (`.cta`, textos) | Re-vestido | Falsa alarma de regresión | Regla §0: solo aserciones de marca/copy; `landing.test.tsx` se sustituye por pruebas de `site/*` equivalentes (misma cobertura de intención: una CTA, cuatro líneas, sin promesas, «orientativo»). |
| Next 16 difiere de lo memorizado (Promise en `searchParams`, `next lint` eliminado, metadata streaming) | Escribir de memoria | Build roto o metadatos no en el HTML inicial | Leer los docs locales antes de cada API; `generateMetadata` solo donde haga falta (aquí todo es estático → `metadata` objeto, sin streaming). |
| Build sin red: `next/font/google` no descarga | Máquina sin internet en la clase | `next build` falla | Documentar el requisito; si falla, degradar a `fallback` del sistema con la misma métrica (`adjustFontFallback`). |
| OG image con Satori: no lee CSS vars ni Sora | `opengraph-image.tsx` | Imagen fuera de marca o build roto | `design/tokens.ts` **lee** `tokens.css` en tiempo de ejecución (misma fuente, ningún hex duplicado); tipografía por defecto de `ImageResponse`; composición sobria: isotipo + nombre + claim. |
| Texto legal de `/privacidad` incompleto o inventado | Redactar sin fuente | Bloqueo de `ship` (23) o dato registral falso | Skill `gdpr-privacy`; responsable = marca + contacto; **sin** NRT/registro inventado; plazo de conservación declarado como valor a confirmar (12 meses) y marcado en la wiki para revisión legal. |
| JSON-LD «bonito» que describe algo que no está en la página | Añadir `aggregateRating`, `review`, precios de la línea sin rango | Viola 33 y CA-18; riesgo de penalización | Builders solo aceptan los objetos de `content/`; sin campos de reseñas/valoraciones; `offers` solo si `openEnded=false`. |
| El copy de servicios «vende» ESG/ciber en tono Nexus S&T | Reutilizar el texto viejo | Rompe la voz de marca (30) | Reescribir desde el masterprompt: problema real → beneficio → tecnología; las 5 áreas como capacidades; pasar el test de prohibidas y el acta. |
| La sesión vecina escribe en el repo | Descongelación no avisada | Conflictos en la wiki | Congelación aceptada por escrito; `git status` antes de cada fase. |

**Decisiones abiertas** (ninguna bloquea `tasks`)

- Plazo de conservación de los datos del lead en `/privacidad`: se redacta **12 meses** como valor propuesto; cierra con la revisión legal humana.
- Si el despliegue de Eric usa otro dominio, `NEXT_PUBLIC_SITE_URL` lo resuelve sin tocar código; cierra en la clase de despliegue.
- Dirección de correo del remitente (`RESEND_FROM`): configuración de `01-TOOLS/RESEND/.env`; el código solo cambia el nombre visible y la firma.

## Tasks
<!-- generated by tasks on 2026-09-02; IDs are stable, do not renumber -->

Rutas relativas a `03-APP/`. `npx vitest run <ruta>` ejecuta un fichero; `npm test` toda la batería. Los
§0 Global Constraints del plan se heredan en todas las filas y no se repiten.

| ID | [P] | Task | Done-check | Depends-on | Trace |
| --- | --- | --- | --- | --- | --- |
| T001 |  | Aislar el trabajo: rama `feat/sitio-nexus-consulting`, `npm ci` limpio, `lucide-react` en `package.json` | `git branch --show-current` = `feat/sitio-nexus-consulting`; `git diff --stat main -- 03-APP/package.json` muestra solo `lucide-react`; `npm test` verde (156) | — | constitución 18; plan §6.1 |
| T002 |  | Crear `src/app/tokens.css` con los tokens del DS verbatim (colors, typography, spacing, effects) y `src/design/tokens.ts` (`readToken(name)` server-only que lee el CSS) | los nombres de custom property de `tokens.css` son exactamente los del DS (`diff` de los dos listados ordenados vacío); `npx vitest run src/design/tokens.test.ts` verde | T001 | constitución 31; spec §Behaviour › marca |
| T003 |  | Escribir prueba de contraste `src/design/contrast.test.ts` (parsea `tokens.css`, calcula WCAG para los pares de plan §0 y exige 4,5/3,0) | `npx vitest run src/design/contrast.test.ts` verde y **falla** si se cambia `--text-muted` a `#64748B` (comprobación manual de que la prueba muerde) | T002 | CA-02; constitución 34 |
| T004 |  | Reescribir `src/app/globals.css`: reset, `color-scheme: dark`, base tipográfica con `--font-*`, utilidades de layout/ritmo (`.container`, `.section`, `.stack`), foco cian, `prefers-reduced-motion` guards, reveal `animation-timeline: view()` bajo `@supports` | `npx vitest run src/design/motion.test.ts` verde (toda `animation`/`@keyframes` dentro del media query; sin `transition: all`) | T002 | CA-03; constitución 35 |
| T005 | [P] | Cargar fuentes con `next/font/google` (Sora, Inter, IBM Plex Mono → variables `--font-display/body/mono`) en `layout.tsx` y añadir `lang="es"`, `metadataBase`, `title.template`, OG por defecto | `npm run typecheck` verde; `curl -s localhost:3000` contiene `<html lang="es"` y la clase de variable de fuente | T002 | CA-15; constitución 31 |
| T006 | [P] | Crear `src/content/site.ts` (`siteConfig`: nombre, esencia, claim, frase, `url` desde `NEXT_PUBLIC_SITE_URL` con default `https://nexus.ad`, contacto) y cambiar el default de `NEXUS_INTERNAL_MAILBOX` en `actions.ts` a `oportunidades@nexus.ad` | `npx vitest run src/content/site.test.ts` verde (url absoluta; default correcto sin env); `grep -rn 'nexus-st' src` vacío | T001 | CA-01, CA-24; plan §3 |
| T007 | [P] | Copiar `nexus-isotype.png` y `nexus-logo-horizontal.png` del DS a `public/brand/`; borrar `src/app/agenda-demo/` | `ls public/brand` lista los dos PNG; `test ! -d src/app/agenda-demo`; `npm test` verde | T001 | CA-23; spec §Behaviour › páginas |
| T008 |  | Escribir pruebas de marca `src/design/brand.test.ts`: sin `Strategy & Technology` en `src/**`; sin `#hex` fuera de `tokens.css`; sin emoji en `src/content/**`; ninguna `<img`/`next/image` fuera de `public/brand/` (CA-05) | `npx vitest run src/design/brand.test.ts` **rojo** (aún existe la marca vieja en `proposal.ts`/`submit.ts`) por la razón correcta | T002, T006 | CA-01, CA-05 |
| T009 |  | Extraer `formatRange` a `src/core/format.ts` y hacer que `outcome.ts` lo importe (refactor puro) | `npx vitest run src/core/outcome.test.ts src/core/format.test.ts` verde sin editar `outcome.test.ts`; `npm run test:coverage` ≥ 95 % en core | T001 | C-08; constitución 14 |
| T010 |  | Escribir prueba `src/core/validation.test.ts` (ampliar): `consent:false` → error `field:'consent'`; orden name→email→company→consent | `npx vitest run src/core/validation.test.ts` **rojo**: `consent` no existe en `Contact` | T001 | CA-12; C-02 |
| T011 |  | Añadir `consent: boolean` a `Contact`, `'consent'` a `ValidationField`, la regla en `validateContact`, y la línea `Consentimiento: sí (<submittedAt>)` en `buildInternalNotice`; actualizar fixtures de pruebas existentes (solo añadir `consent: true`) | T010 verde; `npx vitest run src/core` verde; `npm run typecheck` verde | T010 | CA-12, CA-24 |
| T012 |  | Re-marcar copy de core: firma «Nexus Consulting» en `composeProposal` (2 ramas), asunto «Tu estimación orientativa — Nexus Consulting» en `submit.ts`; ajustar **solo** aserciones de marca en `proposal.test.ts`/`submit.test.ts` | `npx vitest run src/core/proposal.test.ts src/core/submit.test.ts` verde; `grep -rn 'Strategy' src/core` vacío | T011 | CA-24; constitución 30 |
| T013 |  | Crear `src/content/tone.ts` (lista `PROHIBIDAS` de plan §0 como regex) y `src/content/tone.test.ts`: ninguna prohibida en `src/content/**` ni en `outcome/proposal/submit`; «orientativo» en el mismo bloque que cada `€` de `content/` | `npx vitest run src/content/tone.test.ts` verde (con contenido vacío pasa; se re-ejecuta al final) | T006 | CA-04, CA-05; constitución 27, 36 |
| T014 |  | Portar UI kit a TSX + `src/app/ui.css`: `Button` (primary sólido / secondary / outline / ghost; sm/md/lg; con `href` renderiza `<a>`), `Card` (solid/gradient/node, `interactive`), `Badge`, `Eyebrow`, `Section` (`tone`), `ProgressBar` (con `role=progressbar`), `Icon` (lucide-react, `strokeWidth 1.6`, `aria-hidden`) | `npx vitest run src/components/ui/ui.test.tsx` verde (render, variantes, `href` produce `<a>`, `progressbar` con `aria-valuenow`); `npx vitest run src/design/motion.test.ts src/design/contrast.test.ts` verde (motion cubre también `ui.css` y `site.css`); `brand.test.ts` rojo **solo** por `proposal.ts`/`submit.ts` hasta T012 | T003, T004 | CA-02, CA-19; constitución 31 |
| T015 | [P] | Implementar `NodeField.tsx` (client): canvas, ≤ 60 nodos, `dpr ≤ 2`, `IntersectionObserver` pausa, **no arranca** con `prefers-reduced-motion: reduce`, `aria-hidden`, limpieza en desmontaje | `npx vitest run src/components/ui/node-field.test.tsx` verde: con `matchMedia` → reduce, `requestAnimationFrame` no se llama; sin reduce, se llama y se cancela al desmontar | T004 | CA-03; constitución 35 |
| T016 | [P] | Crear `src/content/services.public.ts` (`import 'server-only'`; `publicLines()`, `publicServices()` con copy editorial por servicio y `rangeText` vía `formatRange`) | `npx vitest run src/content/services.public.test.ts` verde: 6 con cifra + 1 sin; `rangeText[i] === formatRange(oficial_i)`; tipo sin campos internos; cada `includes` ≥ 3; «orientativo» en el bloque | T009, T013 | CA-09; C-08; constitución 4, 8 |
| T017 | [P] | Escribir `src/content/home.ts` (hero, tesis, líneas, método 4 fases, «Antes de la llamada», cierre) y `src/content/como-trabajamos.ts` (método + llamada de alcance + FAQ ≥ 6 autocontenidas, incl. «¿Dónde estáis y dónde van mis datos?») | `npx vitest run src/content/faq.test.ts src/content/tone.test.ts` verde: `faq.length ≥ 6`; ninguna respuesta contiene «anterior»/«arriba»; llamada de alcance contiene «30 minutos» y «sin coste»; sin prohibidas | T013 | CA-07, CA-10; C-07 |
| T018 | [P] | Escribir `src/content/articulo-seo-geo.ts` desde `02-DOCS/wiki/seo-geo/SEO frente a GEO.md` (headline, `datePublished`, `dateModified`, secciones; cada `%` en un párrafo con `arXiv:2311.09735`/«Princeton») | `npx vitest run src/content/articulo.test.ts` verde: cada párrafo con `%` cita la fuente; fechas ISO válidas y `dateModified ≥ datePublished`; sin prohibidas | T013 | CA-11; S-0015 |
| T019 | [P] | Redactar `src/content/privacidad.ts` con skill `gdpr-privacy`: responsable (Nexus Consulting + contacto, **sin datos registrales inventados**), datos, finalidad, base legal, destinatarios (correo, registro, calendario), transferencia fuera de la UE, conservación (12 meses, valor a confirmar), derechos, fecha | `npx vitest run src/content/privacidad.test.ts` verde: las 8 secciones obligatorias presentes por `id`; sin prohibidas; sin patrón de NRT/CIF inventado | T013 | CA-12; C-07, C-09; constitución 22–23 |
| T020 | [P] | Escribir `src/content/not-found.ts` y `src/content/servicios.ts` (intro de página, texto de la línea sin rango, cierre) | `npx vitest run src/content/tone.test.ts` verde con todo el contenido cargado | T013 | CA-13, CA-09 |
| T021 | [P] | Implementar `src/seo/metadata.ts` (`PAGES`, `pageMetadata(key)`: title ≤ 60 con plantilla, description ≤ 160, canonical absoluta, OG/Twitter; lanza si viola) y su prueba | `npx vitest run src/seo/metadata.test.ts` verde para las 6 claves: longitudes, unicidad de title/description, canonical absoluta | T006 | CA-15; constitución 33 |
| T022 | [P] | Implementar `src/seo/jsonld.ts` (`organization`, `webSite`, `services`, `faqPage`, `article`, `breadcrumbs` de 2 niveles) + `JsonLd.tsx` y prueba de coherencia (mismos textos que el contenido) | `npx vitest run src/seo/jsonld.test.ts` verde: `@type` correcto; `faqPage(faq).mainEntity[i].name === faq[i].q`; `offers` solo si `openEnded=false`; `breadcrumbs` siempre 2 ítems | T016, T017, T018 | CA-18; constitución 33 |
| T023 | [P] | Implementar `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts` y prueba | `npx vitest run src/seo/routes.test.ts` verde: robots incluye los 7 agentes y `sitemap`; sitemap = exactamente las 6 URLs absolutas con `lastModified`; llms.txt contiene 6 enlaces absolutos y `Content-Type: text/plain` | T006, T021 | CA-16, CA-17, CA-20 |
| T024 | [P] | Implementar `app/opengraph-image.tsx` (1200×630; isotipo + «Nexus Consulting» + claim; colores vía `readToken`) | `curl -s -o /tmp/og.png -w '%{http_code} %{content_type}' localhost:3000/opengraph-image` → `200 image/png`; `file /tmp/og.png` = PNG 1200×630 | T002, T007 | CA-15 |
| T025 |  | Construir `src/components/site/`: `Header` (server, lockup, nav, CTA; móvil con `<details>`), `Footer` (claim, nav, contacto, privacidad), `Breadcrumbs` | `npx vitest run src/components/site/chrome.test.tsx` verde: landmarks `header/nav/footer`; enlaces a las 6 rutas; `<details>` presente; sin `Strategy` | T014, T006 | CA-01, CA-19; constitución 32 |
| T026 |  | Construir secciones `Hero` (con `NodeField` + fallback gradiente), `ServiceLines`, `Method`, `BeforeTheCall` (4 enlaces `/presupuesto?reto=<Challenge>`), `FaqList`, `CtaBand`, `ServiceBlock`, `Prose` | `npx vitest run src/components/site/sections.test.tsx` verde: `BeforeTheCall` tiene 4 `<a href="/presupuesto?reto=…">` con los valores de `CHALLENGE_OPTIONS`; `ServiceBlock` pinta rango + «orientativo» en el mismo bloque; `FaqList` usa `<h3>` por pregunta | T014, T015, T016, T017 | CA-08, CA-09, CA-19 |
| T027 |  | Página `/` (`app/page.tsx`, server): metadata, JSON-LD (Organization, WebSite), secciones de `home.ts`; borrar `Landing.tsx` y `landing.test.tsx`; escribir `home.test.tsx` (una CTA primaria, cuatro líneas, sin promesas, «orientativo») | `npx vitest run src/app/home.test.tsx` verde; texto visible de `curl -s localhost:3000` ≥ 600 palabras; exactamente un `<h1` | T021, T022, T025, T026 | CA-06, CA-07, CA-08 |
| T028 | [P] | Página `/servicios`: metadata, JSON-LD (Organization, WebSite, BreadcrumbList, Service[]), 4 líneas × bloques de servicio, línea sin rango explicada, enlaces a estimar | `npx vitest run src/app/servicios.test.tsx` verde: 7 bloques; 6 rangos = `publicServices()`; texto de la línea sin rango; `curl` muestra `"@type":"Service"` ×6 | T021, T022, T025, T026 | CA-09, CA-18 |
| T029 | [P] | Página `/como-trabajamos`: metadata, JSON-LD (…, FAQPage), método, llamada de alcance, FAQ con `<h2>`/`<h3>` | `npx vitest run src/app/como-trabajamos.test.tsx` verde: ≥ 6 `<h3>` de FAQ; `FAQPage.mainEntity.length === faq.length` | T021, T022, T025, T026 | CA-10, CA-18 |
| T030 | [P] | Página `/recursos/seo-frente-a-geo`: metadata, JSON-LD (…, Article con fechas), `Prose` con fechas visibles | `npx vitest run src/app/articulo.test.tsx` verde: fechas visibles; `Article.datePublished` = contenido | T021, T022, T025, T026, T018 | CA-11, CA-18 |
| T031 | [P] | Página `/privacidad`: metadata (`robots: index`), migas, secciones con `id` | `npx vitest run src/app/privacidad.test.tsx` verde: 8 secciones con `id`; enlace de contacto `mailto:hola@nexus.ad` | T021, T025, T019 | CA-12 |
| T032 | [P] | `app/not-found.tsx` con marca, enlaces a `/` y `/presupuesto` | `curl -s -o /dev/null -w '%{http_code}' localhost:3000/no-existe` = 404; el HTML contiene `href="/presupuesto"` | T025, T020 | CA-13 |
| T033 |  | Escribir pruebas del estimador re-vestido `src/components/estimator.test.tsx`: `initialChallenge='ia'` muestra la 2ª pregunta y «Atrás» vuelve a la 1ª con `aria-pressed`; `initialChallenge` inválido se ignora; sin marcar consentimiento el botón enviar está deshabilitado; con `field:'consent'` el error se anuncia | `npx vitest run src/components/estimator.test.tsx` **rojo** por la razón correcta (props/checkbox inexistentes) | T011 | CA-08, CA-12 |
| T034 |  | Re-vestir `FormWizard.tsx` (prop `initialChallenge`, casilla de consentimiento con enlace a `/privacidad`, UI kit, `ProgressBar`), `ResultScreen.tsx` (rango en `--font-mono`, `Card`, calendario igual) y crear `Estimator.tsx` (client: stage + `submissionId` + `initialChallenge`) | T033 verde; `npx vitest run src/components` verde (a11y, form-wizard, contact-validation, result-screen: solo aserciones de copy/selectores actualizadas); `npm run typecheck` verde | T033, T014 | CA-08, CA-12, CA-24; constitución 24 |
| T035 |  | Página `/presupuesto` (`app/presupuesto/page.tsx`, server): `await searchParams`, validar `reto`, H1 + explicación en HTML, `<Estimator initialChallenge>`; metadata + JSON-LD (Organization, WebSite, BreadcrumbList) | `curl -s 'localhost:3000/presupuesto?reto=ia'` contiene «¿Qué necesitas exactamente?»; `curl -s localhost:3000/presupuesto` contiene «¿Cuál es el reto»; `npm run typecheck` verde | T034, T021, T022, T025 | CA-06, CA-08, CA-22; constitución 32 |
| T036 |  | Escribir `scripts/seo-gate.mjs` con **todas** las comprobaciones listadas en plan §3 (incluidas jerarquía de encabezados, `alt`, `llms.txt` text/plain y el conjunto CA-22) + `scripts/seo-gate.sh` (build → `next start -p <libre>` → gate → kill) e integrarlo en `scripts/verify.sh` | `bash scripts/seo-gate.sh` → exit 0 con cada comprobación de §3 impresa en verde; `bash scripts/verify.sh` verde | T023, T024, T027–T032, T035 | CA-06, CA-07, CA-09, CA-10, CA-13–CA-20, CA-22, CA-23 |
| T037 | [P] | Reescribir `02-DOCS/wiki/sdd/tone-checklist.md` sobre S1–S12 (acta vacía, firmante humano); crear `02-DOCS/wiki/stack/nextjs.md` y `02-DOCS/wiki/stack/design.md` (tokens, botón sólido, motion); actualizar `producto/Landing de Captacion de Leads.md` (→ sitio), `index.md`, `log.md`; cerrar en `gaps.md` el hueco de contraste; **anexar a `sdd/decisions.md`** las decisiones de implementación no cubiertas por `S-0018` y las dos notas: `/privacidad` es borrador para revisión legal (plazo de conservación 12 meses a confirmar) y la canónica por defecto `https://nexus.ad` se sustituye por configuración en el despliegue | `grep -c 'S12' 02-DOCS/wiki/sdd/tone-checklist.md` ≥ 1; las dos páginas `stack/*` indexadas en `index.md`; `log.md` con entrada fechada | T014 | constitución 28, 29, 36 |
| T038 |  | **Puerta humana entre `verify` y `ship`**: recorrido manual a 360 px y teclado (las 6 páginas + estimador completo), y **acta de tono S1–S12 firmada por Carlos**. `verify` la reporta como *pendiente de firma*, no como fallo; `ship` no procede sin ella | Checklist de `verify` marcada; `tone-checklist.md` con las 12 filas ✓, revisor y fecha | T039 | CA-04, CA-14; constitución 28 |
| T039 |  | Todos los done-checks automáticos pasan + `verify.sh` verde → handoff a `verify` | Cada fila T001–T037 comprobada; `bash scripts/verify.sh` exit 0; `npm test` ≥ 156 pruebas; `npm run test:coverage` ≥ 95 % core | T001–T037 | spec §Acceptance |

**T002 — Interfaces**
- Produces: `src/app/tokens.css` con **exactamente** los nombres de custom property del DS (`--nx-*`, `--surface-*`, `--text-*`, `--accent-*`, `--border-*`, `--ring-*`, `--glow-*`, `--font-*`, `--text-2xs…6xl`, `--weight-*`, `--leading-*`, `--tracking-*`, `--space-*`, `--radius-*`, `--container-*`, `--z-*`, `--shadow-*`, `--inset-*`, `--blur-*`, `--ease-*`, `--dur-*`); `readToken(name: string): string` en `src/design/tokens.ts` (server-only, lee el fichero, lanza si no existe el token).

**T006 — Interfaces**
- Produces: `siteConfig: { name: 'Nexus Consulting'; essence: string; claim: string; tagline: string; url: URL; contact: { email: 'hola@nexus.ad'; phone: '+376 123 456'; address: 'Andorra la Vella, Andorra' } }`; `absoluteUrl(path: string): string`.

**T009 — Interfaces**
- Produces: `formatRange(price: PriceRange): string` en `src/core/format.ts`, comportamiento idéntico al actual (`'28.000 – 35.000 €'`, `'6.000 – 15.000 € / mes'`, `'Desde 40.000 €, con el techo a confirmar en llamada de alcance'`).

**T011 — Interfaces**
- Produces: `Contact = { readonly name: string; readonly email: string; readonly company: string; readonly consent: boolean }`; `ValidationField` += `'consent'`; `validateContact` devuelve `{ kind:'validation_error', field:'consent', message:'Necesitamos tu consentimiento para enviarte la estimación.' }` cuando `consent !== true`, **después** de name/email/company.

**T014 — Interfaces**
- Produces: `Button({ variant?: 'primary'|'secondary'|'outline'|'ghost'; size?: 'sm'|'md'|'lg'; asChild?: boolean; full?: boolean; iconLeft?; iconRight?; ...ButtonHTMLAttributes })`; `Card({ variant?: 'solid'|'gradient'|'node'; padding?: 'none'|'sm'|'md'|'lg'; interactive?: boolean; as?: 'div'|'article'|'section' })`; `Badge({ tone?: 'accent'|'cyan'|'neutral'; dot?: boolean })`; `Eyebrow({ children })` → `<p class="eyebrow">`; `Section({ tone?: 'base'|'sunken'|'raised'; bleed?: boolean; id?; ariaLabelledby? })`; `ProgressBar({ value: number; max: number; label: string })` → `role="progressbar"` + `aria-valuenow/min/max`; `Icon({ name: keyof typeof icons; size?: number })` → `aria-hidden`.
- Consumes: clases en `src/app/ui.css` (`.btn`, `.btn--primary`… `.card`, `.badge`, `.eyebrow`, `.section`, `.progress`), solo tokens.

**T016 — Interfaces**
- Consumes: `SERVICES`/`ServiceRef` de `core/catalog.ts` (server-only), `formatRange` (T009), `CHALLENGE_OPTIONS`/`NEED_OPTIONS` de `core/options.ts`.
- Produces: `publicLines(): PublicLine[]` con `PublicLine = { key: Challenge; name: string; forWhom: string; capabilities: string[]; priced: boolean; reason?: string; services: PublicService[] }`; `publicServices(): PublicService[]` con `PublicService = { id: ServiceId; line: Challenge; label: string; officialMin: number; officialMax: number|null; unit: 'total'|'month'; openEnded: boolean; rangeText: string; forWhom: string; includes: string[]; whenApplies: string }`. **Sin** `factor`, `points`, `threshold` ni nada del método.

**T017/T018/T019/T020 — Interfaces**
- Produces (todas): objetos `readonly` exportados con `title`, `description` (≤ 160), `h1`, y sus secciones; `FaqItem = { id: string; q: string; a: string }`; `ArticleMeta = { headline; description; datePublished: string(ISO); dateModified: string(ISO); sections: { h2: string; paragraphs: string[] }[] }`; `PrivacySection = { id: 'responsable'|'datos'|'finalidad'|'base-legal'|'destinatarios'|'transferencias'|'conservacion'|'derechos'; h2: string; paragraphs: string[] }`.

**T021/T022/T023 — Interfaces**
- Produces: `PageKey = 'home'|'presupuesto'|'servicios'|'como-trabajamos'|'articulo'|'privacidad'`; `pageMetadata(key): Metadata`; `PAGES: Record<PageKey, { path: string; title: string; description: string; lastModified: string }>` (fuente única para metadata, sitemap y llms.txt); `jsonld.organization()`, `webSite()`, `services(list: PublicService[])`, `faqPage(items: FaqItem[])`, `article(a: ArticleMeta)`, `breadcrumbs(current: { name: string; path: string })` → siempre `[Inicio, current]`; `<JsonLd data={object | object[]} />`.

**T034 — Interfaces**
- Produces: `FormWizardProps += { initialChallenge?: Challenge }`; `Estimator({ initialChallenge?: Challenge })` (client) que monta `FormWizard` → `ResultScreen` y acuña `submissionId` con `crypto.randomUUID()`; el checkbox `id="consent"` con `<label htmlFor="consent">` que contiene `<a href="/privacidad">`; `Contact.consent` viaja en `answers.contact`.
- Consumes: `Button`, `Card`, `ProgressBar` (T014); `submitAction` (sin cambios de firma).

**T036 — Interfaces**
- Consumes: `BASE_URL`; las 6 rutas de `PAGES`.
- Produces: `scripts/seo-gate.mjs` → salida `✓/✗ <criterio>` por línea, exit 0/1; `scripts/seo-gate.sh` que compila, arranca en puerto libre, ejecuta y apaga; `scripts/verify.sh` con el paso `paso "Puerta SEO/GEO (constitution 32-33)" bash scripts/seo-gate.sh`.

## Review Workload Forecast

| Dimension | Forecast | Why |
| --- | --- | --- |
| Estimated changed lines | **2.800 – 3.600** | CSS ~650 (tokens verbatim + base + ui + site) · contenido ~950 (6 páginas, FAQ, artículo, privacidad) · componentes ~900 · SEO ~300 · pruebas ~750 · scripts ~200 · wiki ~450; menos ~350 borradas (Landing, agenda-demo, CSS viejo) |
| Files / areas | **~55 ficheros en 7 áreas**: `app/` (12), `content/` (10), `components/ui` (9), `components/site` (10), `seo/` (4), `core/` (5, de ellos 3 solo copy), `design/` (4 pruebas), `scripts/` (2), wiki (7) | |
| Review risk | **medium** | Sin lógica de negocio nueva (motores intactos), pero mucha superficie visual y de copy que solo una persona puede juzgar (acta de tono, 360 px); un cambio de tipo en `Contact` cruza core/UI/pruebas; `server-only` protege el catálogo (revisar con el refutador de seguridad) |
| Suggested delivery | **exception** — justificación **vigente** (sustituye a la de `config.yaml`, escrita cuando no había git): autopilot aprobado por el usuario el 2026-09-02 y presentación en clase el mismo día con **commits por área** en la rama `feat/sitio-nexus-consulting` — 8 commits: fundamentos → ui → contenido → seo → páginas → estimador → puerta/verify → wiki — para que la revisión humana sea por bloques de ≤ 500 líneas, no un diff de 3.000 | `config.review_budget.line_budget` = 400 se supera ×7; `config.delivery_strategy` ya es `exception` |
