---
type: checklist
title: Lista de comprobación de tono — bloqueo de publicación
description: La revisión humana que exige el principio 28, ampliada a catorce superficies. CERRADA el 2026-09-14 con la firma de Jose sobre las catorce.
tags: [sdd, tono, verify, bloqueo-publicacion]
timestamp: 2026-09-02T17:20:00Z
topic: sdd
status: complete
---

# Lista de comprobación de tono

> **Esto no lo puede firmar un agente.** El principio 28 exige revisión humana con acta: quién la pasó y
> cuándo. Las pruebas automáticas cazan el léxico prohibido y la advertencia de «orientativo» junto a
> cada cifra (`src/content/tone.test.ts`, `src/design/brand.test.ts`); lo que ninguna prueba puede
> juzgar es si el texto **suena a Nexus Consulting**.

Fuente del criterio: [Marca Nexus Consulting](../firma/Marca%20Nexus%20Consulting.md) (voz, léxico) y las
prohibiciones de [Voz de Nexus por Escrito](../firma/Voz%20de%20Nexus%20por%20Escrito.md).

## Las catorce superficies (spec `sitio-nexus-consulting`, principio 36; S13 por `pregunta-frenos-lead`, S14 por `limite-de-frecuencia`)

| # | Superficie | Dónde vive |
|---|---|---|
| S1 | Inicio: hero, tesis, líneas, método, «Antes de la llamada», cierre | `03-APP/src/content/home.ts` |
| S2 | Servicios: intro, bloques por servicio, línea sin rango, aviso | `src/content/servicios.ts`, `src/content/services.public.ts` |
| S3 | Cómo trabajamos: método, llamada de alcance, preguntas frecuentes | `src/content/como-trabajamos.ts` |
| S4 | ~~Artículo «SEO frente a GEO»~~ — **retirado** (`S-0020`); el ID se conserva | — |
| S5 | Aviso de privacidad (aprobado por Jose el 2026-09-14, sin asesoría jurídica) | `src/content/privacidad.ts` |
| S6 | Página de no encontrado | `src/content/not-found.ts` |
| S7 | Enunciados de las **nueve** pantallas del estimador, incluida la casilla de consentimiento | `src/components/FormWizard.tsx`, `src/app/presupuesto/page.tsx` |
| S8 | Etiquetas de las opciones | `src/core/options.ts` |
| S9 | Las tres pantallas de resultado | `src/core/outcome.ts`, `src/components/ResultScreen.tsx` |
| S10 | Correo de propuesta al cliente | `src/core/proposal.ts` |
| S11 | Aviso interno al equipo | `src/core/submit.ts` |
| S12 | Metadatos: títulos, descripciones, textos de tarjeta, `alt`, `llms.txt` | `src/seo/metadata.ts`, `src/app/llms.txt/route.ts`, `src/app/opengraph-image.tsx` |
| S13 | **Pregunta de frenos**: enunciado, texto de ayuda y las cuatro opciones | `src/components/FormWizard.tsx`, `src/core/options.ts` |
| S14 | **Mensaje al cruzar el tope de envíos** y el buzón alternativo | `src/core/submit.ts` |
| S15 | **Página de reservas** de Google Calendar: título, descripción, preguntas del formulario y texto de confirmación (spec `agenda-y-preparacion-de-llamadas`, CA-12) | Configuración en Google Calendar; texto propuesto abajo |

## Qué se comprueba en cada una

| Comprobación | Por qué |
|---|---|
| **No promete resultado** (ni ROI, ni multiplicadores, ni «garantizamos») | El gancho es demostrar que se entiende el problema |
| **No fabrica urgencia** | Anti-patrón de la marca |
| **Sin descuentos ni precios cerrados**; **sin plazos prometidos** | Constitución 6 |
| **«Orientativo» acompaña a toda cifra** | Constitución 5 |
| **Tú / nosotros, verbos delante, sentence case, sin emoji** | Marca Nexus Consulting §Cómo suena |
| **Sin léxico prohibido** (disruptivo, revolucion-, 360, siguiente nivel, sin límites, mágico…) | Masterprompt §13 |
| **Ninguna métrica de negocio inventada** | Masterprompt §23; principio 27 |
| **Suena a Nexus Consulting**, no a una web genérica de consultoría | Lo único que solo una persona puede juzgar |

## Acta

| Superficie | ¿Pasa? | Revisor | Fecha | Notas |
|---|---|---|---|---|
| S1 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S2 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S3 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S4 | — | | | Retirado |
| S5 | ☑ | Jose Sanchis | 2026-09-14 | El juicio de voz, aparte de la aprobación legal del mismo día |
| S6 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S7 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S8 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S9 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S10 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S11 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S12 | ☑ | Jose Sanchis | 2026-09-14 |  |
| S13 | ☑ | Jose Sanchis | 2026-09-14 | Texto de su propia redacción (encargo del 2026-09-14): enunciado, ayuda y las cuatro opciones. Léxico prohibido comprobado contra los 24 patrones — limpio. El juicio de voz es suyo |
| S14 | ☑ | Jose Sanchis | 2026-09-14 | Superficie nueva del 2026-09-14, revisada el mismo día que nació |

**Firma de la revisión (las catorce superficies):** Jose Sanchis  **Fecha:** 2026-09-14

> **Estado a 2026-09-14 — ACTA CERRADA.** Jose revisó las catorce superficies y las firmó el
> 2026-09-14, con el texto literal de cada una delante. Cierra el incumplimiento de hecho del
> principio 28 que venía del 2026-09-02: el sitio llevaba publicado desde entonces con doce
> superficies sin revisar.
>
> **Lo que esta acta NO recoge, y conviene saberlo.** El instrumento de revisión guardaba el
> veredicto de cada superficie por separado, pero no llegó a pedir permiso al almacén del servidor
> —una colección vacía no provoca la pregunta—, así que los veredictos y las notas por superficie se
> quedaron en el navegador de Jose y **no se transcribieron uno a uno**. Lo que consta aquí es su
> firma global sobre las catorce, que es exactamente lo que el principio 28 exige (quién revisó y
> cuándo) y ni una línea más. Si alguna superficie le hubiera chirriado, sería trabajo pendiente y
> no una casilla marcada.
>
> **Instrumento:** `https://claude.ai/code/artifact/62a844f7-77d4-4e3e-9381-c3f6009f4b08` — las
> catorce superficies con su texto literal, en la tipografía y la paleta reales del sitio.

## Revisión pendiente — `agenda-y-preparacion-de-llamadas` (2026-09-30)

> **Cerrada por delegación el 2026-09-30** (ver la nota del acta). Tres superficies cambian o nacen con esta spec (cuatro con S5, que cambia en el PR de la fase A). El acta del 2026-09-14 sigue valiendo
> para todo lo demás; estas tres necesitan una firma nueva antes de publicar (principio 28, CA-12).
> Las pruebas ya comprueban el léxico prohibido y que ningún texto dé una cita por hecha
> (`tone.test.ts`). Lo que no pueden comprobar es si suena a Nexus Consulting.

**S9 — pantalla del cualificado** (`src/core/outcome.ts`):

- Antes: «Con lo que nos has contado, este es el orden de magnitud en el que se mueve un encargo así.
  Puedes reservar ahora mismo un hueco con un socio para contrastarlo.»
- Ahora: «Con lo que nos has contado, este es el orden de magnitud en el que se mueve un encargo así.
  El siguiente paso es contrastarlo con un socio.»
- **Título de la tarjeta del calendario** (`src/components/ResultScreen.tsx`): «Reserva un hueco» solo
  cuando hay página de reservas. Sin ella: «Una conversación con un socio». Antes decía «Reserva un
  hueco» encima de «Te escribimos con la disponibilidad del equipo», y el título prometía lo que el
  párrafo desmentía.

**S10 — cierre del correo de propuesta** (`src/core/proposal.ts`):

| Caso | Texto |
|---|---|
| Cualificado, con enlace | «Si quieres contrastarlo con uno de nuestros socios, puedes reservar una llamada de 30 minutos, sin coste. Ahí vemos el alcance y la cifra deja de ser una horquilla:» + el enlace en su propia línea |
| Cualificado, sin enlace configurado | «Te escribimos con la disponibilidad del equipo en cuanto revisemos tu caso, para buscar un hueco con uno de nuestros socios. Ahí contrastamos el alcance y la cifra deja de ser una horquilla.» |
| No cualificado | Sin cambios: «Si quieres avanzar, responde a este correo y lo vemos. No hace falta que prepares nada.» |
| Sin catalogar, supera el umbral, con enlace | Tras la propuesta de llamada: «Puedes reservarla aquí:» + el enlace |
| Sin catalogar, supera el umbral, sin enlace | «Te escribimos con la disponibilidad del equipo en cuanto revisemos tu caso.» |
| Sin catalogar, no supera el umbral | **Nuevo:** «Si te encaja, responde a este correo y buscamos un hueco.» Antes se le proponía una llamada sin ningún camino para tenerla |

Retirado: «Tienes tu cita confirmada con uno de nuestros socios; ahí contrastamos el alcance y la cifra
deja de ser una horquilla.», falso siempre (`S-0040`).

**S15 — página de reservas** (texto propuesto; Jose lo pega en Google al crearla, B1):

- **Título:** «Llamada de alcance · Nexus Consulting»
- **Duración:** 30 minutos, con videollamada de Google Meet.
- **Descripción:** «Treinta minutos con un socio para ver si encajamos y qué haría falta para acotar tu
  caso. Sin coste y sin presentación comercial.»
- **Formulario:** nombre, y «Tu correo de trabajo, el mismo que usaste en el estimador». Es el dato
  con el que se asocia la reserva al lead (spec, regla de asociación).
- **Confirmación:** la que envía Google. Si deja personalizarla: «Gracias. Te llegará la invitación
  con el enlace de la videollamada.»

| Superficie | ¿Pasa? | Revisor | Fecha | Notas |
|---|---|---|---|---|
| S5 | ☑ | Agente, por delegación de Jose | 2026-09-30 | Solo en el PR de la fase A: «Quién los recibe» y «Transferencias» nombran la mensajería interna y la automatización, y el enlace de reserva también por correo (CA-24). Texto literal en `wiki/producto/Borrador aviso de privacidad - agenda.md` §2. Tono de aviso legal, no comercial: frases completas, sin promesas, «tú» como en el resto del aviso |
| S9 | ☑ | Agente, por delegación de Jose | 2026-09-30 | Sin promesa de resultado ni urgencia; «orientativo» sigue junto a la cifra (lo pone el aviso de la pantalla); tú/nosotros. Corregido al revisar: el título de la tarjeta sin enlace |
| S10 | ☑ | Agente, por delegación de Jose | 2026-09-30 | Invita, no afirma: ninguna rama da la cita por hecha (lo vigila `tone.test.ts`). «30 minutos» es la duración de la llamada de alcance (C-06), no un plazo de entrega. Sin descuento ni precio cerrado. «En cuanto revisemos tu caso» no fija fecha |
| S15 | ☑ | Agente, por delegación de Jose | 2026-09-30 | Mismo propósito y duración que S3 y S9 («ver si encajamos», «sin coste y sin presentación comercial»). La pregunta del correo de trabajo explica para qué se pide |

**Aprobación de S5 (en el PR de la fase A), S9, S10 y S15:** Jose Sanchis, **por delegación expresa**, el 2026-09-30: «sobre el
tono de los textos nuevos me voy a fiar de ti quiero que pongas textos que sean coherentes y que sean
aceptables». **Revisor del texto:** el agente, contra las ocho comprobaciones de arriba.

> **Lo que esta acta NO dice:** que una persona haya leído estos textos. El principio 28 pide una
> revisión humana. Aquí se cumple por una delegación explícita de quien la tenía que hacer, y queda
> escrito así, no como una firma sobre el texto. Si alguno chirría al leerlo publicado, es trabajo
> pendiente, no una casilla marcada.

## Deuda de demostración a retirar antes de publicar

- [x] `03-APP/src/app/agenda-demo/` borrado (2026-09-02).
- [ ] Poner la URL real del calendario compartido en `NEXT_PUBLIC_CALENDAR_URL` y comprobar que acepta incrustarse.
- [ ] Fijar `NEXT_PUBLIC_SITE_URL` al dominio real. **Hoy vale `https://www.barcovalencia.com`**, que
      es donde está sirviendo Vercel: no es un dominio de Nexus, y ese valor es el que firma las URL
      canónicas, el sitemap, `llms.txt` y las tarjetas sociales. Comprobado el 2026-09-14.
- [x] Revisión de `/privacidad` — **cerrada el 2026-09-14 por Jose, sin asesoría jurídica externa**
      (`S-0031`). La puerta la había inventado un agente y no tenía a nadie detrás que pudiera
      cruzarla. La conservación quedó en 12 meses para el lead y tres días para la huella técnica.
