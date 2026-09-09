# nexus_presupuestos

## Knowledge map

- [User profile](02-DOCS/wiki/harness/user-profile.md) — nivel técnico, dial de acompañamiento, objetivos, contexto y restricciones. **Toda skill lee esto primero y adapta su verbosidad y sus preguntas.**
- [Decisions log](02-DOCS/wiki/harness/decisions.md) — registro append-only de cada decisión significativa y su por qué.
- [Project constitution](02-DOCS/wiki/sdd/constitution.md) — **v1.1.0**, 36 principios no negociables del chain SDD y el Definition of Done que `verify` ejecuta. **Toda fase SDD lee esto antes de trabajar.**
- Índice completo → `02-DOCS/wiki/index.md` (lo crea la skill `harness`).

<!-- added by harness 2026-08-26 -->
## Qué es este proyecto

Sitio público de **Nexus Consulting** (marca canónica desde `D-0015`; antes *Nexus Strategy & Technology*) para captación de leads: un posible cliente
rellena un formulario, obtiene un **rango orientativo** de inversión para el servicio que encaja con
su reto, y el equipo comercial recibe la primera información cualificada. Nunca un precio cerrado.

Reglas de producto que no se negocian (fuente: `02-DOCS/wiki/comercial/`):

- Solo se estiman servicios del **catálogo oficial 2026**. Lo que no está catalogado deriva a
  llamada de alcance — nunca se aproxima por semejanza.
- La cifra entregada es **siempre un rango**, anclado al rango oficial del servicio, con la
  advertencia de que es orientativo y sujeto a alcance.
- **Nunca** se ofrece descuento ni se promete un plazo de entrega concreto.
- Los multiplicadores, la tabla de puntuación y el umbral de cualificación son **internos**: el
  cálculo se ejecuta en servidor. Nada de eso puede llegar al navegador del visitante.
- El umbral de cualificación vive en **un único punto de configuración**, no repartido por el código.

## Brand & voice

La marca canónica es **Nexus Consulting** (`D-0015`). Estudio de marca completo — esencia, claim,
audiencia, oferta, voz, léxico permitido y prohibido, paleta, tipografía, motivo visual —:
[Marca Nexus Consulting](02-DOCS/wiki/firma/Marca%20Nexus%20Consulting.md). Sistema visual ejecutable
(tokens, componentes, assets): skill del proyecto `.claude/skills/nexus-consulting-design/` (`D-0016`).
Toda superficie visual o de copy lee esto primero; la constitución lo hace exigible en los principios
27 y 30–36.

## Mapa del workspace

| Ruta | Rol |
|------|-----|
| `01-TOOLS/` | Arsenal operativo: una carpeta por proveedor externo, con credenciales co-localizadas y un `test_connection` que funciona. |
| `02-DOCS/` | Wiki LLM: fuentes inmutables en `raw/`, artículos compilados en `wiki/`, más `wiki/index.md` y `wiki/log.md`. Se abre como vault de Obsidian. |
| `02-DOCS/inbox/` | Zona de descarga. Cualquier fichero en cualquier formato; el sweep lo convierte en conocimiento. |

Este workspace **sí es un repositorio git** desde `D-0014`: `Executive-Lab/nexus-presupuestos`,
privado, rama `main`. Revoca D-0008 y D-0012; la constitución lo recoge desde la **v1.1.0**
(principios 18–20 enmendados el 2026-09-02). Los `.env` reales
(`01-TOOLS/RESEND/.env`, `03-APP/.env.local`) están fuera del repositorio por el `.gitignore` de la
raíz y deben seguir estándolo. La autoría de los commits es humana: sin `Co-Authored-By` de una IA
ni pie de "generado con" (principio 20).

## Reglas de trabajo

- Ignora salidas generadas salvo petición expresa: `node_modules/`, `.next/`, `.venv/`,
  `__pycache__/`, `build/`, `dist/`.
- Nunca publiques secretos. `01-TOOLS/**/.env`, `CREDENTIALS.md`, claves y tokens son sensibles
  aunque vivan dentro del workspace.
- Para cambios de UI, lee el documento de diseño canónico de la superficie afectada antes de editar.
- Para documentación, sigue el protocolo de wiki embebido en la skill `harness`: fuentes nuevas a
  `raw/<topic>/`, conocimiento destilado a `wiki/<topic>/`. La skill mantiene `index.md` y `log.md`.
- Antes de tocar arquitectura, lee `02-DOCS/wiki/producto/` y `02-DOCS/wiki/comercial/`: la
  especificación real del producto está ahí, no en el código.

## Comandos principales

La app vive en **`03-APP/`** (Next.js 16 App Router + TypeScript, npm). Todos se lanzan desde ahí:

| Comando | Para qué |
|---------|----------|
| `npm run dev` | Servidor de desarrollo. Sin credenciales usa adaptadores falsos: los correos salen por consola. |
| `npm run build` | Compilación de producción. Type-chequea también las pruebas. |
| `npm run lint` | Linter. **Cero avisos** es el listón (constitution 12). |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` | Vitest, toda la batería. |
| `npm run test:coverage` | Pruebas + puerta de cobertura ≥95 % en `src/core/`. |
| `bash scripts/verify.sh` | **La puerta completa**: lint + tipos + cobertura + build. Es lo que ejecuta la fase `verify`. |
| `bash scripts/snapshot.sh [etiqueta]` | Copia fechada en `.rsc/backups/`. Sustituye al historial ausente (constitution 19). |

Variables de entorno: ver `01-TOOLS/RESEND/.env.example` y `01-TOOLS/GOOGLE/.env.example`.
**En producción sin credenciales el envío falla ruidosamente a propósito** — nunca se repliega en
silencio a un adaptador falso.

## Tooling operativo

Las operaciones manuales contra servicios externos viven en `01-TOOLS/`. Cada carpeta trae
`test_connection.{sh,py}` como prueba de humo.

| Tool | Para qué |
|------|----------|
| `RESEND` | Correo transaccional de la landing (decisión S-0012). `test_connection.sh` valida la clave sin enviar nada. |
| `GOOGLE` | Hoja de cálculo del registro de respaldo y página de citas compartida. `test_connection.sh` firma el token y lee la hoja. |

Para añadir una tool: `cp -r 01-TOOLS/_TEMPLATE 01-TOOLS/<NOMBRE>` y sigue el README de `01-TOOLS/`.

## Documentación

- `02-DOCS/raw/` — material fuente inmutable (originales preservados en `_originals/`).
- `02-DOCS/wiki/index.md` — índice de artículos compilados.
- `02-DOCS/wiki/log.md` — log append de cada ingest, query, lint y pasada de mantenimiento.
- `02-DOCS/audits/` — informes de auditoría del arnés, uno por ejecución.

Cuando aprendas algo nuevo y reutilizable, ingéstalo con `harness` (el protocolo de wiki va embebido
en la skill; no hace falta ninguna skill externa).
