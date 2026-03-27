#!/usr/bin/env bash
set -euo pipefail

DEPLOYPATH="${1:-${DEPLOYPATH:-/home/kandhavi/public_html}}"

find_npm() {
  if command -v npm >/dev/null 2>&1; then
    command -v npm
    return 0
  fi

  for candidate in \
    /opt/cpanel/ea-nodejs22/bin/npm \
    /opt/cpanel/ea-nodejs20/bin/npm \
    /opt/cpanel/ea-nodejs18/bin/npm \
    /opt/cpanel/ea-nodejs16/bin/npm
  do
    if [ -x "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

NPM_BIN="$(find_npm)" || {
  echo "No se ha encontrado npm en el servidor. Instala Node.js en cPanel o ajusta este script." >&2
  exit 1
}

echo "Deploy path: $DEPLOYPATH"
echo "Using npm: $NPM_BIN"

mkdir -p "$DEPLOYPATH"

"$NPM_BIN" ci --no-audit --no-fund
"$NPM_BIN" run build

/bin/cp -R dist/. "$DEPLOYPATH"/

echo "Despliegue completado en $DEPLOYPATH"
