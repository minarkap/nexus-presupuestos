---
type: progress
title: Progress — landing-presupuestos-nexus
description: Ledger append-only de la ejecución de las 36 tareas. Fuente de verdad para reanudar tras compactación.
tags: [sdd, implement, progress, append-only]
timestamp: 2026-08-26T16:45:00Z
topic: sdd
slug: landing-presupuestos-nexus
status: active
---

# Progress — landing-presupuestos-nexus

> **Append-only.** Una tarea marcada `complete` está HECHA: no se vuelve a despachar.
> Sin git (constitution 18), este fichero + el árbol de trabajo son el único estado.
> Resolución de skills: `nextjs` (usada, a mano), `implement` (usada).
> **Fallback registrado:** `.rsc/skill-registry.json` NO existe — la selección de skills fue manual.

## T001 — 2026-08-26 · Andamiaje
- status: complete
- entorno: Node 25.9.0 (satisface `engines: >=24`), npm 11.12.1, Next **16.3.3**, React **19.2.8**, Vitest 4.1.11
- incidencia: `eslint-config-next@16` ya no funciona con el puente `FlatCompat`; se pasó a su config plana nativa
- done-check: `npm run lint && npm run typecheck && npm test` → exit 0, **cero avisos**
- files: package.json, tsconfig.json, next.config.ts, vitest.config.ts, eslint.config.mjs, src/app/{layout,page}.tsx

## T002 — 2026-08-26 · Config del chain
- status: complete
- done-check: `02-DOCS/wiki/sdd/config.yaml` existe con comandos reales del proyecto
- decision: `models.enabled: false` — sin routing, se honra el modelo de sesión

## T035 — 2026-08-26 · scripts/snapshot.sh
- status: complete
- done-check: `bash scripts/snapshot.sh` crea copia fechada en `.rsc/backups/` y sale 0
- por qué antes de tiempo: es la única red que sustituye al historial ausente (constitution 19)

## T003 — 2026-08-26 · CatalogConfig
- status: complete
- red: n/a (config, no comportamiento) — la prueba afirma los seis rangos oficiales contra el catálogo
- green: 16 pruebas verdes; umbral 6, caducidad 2026-12-31, sólo Custom AI abierto, sólo Advisory mensual
- files: src/core/types.ts, src/core/catalog.ts, src/core/catalog.test.ts

## T004/T005 — 2026-08-26 · ServiceResolver
- status: complete
- red: primero falló por import; se creó un stub que devolvía siempre `uncatalogued` para verlo fallar **por aserción** (6 fallos). Un rojo de import no prueba las aserciones
- green: 27 pruebas. IA ramifica por necesidad; ciberseguridad y ESG resuelven a servicio único; estrategia_operaciones nunca aproxima
- files: src/core/service-resolver.ts + .test.ts

## T006/T007 — 2026-08-26 · PricingEngine
- status: complete
- red: 8 fallos por aserción contra stub
- green: 39 pruebas. **Caso de referencia exacto: 28.000 – 35.000 €**
- nota: no se redondea en el paso 2; el redondeo al millar ocurre sólo en el paso 4, antes del segundo anclaje
- files: src/core/pricing.ts + .test.ts

## T008/T009 — 2026-08-26 · ScoringEngine
- status: complete
- red: 6 fallos por aserción
- green: 49 pruebas. Perfil fuerte → 8; perfil flojo → 0 (acotado, nunca negativo); desglose de 5 señales siempre
- files: src/core/scoring.ts + .test.ts

## T010/T011 — 2026-08-26 · Prueba exhaustiva y partición de tramos
- status: complete
- green: 60 pruebas. **504 combinaciones recorridas, cero violaciones de rango**
- corrección propia: la primera aserción esperaba 216 combinaciones. Estaba mal: ciberseguridad y ESG resuelven también con necesidad `null`, así que son 14 pares (reto, necesidad) con cifra, no 6. El espacio que CA-02 exige recorrer es el de RESPUESTAS, no el de servicios
- bordes fijados: 250 → «De 250 a 999»; 1.000 → «1.000 o más»; 6 meses → «De 3 a 6 meses»; 3 meses → «De 3 a 6 meses»
- files: src/core/options.ts, src/core/exhaustive.test.ts, src/core/partitions.test.ts

## T012/T013 — 2026-08-26 · OutcomeMapper
- status: complete
- red: 8 fallos por aserción
- green: 75 pruebas
- **prueba retirada por defectuosa, sustituida por otra más fuerte:** una aserción afirmaba que la
  salida serializada no contiene el dígito «3». Es imposible de cumplir —el rango entregado es
  «28.000 – 35.000»— y no medía nada. Se sustituyó por una que busca el VOCABULARIO interno
  (`sponsor`, `presupuesto`, `plazo`, `madurez`, `points`, `puntuación`) y por una que comprueba que
  el total de la puntuación no está entre los valores del objeto. No se debilitó: se endureció
- files: src/core/outcome.ts + .test.ts

## T014/T015 — 2026-08-26 · ProposalComposer
- status: complete
- red: 5 fallos por aserción · green: 83 pruebas
- refactor sobre verde: se eliminó una rama muerta (`split(' ')[0] ?? name`), que sólo existía para
  callar a `noUncheckedIndexedAccess`. Sustituida por `split(' ', 1).join('')`, sin rama ni aserción
  de tipo. **No se escribió una prueba para código inalcanzable: se borró el código**

## T016–T019 — 2026-08-26 · Puertos y adaptadores
- status: complete
- green: 93 pruebas
- **corrección de F-1 implementada y probada**: producción + credencial → adaptador real; producción
  SIN credencial → adaptador que siempre falla; fuera de producción → falso. En producción no se
  puede forzar el falso ni pidiéndolo con `USE_FAKE_ADAPTERS=1`
- Google Sheets se firma con `node:crypto` (JWT RS256), sin añadir dependencia
- files: src/ports/email.ts, src/ports/registry.ts, src/ports/ports.test.ts

## T020/T021 — 2026-08-26 · SubmitAction
- status: complete
- red: 1 fallo · green: 110 pruebas
- corrección de expectativa propia: la prueba esperaba `8/10` para un lead con tamaño «250-999».
  El total real es **9** (3+3+2+0+**1**). La prueba estaba mal, no el código
- despacho best-effort con tres vías independientes verificadas por separado
- files: src/core/submit.ts + .test.ts, src/app/actions.ts

## T022/T023/T034 — 2026-08-26 · FormWizard, validación y abandono
- status: complete
- green: 120 pruebas
- **defecto de accesibilidad real encontrado y corregido**: el mensaje de error vivía dentro del
  `<label>`, así que el nombre accesible del campo pasaba a ser «Correo de trabajo Revisa el correo».
  Un lector de pantalla lo leería mal. Se sacó fuera y se enlazó con `aria-describedby`
- decisión de UX documentada: el contador de progreso pasa de «de 7» a «de 8» al elegir IA. Es
  honesto — el formulario ramifica de verdad — y así lo fija la prueba

## T024/T025/T026 — 2026-08-26 · ResultScreen, Landing y cableado
- status: complete
- green: 133 pruebas. Sin catalogar no renderiza `€`; sin cualificar no monta el iframe;
  cualificado sin URL de calendario no rompe
- plan B del riesgo R-3 implementado: enlace en pestaña nueva bajo el iframe

## T027 — 2026-08-26 · Accesibilidad del formulario
- status: complete
- green: 141 pruebas. Nombre accesible por campo, `type=email`, recorrido con tabulador,
  `aria-pressed` en las opciones, error enlazado y anunciado

## T028 — 2026-08-26 · Puerta de cobertura
- status: complete
- done-check: `npm run test:coverage` sale **0**
- resultado: `src/core/` al **100 % en sentencias, ramas, funciones y líneas** (79/79 ramas)
- las dos ramas que faltaban se cubrieron con pruebas de comportamiento real (cuota mensual, nombre
  de una palabra), no con relleno para tocar líneas

## T029 — 2026-08-26 · scripts/verify.sh
- status: complete
- incluye **compilación de producción**, que cazó un error de tipos en un mock que `tsc --noEmit`
  no veía (el `build` de Next type-chequea también las pruebas)
- done-check: `bash scripts/verify.sh` → **VERIFY: VERDE**, exit 0

## T030/T036 — 2026-08-26 · Listas escritas
- status: complete
- `02-DOCS/wiki/sdd/tone-checklist.md` — 7 superficies, 8 comprobaciones, acta sin firmar
- `02-DOCS/wiki/sdd/manual-walkthrough.md` — los tres perfiles con su resultado esperado

## T032/T033 — 2026-08-26 · Tooling de credenciales
- status: complete
- `01-TOOLS/RESEND/` y `01-TOOLS/GOOGLE/` siguiendo la convención del arsenal
- done-check: ambos `test_connection.sh` fallan **con mensaje claro** al no haber `.env`, que es el
  comportamiento correcto sin credenciales
- el de Google detecta específicamente el 403 por hoja no compartida, que es el error que todo el
  mundo comete y que parece un problema de credenciales

## T031 — 2026-08-26 · Cierre
- status: complete
- `bash scripts/verify.sh` → VERDE: lint (cero avisos), tipos, 144 pruebas, cobertura 100 %, build
- **36/36 tareas completas**

## review — 2026-08-26 · Lectura adversaria posterior a verify
- status: complete
- **comprobación 1 (frontera de confianza, a nivel de paquete):** se compiló y se buscaron los datos
  internos en los 11 ficheros JS de cliente. `QUALIFICATION_THRESHOLD`, `officialMin`, `35000`,
  `26500` y el mapeo tramo→factor → **cero apariciones**. Los decimales que sí aparecen (`1.05`)
  salen del CSS propio (`font-size: 1.05rem`) y del runtime de Turbopack. CA-06 confirmado más allá
  de la prueba unitaria
- **comprobación 2 (endpoint público):** **DEFECTO ENCONTRADO** — entrada inventada producía
  «NaN – NaN €» en pantalla y por correo. Corregido en `S-0013` con TDD (12 pruebas nuevas)
- resultado final: **156 pruebas, cobertura 100 % en las cuatro métricas, verify.sh VERDE**

## smoke — 2026-08-26 · La aplicación sirve de verdad
- status: complete
- `npm start` en puerto libre → **HTTP 200, 7.004 bytes**
- el HTML servido contiene el titular real, la CTA y la frase «rango orientativo, no un presupuesto»
- **cero apariciones** de `26500`, `35000`, `officialMin` ni `umbral` en el HTML servido
- nota de campo: el primer intento dio 404 porque el puerto 3000 ya estaba ocupado por otro proceso
  de la máquina y el servidor ni arrancó. No era un fallo de la app

## demo — 2026-08-26 · Sustituto local de la página de citas
- status: complete · **TEMPORAL, BORRAR ANTES DE PUBLICAR**
- context: `NEXT_PUBLIC_CALENDAR_URL` estaba sin definir, así que el lead cualificado veía el
  repliegue («te escribimos con la disponibilidad») en vez de un calendario. La URL real sigue siendo
  una decisión abierta (C-07: página compartida del equipo, aún sin montar)
- qué se hizo: `src/app/agenda-demo/page.tsx`, una página de relleno con aviso visible de que es un
  sustituto, y `NEXT_PUBLIC_CALENDAR_URL` apuntando a ella en `.env.local`
- **no es producto**: se saltó la cadena SDD a propósito por ser andamiaje de demostración
- deuda a retirar: borrar `src/app/agenda-demo/` y poner la URL verdadera en la variable
- efecto colateral útil: confirma que el mecanismo de incrustación funciona y que el plan B del
  riesgo R-3 (enlace en pestaña nueva) se renderiza. **Sigue sin probarse contra una página de Google
  real**, que es donde R-3 puede materializarse
- `verify.sh` tras el cambio: VERDE, 156 pruebas, cobertura 100 %
