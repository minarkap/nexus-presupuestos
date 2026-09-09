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
score: 21.0
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

---
## D-0014 — El workspace pasa a git: repositorio privado en la org Executive-Lab
- date: 2026-08-26
- fase: operación (petición directa del usuario)
- context: `D-0008` decidió no usar git en la carpeta y `D-0012` extendió esa regla al código de la
  landing. El usuario pide ahora subir el proyecto entero a la organización de GitHub
  `Executive-Lab`, con la condición explícita de que ningún `.env` salga y de que exista un
  `.gitignore` global en la raíz.
- options considered:
  1. Repositorio **privado** con todo el workspace (recomendada y elegida).
  2. Repositorio público — descartada: los multiplicadores, la tabla de puntuación y el umbral de
     cualificación son internos por regla de producto; en abierto quedan a la vista de cualquiera.
  3. Solo `03-APP/` en git, dejando la wiki y el arnés fuera — no se planteó al usuario porque pidió
     "este proyecto", no una parte.
- decision: `Executive-Lab/nexus-presupuestos`, **privado**, rama `main`. Se sube el workspace
  completo, incluidos `.rsc/` con sus `backups/`, `.claude/` y `.codex/` (elección explícita del
  usuario: "absolutamente todo"). Marca `.rsc/.no-git` eliminada.
- why: petición directa. La visibilidad privada la eligió el usuario sobre la recomendación, que
  coincidía.
- qué queda fuera del repositorio: `01-TOOLS/RESEND/.env` y `03-APP/.env.local` (las dos únicas
  ubicaciones con credenciales reales), más dependencias y salidas de compilación. Solo viajan las
  plantillas `.env.example` y las `CREDENTIALS.md` de plantilla, sin valores. Verificado en el
  remoto tras el push.
- consecuencia asumida: **el principio 18 de la constitución queda contradicho** y las fases
  `worktrees` y `ship`, que `D-0012` había sacado del chain, vuelven a tener sobre qué operar. La
  enmienda formal de la constitución está pendiente. El principio 19 (copia previa) deja de ser el
  único sustituto del historial, pero sigue vigente mientras no se enmiende. El principio 20 pasa de
  inaplicable a **activo**: autoría humana de los commits, sin `Co-Authored-By` de una IA.
- supersedes: `D-0008` y `D-0012`.

---
## D-0015 — Marca canónica: Nexus Consulting

- fecha: 2026-09-02
- context: el proyecto contenía **dos marcas incompatibles**. El cerebro y el copy de la app hablaban
  de *Nexus Strategy & Technology* (boutique iberoamericana de estrategia, transformación, IA, ESG,
  ciberseguridad y operaciones; tres sedes; estética serif clara sobre papel crema). El material que
  el usuario aportó en `referencias/` y el design system descargado hablan de *Nexus Consulting*
  (consultora tecnológica premium en Andorra la Vella; software a medida, IA aplicada, automatización,
  integración y consultoría tecnológica; dark navy con azul eléctrico y cian; motivo de nodos).
  Nombre, posicionamiento, catálogo, geografía, audiencia y estética diferían en todo.
- options considered:
  1. **Nexus Consulting es la marca canónica** (recomendada y elegida).
  2. Mantener *Strategy & Technology* y tomar del design system solo la capa visual — descartada por
     el usuario. Habría dejado el system descabezado: los logos y el motivo de nodos son de Nexus
     Consulting y no se podrían usar.
  3. Coexistencia en dos capas (Consulting pública, Strategy & Technology interna) — descartada:
     obliga a mantener dos identidades sincronizadas y a documentar una frontera que ningún agente
     futuro respetaría en un email a un lead.
- decision: **Nexus Consulting**. Esencia *"El punto donde todo conecta"*, claim *"Tecnología que
  conecta. Soluciones que avanzan."*, sede Andorra la Vella, audiencia de CEOs/COOs/fundadores de
  empresas B2B en crecimiento. Fuente de verdad:
  [Marca Nexus Consulting](../firma/Marca%20Nexus%20Consulting.md), destilada del masterprompt
  aportado por el usuario.
- why: el masterprompt y el design system son material de marca **real, completo y coherente entre
  sí** (misma paleta, misma tipografía, mismo motivo). *Strategy & Technology* era la ficción
  didáctica de una clase anterior, sin activos visuales de ningún tipo.
- consecuencia asumida — **lo que queda desalineado y no se ha tocado**: el catálogo de precios
  (`03-APP/src/core/catalog.ts` y
  [Catálogo 2026](../comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md)) describe seis
  servicios de *Strategy & Technology* —AI Opportunity Assessment, AI Transformation Program, AI
  Executive Advisory, Cyber Resilience Assessment, ESG Strategy & Compliance, Custom AI Solutions—
  que **Nexus Consulting no vende**: su oferta son cinco áreas distintas y no incluye ESG ni
  ciberseguridad. Los importes (hasta 350.000 €, programas CSRD, NIS2/DORA) son de consultoría
  enterprise, no de las pymes y scaleups a las que habla Nexus Consulting. Está registrado como hueco
  abierto en [gaps.md](../gaps.md); resolverlo toca reglas de producto protegidas por los principios
  4–11 y 16 de la constitución, incluida la prueba de regresión anclada a 28.000 – 35.000 €.
  **Decisión pendiente del usuario, no de un agente.**
- supersedes: la identidad descrita en los tres artículos de `firma/`, que quedan anotados como
  superados en parte. No se han reescrito: el usuario pidió ordenar, no ejecutar.

---

## D-0016 — El design system vive como skill del proyecto

- fecha: 2026-09-02
- context: el *Nexus Consulting Design System* estaba en `~/Downloads` (12 MB). Trae `SKILL.md` con
  `name: nexus-consulting-design` y `user-invocable: true`, es decir, viene empaquetado como Agent
  Skill, no como una carpeta de assets.
- options considered:
  1. **Instalarlo en `.claude/skills/nexus-consulting-design/`** del subproyecto (elegida).
  2. Dejarlo en `03-APP/` como carpeta de assets — descartada: se pierde la activación automática y
     el agente no sabría que existe hasta que alguien se acordara de mencionarlo.
  3. Volcarlo en el cerebro (`02-DOCS/raw/`) — descartada: `raw/` es material inmutable de consulta;
     un design system es una herramienta que se ejecuta, no una fuente que se lee.
- decision: instalado en `.claude/skills/nexus-consulting-design/`, junto a las otras 34 skills del
  proyecto. Así se activa solo cuando se trabaje en interfaz, sin depender de que nadie lo recuerde.
- why: su propio `SKILL.md` declara la intención del autor. Respetarla es gratis y da activación
  automática.
- limpieza aplicada: **12 MB → 6,6 MB sin perder información.** Se eliminaron de la copia instalada
  los tres PNG de `uploads/` que eran **duplicados byte a byte** (SHA-256 verificado) de sus
  equivalentes en `assets/`, más dos `.thumbnail` de la herramienta de diseño. Se conservó
  `uploads/nexus_palette_reference.pdf`, que no tiene equivalente. La tabla de procedencia del
  `readme.md` lleva nota de la deduplicación. El original íntegro sigue en `~/Downloads`.
- pendiente: el espejo de Codex (`.codex/rsc/`) lo gestiona `npx @ericrisco/rsc` y **no** se ha
  tocado a mano. Si se quiere el design system también en Codex, hay que hacerlo por la herramienta.

---

## D-0017 — El material de `referencias/` se consolida en el cerebro del subproyecto

- fecha: 2026-09-02
- context: la raíz del workspace de clase (`ClaseSEOGEO/referencias/`) contenía tres piezas de marca
  de Nexus Consulting: el masterprompt de identidad (22 KB de markdown), una landing HTML de 1 MB y
  una presentación `.dc.html`. Son material del subproyecto, no del workspace de formación.
- options considered:
  1. **Copiar al cerebro del subproyecto** y proponer la limpieza de la raíz (elegida).
  2. Mover directamente, dejando la raíz limpia de una vez — bloqueado por el guard de permisos, y
     además el protocolo reserva el movimiento para ficheros sueltos en la raíz, no para carpetas que
     el usuario ha organizado.
  3. Ingerirlo en el cerebro del workspace raíz — descartada: es marca de Nexus Consulting, y el
     workspace raíz es de formación sobre arneses.
- decision: copiado a `02-DOCS/raw/firma/_originals/` (el masterprompt) y
  `02-DOCS/raw/producto/_originals/` (landing y presentación), con hash verificado. Compilado a
  [Marca Nexus Consulting](../firma/Marca%20Nexus%20Consulting.md).
- why: el masterprompt es ahora la fuente de verdad de la identidad (D-0015); tiene que vivir donde
  el proyecto lo lea.
- pendiente de consentimiento: `ClaseSEOGEO/referencias/` sigue existiendo con los tres ficheros
  originales. Está duplicado, no perdido. Borrarlo requiere permiso explícito y citado del usuario.

---

## D-0018 — La landing se publica en Vercel, con el repositorio como origen
- date: 2026-09-09
- fase: operación (petición directa del usuario)
- context: el perfil de usuario tenía abierta la pregunta "¿dónde se publica y con qué dominio?".
  Con el workspace ya en git (`D-0014`) existe un origen del que una plataforma puede tirar. El
  usuario pide subir `03-APP/` a Vercel y crear la conexión.
- options considered:
  1. **Vercel conectado al repositorio** (elegida): cada commit en `main` publica solo.
  2. Vercel por CLI desde el portátil — descartada: publicar dependería de una máquina concreta y
     de que alguien se acuerde de lanzar el comando.
  3. Un servidor propio (Hetzner + Coolify u otro) — descartada por ahora: exige operar máquina,
     certificados y actualizaciones para una landing de tráfico bajo.
- decision: proyecto en Vercel apuntando a `Executive-Lab/nexus-presupuestos`, con **Root Directory
  = `03-APP`** (la app no está en la raíz del repositorio), preset Next.js, Node 24.x y rama de
  producción `main`. La conexión operativa vive en `01-TOOLS/VERCEL/` (token + prueba de humo).
- why: Vercel es el hogar natural de Next.js — compila el App Router sin configuración y publica
  desde git sin que nadie tenga que intervenir. El plan gratuito cubre el volumen previsto.
- consecuencia asumida: las variables de entorno de producción pasan a vivir **también** en el panel
  de Vercel, un segundo sitio donde una credencial puede filtrarse; el `.env.local` deja de ser la
  única copia. Y todo lo que entre en `main` se publica: la rama pasa a ser producción.
- qué NO decide esto: el dominio. Mientras no se elija, la landing vive en una URL `*.vercel.app`.
- dónde vive: `01-TOOLS/VERCEL/` (README, `.env.example`, `CREDENTIALS.md`, `test_connection.sh`).
  El `.env` con el token real queda fuera del repositorio.
- pendiente: crear el proyecto en el panel de Vercel, pegar el token en `01-TOOLS/VERCEL/.env` y
  cargar las variables de entorno del proyecto.
- nota de numeración: esta decisión se redactó como `D-0015` y se renumeró a `D-0018` el 2026-09-09,
  antes de publicarse. En paralelo, la rama `feat/sitio-nexus-consulting` ya había registrado
  `D-0015`, `D-0016` y `D-0017` en el remoto. Esa rama ya está fusionada, así que la numeración de
  este fichero es continua: no falta nada.
- supersedes: none
