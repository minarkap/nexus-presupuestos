---
type: progress
title: Progreso — El registro de leads pasa a Supabase
description: Ledger de implementación del cambio de registro — TDD, puertas de seguridad y evidencia de verify.
tags: [sdd, progress, supabase]
timestamp: 2026-09-14T10:45:00Z
topic: sdd
slug: leads-en-supabase
status: complete
---

# Progreso — leads-en-supabase

> Spec: [../specs/leads-en-supabase.md](../specs/leads-en-supabase.md) · Plan: [../plans/leads-en-supabase.md](../plans/leads-en-supabase.md)
> Rama: `feat/leads-en-supabase` · Autopilot aprobado por Jose («Perfecto, hazlo», 2026-09-14)

## Punto de partida

Rescate de un ciclo a medias: `S-0025` estaba registrada y el índice enlazaba una spec que **no
existía**. La sesión anterior terminó antes de escribir el fichero. Este ciclo recupera lo decidido
allí, no lo redecide.

## TDD — rojo antes que verde

1. Escritas 20 pruebas nuevas **antes** de tocar código de producción:
   `src/ports/supabase-registry.test.ts` (mapeo, petición, cabeceras, duplicados, errores) y un
   bloque nuevo en `src/core/submit.test.ts` (orden de despacho, aviso de no-guardado, `CA-S7`).
2. Ejecución en rojo confirmada: **20 fallando / 28 pasando**.
3. Implementado `toLeadRow`, `SupabaseRegistryPort`, la precedencia de `selectRegistryPort`, la
   inversión del orden en `submitLead` y `buildInternalNotice(lead, registry)`.
4. Verde: **256 pruebas, 23 ficheros**.

El comprobador de tipos cazó las dos roturas esperadas —`LeadRecord` sin `submissionId` en el fixture
antiguo y la llamada a `buildInternalNotice` con un solo argumento—, que es exactamente para lo que
se hizo obligatorio el segundo argumento.

## Seguridad — encargo explícito de Jose durante la implementación

> «hazlo sin exponer la base de datos fuera» · «revisar la seguridad todo el rato, sobretodo que no
> quede expuesta la BBDD a fuera»

Cuatro puertas de naturalezas distintas, registradas en `S-0026`: compilación (`server-only`),
fuente (`registry-security.test.ts`), paquete compilado (`secret-gate.mjs`) y base de datos
(`schema.sql` con RLS sin policies + `revoke all`).

**La puerta de secretos se probó en los dos sentidos**, porque una puerta que nunca se ha visto
fallar no está probada:

| Escenario | Salida |
|---|---|
| Valor sensible presente en el paquete de cliente | `1` — nombra fichero y variable |
| Paquete limpio | `0` — «Ninguna credencial del registro viaja al navegador» |

Corregido sobre la marcha un chequeo flojo en `test_connection.sh`: la primera versión comprobaba la
tabla **sin cabecera `apikey`**, que la API rechaza siempre diga lo que diga RLS. Reescrito para usar
la clave `anon` —la que cualquiera puede ver— que es la única que prueba de verdad si está cerrado.

## Evidencia

`bash scripts/verify.sh` → **VERDE**, con los seis pasos:
lint (cero avisos) · tipos · pruebas + cobertura ≥95 % en `src/core` · compilación de producción ·
puerta SEO/GEO · **puerta de secretos** (17 ficheros de cliente inspeccionados, ninguna credencial).

## Revisión adversarial de seguridad — 2026-09-14

Acta completa: [../verifications/leads-en-supabase-2026-09-14.md](../verifications/leads-en-supabase-2026-09-14.md).

Resistió lo que importaba: **ninguna vía de exposición** de la clave ni de la tabla hacia el
navegador. Encontró cinco cosas; **cuatro corregidas en el mismo ciclo** (topes de tamaño en los
campos libres, la puerta de secretos que se saltaba su comprobación principal en silencio, los mapas
de fuente sin inspeccionar, y el SQL sin transacción) y **una dejada abierta a propósito**: el límite
de frecuencia del formulario, que es una spec propia (`S-0027`).

Tras las correcciones: `verify.sh` **VERDE**, 266 pruebas.

## Publicado — 2026-09-14

- [x] Proyecto Supabase creado, `schema.sql` y `retention.sql` ejecutados.
- [x] Credenciales en `01-TOOLS/SUPABASE/.env` y `03-APP/.env.local`.
- [x] `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en Vercel (production + preview, la clave cifrada).
- [x] `test_connection.sh` → las dos marcas en verde.
- [x] Rama fusionada a `main` (merge `649223c`) y publicada. Despliegue de producción **READY**.
- [x] Comprobado sobre el sitio en vivo: ni `sb_secret_`, ni `service_role`, ni `supabase.co`
      aparecen en el HTML ni en ningún fichero de JavaScript que descarga el visitante.
- [ ] **Pendiente**: enviar un lead de prueba desde el formulario publicado y comprobar la fila.

### Verificación contra el Supabase real (antes de fusionar)

| Prueba | Resultado |
|---|---|
| Insertar un lead | `201` |
| Reenviar el mismo envío | `201`, **una sola fila** |
| Leer con la clave pública | `401 permission denied for table leads` |
| Borrar | `204`, tabla vacía |

### Tres fallos que sólo enseñó la puesta en marcha real

1. `SUPABASE_URL` pegada con `/rest/v1/` incluido → la petición iba a `/rest/v1/rest/v1/leads` y
   Supabase contestaba **404 «la tabla no existe»**, que manda a buscar el fallo donde no está. Se
   normaliza la URL en vez de rechazarla.
2. `Prefer: resolution=ignore-duplicates` **no hacía nada** sin `on_conflict` nombrando la columna.
   El comportamiento era correcto por accidente —porque el adaptador trata el 409 como éxito—, no
   porque la cabecera funcionara.
3. El script de humo se rompía con `unbound variable`: bash se tragaba un `»` como parte del nombre
   de la variable. Llaves explícitas.

## Desviaciones respecto al plan

- Se añadió una puerta de secretos al `verify.sh` que el plan no preveía: nace del requisito de
  seguridad que Jose introdujo **durante** la implementación, no de la spec original.
- `01-TOOLS/SUPABASE/.env.example` ganó una cuarta variable opcional, `SUPABASE_ANON_KEY`, que la
  aplicación **no usa**: existe sólo para que la prueba de humo pueda comprobar el cierre real.
