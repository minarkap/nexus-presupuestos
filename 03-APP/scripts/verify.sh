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
paso "Puerta de secretos (constitution 8, 21 · CA-S5)" node scripts/secret-gate.mjs
# Verifica los PRECIOS contra la base de datos, que es donde ahora viven y donde pueden cambiar sin
# que nadie toque el código. Las pruebas de arriba verifican el MÉTODO contra la semilla; esto es lo
# único que vería un precio movido. No se salta si faltan credenciales, a propósito (CA-15).
paso "Puerta del catálogo vivo (constitution 15, 16 · CA-15/16/19)" node scripts/catalog-gate.ts

echo ""
if [ "$fallo" -eq 0 ]; then
  echo "═══ VERIFY: VERDE ═══"
else
  echo "═══ VERIFY: ROJO ═══"
fi
exit "$fallo"
