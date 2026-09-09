#!/usr/bin/env bash
# Prueba de humo de Vercel. No publica nada: sólo lee.
#
#   1. Comprueba que el token autentica (GET /v2/user).
#   2. Si VERCEL_PROJECT está relleno, comprueba que ese proyecto existe y dice
#      cuál es su carpeta raíz — que debe ser 03-APP.
#
# Sin parámetros. Código de salida 0 si todo responde, ≠ 0 con detalle en stderr.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo." >&2; exit 1; }
set -a; . ./.env; set +a

[ -n "${VERCEL_TOKEN:-}" ] || { echo "✗ VERCEL_TOKEN vacío en .env" >&2; exit 1; }

API="https://api.vercel.com"
AUTH=(-H "Authorization: Bearer $VERCEL_TOKEN")
SCOPE=""
[ -n "${VERCEL_TEAM_ID:-}" ] && SCOPE="?teamId=$VERCEL_TEAM_ID"

# Extrae un campo de texto de una respuesta JSON sin depender de jq.
campo() { grep -o "\"$1\":\"[^\"]*\"" | head -1 | sed 's/.*:"//;s/"$//'; }

# ── 1. El token ──────────────────────────────────────────────────────────────
body=$(curl -s -w '\n%{http_code}' "${AUTH[@]}" "$API/v2/user")
code=${body##*$'\n'}; body=${body%$'\n'*}

case "$code" in
  200) echo "✓ Vercel responde. Token válido — cuenta: $(printf '%s' "$body" | campo username)" ;;
  401|403) echo "✗ Vercel rechaza el token (HTTP $code). Regenéralo en el panel." >&2; exit 1 ;;
  *) echo "✗ Respuesta inesperada de Vercel: HTTP $code" >&2; exit 1 ;;
esac

# ── 2. El proyecto (opcional) ────────────────────────────────────────────────
if [ -z "${VERCEL_PROJECT:-}" ]; then
  echo "· VERCEL_PROJECT vacío — no se comprueba ningún proyecto todavía."
  exit 0
fi

body=$(curl -s -w '\n%{http_code}' "${AUTH[@]}" "$API/v9/projects/$VERCEL_PROJECT$SCOPE")
code=${body##*$'\n'}; body=${body%$'\n'*}

case "$code" in
  200)
    raiz=$(printf '%s' "$body" | campo rootDirectory)
    echo "✓ Proyecto «$VERCEL_PROJECT» encontrado."
    if [ "$raiz" = "03-APP" ]; then
      echo "✓ Carpeta raíz = 03-APP."
    else
      echo "✗ Carpeta raíz = «${raiz:-(la del repositorio)}» — debe ser 03-APP o la compilación fallará." >&2
      exit 1
    fi
    ;;
  404) echo "✗ No existe el proyecto «$VERCEL_PROJECT» en este ámbito. ¿Falta VERCEL_TEAM_ID?" >&2; exit 1 ;;
  *) echo "✗ Respuesta inesperada al leer el proyecto: HTTP $code" >&2; exit 1 ;;
esac
