---
type: verification
title: Verificación y publicación — limite-de-frecuencia
description: Evidencia del tope de envíos por origen, desde la ráfaga contra Postgres hasta la primera comprobación de extremo a extremo en producción.
tags: [sdd, verify, ship, seguridad, supabase, privacidad]
timestamp: 2026-09-14T17:20:00Z
topic: sdd
slug: limite-de-frecuencia
status: complete
---

# Verificación — limite-de-frecuencia · 2026-09-14

> Rama `feat/limite-de-frecuencia` → `main` · Spec: [../specs/limite-de-frecuencia.md](../specs/limite-de-frecuencia.md)
> Despliegue `600f0df` (READY) · Decisiones [S-0029..S-0032](../decisions.md)

## Puerta de evidencia

`bash scripts/verify.sh` → **VERDE**: 315 pruebas en 26 ficheros, cobertura del núcleo por encima
del listón, tipos, build, puerta SEO/GEO y puerta de secretos. Cero avisos de linter — y eso ahora
significa algo, ver más abajo.

## Las tres pruebas que no son unitarias

### 1. Ráfaga contra la base de datos real

Tres rondas de **30 peticiones simultáneas** contra el Supabase de producción, con el tope en 5/hora:

| Ronda | Aceptadas | Contadores únicos | Secuencia 1..30 |
|---|---|---|---|
| 1 | 5 / 5 | sí | sí |
| 2 | 5 / 5 | sí | sí |
| 3 | 5 / 5 | sí | sí |

La primera versión de esta misma prueba dejó pasar las 30, y la segunda —ya atómica— devolvió
contadores repetidos (23, 26 y 29 dos veces). Sólo la tercera, con `pg_advisory_xact_lock` por
huella, salió limpia. Las 120 filas de prueba se borraron después (120 → 0).

### 2. Las dos puertas, vistas fallar

Una puerta que nunca se ha visto fallar no se sabe si funciona. Las dos que se tocaron hoy se
probaron **en los dos sentidos** (`S-0032`):

| Puerta | Con el defecto plantado | Sin él |
|---|---|---|
| Puerta de secretos, con `RATE_LIMIT_SALT` en `.next/static` | roja, salida 1 | verde, salida 0 |
| `lint --max-warnings=0`, con un `eslint-disable` muerto | salida 1 | salida 0 |

### 3. Extremo a extremo en producción

Primer envío real contra el despliegue nuevo, hecho por Jose desde el formulario público:

```
submission_attempts  id=122  fingerprint=26d4daa3…e04abf  attempted_at=17:17:39.272Z
leads                submission_id=579b6517-…            created_at   =17:17:39.766Z
```

Tres cosas quedan demostradas de una vez:

- **La huella se calcula y se guarda**: 32 caracteres hexadecimales, sin rastro de dirección IP en
  ninguna columna de la fila (`CA-L5`). La sal de producción está puesta y se está usando.
- **El orden es el diseñado**: el intento se anota medio segundo **antes** que el lead, que es lo que
  hace que el tope pueda cortar sin haber escrito nada.
- **Las dos tablas siguen cerradas**: la prueba de humo devuelve `401` para `leads`,
  `submission_attempts` y la función `registrar_intento` con la clave pública.

## Lo que sigue sin probarse

**El mensaje de bloqueo no se ha visto en la web.** Verlo exige seis envíos reales seguidos desde el
mismo origen, y cada envío manda dos correos a buzones de verdad. El corte en sí está demostrado
contra la base de datos real (ráfaga de arriba) y en las pruebas de la decisión pura, frontera por
frontera; lo que falta es únicamente la pantalla que ve quien lo cruza.

Esa misma pantalla es una superficie nueva del acta de tono y **sigue sin firmar**, junto con S1–S12
desde el 2026-09-02.

## Puerta humana

La que exigía «revisión legal» del aviso de privacidad se abrió el 2026-09-14: no existía tal
asesoría y la puerta no tenía a nadie detrás (`S-0031`). Los tres párrafos los aprobó Jose, y la
cabecera de `src/content/privacidad.ts` deja escrito que no han pasado por un jurista.
