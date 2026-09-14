---
type: verification
title: Verification — El catálogo comercial en la base de datos — 2026-09-14
description: Seis de siete puertas verdes. La séptima está roja porque no existe todavía la llave de lectura del catálogo, que es exactamente lo que CA-15 exige que pase.
tags: [sdd, verify, catalogo, evidencia]
timestamp: 2026-09-14T20:40:00Z
topic: sdd
slug: catalogo-en-supabase
status: parcial — bloqueada en pasos que requieren a Jose
---

# Verification — El catálogo comercial en la base de datos

> Fecha: 2026-09-14 · Rama: `feat/catalogo-en-supabase` · Spec: [catalogo-en-supabase](../specs/catalogo-en-supabase.md)
> Veredicto: **VERDE en todo lo que no necesita la base de datos. ROJO, a propósito, en lo que sí.**

## La puerta completa

```
──▶ Linter (constitution 12: cero avisos)                        ✓ ok
──▶ Comprobador de tipos (constitution 13)                       ✓ ok
──▶ Pruebas + cobertura ≥95% en src/core (14, 15)                ✓ ok
──▶ Compilación de producción                                    ✓ ok
──▶ Puerta SEO/GEO (constitution 32-33)                          ✓ ok
──▶ Puerta de secretos (constitution 8, 21 · CA-S5)              ✓ ok
──▶ Puerta del catálogo vivo (constitution 15, 16 · CA-15/16/19) ✗ FALLA
═══ VERIFY: ROJO ═══
```

**La séptima está roja porque no puede estar de otra forma todavía**, y conviene entender por qué no
es un fallo del trabajo: `SUPABASE_CATALOG_READ_KEY` no existe aún —hay que crearla en el panel de
Supabase con el rol `catalogo_lector`, que a su vez lo crea `catalogo.sql`, que tampoco se ha
ejecutado. CA-15 dice literalmente que esta puerta **no se salta en silencio** cuando no alcanza el
catálogo vivo. Está haciendo su trabajo.

Números: **364 pruebas** en 29 ficheros, **96,2 %** de cobertura de línea en `src/core/`, cero avisos
de linter, compilación limpia.

## La evidencia que importa: la mudanza no cambió ninguna cifra

El fichero dorado se generó el 2026-09-14 **desde el código anterior a la mudanza** y contiene las
**6.480** combinaciones posibles de respuestas con su servicio, extremos del rango, unidad,
puntuación, desenlace y texto. Después de sacar el catálogo del código, mover los factores a
parámetros y convertir `roundToStep` y el margen en valores inyectados, la comparación sigue dando
**cero divergencias**.

Dentro está el caso de referencia del principio 16, verificado:

```
ia|diagnostico|250-999|inicial|3-6m|si|asignado
  → ai_opportunity_assessment|28000|35000|total|9|qualified|agenda|28.000 – 35.000 €
```

## Las puertas nuevas, vistas fallar Y pasar

Es la lección de `S-0032`: una puerta que nunca se ha visto fallar no se sabe si funciona.

| Puerta | Sentido rojo | Sentido verde |
|---|---|---|
| **CA-08** foto al publicar | sin credenciales + `NEXUS_REQUIRE_LIVE_CATALOG=1` → salida **1**, «la publicación se detiene aquí» | en desarrollo → salida **0**, foto de la semilla escrita, con aviso a gritos |
| **CA-17** llave en el navegador | `sb_secret_…` plantada en `.next/static/chunks/*.js` → salida **1**, nombra el fichero y la variable | quitada → salida **0**, «ninguna credencial viaja al navegador» |
| **CA-15** puerta del catálogo | sin catálogo vivo alcanzable → salida **1**, «NO SE PUDO EJECUTAR» | *pendiente:* necesita la base sembrada |

## Criterios de aceptación, uno a uno

| CA | Estado | Evidencia |
|---|---|---|
| CA-01 caso de referencia | ✅ contra semilla · ⏳ contra vivo | dorado + `catalog-gate` pendiente de credenciales |
| CA-02 cambio sin publicar | ⏳ | necesita la base sembrada (T19) |
| CA-03 mínimo > máximo | ✅ código · ⏳ base | `catalog-validation.test.ts` · `CHECK rango_coherente` sin ejecutar |
| CA-04 cifras negativas | ✅ código · ⏳ base | ídem |
| CA-05 rango abierto | ✅ código · ⏳ base | probado en las dos direcciones |
| CA-06 repliegue a la foto | ✅ | `ports/catalog.test.ts` + `submit.test.ts`: el aviso interno lo dice con fecha; el lead no se entera |
| CA-07 catálogo inválido | ✅ | se descarta entero; los seis servicios siguen ahí |
| CA-08 publicación sin foto | ✅ | los dos sentidos |
| CA-09 ni vivo ni foto | ✅ | el lead SE GUARDA con todas sus respuestas, sin cifra, y el aviso grita |
| CA-10 un solo catálogo | ✅ | espía: una sola llamada por envío |
| CA-11 **ninguna cifra cambia** | ✅ | fichero dorado, 6.480 combinaciones, cero divergencias |
| CA-12 borrar un servicio | ✅ código · ⏳ base | disparador `catalogo_completo()` sin ejecutar |
| CA-13 espera máxima 3 s | ✅ | relojes falsos: a los 3.001 ms se repliega |
| CA-14 la llave solo lee | ✅ diseño · ⏳ base | `selectCatalogPort` rechaza la clave de servicio aunque esté presente |
| CA-15 puerta no se salta | ✅ | salida 1 diciendo que no pudo ejecutarse |
| CA-16 exhaustiva | ✅ contra semilla · ⏳ vivo | 504 combinaciones en pruebas |
| CA-17 nada al navegador | ✅ | puerta de secretos en los dos sentidos |
| CA-18 llave pública denegada | ⏳ | necesita la base |
| CA-19 vigilancia | ✅ mecanismo · ⏳ vivo | mensaje de fallo escrito y probado |

**11 verificados del todo, 8 a medias esperando la base de datos, ninguno fallando.**

## Lo que NO se ha probado, dicho claro

- Nada contra Supabase real: las tablas no existen todavía.
- El repliegue **real** ante una caída real de Supabase. Está probado con dobles, que es distinto —
  la puesta en marcha del registro de leads enseñó que los dobles no enseñan todo (`S-0026`).
- La prueba de extremo a extremo: cambiar un precio en la base y ver el formulario usarlo sin
  publicar (CA-02). Es la que demuestra que todo esto sirve para algo.
