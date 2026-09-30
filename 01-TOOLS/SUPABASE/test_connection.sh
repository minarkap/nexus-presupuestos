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

# Misma normalización que el adaptador: el panel enseña la URL del proyecto y la de la API en
# pantallas distintas, y pegar la segunda produce un 404 «la tabla no existe» que despista.
BASE=$(printf '%s' "$SUPABASE_URL" | sed -E 's#/+$##; s#/rest/v1$##')
url="${BASE}/rest/v1/${TABLA}?select=submission_id&limit=1"

# 1. ¿Responde y existe la tabla?
code=$(curl -s -o /dev/null -w '%{http_code}' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$url")

case "$code" in
  200) echo "✓ Supabase responde y la tabla «${TABLA}» existe." ;;
  401|403) echo "✗ Supabase rechaza la clave (HTTP $code). Revisa SUPABASE_SERVICE_ROLE_KEY."; exit 1 ;;
  404) echo "✗ La tabla «${TABLA}» no existe. Ejecuta schema.sql en el SQL Editor."; exit 1 ;;
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

# ─────────────────────────────────────────────────────────────────────────────
# 3. La SEGUNDA tabla, la de intentos del límite de frecuencia. El plan prometía
#    comprobarla igual que `leads` y se había quedado sin comprobar.
# ─────────────────────────────────────────────────────────────────────────────
url2="${BASE}/rest/v1/submission_attempts?select=fingerprint&limit=1"

code2=$(curl -s -o /dev/null -w '%{http_code}' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" "$url2")
case "$code2" in
  200) echo "✓ La tabla «submission_attempts» existe." ;;
  404) echo "· La tabla «submission_attempts» no existe todavía: ejecuta rate-limit.sql." ;;
  *)   echo "✗ Respuesta inesperada en submission_attempts: HTTP $code2"; exit 1 ;;
esac

if [ "$code2" = "200" ]; then
  pub2=$(curl -s -w '\n%{http_code}' \
    -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY" "$url2")
  pub2_code=$(echo "$pub2" | tail -1)
  pub2_body=$(echo "$pub2" | sed '$d')
  if [ "$pub2_code" = "200" ] && [ "$pub2_body" != "[]" ]; then
    echo "✗ PELIGRO: submission_attempts DEVUELVE DATOS con la clave pública."
    exit 1
  fi
  echo "✓ Con la clave pública, submission_attempts tampoco responde (HTTP $pub2_code)."

  # Y que la función atómica esté cerrada a quien no tenga la llave del servidor.
  rpc_pub=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
    -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" -d '{"huella":"prueba"}' \
    "${BASE}/rest/v1/rpc/registrar_intento")
  if [ "$rpc_pub" = "200" ]; then
    echo "✗ PELIGRO: cualquiera puede llamar a registrar_intento y escribir en la tabla."
    exit 1
  fi
  echo "✓ La función registrar_intento está cerrada al público (HTTP $rpc_pub)."
fi

# ─────────────────────────────────────────────────────────────────────────────
# 4. Agenda y preparación de la llamada (agenda.sql). Solo si ya se aplicó: antes
#    de B7 estas piezas no existen, y eso no es un fallo.
# ─────────────────────────────────────────────────────────────────────────────
col=$(curl -s -o /dev/null -w '%{http_code}' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "${BASE}/rest/v1/${TABLA}?select=outcome_kind,booking_offered,privacy_version,research_allowed&limit=1")
case "$col" in
  200) echo "✓ Bloque A de agenda.sql aplicado: «${TABLA}» tiene las cuatro columnas nuevas." ;;
  400) echo "· Bloque A de agenda.sql SIN aplicar. No publiques la web de la fase A hasta aplicarlo." ;;
  *) echo "✗ Respuesta inesperada al comprobar las columnas nuevas: HTTP $col"; exit 1 ;;
esac

for rel in lead_research external_deletions leads_para_agenda; do
  existe=$(curl -s -o /dev/null -w '%{http_code}' \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "${BASE}/rest/v1/${rel}?limit=1")
  if [ "$existe" = "404" ]; then echo "· «${rel}» no existe todavía (bloque B de agenda.sql sin aplicar)."; continue; fi
  pub=$(curl -s -w '\n%{http_code}' -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    "${BASE}/rest/v1/${rel}?limit=1")
  pub_code=$(echo "$pub" | tail -1); pub_body=$(echo "$pub" | sed '$d')
  if [ "$pub_code" = "200" ] && [ "$pub_body" != "[]" ]; then
    echo "✗ PELIGRO: «${rel}» DEVUELVE DATOS con la clave pública."; exit 1
  fi
  echo "✓ Con la clave pública, «${rel}» no responde (HTTP $pub_code)."
done
