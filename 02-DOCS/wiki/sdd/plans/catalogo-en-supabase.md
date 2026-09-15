---
type: plan
title: Plan — El catálogo comercial vive en la base de datos
description: HOW de la mudanza — inyección del catálogo en el núcleo para que siga siendo síncrono y puro, cuatro tablas editables celda a celda leídas de una vez por una función de Postgres, y una foto cocida en cada publicación como respaldo.
tags: [sdd, plan, catalogo, supabase, arquitectura]
timestamp: 2026-09-14T20:05:00Z
topic: sdd
slug: catalogo-en-supabase
status: draft
---

# Plan — El catálogo comercial vive en la base de datos

> Slug: `catalogo-en-supabase` · Status: borrador · Creado: 2026-09-14
> Spec: [catalogo-en-supabase](../specs/catalogo-en-supabase.md) (aprobada, clarificada)
> Inherits: [constitution](../constitution.md) · Precedentes: [leads-en-supabase](./leads-en-supabase.md),
> [limite-de-frecuencia](./limite-de-frecuencia.md)

## §0 — Restricciones globales (verbatim; ninguna tarea las paráfrasea)

Valores exactos que toda tarea debe honrar. Quien implemente una tarea aislada solo ve esto.

```text
CADUCIDAD              2026-12-31                (viaja con el catálogo; NO hace nada — spec Non-goals)
UMBRAL                 6                          (valor vigente; pasa a la base)
MARGEN                 0.12
PASO_REDONDEO          1000
PUNTUACIÓN_MÁXIMA      10

CASO DE REFERENCIA     600 empleados · madurez inicial · arranque 4 meses · reto IA/diagnóstico
                       → EXACTAMENTE 28000 – 35000 €           (constitution 16 · CA-01)

LÍMITES DE VALIDEZ     (decididos en clarify C-2)
  rangos               enteros ≥ 0 · officialMin ≤ officialMax · officialMax NULL sólo si openEnded
  multiplicadores      número > 0 y ≤ 3
  puntuaciones         enteros en [-10, 10]
  umbral               entero en [0, PUNTUACIÓN_MÁXIMA]
  unidad               'total' | 'month'

SERVICIOS OBLIGATORIOS (los seis; borrar uno se rechaza — CA-12)
  ai_opportunity_assessment · ai_transformation_program · ai_executive_advisory
  cyber_resilience_assessment · esg_strategy_compliance · custom_ai_solutions

ESPERA MÁXIMA          3000 ms  (clarify C-6; agotada → se trata como caída, se usa la foto)

REGLA DE ORO           La mudanza NO cambia ni una cifra. Toda combinación debe dar
                       exactamente el mismo rango que antes (CA-11).
```

## §1 — Contexto y restricciones que fijan este diseño

- `spec §Behaviour` — cada cálculo obtiene el catálogo vigente; la foto de la última publicación es
  el único respaldo; nunca conviven dos precios (CA-10).
- `spec §Behaviour` — el sitio en producción **solo lee** el catálogo (CA-14).
- `constitution 8` — multiplicadores, tabla de puntos y umbral **nunca** llegan al navegador. Esto
  gobierna dónde puede vivir cada módulo: el catálogo cargado no puede cruzar la frontera cliente.
- `constitution 13, 14` — modo estricto, **ningún `any`** en los dos motores, cobertura ≥ 95 % en
  `src/core/`. Esto es lo que descarta hacer asíncrono el núcleo (§2).
- `constitution 15, 16` — la prueba exhaustiva y el caso de referencia siguen siendo permanentes.
- `constitution 26` — no hay presupuesto de rendimiento. Una consulta por cálculo es aceptable; la
  espera máxima de §0 no es un objetivo de rendimiento, es no dejar a nadie colgado.
- **Precedente de la casa** — `SupabaseRateLimitPort` ya llama una función de Postgres por RPC sobre
  la API REST, sin SDK. Este plan usa el mismo camino, no inventa otro.
- **Vercel** — copias efímeras. Ya decidido en la spec: sin copia en memoria entre peticiones.

## §2 — Arquitectura

### La decisión que importa: el catálogo se **inyecta**; el núcleo sigue síncrono y puro

```text
  ┌─ NAVEGADOR ───────────────────────────────────────────────────────┐
  │  FormWizard — no sabe que el catálogo existe. Sin cambios.        │
  └───────────────────────────┬───────────────────────────────────────┘
                              │ submitAction(answers, submissionId)
  ┌─ FRONTERA DE SERVIDOR ────▼───────────────────────────────────────┐
  │  app/actions.ts                                                   │
  │    catálogo = await selectCatalogPort(env).load()   ◀── ÚNICO     │
  │    submitLead(answers, id, { ...deps, catalogo }, cache)   await  │
  └───────────────────────────┬───────────────────────────────────────┘
                              │ Catalog (dato plano, ya validado)
  ┌─ NÚCLEO — SÍNCRONO, PURO, SIN RED ───▼────────────────────────────┐
  │  resolveService(cat, …) · priceService(cat, …) · scoreLead(cat, …)│
  │  mapOutcome(cat, …)     · composeProposal(…)                      │
  └───────────────────────────────────────────────────────────────────┘

  ┌─ PUERTO DEL CATÁLOGO (externo) ───────────────────────────────────┐
  │  SupabaseCatalogPort ──RPC──▶ catalogo_vigente()  [1 viaje]      │
  │        │ falla / tarda > 3 s / no valida                          │
  │        └──▶ SnapshotCatalogPort ──▶ foto cocida en la publicación │
  └───────────────────────────────────────────────────────────────────┘
```

**Por qué inyectar y no hacer asíncrono el núcleo.** La alternativa real era convertir
`priceService`, `scoreLead` y compañía en funciones `async` que se buscasen el catálogo solas.

| | Inyección (elegida) | Núcleo asíncrono |
|---|---|---|
| Pureza del núcleo | Intacta: mismas funciones, un parámetro más | Se pierde: red dentro del motor de cálculo |
| Pruebas | Igual de simples; el catálogo es un dato que se pasa | Toda prueba del núcleo necesita un doble de red |
| Cobertura ≥ 95 % (const. 14) | Se mantiene sin esfuerzo | Se encarece: caminos de fallo dentro del motor |
| Consultas por envío | **Una**, en la frontera | Una por función que lo pida — y precios distintos dentro del mismo cálculo |
| `constitution 8` | El catálogo no puede cruzar al cliente: vive tras `server-only` | Igual, pero con más superficie |

La fila que decide es la penúltima: con el núcleo asíncrono, `priceService` y `scoreLead` podrían
leer el catálogo en instantes distintos y **usar dos catálogos dentro del mismo cálculo**. La
inyección lo hace imposible por construcción — se carga una vez, se pasa hacia abajo, y CA-10 se
cumple sin vigilancia.

### Componentes

| Componente | Responsabilidad única | Tipo |
|---|---|---|
| `core/catalog-types.ts` | La forma `Catalog` y sus partes. Solo tipos. | interno |
| `core/catalog-seed.ts` | Los valores de hoy, congelados. Semilla de la base **y** foto de reserva de última instancia. Sustituye al actual `catalog.ts`. | interno |
| `core/catalog-validation.ts` | `validateCatalog(desconocido) → Catalog \| Invalid`. Pura, sin red. Aplica los límites de §0. | interno |
| `ports/catalog.ts` | `CatalogPort.load()`. Implementaciones: Supabase, foto, fake. Decide el repliegue y **declara la procedencia**. | externo |
| `catalogo.sql` | Cuatro tablas editables celda a celda + función `catalogo_vigente()` + cierre de acceso. | externo |
| `scripts/snapshot-catalog.mjs` | Toma la foto al publicar. Falla la publicación si no puede (CA-08). | externo |
| `scripts/catalog-gate.mjs` | Caso de referencia + exhaustiva **contra el catálogo vivo**. Falla ruidosamente si no lo alcanza (CA-15). | externo |

## §3 — Interfaces y contratos

```text
Catalog
  services       : Record<ServiceId, ServiceRef>     // los seis, siempre completos
  sizeFactor     : Record<Size, number>
  maturityFactor : Record<Maturity, number>
  timingFactor   : Record<Timing, number>
  sponsorPoints  : Record<Sponsor, number>
  budgetPoints   : Record<BudgetAnswer, number>
  timingPoints   : Record<Timing, number>
  maturityPoints : Record<Maturity, number>
  sizePoints     : Record<Size, number>
  threshold      : number
  margin         : number
  roundingStep   : number
  maxScore       : number
  expiresOn      : string        // decorativa (spec Non-goals)

CatalogPort.load() -> LoadedCatalog
  LoadedCatalog = { catalog: Catalog, source: 'live' } 
                | { catalog: Catalog, source: 'snapshot', takenAt: string, reason: string }
  - NUNCA lanza si hay foto utilizable: replegarse es su trabajo
  - LANZA sólo si no hay ni catálogo vivo ni foto válida  → CA-09
  - una sola llamada de red, como mucho una espera de 3 s
  - el catálogo devuelto YA pasó validateCatalog: quien llama no revalida

validateCatalog(input: unknown) -> Catalog | { invalid: string }
  - total: nunca lanza
  - rechaza entero, nunca a medias                        → CA-07
  - aplica los límites de §0 verbatim

priceService(catalog, service, size, maturity, timing) -> PriceRange
scoreLead(catalog, answers) -> Score
resolveService(catalog, challenge, need) -> ServiceResolution
mapOutcome(catalog, service, price, score) -> RedactedOutcome
  - las cuatro: síncronas, puras, deterministas, sin `any`
  - el catálogo es el PRIMER parámetro en las cuatro, por costumbre
```

**Contrato de la procedencia.** `submitLead` recibe `LoadedCatalog`, no `Catalog`, para que
`buildInternalNotice` pueda declarar «calculado con la foto del 2026-09-01» (CA-06). La procedencia
llega al aviso interno y **jamás** a `RedactedOutcome`: el lead no se entera (constitution 11).

## §4 — Modelo de datos y flujo

### Cuatro tablas, no un documento JSON

Editar un precio tiene que ser **editar una celda** en el editor de tablas de Supabase. Un documento
JSON en una sola fila daría un viaje de lectura y atomicidad gratis, pero convertiría «cambiar un
precio sin publicar» en «editar un blob de JSON a mano», que es apenas mejor que editar el fichero.

```text
catalogo_servicios   id PK · label · official_min · official_max NULL · unit · open_ended
catalogo_factores    bloque PK ─┐  (size | maturity | timing)
                     clave  PK ─┘  valor numeric
catalogo_puntos      bloque PK ─┐  (sponsor | budget | timing | maturity | size)
                     clave  PK ─┘  puntos int
catalogo_ajustes     clave PK · valor    (threshold · margin · rounding_step · max_score · expires_on)
```

La atomicidad que el JSON regalaba se recupera con **una función de Postgres**:

```text
catalogo_vigente() -> jsonb
  - lee las cuatro tablas en UNA sentencia → una única instantánea MVCC
  - por tanto NUNCA devuelve medio catálogo, ni mezcla dos    → CA-07
  - un viaje de red, no cuatro
  - es el mismo camino que `registrar_intento` del tope: RPC sobre la API REST, sin SDK
```

### Las guardas viven en la base, no en el código

| Guarda | Forma | Criterio |
|---|---|---|
| `official_min ≤ official_max` | `CHECK` | CA-03 |
| no negativos, enteros | `CHECK` por columna | CA-04 |
| `official_max NULL` ⇔ `open_ended` | `CHECK` | CA-05 |
| multiplicador en (0, 3] | `CHECK` | C-2 |
| puntos en [−10, 10] | `CHECK` | C-2 |
| **los seis servicios siempre presentes** | disparador `AFTER … DEFERRABLE` que compara el conjunto de ids con la lista de §0 | CA-12 |
| cierre de acceso | RLS activada **sin policies** + `revoke all` a `anon, authenticated, public` | CA-18 |
| el sitio solo lee | llave de **solo lectura** distinta de la de servicio | CA-14 |

> **CA-14 es el único punto donde este plan añade una credencial nueva.** Hoy el sitio usa una sola
> llave de servicio que puede todo. El catálogo se lee con una llave distinta que solo puede leer.
> `scripts/secret-gate.mjs` tiene que vigilarla igual que a las demás.

### Flujo de un envío

```text
1. actions.ts          load()  ── RPC catalogo_vigente()  [≤ 3 s]
                               ├─ ok + valida      → source: 'live'
                               ├─ falla/tarda/no valida → foto  → source: 'snapshot'
                               └─ ni foto válida   → lanza → CA-09
2. submitLead(deps.catalogo)   núcleo síncrono, un solo catálogo de principio a fin
3. buildInternalNotice         si source = 'snapshot', lo DICE, con la fecha de la foto
4. el lead ve su rango         idéntico en los dos casos; nunca sabe de dónde salió
```

### La foto

Se toma en `prebuild`. Lee el catálogo vivo, lo valida, y escribe un módulo generado que la
publicación empaqueta.

- **En Vercel / `NODE_ENV=production`:** si no hay credenciales o la lectura falla → **la publicación
  falla** (CA-08). No se publica sin red.
- **En local sin credenciales:** usa `catalog-seed.ts` y **lo grita por consola**. Es desarrollo, no
  producción; la regla `F-1` de la casa distingue las dos.
- La foto lleva `takenAt`. Es lo que el aviso interno declara.

## §5 — Estrategia de pruebas

Una fila por criterio. «Semilla» = `catalog-seed.ts`, sin red. «Vivo» = contra Supabase real.

| CA | Nivel | Qué afirma | Qué finge |
|---|---|---|---|
| CA-01 | unidad (semilla) + puerta (vivo) | 600/inicial/4m/IA-diagnóstico → 28000–35000 | nada en semilla; nada en vivo |
| **CA-11** | **regresión dorada** | toda combinación == fichero dorado generado **antes** de tocar nada | nada |
| CA-02 | integración (vivo) | cambiar un rango en la base → el siguiente cálculo lo usa | — |
| CA-03/04/05/12 | integración (vivo) | la escritura se rechaza; el catálogo no cambia | — |
| CA-06 | unidad | puerto con `fetch` que falla → `source:'snapshot'`; el aviso lo declara con fecha | `fetch` |
| CA-07 | unidad | RPC devuelve catálogo inválido → foto, sin adoptar nada del inválido | `fetch` |
| CA-08 | integración | `snapshot-catalog` sin credenciales en modo producción → salida ≠ 0 | entorno |
| CA-09 | unidad | sin vivo y sin foto → `load()` lanza; `submitLead` devuelve sin cifra y registra el lead | `fetch`, foto |
| CA-10 | unidad | un solo `load()` por envío; el mismo objeto llega a las cuatro funciones | espía |
| CA-13 | unidad | `fetch` que nunca resuelve → a los 3 s, `source:'snapshot'` | reloj + `fetch` |
| CA-14 | integración (vivo) | la llave de lectura no puede escribir ni borrar | — |
| CA-15 | integración | `catalog-gate` sin catálogo vivo → salida ≠ 0 y dice por qué | entorno |
| CA-16 | exhaustiva (semilla) + puerta (vivo) | ninguna combinación se sale del rango oficial | nada |
| CA-17 | puerta de secretos | ni multiplicadores, ni puntos, ni umbral en `.next/static` | — |
| CA-18 | integración (vivo) | la llave pública no puede leer el catálogo | — |
| CA-19 | puerta | `catalog-gate` falla si el vivo ya no da 28000–35000 | — |

**El fichero dorado es la pieza crítica y va primero.** Antes de tocar una línea, se genera desde el
código actual un fichero con el rango de **toda** combinación posible. Se commitea. Después de la
mudanza, la misma prueba debe dar exactamente lo mismo. Sin ese fichero, CA-11 es incomprobable:
comparar el código nuevo consigo mismo no demuestra nada.

**Las dos puertas nuevas se prueban en los dos sentidos** (lección de `S-0032`): plantar un catálogo
vivo malo → roja; quitarlo → verde. Una puerta que nunca se ha visto fallar no se sabe si funciona.

## §6 — Secuencia

| # | Paso | Se puede verificar solo con |
|---|---|---|
| 0 | Fichero dorado desde el código **actual**, commiteado | el fichero existe y la prueba pasa contra el código de hoy |
| 1 | `catalog-types` + `catalog-seed` (mismos valores) + `catalog-validation` | pruebas unitarias; suite verde sin tocar el núcleo |
| 2 | Inyectar el catálogo en las cuatro funciones del núcleo y en `submitLead` | suite verde + **dorado idéntico** |
| 3 | `catalogo.sql` y ejecutarlo contra el Supabase real | consultas de comprobación; CA-03/04/05/12/14/18 |
| 4 | `ports/catalog.ts` con repliegue, espera máxima y procedencia | unitarias con `fetch` fingido |
| 5 | `actions.ts` carga y pasa; `buildInternalNotice` declara la foto | unitarias + integración |
| 6 | `snapshot-catalog.mjs` en `prebuild` | CA-08 en los dos sentidos |
| 7 | `catalog-gate.mjs` en `verify.sh` + `secret-gate` vigila la llave nueva | CA-15/CA-19 en los dos sentidos |
| 8 | Pasada completa de `verify` + prueba de extremo a extremo contra producción | verde |

Pasos 0→2 no tocan la base y dejan la suite verde en cada parada: si algo sale mal, se vuelve atrás
sin haber tocado nada externo. El paso 3 es el primero irreversible.

## §7 — Riesgos

| # | Riesgo | Disparador | Impacto | Mitigación |
|---|---|---|---|---|
| **R-1** | **La mudanza cambia una cifra sin que nadie lo note** | Un error de transcripción al sembrar; un redondeo que se comporta distinto al venir de la base (`numeric` vs literal) | Rangos equivocados con el membrete de Nexus. El peor fallo posible de este proyecto | Fichero dorado (paso 0) **antes** de tocar nada, comparado en cada parada. Y sembrar la base **desde** `catalog-seed.ts`, no tecleando a mano |
| **R-2** | `numeric` de Postgres llega como cadena por la API REST | Siempre, si no se convierte | Multiplicaciones sobre cadenas → `NaN` o concatenación silenciosa | `validateCatalog` convierte y **rechaza** lo que no sea número finito. Es exactamente lo que ese módulo existe para atrapar |
| **R-3** | La llave de solo lectura acaba siendo la de servicio «porque ya está ahí» | Prisa al configurar Vercel | CA-14 pasa a ser decorativo; el sitio podría escribir precios | `secret-gate` vigila ambas por separado; CA-14 se prueba contra el vivo, no se razona |
| **R-4** | La publicación empieza a fallar por una caída de Supabase | CA-08 es estricto a propósito | No se puede publicar mientras la base esté caída | Aceptado y consciente: publicar sin foto deja el sitio sin la red que la spec promete. Se documenta en el README de la tool |
| **R-5** | El caso de referencia se pone rojo al actualizar un precio y alguien lo «arregla» borrándolo | Enero de 2027 | Se pierde la vigilancia del principio 16 | El mensaje de fallo dice literalmente qué hacer: actualizar la cifra esperada, no borrar la prueba |
| **R-6** | Una consulta más por envío en una función de Vercel | Cada formulario | Latencia. `constitution 26`: sin presupuesto | Aceptado. Un viaje, con tope de 3 s |

**Vuelta atrás.** Los pasos 0–2 son un `git revert`. A partir del 3 hay tablas creadas, pero mientras
`actions.ts` no cargue de la base (paso 5) el sitio sigue funcionando exactamente igual. La vuelta
atrás real es revertir el paso 5: el núcleo vuelve a recibir la semilla y nada más cambia.

## §8 — Aislamiento

`main` es la rama por defecto, así que **aislar no es opcional**. El trabajo va a una rama propia,
`feat/catalogo-en-supabase`, y se fusiona en `ship`.

---

## §9 — Tareas

Orden de §6 sliceado. `∥` = puede correr en paralelo con la anterior. Cada comprobación es literal:
se ejecuta, no se interpreta.

| # | Tarea | Comprobación literal | Dep. | Traza |
|---|---|---|---|---|
| T01 | Generar el **fichero dorado** desde el código de HOY: toda combinación (reto × necesidad × tamaño × madurez × urgencia) → su rango | `npm test` verde con la prueba dorada incluida, **sin haber tocado `catalog.ts`** | — | CA-11 |
| T02 | `core/catalog-types.ts`: la forma `Catalog` | `npm run typecheck` verde | T01 | §3 |
| T03 | `catalog.ts` → `catalog-seed.ts`, mismos valores, exportando un `Catalog` | prueba: cada campo de la semilla == la constante que sustituye | T02 | §0 |
| T04 | `core/catalog-validation.ts` con los límites de §0 | pruebas: acepta la semilla; rechaza min>max, negativo, multiplicador 50, punto 99, unidad inventada, cadena donde iba número, falta un servicio | T02 | CA-03/04/05/12, R-2 |
| T05 | Inyectar en `priceService` y `resolveService` | `npm test` verde + **dorado idéntico** | T03 | CA-11 |
| T06 ∥ | Inyectar en `scoreLead` y `mapOutcome` | `npm test` verde + dorado idéntico | T03 | CA-11 |
| T07 | `submitLead` recibe `LoadedCatalog` en `deps`; una sola carga por envío | prueba con espía: `load()` se llama exactamente una vez; el mismo objeto llega a las cuatro | T05, T06 | CA-10 |
| T08 | `01-TOOLS/SUPABASE/catalogo.sql`: cuatro tablas, `CHECK`s, disparador de los seis, RLS sin policies, `revoke` | ejecutado contra el Supabase real; las consultas de comprobación del pie del fichero dan lo esperado | T04 | CA-03/04/05/12/18 |
| T09 | Función `catalogo_vigente()` | RPC real devuelve un jsonb que `validateCatalog` acepta y es **igual** a la semilla | T08 | CA-07, §4 |
| T10 | Sembrar la base **desde `catalog-seed.ts`**, no a mano | script de siembra; `catalogo_vigente()` == semilla, campo a campo | T09 | R-1 |
| T11 | Llave de **solo lectura** creada y probada | con esa llave: leer ✓, escribir ✗, borrar ✗ | T08 | CA-14 |
| T12 | `ports/catalog.ts`: `SupabaseCatalogPort` + repliegue + espera 3 s + procedencia | unitarias con `fetch` fingido: ok→live; 500→snapshot; inválido→snapshot; nunca resuelve→snapshot a los 3 s; sin foto→lanza | T04, T09 | CA-06/07/09/13 |
| T13 | `actions.ts` carga una vez y pasa | prueba de integración del recorrido completo | T07, T12 | CA-10 |
| T14 | `buildInternalNotice` declara la foto y su fecha; `RedactedOutcome` no | prueba: aviso interno contiene la fecha; el resultado del lead no contiene «foto» ni fecha alguna | T13 | CA-06, const. 11 |
| T15 | `scripts/snapshot-catalog.mjs` + `prebuild` | **dos sentidos**: sin credenciales en modo producción → salida ≠ 0; con credenciales → foto escrita y válida | T09 | CA-08 |
| T16 | `scripts/catalog-gate.mjs` en `verify.sh` | **dos sentidos**: precio del diagnóstico movido en la base → roja; devuelto → verde. Sin catálogo vivo → salida ≠ 0 diciendo que no pudo ejecutarse | T09 | CA-15/19, CA-16 |
| T17 | `secret-gate.mjs` vigila la llave de lectura | **dos sentidos**: llave plantada en `.next/static` → roja; quitada → verde | T11 | CA-17, R-3 |
| T18 | Pasada completa de `verify` | `bash scripts/verify.sh` → VERDE | todas | DoD |
| T19 | Prueba de extremo a extremo contra producción | cambiar un precio en la base → el formulario real lo usa sin publicar | T18 | CA-02 |

**T01 es innegociable y va primero.** Es la única tarea que no se puede hacer después: en cuanto se
toque `catalog.ts`, el fichero dorado ya no se puede generar desde «el código de antes».

### Estado al 2026-09-14

| Tareas | Estado |
|---|---|
| T01–T07, T12–T15, T17 | ✅ **hechas y verificadas.** 364 pruebas, 96,2 % de cobertura, dorado sin divergencias, las dos puertas nuevas vistas fallar y pasar |
| T16 | ◐ **escrita y probada en rojo.** El verde necesita la base sembrada |
| T08–T11, T18, T19 | ⏳ **bloqueadas: requieren a Jose.** Ejecutar `catalogo.sql` contra el Supabase real, sembrarlo, y crear la llave con rol `catalogo_lector` en el panel. Ni la ejecución de DDL contra la base de producción ni la emisión de una credencial son cosas que deba hacer un agente por su cuenta |

**T13 creció sobre lo previsto.** Al cablear se descubrió que las páginas públicas publican los
rangos oficiales leyendo el mismo catálogo (`S-0035`), así que también se cablearon, con
`revalidate = 300`. Siguen siendo HTML estático prerenderizado.

**Apareció una tarea que el plan no tenía:** cerrar el camino en que `loadCatalog()` lanza y la
excepción sube hasta la acción de servidor, que habría perdido el lead. `submitLead` acepta ahora
`catalog: null` y guarda el lead sin cifra (CA-09).
