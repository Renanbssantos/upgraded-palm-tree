# upgraded-palm-tree

Angular + SAP Commerce Composable Storefront training track. The plan lives in [docs/training-plan.md](docs/training-plan.md); the original handoff notes are in [docs/handoff.md](docs/handoff.md).

## Branches

Each branch builds on the previous one and holds the verified reference solution up to that phase.

| Branch | Contents |
| --- | --- |
| `main` | Docs only |
| `phase1` | `catalog/` after Phase 1 (TypeScript and Angular fundamentals) |
| `phase2` | `catalog/` after Phase 2 (signals, RxJS, NgRx, SSR, tests) |
| `phase3` | `mocks/occ-mock/` (mock SAP Commerce backend) and `occ-calls/commands.sh` (the Phase 3 API calls) |
| `phase4` | `mystore/`: Composable Storefront 221121.20.0 generated with `ng add @spartacus/schematics`, running against the mock |

## Verified so far

- `phase2`: `catalog/` installs, `npm test` passes (4 tests) and `npm run build` (SSR) succeeds. Needs npm 11 (`npm install -g npm@11`) and reaches the public dummyjson.com API.
- `phase3`: `cd mocks/occ-mock && npm test` passes, and `bash occ-calls/commands.sh` runs end to end against the mock.
- `phase4`: `mystore/` builds; home, product page, search, not-found page and the anonymous cart (add to cart, mini cart) work in the browser against the mock, with no console errors. SSR renders real HTML. The mock has 14 tests (Phase 3 checkpoint + what the storefront needs).

## Running the storefront (Phase 4 and 5)

The `@spartacus/*` libraries are not on the public npm registry. Here they come from a local [Verdaccio](https://verdaccio.org/) registry where the libraries were built from source (`SAP/spartacus`, branch `release/221121.20.x`) inside WSL; see `mystore/.npmrc`. In a client project, `.npmrc` points to RBSC instead (plan, Phase 4, Step 1).

```bash
# terminal 1: mock backend on http://localhost:9002
node mocks/occ-mock/server.mjs

# terminal 2: the storefront on http://localhost:4200 (Verdaccio must be running for npm install)
cd mystore && npm install && npm start
```

SSR: `npm run build`, then `NG_ALLOWED_HOSTS=localhost npm run serve:ssr:mystore` (PowerShell: `$env:NG_ALLOWED_HOSTS="localhost"; npm run serve:ssr:mystore`). Without the variable the server logs `URL with hostname "localhost" is not allowed` and silently falls back to client-side rendering, exactly as in Phase 2.

## Corrections the plan needs (found while verifying)

| Where | Problem | Fix |
| --- | --- | --- |
| Phase 4, Step 2 | `ng add @spartacus/schematics` fails on an Angular 21 app: "Could not find app.component.ts file" | `ng new mystore --style=scss --ssr=false --file-name-style-guide=2016` |
| Phase 4, Step 2 (Windows only) | The schematic writes `@import '..\..\styles-config'` in `src/styles/spartacus/*.scss`, and the build fails | Replace the backslashes with `/` (or run in WSL/macOS) |
| Phase 4, Step 11 | The storefront's SSR server also needs allowed hosts; `SSR_ALLOWED_ORIGINS` in `server.ts` is a different, optional check | Run with `NG_ALLOWED_HOSTS=localhost` |
| Phase 3, Step 7 | The storefront sends `x-anonymous-consents`; the backend must allow it in CORS | Add it to `corsfilter.commercewebservices.allowedHeaders` (and `exposedHeaders`) |
| Phase 3, Step 6 | The 221121 storefront reads CMS pages from `users/{userId}/cms/pages` | Mention both paths; the plain `cms/pages` still works for curl |
