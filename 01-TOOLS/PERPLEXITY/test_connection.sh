#!/usr/bin/env bash
# Prueba de humo de Perplexity. No lanza ninguna búsqueda y no cuesta nada: manda una petición
# VACÍA a propósito. Una clave válida la rechaza por el cuerpo (400); una inválida, por la clave (401).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo."; exit 1; }
set -a; . ./.env; set +a

[ -n "${PERPLEXITY_API_KEY:-}" ] || { echo "✗ PERPLEXITY_API_KEY vacía en .env"; exit 1; }

code=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" -H 'Content-Type: application/json' \
  -d '{}' https://api.perplexity.ai/chat/completions)
case "$code" in
  400|422) echo "✓ Perplexity responde. Clave válida (rechazó el cuerpo vacío, como debe: HTTP $code)." ;;
  401|403) echo "✗ Perplexity rechaza la clave (HTTP $code)."; exit 1 ;;
  *) echo "✗ Respuesta inesperada de Perplexity: HTTP $code"; exit 1 ;;
esac
