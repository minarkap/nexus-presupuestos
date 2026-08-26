#!/usr/bin/env bash
# Prueba de humo de Resend. No envía nada: sólo comprueba que la clave es válida.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo."; exit 1; }
set -a; . ./.env; set +a

[ -n "${RESEND_API_KEY:-}" ] || { echo "✗ RESEND_API_KEY vacía en .env"; exit 1; }
[ -n "${RESEND_FROM:-}" ]    || { echo "✗ RESEND_FROM vacía en .env"; exit 1; }

code=$(curl -s -o /dev/null -w '%{http_code}' \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  https://api.resend.com/domains)

case "$code" in
  200) echo "✓ Resend responde. Clave válida. Remitente configurado: $RESEND_FROM" ;;
  401|403) echo "✗ Resend rechaza la clave (HTTP $code)."; exit 1 ;;
  *) echo "✗ Respuesta inesperada de Resend: HTTP $code"; exit 1 ;;
esac
