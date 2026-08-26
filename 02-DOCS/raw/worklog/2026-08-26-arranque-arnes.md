---
type: worklog
title: Arranque del arnés en nexus_presupuestos
topic: harness
timestamp: 2026-08-26T12:00:00Z
status: processed
---

# Arranque del arnés en nexus_presupuestos

## Qué hicimos

Primer contacto de `init` (perfil no técnico + L3, español) y protocolo completo de `harness`
(SCAN → AUDIT → CONSENT → APPLY → VERIFY) sobre un workspace greenfield que solo contenía el arnés rsc.

## Por qué

El usuario pidió "inicia el arnés para este proyecto". Sin `02-DOCS/wiki/harness/user-profile.md` ni
`.rsc/.no-harness`, la regla de primer contacto obliga a `init` antes de cualquier trabajo.

## Decisiones tomadas

- Perfil: non-technical + L3 + es (D-0001). Confirmado tras detectar la tensión con el Masterprompt.
- Dominio: software (D-0002). Sub-agente developer en tier balanced (D-0003).
- Base técnica: Next.js App Router sobre Astro y sobre página estática (D-0004).
- Skills instaladas: nextjs, design, email-connector, landing-copy, deployment, gdpr-privacy (D-0005).
- Sin git en esta carpeta (D-0008), con la consecuencia asumida por escrito.

## Ficheros tocados

- `CLAUDE.md` — creado por `init`, ampliado por `harness` (merge aditivo, 74 líneas).
- `02-DOCS/wiki/harness/{user-profile,decisions}.md` — perfil y diario append-only.
- `01-TOOLS/` — esqueleto con `_TEMPLATE/` únicamente; cero proveedores (sin evidencia en código).
- `02-DOCS/` — capa completa: inbox, raw, wiki (12 artículos, 6 topics), bases de Obsidian, .rscignore.
- `02-DOCS/raw/{firma,comercial}/` — extracción de los dos PDF + originales verificados por hash.

## Hallazgo del día

A mitad de sesión aparecieron dos PDF en la raíz: `Masterprompt.pdf` (marco operativo del CEO de Nexus
Strategy & Technology) y `Estimacion Economica.pdf` (documento interno con el catálogo oficial 2026, el
método de estimación en 4 pasos y el sistema de cualificación). Contenían la especificación real del
producto y respondieron la pregunta que el usuario había dejado abierta ("¿muestra cifra?" → sí, rango
orientativo, nunca precio cerrado). Se ingestaron y compilaron en 7 artículos.

## Incidencias

- `npx @ericrisco/rsc add` instaló solo en el destino `codex`; hubo que repetir con `--target claude`.
  `sync` no propaga entre destinos.
- El danger-guard bloqueó un comando cuyo único delito era *mencionar* comandos peligrosos dentro de
  un fichero de documentación. Falso positivo por diseño conservador.
- Un heredoc sin comillas ejecutó tres backticks como comandos y dejó huecos en un artículo. Detectado
  por verificación posterior y reescrito con heredoc protegido.

## Abierto / siguiente

Materia prima suficiente para `specify`. Sin decidir: integración de calendario, proveedor de email,
dominio de publicación, volumen esperado, y si la landing hereda la identidad visual de los PDF.

## Comandos

```bash
npx @ericrisco/rsc add <ids> --target claude
npx @ericrisco/rsc audit
bash -n 01-TOOLS/*/test_connection.sh
```
