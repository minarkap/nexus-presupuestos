---
type: progress
title: Progreso — Pregunta de frenos del lead
description: Ledger de la fase implement de la spec pregunta-frenos-lead, ejecutada en autopiloto el 2026-09-14.
tags: [sdd, progress, implement]
timestamp: 2026-09-14T11:10:00Z
topic: sdd
slug: pregunta-frenos-lead
status: complete
---

# Progreso — `pregunta-frenos-lead`

> Spec: [pregunta-frenos-lead](../specs/pregunta-frenos-lead.md) · aprobada explícitamente el
> 2026-09-14; las fases posteriores corrieron en **autopiloto** a petición del usuario
> («Apruébala y publícala en autopilot»).

## Decisión de diseño que sostiene el criterio central

La spec exige que el dato **no puntúe** (CA-4). En lugar de confiarlo a la disciplina, se ha puesto el
campo fuera del alcance del motor:

- `blockers` vive en **`Answers`**, el objeto que se envía, y en `LeadRecord`.
- **No** vive en `BusinessAnswers`, que es exactamente el tipo que recibe `scoreLead()`.

El motor de puntuación, por tanto, no puede leer los frenos aunque alguien lo intentara: no están en su
tipo de entrada. El criterio deja de ser una promesa y pasa a ser una propiedad del código.

## Bloques

### Bloque 1 — núcleo (tipos, opciones, validación, aviso interno)
- status: complete
- `types.ts`: tipo `Blocker` (cuatro valores) y el campo en `Answers` y `LeadRecord`.
- `options.ts`: `BLOCKER_OPTIONS` y `BLOCKER_LABEL`. Sin las dos opciones del encargo original que
  solapaban con las preguntas 6 y 7.
- `submit.ts`: `validateBlockers()` — exige lista, miembros de la lista cerrada, sin duplicados, y el
  campo presente aunque vacío. `buildInternalNotice()` gana la línea «Frenos declarados».
- `registry.ts`: columna nueva en la fila de la hoja de respaldo.
- pruebas: `validation.test.ts` (7 nuevas), `submit.test.ts` (5 nuevas).

### Bloque 2 — la pantalla
- status: complete
- `FormWizard.tsx`: los pasos pasan a ser una unión etiquetada `single | multi`. La pantalla múltiple
  **no auto-avanza** —sería imposible marcar dos— y estrena botón «Continuar».
- El `<fieldset>` es el grupo accesible, con la leyenda como nombre y el texto de ayuda como
  descripción. Se descartó un `role="group"` anidado: duplicaba el grupo que el `fieldset` ya es.
- `ui.css`: clase `.field__hint`.
- pruebas: `form-wizard.test.tsx` (6 nuevas), `a11y.test.tsx` (4 nuevas).

### Bloque 3 — pruebas de recorrido existentes
- status: complete
- Diez pruebas pasaban del presupuesto directamente al contacto. Ahora hay una pantalla en medio: se
  les añade el clic en «Continuar» y los contadores suben de 7→8 y de 8→9.
- Es un cambio legítimo del recorrido, no un parche: las pruebas describían la travesía real.

## Resultado

- **228 pruebas** (206 antes; +22). Cobertura **99,41 %** de líneas en `src/core/`, sobre un suelo de 95.
- `bash scripts/verify.sh` → **VERDE** (lint, tipos, cobertura, compilación y puerta SEO/GEO).

## Desviaciones e incidencias

- **Sin fase `clarify` formal.** La única pregunta abierta de la spec era la redacción final en la voz
  de la marca, que depende del acta de tono sin firmar. Se implementó con el texto del encargo y se
  registró la superficie **S13** en el acta para que una persona la juzgue. La pregunta sigue abierta.
- **Fragilidad descubierta, ajena a este cambio.** `src/content/site.ts` hace
  `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexus.ad')`. Una variable **vacía** no es
  `undefined`, así que no activa el valor por defecto y revienta la compilación con `ERR_INVALID_URL`.
  Salió al compilar con un `.env.local` recién creado con marcadores vacíos. Se resolvió comentando los
  marcadores en lugar de dejarlos vacíos. **No se ha tocado `site.ts`**: es un fallo latente real, pero
  ajeno al alcance de esta spec, y en producción la variable está definida en Vercel. Queda anotado
  como candidato a corregir (`process.env.X || …` en lugar de `??`).

## Pendiente humano

- **Firmar la superficie S13 del acta de tono.** El principio 28 exige revisión humana con acta y un
  agente no puede firmarla. Ojo al matiz: en esta pantalla el lead declara una debilidad propia, así
  que el tono no puede sonar a interrogatorio.
- Recorrido manual a 360 px de la pantalla nueva.
