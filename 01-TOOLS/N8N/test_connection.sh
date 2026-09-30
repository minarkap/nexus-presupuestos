#!/usr/bin/env bash
# Prueba de humo de n8n. No crea, no activa y no ejecuta nada: solo lee.
#
#   1. Comprueba que la clave de API autentica contra la instancia (lista 1 flujo).
#   2. Si hay webhook configurado, comprueba que RECHAZA una petición sin secreto. No manda
#      ningún aviso real: una petición sin credencial no llega a Slack.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo."; exit 1; }
set -a; . ./.env; set +a

[ -n "${N8N_BASE_URL:-}" ] || { echo "✗ N8N_BASE_URL vacía en .env"; exit 1; }
[ -n "${N8N_API_KEY:-}" ]  || { echo "✗ N8N_API_KEY vacía en .env"; exit 1; }

code=$(curl -s -o /dev/null -w '%{http_code}' -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "${N8N_BASE_URL%/}/api/v1/workflows?limit=1")
case "$code" in
  200) echo "✓ n8n responde en ${N8N_BASE_URL%/}. Clave de API válida." ;;
  401|403) echo "✗ n8n rechaza la clave de API (HTTP $code)."; exit 1 ;;
  *) echo "✗ Respuesta inesperada de n8n: HTTP $code"; exit 1 ;;
esac

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
