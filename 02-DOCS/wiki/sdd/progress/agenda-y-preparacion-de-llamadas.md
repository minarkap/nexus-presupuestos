---
type: progress
title: Progress — agenda-y-preparacion-de-llamadas
description: Ledger append-only de la ejecución de las tareas T001–T021. Fuente de verdad para reanudar tras compactación.
tags: [sdd, implement, progress, append-only]
timestamp: 2026-09-30T11:30:00Z
topic: sdd
slug: agenda-y-preparacion-de-llamadas
status: active
---

# Progress — agenda-y-preparacion-de-llamadas

> **Append-only.** Una tarea marcada `complete` está HECHA: no se vuelve a despachar.
> Autopilot aprobado por Jose el 2026-09-30. Skills usadas: `implement`, `nextjs` (a mano; no hay
> `.rsc/skill-registry.json`), `debug` para el fallo de las fuentes.

## T001 — 2026-09-30 · Ramas
- status: complete
- ramas, apiladas: `fix/fuentes-en-el-repositorio` (desde `main`) ← `fix/correo-sin-cita-confirmada` ←
  `feat/agenda-y-preparacion-de-llamadas`
- desviación: se añadió la rama de las fuentes, que no estaba en el plan (ver la entrada «fuera de plan»)

## Fuera de plan — 2026-09-30 · La compilación dependía de Google Fonts (S-0042)
- status: complete
- síntoma: `next build` (Turbopack) falla con Sora, «next/font/google queries have exactly one
  entry». Se reproduce con el código de `main` y sin la caché `.next`; con `--webpack` compila
- causa: defecto conocido de Turbopack con las respuestas de Google Fonts que llevan `&` en la URL
  del fichero
- arreglo: `next/font/local` con los mismos WOFF2 (latin) y su licencia OFL. `verify.sh` VERDE solo
  con este cambio
- commit: `52ff6e5` en `fix/fuentes-en-el-repositorio`

## T002 — 2026-09-30 · Pruebas del correo con oferta de reserva
- status: complete
- red: 6 fallos por aserción en `proposal.test.ts`, entre ellos CA-05 cazando «cita confirmada»
- nota: la prueba «el cualificado ve confirmada su cita» **protegía el fallo**; la sustituye su
  contraria (CA-05 de la spec aprobada)

## T003 — 2026-09-30 · `composeProposal(…, booking)`
- status: complete
- green: `proposal.test.ts` 17/17
- decisión: `BookingOffer = { url: string | null } | null`. La rama sin catalogar que no supera el
  umbral gana «responde a este correo y buscamos un hueco»: antes se le proponía una llamada sin
  ningún camino para tenerla

## T004 — 2026-09-30 · Pantalla del cualificado
- status: complete
- red: la prueba con el texto REAL del núcleo encontró «Puedes reservar ahora mismo» encima de un
  calendario inexistente
- green: `result-screen`, `outcome` y `golden` 27/27. El fichero dorado no se mueve (no guarda textos)

## T005 — 2026-09-30 · `bookingUrl` en `SubmitDeps` y en la acción
- status: complete
- red: 42 fallos por `TypeError` (el envío aún no pasaba la oferta) y las 6 pruebas nuevas por aserción
- green: `submit.test.ts` 58/58; `tsc` 0 tras añadir `bookingUrl: null` a las dependencias de
  `validation.test.ts`
- regla: `booking = outcome.showCalendar ? { url: deps.bookingUrl } : null`. CA-11 probado con el
  umbral a 10

## T006 — 2026-09-30 · Tono
- status: complete
- red: la prueba nueva cazó la frase antigua citada en un comentario de `proposal.ts`, y la versión de
  `main` también cae (`git show main:…` contiene «Tienes tu cita confirmada»)
- green: `tone.test.ts` 34/34
- acta: S9, S10 y la nueva S15 añadidas a `tone-checklist.md` **sin firmar** (B9, es de Jose)

## T007 — 2026-09-30 · Puerta del PR 1
- status: complete
- `SEO_GATE_PORT=3199 bash scripts/verify.sh` → **VERDE**, 397 pruebas, cobertura de core 96,22 %
- nota: el puerto 3100 lo ocupa un servidor de otro proyecto. No se ha tocado; se usa otro puerto

## Revisión en frío del PR 1 — 2026-09-30
- revisor: subagente `refuter-correctness`, sin contexto de la sesión
- veredicto: aprobado, con 1 hallazgo **Important** y 1 **Minor**
- Important (corregido): pantalla y correo leían `NEXT_PUBLIC_CALENDAR_URL` cada uno a su manera. Con
  un espacio en el panel, el correo decía «te escribimos» y la pantalla incrustaba un calendario roto
  → `src/app/booking-url.ts` es el único criterio, y lo usan los dos. Prueba: roja por aserción
  (4/5) y luego verde. La prueba estática exige que ninguno lea la variable a pelo
- Minor (pendiente, anotado): `BookingOffer.url` admite `''` a nivel de tipo; hoy el único
  constructor ya normaliza
- `verify.sh` → VERDE, 402 pruebas
