#!/usr/bin/env bash
# Prueba de humo de Google: firma un token de servicio y lee la hoja.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "✗ Falta .env — copia .env.example y rellénalo."; exit 1; }
set -a; . ./.env; set +a

[ -n "${GOOGLE_SERVICE_ACCOUNT_JSON:-}" ] || { echo "✗ GOOGLE_SERVICE_ACCOUNT_JSON vacía"; exit 1; }
[ -n "${GOOGLE_SHEET_ID:-}" ]             || { echo "✗ GOOGLE_SHEET_ID vacía"; exit 1; }

node --input-type=module -e '
import { createSign } from "node:crypto"
const acc = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
const now = Math.floor(Date.now() / 1000)
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url")
const unsigned = b64({ alg: "RS256", typ: "JWT" }) + "." + b64({
  iss: acc.client_email,
  scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
  aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now,
})
const sig = createSign("RSA-SHA256").update(unsigned).sign(acc.private_key, "base64url")
const tok = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: unsigned + "." + sig,
  }),
})
if (!tok.ok) { console.error("✗ Google rechaza la cuenta de servicio (HTTP " + tok.status + ")"); process.exit(1) }
const { access_token } = await tok.json()
const res = await fetch(
  "https://sheets.googleapis.com/v4/spreadsheets/" + process.env.GOOGLE_SHEET_ID,
  { headers: { Authorization: "Bearer " + access_token } },
)
if (res.status === 403) {
  console.error("✗ 403: la hoja NO está compartida con " + acc.client_email)
  process.exit(1)
}
if (!res.ok) { console.error("✗ Sheets respondió HTTP " + res.status); process.exit(1) }
const sheet = await res.json()
console.log("✓ Google responde. Hoja accesible: " + sheet.properties.title)
'
