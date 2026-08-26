---
type: article
title: Método de Estimación Económica
description: Los cuatro pasos que convierten las respuestas de un lead en un rango orientativo, con sus multiplicadores y sus reglas innegociables.
tags: [estimacion, calculo, multiplicadores, interno]
timestamp: 2026-08-26T10:39:25Z
aliases: [metodo-de-estimacion-economica]
topic: comercial
status: stable
sources: ["[Criterios de estimación económica](../../raw/comercial/2026-08-26-criterios-estimacion-economica.md)"]
score: 12.0
---

# Método de Estimación Económica

> Sources: Nexus Strategy & Technology, edición 2026 (documento interno)
> Raw: [Criterios de estimación económica](../../raw/comercial/2026-08-26-criterios-estimacion-economica.md)

## Overview

Cuatro pasos deterministas convierten tres respuestas del cliente en un rango en euros. El resultado
es **siempre un rango orientativo**, nunca un precio cerrado. El método es completamente calculable
—no hay juicio humano en el camino— lo que lo hace implementable, y por eso mismo hay que protegerlo:
los multiplicadores son información interna.

## Los cuatro pasos

**Paso 1 — Punto de partida.** El punto medio del rango oficial del servicio aplicable. En servicios
de rango abierto (*desde X*), el punto de partida es el propio mínimo.

**Paso 2 — Factores de ajuste.** Acumulativos sobre el punto de partida. Cada respuesta activa **como
mucho un factor de cada bloque**.

| Factor | Situación | Ajuste |
|--------|-----------|--------|
| Tamaño | < 50 empleados | × 0,80 |
| | 50 – 250 | × 0,90 |
| | 250 – 1.000 | × 1,05 |
| | > 1.000 | × 1,25 |
| Madurez en datos e IA | Inicial — sin datos gobernados | × 1,15 |
| | En desarrollo — pilotos en marcha | × 1,00 |
| | Avanzada — casos en producción | × 0,90 |
| Plazo de arranque | > 6 meses | × 0,95 |
| | 3 – 6 meses | × 1,00 |
| | < 3 meses — prima de urgencia | × 1,15 |

La madurez inicial **encarece**, y el documento se molesta en justificarlo: obliga a construir base de
datos y gobierno antes de poder entregar valor. No es recargo comercial, es trabajo real.

**Paso 3 — Anclaje al rango oficial.** Si la cifra ajustada sale del rango oficial, se corrige al
límite más cercano. Ninguna combinación de factores puede sacar una estimación de su rango.

**Paso 4 — Construcción del rango entregado.** Margen de **± 12 %** sobre la cifra ajustada, ambos
extremos redondeados al millar más cercano, y el rango resultante **vuelve a anclarse** dentro del
rango oficial. En rango abierto, el extremo superior no se publica: «a confirmar en llamada de alcance».

Nótese que el anclaje se aplica **dos veces**: al paso 2 y otra vez al rango final. Es fácil
implementar sólo el primero y publicar una cifra fuera de catálogo.

## Ejemplo trabajado

Empresa de 600 empleados, madurez inicial, arranque en 4 meses, pide diagnóstico de IA.

1. Servicio: AI Opportunity Assessment (18.000 – 35.000 €). Punto de partida: **26.500 €**.
2. Ajustes: × 1,05 (tamaño) × 1,15 (madurez) × 1,00 (plazo) = **32.000 €**.
3. Dentro de rango, no se corrige.
4. ± 12 % → 28.000 – 36.000 €; anclado al techo oficial → **28.000 – 35.000 €**.

Este caso es un buen test de regresión: ejercita el redondeo y el segundo anclaje a la vez.

## Reglas innegociables

- Nunca un precio cerrado por escrito. El precio final se concreta en llamada.
- **Nunca un descuento.** No forma parte de la conversación comercial de la firma.
- Nunca estimar un servicio fuera del catálogo. Si no está, se deriva a llamada.
- Nunca prometer plazos de entrega concretos en una estimación automática.
- Toda estimación va acompañada de la advertencia de que es orientativa y sujeta a alcance.

## Consecuencia de arquitectura

Los multiplicadores son **internos**. Si el cálculo se ejecuta en el navegador del visitante,
cualquiera puede leer con qué factor se penaliza su tamaño o su urgencia. **El cálculo va en
servidor**, y los rangos y factores en configuración con fecha de caducidad, no dispersos por el
código.

## Related

- [Catálogo de Servicios y Rangos 2026](./Catalogo%20de%20Servicios%20y%20Rangos%202026.md) — los rangos que este método consume y a los que ancla.
- [Cualificación de Oportunidades](./Cualificacion%20de%20Oportunidades.md) — el cálculo paralelo que decide qué se le ofrece al lead.
- [Landing de Captación de Leads](../producto/Landing%20de%20Captacion%20de%20Leads.md) — dónde se implementa esto.
