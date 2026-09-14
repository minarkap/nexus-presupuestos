---
type: progress
title: Progreso — Límite de frecuencia del formulario
description: Ledger de implementación del tope de envíos — TDD, la decisión pura en el núcleo, y la puerta humana que impide publicarlo.
tags: [sdd, progress, seguridad, privacidad]
timestamp: 2026-09-14T13:55:00Z
topic: sdd
slug: limite-de-frecuencia
status: awaiting-human-review
---

# Progreso — limite-de-frecuencia

> Spec: [../specs/limite-de-frecuencia.md](../specs/limite-de-frecuencia.md) · Plan: [../plans/limite-de-frecuencia.md](../plans/limite-de-frecuencia.md)
> Rama: `feat/limite-de-frecuencia` · Commit `0c992e5` · **NO fusionado, NO publicado**

## El obstáculo que apareció al empezar

La propuesta inicial era «una tabla de intentos por IP». Antes de escribir nada se comprobó qué dice
el aviso de privacidad **publicado**, y decía dos cosas que lo impedían:

> «**Solo** los que introduces en el estimador…» · «…y **no recoge datos de navegación**.»

Una dirección IP es un dato de navegación y es dato personal. La propuesta original habría puesto al
sitio en contradicción con su propio texto legal — cumplir por fuera y fallar por dentro, que es
justo lo que este proyecto lleva toda la sesión evitando. De ahí salieron las tres preguntas que
decidió Jose (mecanismo, mensaje y cifras) y la puerta humana de más abajo.

## TDD

| Paso | Rojo → verde |
|---|---|
| Decisión pura del tope y huella (`src/core/rate-limit.ts`) | 17 pruebas: fronteras exactas, ventana caducada, marca ilegible, la huella no contiene la dirección |
| Puerto y adaptadores (`src/ports/rate-limit.ts`) | 15 pruebas: URL, filtro, cabeceras, el error no lleva credencial, sin credenciales se desactiva |
| Conexión en `submitLead` | 12 pruebas: orden, cupo, doble clic, conteo caído, sin huella, por origen |
| **Total** | **314 pruebas, 26 ficheros** |

Dos guardianes del proyecto saltaron solos y acertaron:

1. **El comprobador de tipos** cazó el agujero que el plan había anticipado: el cliente distinguía
   los resultados con `'field' in result`, así que la variante nueva se habría colado hasta
   `onDone()`. Dejó de compilar hasta tratarla.
2. **La prueba de marca** rechazó un emoji que se coló en un comentario del fichero de contenido
   (constitución 31, «nunca emoji»).

## Evidencia

`bash scripts/verify.sh` → **VERDE** en los seis pasos, 314 pruebas.

## PUERTA HUMANA — por qué esto no se publica

Este ciclo **redacta párrafos nuevos del aviso de privacidad**, marcados como borrador en la cabecera
de `src/content/privacidad.ts`. Los ha escrito un agente y son texto que compromete a la empresa
frente a terceros.

- [ ] **Revisión legal** de los tres párrafos nuevos (huella técnica, interés legítimo, plazo).
- [ ] **Firma de la superficie nueva** del acta de tono: el mensaje que ve quien cruza el tope.
- [ ] Ejecutar `01-TOOLS/SUPABASE/rate-limit.sql` en Supabase.
- [ ] `RATE_LIMIT_SALT` en Vercel (production + preview). Ya generada en los `.env` locales.

Sin lo primero, **no se fusiona**. La constitución ya exigía revisión legal de `/privacidad` (S5 del
acta de tono) y seguía pendiente desde el 2026-09-02: este cambio la hace más necesaria, no menos.
