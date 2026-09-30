# n8n

La herramienta de automatizaciones que coordina Slack, Google Calendar, Google Drive y Perplexity
para la agenda y la preparación de las llamadas (spec `agenda-y-preparacion-de-llamadas`, `S-0041`).
La web solo le avisa de cada lead; todo lo demás ocurre aquí.

> **Una sola instancia vale: la de este proyecto.** Nada de otra cuenta, otro workspace ni
> `n8n-templates`. Si `N8N_BASE_URL` no apunta a la instancia que Jose indicó para este proyecto,
> no se toca.

## Setup

1. `cp .env.example .env && chmod 600 .env`
2. Rellena `N8N_BASE_URL` y `N8N_API_KEY` (Settings → n8n API).
3. `./test_connection.sh` — debe acabar en `✓ … Clave de API válida.`

## Qué hay aquí

| Ruta | Qué es |
|------|--------|
| `contracts/lead-notice.v1.schema.json` | El contrato del aviso que la web manda a W1. Una prueba de la web comprueba que lo cumple |
| `workflows/` | Los flujos exportados desde n8n, versionados en git. La exportación referencia las credenciales por nombre; **nunca las incluye** |
| `test_connection.sh` | Prueba de humo de solo lectura |

## Los cinco flujos

Diseño completo en [`02-DOCS/wiki/stack/n8n-agenda.md`](../../02-DOCS/wiki/stack/n8n-agenda.md).

| Flujo | Disparo | Fase |
|-------|---------|------|
| W1 Aviso de lead | Webhook de la web, con secreto | A |
| W2 Reserva confirmada | Evento nuevo en el calendario de reservas | B |
| W3 Cambios de reserva | Evento actualizado o cancelado | B |
| W4 Borrados pendientes | Diario, 04:00 | B |
| W5 Limpieza del canal | Diario, 04:30 | A |

## Notas operativas

- **Rotar el secreto del webhook:** genera uno nuevo, cámbialo a la vez en la credencial «Header Auth»
  de W1 y en `N8N_LEAD_WEBHOOK_SECRET` de Vercel, y vuelve a publicar la web. Mientras no coincidan,
  los avisos fallan y el correo interno lo dice (CA-09).
- W2–W4 se construyen **desactivados** y solo se activan cuando el aviso de privacidad cuente la
  investigación (principio 23).
