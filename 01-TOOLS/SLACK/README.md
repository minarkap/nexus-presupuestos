# Slack

El canal del equipo: un aviso por cada lead que llega (W1), por cada reserva y con el resumen de la
investigación (W2–W3). Es un aviso, no un archivo: W5 borra a los doce meses los mensajes de la app
(spec `agenda-y-preparacion-de-llamadas`, CA-26).

## Setup

1. Crea una app de Slack para el espacio del equipo, con los permisos de `.env.example`, e instálala.
2. Invita la app al canal (`/invite @la-app`).
3. `cp .env.example .env && chmod 600 .env`, rellena el token y el ID del canal.
4. `./test_connection.sh`.
5. En n8n, crea la credencial de Slack con el mismo token.

## Notas operativas

- Si el plan de Slack permite fijar la retención del canal a 12 meses, actívala también: es la
  segunda red de W5 (plan, R-6).
- El resumen de la investigación solo da el cargo de la persona; el resto va en el documento de
  Drive (spec, *Behaviour*).
