---
type: spec
title: Spec — Sitio web de Nexus Consulting (marca, páginas, copy y SEO/GEO)
description: WHAT y WHY para convertir el estimador de una sola página en el sitio pequeño de Nexus Consulting — identidad del design system, copy con la voz de la marca, páginas con URL propia y una capa SEO/GEO que haga el contenido indexable y citable — sin tocar el motor de cálculo.
tags: [sdd, spec, marca, seo, geo, diseño, copy]
timestamp: 2026-09-02T14:40:00Z
topic: sdd
slug: sitio-nexus-consulting
status: approved in autopilot · clarified 2026-09-02
---

# Spec — Sitio web de Nexus Consulting

> Slug: `sitio-nexus-consulting` · Status: **approved in autopilot** (2026-09-02, Carlos del Corral:
> «ok a todo … sigue tu propio criterio hasta el final») · Created: 2026-09-02
> Inherits: [constitution](../constitution.md) **v1.1.0** (enmienda `S-0017` ratificada y aplicada el
> 2026-09-02; principios 18–20 reescritos, 27 ampliado, 30–36 nuevos).
> Antecesor: [Spec — Landing y estimador de presupuesto](./landing-presupuestos-nexus.md), cuyo
> comportamiento funcional **se conserva íntegro**. Esta spec lo re-viste, lo rodea de páginas y lo
> hace visible; no lo cambia.

## Problem & why

El estimador que existe hoy funciona —156 pruebas verdes, motor de cálculo blindado por la
constitución— pero es **una sola página sin marca y prácticamente invisible**. Sirve unas 90 palabras
indexables (el titular y cuatro títulos de servicio); el formulario, los rangos, el método y la
llamada de alcance viven detrás de un clic, en la misma dirección, y ningún buscador ni motor
generativo los ve. No hay título con propuesta de valor, ni tarjeta al compartir el enlace, ni datos
estructurados, ni `robots.txt`, ni mapa del sitio. Visualmente es una propuesta libre en serif
sobre papel crema, tomada cuando *«no había marca que respetar»* ([S-0003](../decisions.md)).

Ahora sí hay marca. [D-0015](../../harness/decisions.md) fija **Nexus Consulting** como identidad
canónica —masterprompt, design system, logo, voz— y [S-0014](../decisions.md) decide que la
interfaz la adopta. Y el producto tiene dos audiencias que hoy no atiende: el directivo que llega
buscando «cuánto cuesta un diagnóstico de IA» y **no encuentra nada que leer antes de rellenar un
formulario**, y los motores (Google, ChatGPT, Perplexity, Claude, Copilot) que **no tienen nada que
citar**. El coste de no resolverlo es un producto correcto que nadie encuentra y que, cuando lo
encuentra, no parece de nadie.

## Goals

- Que un directivo que aterriza en cualquier página **entienda en segundos quién es Nexus Consulting,
  qué hace y qué le ofrece**, con la identidad visual y la voz de la marca, y pueda llegar a la
  estimación en un clic desde cualquier punto.
- Que **el conocimiento que hoy está escondido tras el formulario —servicios, rangos orientativos,
  método, llamada de alcance— exista como contenido legible con URL propia**, escrito para ser
  extraído y citado, sin promesas de resultado ni cifras inventadas.
- Que **cada página sea indexable y compartible**: título y descripción propios, tarjeta al
  compartir, dirección canónica, datos estructurados, y un mapa del sitio y un `robots.txt` que
  dejen pasar tanto a los buscadores como a los rastreadores de los motores generativos.
- Que **el estimador sea la mejor pieza del sitio**, no la única: mismo comportamiento que hoy
  (siete preguntas, tres salidas, dos correos), re-vestido con el design system, con movimiento
  con propósito y accesible AA sobre fondo oscuro.
- Que **nada del motor de cálculo cambie**: mismo catálogo, mismos rangos, mismo umbral, misma
  prueba de regresión. La marca, el copy y la visibilidad son una capa alrededor, no una reescritura.

## Non-goals / out of scope

- **Cambiar el catálogo, los rangos, los multiplicadores, la puntuación o el umbral.** El motor de
  `src/core/` no se toca (constitución 4–16). La divergencia entre las cinco áreas del masterprompt y
  los seis servicios del catálogo se resuelve en la **arquitectura de contenidos** (ver
  *Behaviour › Servicios*), no en el código de cálculo.
- **Una página individual por servicio.** Se difiere: `/servicios` es una sola página con un bloque
  por línea. Si el sitio crece, cada bloque tiene ya su ancla y su nombre.
- **Blog, casos de éxito con métricas, testimonios, logos de clientes.** No existe ni un proyecto,
  métrica o cliente real; inventarlos viola el principio 27 y el propio masterprompt. Los «+120
  proyectos · 99,98 % uptime · 486 h ahorradas» del kit de referencia **se descartan**.
- **Analítica, medición de tráfico, píxeles, cookies de seguimiento.** No se instala ninguna
  herramienta de medición. Consecuencia útil: al no haber cookies no esenciales, **no hace falta
  banner de cookies**.
- **Segundo idioma** (catalán, inglés). Solo español, como el antecesor.
- **Despliegue, dominio real, DNS, correo desde dominio propio.** Es la clase de dentro de dos
  semanas. Este ciclo deja el sitio listo para desplegarse, no desplegado.
- **Protección anti-spam, durabilidad del lead, CRM, panel interno.** Heredado del antecesor
  (C-01, C-04): sin cambios.
- **Fotografía o vídeo.** El masterprompt desaconseja el stock; el universo visual es geométrico
  (nodos, flujos, módulos). No se añade ninguna imagen fotográfica.
- **Cambiar el comportamiento del formulario** (número de preguntas, opciones, salidas, correos), con
  **una única excepción funcional**: la pantalla de contacto incorpora la casilla de consentimiento
  enlazada a `/privacidad`, sin la cual no se puede enviar — y el servidor la exige también, porque
  el envío es un punto de entrada público. Hoy esa casilla **no existe**; es el único cambio de
  validación de este ciclo. Todo lo demás solo cambia cómo se ve y cómo se llega a él.
- **Presupuesto de rendimiento.** La constitución (26) decide explícitamente no tenerlo; esta spec
  no lo introduce. Que el contenido viaje en el HTML inicial es un criterio de indexabilidad, no de
  velocidad.

## Users & context

- **El directivo que busca.** CEO, fundador, COO, responsable de operaciones o de tecnología de una
  empresa B2B en crecimiento (masterprompt §6). Llega desde Google o desde una respuesta de un motor
  generativo con una pregunta concreta —*cuánto cuesta, qué incluye, cómo trabajan, están en la UE*—
  y decide en segundos si esta gente «entiende mi problema y puede construir algo serio». Quiere
  leer antes de dar su correo. Es escéptico con el humo y no le insultan la inteligencia.
- **El lead que estima.** El mismo directivo, ya convencido de probar: siete preguntas, un rango, y
  la decisión de reservar o no una llamada de 30 minutos. Puede estar en el móvil. Puede navegar con
  teclado o lector de pantalla (constitución 24).
- **El equipo de Nexus.** Recibe el aviso interno con la puntuación y el registro del lead. No cambia
  lo que recibe; cambia quién firma.
- **Los motores.** Googlebot y Bingbot ordenan páginas; GPTBot, ChatGPT-User, PerplexityBot y
  ClaudeBot extraen pasajes para citarlos. No pulsan botones ni esperan a que cargue nada: **solo
  existe lo que viaja en el HTML**. Son un usuario de pleno derecho de esta spec.
- **La clase.** El sitio es además material didáctico de una sesión sobre SEO/GEO y diseño con
  arnés. No cambia el contrato, pero explica por qué cada decisión queda documentada y por qué el
  antes/después tiene que ser medible.

## Behaviour

### La marca, en todo el sitio

- Toda página lleva la identidad de **Nexus Consulting**: isotipo y wordmark del design system,
  paleta oficial (azul noche como base, azul Nexus para acción, cian eléctrico como acento
  **escaso**), Sora en titulares, Inter en cuerpo, IBM Plex Mono en cifras, radios y sombras del
  sistema. Un solo origen de estilo; ningún color escrito a mano fuera de él.
- El tema es **oscuro en todo el sitio**, incluido el estimador. El foco de teclado es visible sobre
  navy. Todos los pares texto/fondo cumplen AA.
- **Ningún texto público, correo ni metadato menciona «Nexus Strategy & Technology».** La marca
  anterior desaparece del sitio; la geografía es Andorra la Vella y el contacto el de la marca
  (`hola@nexus.ad`, teléfono del design system). El buzón interno de oportunidades pasa a ser
  configuración con un valor por defecto del dominio de la marca.
- El movimiento tiene propósito y refuerza «sistema conectado»: el motivo de nodos anima el hero,
  los bloques aparecen con precisión al entrar en pantalla, el progreso del estimador se completa,
  los botones responden al pulsar. **Nunca rebota, nunca parpadea, nunca distrae del texto.** Quien
  pide movimiento reducido en su sistema ve el sitio quieto y completo.
- **Las doce superficies con texto** que la lista de tono debe cubrir (principio 36) son: **S1**
  Inicio · **S2** Servicios · **S3** Cómo trabajamos, incluidas las preguntas frecuentes · **S4** el
  artículo · **S5** Privacidad · **S6** la página de no encontrado · **S7** los enunciados de las
  ocho pantallas del estimador, incluida la casilla de consentimiento · **S8** las etiquetas de las
  opciones · **S9** las tres pantallas de resultado · **S10** el correo al cliente · **S11** el aviso
  interno · **S12** los metadatos (títulos, descripciones, textos de tarjeta, textos alternativos y
  `llms.txt`). La lista de tono actual (S1–S7) se reescribe sobre esta numeración.
- La voz es la de [Marca Nexus Consulting](../../firma/Marca%20Nexus%20Consulting.md): tú/nosotros,
  verbos delante, sentence case, sin emoji, problema real → beneficio concreto → tecnología como
  medio. Y las prohibiciones del principio 27 siguen: sin promesas de resultado, sin urgencia
  fabricada, sin descuentos, sin plazos, sin «disruptivo», «360», «revoluciona».

### Las páginas

El sitio tiene **cinco páginas públicas** *(seis en la versión aprobada; la 5, el artículo, fue retirada por el usuario en `S-0020`)*, cada una con un solo H1, título y descripción propios,
dirección canónica y tarjeta para compartir.

1. **`/` — Inicio (la página maestra).** Cabecera fija con lockup, navegación y el CTA principal.
   Hero con la esencia («El punto donde todo conecta») y la frase descriptiva. La tesis de la marca:
   las empresas crecen y sus sistemas no. Las **cuatro líneas de servicio** con lo que resuelve cada
   una y enlace a su bloque en `/servicios`. **El método en cuatro fases.** Un bloque «**Antes de la
   llamada**» que presenta el estimador —qué es, qué da (un rango orientativo, nunca un precio) y
   qué no pide— **en el que se responde la primera pregunta del estimador** (el reto). Al elegir, el
   lead pasa a `/presupuesto` con esa respuesta ya conservada y sigue por la segunda. **El estimador
   vive en una sola dirección**; la página de inicio solo abre la puerta. Cierre con la llamada de
   30 minutos y el contacto. Pie con claim, navegación, contacto y enlace a privacidad.
2. **`/presupuesto` — El estimador.** Mismo recorrido que hoy: siete preguntas de una en una con
   progreso visible, la pantalla de contacto, y las tres salidas (rango, «aquí no te vamos a dar un
   número», llamada de alcance), con el calendario incrustado cuando procede. Tiene dirección propia
   para poder enlazarlo y compartirlo. Su primera pantalla explica en dos frases qué va a pasar. El
   resultado **no** tiene dirección propia (no hay dónde guardarlo: non-goal heredado).
3. **`/servicios` — Qué hacemos y cuánto suele costar.** Un bloque por línea del catálogo —IA y
   transformación digital (con sus cuatro servicios), Ciberseguridad y resiliencia, Sostenibilidad y
   ESG, Estrategia y operaciones— y en cada uno: para quién es, qué incluye, **el rango orientativo
   oficial 2026 con su advertencia pegada**, cuándo aplica, y el enlace para estimarlo. La línea sin
   rango lo dice y explica por qué. **El nombre de cada servicio es el mismo que aparece en la
   estimación y en el correo.** Las cinco áreas del masterprompt (software a medida, IA aplicada,
   automatización, integración, consultoría tecnológica) aparecen como **capacidades** con las que
   Nexus construye cada servicio, no como servicios paralelos.
4. **`/como-trabajamos` — El método y las preguntas.** Las cuatro fases del método de la marca
   (diagnóstico → diseño de solución → desarrollo e integración → mejora continua), qué es la llamada
   de alcance (30 minutos, sin coste, sin informe ni cifra), y un bloque de **preguntas frecuentes**
   redactadas para ser citadas: por qué un rango y no un precio, qué pasa si mi reto no está en el
   catálogo, quién ve mis respuestas, trabajáis con pymes, estáis en la UE, cómo aplicáis IA con
   control. Cada respuesta se sostiene sola, sin leer la anterior.
5. **`/recursos/seo-frente-a-geo` — Un artículo.** La diferencia entre posicionar y ser citado,
   destilada del artículo de la wiki y del estudio de Princeton (arXiv:2311.09735), con sus cifras
   presentadas **como hallazgos del estudio con su fuente**, nunca como promesa de Nexus. Es la
   página que se optimiza a sí misma con lo que explica ([S-0015](../decisions.md)). Lleva fecha de
   publicación y de última actualización visibles.
6. **`/privacidad` — Aviso de privacidad.** Qué datos recoge el estimador, para qué, con qué base,
   quién los recibe (los proveedores de correo y registro, con transferencia fuera de la UE declarada
   —constitución 22–23), cuánto se conservan y cómo ejercer derechos. Redactado como borrador para
   revisión legal y marcado como tal en la wiki, no en la página. El formulario enlaza a él y pide
   el consentimiento antes de enviar.

Además, y sin ser páginas: **`/robots.txt`** permite explícitamente a Googlebot, Bingbot, GPTBot,
ChatGPT-User, PerplexityBot, ClaudeBot y anthropic-ai, y apunta al mapa; **`/sitemap.xml`** lista las
seis páginas con su fecha; **`/llms.txt`** resume el sitio para los rastreadores generativos. El
sustituto de calendario de demostración deja de existir como página pública.

### Lo que viaja en el HTML

- **Todo el texto de cada página viaja en la respuesta inicial**, sin depender de que se ejecute
  nada en el navegador: titulares, párrafos, rangos, preguntas frecuentes, pie. En `/presupuesto`
  viajan la explicación y la primera pregunta con sus opciones.
- Cada página declara su idioma, un único H1, jerarquía H1 > H2 > H3 sin saltos, texto alternativo
  en toda imagen, y **datos estructurados** coherentes con lo visible: la organización (nombre,
  logo, dirección, contacto) y el sitio en todas; un dato por servicio en `/servicios`; las
  preguntas frecuentes en `/como-trabajamos`; el artículo con fechas en `/recursos/…`; migas en las
  interiores de **dos niveles exactos** (Inicio › página). El artículo no tiene un nivel «Recursos»
  intermedio: `/recursos` no es una página y responde como cualquier dirección inexistente.
- Ningún metadato promete lo que la página no dice; ningún dato estructurado describe algo que no
  esté visible.

### El estimador, re-vestido

- Una pregunta por pantalla, opciones como tarjetas grandes pulsables, progreso visible que se
  completa, botón de volver que conserva lo respondido. Todo navegable con teclado en orden lógico;
  el foco es visible sobre el fondo oscuro; los errores de validación se anuncian a un lector de
  pantalla junto al campo.
- La pantalla de resultado muestra el rango en cifra grande de tipo mono con la advertencia de
  orientativo, el texto de la salida correspondiente y, si procede, el calendario; si el calendario
  no puede incrustarse, el enlace en pestaña nueva sigue ahí.
- Los dos correos conservan estructura y contenido; cambian firma, nombre y dominio de la marca.
  Se leen como texto, no como plantilla.
- El lead sigue sin ver su puntuación, el umbral, ni señal alguna de clasificación.

### Casos límite y errores

- Movimiento reducido activado → ningún elemento se anima; el contenido es idéntico.
- Pantalla estrecha (móvil) → ninguna página desplaza en horizontal; el lockup se reduce al isotipo
  y la navegación se pliega; el estimador ocupa el ancho completo.
- Página inexistente → una página de «no encontrado» con la marca, enlace al inicio y al estimador.
- Envío fallido del estimador → mismo comportamiento que hoy (mensaje de error sin revelar detalle
  técnico; el fallo queda en el registro del servidor).
- Dirección canónica del sitio no configurada → las páginas siguen sirviéndose; las direcciones
  absolutas de metadatos y mapa usan un valor por defecto del dominio de la marca, y ese hecho queda
  anotado para el despliegue.

## Acceptance criteria

**Marca e identidad**

- CA-01 · Given cualquier página pública, When se inspecciona su HTML y su CSS, Then no aparece la
  cadena «Strategy & Technology» ni ningún color hexadecimal fuera de los tokens del design system.
- CA-02 · Given la paleta aplicada, When se miden los pares texto/fondo de todo el recorrido del
  estimador (ocho pantallas) y del cuerpo de las seis páginas, Then todos cumplen WCAG 2.2 AA
  (4,5:1 texto normal, 3:1 texto grande y foco).
- CA-03 · Given un usuario con «reducir movimiento» activado, When carga cualquier página, Then no
  hay animación en curso y el contenido es el mismo que sin la preferencia.
- CA-04 · Given cualquier texto visible o de correo, When se pasa la lista de tono ampliada
  (superficies S1–S12), Then ninguna comprobación falla y **existe acta firmada por una persona**
  (principio 28). Sin acta, el criterio no está verificado.
- CA-05 · Given cualquier página, When se busca emoji, imágenes fotográficas de stock, o las
  palabras prohibidas del masterprompt («disruptivo», «revolucion», «360», «siguiente nivel», «sin
  límites», «mágic»), Then no aparece ninguna.

**Páginas y navegación**

- CA-06 · Given el sitio servido, When se piden `/`, `/presupuesto`, `/servicios`,
  `/como-trabajamos`, `/recursos/seo-frente-a-geo` y `/privacidad`, Then las seis responden 200 y
  cada una tiene exactamente un H1, distinto del de las demás.
- CA-07 · Given la página de inicio, When se lee sin ejecutar nada en el navegador, Then contiene la
  esencia, la frase descriptiva, las cuatro líneas de servicio, las cuatro fases del método, el
  bloque «Antes de la llamada» y el contacto, y suma **al menos 600 palabras** de texto visible.
- CA-08 · Given la página de inicio, When el usuario elige una opción de la primera pregunta en el
  bloque «Antes de la llamada», Then llega a `/presupuesto` viendo la **segunda** pregunta con la
  primera ya respondida (y puede volver atrás y cambiarla); y Given `/presupuesto` abierto
  directamente, When se carga, Then muestra la explicación y la primera pregunta. El recorrido
  completo existe en una sola dirección.
- CA-09 · Given `/servicios`, When se lee, Then cada uno de los seis servicios con rango muestra
  exactamente su rango oficial 2026 (el mismo que devuelve el motor) con la advertencia de
  orientativo en el mismo bloque, la línea sin rango explica por qué no lo tiene, y cada servicio se
  nombra igual que en la pantalla de resultado y en el correo.
- CA-10 · Given `/como-trabajamos`, When se lee, Then hay al menos **seis preguntas frecuentes**
  cuya respuesta no depende de la anterior, y la llamada de alcance se describe como 30 minutos,
  sin coste y sin entrega de informe ni cifra.
- CA-11 · Given `/recursos/seo-frente-a-geo`, When se lee, Then cada porcentaje va acompañado de su
  fuente (estudio, año, identificador) en la misma frase o párrafo, y muestra fecha de publicación y
  de última actualización.
- CA-12 · Given `/privacidad`, When se lee, Then declara qué datos se recogen, la finalidad, la base
  legal, los destinatarios, la transferencia fuera de la UE, el plazo de conservación y cómo ejercer
  derechos; y Given el estimador, When el lead llega a la pantalla de contacto, Then no puede enviar
  sin marcar el consentimiento, que enlaza a `/privacidad`.
- CA-13 · Given una dirección inexistente, When se pide, Then responde 404 con una página de marca
  que enlaza al inicio y al estimador.
- CA-14 · Given un ancho de pantalla de 360 px, When se recorre cada página y el estimador completo,
  Then no hay desplazamiento horizontal y todo botón es alcanzable.

**Indexabilidad (SEO técnico)**

- CA-15 · Given cada página pública, When se inspecciona su `<head>`, Then tiene título único (≤ 60
  caracteres), descripción única (≤ 160), canónica absoluta, `lang="es"`, y etiquetas Open Graph y
  Twitter con título, descripción e imagen de marca que responde 200.
- CA-16 · Given `/robots.txt`, When se lee, Then permite explícitamente a Googlebot, Bingbot,
  GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot y anthropic-ai, no bloquea ninguna de las seis
  páginas, y referencia `/sitemap.xml`.
- CA-17 · Given `/sitemap.xml`, When se lee, Then es XML válido que lista exactamente las seis
  páginas públicas con fecha de modificación, y ninguna dirección de demostración o interna.
- CA-18 · Given cada página, When se validan sus datos estructurados, Then son JSON-LD válido con
  `Organization` y `WebSite` en todas, un `Service` por servicio en `/servicios`, `FAQPage` con las
  mismas preguntas visibles en `/como-trabajamos`, `Article` con fechas en `/recursos/…`, y
  `BreadcrumbList` de dos niveles (Inicio › página) en las interiores; ningún dato estructurado nombra
  algo ausente de la página ni una dirección que no responda 200.
- CA-19 · Given cualquier página, When se recorre su jerarquía de encabezados, Then no hay saltos de
  nivel (H1 → H3 sin H2) y toda imagen tiene texto alternativo.
- CA-20 · Given `/llms.txt`, When se lee, Then describe el sitio en texto plano con enlaces a las
  seis páginas.

**Sin regresión**

- CA-21 · Given el proyecto tras los cambios, When se ejecuta la puerta de verificación (lint, tipos,
  pruebas, cobertura), Then pasa limpia: **las pruebas de los motores** (catálogo, precios,
  puntuación, resolución de servicio, combinatoria exhaustiva, particiones) **pasan sin modificar
  una línea**; la prueba de validación **solo gana** el caso del consentimiento; en el resto de
  pruebas los únicos cambios admitidos son **aditivos en las fixtures** (`consent: true`) y en las
  aserciones de marca y copy, nunca en las de comportamiento; y **el número total de pruebas no baja
  de 156**;
  la cobertura de `src/core/**` sigue ≥ 95 %, y el caso de referencia sigue dando **28.000 – 35.000 €**.
- CA-22 · Given la pestaña de red del navegador durante un recorrido completo del estimador, When se
  inspecciona lo recibido, Then no aparece ningún multiplicador, tabla de puntos ni umbral.
- CA-23 · Given el sitio, When se busca la página `/agenda-demo`, Then no existe como ruta pública.
- CA-24 · Given los dos correos generados para un lead de prueba, When se leen, Then firman como
  Nexus Consulting con contacto del dominio de la marca, conservan las mismas secciones de
  contenido que hoy, y no contienen rótulos de plantilla.

## Points to clarify

- **suposición tomada** — La arquitectura de servicios del sitio sigue **el catálogo 2026** (cuatro
  líneas, seis servicios con rango, una sin rango), y las cinco áreas del masterprompt son
  **capacidades** transversales. *Base:* el usuario pide «mantener la funcionalidad que ha hecho
  Eric»; los principios 4–16 protegen el catálogo; el masterprompt no prohíbe ninguna línea, y ESG y
  ciberseguridad son plausibles como «resiliencia y cumplimiento» para B2B europeo. Cierra el hueco
  «El catálogo de precios pertenece a la marca derogada» de [gaps.md](../../gaps.md) **a efectos del
  producto** (opción b, hecha coherente). *Riesgo:* si el usuario quisiera la web solo con las cinco
  áreas del masterprompt, habría que reescribir el catálogo y el principio 16 — otra spec.
- **suposición tomada** — Los servicios conservan su **nombre oficial de catálogo** (en inglés:
  *AI Opportunity Assessment*, …) acompañado de un descriptor en español. *Base:* el nombre debe
  coincidir en `/servicios`, resultado y correo, y hoy el motor y las pruebas usan esos nombres.
  *Riesgo:* la voz es Spanish-first; si chirría, se traduce en el motor y en las pruebas a la vez.
- **suposición tomada** — La dirección canónica del sitio es **`https://nexus.ad`** como valor por
  defecto configurable. *Base:* dominio de la marca en el design system y el masterprompt. *Riesgo:*
  el despliegue real (clase de Eric) puede usar otro dominio; es un valor de configuración, no
  código.
- **suposición tomada** — El artículo `/recursos/seo-frente-a-geo` **entra** en el sitio público.
  *Base:* el usuario eligió «ambas cosas» en [S-0015](../decisions.md). *Riesgo:* una consultora que
  no vende SEO publicando sobre GEO; se enmarca como criterio técnico («IA aplicada»: cómo hacemos
  que una web sea citable), no como servicio.
- **suposición tomada** — Ninguna métrica de negocio inventada, en ninguna superficie. Los «hechos»
  publicables son estructurales: cuatro líneas, seis rangos publicados, llamada de 30 minutos sin
  coste, sede en Andorra la Vella. *Base:* principio 27 y masterprompt §23–27. *Riesgo:* la página
  de inicio pierde el bloque de cifras del kit; se sustituye por la tesis de marca.
- **suposición tomada** — El método se presenta en **las cuatro fases de la marca**, no en las cinco
  del *lifecycle* de la marca derogada. *Base:* D-0015 fija la fuente de verdad. *Riesgo:* ninguno
  funcional; solo copy.
- **suposición tomada** — `robots.txt` **permite todos** los rastreadores de IA. *Base:* el
  objetivo GEO no tiene sentido sin ello. *Riesgo:* el contenido puede usarse para entrenar modelos;
  para este sitio es deseable.
- **suposición tomada** — El aviso de privacidad se redacta con `gdpr-privacy` como **borrador para
  revisión legal**, y esa condición se anota en la wiki y en el acta de tono, no en la página.
  *Base:* constitución 23 bloquea publicar sin él; la clase de despliegue es en dos semanas.
  *Riesgo:* sin revisión legal humana no se puede publicar; el bloqueo se traslada a `ship`.
- **suposición tomada — RESUELTA (`S-0017`, 2026-09-02).** La enmienda v1.1.0 de la constitución
  está ratificada y aplicada, con: (a) principios 18–20 reescritos para el estado real (workspace en
  git, `implement` nunca en `main`, autoría humana de commits sin trailer de IA); (b) el design
  system como única fuente de estilo (31); (c) visibilidad — contenido en el HTML inicial (32),
  metadatos y datos estructurados coherentes, `robots` y `sitemap` (33); (d) marca canónica (30) y
  lista de tono ampliada (36); **(e) suelo AA extendido a todo texto y control del sitio (34)**, que
  tightening del 25 el revisor de la spec señaló como no declarado; (f) movimiento con propósito y
  reducible (35). El 26 (sin presupuesto de rendimiento) sigue intacto.
- **decisión diferida** — Páginas individuales por servicio (`/servicios/<slug>`), analítica y
  medición, casos de éxito, PDF descargable del método (útil para Perplexity), versión en catalán o
  inglés, dominio y despliegue. Fuera de este ciclo a propósito.
- **área no formulable** — Cómo se medirá la visibilidad GEO una vez publicado (no hay herramienta
  ni línea base); y qué pasa con el contenido de `/servicios` cuando el catálogo 2026 caduque el
  31-12-2026 — los rangos son configuración con fecha, y el copy tendrá que seguirlos.

## Clarifications

Pasada `clarify` del 2026-09-02, en autopilot. Las *suposiciones tomadas* se contrastaron contra sus
fuentes y se mantienen; los seis hallazgos de la revisión con ojos frescos (subagente con contexto
limpio, solo spec + constitución) se resolvieron así:

- **C-01 · Pruebas heredadas (mayor).** CA-21 distinguía mal entre motores y superficies. Resuelto:
  los motores no se tocan ni en código ni en pruebas; recorrido, salida y correo solo cambian
  aserciones de marca/copy; el total no baja de 156. **Afinado tras `analyze` (F1):** la validación
  no es un motor y admite el caso `consent` (C-02); el campo obligatorio obliga a añadir
  `consent: true` a las fixtures que construyen un `Contact` — cambio aditivo, no de comportamiento.
- **C-02 · Consentimiento vs. «no cambiar la validación» (mayor).** Hoy no existe casilla de
  consentimiento. Resuelto: es la única excepción funcional del formulario, declarada en *Non-goals*,
  exigida en cliente y en servidor.
- **C-03 · ¿Estimador incrustado en `/` o en `/presupuesto`?** Resuelto: una sola dirección. En `/`
  se responde la primera pregunta; la respuesta se conserva y el recorrido sigue en `/presupuesto`.
  Evita dos máquinas de estado y da al estimador una URL única para enlazar e indexar.
- **C-04 · Migas del artículo.** `/recursos` no es página. Resuelto: migas de dos niveles exactos
  (Inicio › página); `/recursos` responde como cualquier dirección inexistente.
- **C-05 · Superficies de tono sin enumerar.** Resuelto: S1–S12 enumeradas en *Behaviour › La marca*.
- **C-06 · Suelo AA en todo el sitio sin ratificar.** Resuelto: es el principio 34 de la v1.1.0, ya
  ratificada; la suposición de enmienda queda marcada como resuelta.
- **C-07 · Andorra y la UE (nota del revisor).** Andorra la Vella **no está en la UE**. La pregunta
  frecuente pasa a ser «¿Dónde estáis y dónde van mis datos?» y responde con la verdad: sede en
  Andorra, país con **decisión de adecuación** de la Comisión Europea en protección de datos
  (Decisión 2010/625/UE), y proveedores de correo y registro fuera de la UE declarados en
  `/privacidad` (constitución 22–23). El responsable del tratamiento se identifica como **Nexus
  Consulting** con su contacto de marca; **no se inventan datos registrales**: la revisión legal los
  completa.
- **C-08 · Una sola fuente de verdad para los rangos (nota).** CA-09 exige que `/servicios` muestre
  exactamente los rangos del motor. Resuelto como requisito de `plan`: el copy de servicios **lee**
  los rangos oficiales de donde los lee el motor, nunca los copia a mano; los factores, puntos y
  umbral siguen sin salir del servidor (8).
- **C-09 · Cookies del calendario (nota).** El calendario incrustado es de un tercero y solo aparece
  a leads cualificados tras el envío. `/privacidad` lo declara; la exención de banner de cookies se
  sostiene en que el sitio no deposita cookies no esenciales por sí mismo. Sin calendario
  configurado, el resultado muestra el texto de «te escribimos con la disponibilidad», como hoy.

## Revisions

| Fecha | Cambio |
|-------|--------|
| 2026-09-02 (3) | `S-0020`: el usuario retira el artículo `/recursos/seo-frente-a-geo`. El sitio queda en cinco páginas; CA-06, CA-17 y CA-20 se leen con «cinco»; CA-11 sin objeto. FAQ en acordeón y textos acortados a petición suya. |
| 2026-09-02 (2) | Revisión con ojos frescos: 2 hallazgos mayores y 4 menores incorporados (ver *Clarifications* C-01…C-06); notas del revisor convertidas en C-07…C-09. Fase `clarify` cerrada en el mismo pase. Constitución v1.1.0 aplicada (`S-0017`). |
| 2026-09-02 | Spec inicial. Aprobada en autopilot por el usuario tras nueve decisiones de alcance respondidas «ok a todo» (nombre, geografía, páginas, rangos publicados, sin cifras inventadas, tema oscuro, privacidad, enmienda de constitución, autopilot). Ajuste respecto a la propuesta inicial: geografía y contacto pasan a **Andorra / nexus.ad** por D-0015 (decisión explícita del usuario en la sesión de ordenación), en lugar de Madrid / nexus-st.com que se había recomendado sin conocer el masterprompt de Nexus Consulting. |
