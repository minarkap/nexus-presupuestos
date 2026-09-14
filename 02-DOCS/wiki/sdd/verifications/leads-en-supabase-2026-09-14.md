---
type: verification
title: Verificación y revisión adversarial — leads-en-supabase
description: Evidencia de verify.sh y resultado de la revisión adversarial de seguridad del cambio de registro a Supabase.
tags: [sdd, verify, review, seguridad, supabase]
timestamp: 2026-09-14T10:50:00Z
topic: sdd
slug: leads-en-supabase
status: complete
---

# Verificación — leads-en-supabase · 2026-09-14

> Rama `feat/leads-en-supabase` · Spec: [../specs/leads-en-supabase.md](../specs/leads-en-supabase.md)

## Puerta de evidencia

`bash scripts/verify.sh` → **VERDE** en los seis pasos:

| Paso | Resultado |
|---|---|
| Linter (cero avisos) | ✓ |
| Comprobador de tipos | ✓ |
| Pruebas + cobertura ≥95 % en `src/core` | ✓ — **266 pruebas, 24 ficheros** |
| Compilación de producción | ✓ |
| Puerta SEO/GEO | ✓ |
| **Puerta de secretos** | ✓ — 17 ficheros de cliente inspeccionados |

## Criterios de aceptación

| CA | Comprobado con |
|---|---|
| CA-S1 · el lead queda registrado entero | `supabase-registry.test.ts` — mapeo de las 18 columnas |
| CA-S2 · registro operativo → sin aviso | `submit.test.ts` — «cuando el guardado funciona, el correo interno NO gana ningún aviso» |
| CA-S3 · fallo → aviso explícito y arriba | `submit.test.ts` — dos pruebas: contenido y posición (< línea 3) |
| CA-S4 · envío repetido no duplica fila | `Prefer: resolution=ignore-duplicates` + `submission_id unique`; conflicto tratado como éxito |
| CA-S5 · nada llega al navegador | `registry-security.test.ts` + `secret-gate.mjs` sobre el paquete compilado |
| CA-S6 · producción sin credencial falla ruidosamente | `supabase-registry.test.ts` — F-1 intacto |
| CA-S7 · el visitante no percibe el fallo | `submit.test.ts` — resultado idéntico con y sin fallo de registro |

## Revisión adversarial de seguridad

Lente de seguridad y privacidad, contexto limpio, mandato de **refutar** que la base de datos esté
cerrada. Encargo literal de Jose: «que no quede expuesta la BBDD a fuera».

### Lo que resistió

No encontró **ninguna vía** por la que la clave `service_role` o el contenido de la tabla lleguen al
navegador. Verificado punto por punto: `server-only` corta la cadena de importación; el único
importador en runtime es la acción de servidor; los demás son `import type`, que se borran al
compilar; `RedactedOutcome` no contiene ningún campo del registro; el mensaje de error del adaptador
no incluye ni la clave ni el cuerpo de la respuesta; `attempt()` se traga el error y sólo deja pasar
`'ok'|'failed'`.

También descartó inyección por el nombre de tabla (sólo puede venir de una variable de servidor) y
por los valores del lead (van como JSON contra PostgREST, sin concatenar SQL), y confirmó que el
identificador de envío no da ninguna capacidad: con `ignore-duplicates` un conflicto **descarta** el
insert, nunca sustituye una fila ajena.

### Lo que encontró, y qué se hizo

| Hallazgo | Gravedad | Acción |
|---|---|---|
| La acción pública ahora escribe filas reales sin tope de tamaño en los campos libres | MEDIO | **Corregido**: topes en nombre (120), correo (254, el de la norma), organización (160) e identificador de envío (100), con 6 pruebas nuevas. Antes del cambio un campo enorme sólo engordaba un correo; ahora inserta una fila |
| Sin límite de frecuencia: un atacante puede inundar la tabla | MEDIO | **NO corregido a propósito** — ver abajo |
| `secret-gate.mjs` se saltaba su comprobación principal en silencio: `next build` carga `.env.local` en su propio proceso y no lo exporta, así que la búsqueda por VALOR no se hacía en local | MEDIO | **Corregido**: la puerta carga los ficheros de entorno ella misma y **declara en voz alta qué variables ha buscado y cuáles no ha podido**. Una puerta que no dice lo que no ha comprobado miente por omisión |
| `secret-gate.mjs` no miraba los mapas de fuente (`.map`) | BAJO | **Corregido**: extensión añadida. Hoy están desactivados; si alguien los activa mañana, la puerta ya mira ahí |
| `schema.sql` confiaba en «pégalo entero» para que la tabla no quedara creada y abierta | BAJO | **Corregido**: todo dentro de `begin; … commit;`. O se crea cerrada, o no se crea |
| Retención de 12 meses prometida y no implementada | Nota | Ya declarado como decisión diferida en la spec |

### Lo que se deja abierto, y por qué

**El límite de frecuencia no se ha implementado.** No es una omisión: es una función nueva —elegir
entre límite por IP, prueba anti-bot o cuota en el borde, con su almacenamiento y sus falsos
positivos sobre leads legítimos— y merece su propia spec, no un añadido silencioso al final de otro
ciclo. Los topes de tamaño ya reducen el daño por petición; lo que queda es el número de peticiones.

Queda como **riesgo abierto y escrito**, no como algo resuelto.
