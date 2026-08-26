---
type: analysis
title: Analysis — Landing y estimador de presupuesto de Nexus
description: Puerta de consistencia previa a implementar. Cross-lectura de constitución, spec, plan y tareas. 3 findings HIGH, 0 CRITICAL.
tags: [sdd, analyze, gate]
timestamp: 2026-08-26T16:30:00Z
topic: sdd
slug: landing-presupuestos-nexus
status: stable
---

# Analysis — Landing y estimador de presupuesto de Nexus

> Constitución: [../constitution.md](../constitution.md) · Spec: [../specs/landing-presupuestos-nexus.md](../specs/landing-presupuestos-nexus.md) · Plan y tareas: [../plans/landing-presupuestos-nexus.md](../plans/landing-presupuestos-nexus.md)
> Ejecutado: 2026-08-26 · Punto en el tiempo; se sobrescribe en cada pasada.

## GATE: PASS — tras una vuelta de corrección

**Primera pasada: 0 CRITICAL · 3 HIGH · 5 MEDIUM · 3 LOW → BLOCKED.**
Los findings se enrutaron a `plan` (F-1, F-4, F-6) y a `tasks` (F-2, F-3, F-5, F-7, F-8, F-11), se
corrigieron y se volvió a pasar la puerta. **Segunda pasada: 0 CRITICAL · 0 HIGH.** F-9 y F-10 se
aceptan conscientemente como LOW (una duplicación deliberada y una tarea de infraestructura del
método). Ninguno tocó el spec ni la constitución.

### Qué cambió al corregir

| Finding | Corrección aplicada | Dónde |
|---|---|---|
| F-1 | Regla explícita de selección de adaptador: en producción sin credencial se usa un adaptador que **siempre falla**, nunca el falso | plan §3 |
| F-2 | Tareas T032 y T033: `01-TOOLS/RESEND/` y `01-TOOLS/GOOGLE/` con `.env` y `test_connection.sh` | plan §Tasks |
| F-3 | El done-check de T024 exige la advertencia en pantalla; se añade CA-05 a su trace | plan §Tasks |
| F-4 | El nivel *componente* se declara en la estrategia de pruebas | plan §5 |
| F-5 | Bloques Interfaces para T015, T017, T019 y T023 | plan §Tasks |
| F-6 | El endurecimiento del listón a todo `src/core/` se declara deliberado, con su porqué | plan §0 |
| F-7 | Tarea T034: prueba de que abandonar no despacha nada | plan §Tasks |
| F-8 | T026 ejecuta la lista escrita de T036 en vez de un recorrido de memoria | plan §Tasks |
| F-11 | Tarea T035: `scripts/snapshot.sh`, que vuelve ejecutable la casilla de copia previa del DoD | plan §Tasks |

**Defecto introducido y corregido durante la propia corrección:** T033 nació haciendo dos cosas sin
relación (tooling de Google + lista de recorrido manual), lo que encadenaba el cableado del formulario
al adaptador de Google sin motivo. Se dividió: T033 queda como tooling, **T036** toma la lista. Total:
**36 tareas**.

## Mapa de cobertura

| REQ | Requisito (corto) | Plan | Tarea(s) | Estado |
|---|---|---|---|---|
| CA-01 | Caso de referencia → 28.000–35.000 | §5 | T006, T007 | covered |
| CA-02 | Toda combinación dentro del rango oficial | §3, §5 | T010 | covered |
| CA-03 | Rango abierto → techo «a confirmar» | §3 | T006, T007 | covered |
| CA-04 | Advisory como cuota mensual | §3 | T006, T007 | covered |
| CA-05 | Advertencia **en pantalla y en el email** | §3 | T014, T015 (sólo email) | **GAP (pantalla)** |
| CA-06 | Nada interno llega al navegador | §2, §3, §5 | T012, T013 | covered |
| CA-07 / CA-08 | Pregunta 2 sólo si el reto es IA | §3 | T004, T005, T022 | covered |
| CA-09 | Sin catalogar → ninguna cifra en € | §3 | T005, T013, T024 | covered |
| CA-10 / CA-11 | Puntuación y calendario de los dos perfiles | §3 | T008, T009, T024 | covered |
| CA-12 | Sin catalogar + supera umbral → calendario sin cifra | §3 | T012, T013, T024 | covered |
| CA-13 | Umbral en un único punto | §0, §3 | T012, T013 | covered |
| CA-14 | El lead no ve puntuación ni umbral | §2, §3 | T012, T013 | covered |
| CA-15 / CA-16 | Dos correos; el interno con desglose | §3, §4 | T020, T021 | covered |
| CA-17 | Fallo de correo → el lead ve su pantalla | §3, §4 | T020, T021 | covered |
| CA-18 | Doble envío → un solo despacho | §4 | T020, T021 | covered |
| CA-19 | Tono verificado con acta humana | §5 | T030 | covered |
| CA-20 | Propuesta sin secciones etiquetadas | §3 | T014, T015 | covered |
| CA-21 / CA-22 | Bordes 250 empleados y 6 meses | §5 | T006, T007 | covered |
| CA-23 | Opciones sin solape | §5 | T011 | covered |
| CA-24 | La llamada se nombra con duración y propósito | §3 | T014, T015, T024 | covered |
| spec §Error | Abandono a media pregunta → no se envía nada | — | — | **AMBIGUOUS** |
| — | Configuración `sdd-init` | — | T002 | drift menor (infraestructura de método) |

## Findings

| # | Sev | Tipo | Artefacto A | Artefacto B | Conflicto | Resolver en |
|---|---|---|---|---|---|---|
| F-1 | **HIGH** | Contradicción | plan §Tasks T017, T019 («sin credenciales… cae al falso sin romper») | spec CA-17 + constitution 8 | El repliegue al adaptador falso **no distingue desarrollo de producción**. En producción sin `RESEND_API_KEY`, el `Dispatcher` usaría el falso, `DispatchReport` diría `ok`, y **cada lead desaparecería en silencio** creyendo el equipo que todo funciona. Es exactamente el fallo invisible que CA-17 existe para impedir | `plan` |
| F-2 | **HIGH** | Constitución | constitution 21 («credenciales en `01-TOOLS/<proveedor>/.env`») + `CLAUDE.md` §Tooling | plan §Tasks (T017, T019 usan `RESEND_API_KEY` sin decir dónde vive) | Ninguna tarea crea `01-TOOLS/RESEND/` ni `01-TOOLS/GOOGLE/` con su `.env` y su `test_connection`. Las credenciales acabarían en un `.env.local` ad hoc, fuera de la convención del workspace | `tasks` |
| F-3 | **HIGH** | GAP de cobertura | spec CA-05 («en pantalla **y** en el email») + constitution 5 | plan §Tasks T024 (trace: CA-09, CA-11, CA-12, CA-24) | La advertencia de «orientativo y sujeto a alcance» sólo está trazada al correo (T015). Ninguna tarea comprueba que aparece **en la pantalla de resultado**, que es donde el lead la lee primero | `tasks` |
| F-4 | MEDIUM | Contradicción | plan §5 (niveles: unit / integración; «no hay navegador automatizado») | plan §Tasks T022, T023, T024, T025, T027 (done-checks de componente y de accesibilidad) | La estrategia de pruebas no declara el nivel *componente*, pero cinco tareas lo usan. Falta decir con qué se ejerce el DOM y qué se falsea ahí | `plan` |
| F-5 | MEDIUM | Carrier incompleto | plan §Tasks: sin bloque Interfaces en T015, T017, T019, T023 | `tasks` §Per-task Interfaces | Un implementador aislado que reciba T017 no sabe la firma de `EmailPort` (la define T016) y tendrá que inventarla. Igual para T019/T018 y para la forma del contacto en T023 | `tasks` |
| F-6 | MEDIUM | Constitución (endurecimiento) | constitution 13, 14 («ningún `any` **en los dos motores**», «≥95 % **en ese módulo**») | plan §0 («ningún `any` en `src/core/`», «≥95 % en `src/core/`») | El plan aplica el listón a **todo** `src/core/`, que incluye `ServiceResolver`, `OutcomeMapper` y `ProposalComposer`. Es más estricto que la constitución, no menos — pero es una divergencia que conviene decidir a propósito y no descubrir cuando la puerta de cobertura falle | `plan` |
| F-7 | MEDIUM | AMBIGUOUS | spec §Caminos de error («el lead abandona a media pregunta: no se envía nada») | plan §Tasks: ninguna | Se cumple trivialmente porque el envío sólo ocurre al final, pero nada lo verifica. Si mañana alguien añade autoguardado, nadie se entera de que rompió esta regla | `tasks` |
| F-8 | MEDIUM | AMBIGUOUS | plan §Tasks T026 (done-check: «recorrido manual de los tres perfiles») | `tasks` §El done-check | Media comprobación es manual. Aceptable porque la mitad automática (`npm test` completo) sí es ejecutable, pero conviene que el tramo manual quede como lista escrita y no como criterio de memoria | `tasks` |
| F-9 | LOW | Duplicación | spec CA-06 | spec CA-14 | Afirman casi lo mismo (nada interno llega al navegador). El plan §5 ya lo reconoce («comparte aserción con CA-06»). No es defecto; se anota para que nadie lo «arregle» borrando uno | — |
| F-10 | LOW | Drift menor | plan §Tasks T002 (`sdd-init`) | spec | No traza a ningún requisito de producto: es infraestructura del método, no alcance. Legítimo, se anota | — |
| F-11 | LOW | Constitución | constitution 19 («copia previa antes de cambio estructural») + §Definition of Done | plan §Tasks: ninguna | El DoD incluye la copia previa pero ninguna tarea la lleva. Es regla de proceso, no entregable — pero un DoD con una casilla que nadie ejecuta es un DoD que se empieza a ignorar entero | `tasks` |

## Enrutado recomendado

| Fase | Findings | Qué tiene que hacer |
|---|---|---|
| `plan` | F-1, F-4, F-6 | Distinguir desarrollo de producción en el repliegue de adaptadores (F-1 es el único con consecuencia sobre un lead real). Declarar el nivel *componente* en §5. Decidir a propósito el alcance del listón de calidad |
| `tasks` | F-2, F-3, F-5, F-7, F-8, F-11 | Añadir las tareas de `01-TOOLS/`, la comprobación de la advertencia en pantalla, los bloques Interfaces que faltan y las dos verificaciones de proceso |
| `clarify` / `constitution` | ninguno | El spec y la constitución están sanos: los tres HIGH nacen del plan y de la lista, no de los requisitos |

**Nota de la puerta:** que ningún finding vuelva a `clarify` es la señal de que la pasada de
clarificación hizo su trabajo. Lo que falla aquí es traducción —del *qué* al *cómo*—, no el *qué*.
