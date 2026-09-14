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

## Las trece superficies (spec `sitio-nexus-consulting`, principio 36; S13 añadida por `pregunta-frenos-lead`)

| # | Superficie | Dónde vive |
|---|---|---|
| S1 | Inicio: hero, tesis, líneas, método, «Antes de la llamada», cierre | `03-APP/src/content/home.ts` |
| S2 | Servicios: intro, bloques por servicio, línea sin rango, aviso | `src/content/servicios.ts`, `src/content/services.public.ts` |
| S3 | Cómo trabajamos: método, llamada de alcance, preguntas frecuentes | `src/content/como-trabajamos.ts` |
| S4 | ~~Artículo «SEO frente a GEO»~~ — **retirado** (`S-0020`); el ID se conserva | — |
| S5 | Aviso de privacidad (**borrador para revisión legal**) | `src/content/privacidad.ts` |
| S6 | Página de no encontrado | `src/content/not-found.ts` |
| S7 | Enunciados de las **nueve** pantallas del estimador, incluida la casilla de consentimiento | `src/components/FormWizard.tsx`, `src/app/presupuesto/page.tsx` |
| S8 | Etiquetas de las opciones | `src/core/options.ts` |
| S9 | Las tres pantallas de resultado | `src/core/outcome.ts`, `src/components/ResultScreen.tsx` |
| S10 | Correo de propuesta al cliente | `src/core/proposal.ts` |
| S11 | Aviso interno al equipo | `src/core/submit.ts` |
| S12 | Metadatos: títulos, descripciones, textos de tarjeta, `alt`, `llms.txt` | `src/seo/metadata.ts`, `src/app/llms.txt/route.ts`, `src/app/opengraph-image.tsx` |
| S13 | **Pregunta de frenos**: enunciado, texto de ayuda y las cuatro opciones | `src/components/FormWizard.tsx`, `src/core/options.ts` |

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
| S5 | ☐ | | | Requiere además revisión legal |
| S6 | ☐ | | | |
| S7 | ☐ | | | |
| S8 | ☐ | | | |
| S9 | ☐ | | | |
| S10 | ☐ | | | |
| S11 | ☐ | | | |
| S12 | ☐ | | | |
| S13 | ☐ | | | Nueva (`pregunta-frenos-lead`, 2026-09-14). Ojo: el lead declara una debilidad — el tono no puede sonar a interrogatorio ni a juicio |

**Firma de la revisión:** ______________________  **Fecha:** ____________

## Deuda de demostración a retirar antes de publicar

- [x] `03-APP/src/app/agenda-demo/` borrado (2026-09-02).
- [ ] Poner la URL real del calendario compartido en `NEXT_PUBLIC_CALENDAR_URL` y comprobar que acepta incrustarse.
- [ ] Fijar `NEXT_PUBLIC_SITE_URL` al dominio real del despliegue (por defecto `https://nexus.ad`).
- [ ] Revisión legal de `/privacidad` (plazo de conservación propuesto: 12 meses).
