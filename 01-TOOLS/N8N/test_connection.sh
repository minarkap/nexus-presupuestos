#!/usr/bin/env bash
# Prueba de humo de n8n. No crea, no activa y no ejecuta nada: solo lee.
#
#   1. Comprueba que la instancia autentica: con la clave de API (lista 1 flujo) o, si no hay, con
#      el token del servidor MCP (un «initialize», que no toca ningún flujo).
#   2. Si hay webhook configurado, comprueba que RECHAZA una petición sin secreto. No manda
#      ningún aviso real: una petición sin credencial no llega a Slack.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo."; exit 1; }
set -a; . ./.env; set +a

[ -n "${N8N_BASE_URL:-}" ] || { echo "✗ N8N_BASE_URL vacía en .env"; exit 1; }

if [ -n "${N8N_API_KEY:-}" ]; then
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "X-N8N-API-KEY: $N8N_API_KEY" \
    "${N8N_BASE_URL%/}/api/v1/workflows?limit=1")
  case "$code" in
    200) echo "✓ n8n responde en ${N8N_BASE_URL%/}. Clave de API válida." ;;
    401|403) echo "✗ n8n rechaza la clave de API (HTTP $code)."; exit 1 ;;
    *) echo "✗ Respuesta inesperada de n8n: HTTP $code"; exit 1 ;;
  esac
elif [ -n "${N8N_MCP_TOKEN:-}" ] && [ -n "${N8N_MCP_URL:-}" ]; then
  # Sin clave de API REST: se comprueba el servidor MCP con un «initialize», que no toca ningún flujo.
  code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$N8N_MCP_URL" \
    -H "Authorization: Bearer $N8N_MCP_TOKEN" -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"nexus-smoke","version":"1"}}}')
  case "$code" in
    200) echo "✓ El servidor MCP de n8n responde en ${N8N_BASE_URL%/}. Token válido." ;;
    401|403) echo "✗ n8n rechaza el token del MCP (HTTP $code). ¿Se rotó? Actualiza .env y claude mcp."; exit 1 ;;
    *) echo "✗ Respuesta inesperada del MCP de n8n: HTTP $code"; exit 1 ;;
  esac
else
  echo "✗ Ni N8N_API_KEY ni N8N_MCP_TOKEN en .env"; exit 1
fi

if [ -n "${N8N_LEAD_WEBHOOK_URL:-}" ]; then
  sin=$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
    -d '{"version":1}' "$N8N_LEAD_WEBHOOK_URL")
  case "$sin" in
    401|403) echo "✓ El webhook de avisos rechaza una petición sin secreto (HTTP $sin)." ;;
    404) echo "· El webhook de avisos no existe o el flujo W1 no está activo (HTTP 404)." ;;
    *) echo "✗ PELIGRO: el webhook de avisos acepta peticiones SIN secreto (HTTP $sin)."; exit 1 ;;
  esac
else
  echo "· N8N_LEAD_WEBHOOK_URL vacía: W1 todavía no está construido."
fi
