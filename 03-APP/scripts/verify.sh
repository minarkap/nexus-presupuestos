#!/usr/bin/env bash
# Puerta de evidencia. Es lo que la fase `verify` ejecuta y lo que el
# Definition of Done de la constitución exige (constitution §DoD).
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

fallo=0
paso() {
  echo ""
  echo "──▶ $1"
  shift
  if "$@"; then
    echo "   ✓ ok"
  else
    echo "   ✗ FALLA"
    fallo=1
  fi
}

paso "Linter (constitution 12: cero avisos)"        npm run lint
paso "Comprobador de tipos (constitution 13)"        npm run typecheck
paso "Pruebas + cobertura ≥95% en src/core (14, 15)" npm run test:coverage
paso "Compilación de producción"                     npm run build
paso "Puerta SEO/GEO (constitution 32-33)"           bash scripts/seo-gate.sh

echo ""
if [ "$fallo" -eq 0 ]; then
  echo "═══ VERIFY: VERDE ═══"
else
  echo "═══ VERIFY: ROJO ═══"
fi
exit "$fallo"
