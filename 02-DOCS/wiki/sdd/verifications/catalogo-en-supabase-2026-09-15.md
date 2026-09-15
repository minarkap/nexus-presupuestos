---
type: verification
title: Verification — El catálogo comercial en la base de datos — 2026-09-15 (cierre)
description: Las siete puertas en verde contra la base real, y la prueba que faltaba — cambiar un precio en la base y ver el formulario de producción usarlo sin publicar nada.
tags: [sdd, verify, catalogo, evidencia, produccion]
timestamp: 2026-09-15T15:20:00Z
topic: sdd
slug: catalogo-en-supabase
status: cerrado — VERDE
---

# Verification — El catálogo comercial en la base de datos (cierre)

> Fecha: 2026-09-15 · Rama: `main` · Spec: [catalogo-en-supabase](../specs/catalogo-en-supabase.md)
> Veredicto: **VERDE. Las siete puertas, y la prueba contra producción hecha.**
> Sustituye al [acta del 2026-09-14](./catalogo-en-supabase-2026-09-14.md), que quedó roja a
> propósito porque la base de datos aún no existía.

## La puerta completa

```
──▶ Linter (constitution 12: cero avisos)                        ✓ ok
──▶ Comprobador de tipos (constitution 13)                       ✓ ok
──▶ Pruebas + cobertura ≥95% en src/core (14, 15)                ✓ ok
──▶ Compilación de producción                                    ✓ ok
──▶ Puerta SEO/GEO (constitution 32-33)                          ✓ ok
──▶ Puerta de secretos (constitution 8, 21 · CA-S5)              ✓ ok
──▶ Puerta del catálogo vivo (constitution 15, 16 · CA-15/16/19) ✓ ok
═══ VERIFY: VERDE ═══
```

La séptima —la que llevaba desde el día 14 en rojo— ahora comprueba **contra la base de datos real**:
caso de referencia **28.000 – 35.000 €**, **504 combinaciones** sin ninguna fuera de rango, catálogo
vivo con caducidad declarada 2026-12-31. No estaba rota: estaba haciendo su trabajo, que era negarse
a dar luz verde sin haber mirado.

## T19 — la prueba que demuestra que todo esto sirve para algo

Es la única que no se puede hacer con dobles ni en local, porque lo que afirma es sobre **el sitio
publicado**: que un precio se cambia en la base de datos y la siguiente persona que rellena el
formulario ya recibe el precio nuevo, **sin publicar ninguna versión del sitio y sin ninguna espera**
(CA-02).

Ejecutada contra `https://presupuestos.barcovalencia.com`, con el caso de referencia del principio 16
(600 empleados · madurez inicial · arranque 3-6 meses · diagnóstico de IA · patrocinador · presupuesto
asignado):

| Paso | Qué se hizo | Qué devolvió el formulario **real** |
|---|---|---|
| 0 | Sonda sin consentimiento | `validation_error / consent` — rechazado antes de guardar ni enviar nada |
| 1 | `official_min` de *AI Opportunity Assessment*: **18.000 → 21.000** en la base | **30.000 – 35.000 €** |
| 2 | Restaurado a **18.000** | **28.000 – 35.000 €** |

**Cero despliegues entre el paso 1 y el paso 2.** El sitio publicado es bit a bit el mismo en los dos
envíos: lo único que cambió fue una celda de una tabla.

### La evidencia se guardó sola

No hace falta creerse el párrafo de arriba: los dos envíos son leads reales y están en la tabla, con
diez segundos de diferencia, las mismas respuestas y cifras distintas.

```
t19-cambiado-1789485097    AI Opportunity Assessment   30.000 – 35.000 €   15:11:38Z
t19-restaurado-1789485108  AI Opportunity Assessment   28.000 – 35.000 €   15:11:48Z
```

Las dos filas llevan `contact_company = 'Executive Lab (prueba T19)'` para que se distingan de un lead
de verdad. Son datos de prueba en la tabla de producción: conviene borrarlos cuando el registro
empiece a recibir leads reales.

### Cómo se envió, y por qué importa decirlo

No hay navegador automatizado en este proyecto. El formulario se envió invocando la **acción de
servidor real** por HTTP contra la ruta `/presupuesto`, con el identificador de acción leído del
propio paquete JavaScript que sirve producción. Es el mismo camino que recorre el navegador de un
visitante —misma acción, mismo servidor, mismo catálogo, mismo correo— sin la capa de clics. Lo que
**no** cubre esta prueba es el recorrido visual del asistente de pasos; eso lo cubren las pruebas de
componente.

## Lo que sigue sin probarse, dicho claro

- **El repliegue real ante una caída real de Supabase.** Sigue probado sólo con dobles. La puesta en
  marcha del registro de leads ya enseñó que los dobles no enseñan todo (`S-0026`).
- **El borrado a los doce meses, visto ocurrir.** Las dos tareas programadas están activas en la base
  (`nexus-retencion-leads` a las 03:17, `nexus-limpieza-intentos` cada hora), pero ninguna se ha visto
  borrar una fila de verdad: el lead más antiguo es de ayer.

## Estado de los criterios de aceptación

Los diecinueve, verificados. Los ocho que el día 14 estaban «a medias esperando la base» —CA-01 contra
vivo, CA-02, CA-03, CA-04, CA-05, CA-12, CA-16 contra vivo, CA-18— se cierran con la base sembrada, la
puerta del catálogo en verde y la prueba de extremo a extremo de arriba.

CA-14 —«el sitio publicado nunca escribe precios»— se cumple por una vía distinta de la planeada y
mejor que ella: no por el tipo de llave, sino porque `service_role` no tiene permiso sobre las cuatro
tablas del catálogo. Evidencia contra la base real y razonamiento en [`S-0037`](../decisions.md).
