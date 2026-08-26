---
type: decision
title: Decisions Log
description: Registro append-only de cada decision significativa del proyecto, con las opciones descartadas y el por que.
tags: [decisiones, append-only, auditoria]
timestamp: 2026-08-26T10:42:48Z
aliases: [decisions]
topic: harness
status: stable
sources: ["Sesion de arranque del arnes, 2026-08-26"]
score: 6.0
---

# Decisions Log (append-only)

> One entry por decisión significativa. Nunca se edita ni se borra; se supersede añadiendo una nueva.

---
## D-0001 — Nivel técnico y dial de acompañamiento
- date: 2026-08-26
- context: Primer contacto del arnés en workspace vacío (`nexus_presupuestos`). Sin perfil previo.
- options considered:
  1. non-technical + L3 — lenguaje llano, explico todo, pregunto mucho.
  2. mixed + L2 — término definido una vez, justifico decisiones relevantes.
  3. technical + L1 — jerga directa, una línea de por qué por paso.
- decision: technical_level = non-technical, accompaniment_level = L3, language = es.
- why: elección explícita del usuario en el primer contacto.
- supersedes: none

---
## D-0002 — Dominio del proyecto
- date: 2026-08-26
- context: Workspace greenfield. Había que decidir si el arnés gobierna software o un dominio no-código.
- options considered:
  1. Software — app/web/backend/agente que hay que programar y desplegar.
  2. Arnés no-código — empresa/ops, investigación, conocimiento, contenido.
  3. Las dos cosas — software envuelto en procesos y conocimiento.
- decision: software.
- why: elección explícita del usuario en Fase 2 (DISCOVER) de `init`.
- supersedes: none

---
## D-0003 — Modelo del sub-agente `developer`
- date: 2026-08-26
- context: `init` Paso 4. El sub-agente que implementa código debe tener un tier fijado para acotar coste.
- options considered:
  1. balanced / Sonnet — rápido y económico, calidad alta (recomendado, y el default del instalador).
  2. heavy / Opus — máxima calidad de razonamiento, más lento y más caro.
  3. light / Haiku — descartado por norma del arnés: demasiado débil para implementar.
- decision: balanced (Sonnet). Escrito en `.rsc/developer.json`.
- why: elección del usuario; cubre el 95% del trabajo y se puede subir puntualmente en tareas duras.
- supersedes: none

---
## D-0004 — Base técnica de la landing
- date: 2026-08-26
- context: Una sola página pública con formulario que acaba en email al equipo. Sin base de datos.
  Diseño libre. Queda ABIERTO si el formulario mostrará una cifra estimada al lead — ese es el riesgo
  que manda en la elección.
- options considered:
  1. Next.js (App Router) — página + envío de email en el mismo proyecto; admite después calculadora,
     panel o base de datos sin migrar.
  2. Astro — la más rápida y la mejor para SEO puro de marketing; si esto crece a app, toca mudarse.
  3. Página estática + servicio externo de formularios — mínimo mantenimiento, techo bajo.
- decision: Next.js (App Router).
- why: elección del usuario sobre recomendación. El cálculo de precio está sin decidir; Next.js lo
  absorbe sin rehacer el proyecto, y el coste extra de maquinaria es pequeño para una landing.
- supersedes: none

---
## D-0005 — Skills instaladas para este proyecto
- date: 2026-08-26
- context: Fase 3 (INSTALL) de `init`. Solo se instala lo que el discovery justificó.
- decision: `nextjs`, `design`, `email-connector`, `landing-copy`, `deployment`, `gdpr-privacy`
  (además de las 28 del arnés base). Instaladas en los destinos `claude` y `codex`.
- why: framework y aspecto visual desde cero; el email al equipo es la pieza crítica del embudo; el
  texto de conversión pesa más que el diseño en una landing de captación; publicar es requisito; y se
  recogen datos personales de leads, así que privacidad y consentimiento no son opcionales.
- note: `npx @ericrisco/rsc add <ids>` instaló solo en `codex`; el destino Claude Code requirió
  `--target claude`. `sync` tampoco propaga entre destinos.
- supersedes: none

---
## D-0007 — Red de seguridad y estado del terreno
- date: 2026-08-26
- context: Fase 4 (GROUND). technical_level = non-technical activa el danger-guard.
- decision: danger-guard ACTIVO — bloquea borrados en bloque, reescrituras forzadas del historial de
  git, DROP/TRUNCATE, borrados masivos en base de datos sin filtro, y descargas ejecutadas a ciegas.
  Context7 ya conectado como MCP, no hace falta wirearlo. Auditoría: 34 skills, sin solapes.
- why: perfil no técnico → red de seguridad por defecto; avisado al usuario para que un bloqueo no le
  sorprenda. Se desactiva solo si él lo pide (`.rsc/.no-danger-guard`).
- nota de campo: el guardián bloqueó un comando cuyo único delito era *mencionar* esos comandos en un
  fichero de documentación. Falso positivo conocido: es más estricto de lo necesario, por diseño.
- supersedes: none

---
## D-0008 — Sin control de versiones en esta carpeta
- date: 2026-08-26
- context: Fase 4 (GROUND) de `init`. La carpeta no era un repositorio git. Se ofreció crearlo.
- options considered:
  1. `git init` local — historial de cambios, poder volver atrás; nada sale del disco.
  2. Sin git — se escribe una marca `.rsc/.no-git` y nadie lo vuelve a preguntar.
  3. Aplazarlo hasta que empiece el código.
- decision: sin git. Marca `.rsc/.no-git` creada.
- why: decisión explícita del usuario.
- consecuencia asumida: no hay historial ni forma de deshacer cambios pasados. `ship` y las fases del
  chain SDD que asumen git quedarán limitadas. Revisable en cualquier momento borrando la marca.
- supersedes: none

---
## D-0009 — Taxonomía de topics de la wiki
- date: 2026-08-26
- context: El ingest de arranque tenía que clasificar 4 fuentes. El protocolo exige inferir los topics
  del contenido, nunca hardcodearlos ni asumir que "proyecto" significa "código".
- options considered:
  1. Un topic por fuente (`masterprompt/`, `estimacion/`) — trazable pero inútil para consultar.
  2. Topics por dominio de negocio: `firma/`, `comercial/`, `producto/`, más `meta/`, `operations/`,
     `harness/`.
  3. Un único topic `nexus/` con todo dentro — plano y sin capacidad de crecer.
- decision: opción 2, seis topics.
- why: separa el marco (firma) de las reglas monetizables (comercial) y de los requisitos de la cosa
  que construimos (producto). Cuando cambien los rangos de 2027, se toca `comercial/` y nada más.
- supersedes: none

---
## D-0010 — El cálculo de estimación se ejecuta en servidor
- date: 2026-08-26
- context: `Estimacion Economica.pdf` está marcado *documento interno* y contiene multiplicadores,
  tabla de puntuación y umbral de cualificación. La landing tiene que calcular con ellos.
- options considered:
  1. Cálculo en el navegador — instantáneo y sin coste de servidor, pero publica los márgenes y el
     umbral a cualquiera que abra las herramientas de desarrollo.
  2. Cálculo en servidor (route handler / server action de Next.js) — los factores no salen nunca del
     servidor; cuesta un viaje de red.
  3. Rangos precalculados servidos como tabla estática — sigue exponiendo la matriz de precios.
- decision: cálculo en servidor. Rangos, factores y umbral en configuración server-side, con el umbral
  en un único punto (el documento avisa de que está EN REVISIÓN) y fecha de caducidad 31-12-2026.
- why: es información comercial interna. La opción 1 la publica de facto, y la 3 también.
- nota: esta es la justificación de fondo de D-0004 (Next.js): una página estática no podría hacerlo.
- supersedes: none

---
## D-0011 — Nota: el número D-0006 no existe
- date: 2026-08-26
- context: La numeración salta de D-0005 a D-0007. El diario es append-only, así que no se renumera:
  se explica.
- decision: dejar el hueco y documentarlo aquí.
- why: la entrada D-0006 iba dentro de un comando que el danger-guard bloqueó (su texto *mencionaba*
  comandos peligrosos dentro de la documentación). Al reescribirlo se le asignó D-0007 y el 6 quedó sin
  usar. Un hueco explicado es mejor que un historial reescrito.
- supersedes: none

---
## D-0012 — Sin git tampoco para el código de la app
- date: 2026-08-26
- fase: constitution
- context: `D-0008` decidió no usar git en esta carpeta, y era una decisión sobre una carpeta de
  documentos. Al ratificar la constitución había que decidir si esa regla alcanza también al código
  de la landing, que es lo que `implement` va a empezar a escribir.
- options considered:
  1. Git sólo para el código: la app en su propio repositorio, la wiki sin git (recomendada).
  2. Git para todo el workspace, revocando D-0008.
  3. Sin git en ningún sitio, extendiendo D-0008 al código.
- decision: opción 3.
- why: elección del usuario, contra la recomendación (opción 1).
- consecuencia asumida: no hay historial, no hay deshacer y no hay ramas. Las fases **`worktrees` y
  `ship` quedan fuera del chain SDD** porque no tienen sobre qué operar, e `implement` trabaja sin
  red: un cambio que rompa algo no se revierte, se rehace. Como compensación, el principio 19 de la
  constitución obliga a copia previa antes de cualquier cambio estructural o borrado amplio. El
  principio fijo del ecosistema sobre autoría humana de los commits queda inaplicable, escrito en el
  principio 20 por si git aparece más adelante.
- revisable: borrando `.rsc/.no-git` y creando el repositorio del subproyecto.
- supersedes: none (extiende D-0008)

---
## D-0013 — Dominio y remitente de correo: executivelab.ai vía Resend
- date: 2026-08-26
- fase: implement (configuración)
- context: `S-0012` ya había elegido Resend como proveedor, pero faltaban la credencial real y el
  dominio de envío. Sin eso, la app en producción usa el adaptador que falla a propósito (`F-1`) y
  ningún lead recibe su estimación.
- decision: credencial de Resend instalada y dominio de envío **executivelab.ai** (verificado en
  Resend, región `eu-west-1`, envío habilitado). Remitente:
  `Nexus Strategy & Technology <presupuestos@executivelab.ai>`.
- why: es el único dominio verificado en la cuenta; sin verificar, Resend sólo entrega al titular.
  El buzón `presupuestos@` nombra la función y no depende de ninguna persona.
- consecuencia asumida: los dos correos de cada lead (la estimación al visitante y el aviso interno)
  salen desde ese remitente. El riesgo de `S-0007` sigue vivo: sin anti-spam, un bot puede quemar
  reputación del dominio. Vigilar el panel de Resend.
- supuesto pendiente de confirmar: el aviso interno se dirige a `eric.risco@executivelab.ai`
  (`NEXUS_INTERNAL_MAILBOX`), en lugar del `oportunidades@nexus-st.com` que el código traía por
  defecto y que no consta como buzón activo.
- dónde vive: `01-TOOLS/RESEND/.env` (operación manual) y `03-APP/.env.local` (la app). Ambos con
  permisos 600 y fuera de cualquier publicación.
- supersedes: none (completa S-0012)
