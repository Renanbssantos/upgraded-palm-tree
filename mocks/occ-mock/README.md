# occ-mock

A zero-dependency Node 22 server that imitates the parts of SAP Commerce (OCC v2 and the OAuth authorization server) that the training plan uses. It replaces the real backend until you have access to one.

```bash
cd mocks/occ-mock
npm start        # http://localhost:9002
npm test         # Phase 3 checkpoint (7 tests) + what the storefront needs (7 tests)
```

Every request is logged as `<status> <method> <url>`; a `404 ... No handler` line means the storefront asked for something the mock does not have yet. Set `QUIET=1` to turn the log off.

| URL | Behaves like |
| --- | --- |
| `GET /occ/v2/basesites` | Base sites, with stores, languages (`en`, `de`) and currencies (`USD`, `JPY`) |
| `GET /occ/v2/electronics-spa/products/search` and `/products/{code}` | Search and detail, with `fields=BASIC\|DEFAULT\|FULL` or a projection like `code,price(formattedValue)` |
| `POST /authorizationserver/oauth/token` | Password grant with `mobile_android` / `secret`, user `customer@example.com` (the mock's seed customer, see `data.mjs`) |
| `GET /occ/v2/electronics-spa/users/current` | 401 without a valid Bearer token |
| `/users/anonymous/carts[...]` | Create, add, change (`PATCH`) and remove (`DELETE`) entries; totals computed by the server |
| `GET /occ/v2/electronics-spa/[users/{userId}/]cms/pages` | Home (`LandingPage2Template`), product page (`ProductDetailsPageTemplate`, for `pageType=ProductPage&code=...`), search and `/not-found`. Header and footer slots are shared by every page |
| `GET .../cms/components?componentIds=...` | Components referenced by navigation nodes and tab containers |
| `GET .../languages`, `.../currencies`, `.../products/suggestions`, `.../products/{code}/reviews` | What the header, search box and product tabs ask for |
| `GET .../products/{code}/references` | SIMILAR (UpSelling slot) and ACCESSORIES (CrossSelling slot) references |
| `fields=DEFAULT,warrantyYears` | `DEFAULT` is a fixed set of fields; anything else, like the custom attribute `warrantyYears` (Phase 4, Step 10), only comes back when requested by name |
| `GET /medias/<name>` | A generated SVG placeholder showing `<name>` (any extension) |
| CORS | Only `http://localhost:4200` and `https://localhost:4200` (override with `ALLOWED_ORIGINS`), with the storefront headers (`x-anonymous-consents`...) allowed |

The content catalog lives in `data.mjs`: `cmsComponents` (uid → component), `sharedSlots` (header and footer) and `cmsPages` (slot → component uids). To try a CMS mapping in Phase 4 or 5, add a component there and reference it from a page.

**Staged versus Online.** Edits made through the mock-only admin endpoints land in a Staged copy and reach the API only after a sync:

```bash
curl -X PATCH localhost:9002/mock/admin/products/300938 -H "Content-Type: application/json" -d '{"name":"New name"}'
curl localhost:9002/occ/v2/electronics-spa/products/300938?fields=name      # still the old name
curl -X POST localhost:9002/mock/admin/sync -H "Content-Type: application/json" -d '{"catalog":"product"}'   # or "content" / "both"
```

**Not mocked yet:** category pages, checkout, orders, addresses, search facets, logged-in storefront login (the authorization-code flow). They are added when a later step needs them.
