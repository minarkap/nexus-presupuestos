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
| Pruebas | ✓ **230** (206 antes del cambio) |
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

## Review adversarial (fase `review`) — 2026-09-14

Subagente `refuter-correctness` con contexto limpio sobre el árbol sin commitear, con mandato de
refutar. No se limitó a leer: reejecutó pruebas, tipos y linter por su cuenta, y probó los casos
límite de la validación ejecutándolos en Node en lugar de razonarlos.

**Veredicto: sin hallazgos bloqueantes.** Dos hallazgos reales de severidad baja, **ambos corregidos
antes de publicar**:

### R-1 · Arrays dispersos atravesaban el guardián (corregido)

`validateBlockers` recorría el array con `.some()`, que **salta los huecos** de un array disperso,
y comprobaba duplicados con `new Set()`, que **no los salta** y los materializa como `undefined`.
Un `[, 'sin_perfiles']` pasaba las tres comprobaciones y llegaba al aviso interno como
`« · No tenemos perfiles técnicos»`: un separador huérfano, cuando CA-5 promete rechazo.

- **Por qué no era explotable en la práctica:** la única puerta de entrada es la acción de servidor,
  y cualquier serialización JSON convierte el hueco en `null`, que el guardián ya rechazaba.
- **Arreglo:** materializar el array con `Array.from()` antes de recorrerlo, de modo que las dos
  comprobaciones vean exactamente los mismos elementos.
- **Prueba de regresión** con la mutación comprobada en los dos sentidos: con el arreglo revertido la
  prueba **falla**; con él, pasa. Un guardián que nunca se ha visto fallar no se sabe si guarda.

### R-2 · La prueba de CA-5 cubría media promesa (corregido)

CA-5 dice «se rechaza **y no produce ni cifra ni aviso**». La prueba etiquetada CA-5 sólo comprobaba
la primera mitad —que `validateAnswers` devuelve el error— y no atravesaba `submitLead`, pese a que
el mismo fichero ya usaba ese patrón completo para el campo `size`. El comportamiento era correcto
por construcción; lo que faltaba era la evidencia.

- **Arreglo:** la prueba pasa ahora por `submitLead` y exige `email.sent` y `registry.rows` vacíos.

### Lo que el revisor comprobó y declaró sano

- **El criterio central se sostiene.** `scoreLead` sólo lee `sponsor`, `budget`, `timing`, `maturity`
  y `size`; `priceService`, `mapOutcome`, `resolveService` y `composeProposal` ni siquiera aceptan el
  objeto completo. Los frenos no pueden alcanzar la cifra ni la puntuación, por tipos y por runtime.
- **Sin vía de inyección.** Ningún string controlado por quien llama llega al correo ni a la hoja: todo
  pasa por el mapa cerrado de etiquetas.
- **Navegación consistente.** La pantalla nueva es siempre la última del recorrido, así que la rama
  condicional de la pregunta 2 no puede desplazarla; «Continuar» aterriza exactamente en el contacto.
- **El estado marcado ya tenía estilo persistente** (`.choice[aria-pressed='true']`), no dependía de un
  CSS que hubiera que inventar.
- CA-1, CA-2, CA-3, CA-4, CA-6 y CA-7 ejercitan de verdad lo que sus nombres dicen ejercitar.

## Puerta re-ejecutada tras los arreglos

`bash scripts/verify.sh` → **VERDE**. **230 pruebas**, cobertura 99,41 % de líneas en `src/core/`.
