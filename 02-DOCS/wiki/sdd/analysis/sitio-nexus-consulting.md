---
type: analysis
title: Analysis — Sitio web de Nexus Consulting
description: Puerta de consistencia previa a implementar — cruce de constitución v1.1.0, spec, plan y 39 tareas. BLOCKED en la primera pasada (1 CRITICAL, 1 HIGH, 4 MEDIUM, 6 LOW); los doce hallazgos se resolvieron en spec/plan/tasks el mismo día y la puerta queda PASS.
tags: [sdd, analysis, gate]
timestamp: 2026-09-02T16:05:00Z
topic: sdd
slug: sitio-nexus-consulting
status: stable
---

# Analysis — Sitio web de Nexus Consulting

> Ejecutada el 2026-09-02 por un subagente con contexto limpio (solo los cuatro artefactos). Punto en el
> tiempo: se sobrescribe en cada pasada.

## Veredicto

**Primera pasada: GATE: BLOCKED** — CRITICAL 1 · HIGH 1 · MEDIUM 4 · LOW 6.
**Tras resolver los doce hallazgos en los artefactos (mismo día): GATE: PASS** — 0 CRITICAL, 0 HIGH.
Los cambios se aplicaron en la spec (CA-21, C-01), el plan (§3, §5, §7, Forecast) y las tareas (T008,
T014, T036, T037, T038, T039) y en el comentario de `config.yaml`. Ningún cambio de arquitectura.

## Mapa de cobertura (CA → plan → tareas)

| CA | Plan | Tareas | Estado |
|---|---|---|---|
| CA-01 | §0 Marca/Estilo, §5 | T006, T008, T012, T025, T036 | covered |
| CA-02 | §0 Contraste, §5 | T003, T014 | covered |
| CA-03 | §0 Movimiento, §3 NodeField | T004, T015 | covered |
| CA-04 | §0 Copy, §5, §6.8 | T013, T037, **T038 (puerta humana tras verify)** | covered |
| CA-05 | §0 Copy, §5 | T008 (+img), T013 | covered |
| CA-06 · CA-07 | §3 seo-gate, §5 | T017, T027, T035, T036 | covered |
| CA-08 | §3 FormWizard/presupuesto, §4 | T026, T033, T034, T035 | covered |
| CA-09 | §3 services.public | T009, T016, T020, T026, T028 | covered |
| CA-10 · CA-11 | §5 | T017, T018, T029, T030, T036 | covered |
| CA-12 | §3 Contact/submit | T010, T011, T019, T031, T033, T034 | covered |
| CA-13 | §3 not-found | T020, T032, T036 | covered |
| CA-14 | §5 manual | T038 (puerta humana) | covered |
| CA-15 · CA-16 · CA-17 | §0 SEO, §3 | T005, T021, T023, T024, T036 | covered |
| CA-18 | §3 jsonld | T022, T027–T031, T035, T036 | covered |
| CA-19 · CA-20 | §3 seo-gate (ampliado) | T036 (+ T025/T026/T029) | covered |
| CA-21 | §0 Pruebas (reformulado) | T001, T009, T010, T011, T012, T039 | covered |
| CA-22 | §5 (conjunto exacto) | T016, T035, T036 | covered |
| CA-23 · CA-24 | §0 Rutas, §3 | T006, T007, T011, T012, T036 | covered |

## Hallazgos y resolución

| # | Sev. | Tipo | Conflicto | Resuelto en |
|---|---|---|---|---|
| F1 | CRITICAL | contradicción | CA-21 congelaba «validación» mientras C-02 exige `consent` en `validateContact` y en las fixtures | clarify → CA-21 y C-01 reescritos: motores sin tocar; validación gana el caso `consent`; fixtures solo aditivas |
| F2 | HIGH | cobertura | `seo-gate` (§3) no cubría CA-19 (jerarquía, `alt`), CA-20 (`text/plain`) ni CA-22 | plan §3 ampliado; T036 exige cada comprobación |
| F3 | MEDIUM | contradicción | acta humana (T038) en el camino crítico de T039 en autopilot | tasks → T038 es puerta humana entre `verify` y `ship`; `verify` la reporta pendiente |
| F4 | MEDIUM | ambigüedad | «valores del catálogo interno» incluía los rangos que CA-09 publica | plan §5 → conjunto cerrado de identificadores/valores internos |
| F5 | MEDIUM | contradicción | `tokens.ts` «generado» vs «lector» | plan → lector; sin exención del grep de hex |
| F6 | MEDIUM | cobertura | nadie anexaba decisiones de implementación ni notas legal/dominio | tasks → T037 ampliada |
| F7 | LOW | ambigüedad | T036 sin depender de T023/T024 | tasks → deps añadidas |
| F8 | LOW | contradicción | invariante «único sitio del nombre» falso en `core/` | plan §3 → acotado a la capa web; T008 vigila coherencia |
| F9 | LOW | contradicción | justificación de `exception` obsoleta | Forecast + comentario de `config.yaml` |
| F10 | LOW | ambigüedad | «sigue igual» no ejecutable; `ui.css` sin `motion.test` | tasks → T014 |
| F11 | LOW | ambigüedad | `areaServed` sin contraparte visible | plan §3 → eliminado |
| F12 | LOW | cobertura | comprobación de imágenes de stock sin done-check | tasks → T008 |

## Routing

Todas las rutas ejecutadas el 2026-09-02: `clarify` (F1), `plan` (F2, F4, F5, F8, F9, F11), `tasks`
(F2, F3, F6, F7, F10, F12). `constitution`: ninguna.
