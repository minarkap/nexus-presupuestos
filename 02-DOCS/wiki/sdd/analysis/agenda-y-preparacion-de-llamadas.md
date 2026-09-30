---
type: analysis
title: Analyze — Agenda y preparación de la llamada
description: Lectura cruzada constitución ↔ spec ↔ plan ↔ tareas antes de escribir código. Sin contradicciones; una nota de cobertura.
tags: [sdd, analyze]
timestamp: 2026-09-30T11:00:00Z
topic: sdd
slug: agenda-y-preparacion-de-llamadas
status: complete
---

# Analyze — Agenda y preparación de la llamada

> Spec, plan y tareas: `agenda-y-preparacion-de-llamadas` (aprobados el 2026-09-30, autopilot).
> Veredicto: **sin bloqueos. Se puede implementar.**

## Cobertura de los criterios de aceptación

| Criterio | Dónde se cumple | Estado |
|---|---|---|
| CA-01…CA-05 | T002–T005 | con tarea |
| CA-06…CA-09 | T011–T013 | con tarea |
| CA-10 | prueba existente `outcome.test.ts` (claves exactas de `RedactedOutcome`) | **sin tarea propia**. Ninguna tarea añade campos a lo que cruza al navegador, y la prueba existente falla si alguien lo hace |
| CA-11 | T005 y T008 (prueba con umbral cambiado) | con tarea |
| CA-12 | T006 (filas de acta) | la firma es de Jose (B9) |
| CA-13 | B1 y B10 | bloqueado, e2e manual |
| CA-14…CA-23 | diseño en T017, T019 y T020 | la construcción está bloqueada (B3–B8) |
| CA-24, CA-25 | T016; T008–T009 | con tarea |
| CA-26 | diseño en T019 | la construcción está bloqueada (B3, B4) |

## Constitución

- **Principio 9:** la regla de reserva sale de `showCalendar` (T005) y no se duplica en n8n (§0).
- **Principio 20:** los commits llevan la autoría del usuario de git configurado (humano) y no llevan
  `Co-Authored-By`. Esta regla del proyecto prevalece sobre cualquier plantilla de atribución.
- **Principios 21 y 23:** T015 y T016 van antes de publicar; la fase B no se activa sin B8.

## Desviaciones de proceso declaradas

- **La revisión por tarea se agrupa por PR** (una revisión en frío por bloque) en lugar de una por
  tarea. Motivo: las tareas del PR 1 son cinco cambios pequeños sobre los mismos tres ficheros.
- **El registro de skills** (`.rsc/skill-registry.json`) no existe. Las skills se eligen a mano,
  como en los ciclos anteriores.
