---
type: decision
title: SDD Decisions Log
description: Registro append-only de las decisiones de alcance y diseño tomadas dentro del chain SDD.
tags: [sdd, decisiones, append-only]
timestamp: 2026-08-26T12:30:16Z
topic: sdd
status: stable
---

# SDD Decisions Log (append-only)

> Log canónico del chain SDD, compartido por `constitution`, `specify` y `plan`.
> Distinto del log del arnés en [harness/decisions.md](../harness/decisions.md).

---
## S-0001 — Alcance del primer spec: una sola pieza, no tres
- date: 2026-08-26
- fase: specify
- context: La petición contenía landing + formulario + estimador + cualificación + dos emails. Había
  que decidir si eso son varios specs independientes o uno.
- decision: **un único spec** — `landing-presupuestos-nexus`.
- why: no son subsistemas independientes; comparten un mismo recorrido de usuario y el formulario no
  tiene sentido sin la landing ni los emails sin el cálculo. Trocearlo habría creado tres contratos
  que sólo se pueden verificar juntos.
- supersedes: none

---
## S-0002 — La rama sin catalogar también se puntúa y puede ver calendario
- date: 2026-08-26
- fase: specify
- context: El dossier define la rama de «Estrategia y operaciones» como *sin cifra, llamada de
  alcance*, pero no dice si esos leads se puntúan ni si ven calendario. Era el único hueco funcional
  con consecuencias comerciales reales.
- options considered:
  1. Se puntúa igual; si supera el umbral, ve calendario (sin cifra).
  2. Nunca calendario en esa rama.
  3. Sin calendario, pero comercial recibe la puntuación y decide a mano.
- decision: opción 1.
- why: elección del usuario sobre recomendación. El dossier dice que no se da un número sin entender
  el problema — no dice que no se dé una llamada. Un lead con sponsor y presupuesto es exactamente el
  cliente ideal descrito en `Criterio de Decisión de la Firma`, tenga tarifa su línea o no.
- supersedes: none

---
## S-0003 — La landing no hereda la identidad visual de los documentos de la firma
- date: 2026-08-26
- fase: specify
- context: Al abrir `Estimacion-Economica.pdf` se confirmó que la firma sí tiene identidad visual
  (titulares en serif, azul marino profundo, filete cobre, mucho blanco), lo que contradecía el
  supuesto de partida «no hay marca que respetar» del user-profile. Se le presentó al usuario.
- options considered:
  1. Heredarla entera — coherencia con lo que el lead recibirá después.
  2. Heredar colores con tipografía más moderna.
  3. Diseño de cero, propuesta libre.
- decision: opción 3, diseño de cero.
- why: decisión explícita del usuario, mantenida **después** de conocer la identidad existente. No es
  desconocimiento: es una elección informada.
- consecuencia asumida: un lead verá una estética en la landing y otra distinta en el PDF de
  propuesta. Las reglas de tono siguen siendo vinculantes en ambas superficies.
- supersedes: none

---
## S-0004 — Privacidad diferida a antes de publicar
- date: 2026-08-26
- fase: specify
- context: El formulario recoge datos personales de posibles clientes. Se ofreció redactar el aviso de
  privacidad y la casilla de consentimiento dentro de esta primera versión.
- decision: **fuera de esta versión**, requisito previo a publicar.
- why: decisión explícita del usuario tras exponerle el riesgo.
- consecuencia asumida: la landing no puede estar accesible en abierto mientras no exista el aviso.
  Registrado como `decisión diferida` en el spec, con su condición de salida escrita, para que
  `clarify` no lo trate como pregunta ni `implement` lo dé por resuelto.
- supersedes: none

---
## S-0005 — El contacto se pide antes de mostrar el resultado
- date: 2026-08-26
- fase: specify
- context: El orden entre «pedir contacto» y «mostrar el rango» decide si un lead puede consumir la
  estimación sin dejar rastro. El dossier no lo dice; exige los dos emails, que lo implican.
- decision: contacto como última pregunta, resultado después.
- why: es la única secuencia compatible con enviar propuesta al cliente y aviso interno. Registrado
  como suposición tomada en el spec, con el riesgo de abandono anotado.
- supersedes: none

---
## S-0006 — Se acepta perder leads: sin garantía de durabilidad
- date: 2026-08-26
- fase: clarify
- context: El spec sostenía a la vez el objetivo «ningún lead se pierde por un fallo técnico» y el
  no-objetivo «sin base de datos». Si fallan el correo y el registro de respaldo a la vez, no hay
  ningún sitio donde ese envío haya quedado escrito. Los dos no podían convivir.
- options considered:
  1. Cero pérdida: registro propio duradero, se escribe antes de nada y se reintenta desde ahí.
  2. Dos vías independientes más aviso al equipo si ambas fallan.
  3. Asumir el riesgo y eliminar el objetivo.
- decision: opción 3.
- why: elección del usuario, contra la recomendación (opción 1). Con volumen bajo (C-08 del spec) el coste
  esperado de un lead perdido se considera menor que la complejidad de garantizar que no ocurra.
- consecuencia asumida: se elimina un objetivo del spec, CA-17 baja a *best-effort* y el registro de
  respaldo deja de ser una red de seguridad. Sin almacén duradero tampoco hay memoria posible del
  embudo, lo que aleja aún más el área no formulable del lead que repite.
- supersedes: none

---
## S-0007 — No hay anti-spam, y el buzón se limpia a mano
- date: 2026-08-26
- fase: clarify
- context: El spec describía una defensa anti-bot invisible pero no le había asignado ningún criterio
  de aceptación, y no decía qué pasa con un envío sospechoso.
- options considered:
  1. Marcar sin bloquear: se procesa, el aviso interno llega marcado, no sale correo al cliente.
  2. Descartar en silencio.
  3. No filtrar: entra todo y el equipo separa a mano.
- decision: opción 3.
- why: elección del usuario, contra la recomendación (opción 1). Cero falsos positivos y cero trabajo
  de construcción, sostenible mientras el volumen sea de decenas al mes.
- consecuencia asumida: cada envío de bot dispara también un correo a la dirección declarada, que
  puede no existir. Mandar correo a direcciones inventadas degrada la reputación del dominio de
  envío de Nexus y puede acabar bloqueando el correo legítimo. **Condición de revisión escrita:** si
  el volumen pasa a cientos al mes, la decisión se reabre antes de que el daño sea visible.
- supersedes: la suposición del spec «protección anti-spam sin prueba visual».

---
## S-0008 — Sin restricción de residencia de los datos personales
- date: 2026-08-26
- fase: clarify
- context: Se recogen nombre, email y empresa de directivos. Nadie había fijado si esos datos pueden
  salir de la UE, y de ello dependían el proveedor de email y el destino del registro de respaldo.
- options considered:
  1. Todo en la UE como requisito duro.
  2. UE preferente, se aceptan proveedores US con garantías (SCC / Data Privacy Framework).
  3. Indiferente: se elige por comodidad.
- decision: opción 3.
- why: elección del usuario, contra la recomendación (opción 1). Prioriza velocidad de montaje.
- consecuencia asumida: se mantienen sin objeción Google Calendar y la hoja de cálculo de Google; el
  proveedor de email queda libre para la fase de plan; y el aviso de privacidad diferido tendrá que
  declarar transferencias internacionales y apoyarlas en garantías — más papel del que habría hecho
  falta con la opción europea. Queda escrito que Nexus vende cumplimiento NIS2 y DORA y que su propio
  formulario no aplicará ese criterio.
- supersedes: none

---
## S-0009 — Listón de pruebas: duro en el cálculo, normal en el resto
- date: 2026-08-26
- fase: constitution
- context: Había que fijar qué hace que una tarea esté terminada, porque es exactamente lo que la fase
  `verify` ejecutará. Sin esto, `verify` no tiene nada contra qué medir.
- options considered:
  1. Pruebas duras en los dos motores (TDD, cobertura alta, prueba exhaustiva de combinaciones) y
     pruebas normales en el resto.
  2. Pruebas sólo de los motores; formulario, correos y salidas a mano.
  3. Sin pruebas automáticas.
- decision: opción 1.
- why: elección del usuario, coincidente con la recomendación. El motor de precios es determinista y
  ya trae un caso de referencia con resultado exacto (28.000 – 35.000 €), así que es barato de probar
  y caro de equivocar: una cifra mal calculada sale por correo con el membrete de Nexus.
- consecuencia: principios 14 a 17 de la constitución. La prueba exhaustiva del principio 15 es
  posible porque el espacio de combinaciones de las respuestas 1 a 5 es finito y pequeño.
- supersedes: none

---
## S-0010 — Accesibilidad AA sólo en el recorrido del formulario
- date: 2026-08-26
- fase: constitution
- options considered:
  1. WCAG 2.2 AA en toda la landing (recomendada).
  2. AA sólo en el formulario; el resto sin suelo declarado.
  3. Sin suelo declarado en ninguna parte.
- decision: opción 2.
- why: elección del usuario. Cubre el recorrido donde de verdad se pierde gente —las ocho pantallas—
  con menos trabajo de revisión que auditar la página entera.
- consecuencia asumida: la parte de presentación de la landing puede no cumplir AA. Para una firma que
  vende cumplimiento normativo, si un cliente pregunta por accesibilidad la respuesta cubre el
  formulario y no la página. Principios 24 y 25.
- supersedes: none

---
## S-0011 — Sin presupuesto de rendimiento
- date: 2026-08-26
- fase: constitution
- options considered:
  1. Objetivos medibles de Core Web Vitals (recomendada).
  2. "Que vaya rápida", sin cifras.
  3. No es una prioridad.
- decision: opción 3.
- why: elección del usuario, contra la recomendación. Con volumen bajo (C-08) y visitas que llegan por
  recomendación, se prefiere invertir el esfuerzo en texto y diseño.
- consecuencia: principio 26, escrito **en positivo** para que ninguna fase posterior invente un
  objetivo: `verify` no debe comprobar Core Web Vitals. Es una ausencia decidida, no un olvido.
- supersedes: none

---
## S-0012 — Proveedor de correo transaccional: Resend
- date: 2026-08-26
- fase: plan
- context: Los dos correos son el embudo entero. Estaba pendiente desde `init` y la fase de plan es
  donde deja de poder aplazarse, porque define un puerto y su adaptador.
- options considered:
  1. **Resend** — API mínima, plantillas en React, plan gratuito de 3.000 correos/mes.
  2. **Postmark** — la mejor reputación de entrega del mercado en correo transaccional; más caro y sin
     plan gratuito real.
  3. **SendGrid** — el más veterano y el de configuración más pesada; su reputación compartida es peor.
- decision: Resend.
- why: con decenas de envíos al mes (C-08) el plan gratuito cubre el caso entero, y su API es la que
  menos código de adaptador exige en un proyecto Next.js. `S-0008` retiró la única restricción que
  habría cambiado la elección (residencia de datos). Postmark sería la elección correcta si la
  entregabilidad fuera crítica — y `S-0007` la ha vuelto frágil por otro camino, así que la ventaja
  de Postmark quedaría anulada de todos modos por enviar a direcciones de bots.
- consecuencia: se define `EmailPort` como interfaz y Resend queda detrás de un adaptador. Cambiar de
  proveedor es escribir otro adaptador, no tocar el flujo.
- supersedes: none

---
## S-0013 — Las respuestas de negocio se validan en servidor
- date: 2026-08-26
- fase: review
- context: La lectura adversaria posterior a `verify` probó a llamar a la acción de servidor con un
  tramo de tamaño inventado. Resultado: el multiplicador salía `undefined`, la aritmética daba `NaN`
  y el sistema devolvía **«NaN – NaN €»** en pantalla y enviaba un correo con el membrete de Nexus
  con esa cifra dentro. Las 144 pruebas existentes no lo veían porque todas usaban valores válidos
  del enum.
- por qué era posible: una acción de servidor de Next.js es un **endpoint HTTP público**. El
  formulario nunca produciría esa entrada, pero el formulario no es la única vía de entrada. Se
  estaba validando el contacto y no las respuestas.
- decision: `validateAnswers` comprueba las siete respuestas de negocio contra sus valores
  admisibles **antes de calcular nada**. Entrada no reconocida → error de validación, sin cálculo,
  sin correo y sin fila en el registro.
- why: el catálogo cerrado existe precisamente como «el mecanismo que impide que una cifra
  improvisada salga de la firma» (constitution 4, 5 · CA-02). Una cifra `NaN` es el caso extremo de
  cifra improvisada, y salía por correo firmado.
- consecuencia: 12 pruebas nuevas (`validation.test.ts`), incluida una que afirma que **ninguna**
  entrada inventada produce `NaN` en la respuesta. Total 156 pruebas, cobertura de `src/core/` sigue
  al 100 %.
- supersedes: none

---

## S-0014 — La landing adopta el design system de Nexus Consulting

- fecha: 2026-09-02
- context: `S-0003` decidió que la landing **no** heredaba la identidad visual de los documentos de
  la firma, y se construyó una estética propia: papel crema `#faf9f7`, azul marino `#1c3f5e`, acento
  cobre `#b4622a`, tipografía serif del sistema, radio 4 px, 105 líneas de CSS a mano en
  `globals.css`. Esa decisión se tomó cuando no existía marca que respetar — así lo dice el perfil
  de usuario: *"Diseño: desde cero, propuesta libre (no hay marca que respetar)"*. Ahora sí existe:
  `D-0015` fija Nexus Consulting como marca canónica y trae un design system completo.
- options considered:
  1. **Adoptar el design system por completo** (elegida por el usuario: *"hacer de nexus presupuestos
     mejor gráfico"*).
  2. Mantener la estética serif actual y solo pulirla — descartada: no cumple el objetivo del usuario
     y desperdicia un system ya construido y alineado con la marca.
  3. Híbrido serif + tokens del system — descartada sin plantearla: las dos estéticas son opuestas
     (claro editorial contra dark navy técnico) y mezclarlas produce exactamente el resultado que el
     masterprompt prohíbe, *"una marca visualmente recargada"*.
- decision: la interfaz pasa a **dark navy de Nexus Consulting**. Fuente única de estilo:
  `.claude/skills/nexus-consulting-design/` (`styles.css` + `tokens/`). Regla del propio system:
  **nunca hex a mano, siempre las custom properties** (`--accent-gradient`, `--surface-card`,
  `--text-strong`, …).
- alcance del cambio, para quien lo ejecute: `globals.css` se sustituye entero; `layout.tsx` carga
  las fuentes (Sora display, Inter cuerpo, IBM Plex Mono datos) y cambia `metadata`; las tres
  pantallas (`Landing.tsx`, `FormWizard.tsx`, `ResultScreen.tsx`) se re-visten. **La lógica de
  `src/core/` no se toca**: es cálculo, no marca.
- restricción heredada que sigue vigente: el principio 24 de la constitución exige **WCAG 2.2 AA en
  el recorrido del formulario** — contraste, foco visible, errores anunciados. El cambio a fondo
  oscuro obliga a re-verificar los contrastes; el foco cobre `#b4622a` actual desaparece y hay que
  sustituirlo por un foco visible sobre navy. Las pruebas de `a11y.test.tsx` son el guardián.
- supersedes: `S-0003`.

---

## S-0015 — Alcance de SEO y GEO: capa técnica en todo el sitio más una página explicativa

- fecha: 2026-09-02
- context: el usuario pide "meter SEO-GEO" explicando bien la diferencia entre ambos. Hoy el sitio
  tiene el mínimo: un `title` y una `description` en `layout.tsx`, y nada más — sin canonical, sin
  Open Graph, sin JSON-LD, sin `robots.txt`, sin `sitemap.xml`.
- options considered:
  1. **Ambas cosas**: capa técnica SEO+GEO en todas las páginas más una página que explique la
     diferencia (elegida).
  2. Solo la capa técnica — descartada por el usuario.
  3. Solo la página explicativa — descartada por el usuario.
- decision: dos frentes. **(a) Capa técnica**: metadatos por página con la API de Next, canonical,
  Open Graph y Twitter Cards, JSON-LD (`Organization`, `WebSite`, `Service`, `FAQPage`),
  `robots.txt` que permita explícitamente los crawlers de IA, `sitemap.xml`, texto alternativo y
  jerarquía de encabezados. **(b) Página explicativa** de la diferencia SEO / GEO, que además se
  optimiza a sí misma con lo que predica.
- why: en el workspace de una clase sobre SEO y GEO, una página que aplica lo que explica es a la vez
  material didáctico y demostración verificable.
- fundamento técnico: [SEO frente a GEO](../seo-geo/SEO%20frente%20a%20GEO.md), destilado del estudio
  de Princeton (arXiv:2311.09735, KDD 2024) y de la skill `seo-geo`.
- tensión con la constitución que quien ejecute debe resolver antes de escribir copy: el principio 27
  prohíbe **promesas de resultado** en cualquier texto del sitio. Los porcentajes de GEO (+40 % por
  citar fuentes, +37 % por estadísticas) son resultados de un estudio sobre *contenido genérico*, no
  promesas de Nexus a un cliente. Se pueden citar **como hallazgo de investigación con su fuente**;
  no se puede escribir "te subimos la visibilidad un 40 %". El principio 28 exige acta firmada por
  una persona antes de publicar.
- no ejecutado: el usuario pidió expresamente ordenar y no construir. No hay spec, ni plan, ni
  páginas. La ejecución entra por `specify` en otra sesión.

---

## S-0016 — Alcance del sitio Nexus Consulting: el catálogo manda en la arquitectura de servicios; la marca, en todo lo demás

- fecha: 2026-09-02
- fase: `specify` (spec `sitio-nexus-consulting`, aprobada en autopilot)
- context: `D-0015` fijó Nexus Consulting como marca canónica y dejó abierto un hueco de modelo de
  negocio: el motor de precios (`src/core/catalog.ts`) vende seis servicios de *Strategy &
  Technology* —incluidos ESG y ciberseguridad— y el masterprompt de Nexus Consulting describe cinco
  áreas distintas. [gaps.md](../gaps.md) lo registró como bloqueo del copy de servicios con tres
  salidas: (a) reescribir el catálogo, (b) mantenerlo y aceptar el desajuste, (c) no publicarlo.
- respuesta del usuario (Carlos del Corral, 2026-09-02, sesión de ejecución): *«me gustaría mantener
  la funcionalidad que ha hecho Eric pero con mi diseño, mis copys y todo lo demás que te he
  adjuntado»*, más «ok a todo» a nueve decisiones de alcance, entre ellas: marca visible Nexus
  Consulting con la oferta del catálogo; publicar los rangos oficiales en `/servicios` con su
  advertencia; ninguna cifra inventada; tema oscuro; `/privacidad` en este ciclo; enmienda v1.1 de la
  constitución; autopilot.
- options considered:
  1. **(b) hecha coherente** — el sitio se estructura por las cuatro líneas y los siete servicios del
     catálogo 2026 (lo que el estimador puede estimar), con la marca, la voz y la esencia de Nexus
     Consulting; las cinco áreas del masterprompt (software a medida, IA aplicada, automatización,
     integración, consultoría tecnológica) se presentan como **capacidades** con las que Nexus
     construye cada servicio. **Elegida.**
  2. (a) reescribir el catálogo con las cinco áreas y nuevos rangos — descartada: toca los principios
     4–11, rompe la prueba de regresión del 16 y contradice la petición explícita de conservar la
     funcionalidad.
  3. (c) catálogo interno, sin rangos en la web — descartada por el usuario (pregunta 4: sí a
     publicar los rangos) y porque renuncia a la pieza más citable del sitio.
- decision: opción 1. El hueco de `gaps.md` queda **resuelto a efectos del producto** (no del
  negocio: si algún día Nexus Consulting quisiera vender solo sus cinco áreas, es otra spec y una
  enmienda MAJOR).
- consecuencias registradas en la spec como *suposiciones tomadas*: nombres oficiales del catálogo
  conservados; dominio canónico `nexus.ad` por defecto y configurable; `/recursos/seo-frente-a-geo`
  entra por `S-0015`; método en las cuatro fases de la marca; `robots` permite a todos los
  rastreadores de IA; aviso de privacidad como borrador para revisión legal.
- corrección respecto a la propuesta inicial de esta sesión: se había recomendado geografía Madrid y
  dominio `nexus-st.com` sin conocer el masterprompt de Nexus Consulting; prevalece `D-0015`
  (Andorra la Vella, `nexus.ad`), que el usuario eligió explícitamente en la sesión de ordenación.
- supersedes: nada. Complementa `D-0015`, `S-0014` y `S-0015`.

---

## S-0017 — Constitución v1.1.0: git real, marca canónica y principios de visibilidad

- fecha: 2026-09-02
- fase: `constitution` (enmienda MINOR dentro del ciclo `sitio-nexus-consulting`)
- context: la constitución v1.0.0 decía «este proyecto no usa git» (18) cuando el workspace lleva en
  git desde `D-0014`; su ejecutor de voz apuntaba a la marca derogada; y no legislaba nada sobre
  identidad visual, indexabilidad ni metadatos, que son el corazón de la spec `sitio-nexus-consulting`.
  `analyze` y `verify` citan la constitución por número: sin enmienda, chocarían.
- options considered:
  1. **Enmienda MINOR ahora, dentro del ciclo** (elegida): tachar y sustituir 18–19, activar 20,
     redirigir el ejecutor de 27, añadir la sección 9 (30–36) y ampliar el DoD.
  2. Enmendar solo 18–20 y dejar la visibilidad como criterios de la spec — descartada: `verify`
     necesita principios numerados para citarlos, y la spec caduca con la feature; la constitución no.
  3. Reescribir la constitución entera para Nexus Consulting — descartada: los principios 1–17 y
     21–26 siguen siendo correctos; reescribir lo que no cambia destruye la trazabilidad.
- decision: v1.1.0 aplicada. Ratificación: Carlos del Corral, «ok a todo» (punto 8 de las nueve
  decisiones de alcance), 2026-09-02. Se mantiene el 26 (sin presupuesto de rendimiento): el 32 es
  indexabilidad, no velocidad, y así queda escrito.
- aviso descendente: la spec y el plan anteriores (`landing-presupuestos-nexus`) citan el 18 y el 19
  en su redacción original. Siguen siendo válidos como historia; `analyze` los leerá con la v1.1.0.

---

## S-0018 — Decisiones de diseño técnico del sitio (fase `plan`)

- fecha: 2026-09-02
- fase: `plan` (`sitio-nexus-consulting`, autopilot)
- decisiones tomadas y su porqué (detalle en el plan §0–§2):
  1. **Server Components por defecto; el estimador es el único island con estado.** El principio 32
     exige todo el texto en el HTML inicial; un Server Component lo garantiza, un island lo rompe.
  2. **El copy es contenido tipado en TypeScript** (`src/content/*`), no MDX ni CMS: tiene que
     poder importarse en pruebas (palabras prohibidas, «orientativo» junto a cada cifra) y alimentar
     el JSON-LD con los mismos objetos que pinta la página (CA-18 por construcción).
  3. **Botón primario sólido azul (#145CFF, 4,93:1) en vez del degradado azul→cian del kit.** Medido
     sobre los tokens: blanco sobre cian da 1,66:1 y falla AA (34). El degradado se reserva para
     texto display ≥ 30 px (3,61:1 ≥ 3:1), líneas, barra de progreso y anillo de foco. Es la única
     desviación consciente del kit del DS, y se documenta en `stack/design.md`.
  4. **El estimador vive en una sola URL** (`/presupuesto`); la home ofrece la primera pregunta
     como enlaces `/presupuesto?reto=…` (C-03). Sin duplicar la máquina de estados; el enlace es
     indexable sin JS.
  5. **Los rangos de `/servicios` se leen del catálogo** a través de `core/format.ts` (extracción
     pura de `formatRange`) y de un selector `server-only` que expone solo campos públicos (C-08, 8).
  6. **Consentimiento en cliente y servidor**: `Contact.consent` + regla en `validateContact` (C-02).
     Único cambio funcional del formulario.
  7. **La puerta de integración es `scripts/seo-gate.mjs` contra `next build` + `next start`**, no
     Playwright: comprueba lo que un rastreador ve, que es lo que los CA-06…CA-20 piden, sin añadir
     una dependencia pesada para un ciclo.
  8. **Navegación móvil con `<details>/<summary>`**: cero JavaScript, accesible por defecto.
  9. **`lucide-react` como única dependencia nueva** (iconos del DS); fuentes por `next/font/google`.
- options descartadas: MDX para el artículo (dependencias por una página); Playwright (peso);
  degradado con texto navy (3,61:1, falla para texto normal); estimador incrustado entero en `/`
  (dos máquinas de estado, dos URLs para lo mismo).

---

## S-0019 — Decisiones de implementación (fase `implement`, autopilot con plazo)

- fecha: 2026-09-02
- `server-only` (0.0.1) añadido como dependencia: es el guardia que impide importar `catalog.ts` en un
  Client Component (constitución 8). El plan solo preveía `lucide-react`; sin él el principio 8 dependía
  de disciplina.
- `Button` renderiza `<a>` (next/link) cuando recibe `href` en vez de `asChild`: menos API, misma
  apariencia, semántica correcta para enlaces.
- El H2 «Pregunta N de M» del estimador pasa a ser el texto visible de la barra de progreso (antes
  duplicaba el label): una sola fuente para la lectura de pantalla y la visual.
- Aviso de privacidad: **borrador para revisión legal**. Plazo de conservación propuesto **12 meses**;
  responsable identificado como la marca, sin datos registrales. Bloquea `ship` hasta la firma humana.
- Dominio canónico por defecto `https://nexus.ad` (`NEXT_PUBLIC_SITE_URL`): se sustituye por
  configuración en el despliegue, sin tocar código.
- Sin revisión por tarea con subagente: el plazo de presentación (una hora) obligó a agrupar por bloques;
  la revisión adversarial se concentra en `review` sobre el diff completo.

---

## S-0020 — El usuario retira el artículo «SEO frente a GEO» del sitio público

- fecha: 2026-09-02
- fase: `implement` (petición directa de Carlos del Corral durante la ejecución)
- context: `S-0015` había elegido publicar una página explicativa SEO/GEO. Al verla en el sitio, el usuario
  decide: *«elimina la parte de SEO frente a GEO, no es algo que hagamos; quiero que ejecutes la skill
  seo-geo del arnés en el proyecto»*. La skill sí está aplicada en todo el sitio (metadatos por página,
  JSON-LD coherente, `robots` con rastreadores de IA, `sitemap`, `llms.txt`, contenido en el HTML,
  redacción extraíble); lo que sale es la página que lo explicaba.
- decision: el sitio pasa a **cinco páginas públicas** (`/`, `/presupuesto`, `/servicios`,
  `/como-trabajamos`, `/privacidad`). Se elimina `app/recursos/`, `content/articulo-seo-geo.ts`, el
  builder `article()` y sus pruebas; sitemap y `llms.txt` listan cinco. El artículo de la wiki
  [SEO frente a GEO](../seo-geo/SEO%20frente%20a%20GEO.md) se conserva como conocimiento interno.
- supersedes: la parte (b) de `S-0015`. La spec queda enmendada: CA-06/CA-17/CA-20 hablan de cinco páginas;
  CA-11 queda sin objeto; la superficie S4 del acta de tono se marca como retirada (los IDs no se renumeran).
- también a petición del usuario («a veces veo mucho texto junto y eso aburre»): párrafos del inicio y de
  las cabeceras acortados, y las preguntas frecuentes pasan a acordeón (`<details>`), con el texto
  completo en el HTML para los rastreadores.

---

## S-0021 — `/antes`: página-museo con el estimador original, para enseñar el antes y el después

- fecha: 2026-09-02
- fase: fuera del chain — **excepción deliberada al gate SDD**, declarada en voz alta
- context: con el sitio ya verificado, el usuario pide *«una URL aparte de lo que era antes el
  estimador, o sea lo que Eric nos entregó… OJO no borres ni toques nada de lo que ya hay»*. El motivo
  es didáctico: enseñar en clase el antes y el después en la misma sesión.
- por qué no pasa por `specify`: es **aditivo y aislado** — una ruta nueva, código **recuperado de
  `main`** (no escrito), `noindex`, fuera del sitemap, sin tocar ninguna página ni componente vivo. El
  gate reserva el atajo para lo de bajo riesgo, y esto lo es: si se borra la carpeta, el sitio queda
  exactamente como estaba. Se registra aquí en vez de en una spec porque no hay producto que
  especificar.
- decision: `03-APP/src/app/antes/` con el snapshot en `_legacy/` (el guion bajo lo mantiene fuera del
  enrutador). Restaurados verbatim de `main` con `git show`: `Landing.tsx`, `FormWizard.tsx`,
  `ResultScreen.tsx`, la máquina de estados de `page.tsx` (renombrada `LegacyApp.tsx`) y `globals.css`.
- tres adaptaciones, y sólo tres:
  1. **CSS acotado bajo `.legacy`** (`legacy.css`): los nombres de clase del original —`.hero`, `.cta`,
     `.choice`, `.wizard`, `.result`, `.progress`, `.disclaimer`— colisionan con los del sitio nuevo.
     Ningún valor cambiado; el acotado es mecánico. Añade una regla `body:has(.legacy)` que oculta el
     header y el footer actuales mientras el museo está en pantalla, para que se enseñe solo.
  2. **Tipos congelados** en `_legacy/types.ts`: `Contact` ya no es lo que era (ganó `consent`). Si el
     museo importara los tipos vivos, dejaría de compilar cada vez que el dominio evoluciona — o se
     «arreglaría» solo y dejaría de ser el antes.
  3. **Envío simulado** (`_legacy/simulate.ts`): el estimador original no pedía consentimiento y el
     servidor actual lo exige (CA-12). Enchufar el museo a la acción real crearía una vía que se salta
     ese requisito. Valida el contacto como hacía el original y devuelve el caso de referencia del
     catálogo (28.000 – 35.000 €) con los textos del 2026-08-26. Un aviso en la propia página lo dice.
- consecuencia en las pruebas: `src/design/brand.test.ts` excluye `app/antes/_legacy` con el motivo
  escrito en el propio fichero — contiene la marca anterior y sus hex por definición. Es el único
  fichero existente que se ha tocado. `verify.sh` sigue **VERDE**: 202 pruebas, cobertura 99 %,
  `seo-gate` verde (el museo no entra en las cinco páginas ni en el sitemap).
- reversible en un comando: `rm -rf 03-APP/src/app/antes` y quitar la exclusión de `brand.test.ts`.

---

## S-0022 — Fallo de convivencia entre el museo y el sitio vivo: texto claro sobre papel crema

- fecha: 2026-09-02
- fase: corrección (restituye el comportamiento previsto; no pasa por el chain)
- síntoma reportado por el usuario: en `/antes`, el titular y los enunciados del formulario salían en
  blanco sobre el fondo crema, ilegibles.
- causa: el original **no declaraba color en los encabezados**, lo heredaba de `body`. El sitio nuevo sí
  lo declara (`h1, h2, h3, h4 { color: var(--text-strong) }`, blanco frío) y una regla directa gana
  siempre a la herencia, por muy específico que sea el ancestro. Lo mismo con `legend`, `.choice` y los
  enlaces (cian sobre crema). Además, media docena de nombres de clase compartidos (`.hero`, `.cta`,
  `.wizard`, `.result`, `.progress`, `.field`, `.nav`) empataban en especificidad, así que el ganador
  dependía del orden de carga — una bomba de relojería, no solo un color.
- arreglo, en dos movimientos mecánicos sobre `legacy.css`:
  1. el acotado pasa de `.legacy` a **`.legacy.legacy`**: la clase repetida sube la especificidad sin
     cambiar nada visual, y el snapshot gana siempre a las reglas homónimas del sitio nuevo;
  2. un bloque final **restituye el color heredado** (`h1`–`h4`, `legend`, `.choice`, campos, `.range`
     → `--ink`; enlaces → `--accent`) dentro de `:where()`, que aporta especificidad 0 y por tanto no
     pisa las reglas propias del snapshot (`.lede`, `.eyebrow`, `.disclaimer` siguen en `--ink-soft`).
  De paso se corrigió un selector que el acotado automático había malformado
  (`:where(a, button, input, [tabindex]):focus-visible`).
- guardián: `03-APP/src/app/antes/legacy.test.ts` — 4 pruebas que exigen que toda regla esté acotada,
  que el color heredado esté restituido, que el papel y la tinta originales sigan ahí y que no queden
  selectores malformados. Suite: **206 pruebas**, `verify.sh` verde.
- lección: al revivir una hoja de estilos global junto a otra, el riesgo no es el valor que copias,
  es **lo que el original no declaraba**. La herencia no viaja con el snapshot.

---

## S-0023 — La pregunta de frenos entra como dato informativo, no como señal de cualificación

- fecha: 2026-09-14
- fase: `specify` (spec [pregunta-frenos-lead](./specs/pregunta-frenos-lead.md), en borrador)
- context: el usuario pide añadir al formulario una octava pregunta de negocio, de respuesta múltiple
  —«¿Qué os está frenando ahora mismo?»— con seis opciones. Sería el primer campo multi-valor del
  recorrido: las siete preguntas actuales son todas de respuesta única.
- objeción levantada en `specify`: dos de las seis opciones repetían preguntas que el formulario ya
  hace y que **sí puntúan** —«El presupuesto no está aprobado» contra la pregunta 7, y «Resistencia
  interna al cambio» contra la 6—, de modo que un mismo lead podía afirmar y negar el mismo hecho en
  dos pantallas, con una de las dos alimentando la puntuación que decide la cualificación.
- options considered:
  1. **Informativa, sin puntuar** (elegida): viaja al aviso interno y a ningún sitio más.
  2. Que puntúe — descartada: hoy cinco señales suman 10 puntos y el umbral es 6; meter una sexta
     obliga a recalibrar la escala entera y cambia retroactivamente quién se cualifica.
  3. No construirla — enumerada y descartada: el freno sale igual en la llamada de alcance, pero
     treinta minutos tarde y con la conversación ya encarrilada.
- decision: se añade **informativa**, **saltable**, como **última pregunta antes de los datos de
  contacto**, y con **cuatro opciones**: el usuario retiró las dos que solapaban.
- why: el valor está en preparar la primera llamada, no en afinar la cualificación. Separar las dos
  cosas mantiene intacto el significado del umbral, que es la pieza que más caro sale mover.
- qué NO decide esto: la redacción final del texto, que entra en el acta de tono todavía sin firmar.
- evaluado y descartado de paso: **acortar el formulario** quitando alguna pregunta existente. Las dos
  únicas que no afectan al precio —sponsor y presupuesto— suman 6 puntos, exactamente el umbral, así
  que sin ellas nadie podría cualificarse nunca; y la única otra candidata, madurez, aparece en el
  caso de regresión permanente del principio 16.
- diferido: la segunda pregunta propuesta, «¿Qué sistemas usáis?». Es la que de verdad cambiaría el
  dimensionado de un proyecto, pero es técnica y un perfil de dirección la sufre: fuera de este ciclo.
- supersedes: none

---

## S-0024 — El criterio «no puntúa» se sostiene con el sistema de tipos, no con disciplina

- fecha: 2026-09-14
- fase: `implement` de [pregunta-frenos-lead](./specs/pregunta-frenos-lead.md), en autopiloto
- context: la spec exige que los frenos declarados no influyan en la puntuación de cualificación
  (CA-4). El sitio natural para el campo era `BusinessAnswers`, junto a las otras siete respuestas de
  negocio — y `BusinessAnswers` es justo el tipo que recibe `scoreLead()`.
- options considered:
  1. **Poner `blockers` en `Answers` y no en `BusinessAnswers`** (elegida): el motor de puntuación no
     puede leer el campo porque no está en su tipo de entrada.
  2. Ponerlo en `BusinessAnswers` y confiar en que `scoreLead` no lo mire — descartada: el criterio
     quedaría a merced de quien edite el motor dentro de seis meses, y una prueba que compara dos
     puntuaciones sólo detecta la regresión después de cometerla.
- decision: `blockers` vive en `Answers` (el objeto que se envía) y en `LeadRecord` (lo que va al aviso
  interno y al registro). `BusinessAnswers` queda intacto.
- why: un criterio de aceptación que el compilador puede sostener no necesita vigilancia. Es más barato
  que una prueba y no se puede saltar por descuido.
- consecuencia asumida: `LeadRecord` gana un campo propio en lugar de heredarlo de `answers`, así que
  quien construya un `LeadRecord` a mano debe rellenarlo. El compilador lo exige.
- decisión menor del mismo bloque: la pantalla múltiple **no auto-avanza**. Las otras siete avanzan al
  pulsar, que es lo que hace un formulario corto agradable; con respuesta múltiple eso haría imposible
  marcar dos. Estrena botón «Continuar», que además es el que permite saltarla sin marcar nada.
- hallazgo lateral, NO corregido: `src/content/site.ts` usa `process.env.NEXT_PUBLIC_SITE_URL ?? …`.
  Una variable **vacía** no es `undefined`, así que no activa el valor por defecto y rompe la
  compilación con `ERR_INVALID_URL`. Está fuera del alcance de esta spec y en producción la variable
  está definida; queda anotado.
- supersedes: none

## S-0025 — El registro de leads pasa a una base de datos, y el fallo de guardado deja de ser mudo

- fecha: 2026-09-14
- fase: `specify` de [leads-en-supabase](./specs/leads-en-supabase.md)
- context: comprobado el 2026-09-14 que el entorno de producción tiene cuatro variables
  (`NEXT_PUBLIC_SITE_URL`, `NEXUS_INTERNAL_MAILBOX`, `RESEND_FROM`, `RESEND_API_KEY`) y **ninguna
  credencial de Google**. Es decir: `selectRegistry` devuelve el puerto «mal configurado» y el
  registro de respaldo nunca ha escrito una fila real. Cada lead vive en un solo correo, y el fallo
  no produce ningún síntoma visible.
- options considered:
  1. **Sustituir la hoja de cálculo por Supabase** (elegida por Jose): registro consultable, apto para
     preguntas agregadas y para ejecutar de verdad la supresión a los doce meses que el aviso de
     privacidad ya promete en público.
  2. Rellenar las dos credenciales de Google y quedarse en la hoja — la alternativa barata, planteada
     explícitamente como objeción antes de escribir la spec: minutos y cero código. Descartada por
     Jose, no por inviable. Queda escrita en la spec como parche válido si el ciclo se retrasa.
  3. Escribir en los dos sitios a la vez — descartada: dos proveedores que mantener y dos registros
     que pueden desincronizarse.
- decision: el lead se guarda en Supabase; la hoja de cálculo deja de usarse. Si el guardado falla o
  el registro no está configurado, **el visitante no se entera** (ve su rango con normalidad) y el
  **correo interno lleva un aviso explícito de que ese lead no ha quedado guardado**.
- why: el silencio es el defecto real, no el proveedor. Cambiar de hoja a base de datos sin tocar el
  silencio habría dejado el mismo agujero con mejor decorado.
- alcance retirado en la propia conversación: Jose pidió primero «guardar + panel propio en la web» y
  a los pocos minutos lo retiró («No hagas ningún panel de momento»). El panel queda como spec futura,
  con su autenticación y sus permisos, y **no** como parte de este ciclo.
- consecuencia asumida: el adaptador de Google Sheets queda sin uso. Si se borra o se deja dormido es
  una pregunta abierta de la spec, no algo que este ciclo decida por su cuenta.
- lo que NO cambia: el formulario, el motor de rango, la puntuación de cualificación, los correos al
  visitante y el aviso de privacidad (su texto no nombra proveedores, así que sigue siendo cierto).
- supersedes: none

## S-0026 — La hoja de cálculo se deja dormida, y la base de datos se cierra con dos cerraduras

- fecha: 2026-09-14
- fase: `plan` de [leads-en-supabase](./specs/leads-en-supabase.md)
- context: la spec dejó abierta una pregunta —¿el adaptador de Google Sheets se borra o se deja
  dormido?— y Jose añadió durante la implementación un requisito explícito y repetido: «que no quede
  expuesta la BBDD a fuera, quiero que sea completamente seguro».
- decision 1 — **el adaptador de hoja de cálculo se deja dormido, no se borra.** Queda por debajo de
  Supabase en la precedencia de `selectRegistryPort`, así que en cuanto Supabase está configurado no
  se usa. Borrarlo eliminaría código probado y en verde a cambio de nada, y es exactamente el parche
  barato que la spec deja escrito por si el ciclo se retrasa.
- decision 2 — **la seguridad del registro no se sostiene con disciplina, se sostiene con puertas
  que fallan solas.** Cuatro, deliberadamente de naturalezas distintas para que no fallen a la vez:
  1. `import 'server-only'` en `src/ports/registry.ts` — barrera de **compilación**: si un componente
     de cliente importara el registro, el build de producción falla en vez de empaquetar la clave.
  2. `src/ports/registry-security.test.ts` — invariantes sobre el **fuente**: ninguna credencial
     marcada `NEXT_PUBLIC_`, ningún componente de cliente importando el registro, ningún mensaje de
     error que incluya la clave.
  3. `scripts/secret-gate.mjs` — inspección del **paquete ya compilado**: busca los valores reales de
     las variables sensibles, los nombres prohibidos y la huella de un JWT con rol distinto de `anon`.
     Integrada en `verify.sh`. **Probada en los dos sentidos**: sale 1 con un secreto expuesto y 0 sin
     él (una puerta que nunca se ha visto fallar no está probada).
  4. `01-TOOLS/SUPABASE/schema.sql` — en la **base de datos**: `enable row level security` sin ninguna
     policy, más `revoke all` explícito a `anon`, `authenticated` y `public`. Redundante a propósito:
     si alguien añadiera mañana una policy sin pensarlo, el revoke sigue negando.
- decision 3 — **el guardado pasa a ser el primer paso del despacho**, antes de los correos. Es la
  única forma de que el aviso interno pueda declarar si el lead quedó guardado (`CA-S3`); con el
  orden anterior el correo se redactaba antes de saberlo.
- decision 4 — **sin dependencias nuevas.** Supabase se habla por su API REST con `fetch`, igual que
  ya se hablaba con Google Sheets. Añadir `@supabase/supabase-js` metería un árbol de dependencias
  para hacer un `POST`.
- consecuencia asumida: `LeadRecord` gana `submissionId`, y `buildInternalNotice` gana un segundo
  argumento **obligatorio**. Obligatorio y no opcional a propósito: un valor por defecto `'ok'`
  haría que un argumento olvidado afirmara en silencio que el lead está guardado (misma lógica que
  `S-0024`: el criterio lo sostiene el sistema de tipos, no la disciplina).
- supersedes: none

## S-0027 — El límite de frecuencia del formulario no entra en este ciclo, y se deja escrito como riesgo abierto

- fecha: 2026-09-14
- fase: `review` de [leads-en-supabase](./specs/leads-en-supabase.md)
- context: la revisión adversarial de seguridad señaló que, al pasar el registro a una base de datos
  real, la acción de servidor —que es un endpoint HTTP público, y el formulario no es su única vía de
  entrada— pasa a escribir filas de verdad, con coste, sin ningún límite de frecuencia ni de tamaño.
  Antes del cambio ese mismo abuso sólo engordaba un correo, porque el registro nunca escribía.
- decision 1 — **los topes de tamaño SÍ entran**: nombre 120, correo 254 (el máximo de la norma),
  organización 160, identificador de envío 100. Son validación de servidor en una función que ya
  existía, reducen el daño por petición y no cambian nada para un lead real.
- decision 2 — **el límite de frecuencia NO entra en este ciclo.** Es una función nueva: hay que
  elegir entre límite por IP, prueba anti-bot o cuota en el borde, cada una con su almacenamiento y
  con sus falsos positivos sobre leads legítimos, que es justo lo que este producto no se puede
  permitir. Merece su propia spec, no un añadido al final de otro ciclo.
- why: la alternativa era decidir a solas, en la última hora de un ciclo ajeno, algo que puede
  rechazar leads buenos. El riesgo escrito es mejor que la mitigación improvisada.
- riesgo aceptado y abierto: un atacante puede inundar la tabla de leads. Coste, no fuga: la revisión
  descartó explícitamente cualquier vía de exposición de la credencial o de los datos.
- decision 3 — **la puerta de secretos declara lo que no ha podido comprobar.** Se descubrió que la
  búsqueda por valor se saltaba en silencio en local, porque `next build` carga `.env.local` dentro
  de su propio proceso y no lo exporta al shell. Ahora la puerta carga el entorno ella misma y
  enumera qué variables buscó y cuáles no. Una puerta que calla lo que no ha mirado miente por
  omisión, y es peor que no tener puerta porque da confianza falsa.
- supersedes: none
