# n8n

La herramienta de automatizaciones que coordina Slack, Google Calendar, Google Drive y Perplexity
para la agenda y la preparación de las llamadas (spec `agenda-y-preparacion-de-llamadas`, `S-0041`).
La web solo le avisa de cada lead; todo lo demás ocurre aquí.

> **Una sola instancia vale: la de este proyecto, `https://sanchis18.app.n8n.cloud`** (indicada por
> Jose el 2026-09-30). Nada de otra cuenta, otro workspace ni `n8n-templates`.

**Cómo se opera:** por su servidor MCP oficial, registrado en Claude Code con alcance **local**
(`claude mcp add --scope local n8n-mcp …`). Queda en la configuración privada de esta máquina, no en
el `.mcp.json` versionado, que no puede llevar secretos. El token vive también en `.env`.

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

| Flujo | Disparo | Fase | Credenciales |
|-------|---------|------|------|
| W1 Aviso de lead · `6JYJME98VXchjGIh` | Webhook `POST /webhook/nexus/lead`, con secreto | A | Slack ✓ · **falta** la credencial Header Auth |
| W2 Reserva confirmada · `tLn3PxyN11UlkCqW` | Cita nueva «Agendas Nexus Web» en el calendario de Jose | B | Google ✓ · Slack ✓ · **faltan** Supabase y Perplexity |
| W3 Cambios de reserva · `PcDrpy12t7fZVJ54` | Cita cambiada o cancelada | B | Google ✓ · Slack ✓ · **falta** Supabase |
| W4 Borrados pendientes · `v7MzIN6xnbrqT8Jy` | Diario, 04:00 Madrid | B | Google ✓ · Slack ✓ · **falta** Supabase |
| W5 Limpieza del canal · `XnUPWijAL2s2N2ci` | Diario, 04:30 Madrid | A | Slack ✓ |

Los cinco están **sin publicar** y exportados en `workflows/`. La base de datos se usa por el nodo de
Supabase con la llave de servidor, a petición de Jose (`S-0045`).

## Notas operativas

- **Rotar el token del MCP** (se pegó en el chat el 2026-09-30, así que hay que rotarlo): genera uno
  nuevo en n8n, cámbialo en `.env` (`N8N_MCP_TOKEN`) y vuelve a registrar el servidor con
  `claude mcp remove n8n-mcp -s local` y `claude mcp add --transport http --scope local n8n-mcp
  "$N8N_MCP_URL" --header "Authorization: Bearer $N8N_MCP_TOKEN"`.
- **Rotar el secreto del webhook:** genera uno nuevo, cámbialo a la vez en la credencial «Header Auth»
  de W1 y en `N8N_LEAD_WEBHOOK_SECRET` de Vercel, y vuelve a publicar la web. Mientras no coincidan,
  los avisos fallan y el correo interno lo dice (CA-09).
- W2–W4 se construyen **desactivados** y solo se activan cuando el aviso de privacidad cuente la
  investigación (principio 23).
