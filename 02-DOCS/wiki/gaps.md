# Knowledge Gaps

Log append-only de temas deseados pero ausentes. Las entradas se marcan `[FILLED YYYY-MM-DD]`
cuando una pasada Improve escribe el artículo — nunca se borran.

## [2026-08-26] gap | Llamada de alcance

Source: detección automática del Maintenance Pass — el concepto aparece en 3 artículos sin tener
página propia. Es el destino de toda petición que no se puede estimar (línea sin catalogar, duda de
encaje, techo de un rango abierto), pero nadie ha documentado en qué consiste, quién la atiende ni
qué se lleva el cliente de ella.

Mentioned in: [Catálogo de Servicios y Rangos 2026](comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md); [Método de Estimación Económica](comercial/Metodo%20de%20Estimacion%20Economica.md); [Landing de Captación de Leads](producto/Landing%20de%20Captacion%20de%20Leads.md)

Suggested topic: comercial

Status: open

## [2026-08-26] gap | Sponsor en dirección

Source: detección automática del Maintenance Pass — aparece en 4 artículos sin página propia. Vale 3
de los 10 puntos de cualificación y es la primera señal de cliente problemático, pero no está definido
qué cuenta como "identificado y comprometido" frente a "en proceso de identificar". Sin esa definición,
la pregunta del formulario la interpreta cada lead a su manera.

Mentioned in: [Cualificación de Oportunidades](comercial/Cualificacion%20de%20Oportunidades.md); [Criterio de Decisión de la Firma](firma/Criterio%20de%20Decision%20de%20la%20Firma.md); [Identidad y Posicionamiento de Nexus](firma/Identidad%20y%20Posicionamiento%20de%20Nexus.md); [Landing de Captación de Leads](producto/Landing%20de%20Captacion%20de%20Leads.md)

Suggested topic: comercial

Status: open

## [2026-08-26] nota | Dos gaps ahora tienen definición operativa (no artículo)

La pasada de `clarify` sobre [Spec — Landing y estimador de presupuesto de Nexus](sdd/specs/landing-presupuestos-nexus.md)
cerró, **a efectos del producto**, los dos gaps abiertos arriba:

- **Llamada de alcance** → C-06: 30 minutos, sin coste, para ver si hay encaje mutuo; no se entrega
  análisis, informe ni cifra.
- **Sponsor en dirección** → C-05: redacción cerrada de las tres opciones, con el escalón +3 / +1
  convertido en un hecho comprobable.

Ambos gaps **siguen `open`**: lo que existe es una decisión dentro de un spec, no un artículo de wiki
en `comercial/`. El resto de la firma —propuestas, llamadas, materiales— sigue sin una fuente común
para estos dos conceptos. Marcarlos `FILLED` sería confundir «decidido para la landing» con
«documentado para la casa».

## [2026-09-02] gap | El catálogo de precios pertenece a la marca derogada

Source: `D-0015` fija **Nexus Consulting** como marca canónica, pero el motor de precios sigue siendo
de *Nexus Strategy & Technology*. No es un detalle de copy: es una divergencia de **modelo de negocio**.

- **Lo que vende Nexus Consulting** (masterprompt, 5 áreas): software a medida, IA aplicada,
  automatización de procesos, integración de sistemas, consultoría tecnológica. Audiencia: pymes
  consolidadas, startups, scaleups, empresas familiares. Oferta de entrada: diagnóstico tecnológico.
- **Lo que calcula el motor** (`03-APP/src/core/catalog.ts`, 6 servicios): AI Opportunity Assessment,
  AI Transformation Program, AI Executive Advisory, Cyber Resilience Assessment, ESG Strategy &
  Compliance, Custom AI Solutions. Importes de 6.000 €/mes a 350.000 €, con CSRD, NIS2 y DORA.
- **El desajuste**: ESG y ciberseguridad **no están en la oferta de Nexus Consulting**. Y una pyme en
  crecimiento no compra un programa de 350.000 €.

Por qué no lo he tocado: cambiar el catálogo mueve reglas de producto protegidas por los principios
**4–11** de la constitución (solo se estiman servicios catalogados, doble anclaje al rango oficial,
nunca aproximar por semejanza) y rompe la **prueba de regresión del principio 16**, anclada al caso
de referencia 600 empleados → **28.000 – 35.000 €**. Es una decisión de negocio del usuario, no de un
agente.

Mentioned in: [Marca Nexus Consulting](firma/Marca%20Nexus%20Consulting.md); [Catálogo 2026](comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md); [D-0015](harness/decisions.md)

Suggested topic: comercial

Status: open — **bloquea el copy de cualquier página de servicios.** Tres salidas posibles: (a)
reescribir el catálogo con las 5 áreas y sus rangos, enmendando el principio 16 y su prueba; (b)
mantener el catálogo y aceptar que la web anuncia servicios que el estimador no cubre; (c) tratar el
catálogo como material interno y no publicarlo.

## [2026-09-02] gap | Sin métricas reales: el cuello de botella del GEO

Source: el método de mayor efecto para ser citado por motores generativos son las **estadísticas
concretas (+37 %)** y las **citas de fuentes (+40 %)** — ver
[SEO frente a GEO](seo-geo/SEO%20frente%20a%20GEO.md). No existe ni un proyecto real, ni una métrica, ni
un testimonio de cliente en todo el proyecto.

El readme del design system pone números de ejemplo (99,98 % uptime, +120 proyectos, 486 h ahorradas)
pero avisa: *"don't invent vanity stats"*. Y el principio 27 de la constitución prohíbe promesas de
resultado. Inventarlos no es una opción.

Mentioned in: [SEO frente a GEO](seo-geo/SEO%20frente%20a%20GEO.md); [Marca Nexus Consulting](firma/Marca%20Nexus%20Consulting.md)

Suggested topic: comercial

Status: open — requiere datos reales del usuario. Es la limitación de fondo de cualquier página de
casos de éxito.

## [2026-09-02] gap | Enmienda pendiente de la constitución (principio 18)

Source: `D-0014` puso el workspace en git y lo dejó dicho: **el principio 18 —"este proyecto no usa
git"— queda contradicho**, y con él el 19 y el 20. La constitución sigue en v1.0.0 con el texto
antiguo, y `analyze` y `verify` la citan por número.

Añadido hoy: `S-0014` deroga `S-0003`, así que la sección de identidad visual también quedó
desactualizada respecto a la marca canónica.

Mentioned in: [Constitution](sdd/constitution.md); [D-0014](harness/decisions.md); [S-0014](sdd/decisions.md)

Suggested topic: sdd

Status: open — enmienda **MINOR** pendiente de ratificación por el usuario. Skill: `constitution`.

## [2026-09-02] gap | Contraste y foco visible sobre fondo oscuro

Source: `S-0014` cambia la interfaz a dark navy. El principio 24 exige **WCAG 2.2 AA** en el recorrido
del formulario: contraste suficiente y foco visible. El foco actual es cobre `#b4622a` sobre papel
crema; sobre `#07111F` hay que rediseñarlo, y todos los pares de color se han de re-verificar.

Mentioned in: [S-0014](sdd/decisions.md); [Constitution](sdd/constitution.md)

Suggested topic: producto

Status: open — se cierra al ejecutar el re-vestido; `03-APP/src/components/a11y.test.tsx` es el guardián.

## [2026-09-02] nota | El hueco del catálogo queda resuelto a efectos del producto

`S-0016` (spec `sitio-nexus-consulting`) cierra **para el sitio** el hueco «El catálogo de precios
pertenece a la marca derogada» con la salida (b) hecha coherente: la arquitectura de servicios sigue
el catálogo 2026 —es lo que el estimador puede estimar y lo que protegen los principios 4–16— y las
cinco áreas del masterprompt se presentan como capacidades transversales. Respuesta explícita del
usuario: conservar la funcionalidad de Eric con la marca, el copy y el diseño de Nexus Consulting.

El hueco **sigue `open` como cuestión de negocio**: si Nexus Consulting decidiera vender solo sus
cinco áreas, habría que reescribir el catálogo, el principio 16 y su prueba. Igual que con «Llamada
de alcance» y «Sponsor en dirección», marcarlo `FILLED` confundiría «decidido para la web» con
«decidido para la casa».

La enmienda v1.1 de la constitución (hueco «Enmienda pendiente del principio 18») **queda
ratificada por el usuario** en la misma respuesta («ok a todo», punto 8) y se ejecuta en este ciclo
antes de `plan`.

## [2026-09-02] nota | Enmienda v1.1.0 aplicada; hueco de contraste pasa a principio

`S-0017`: la constitución sube a **v1.1.0**. Cierra el hueco «Enmienda pendiente de la constitución
(principio 18)» — 18 y 19 tachados y sustituidos, 20 activo, ejecutor de voz redirigido a la marca
canónica, nueva sección 9 (30–36). El hueco «Contraste y foco visible sobre fondo oscuro» deja de ser
un hueco y pasa a ser el **principio 34** (AA en todo el sitio), comprobable en `verify`; se cierra al
ejecutar el re-vestido, como estaba previsto.
