# Wiki Log

## [2026-09-02] ingest | Marca canónica, design system y base de SEO/GEO — ordenado, no ejecutado

Sesión de **ordenación** a petición del usuario: *"conforme al harness ordena lo que tienes para luego
ejecutarlo yo"*. No se ha escrito ni una línea de la app, ni spec, ni plan, ni página.

- **Resuelto el conflicto de marca.** El proyecto tenía dos identidades incompatibles. El usuario
  eligió **Nexus Consulting** (`D-0015`). Compilado
  [Marca Nexus Consulting](firma/Marca%20Nexus%20Consulting.md) desde el masterprompt aportado.
- Fetch: `referencias/` copiado al cerebro (`D-0017`) — masterprompt a `raw/firma/_originals/`,
  landing y presentación a `raw/producto/_originals/`. Hash verificado en los tres.
- **Design system instalado como skill** del proyecto en `.claude/skills/nexus-consulting-design/`
  (`D-0016`). 12 MB → 6,6 MB deduplicando tres PNG byte a byte idénticos.
- Created: [SEO frente a GEO](seo-geo/SEO%20frente%20a%20GEO.md) — topic nuevo `seo-geo`, destilado del
  estudio de Princeton (arXiv:2311.09735, KDD 2024) y de la skill `seo-geo`.
- Decisions: `D-0015`, `D-0016`, `D-0017` en [harness](harness/decisions.md); `S-0014` (adopta el
  design system, **deroga S-0003**) y `S-0015` (alcance SEO+GEO) en [sdd](sdd/decisions.md).
- Updated: [user-profile](harness/user-profile.md) — cerrada la pregunta abierta de identidad visual.
- **Conflicto anotado, no reconciliado**: los tres artículos de `firma/` describen la marca derogada.
  Llevan aviso de superación y se conservan porque siguen siendo la fuente del catálogo de precios.
- 5 huecos nuevos en [gaps.md](gaps.md). El primero **bloquea** el copy de servicios: el catálogo de
  precios pertenece a la marca derogada y vende ESG y ciberseguridad, que Nexus Consulting no ofrece.

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

## 2026-09-02 — implement `sitio-nexus-consulting`
- Constitución v1.1.0 (S-0017). Spec, plan (39 tareas) y análisis (BLOCKED→PASS) indexados.
- Implementado el sitio de Nexus Consulting en `03-APP`: seis páginas, estimador re-vestido, capa SEO/GEO, puerta `seo-gate`.
- Nuevos artículos: `stack/design.md`, `stack/nextjs.md`; `tone-checklist.md` reescrito sobre S1–S12.
- Añadida `/antes` (S-0021): snapshot del estimador original recuperado de `main`, `noindex`, fuera del sitemap, envío simulado. `verify.sh` verde tras el añadido.
- Corregido S-0022: el museo heredaba color del sitio nuevo (texto claro sobre crema). Acotado a `.legacy.legacy` + color heredado restituido, con prueba de regresión. 206 pruebas.

## [2026-09-09] update | conexión a Vercel
- Creada la tool `01-TOOLS/VERCEL/` (README, `.env.example`, `CREDENTIALS.md`, `test_connection.sh`). Sin `.env` real: el token lo pega el usuario.
- Updated: 01-TOOLS/README.md (catálogo con RESEND, GOOGLE y VERCEL; flujos comunes), CLAUDE.md raíz (tabla de tooling).
- Updated: harness/decisions.md (`D-0018` — publicación en Vercel desde el repositorio, Root Directory `03-APP`), harness/user-profile.md (pregunta abierta "¿dónde se publica?" resuelta; dominio sigue abierto).
- Updated: [Arsenal Operativo](operations/Arsenal%20Operativo.md) — decía "vacío a propósito" y ya había tres tools.

## 2026-09-15 — cierre de `catalogo-en-supabase` y puesta en marcha
- La base de datos, creada y sembrada por Jose: seis tablas, catálogo completo, las dos tareas programadas activas (`nexus-retencion-leads`, `nexus-limpieza-intentos`).
- `verify` completo **VERDE**, las siete puertas — la del catálogo vivo ya contra la base real: caso de referencia 28.000 – 35.000 €, 504 combinaciones.
- **T19 hecha contra producción** (CA-02): precio cambiado en la base → el formulario real devolvió 30.000 – 35.000 €; restaurado → 28.000 – 35.000 €. Cero despliegues entre medias. Los dos envíos quedaron como leads en la tabla, marcados `Executive Lab (prueba T19)`.
- Corregido el defecto del buzón interno: `oportunidades@nexus.ad` (dominio sin correo) → `jose.sanchis@executivelab.ai`.
- Nuevos: `sdd/verifications/catalogo-en-supabase-2026-09-15.md`, `S-0038`, `S-0039`. Updated: plan del catálogo (estado final), acta del 14 (marcada como superada), `harness/user-profile.md` (buzón), `01-TOOLS/VERCEL/README.md` (variables del panel, aviso del buzón resuelto).

## 2026-09-30 — specify + plan `agenda-y-preparacion-de-llamadas`
- Diagnóstico previo: la reserva del lead cualificado no existe en producción (`NEXT_PUBLIC_CALENDAR_URL` vacía) y su correo afirma «cita confirmada». La prueba de humo de Vercel falla (token, HTTP 404); la de Google, sin credenciales, es la esperada.
- Nuevos: `sdd/specs/agenda-y-preparacion-de-llamadas.md` (draft), `sdd/plans/agenda-y-preparacion-de-llamadas.md` (draft), `S-0040`, `S-0041`.
- Updated: `index.md` (filas de spec y plan).
- Pendiente de Jose: aprobar spec y plan; bloqueos B1–B10 del plan §6.2.

## 2026-09-30 — implement `agenda-y-preparacion-de-llamadas` (lo que se podía hacer ya)
- **Fuera de plan:** `next build` dejó de compilar, también en `main` (Turbopack con Sora de Google Fonts). Las fuentes pasan al repositorio (`S-0042`, PR #2).
- PR #3 (apilado sobre #2): el correo del cualificado deja de afirmar «cita confirmada» y lleva el enlace de reserva si existe; la pantalla deja de prometer una reserva inmediata; un solo criterio de «hay enlace».
- PR 2 de la funcionalidad (apilado sobre #3): el veredicto y la versión del aviso se guardan con cada lead; aviso firmado a n8n con su contrato v1; puerta de secretos ampliada; aviso de privacidad de la fase A.
- Sin aplicar: `01-TOOLS/SUPABASE/agenda.sql` (probado en un Postgres local efímero).
- Nuevos: `01-TOOLS/{N8N,SLACK,PERPLEXITY}/`, `stack/n8n-agenda.md`, `producto/Borrador aviso de privacidad - agenda.md`, `sdd/progress/agenda-y-preparacion-de-llamadas.md`, `sdd/analysis/agenda-y-preparacion-de-llamadas.md`.
- Pendiente de Jose: B1–B10 del plan, actas de tono S5, S9, S10 y S15, y la base legal de la fase B.
