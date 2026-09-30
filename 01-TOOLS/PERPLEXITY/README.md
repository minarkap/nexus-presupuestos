# Perplexity

La investigación de la empresa y de la persona cuando un lead cualificado reserva su llamada (W2,
fase B). Solo información pública y profesional, con la fuente de cada afirmación (spec, CA-17a).

> **No se activa** hasta que el aviso de privacidad publicado cuente la investigación (B8,
> principio 23). Antes de eso, lee sus condiciones de datos para la API: retención, uso para
> entrenamiento y contrato de encargado (B6).

## Setup

1. `cp .env.example .env && chmod 600 .env` y rellena la clave.
2. `./test_connection.sh`. No gasta nada: manda una petición vacía a propósito.
3. En n8n, crea la credencial con la misma clave.

## Notas operativas

- Los dos prompts (empresa, persona) y su esquema de salida viven en
  [`02-DOCS/wiki/stack/n8n-agenda.md`](../../02-DOCS/wiki/stack/n8n-agenda.md). Si cambian allí,
  se cambian en W2.
- Coste: dos consultas por reserva. A decenas de leads al mes, unos céntimos.
