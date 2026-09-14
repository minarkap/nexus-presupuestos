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
| [**Marca Nexus Consulting**](firma/Marca%20Nexus%20Consulting.md) | **Marca canónica**: esencia, claim, audiencia, oferta, voz y sistema visual. **Lectura obligada para copy y UI.** | 2026-09-02 | — |
| [Identidad y Posicionamiento de Nexus](firma/Identidad%20y%20Posicionamiento%20de%20Nexus.md) | [Superado por D-0015] Consultora boutique de alto impacto: posicionamiento, cuatro líneas de servicio y tres sedes. | 2026-08-26 | 9.0 |
| [Criterio de Decisión de la Firma](firma/Criterio%20de%20Decision%20de%20la%20Firma.md) | Ocho criterios, siete tesis, el estándar Nexus y los riesgos estructurales. | 2026-08-26 | 8.0 |
| [Voz de Nexus por Escrito](firma/Voz%20de%20Nexus%20por%20Escrito.md) | [Superado por D-0015] Los seis rasgos del tono, la estructura de propuesta y los anti-patrones prohibidos. | 2026-08-26 | 11.0 |

## producto

La landing que este workspace construye.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Landing de Captación de Leads](producto/Landing%20de%20Captacion%20de%20Leads.md) | Requisitos derivados de las fuentes, restricciones de arquitectura y lo que sigue sin decidir. | 2026-08-26 | 14.0 |

## seo-geo

Visibilidad en buscadores tradicionales y en motores generativos. La base técnica antes de escribir una línea.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [SEO frente a GEO](seo-geo/SEO%20frente%20a%20GEO.md) | La diferencia real entre posicionar en una lista y ser citado en una respuesta, con los 9 métodos medidos por Princeton. | 2026-09-02 | — |

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

## stack

Convenciones técnicas y de diseño de `03-APP`. Se leen antes de tocar una superficie.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Decisiones de diseño del sitio](stack/design.md) | Tokens verbatim del DS, botón primario sólido por AA (blanco sobre cian 1,66:1), raíl conectado como firma, movimiento reducible. | 2026-09-02 | — |
| [Convenciones Next.js del sitio](stack/nextjs.md) | Server Components por defecto, un island, contenido tipado, capa SEO derivada, `server-only` sobre el catálogo, puerta `seo-gate`. | 2026-09-02 | — |

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
| [Spec — Sitio web de Nexus Consulting](sdd/specs/sitio-nexus-consulting.md) | Marca del design system, cinco páginas con URL propia (seis aprobadas; el artículo retirado en S-0020), copy con la voz de Nexus Consulting y capa SEO/GEO indexable y citable; el motor de cálculo no cambia. Aprobada en autopilot. | 2026-09-02 | — |
| [Spec — Pregunta de frenos del lead](sdd/specs/pregunta-frenos-lead.md) | Octava pregunta de negocio en el formulario, de respuesta múltiple, saltable y con cuatro opciones; informativa para el aviso interno, no toca ni la cifra ni la puntuación de cualificación. Aprobada e implementada el 2026-09-14. | 2026-09-14 | — |
| [Spec — El registro de leads pasa a Supabase](sdd/specs/leads-en-supabase.md) | El lead se guarda en una base de datos consultable en lugar de la hoja de cálculo, y un fallo de guardado deja de ser silencioso: el correo interno lo avisa. Sin panel y sin cambios en el formulario. Aprobada en autopilot. | 2026-09-14 | — |
| [Spec — Límite de frecuencia del formulario](sdd/specs/limite-de-frecuencia.md) | Tope de envíos por origen para que la acción pública no pueda inundar la base de datos, sin bloquear jamás en silencio a un lead legítimo y sin que el aviso de privacidad deje de ser cierto. Aprobada en autopilot. | 2026-09-14 | — |
| [Spec — La conservación de doce meses se ejecuta sola](sdd/specs/retencion-doce-meses.md) | El aviso de privacidad promete conservar doce meses; esta spec lo convierte en algo que ocurre solo, con la excepción de los leads que dieron lugar a relación comercial. Aprobada en autopilot. | 2026-09-14 | — |

## sdd/plans

Planes técnicos: cómo se construye lo que el spec describe. Estructura y contratos, nunca sintaxis.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Plan — Landing y estimador de presupuesto de Nexus](sdd/plans/landing-presupuestos-nexus.md) | 12 componentes tras una frontera de confianza, vista redactada al navegador, 16 pasos secuenciados y 6 riesgos. | 2026-08-26 | — |
| [Plan — Sitio web de Nexus Consulting](sdd/plans/sitio-nexus-consulting.md) | Server Components + contenido tipado + capa SEO derivada del mismo contenido; UI kit portado del DS con botón primario sólido por AA; estimador en una sola URL; puerta `seo-gate` contra el build real. 10 pasos, 10 riesgos. | 2026-09-02 | — |

## sdd/analysis

Informes de la puerta de consistencia previa a implementar. Punto en el tiempo: se sobrescriben.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Analysis — Landing y estimador de presupuesto de Nexus](sdd/analysis/landing-presupuestos-nexus.md) | 3 HIGH en la primera pasada (repliegue silencioso a adaptador falso, credenciales fuera de convención, advertencia sin comprobar en pantalla); PASS tras corregir. | 2026-08-26 | — |
| [Analysis — Sitio web de Nexus Consulting](sdd/analysis/sitio-nexus-consulting.md) | BLOCKED en primera pasada (1 CRITICAL: CA-21 vs consentimiento; 1 HIGH: seo-gate incompleto); 12 hallazgos resueltos en artefactos el mismo día → PASS. | 2026-09-02 | — |

## sdd/verifications

Actas de la puerta de evidencia. Una por ejecución, fechadas y append-only.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Verification — 2026-08-26](sdd/verifications/landing-presupuestos-nexus-2026-08-26.md) | Puerta verde en 4 capas, 36/36 done-checks, 23/24 criterios. FAIL por CA-19: el acta de tono exige firma humana. | 2026-08-26 | — |
| [Verification — Sitio web — 2026-09-02](sdd/verifications/sitio-nexus-consulting-2026-09-02.md) | VERDE en cinco capas: lint, tipos, 202 pruebas (99 % core), build, puerta SEO/GEO. Pendiente la puerta humana: acta de tono, 360 px, commits. | 2026-09-02 | — |
| [Verification — Pregunta de frenos — 2026-09-14](sdd/verifications/pregunta-frenos-lead-2026-09-14.md) | VERDE: 230 pruebas (99,41 % core), lint, tipos, build y puerta SEO. Los ocho criterios cubiertos. Review adversarial sin hallazgos bloqueantes; dos de severidad baja corregidos antes de publicar. Pendiente la firma humana de la superficie S13. | 2026-09-14 | — |
| [Verification — Límite de frecuencia — 2026-09-14](sdd/verifications/limite-de-frecuencia-2026-09-14.md) | VERDE: 315 pruebas, cero avisos de linter. Ráfaga de 3×30 peticiones contra Postgres real, las dos puertas vistas fallar y pasar, y primer envío real en producción con la huella guardada antes que el lead. Sin probar: la pantalla de bloqueo. | 2026-09-14 | — |

## sdd/checklists

Listas que bloquean la publicación y que ninguna prueba automática puede cerrar.

| Article | Summary | Updated | Score |
|---------|---------|---------|-------|
| [Lista de comprobación de tono](sdd/tone-checklist.md) | 14 superficies (S1–S14), 8 comprobaciones. **Acta cerrada el 2026-09-14**: firmada por Jose sobre las catorce, tras nueve meses de incumplimiento de hecho del principio 28. | 2026-09-14 | — |
| [Recorrido manual de los tres perfiles](sdd/manual-walkthrough.md) | Perfiles A/B/C con su resultado esperado, incluida la inspección de la pestaña de red. | 2026-08-26 | — |
| [Plan — El registro de leads pasa a Supabase](sdd/plans/leads-en-supabase.md) | Adaptador sobre la API REST de Supabase sin dependencias nuevas, inversión del orden de despacho para que el aviso interno pueda declarar el guardado, y la tabla cerrada con RLS sin policies más revoke explícito. | 2026-09-14 | — |
| [Plan — Límite de frecuencia del formulario](sdd/plans/limite-de-frecuencia.md) | Huella HMAC calculada en la frontera, decisión pura en el núcleo, conteo en una segunda tabla cerrada, y el fallo abriendo en vez de cerrando. | 2026-09-14 | — |
| [Plan — La conservación de doce meses se ejecuta sola](sdd/plans/retencion-doce-meses.md) | Tarea programada dentro de Postgres en vez de una ruta del sitio, para no exponer ningún endpoint capaz de borrar datos; más la columna que protege a los leads convertidos en cliente. | 2026-09-14 | — |

> **Score**: puntuación compuesta de calidad (enlaces entrantes, número de fuentes, citas, frescura;
> menos conflictos y penalización por orfandad). Se regenera en cada Maintenance Pass. Los artículos
> por debajo del umbral de reescritura los recoge Micro-Improve y Deep Improve.
