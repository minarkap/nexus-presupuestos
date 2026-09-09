#!/usr/bin/env bash
# Compila, arranca el servidor de producción en un puerto libre, ejecuta la puerta SEO/GEO y apaga.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
PORT="${SEO_GATE_PORT:-3100}"
npm run build >/dev/null
npx next start -p "$PORT" >/tmp/seo-gate-server.log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do curl -sf "http://localhost:$PORT/robots.txt" >/dev/null 2>&1 && break; sleep 0.5; done
BASE_URL="http://localhost:$PORT" node scripts/seo-gate.mjs
