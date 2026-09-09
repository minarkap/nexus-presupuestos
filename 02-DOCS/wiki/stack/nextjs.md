---
type: article
title: Convenciones Next.js del sitio
description: Cómo está montada 03-APP sobre Next 16 App Router — Server Components por defecto, un island, metadatos y datos estructurados derivados del contenido, rutas de máquina.
tags: [stack, nextjs, seo]
timestamp: 2026-09-02T17:20:00Z
topic: stack
status: stable
sources: ["[Plan — Sitio web](../sdd/plans/sitio-nexus-consulting.md)", "docs locales en `03-APP/node_modules/next/dist/docs/`"]
---

# Convenciones Next.js del sitio

- **Next 16.3.3, App Router, sin `use cache`**: todo estático salvo `/presupuesto`, que lee `searchParams` (Promise, se `await`ea).
- **Server Components por defecto.** El único island con estado es `src/components/Estimator.tsx` (+ `FormWizard`, `ResultScreen`); `NodeField` es un canvas decorativo cliente. La navegación móvil es `<details>`: cero JS.
- **El copy es contenido tipado** en `src/content/*`; la capa SEO (`src/seo/metadata.ts`, `jsonld.ts`) se construye con los mismos objetos que pintan las páginas. `PAGES` es la fuente única de rutas para metadatos, `sitemap.ts`, `llms.txt` y migas.
- **`services.public.ts` lleva `import 'server-only'`**: es lo que impide que `catalog.ts` (multiplicadores, puntos, umbral) llegue al navegador (constitución 8). Expone solo campos publicables y usa `core/format.ts` para el rango.
- **Rutas de máquina**: `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts` (`force-static`), `app/opengraph-image.tsx` (`ImageResponse`, 1200×630, colores leídos de `tokens.css`).
- **Metadatos**: `metadataBase` en el layout desde `NEXT_PUBLIC_SITE_URL` (default `https://nexus.ad`); título con plantilla `%s · Nexus Consulting`; `pageMetadata()` lanza en build si un título supera 60 o una descripción 160.
- **Puerta de indexabilidad**: `scripts/seo-gate.sh` compila, arranca `next start` en el puerto 3100 y ejecuta `scripts/seo-gate.mjs`; forma parte de `scripts/verify.sh`.
- **Variables**: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CALENDAR_URL`, `NEXUS_INTERNAL_MAILBOX` (default `oportunidades@nexus.ad`), más las de `01-TOOLS/RESEND` y `01-TOOLS/GOOGLE`.
