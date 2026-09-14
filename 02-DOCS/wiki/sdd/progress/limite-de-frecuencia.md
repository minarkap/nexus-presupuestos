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

## Revisión adversarial de seguridad — encontró un fallo que derrotaba la función entera

Cinco hallazgos. **Los dos primeros eran defectos reales y graves**, y el primero anulaba el
propósito de la spec:

| # | Hallazgo | Estado |
|---|---|---|
| 1 | **El tope no era atómico.** Leía el contador y luego anotaba, en dos viajes. Treinta peticiones simultáneas —un `Promise.all` de cinco líneas— leen todas el mismo contador antes de que ninguna haya anotado, y las treinta pasan. En Vercel cada una corre en una instancia distinta: nada las coordina salvo la base de datos | **Corregido**: `registrar_intento`, una función de Postgres que inserta y cuenta en la misma transacción. Una sola llamada |
| 2 | **El aviso de privacidad prometía un plazo falso.** Decía «menos de cuarenta y ocho horas»; con una limpieza diaria, una fila insertada justo después de una pasada sobrevivía **hasta 72 horas**. Comprobado con la aritmética del cron | **Corregido**: limpieza **horaria** (peor caso 49 h) y el texto dice «un máximo de tres días», que sí es cierto |
| 3 | **La promesa de no-asociación era más fuerte de lo que el diseño sostiene.** Ambas tablas reciben una fila en la misma petición, con menos de un segundo de diferencia: quien tenga la clave de servicio puede emparejarlas por proximidad temporal | **Corregido el texto**, no el diseño: ahora dice que la huella «se guarda aparte de tu solicitud, en un registro que no contiene tu nombre, tu correo ni ninguna de tus respuestas» — que es lo que de verdad ocurre |
| 4 | **Rotación IPv6 en un `/64` propio** daba cupo infinito a quien tuviera un bloque enrutado | **Corregido**: la dirección se recorta al prefijo `/64` antes de calcular la huella |
| 5 | La prueba de humo no cubría la tabla nueva, **pese a que el plan lo prometía** | **Corregido**: comprueba la tabla y que la función atómica esté cerrada al público |

Lo que **resistió**: falsificación de cabeceras (Vercel las sobrescribe), fuga de la sal o de la
huella hacia el cliente, los logs o los correos, reversibilidad del HMAC, elegir la huella de un
tercero, y fuga por el mensaje de bloqueo.

### Prueba real de concurrencia — 2026-09-14

Ejecutada contra el Supabase de producción, no contra dobles. **Encontró un resto que el
razonamiento no había visto**, que es exactamente para lo que sirve probar de verdad.

| Intento | Resultado |
|---|---|
| Primera versión, 30 peticiones simultáneas | **5 aceptadas** — la fuga grande estaba cerrada. Pero los contadores salieron **repetidos** (23, 26 y 29 dos veces): dos transacciones simultáneas insertan cada una la suya y luego cuentan sin ver la ajena, porque el nivel de aislamiento por defecto de Postgres no se las enseña. Lejos del tope da igual; **justo en el tope dejaría pasar un envío de más** |
| Con `pg_advisory_xact_lock(hashtext(huella))`, tres rondas de 30 | **5 aceptadas, contadores 1..30 exactos, cero duplicados, las tres veces** |

El bloqueo es **por huella**: dos orígenes distintos no se esperan entre sí, y se libera solo al
terminar la transacción.

### Lo que esto enseña

El diseño anterior **parecía correcto y tenía 44 pruebas en verde**. Ninguna ejercitaba concurrencia,
y el plan tampoco la mencionaba entre sus riesgos. Un limitador que se comprueba en serie siempre
parece funcionar: el fallo sólo existe cuando dos peticiones se pisan, que es exactamente lo que hace
un atacante y nunca hace una prueba secuencial.

## PUERTA HUMANA — por qué esto no se publica

Este ciclo **redacta párrafos nuevos del aviso de privacidad**, marcados como borrador en la cabecera
de `src/content/privacidad.ts`. Los ha escrito un agente y son texto que compromete a la empresa
frente a terceros.

- [ ] **Revisión legal** de los tres párrafos nuevos (huella técnica, interés legítimo, plazo).
- [ ] **Firma de la superficie nueva** del acta de tono: el mensaje que ve quien cruza el tope.
- [x] `01-TOOLS/SUPABASE/rate-limit.sql` ejecutado (2026-09-14): tabla, función atómica con bloqueo
      por huella, y limpieza horaria.
- [x] **Prueba real de concurrencia superada**, tres rondas de 30 peticiones simultáneas.
- [x] Prueba de humo ampliada: la tabla de intentos y la función están cerradas al público (`401`).
- [x] Filas de prueba borradas (120 → 0). El lead real intacto.
- [ ] `RATE_LIMIT_SALT` en Vercel (production + preview). Ya generada en los `.env` locales.

Sin lo primero, **no se fusiona**. La constitución ya exigía revisión legal de `/privacidad` (S5 del
acta de tono) y seguía pendiente desde el 2026-09-02: este cambio la hace más necesaria, no menos.
