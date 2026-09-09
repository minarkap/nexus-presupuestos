---
type: article
title: SEO frente a GEO
description: La diferencia real entre optimizar para posicionar en una lista de resultados y optimizar para ser citado dentro de una respuesta generada, con los nueve métodos medidos por Princeton.
tags: [seo, geo, buscadores, ia, citacion, schema]
timestamp: 2026-09-02T16:30:00Z
aliases: [seo-frente-a-geo, seo-vs-geo]
topic: seo-geo
status: stable
sources: ["Aggarwal et al., «GEO: Generative Engine Optimization», Princeton / IIT Delhi / Georgia Tech / Allen Institute for AI, arXiv:2311.09735, KDD 2024", "skill `seo-geo` (references/geo-research.md, references/platform-algorithms.md)"]
score: 5.0
---

# SEO frente a GEO

> Sources: Aggarwal et al., *GEO: Generative Engine Optimization*, arXiv:2311.09735 (KDD 2024); skill `seo-geo`
> Raw: sin fuente en `raw/` — destilado de investigación externa y de la skill instalada

## Overview

**La diferencia en una frase: el SEO compite por una posición en una lista; el GEO compite por
aparecer dentro de una respuesta.**

El SEO (*Search Engine Optimization*) optimiza una **página** para que un buscador la **ordene** por
encima de otras en una lista de enlaces. La unidad de éxito es la posición, y el objetivo final es el
clic.

El GEO (*Generative Engine Optimization*) optimiza el **contenido** para que un motor generativo
—ChatGPT, Perplexity, Gemini, Copilot, Claude, AI Overviews de Google— lo **cite** al redactar su
respuesta. La unidad de éxito es el fragmento citado, y muchas veces **no hay clic**: el usuario
obtiene la respuesta y no visita nada.

De ahí la consecuencia que lo cambia todo: **en un motor generativo no existe el puesto número uno.
Existe estar en la respuesta o no estar.** Ser citado es el nuevo posicionar primero.

## La tabla honesta

| | **SEO** | **GEO** |
|---|---|---|
| **Qué optimizas** | La página | El pasaje extraíble |
| **Qué hace el motor** | Ordena y lista enlaces | Redacta una respuesta y cita fuentes |
| **Unidad de éxito** | Posición en la SERP | Cuánto de tu texto entra en la respuesta |
| **Métrica** | Ranking, impresiones, CTR | Cuota de la respuesta, presencia de la cita |
| **Qué gana el usuario** | Una lista para elegir | Una respuesta ya escrita |
| **Tráfico** | El clic es el objetivo | Puede haber **cero clics** |
| **Palancas** | Keywords, enlaces entrantes, rastreabilidad, Core Web Vitals | Citas, estadísticas, tono experto, estructura *answer-first*, schema |
| **Densidad de keywords** | Ayuda con moderación | **Perjudica: −10 %** |
| **Quién rastrea** | Googlebot, Bingbot | GPTBot, PerplexityBot, ClaudeBot, ChatGPT-User, además de los anteriores |
| **Índice que importa** | Google, Bing | Bing (Copilot), Brave (Claude), índices propios |

## Lo que está medido: los nueve métodos

El marco no es especulación de mercado: viene de un estudio de Princeton, IIT Delhi, Georgia Tech y
el Allen Institute for AI (arXiv:2311.09735), aceptado en **KDD 2024**, con un banco de más de
**10.000 consultas** (GEO-bench) y validación sobre **Perplexity.ai**, un motor comercial real.

| Método | Efecto en visibilidad | Qué es |
|--------|----------------------|--------|
| **Citar fuentes** | **+40 %** | Añadir referencias autorizadas y verificables |
| **Añadir estadísticas** | **+37 %** | Datos concretos y cuantificados en lugar de adjetivos |
| **Añadir citas textuales** | **+30 %** | Frases de expertos con atribución |
| **Tono autorizado** | **+25 %** | Escribir con seguridad y precisión, sin hedging |
| **Fácil de entender** | **+20 %** | Simplificar lo complejo sin perder exactitud |
| **Términos técnicos** | **+18 %** | Terminología del dominio, en su sitio |
| **Vocabulario diverso** | **+15 %** | Evitar la repetición léxica |
| **Fluidez** | **+15–30 %** | Legibilidad, hilo lógico, párrafos cortos |
| **Densidad de keywords** | **−10 %** ⚠ | Repetir la keyword. **Aquí resta.** |

Techo declarado: hasta **+40 %** de visibilidad; y hasta **+115 %** en sitios de posicionamiento
bajo cuando se añaden citas — el hallazgo más interesante para una firma pequeña, porque significa
que el GEO **no lo gana automáticamente quien ya es grande**.

Mejores combinaciones según el propio estudio: **fluidez + estadísticas** es el mayor empuje global;
**citas + tono autorizado** es lo mejor para contenido profesional; **términos técnicos + citas**
para material técnico.

## La inversión que hay que interiorizar

Este es el punto que más cuesta a quien viene del SEO clásico:

> **Repetir la palabra clave, que en SEO tradicional era una técnica básica, en GEO reduce la
> visibilidad un 10 %.**

No es que sea neutro o esté penalizado por abuso: es que **empeora activamente** las probabilidades
de ser citado. Un motor generativo no cuenta apariciones de un término, extrae afirmaciones
utilizables. Un párrafo con la keyword seis veces es un párrafo con menos información por palabra, y
por tanto peor candidato a ser citado.

Corolario práctico: **escribir bien y con datos es la técnica.** No hay atajo de palabra clave.

## Estructura: escribir para ser extraído

Un motor generativo no lee tu página, extrae de ella. Eso impone forma:

- **Answer-first.** La respuesta directa arriba, no tras tres párrafos de introducción.
- **Jerarquía limpia** H1 > H2 > H3, con encabezados en forma de pregunta cuando aplique.
- **Párrafos de dos o tres frases.** Un párrafo largo es difícil de citar sin recortarlo.
- **Tablas para comparar y listas para enumerar** — son las formas más extraíbles que existen.
- **Cada afirmación, autocontenida.** Si un fragmento solo se entiende con el párrafo anterior, no
  sirve como cita.

## Schema: dónde está el mayor retorno técnico

El **`FAQPage`** de JSON-LD es la pieza con mejor relación esfuerzo/efecto que documenta la skill
`seo-geo`: en torno a **+40 %** de visibilidad en IA. La razón es estructural: una FAQ ya es
pregunta + respuesta autocontenida, que es exactamente el formato que un motor generativo necesita.

Los tipos que aplican a una consultora: `Organization` (identidad y autoridad), `WebSite`,
`Service` (una por línea de servicio), `FAQPage`, `Article` con `datePublished` y `dateModified`, y
`BreadcrumbList`.

## Los crawlers: el error de bulto

Un sitio puede estar impecable en Google y ser **invisible** para los motores generativos, porque los
rastrean bots distintos. `robots.txt` tiene que permitir explícitamente:

| Bot | Motor |
|-----|-------|
| `Googlebot` | Google, AI Overviews |
| `Bingbot` | Bing, Microsoft Copilot |
| `GPTBot` | Entrenamiento de OpenAI |
| `ChatGPT-User` | ChatGPT navegando en vivo |
| `PerplexityBot` | Perplexity |
| `ClaudeBot` / `anthropic-ai` | Claude |

Y hay una trampa de índice que conviene saber: **Copilot depende de la indexación en Bing** (no en
Google), y **Claude usa el índice de Brave**. Estar en Google no basta para aparecer en ninguno de
los dos.

## Notas por plataforma

Esto ya es heurística de mercado recogida por la skill `seo-geo`, no resultado del paper — trátalo
como orientación, no como dato duro:

- **ChatGPT** — premia la autoridad del dominio de marca (citado ~11 % más que fuentes de terceros) y
  el contenido actualizado en los últimos **30 días** (hasta 3,2× más citas).
- **Perplexity** — `PerplexityBot` permitido, FAQ schema, y prioriza **documentos PDF** alojados.
- **Google AI Overview** — **E-E-A-T**, datos estructurados, autoridad temática por clusters con
  enlazado interno, y citas autorizadas.
- **Microsoft Copilot** — indexación en Bing obligatoria, velocidad por debajo de 2 s, definiciones
  de entidad claras; menciones en LinkedIn y GitHub ayudan.
- **Claude** — indexación en Brave, alta densidad factual, claridad estructural para extraer.

## Lo que NO cambia

El GEO no sustituye al SEO, se suma. Sigue haciendo falta que la página se pueda rastrear, cargue
rápido, sea usable en móvil, tenga `sitemap.xml` y una arquitectura de enlaces interna sensata. Un
contenido perfecto para ser citado que un bot no puede leer no se cita.

## Aplicación a Nexus Consulting

Tres consecuencias directas, dado que el dominio es consultoría B2B:

1. **La combinación que toca es estadísticas + citas + tono autorizado** — es la recomendada para el
   dominio negocio/tecnología. Y choca de frente con un problema real: hoy **no hay ni una métrica
   de proyecto real** que citar. Es el cuello de botella del GEO en este sitio, no la parte técnica.
2. **La voz de marca ya juega a favor.** El masterprompt exige "sin humo, sin exageraciones", habla
   de "problemas reales y soluciones concretas" y prohíbe expresamente inventar métricas vanidosas.
   Eso es, palabra por palabra, lo que el GEO recompensa. La marca no necesita torcerse para ser
   citable.
3. **Cuidado con el principio 27 de la constitución.** Prohíbe promesas de resultado en cualquier
   texto del sitio. Los porcentajes de este artículo son **hallazgos de un estudio sobre contenido
   genérico**, y así hay que presentarlos, con su fuente. "Citar fuentes aumentó la visibilidad un
   40 % en el estudio de Princeton" es legítimo; "te subimos la visibilidad un 40 %" está prohibido.

## Related

- [Marca Nexus Consulting](../firma/Marca%20Nexus%20Consulting.md) — la voz que ya cumple lo que el GEO premia.
- [Landing de Captación de Leads](../producto/Landing%20de%20Captacion%20de%20Leads.md) — la pieza donde se aplica.
- [Constitution](../sdd/constitution.md) — principio 27, la restricción sobre promesas de resultado.
