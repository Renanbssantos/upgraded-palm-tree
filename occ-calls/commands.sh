#!/usr/bin/env bash
# Phase 3 reference: every OCC call from the plan, runnable end to end.
#   Mock backend:  cd mocks/occ-mock && npm start      (then, in another terminal)  bash occ-calls/commands.sh
#   Real backend:  HOST=https://<host> bash occ-calls/commands.sh   (needs a real test customer, see USER/PASS)
set -euo pipefail

HOST=${HOST:-http://localhost:9002}
SITE=${SITE:-electronics-spa}
USER_EMAIL=${USER_EMAIL:-customer@example.com}
USER_PASS=${USER_PASS:-Test1234!}
BASE=$HOST/occ/v2/$SITE
json() { if [ -n "${PRETTY:-}" ]; then npx --yes json; else cat; echo; fi; }  # PRETTY=1 for indented output
step() { printf '\n== %s\n' "$*"; }

step "Step 1: base sites (look for uid, languages, currencies)"
curl -sk "$HOST/occ/v2/basesites" | json

step "Step 3: search, detail (3 sizes), field projection"
curl -sk "$BASE/products/search?query=camera&fields=DEFAULT" | json
CODE=$(curl -sk "$BASE/products/search?query=camera&fields=BASIC" | sed -E 's/.*"code":"([^"]+)".*/\1/')
echo "product code: $CODE"
for f in BASIC DEFAULT FULL; do printf '%-8s %s bytes\n' "$f" "$(curl -sk "$BASE/products/$CODE?fields=$f" | wc -c)"; done
curl -sk "$BASE/products/$CODE?fields=code,name,price(formattedValue)" | json

