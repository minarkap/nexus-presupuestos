#!/usr/bin/env bash
# Copia fechada de 03-APP/. Sustituye al historial de git, ausente por constitution 18.
# Uso: bash scripts/snapshot.sh [etiqueta]
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$(dirname "$APP_DIR")"
LABEL="${1:-manual}"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="$WORKSPACE/.rsc/backups/03-APP-$STAMP-$LABEL"

mkdir -p "$DEST"
rsync -a --exclude node_modules --exclude .next --exclude coverage "$APP_DIR/" "$DEST/"

echo "snapshot -> $DEST"
