# Knowledge Base Index

> **Fichero reservado OKF v0.1** — `index.md` no lleva frontmatter (es un listado de directorio para
> divulgación progresiva, según la especificación OKF). Los enlaces son markdown estándar, relativos a
> este fichero, **nunca** wikilinks.
>
> **La navegación humana vive en las vistas `.base`** (`Articles.base`, `Worklog.base`,
> `Decisions.base`) — tablas vivas sobre el frontmatter, ordenadas por score, estado o fecha. Este
> índice es el catálogo legible por máquina que el agente mantiene, y el plan B.

## comercial

Cómo Nexus pone precio y decide a quién dedica una llamada. Material interno: rangos, multiplicadores y umbral de cualificación.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Catálogo de Servicios y Rangos 2026](comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md) | Los seis servicios con rango oficial, y la línea que deliberadamente no tiene precio. | 2026-08-26 | 12.0 |
| [Método de Estimación Económica](comercial/Metodo%20de%20Estimacion%20Economica.md) | Los cuatro pasos, los multiplicadores y las cinco reglas innegociables. | 2026-08-26 | 12.0 |
| [Cualificación de Oportunidades](comercial/Cualificacion%20de%20Oportunidades.md) | La puntuación sobre 10, el umbral en revisión y las dos ramas de salida. | 2026-08-26 | 14.0 |

## firma

Quién es Nexus, cómo decide y cómo suena. El marco del que cuelga todo lo comercial.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Identidad y Posicionamiento de Nexus](firma/Identidad%20y%20Posicionamiento%20de%20Nexus.md) | Consultora boutique de alto impacto: posicionamiento, cuatro líneas de servicio y tres sedes. | 2026-08-26 | 9.0 |
| [Criterio de Decisión de la Firma](firma/Criterio%20de%20Decision%20de%20la%20Firma.md) | Ocho criterios, siete tesis, el estándar Nexus y los riesgos estructurales. | 2026-08-26 | 8.0 |
| [Voz de Nexus por Escrito](firma/Voz%20de%20Nexus%20por%20Escrito.md) | Los seis rasgos del tono, la estructura de propuesta y los anti-patrones prohibidos. | 2026-08-26 | 11.0 |

## producto

La landing que este workspace construye.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Landing de Captación de Leads](producto/Landing%20de%20Captacion%20de%20Leads.md) | Requisitos derivados de las fuentes, restricciones de arquitectura y lo que sigue sin decidir. | 2026-08-26 | 14.0 |

## harness

El control plane: quién es el usuario, cómo hablarle y por qué el proyecto es como es.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [User Profile](harness/user-profile.md) | Nivel técnico, dial de acompañamiento, objetivos y restricciones. **Lectura obligada.** | 2026-08-26 | 4.0 |
| [Decisions Log](harness/decisions.md) | Registro append-only de las 8 decisiones significativas y su por qué. | 2026-08-26 | 6.0 |
| [Skill Audit 2026-08-26](harness/skill-audit-2026-08-26.md) | Inventario de las 34 skills instaladas, sin solapes ni huérfanas. | 2026-08-26 | 4.0 |

## meta

Cómo está gobernado el workspace.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Instrucciones Raíz del Workspace](meta/Instrucciones%20Raiz%20del%20Workspace.md) | Las dos capas de instrucciones raíz, los guardianes activos y la ausencia de git. | 2026-08-26 | 6.0 |

## operations

La capa de tooling operativo.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Arsenal Operativo](operations/Arsenal%20Operativo.md) | Qué es `01-TOOLS/`, sus convenciones y por qué está vacía a propósito. | 2026-08-26 | 4.0 |

## sdd

Gobierno del chain SDD: los principios que toda fase obedece y el registro de sus decisiones.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Constitution v1.0.0](sdd/constitution.md) | 29 principios no negociables y el Definition of Done que `verify` ejecuta. **Lectura obligada de toda fase SDD.** | 2026-08-26 | — |
| [SDD Decisions Log](sdd/decisions.md) | Las 11 decisiones de alcance y diseño tomadas dentro del chain, con sus opciones descartadas. | 2026-08-26 | — |

## sdd/specs

Especificaciones del chain SDD: qué se construye y por qué, antes de decidir cómo.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Spec — Landing y estimador de presupuesto de Nexus](sdd/specs/landing-presupuestos-nexus.md) | Landing + formulario de 7 preguntas, rango orientativo del catálogo 2026, tres salidas según cualificación y dos emails. | 2026-08-26 | — |

## sdd/plans

Planes técnicos: cómo se construye lo que el spec describe. Estructura y contratos, nunca sintaxis.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Plan — Landing y estimador de presupuesto de Nexus](sdd/plans/landing-presupuestos-nexus.md) | 12 componentes tras una frontera de confianza, vista redactada al navegador, 16 pasos secuenciados y 6 riesgos. | 2026-08-26 | — |

## sdd/analysis

Informes de la puerta de consistencia previa a implementar. Punto en el tiempo: se sobrescriben.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Analysis — Landing y estimador de presupuesto de Nexus](sdd/analysis/landing-presupuestos-nexus.md) | 3 HIGH en la primera pasada (repliegue silencioso a adaptador falso, credenciales fuera de convención, advertencia sin comprobar en pantalla); PASS tras corregir. | 2026-08-26 | — |

## sdd/verifications

Actas de la puerta de evidencia. Una por ejecución, fechadas y append-only.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Verification — 2026-08-26](sdd/verifications/landing-presupuestos-nexus-2026-08-26.md) | Puerta verde en 4 capas, 36/36 done-checks, 23/24 criterios. FAIL por CA-19: el acta de tono exige firma humana. | 2026-08-26 | — |

## sdd/checklists

Listas que bloquean la publicación y que ninguna prueba automática puede cerrar.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Lista de comprobación de tono](sdd/tone-checklist.md) | 7 superficies, 8 comprobaciones, acta sin firmar. Bloquea publicar (CA-19). | 2026-08-26 | — |
| [Recorrido manual de los tres perfiles](sdd/manual-walkthrough.md) | Perfiles A/B/C con su resultado esperado, incluida la inspección de la pestaña de red. | 2026-08-26 | — |

> **Score**: puntuación compuesta de calidad (enlaces entrantes, número de fuentes, citas, frescura;
> menos conflictos y penalización por orfandad). Se regenera en cada Maintenance Pass. Los artículos
> por debajo del umbral de reescritura los recoge Micro-Improve y Deep Improve.
