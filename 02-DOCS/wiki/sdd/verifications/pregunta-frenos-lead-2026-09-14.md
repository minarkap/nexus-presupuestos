---
type: verification
title: Verificación — Pregunta de frenos del lead (2026-09-14)
description: Veredicto de la fase verify sobre la spec pregunta-frenos-lead: puerta automática, recorrido de los ocho criterios de aceptación y lo que queda en manos de una persona.
tags: [sdd, verify]
timestamp: 2026-09-14T11:15:00Z
topic: sdd
slug: pregunta-frenos-lead
status: verde
---

# Verificación — `pregunta-frenos-lead`

> Fecha: 2026-09-14 · Spec: [pregunta-frenos-lead](../specs/pregunta-frenos-lead.md) ·
> Progreso: [ledger](../progress/pregunta-frenos-lead.md)

## Puerta automática

`bash scripts/verify.sh` → **VERDE**

| Tramo | Resultado |
|---|---|
| Linter (cero avisos, principio 12) | ✓ |
| Tipos (`tsc --noEmit`, estricto) | ✓ |
| Pruebas | ✓ **228** (206 antes del cambio) |
| Cobertura en `src/core/` (suelo 95 %) | ✓ **99,41 %** líneas, 99 % ramas |
| Compilación de producción | ✓ |
| Puerta SEO/GEO | ✓ |

## Los criterios de aceptación, uno a uno

| Criterio | Estado | Evidencia |
|---|---|---|
| CA-1 · saltable sin error | ✓ | `validation.test.ts` «acepta la lista vacía»; `form-wizard.test.tsx` «se continúa sin marcar nada» |
| CA-2 · el aviso nombra los marcados y ningún otro | ✓ | `submit.test.ts` — comprueba presencia **y** ausencia |
| CA-3 · sin frenos lo dice expresamente | ✓ | `submit.test.ts` «Frenos declarados: ninguno» |
| CA-4 · misma cifra y misma puntuación | ✓ | `submit.test.ts`; y sostenido por el tipo: `scoreLead` recibe `BusinessAnswers`, donde `blockers` no existe |
| CA-5 · se rechaza un freno fuera de lista | ✓ | `validation.test.ts` — inventado, no-lista, ausente y duplicado |
| CA-6 · el lead no ve sus frenos | ✓ | `submit.test.ts` sobre el cuerpo del correo al lead |
| CA-7 · teclado y foco | ✓ | `a11y.test.tsx` — marcar y desmarcar con Enter y espacio, foco, grupo descrito |
| CA-8 · consta en el acta de tono | ✓ | superficie **S13** añadida a [tone-checklist](../tone-checklist.md) |

## Definition of Done (constitución v1.1.0)

Todas las casillas automáticas ✓. Pendientes las humanas, que ningún agente puede cubrir:

1. **Firmar la superficie S13 del acta de tono** (principios 28 y 36). El acta sigue sin firmar en su
   conjunto desde el ciclo anterior; esta spec añade una fila más, no arregla esa deuda.
2. **Recorrido manual a 360 px** de la pantalla nueva.

## Nota sobre el alcance

No se ha tocado nada de los dos motores —rango y puntuación—, ni el catálogo, ni ninguna de las siete
preguntas anteriores. El `git diff` sobre `src/core/{catalog,pricing,scoring,service-resolver}.ts` es
vacío. Lo único que cambia en `options.ts` es la adición de la lista nueva.

## Review adversarial (fase `review`)

Pendiente de anexar al cierre de la fase.
