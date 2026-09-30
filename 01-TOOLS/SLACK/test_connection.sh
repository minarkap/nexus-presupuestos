#!/usr/bin/env bash
# Prueba de humo de Slack. No publica nada: solo comprueba el token y que el canal existe.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo."; exit 1; }
set -a; . ./.env; set +a

[ -n "${SLACK_BOT_TOKEN:-}" ] || { echo "✗ SLACK_BOT_TOKEN vacío en .env"; exit 1; }

auth=$(curl -s -X POST -H "Authorization: Bearer $SLACK_BOT_TOKEN" https://slack.com/api/auth.test)
case "$auth" in
  *'"ok":true'*) echo "✓ Slack responde. Token válido — espacio: $(printf '%s' "$auth" | grep -o '"team":"[^"]*"' | cut -d'"' -f4)" ;;
  *) echo "✗ Slack rechaza el token: $(printf '%s' "$auth" | grep -o '"error":"[^"]*"')"; exit 1 ;;
esac

if [ -n "${SLACK_CHANNEL_ID:-}" ]; then
  info=$(curl -s -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
    "https://slack.com/api/conversations.info?channel=$SLACK_CHANNEL_ID")
  case "$info" in
    *'"ok":true'*) echo "✓ Canal $SLACK_CHANNEL_ID encontrado." ;;
    *) echo "✗ El canal no responde: $(printf '%s' "$info" | grep -o '"error":"[^"]*"')"; exit 1 ;;
  esac
else
  echo "· SLACK_CHANNEL_ID vacío: no se comprueba ningún canal todavía."
fi
