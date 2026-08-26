# Wiki Log

## [2026-08-26] worklog | arranque-arnes → 0 artículos nuevos, 3 decisiones enrutadas
- Capturado: [raw/worklog/2026-08-26-arranque-arnes.md](../raw/worklog/2026-08-26-arranque-arnes.md) (status: processed)
- Decisiones enrutadas a harness/decisions.md: D-0009 (taxonomía de topics), D-0010 (cálculo en servidor), D-0011 (nota sobre el hueco de numeración)
- Updated: [User Profile](harness/user-profile.md) — 4 preguntas abiertas cerradas por las fuentes ingestadas

## [2026-08-26] maintenance | autofixes: 0, new See Also: 1, gaps detected: 2
- Lint determinista: 12 artículos, 0 enlaces internos roto, 0 referencias raw roto, índice consistente.
- Cross-link sweep: añadido meta/Instrucciones Raíz → harness/skill-audit (era el único huérfano).
- Scores recalculados y sincronizados en index.md y en el frontmatter de cada artículo.
- Gaps detectados por la regla de ≥3 menciones: «llamada de alcance», «sponsor en dirección».

## [2026-08-26] ingest | bootstrap: 4 fuentes → 12 artículos
- Ingested: Estimacion Economica.pdf → [Catálogo](comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md), [Método](comercial/Metodo%20de%20Estimacion%20Economica.md), [Cualificación](comercial/Cualificacion%20de%20Oportunidades.md), [Landing](producto/Landing%20de%20Captacion%20de%20Leads.md)
- Ingested: Masterprompt.pdf → [Identidad](firma/Identidad%20y%20Posicionamiento%20de%20Nexus.md), [Criterio de Decisión](firma/Criterio%20de%20Decision%20de%20la%20Firma.md), [Voz](firma/Voz%20de%20Nexus%20por%20Escrito.md)
- Ingested: CLAUDE.md + AGENTS.md → [Instrucciones Raíz del Workspace](meta/Instrucciones%20Raiz%20del%20Workspace.md)
- Ingested: 01-TOOLS/README.md → [Arsenal Operativo](operations/Arsenal%20Operativo.md)
- Updated: harness/user-profile.md, harness/decisions.md, harness/skill-audit-2026-08-26.md (frontmatter OKF añadido, contenido intacto)
- Los dos PDF originales se movieron de la raíz a raw/<topic>/_originals/ con verificación de hash SHA-256.

## [2026-08-26] init | capa 02-DOCS inicializada
- Creados inbox/ (+README, _processed/), raw/ (+worklog/), wiki/ (index, log, gaps, scores, .ingested), reports/, attachments/, audits/.
- Vault de Obsidian: Articles.base, Worklog.base, Decisions.base, .obsidian/app.json (enlaces markdown relativos, sin wikilinks).
- Límite de escaneo: .rscignore. Sin base vectorial, sin embeddings, sin RAG — navegación por estructura.
