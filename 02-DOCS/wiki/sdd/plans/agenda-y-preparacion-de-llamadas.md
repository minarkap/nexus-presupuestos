---
type: plan
title: Plan — Agenda y preparación de la llamada
description: La web decide y avisa; n8n ejecuta. Enlace de reserva real en pantalla y correo, aviso firmado a n8n tras cada lead para el mensaje de Slack, y un flujo que al detectar la reserva investiga empresa y persona, lo deja en Drive, en una entrada interna de la agenda y en Supabase, y lo borra todo a los doce meses.
tags: [sdd, plan, agenda, n8n, slack, perplexity, google, supabase, privacidad]
timestamp: 2026-09-30T10:00:00Z
topic: sdd
slug: agenda-y-preparacion-de-llamadas
status: approved
---

# Plan — Agenda y preparación de la llamada

> Spec: [../specs/agenda-y-preparacion-de-llamadas.md](../specs/agenda-y-preparacion-de-llamadas.md) · Constitution: [../constitution.md](../constitution.md) v1.1.0
> Status: **approved** — «Dale! Haz todo lo que puedas hacer ya, y si, instala la skill de n8n» (Jose, 2026-09-30). Spec y plan aprobados juntos. Las tres preguntas abiertas de la spec no mueven la arquitectura y quedan en §7.
> Last updated: 2026-09-30

## 0. Global Constraints

- **Stack de la web:** Next.js 16.3.3 App Router + TypeScript estricto, npm, Node ≥ 24. **Sin
  dependencias nuevas en `03-APP/`**: `fetch` para el aviso a n8n, `node:crypto` si hace falta.
- **Orquestación:** todo lo que toca Slack, Google (Calendar, Drive, Docs) y Perplexity vive en
  **n8n**, en la instancia de este proyecto que indique Jose. **Nunca otra instancia, y nunca
  `n8n-templates`.** La web no habla con Slack, Google ni Perplexity.
- **Umbral (principio 9):** la cualificación se calcula **solo** en `src/core/outcome.ts`
  (`showCalendar = score.total >= catalog.threshold`). n8n recibe el veredicto hecho y nunca lo
  recalcula.
- **Nada interno al navegador (principios 8 y 11):** ni puntuación, ni umbral, ni desglose, ni
  `booking_offered` en lo que recibe el cliente. El enlace de reserva sí es público por naturaleza.
- **Un solo punto para el enlace de reserva:** `NEXT_PUBLIC_CALENDAR_URL`, la misma variable que ya
  usa la pantalla. El correo la lee también, para que pantalla y correo no puedan divergir.
- **Secretos (principio 21):** `N8N_LEAD_WEBHOOK_URL` y `N8N_LEAD_WEBHOOK_SECRET` solo en servidor,
  **jamás con prefijo `NEXT_PUBLIC_`**, en `01-TOOLS/N8N/.env` y en el panel de Vercel. Se añaden a
  la lista por valor de `scripts/secret-gate.mjs`.
- **El lead nunca ve su investigación:** ni en la descripción de su cita, ni como enlace.
- **Qué se investiga:** solo información pública y profesional, con la fuente de cada afirmación y
  los homónimos marcados. Nunca vida privada, familia, redes personales ni categorías especiales.
- **Activación de la fase B (principio 23):** la investigación solo corre si el lead tiene
  `research_allowed = true`, y ese valor solo es verdadero si **el aviso de privacidad vigente al
  enviar el formulario ya contaba la investigación**.
- **Copy (principios 27, 28 y 36):** ningún texto nuevo promete resultados ni fabrica urgencia; los
  textos nuevos de correo y pantalla pasan la [lista de tono](../tone-checklist.md) con acta
  firmada por una persona.
- **Calidad:** lint con cero avisos, `tsc` estricto, TDD en `src/core`, cobertura ≥ 95 % en
  `src/core/**`, `bash scripts/verify.sh` en verde (las siete puertas).
- **Git:** rama `feat/agenda-y-preparacion-de-llamadas`, nunca sobre `main`. Commits con gitmoji y
  autoría humana, **sin `Co-Authored-By`** (principio 20).
- **Producción:** aplicar SQL a la base real, configurar variables en Vercel, activar flujos en n8n
  o publicar mensajes en Slack son acciones hacia fuera: **cada una espera el sí de Jose**.

## 1. Context & constraints

- **La spec pide dos fases.**
  - La **A** (CA-01…CA-13 y CA-24…CA-26) toca la web —el correo, el aviso al equipo y lo que se guarda
    con el lead— más la configuración de la página de reservas y la limpieza del canal.
  - La **B** (CA-14…CA-23, con 17a/17b y 18b/18c) vive casi entera fuera de la web.
- **CA-09 manda en el diseño de la A.** El fallo del aviso tiene que verse en el correo interno, así
  que **la web tiene que saber si el aviso salió**. Eso descarta las opciones en las que la web no se
  entera (§2).
- **CA-15 manda en el diseño de la B.** La descripción de la cita reservada la ve el invitado, así que
  la investigación va a **otra** entrada de la agenda, sin invitados.
- **CA-21, CA-22 y CA-23 son de privacidad.** Se resuelven con un dato por lead (`research_allowed`)
  y con una cola de borrados externos. El «cuándo» del borrado sigue viviendo en Postgres (`S-0033`,
  plan de retención) y n8n solo ejecuta el «cómo».
- **Principio 23.** La fase A añade dos encargados nuevos, n8n y Slack, y la B añade Perplexity y
  datos de otras fuentes. El aviso de privacidad cambia **en las dos**, en distinta medida.
- **Volumen (C-08):** decenas de leads al mes. No hace falta cola, reintentos masivos ni paralelismo;
  sí que cada fallo se vea.
- **Fuera de alcance que el diseño no debe invadir:** seguimiento de no reservados, CRM, panel,
  cambios en motores o catálogo, y el borrado de los leads de prueba.

## 2. Architecture

```text
                    ┌──────────────── WEB (03-APP, Vercel) ───────────────┐
 Formulario ──────► │ submitLead (core)                                   │
                    │  1 valida · tope · calcula (outcome decide umbral)  │
                    │  2 guarda lead + veredicto ─────────────────────────┼──► Supabase: leads
                    │  3 correo al lead (con enlace si showCalendar) ─────┼──► Resend
                    │  4 aviso al equipo ── TeamNoticePort ───────────────┼──► n8n W1 (webhook)
                    │  5 correo interno (declara 2 y 4) ──────────────────┼──► Resend   │
                    └─────────────────────────────────────────────────────┘            │
                                                                                       ▼
                                                                              Slack #canal
 ─────────────────────────────────── fase B ───────────────────────────────────────────────
 Lead reserva en la página de reservas de Google ──► evento en Calendar (Meet + recordatorios: Google)
                                                          │
                                   n8n W2 (disparador de Calendar)
                                    ├─ busca el lead por correo ──────────► Supabase (vista mínima)
                                    ├─ ¿research_allowed? ¿ya investigado?
                                    ├─ Perplexity: empresa · persona
                                    ├─ crea documento del equipo ─────────► Google Drive/Docs
                                    ├─ crea entrada interna «Preparar …» ─► Google Calendar (sin invitados)
                                    ├─ guarda la investigación ───────────► Supabase: lead_research
                                    └─ resumen + enlaces ─────────────────► Slack
 n8n W3: cambios y cancelaciones de la cita ──► mueve la entrada interna · avisa en Slack
 Postgres (retención 03:17) borra lead ─► cascada a lead_research ─► cola external_deletions
 n8n W4 (diario, 04:00) ──► borra documento y entrada interna ──► vacía la cola
```

**Componentes internos** (en el repositorio):

- **`submitLead`** (`src/core/submit.ts`). Ya existe. Gana un paso más en el despacho, el 4, y el
  correo interno declara su resultado.
- **`outcome`** (`src/core/outcome.ts`). Ya existe y **sigue siendo el único sitio que decide** quién
  cualifica. No cambia.
- **`proposal`** (`src/core/proposal.ts`). El cierre del correo al cualificado deja de afirmar una
  cita:
  - con enlace configurado, **invita** a reservar;
  - sin enlace, dice que el equipo escribirá.
- **`TeamNoticePort`** (`src/ports/team-notice.ts`, nuevo). Entrega el aviso de un lead a n8n y
  responde si salió. Tiene tres adaptadores, con el mismo patrón que `email.ts`:
  - **falso**, que escribe en consola, para desarrollo;
  - **apagado**, que devuelve «sin configurar», para cuando no hay URL;
  - **real**, una petición HTTPS firmada.
- **`toLeadRow`** (`src/ports/registry.ts`). Añade cuatro campos al lead guardado: `outcome_kind`,
  `booking_offered`, `privacy_version` y `research_allowed`.
- **`privacidad`** (`src/content/privacidad.ts`). Declara su versión y si cuenta la investigación
  (`PRIVACY_VERSION`, `COVERS_RESEARCH`).
- **SQL** (`01-TOOLS/SUPABASE/agenda.sql`, nuevo). Contiene:
  - las columnas nuevas de `leads`;
  - las tablas `lead_research` y `external_deletions`;
  - el disparador que llena la cola;
  - el rol `n8n_agenda` con permisos mínimos;
  - la vista `leads_para_agenda`.
- **Flujos de n8n exportados** (`01-TOOLS/N8N/workflows/*.json`). Quedan versionados en git. La
  exportación de n8n referencia las credenciales, no las incluye.

**Componentes externos:** Supabase, Resend, n8n (W1–W4), Slack, Google Calendar (página de reservas
y agenda interna), Google Drive/Docs y la API de Perplexity.

**Decisión principal: la web decide y avisa; n8n ejecuta.** El aviso sale de la web, a través de un
puerto y por una petición firmada que espera la confirmación de Slack. Se eligió así por tres
razones:

- Es la única de las tres opciones en la que la web **sabe** si el aviso llegó (CA-09).
- Mantiene la decisión de cualificar en un solo sitio (principio 9).
- Sigue el patrón de la casa: todo acceso externo entra por un puerto con adaptador falso (`S-0034`).

Alternativas descartadas:

- **Disparador de la base al insertar un lead** (webhook de Supabase hacia n8n). No toca la web, pero
  un fallo no lo ve nadie: el correo interno ya salió y no puede declararlo. Además, dispararía también
  con las filas de prueba insertadas a mano.
- **n8n consultando la tabla cada pocos minutos.** Añade retraso y obliga a n8n a recordar qué ha
  avisado ya, y tampoco permite declarar el fallo.

La contrapartida aceptada: el envío del formulario espera la respuesta de n8n (tope de 5 s). Si la
latencia molesta, R-8 tiene la salida.

**Segunda decisión: `research_allowed` se decide en la web, en el momento del envío.** Sale de la
versión del aviso vigente en ese momento (`COVERS_RESEARCH`). n8n solo lee el dato y no conoce
fechas ni versiones. Así CA-21 y CA-23 dependen de un solo sitio: el propio texto del aviso.

## 3. Interfaces & contracts

```text
TeamNoticePort.notify(notice: LeadNoticeV1) -> 'ok' | 'failed' | 'not_configured'
  - nunca lanza: todo error se traduce a 'failed'
  - 'ok' solo si n8n respondió 2xx DESPUÉS de publicar en Slack
  - tope de 5 s; pasado el tope → 'failed'
  - sin URL configurada → 'not_configured', sin petición
  - invariante: se llama una vez por envío despachado; el DedupCache existente protege de los
    reintentos (misma garantía que los correos, ni más ni menos)
  - precondición: el lead ya pasó validación y tope (CA-08: los rechazados no llegan aquí)
```

```text
LeadNoticeV1 (cuerpo JSON, versionado)          ← contrato web ↔ n8n W1
  version: 1
  submission_id, submitted_at
  contact: { name, email, company }
  service_label: string | null                  ← null = línea sin catalogar
  range_text: string | null
  score: { total, breakdown: [{ signal, points }] }
  outcome_kind: 'qualified' | 'not_qualified' | 'uncatalogued'
  booking_offered: boolean                      ← = showCalendar; es la «marca de cualificado»
  client_email: 'ok' | 'failed'
  registry: 'ok' | 'failed'
Cabecera de autenticación: `Authorization: Bearer <N8N_LEAD_WEBHOOK_SECRET>` sobre HTTPS
(credencial «Header Auth» nativa del webhook de n8n).
El esquema vive en `01-TOOLS/N8N/contracts/lead-notice.v1.schema.json` y una prueba de contrato
comprueba que el adaptador real lo cumple.
```

```text
buildProposal(kind, contact, service, range, bookingUrl: string | null) -> EmailMessage
  - kind = qualified/uncatalogued con showCalendar, y bookingUrl → invita a reservar + enlace
  - showCalendar y sin bookingUrl → «te escribimos con la disponibilidad del equipo»
  - no cualificado → sin enlace, invitación a responder (igual que hoy)
  - invariante en todas las ramas: ninguna frase da la cita por hecha (CA-05)
```

```text
buildInternalNotice(lead, registry, notice, catalog) -> EmailMessage
  - añade una línea cuando notice ∈ {'failed', 'not_configured'}, al estilo de avisoDeNoGuardado()
```

```text
n8n W1 «Aviso de lead»
  entrada: POST LeadNoticeV1 autenticado → valida version = 1
  → publica en el canal: cualificados con marca visible; sin catalogar con «sin cifra»
  → responde 200 solo tras publicar; 4xx si falla la autenticación o la versión; 5xx si falla Slack
```

```text
n8n W2 «Reserva confirmada»
  entrada: evento nuevo en el calendario de la página de reservas
  filtro: es una reserva de la página (criterio exacto: spike S-1) → correo del reservante
  lookup(lower(email)) en leads_para_agenda: el lead MÁS RECIENTE de ese correo en los últimos 60 días (CA-18c)
  ramas:
    sin lead                          → Slack «reserva sin lead asociado»          (CA-18)
    lead con booking_offered = false  → Slack «reserva de un lead que no cualificaba» (CA-18b)
    ya investigado (lead_research)    → lo trata W3                                (CA-19)
    research_allowed = false          → Slack «reservado · sin investigación (aviso anterior)» (CA-21)
    en otro caso                      → Slack «X de Empresa reservó para <fecha>»
                                        → Perplexity empresa → Perplexity persona (salida JSON con fuente por afirmación)
                                        → filtro: descarta afirmaciones sin fuente (CA-17)
                                        → documento en la carpeta del equipo (solo equipo, CA-16)
                                        → entrada interna 15 min antes, «libre», sin invitados, con resumen + enlace (CA-15)
                                        → inserta lead_research → Slack resumen + enlaces (CA-14)
  error en cualquier paso de investigación → Slack «investigación no disponible, prepárala a mano» (CA-20)
  idempotencia: clave = id del evento de la reserva (restricción única en lead_research)
```

```text
n8n W3 «Cambios de reserva»: evento actualizado/cancelado de una reserva conocida
  → cambio de hora: mueve la entrada interna, Slack «cambio de hora», sin investigar otra vez (CA-19)
  → cancelación: Slack «cancelada»; la investigación se queda hasta su caducidad
n8n W4 «Borrados pendientes»: diario 04:00
  → por cada fila de external_deletions: borra documento de Drive y entrada interna → borra la fila
  → un fallo deja la fila para el día siguiente y avisa en Slack
n8n W5 «Limpieza del canal»: diario 04:30 (fase A; el primer borrado real cae en 2027-10)
  → recorre el historial del canal y borra los mensajes PUBLICADOS POR LA PROPIA APP con más de 12 meses (CA-26)
  → no toca mensajes de personas; un fallo avisa en el canal y se reintenta al día siguiente
```

Resumen de Slack de W2 (spec, (d)): pocas líneas centradas en la empresa; de la persona solo el cargo;
el resto, en el documento enlazado.

## 4. Data model & flow

**Entities**

- **`leads`** (existe). Columnas nuevas, todas escritas por la web al guardar:
  - `outcome_kind`: `qualified`, `not_qualified` o `uncatalogued`;
  - `booking_offered`, booleano;
  - `privacy_version`, texto;
  - `research_allowed`, booleano.

  Las filas antiguas se rellenan con `booking_offered` = la puntuación comparada con el umbral
  **actual del catálogo**, calculado **una vez** en la migración y documentado; `research_allowed`
  queda en `false`.
- **`lead_research`** (nueva). Campos:
  - `id` y `submission_id`, que apunta a `leads` y **se borra en cascada** con él;
  - `booking_event_id`, **único**;
  - `booking_starts_at`;
  - `report` (JSON con afirmaciones y fuentes) y `summary`;
  - `drive_file_id` y `prep_event_id`;
  - `created_at`.
- **`external_deletions`** (nueva). Campos: `id`, `kind` (`drive_file` o `calendar_event`),
  `external_id`, `queued_at`. La llena un disparador de Postgres al borrarse una fila de
  `lead_research`.
- **`leads_para_agenda`** (vista). Expone solo lo que W2 necesita: `submission_id`, `contact_name`,
  `contact_email`, `contact_company`, `service_label`, `booking_offered`, `research_allowed` y
  `submitted_at`.
- **Rol `n8n_agenda`**, un usuario de Postgres propio para n8n. Permisos:
  - `SELECT` sobre la vista;
  - `SELECT` e `INSERT` sobre `lead_research`;
  - `SELECT` y `DELETE` sobre `external_deletions`.

  **Nada más**: ni `leads` directa, ni el catálogo, ni `submission_attempts`. Es la misma idea de
  `S-0037`: la garantía vive en los permisos de la base, no en la llave.

**Flujo principal A** (un cualificado envía el formulario):

1. `submitAction` valida, aplica el tope y calcula. `outcome` fija `showCalendar`.
2. Guarda el lead con `outcome_kind`, `booking_offered`, `privacy_version` y `research_allowed`.
3. Envía la propuesta al lead: con `showCalendar` y `bookingUrl`, el cierre invita a reservar e
   incluye el enlace.
4. `TeamNoticePort.notify(LeadNoticeV1)`. W1 publica en Slack y responde 200, y el resultado es `ok`.
5. Envía el correo interno, con las líneas de «no guardado» o «aviso no enviado» si tocan.
6. La pantalla muestra el resultado con el calendario incrustado, como hoy.

**Flujo principal B** (ese lead reserva):

1. El lead elige hueco en la página de reservas. Google crea la cita con Meet y programa los
   recordatorios.
2. W2 detecta el evento, lee el correo del reservante y encuentra el lead en `leads_para_agenda`.
3. Con `research_allowed = true`:
   - hace las dos consultas a Perplexity y filtra las afirmaciones sin fuente;
   - crea el documento y la entrada interna;
   - inserta en `lead_research`;
   - publica el resumen en Slack.
4. A los doce meses, la retención borra el lead. En cascada se borra `lead_research`, el disparador
   encola el documento y la entrada, y W4 los borra al día siguiente.

- **Consistencia.** Pasos A2 a A5 como hoy: cada uno se intenta aunque falle el anterior, y el
  correo interno declara el estado. En W2 la inserción en `lead_research` va **después** de crear
  documento y entrada. Si falla, el documento queda huérfano. Esto se detecta por la ausencia de fila
  y es un riesgo aceptado (R-10).
- **Impacto de migración.** Columnas nuevas con valor por defecto, dos tablas, una vista, un
  disparador y un rol. **Nada destructivo.** El rellenado de filas antiguas solo toca `leads`
  existentes: hoy son 8, de ellos 5 de prueba.

## 5. Testing strategy

| Criterio | Nivel | Qué afirma | Qué se falsea |
| --- | --- | --- | --- |
| CA-01, CA-03 | unidad (`proposal`) + componente (`ResultScreen`) | cualificado y sin catalogar cualificado reciben enlace en correo y calendario en pantalla | catálogo fijo, enlace de ejemplo |
| CA-02 | unidad + componente | no cualificado: ningún enlace en ningún sitio | — |
| CA-04 | unidad + componente | sin enlace: ni cita ni promesa, texto de disponibilidad en ambos | — |
| CA-05 | unidad, exhaustiva | en **todas** las ramas de `buildProposal`, ninguna frase de cita hecha (lista de patrones prohibidos en `tone.ts`) | — |
| CA-06 | unidad (`submitLead`) + contrato | un solo `notify` con todos los campos; el cuerpo valida contra `lead-notice.v1.schema.json` | `FakeTeamNoticePort` que graba |
| CA-07 | unidad | dos envíos con el mismo `submissionId`, un solo `notify` | puerto que graba |
| CA-08 | unidad | validación fallida y tope excedido: cero llamadas a `notify` | puerto que graba |
| CA-09 | unidad | puerto que devuelve `failed` o `not_configured`: lead guardado, dos correos enviados, línea en el interno | puertos de email y registro falsos |
| CA-10 | unidad (redacción existente, ampliada) | el `RedactedOutcome` al navegador no gana campos: ni `booking_offered`, ni puntuación | — |
| CA-11 | unidad | con el umbral cambiado en el catálogo de prueba cambian `booking_offered`, el enlace y la marca del aviso | catálogo de prueba |
| CA-12 | acta humana | lista de tono pasada sobre los textos nuevos del correo, la pantalla **y la página de reservas**; se añade la superficie S15 «página de reservas» | — |
| CA-13 (fase A) | e2e manual contra Google | reserva de prueba: confirmación con Meet y un recordatorio recibidos | nada: es configuración de Google |
| CA-24 | revisión + prueba de contenido | `privacidad.ts` nombra la mensajería interna y la automatización entre destinatarios y transferencias; bloqueo de publicación de la fase A si no | — |
| CA-25 | unidad (`toLeadRow`) | todo lead guardado lleva `privacy_version` igual a `PRIVACY_VERSION` vigente | — |
| CA-26 | e2e de W5 con un canal de pruebas | un mensaje de la app con fecha simulada > 12 meses desaparece; uno de una persona, no | nada |
| CA-14 | e2e contra servicios reales | reserva de prueba: en ≤ 15 min, Slack + documento + entrada interna + fila | nada |
| CA-15 | e2e manual | la invitación que recibe la cuenta de prueba no contiene investigación ni enlace | nada |
| CA-16 | e2e manual | el enlace del documento abierto desde una cuenta ajena al equipo da acceso denegado | nada |
| CA-17a | unidad del filtro (nodo de código de W2, con fixtures) | una afirmación sin fuente no llega al informe | respuesta de Perplexity grabada |
| CA-17b | acta humana | los 3 primeros informes reales, revisados: sin vida privada ni categorías especiales, homónimos marcados | — |
| CA-18, CA-18b, CA-18c, CA-19, CA-20, CA-21 | e2e con casos preparados | correo desconocido; correo de un lead no cualificado; correo con dos leads (gana el reciente); cambio de hora; clave de Perplexity inválida en la copia de pruebas de W2; lead con `research_allowed = false` | nada |
| CA-22 | integración SQL + e2e de W4 | borrar un lead de prueba encola documento y entrada; W4 los borra | nada |
| CA-23 | unidad | con `COVERS_RESEARCH = false`, todo lead se guarda con `research_allowed = false` | — |

- **La línea del e2e.** Todo lo que la web decide se prueba en unidad, sin red, igual que hoy. Todo lo
  que ocurre en n8n se prueba **contra los servicios reales** con datos marcados
  `Executive Lab (prueba agenda)`, por el mismo camino de `S-0039`. n8n no tiene arnés de pruebas
  unitarias que merezca la pena para cuatro flujos.
- **Lo que tiene que ser real para que la prueba signifique algo:** la página de reservas de Google
  (lo que revela CA-15 solo lo enseña una invitación de verdad) y los permisos de la carpeta de Drive
  (CA-16).
- **Puertas de `verify`:**
  - la de secretos gana `N8N_LEAD_WEBHOOK_SECRET` en su lista por valor;
  - `01-TOOLS/SUPABASE/test_connection.sh` gana comprobaciones de que `n8n_agenda` **no** puede leer
    `leads` ni el catálogo.

## 6. Sequencing & dependencies

### 6.1 Se puede hacer ya, sin esperar a nadie

Todo esto ocurre en el repositorio, en una rama, y es reversible. Nada toca producción.

1. **Rama o worktree** `feat/agenda-y-preparacion-de-llamadas`. Depende de: aprobación de spec y
   plan. [serial]
2. **Corregir el correo falso** (CA-01…CA-05). `buildProposal` recibe `bookingUrl`; se escriben los
   textos nuevos y la prueba exhaustiva de CA-05. Depende de: 1. [paralelizable]
   *Se puede publicar sola, antes que todo lo demás:* arregla hoy una afirmación falsa en producción.
   Sin enlace configurado dirá «te escribimos con la disponibilidad», que es verdad.
3. **Veredicto y privacidad guardados con el lead** (CA-11, CA-23). Incluye `PRIVACY_VERSION` y
   `COVERS_RESEARCH = false` en `privacidad.ts`, los cuatro campos en `toLeadRow`, y las columnas en
   `agenda.sql` (escrito, **no aplicado**). Depende de: 1. [paralelizable con 2]
4. **`TeamNoticePort`** con sus tres adaptadores, el paso 4 del despacho, la línea del correo
   interno, el esquema `lead-notice.v1` y la prueba de contrato (CA-06…CA-10). Depende de: 3. [serial
   tras 3]
5. **Puerta de secretos** con la variable nueva. Depende de: 4. [serial tras 4]
6. **SQL de la fase B**, escrito y **no aplicado**: `lead_research`, `external_deletions`, el
   disparador, la vista y el rol `n8n_agenda`, más las comprobaciones en `test_connection.sh`.
   Depende de: 3. [paralelizable]
7. **Borradores del aviso de privacidad** (skill `gdpr-privacy`):
   - **A:** añadir la mensajería interna y la herramienta de automatización a encargados y
     transferencias. Es un cambio pequeño, pero **obligatorio antes de publicar la fase A** (CA-24).
   - **B:** datos obtenidos de fuentes públicas sobre la persona y la empresa, finalidad «preparar la
     llamada», Perplexity, conservación y derecho de oposición.

   Se dejan listos para revisión y **no se publican**. Depende de: nada. [paralelizable]
8. **Carpetas de herramientas** `01-TOOLS/N8N`, `SLACK` y `PERPLEXITY` desde `_TEMPLATE`, con
   `.env.example` y un `test_connection.sh` de solo lectura, y el `.gitignore` de cada una. Depende
   de: nada. [paralelizable]
9. **Diseño detallado de W1–W5** en `02-DOCS/wiki/stack/n8n-agenda.md`:
   - nodos, datos y ramas de error;
   - los dos prompts de Perplexity con su esquema de salida;
   - la plantilla del documento;
   - los formatos de los mensajes de Slack.

   Depende de: nada. [paralelizable]
10. **Cierre de la parte local:** `bash scripts/verify.sh` en verde y PR. Depende de: 2–6.

### 6.2 Bloqueado: espera a Jose o a un tercero

| # | Qué hace falta | Quién | Desbloquea |
|---|---|---|---|
| B1 | Crear la **página de reservas** en Google Calendar: 30 min, Meet, formulario con nombre y correo de trabajo, recordatorios y código para incrustarla | Jose (en Google) | CA-01, CA-13 |
| B2 | Poner su enlace en `NEXT_PUBLIC_CALENDAR_URL` en Vercel, o renovar el token de `01-TOOLS/VERCEL` para que lo haga yo | Jose | CA-01 en producción |
| B3 | Indicar la **instancia de n8n** de este proyecto y dejar su URL y clave de API en `01-TOOLS/N8N/.env` | Jose | W1–W4 |
| B4 | **Slack:** espacio, canal y una app con permiso para publicar, conectada a n8n | Jose | W1, y los avisos de W2–W4 |
| B5 | Conectar **Google** a n8n (Calendar, Drive y Docs) y crear la carpeta del equipo con acceso solo para el equipo | Jose | W2–W4, CA-16 |
| B6 | **Perplexity:** cuenta con API, la clave, y leer sus condiciones de datos (retención, entrenamiento, contrato de encargado) | Jose | W2 |
| B7 | **Aplicar el SQL** a la base de producción: columnas (fase A) y tablas, vista y rol (fase B) | Jose da el sí; lo aplico yo | Fase A en producción, W2–W4 |
| B8 | **Revisar y aprobar el aviso de privacidad**. La base legal de investigar a la persona es la pregunta abierta de la spec. Tras aprobarlo, `COVERS_RESEARCH = true` | Jose (y asesoría legal si la hay) | Activar la fase B (CA-21, CA-23) |
| B9 | **Actas de tono** de los textos nuevos | Jose | CA-12, publicar |
| B10 | Confirmar que el **plan de Google Workspace** permite recordatorios en la página de reservas | Jose | CA-13 |

### 6.3 Orden de puesta en marcha

- **Primero**, la corrección del correo (paso 2), en cuanto pase su acta de tono. No depende de
  nada externo.
- **Fase A en producción:** B1, B2, B3, B4, B7 (columnas), B9 y el aviso A publicado (CA-24), más los
  pasos 3–5 publicados y W1 construido. Después se prueba de extremo a extremo y se publica. W5 puede
  llegar después: su primer borrado real no ocurre hasta 2027-10.
- **Fase B construida:** B5, B6 y B7 (tablas), con W2–W4 construidos y **desactivados**. Se prueba de
  extremo a extremo con un lead de prueba que tenga `research_allowed = true` puesto a mano.
- **Fase B activada:** B8. El aviso se publica, `COVERS_RESEARCH` pasa a `true` y se activan W2–W4.
  Solo investiga a leads enviados **desde ese momento**.

- **Se pueden hacer en paralelo:** los pasos 2, 3, 6, 7, 8 y 9, que no comparten ficheros.
- **Orden obligatorio:**
  - 3 va antes que 4, porque el aviso lleva los campos nuevos;
  - B7 va antes de publicar la web de los pasos 3 y 4, porque la web escribe columnas que tienen que
    existir;
  - B8 va antes de activar W2.

## 7. Risks & open decisions

**Riesgos** (de más a menos probable o grave)

| Riesgo | Disparador | Impacto | Mitigación |
| --- | --- | --- | --- |
| R-1 El lead ve su investigación | Escribir en la cita reservada en lugar de en la entrada interna | Grave: reputación y privacidad | Entrada interna sin invitados (§3 W2). CA-15 probado con una invitación real |
| R-2 W2 no sabe distinguir una reserva de cualquier otro evento, o no encuentra el correo del reservante | La forma en que Google registra las reservas | W2 no dispara, o dispara de más | **Spike S-1**: hacer una reserva de prueba y leer el evento crudo antes de construir W2. Si hace falta, un calendario propio solo para reservas |
| R-3 El reservante usa otro correo | Correo personal o enlace reenviado | Reserva sin investigar | Rama «sin lead» con aviso en Slack (CA-18). El formulario de reserva pide el correo de trabajo |
| R-4 Perplexity se equivoca de persona o inventa | Homónimos, poca presencia pública | Información falsa en el documento | Fuente por afirmación, homónimos marcados, búsqueda de la persona **con su empresa**, revisión humana de los 3 primeros informes |
| R-5 Se investiga sin aviso que lo cuente | Activar W2 antes de B8, o fallo del dato | Exposición legal | `research_allowed` decidido en la web a partir de `COVERS_RESEARCH`; W2 desactivado hasta B8 (CA-21, CA-23) |
| R-6 Las copias sobreviven a los doce meses | Documento, entrada o mensaje de Slack | El aviso deja de ser cierto | Cola de borrados para Drive y Calendar (W4). Slack: W5 borra los mensajes de la app con más de 12 meses (CA-26), y el resumen de W2 solo da el cargo de la persona. Si el plan de Slack permite una retención de 12 meses en el canal, se activa también, como segunda red |
| R-7 n8n caído | Mantenimiento, cuota, caída | A: aviso perdido (se ve en el correo interno). B: reservas sin preparar | CA-09 cubre la A. **Spike S-2**: comprobar que el disparador de Calendar recupera los eventos creados mientras estuvo caído |
| R-8 El formulario tarda más | W1 espera a Slack | Peor experiencia justo al enviar | Tope de 5 s. Si se mide por encima de 1,5 s, W1 responde al recibir y Slack se confirma aparte (se pierde parte de CA-09; decisión a registrar) |
| R-9 El plan de Workspace no trae recordatorios | B10 | G4 parcial | Preguntar antes de B1. Plan B: la confirmación con Meet sí llega |
| R-10 Documento huérfano | Falla la inserción en `lead_research` tras crear el documento | Un documento sin borrado programado | W2 avisa en Slack con el id; revisión mensual de la carpeta contra la tabla |
| R-11 Filtración del secreto del webhook | Descuido de configuración | Alguien publica en Slack en nombre de la web | Solo servidor, puerta de secretos, rotación documentada en `01-TOOLS/N8N/README.md` |
| R-12 La agenda es solo de Jose | Agenda llena | Menos huecos para el lead (C-07 a medias) | Aceptado mientras el equipo sea una persona; revisar cuando haya más socios |

**Decisiones abiertas**

- **Base legal para investigar a la persona.** Se cierra en B8, con la revisión del aviso.
- **Canal de Slack.** Se cierra en B4.
- **Plan de Google Workspace.** Se cierra en B10.
- **Instancia de n8n.** Se cierra en B3. Hasta entonces no se toca ninguna.
- **Criterio exacto para reconocer una reserva en Calendar.** Se cierra con el spike S-1.
- **¿La entrada interna va a la agenda principal de Jose o a una agenda propia «Nexus ·
  Preparación»?** Recomendación: agenda propia, que es más fácil de limpiar y no ensucia la principal.
  Se cierra con Jose al hacer B5.

## Tasks
<!-- generated by tasks on 2026-09-30; IDs are stable, do not renumber -->

Solo lo de §6.1, lo que se puede hacer ya. Los bloqueos B1–B10 de §6.2 no son tareas: son esperas.
Van en **dos PR apilados**:

- **PR 1** (T001–T007): la corrección del correo y de la pantalla. Se puede publicar sola.
- **PR 2** (T008–T021): el resto de la fase A en la web y la fase B preparada. **No se fusiona antes
  de B7**, porque la web pasaría a escribir columnas que aún no existen en la base.

| ID | [P] | Task | Done-check | Depends-on | Trace |
| --- | --- | --- | --- | --- | --- |
| T001 |  | Crear `fix/correo-sin-cita-confirmada` desde `main` y `feat/agenda-y-preparacion-de-llamadas` encima | `git branch --show-current` en cada una; `main` sin commits nuevos | — | plan §0 Git |
| T002 |  | Escribir las pruebas que fallan del correo con oferta de reserva (con enlace, sin enlace, no ofrecida, sin catalogar cualificado) y la exhaustiva sin «cita confirmada» | `npx vitest run src/core/proposal.test.ts` → rojo por la oferta ausente | T001 | CA-01…CA-05 |
| T003 |  | Implementar `composeProposal(…, booking)` | T002 verde; el resto de `proposal.test.ts` sigue verde | T002 | CA-01…CA-05 |
| T004 |  | Quitar «puedes reservar ahora mismo» del cuerpo del cualificado y probar la pantalla con y sin enlace | `npx vitest run src/core/outcome.test.ts src/components/result-screen.test.tsx` → la prueba nueva fue roja y ahora está verde | T001 | CA-04 |
| T005 |  | Cablear `bookingUrl` en `SubmitDeps` y en `actions.ts` desde `NEXT_PUBLIC_CALENDAR_URL` | `npx vitest run src/core/submit.test.ts` → cualificado con enlace, no cualificado sin él y sin catálogo sin él, en verde tras rojo | T003 | CA-01, CA-02, CA-03 |
| T006 |  | Añadir los patrones de «cita dada por hecha» a la prueba de tono del correo y las filas de acta pendientes (S9, S10 y la nueva S15 «página de reservas») | `npx vitest run src/content/tone.test.ts` verde; `tone-checklist.md` lista S15 sin firmar | T003, T004 | CA-05, CA-12 |
| T007 |  | Pasar la puerta, hacer commit, push y abrir PR 1 | `bash scripts/verify.sh` → `VERIFY: VERDE`; PR abierto contra `main` | T002–T006 | — |
| T008 |  | Escribir las pruebas que fallan del lead guardado con `outcome_kind`, `booking_offered`, `privacy_version` y `research_allowed` | `npx vitest run src/ports/supabase-registry.test.ts src/core/submit.test.ts` → rojo | T007 | CA-11, CA-23, CA-25 |
| T009 |  | Implementar `LeadRecord`, `SubmitDeps.privacy`, `privacidad.coversResearch` y `toLeadRow` | T008 verde | T008 | CA-11, CA-23, CA-25 |
| T010 | [P] | Escribir el SQL de la fase A en `01-TOOLS/SUPABASE/agenda.sql`: columnas y relleno de filas antiguas | aplica limpio sobre `schema.sql` en un Postgres local efímero; `\d leads` muestra las cuatro columnas | T001 | CA-11, CA-25 |
| T011 |  | Escribir las pruebas que fallan de `buildLeadNotice` (forma v1 igual al esquema) y de `TeamNoticePort` (tres adaptadores, tope de tiempo, nunca lanza) | `npx vitest run src/core/team-notice.test.ts src/ports/team-notice.test.ts` → rojo | T009 | CA-06 |
| T012 |  | Implementar `core/team-notice.ts`, `ports/team-notice.ts` y `01-TOOLS/N8N/contracts/lead-notice.v1.schema.json` | T011 verde | T011 | CA-06 |
| T013 |  | Añadir el paso 4 del despacho y la línea del correo interno, con pruebas de rechazados, repetidos y fallos | `npx vitest run src/core/submit.test.ts` → verde tras rojo en CA-06…CA-09 | T012 | CA-06…CA-09 |
| T014 |  | Cablear `selectTeamNoticePort(process.env)` en `actions.ts` | `npm run typecheck` sale 0 | T013 | CA-06 |
| T015 |  | Añadir `N8N_LEAD_WEBHOOK_SECRET` a la búsqueda por valor de la puerta de secretos y prohibir `NEXT_PUBLIC_N8N_*` | `node scripts/secret-gate.mjs` → verde; un secreto ficticio plantado en un fichero de cliente la pone en rojo (y se retira) | T014 | plan §0 Secretos |
| T016 |  | Nombrar en el aviso de privacidad la mensajería interna y la automatización (destinatarios y transferencias) y poner `updated` al día | `npx vitest run src/content` verde; el aviso contiene «mensajería interna» | T009 | CA-24 |
| T017 | [P] | Escribir el SQL de la fase B en `agenda.sql` (tablas `lead_research` y `external_deletions`, disparador, vista, rol `n8n_agenda`) y sus comprobaciones en `test_connection.sh` | en Postgres local: borrar un lead encola dos filas; `n8n_agenda` no puede leer `leads` ni el catálogo | T010 | CA-22, plan §4 |
| T018 | [P] | Crear `01-TOOLS/N8N`, `SLACK` y `PERPLEXITY` desde `_TEMPLATE` | `git check-ignore` cubre los tres `.env`; cada `test_connection.sh` sale ≠ 0 con «Falta .env» | T001 | plan §6.1 paso 8 |
| T019 | [P] | Escribir el diseño de W1–W5 en `02-DOCS/wiki/stack/n8n-agenda.md`: prompts de Perplexity con esquema de salida, plantilla del documento y formatos de Slack | el fichero cubre W1–W5 y cada rama de §3, y está indexado | T012 | CA-06, CA-14…CA-22, CA-26 |
| T020 | [P] | Redactar el borrador del aviso de privacidad de la fase B (`gdpr-privacy`), sin publicar | el fichero existe y trata finalidad, fuentes, Perplexity, conservación, oposición y la pregunta de base legal | T016 | CA-21, CA-23, B8 |
| T021 |  | Actualizar el ledger de progreso, pasar la puerta, hacer commit, push y abrir PR 2 apilado sobre PR 1 | `bash scripts/verify.sh` → `VERIFY: VERDE`; PR abierto con «no fusionar antes de B7» | T008–T020 | — |

**T003 — Interfaces**
- Produce: `export type BookingOffer = { readonly url: string | null } | null`. `null` = no se ofrece;
  `url: null` = se ofrece pero no hay enlace configurado.
- Produce: `composeProposal(contact, service, price, kind, booking: BookingOffer): string`.

**T005 — Interfaces**
- Consume: `RedactedOutcome.showCalendar` (existe). Produce: `SubmitDeps.bookingUrl: string | null`.
- Regla: `booking = outcome.showCalendar ? { url: deps.bookingUrl } : null`. Es la **misma** regla
  que decide el calendario en pantalla.

**T012 — Interfaces**
- Produce: `export type TeamNoticeResult = 'ok' | 'failed' | 'not_configured'`.
- Produce: `interface TeamNoticePort { notify(notice: LeadNoticeV1): Promise<TeamNoticeResult> }`.
  Los adaptadores son `FakeTeamNoticePort` (graba), `OffTeamNoticePort` (`not_configured`) y
  `N8nWebhookTeamNoticePort(url, secret, timeoutMs = 5000)`.
- Produce: `selectTeamNoticePort(env: { N8N_LEAD_WEBHOOK_URL?, N8N_LEAD_WEBHOOK_SECRET?, NODE_ENV? })`.
  Con los dos valores, adaptador real; sin ellos y en desarrollo, falso; sin ellos y en producción,
  apagado. **El apagado no lanza**: el lead nunca depende de este aviso.
- Produce: `buildLeadNotice(lead: LeadRecord, report: { registry, clientEmail }): LeadNoticeV1`, con la
  forma de §3.

**T013 — Interfaces**
- Produce: `DispatchReport.teamNotice: TeamNoticeResult`. Orden: `registry → clientEmail →
  teamNotice → internalEmail`.
- Produce: `buildInternalNotice(lead, registry, catalog, teamNotice)`. Añade una línea cuando
  `teamNotice ≠ 'ok'`.

## Review Workload Forecast

| Dimension | Forecast | Why |
| --- | --- | --- |
| Estimated changed lines | PR 1 ≈ 150 de código y pruebas, más documentación. PR 2 ≈ 450 de código y pruebas, más ≈ 200 de SQL y la documentación | 21 tareas; la mitad del PR 2 son pruebas |
| Files / areas | PR 1: `core/proposal`, `core/outcome`, `core/submit`, `app/actions`, pruebas y la lista de tono. PR 2: `core`, `ports`, `content/privacidad`, `scripts/secret-gate`, `01-TOOLS/{SUPABASE,N8N,SLACK,PERPLEXITY}` y la wiki | La web, el SQL y la documentación de n8n |
| Review risk | PR 1 bajo. PR 2 **medio-alto** | El PR 2 toca datos personales, permisos de la base y el aviso de privacidad |
| Suggested delivery | PR 1 `single-pr`. PR 2 `ask-on-risk` | El PR 2 supera el `line_budget` de 400 contando SQL; se revisa por bloques (web / SQL / documentación) |
