---
type: article
title: Instrucciones Raíz del Workspace
description: Cómo está gobernado este workspace: las dos capas de instrucciones, el arnés rsc y sus guardianes.
tags: [meta, gobierno, arnes]
timestamp: 2026-08-26T10:41:41Z
aliases: [instrucciones-raiz-del-workspace]
topic: meta
status: stable
sources: ["CLAUDE.md; AGENTS.md, 2026-08-26"]
score: 6.0
---

# Instrucciones Raíz del Workspace

> Sources: CLAUDE.md y AGENTS.md del workspace, 2026-08-26
> Raw: (los propios ficheros raíz — no se duplican en `raw/`)

## Overview

Dos ficheros en la raíz gobiernan cómo trabaja cualquier agente aquí. `CLAUDE.md` es el cartel de
entrada específico del proyecto; `AGENTS.md` es la capa siempre-activa del arnés rsc. Se leen en cada
turno, así que su tamaño es un impuesto permanente de contexto: por eso el índice completo vive en
`02-DOCS/wiki/index.md` y no ahí.

## CLAUDE.md — el proyecto

Contiene: qué es el proyecto y sus reglas de producto no negociables, el **Knowledge map** (puntero
corto a los dos ficheros de lectura obligada), el mapa del workspace, las reglas de trabajo, los
comandos y el catálogo de tooling. Regla de crecimiento: por debajo de ~200 líneas. Cuando el índice
crece, se **mueve** a `wiki/index.md` y en la raíz queda el puntero.

## AGENTS.md — la capa rsc-suggest

Se inyecta al principio de cada sesión y tras cada compactación. Dos trabajos: **enrutar intención de
feature hacia SDD** antes de escribir código, y **mantener la sesión equipada** proponiendo la skill
que falta. La regla dura: si alguien quiere que algo exista o se comporte distinto, la vía es
`specify` — no se salta por muy claro que parezca el camino. Dos excepciones declaradas: cambios de
una línea sin riesgo, y arreglar un bug (eso es `debug`).

## Guardianes activos

Configurados como hooks en `.claude/settings.json`:

- **danger-guard** — bloquea comandos irreversibles. Activo porque el perfil es no técnico. Es
  estricto por diseño: llegó a bloquear un comando cuyo único delito era *mencionar* esos comandos
  dentro de un fichero de documentación.
- **ship-guard** y **gitmoji-guard** — disciplina al publicar y en los mensajes de commit.
- **worklog-checkpoint** — en `PreCompact` y `SessionEnd`, recuerda capturar el trabajo de la sesión
  en `raw/worklog/`.
- **session-start** y **userprompt-gate** — inyectan la capa siempre-activa y vigilan cada turno.

## Sin control de versiones

Este workspace **no es un repositorio git** (D-0008, marca `.rsc/.no-git`). No hay historial ni forma
de deshacer cambios pasados. Es una decisión explícita del usuario, revisable borrando la marca.

## Related

- [Landing de Captación de Leads](../producto/Landing%20de%20Captacion%20de%20Leads.md) — el producto que este workspace gobierna.
- [Arsenal Operativo](../operations/Arsenal%20Operativo.md) — la capa `01-TOOLS/`.
- [User Profile](../harness/user-profile.md) — cómo hay que hablarle al usuario.
- [Decisions](../harness/decisions.md) — por qué el workspace es como es.
- [Skill Audit 2026-08-26](../harness/skill-audit-2026-08-26.md) — qué skills están instaladas y por qué.
