#!/bin/sh
set -eu

if [ -n "${TAXONPAGES_SSR_URL:-}" ]; then
  echo "Configuring TaxonPages SSR endpoint..."
  node /usr/src/app/set-ssr-url.mjs

  echo "Rebuilding TaxonPages..."
  npm run build:ssr
fi

exec "$@"
