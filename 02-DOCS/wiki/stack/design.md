---
type: article
title: Decisiones de diseño del sitio
description: Cómo el design system de Nexus Consulting se aplica en 03-APP — tokens, tipografía, botón primario sólido por AA, movimiento reducible, firma visual.
tags: [stack, design, tokens, accesibilidad]
timestamp: 2026-09-02T17:20:00Z
topic: stack
status: stable
sources: ["[Marca Nexus Consulting](../firma/Marca%20Nexus%20Consulting.md)", "Design system (skill `nexus-consulting-design`)", "[Plan — Sitio web](../sdd/plans/sitio-nexus-consulting.md)"]
---

# Decisiones de diseño del sitio

## Una sola fuente de estilo
`03-APP/src/app/tokens.css` es una copia verbatim de `tokens/*.css` del design system (150 custom properties). Ningún hex, radio, sombra ni curva se escribe a mano fuera de él (constitución 31; `src/design/brand.test.ts` lo vigila). Para Satori (imagen OG) `src/design/tokens.ts` **lee** el CSS en tiempo de ejecución.

## Tipografía
Sora (display), Inter (cuerpo), IBM Plex Mono (cifras) por `next/font/google`, autoalojadas: sin CLS ni petición externa. Escala: H1 `clamp(2.6rem, 7vw, 4.75rem)` con tracking −0,025em; cuerpo 16 px / 1,7; eyebrows 12 px con tracking 0,28em en cian.

## El botón primario es sólido, no degradado
Medido sobre los tokens: blanco sobre cian eléctrico da **1,66:1** y falla AA. El kit del DS pone el degradado bajo texto blanco; aquí el CTA primario es **azul Nexus sólido (#145CFF, 4,93:1)** con el glow azul del DS. El degradado vive donde no lleva texto pequeño encima: la palabra «conecta.» del titular (display ≥ 30 px), la barra de progreso, las líneas y el anillo de foco (`src/design/contrast.test.ts`).

## Firma visual
El **raíl conectado**: en el método, cada fase es un nodo cian sobre una línea que se apaga hacia la derecha; en el hero, el canvas de nodos (`NodeField`) dibuja la red. Un solo motivo, repetido con moderación («si todo brilla, nada destaca»).

## Ritmo
Las secciones alternan `base / sunken / raised` con hairlines; padding `clamp(64px, 10vw, 128px)`; una idea por sección; contenedor 1120 px.

## Movimiento
Solo `transform`, `opacity`, `filter`, color y borde. Toda animación bajo `prefers-reduced-motion: no-preference`; reveal por `animation-timeline: view()` con `@supports` y estado final visible por defecto; el canvas no arranca con movimiento reducido y se pausa fuera de pantalla (`src/design/motion.test.ts`).
