---
type: verification
title: Verification — Sitio web de Nexus Consulting — 2026-09-02
description: Puerta de evidencia del ciclo sitio-nexus-consulting — verify.sh verde en cinco capas (lint, tipos, 202 pruebas con 99 % de cobertura en core, build de producción, puerta SEO/GEO contra next start). Pendiente la puerta humana T038 (acta de tono, 360 px, revisión legal).
tags: [sdd, verify, evidencia]
timestamp: 2026-09-02T17:35:00Z
topic: sdd
slug: sitio-nexus-consulting
status: stable
---

# Verification — sitio-nexus-consulting — 2026-09-02

## Veredicto: **VERDE con puerta humana pendiente**

`bash scripts/verify.sh` → `═══ VERIFY: VERDE ═══` a las 17:33 (hora local), rama `feat/sitio-nexus-consulting`.

| Capa | Resultado | Evidencia |
|---|---|---|
| Linter (12) | ✓ cero avisos | `npm run lint` |
| Tipos (13) | ✓ 0 errores | `npm run typecheck` (strict + noUncheckedIndexedAccess) |
| Pruebas (14, 15, 17) | ✓ **202/202** (mínimo CA-21: 156) | `npm run test:coverage` |
| Cobertura `src/core/**` (14) | ✓ 99,33 % líneas · 98,9 % ramas · 100 % funciones | umbral 95 |
| Caso de referencia (16) | ✓ 28.000 – 35.000 € | `pricing.test.ts` sin cambios |
| Build de producción | ✓ | `next build` |
| **Puerta SEO/GEO (32, 33)** | ✓ `SEO-GATE: VERDE` | `scripts/seo-gate.sh` contra `next start` en :3100 |

## Criterios de aceptación de la spec

| CA | Estado | Cómo |
|---|---|---|
| CA-01 marca y hex | ✓ | `design/brand.test.ts` + seo-gate |
| CA-02 contraste AA | ✓ | `design/contrast.test.ts` (12 pares texto normal, 2 grande) |
| CA-03 movimiento reducible | ✓ | `design/motion.test.ts`; `NodeField` no arranca con reduce |
| CA-04 tono | ◐ automático ✓ (`content/tone.test.ts`); **acta humana pendiente (T038)** |
| CA-05 emoji/stock | ✓ | `brand.test.ts` |
| CA-06 páginas + H1 único | ✓ (cinco páginas, `S-0020`) | seo-gate |
| CA-07 ≥ 600 palabras en `/` | ✓ | seo-gate |
| CA-08 primera pregunta en `/` → `/presupuesto?reto=` | ✓ | seo-gate + pruebas de recorrido |
| CA-09 rangos = motor | ✓ | `content/content.test.ts` |
| CA-10 FAQ ≥ 6 autocontenidas | ✓ (8) | `content.test.ts` + seo-gate |
| CA-11 artículo | — sin objeto (`S-0020`) | |
| CA-12 privacidad + consentimiento | ✓ | `validation.test.ts`, `a11y.test.tsx`, `content.test.ts` |
| CA-13 404 de marca | ✓ | seo-gate |
| CA-14 360 px | **pendiente humano (T038)** | |
| CA-15 metadatos | ✓ | `seo/seo.test.ts` + seo-gate |
| CA-16 robots | ✓ | ídem |
| CA-17 sitemap (cinco) | ✓ | ídem |
| CA-18 JSON-LD coherente | ✓ | ídem |
| CA-19 jerarquía y alt | ✓ | seo-gate |
| CA-20 llms.txt | ✓ | seo-gate |
| CA-21 sin regresión | ✓ 202 ≥ 156; motores intactos | `git diff main -- 03-APP/src/core/{catalog,pricing,scoring,service-resolver,options}.ts` vacío |
| CA-22 nada interno | ✓ | seo-gate (conjunto cerrado) |
| CA-23 agenda-demo | ✓ 404 | seo-gate |
| CA-24 correos | ✓ | `proposal.test.ts`, `submit.test.ts` |

## Definition of Done (constitución v1.1.0)

Todas las casillas automáticas ✓. Pendientes las humanas: **acta de tono S1–S12 (28, 36)**, recorrido a
360 px, y los **commits con autoría humana (20)**: el árbol está en la rama, sin commitear.

## Lo que `ship` necesita de una persona

1. Firmar el acta en [tone-checklist.md](../tone-checklist.md).
2. Recorrer el sitio a 360 px y con teclado.
3. Revisión legal de `/privacidad` (o aceptar publicarla como borrador marcado).
4. Commits por área y `push` de `feat/sitio-nexus-consulting`.

## Review adversarial (fase `review`) — 2026-09-02

Subagente `refuter-security` con contexto limpio sobre el árbol de `feat/sitio-nexus-consulting`.
**Veredicto: APROBADO, sin hallazgos bloqueantes.** Rastro verificado: `catalog.ts` solo lo importan
módulos de servidor (`services.public.ts` con `server-only`, motores) y `FormWizard` solo importa tipos;
`RedactedOutcome` no contiene puntuación, umbral ni id interno; `searchParams.reto` se valida contra la
lista cerrada y nunca se refleja; JSON-LD escapa `<`; la imagen OG lee una ruta fija; el consentimiento
se exige en cliente y en servidor; `NodeField` libera RAF, observer y listener; ningún secreto en `src`
ni en el árbol.

## Añadido posterior — `/antes` (S-0021)

Página-museo con el estimador original, a petición del usuario para la comparación en clase. `verify.sh`
re-ejecutado tras añadirla: **VERDE** (202 pruebas, cobertura 99 %, `seo-gate` verde). No entra en el
sitemap, responde con `noindex, nofollow`, y no modifica ninguna de las cinco páginas del sitio. Único
fichero existente tocado: `src/design/brand.test.ts`, para excluir el snapshot de la comprobación de
marca y de hex, con el motivo escrito en el propio test.
