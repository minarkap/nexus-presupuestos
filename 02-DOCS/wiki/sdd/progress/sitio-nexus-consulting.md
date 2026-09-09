# Progreso — sitio-nexus-consulting

Ledger append-only de `implement`. Ejecutado en autopilot el 2026-09-02 con plazo de presentación el
mismo día: las tareas se agruparon por área en vez de una a una, y los commits quedan para el humano
(constitución 20). Estado de cada tarea al cierre de la implementación:

## Bloque 1 — fundamentos (T001–T008) — 2026-09-02
- status: complete
- rama `feat/sitio-nexus-consulting`; `lucide-react@1.39.0` y `server-only` añadidos (S-0019)
- `tokens.css` verbatim del DS (150 propiedades), `design/tokens.ts` lector, `fonts.ts`, `globals.css`, `ui.css`, `site.css`
- `public/brand/` con isotipo y logo; `agenda-demo/` borrado
- pruebas: `design/contrast.test.ts`, `design/motion.test.ts`, `design/brand.test.ts`

## Bloque 2 — core (T009–T013) — 2026-09-02
- status: complete
- `core/format.ts` extraído; `Contact.consent` + validación + línea en aviso interno; firma y asunto «Nexus Consulting»
- fixtures: `consent: true` añadido (aditivo); aserciones de marca actualizadas; motores sin tocar
- pruebas: `content/tone.test.ts`

## Bloque 3 — UI kit y contenido (T014–T020) — 2026-09-02
- status: complete
- `components/ui/*` (Button con `href`, Card, Badge, Eyebrow, Section, ProgressBar, Icon, NodeField)
- `content/*`: site, home, servicios, services.public (server-only), como-trabajamos (8 FAQ), articulo-seo-geo, privacidad (borrador legal), not-found, tone
- pruebas: `content/content.test.ts`

## Bloque 4 — SEO (T021–T024) — 2026-09-02
- status: complete
- `seo/metadata.ts` (PAGES, longitudes), `seo/jsonld.ts`, `seo/json-ld.tsx`, `robots.ts`, `sitemap.ts`, `llms.txt`, `opengraph-image.tsx`
- pruebas: `seo/seo.test.ts`

## Bloque 5 — sitio y estimador (T025–T035) — 2026-09-02
- status: complete
- Header (`<details>` móvil), Footer, Breadcrumbs, secciones; páginas `/`, `/servicios`, `/como-trabajamos`, `/recursos/seo-frente-a-geo`, `/privacidad`, `not-found`
- `Estimator.tsx` (island), `FormWizard` re-vestido con `initialChallenge` y consentimiento, `ResultScreen`, `/presupuesto` con `searchParams`
- pruebas de recorrido actualizadas: solo el clic en la casilla de consentimiento y selectores de marca

## Bloque 6 — puerta y wiki (T036, T037) — 2026-09-02
- status: complete
- `scripts/seo-gate.mjs` + `seo-gate.sh` integrados en `verify.sh`
- wiki: tone-checklist S1–S12, `stack/design.md`, `stack/nextjs.md`, decisiones S-0019

## Pendiente humano (T038) → puerta entre `verify` y `ship`
- recorrido manual a 360 px y teclado; **acta de tono S1–S12 firmada**; revisión legal de `/privacidad`
- commits por área con autoría humana (constitución 20)

## Desviaciones respecto al plan
- Sin revisión por tarea con subagente (plazo): la revisión adversarial se hace una vez sobre el diff completo en `review`.
- `server-only` añadido como dependencia (el plan solo preveía `lucide-react`).
