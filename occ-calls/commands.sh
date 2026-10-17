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
CODE=$(curl -sk "$BASE/products/search?query=camera&fields=products(code)" | grep -o '"code":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "product code: $CODE"
for f in BASIC DEFAULT FULL; do printf '%-8s %s bytes\n' "$f" "$(curl -sk "$BASE/products/$CODE?fields=$f" | wc -c)"; done
curl -sk "$BASE/products/$CODE?fields=code,name,price(formattedValue)" | json

step "Step 4: OAuth2 password grant, then a protected call"
TOKEN=$(curl -sk -X POST "$HOST/authorizationserver/oauth/token" \
  -d "client_id=mobile_android&client_secret=secret" \
  -d "grant_type=password&username=$USER_EMAIL&password=$USER_PASS" | sed -E 's/.*"access_token":"([^"]+)".*/\1/')
curl -sk -H "Authorization: Bearer $TOKEN" "$BASE/users/current" | json
echo "no header     -> HTTP $(curl -sk -o /dev/null -w '%{http_code}' "$BASE/users/current")"
echo "invalid token -> HTTP $(curl -sk -o /dev/null -w '%{http_code}' -H 'Authorization: Bearer nope' "$BASE/users/current")"

step "Step 5: anonymous cart (create, add, view, change quantity, remove)"
GUID=$(curl -sk -X POST "$BASE/users/anonymous/carts" | sed -E 's/.*"guid":"([^"]+)".*/\1/')
echo "guid: $GUID"
curl -sk -X POST "$BASE/users/anonymous/carts/$GUID/entries" -H "Content-Type: application/json" \
  -d "{\"product\": {\"code\": \"$CODE\"}, \"quantity\": 1}" | json
curl -sk "$BASE/users/anonymous/carts/$GUID?fields=FULL" | json
curl -sk -X PATCH "$BASE/users/anonymous/carts/$GUID/entries/0" -H "Content-Type: application/json" -d '{"quantity": 3}' | json
curl -sk -X DELETE "$BASE/users/anonymous/carts/$GUID/entries/0" -o /dev/null -w 'DELETE -> HTTP %{http_code}\n'

step "Step 6: CMS page (look for template, position, typeCode)"
curl -sk "$BASE/cms/pages?pageType=ContentPage&pageLabelOrId=homepage" | json
