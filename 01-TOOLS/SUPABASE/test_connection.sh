#!/usr/bin/env bash
# Prueba de humo de Supabase. No escribe nada: comprueba credencial, tabla y —sobre todo— que la
# tabla NO es accesible desde fuera con la clave pública.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo."; exit 1; }
set -a; . ./.env; set +a

[ -n "${SUPABASE_URL:-}" ]              || { echo "✗ SUPABASE_URL vacía en .env"; exit 1; }
[ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ] || { echo "✗ SUPABASE_SERVICE_ROLE_KEY vacía en .env"; exit 1; }
TABLA="${SUPABASE_LEADS_TABLE:-leads}"

url="${SUPABASE_URL%/}/rest/v1/${TABLA}?select=submission_id&limit=1"

# 1. ¿Responde y existe la tabla?
code=$(curl -s -o /dev/null -w '%{http_code}' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$url")

case "$code" in
  200) echo "✓ Supabase responde y la tabla «$TABLA» existe." ;;
  401|403) echo "✗ Supabase rechaza la clave (HTTP $code). Revisa SUPABASE_SERVICE_ROLE_KEY."; exit 1 ;;
  404) echo "✗ La tabla «$TABLA» no existe. Ejecuta schema.sql en el SQL Editor."; exit 1 ;;
  *) echo "✗ Respuesta inesperada de Supabase: HTTP $code"; exit 1 ;;
esac

# 2. La comprobación que de verdad importa: con la clave PÚBLICA no se puede leer nada.
#    Ojo: sin cabecera `apikey` la API rechaza siempre, diga lo que diga la seguridad de fila. Por
#    eso la prueba honesta necesita la clave `anon` — la que cualquiera puede ver en un navegador.
if [ -z "${SUPABASE_ANON_KEY:-}" ]; then
  echo "· SUPABASE_ANON_KEY no está en .env: no puedo comprobar que la tabla esté cerrada."
  echo "  Añádela (Settings → API Keys → Publishable key, empieza por sb_publishable_)."
  exit 0
fi

respuesta=$(curl -s -w '\n%{http_code}' \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$url")
publico_code=$(echo "$respuesta" | tail -1)
publico_body=$(echo "$respuesta" | sed '$d')

case "$publico_code" in
  401|403)
    echo "✓ Con la clave pública, la tabla deniega el acceso (HTTP $publico_code). Cerrada."
    ;;
  200)
    if [ "$publico_body" = "[]" ]; then
      echo "✓ Con la clave pública no se ve ninguna fila (seguridad de fila activa y sin policy)."
      echo "  Aun así, ejecuta el 'revoke all' de schema.sql: deniega antes de llegar a las filas."
    else
      echo "✗ PELIGRO: la tabla DEVUELVE DATOS con la clave pública. Está expuesta a Internet."
      echo "  Ejecuta schema.sql entero: falta 'enable row level security' y/o el 'revoke all'."
      exit 1
    fi
    ;;
  *)
    echo "✗ Respuesta inesperada con la clave pública: HTTP $publico_code"; exit 1
    ;;
esac
