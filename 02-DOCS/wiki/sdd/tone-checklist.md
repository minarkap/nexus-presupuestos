---
type: checklist
title: Lista de comprobación de tono — bloqueo de publicación
description: La revisión humana que exige el principio 28 (ampliada a doce superficies por el 36). Sin acta firmada, el criterio no está verificado y el sitio no se publica.
tags: [sdd, tono, verify, bloqueo-publicacion]
timestamp: 2026-09-02T17:20:00Z
topic: sdd
status: stable
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
| S1 | ☐ | | | |
| S2 | ☐ | | | |
| S3 | ☐ | | | |
| S4 | — | | | Retirado |
| S5 | ☐ | | | Aprobado legalmente por Jose el 2026-09-14, sin jurista. Falta el juicio de voz |
| S6 | ☐ | | | |
| S7 | ☐ | | | |
| S8 | ☐ | | | |
| S9 | ☐ | | | |
| S10 | ☐ | | | |
| S11 | ☐ | | | |
| S12 | ☐ | | | |
| S14 | ☐ | | | Superficie nueva del 2026-09-14. Es lo ÚNICO que ve alguien a quien el sitio acaba de frenar |
| S13 | ☑ | Jose Sanchis | 2026-09-14 | Texto de su propia redacción (encargo del 2026-09-14): enunciado, ayuda y las cuatro opciones. Léxico prohibido comprobado contra los 24 patrones — limpio. El juicio de voz es suyo |

**Firma de la revisión (las catorce superficies):** ______________________  **Fecha:** ____________

> **Estado a 2026-09-14.** Sólo **S13** está firmada. Las doce anteriores siguen pendientes desde el
> ciclo `sitio-nexus-consulting` (2026-09-02), y S14 nació hoy. El sitio lleva publicado desde el
> 2026-09-02: el principio 28 se está incumpliendo de hecho, no por descuido de ninguna spec. La firma
> global de arriba se deja en blanco a propósito — cubriría las catorce, y trece no se han revisado.
>
> **Instrumento de revisión (2026-09-14).** Las catorce superficies están volcadas, con su texto
> literal y en la tipografía real del sitio, en una página donde Jose marca el veredicto de cada una:
> `https://claude.ai/code/artifact/62a844f7-77d4-4e3e-9381-c3f6009f4b08`. Los veredictos se guardan
> en el servidor y se transcriben a esta acta; **la firma sigue siendo suya, no del instrumento**.

## Deuda de demostración a retirar antes de publicar

- [x] `03-APP/src/app/agenda-demo/` borrado (2026-09-02).
- [ ] Poner la URL real del calendario compartido en `NEXT_PUBLIC_CALENDAR_URL` y comprobar que acepta incrustarse.
- [ ] Fijar `NEXT_PUBLIC_SITE_URL` al dominio real. **Hoy vale `https://www.barcovalencia.com`**, que
      es donde está sirviendo Vercel: no es un dominio de Nexus, y ese valor es el que firma las URL
      canónicas, el sitemap, `llms.txt` y las tarjetas sociales. Comprobado el 2026-09-14.
- [x] Revisión de `/privacidad` — **cerrada el 2026-09-14 por Jose, sin asesoría jurídica externa**
      (`S-0031`). La puerta la había inventado un agente y no tenía a nadie detrás que pudiera
      cruzarla. La conservación quedó en 12 meses para el lead y tres días para la huella técnica.
