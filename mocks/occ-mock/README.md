# occ-mock

A zero-dependency Node 22 server that imitates the parts of SAP Commerce (OCC v2 and the OAuth authorization server) that the training plan uses. It replaces the real backend until you have access to one.

```bash
cd mocks/occ-mock
npm start        # http://localhost:9002
npm test         # walks through the Phase 3 checkpoint (7 tests)
```

| URL | Behaves like |
| --- | --- |
| `GET /occ/v2/basesites` | Base sites, with stores, languages (`en`, `de`) and currencies (`USD`, `JPY`) |
| `GET /occ/v2/electronics-spa/products/search` and `/products/{code}` | Search and detail, with `fields=BASIC\|DEFAULT\|FULL` or a projection like `code,price(formattedValue)` |
| `POST /authorizationserver/oauth/token` | Password grant with `mobile_android` / `secret`, user `customer@example.com` (the mock's seed customer, see `data.mjs`) |
| `GET /occ/v2/electronics-spa/users/current` | 401 without a valid Bearer token |
| `/users/anonymous/carts[...]` | Create, add, change (`PATCH`) and remove (`DELETE`) entries; totals computed by the server |
| `GET /occ/v2/electronics-spa/cms/pages` | Home page: template `LandingPage2Template`, slots, components with `typeCode` |
| CORS | Only `http://localhost:4200` and `https://localhost:4200` (override with `ALLOWED_ORIGINS`) |

**Staged versus Online.** Edits made through the mock-only admin endpoints land in a Staged copy and reach the API only after a sync:

```bash
curl -X PATCH localhost:9002/mock/admin/products/300938 -H "Content-Type: application/json" -d '{"name":"New name"}'
curl localhost:9002/occ/v2/electronics-spa/products/300938?fields=name      # still the old name
curl -X POST localhost:9002/mock/admin/sync -H "Content-Type: application/json" -d '{"catalog":"product"}'   # or "content" / "both"
```

**Not mocked yet:** checkout, orders, addresses, search facets, the authorization-code flow. They are added when a later phase needs them.
