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
| `phase4` | `mystore/`: Composable Storefront 221121.20.0 generated with `ng add @spartacus/schematics`, running against the mock, with the solution of every Phase 4 step (see below) |

## Verified so far

- `phase2`: `catalog/` installs, `npm test` passes (4 tests) and `npm run build` (SSR) succeeds. Needs npm 11 (`npm install -g npm@11`) and reaches the public dummyjson.com API.
- `phase3`: `cd mocks/occ-mock && npm test` passes, and `bash occ-calls/commands.sh` runs end to end against the mock.
- `phase4`: `mystore/` builds and `npm test` passes (6 tests). Home, product page, search, not-found page and the anonymous cart work in the browser against the mock with no console errors, and every Phase 4 exercise was checked in the browser: custom summary with badge and warranty, outlets, slot order on desktop / tablet / phone, theme variables, English and German texts, SSR HTML with the custom summary, and adding to the cart with the keyboard only. The mock has 16 tests. Lighthouse was not run (do it in Chrome DevTools, Step 12).

## Phase 4 reference solution (`mystore/`)

| Step | Where |
| --- | --- |
| 3 — configuration | `src/app/spartacus/spartacus-configuration.module.ts`: German added (`['en', 'de']`, German texts from `@spartacus/assets`); the exercise answer `['de', 'en']` is in a comment |
| 4 — facade + signals | `src/app/custom/cart-badge/cart-badge.ts` (item count and formatted total) |
| 5 — CMS component | `src/app/custom/custom-product-summary/custom-product-summary.ts`, mapped in `src/app/custom/custom.module.ts` |
| 6 — outlets | `src/app/app.component.html` (message after add to cart, badge after the mini cart) |
| 7 — layout | `custom.module.ts`, `LayoutConfig` (`lg`, `md`, `xs`) |
| 8 — theme | end of `src/styles.scss` (`--cx-color-primary`, `--cx-color-text`, font) |
| 9 — i18n | `custom.module.ts`, `I18nConfig` (`en` and `de`, chunk `custom`) |
| 10 — normalizer | `src/app/custom/warranty.normalizer.ts` + endpoint in `custom.module.ts`; the mock sends `warrantyYears` for products 1934793 and 872912 only when it is requested by name |
| 11 — SSR | `src/server.ts` (`timeout`, `cache`) |
| 12 — a11y | the custom elements add no focus traps; focus order checked up to "Add to cart" |
| tests | `*.spec.ts` next to each custom file (facade and `CurrentProductService` replaced by fakes, `MockTranslatePipe` for texts) |

Good to know: restarting the mock forgets its in-memory carts, so the storefront shows "Cart not found." once and starts a new cart (the same thing a real backend does with a stale cart id).

## Running the storefront (Phase 4 and 5)

The `@spartacus/*` libraries are not on the public npm registry. Here they come from a local [Verdaccio](https://verdaccio.org/) registry where the libraries were built from source (`SAP/spartacus`, branch `release/221121.20.x`) inside WSL; see `mystore/.npmrc`. In a client project, `.npmrc` points to RBSC instead (plan, Phase 4, Step 1).

```bash
# terminal 1: mock backend on http://localhost:9002
node mocks/occ-mock/server.mjs

# terminal 2: the storefront on http://localhost:4200 (Verdaccio must be running for npm install)
cd mystore && npm install && npm start
```

SSR: `npm run build`, then `NG_ALLOWED_HOSTS=localhost npm run serve:ssr:mystore` (PowerShell: `$env:NG_ALLOWED_HOSTS="localhost"; npm run serve:ssr:mystore`). Without the variable the server logs `URL with hostname "localhost" is not allowed` and silently falls back to client-side rendering, exactly as in Phase 2.

## Corrections found while verifying (applied to `docs/training-plan.md` on October 16, 2026)

| Where | Problem | Fix |
| --- | --- | --- |
| Phase 4, Step 2 | `ng add @spartacus/schematics` fails on an Angular 21 app: "Could not find app.component.ts file" | `ng new mystore --style=scss --ssr=false --file-name-style-guide=2016` |
| Phase 4, Step 2 (Windows only) | The schematic writes `@import '..\..\styles-config'` in `src/styles/spartacus/*.scss`, and the build fails | Replace the backslashes with `/` (or run in WSL/macOS) |
| Phase 4, Step 2 | `ng add` writes Karma options (`stylePreprocessorOptions`, `styles`, `assets`) into the `test` target, which in Angular 21 is the Vitest builder: `ng test` fails with "must NOT have additional properties" | Remove those options from `architect.test` in `angular.json`; also delete the generated `app.component.spec.ts` (it looks for an `<h1>`) |
| Phase 4, Step 6 | `cxOutletPos="after"` does not compile: the generated app uses `strictTemplates` and the input is the `OutletPosition` enum | Expose the enum in the component (`OutletPosition = OutletPosition`) and bind `[cxOutletPos]="OutletPosition.AFTER"`; in a standalone root, import `OutletRefDirective` |
| Phase 4, Step 7 | The exercise answer (only an `xs` rule) also hides CrossSelling on tablets: a breakpoint without its own rule uses the closest smaller one (`xs`), not the default | Add an `md` rule with the full slot list |
| Phase 4, Step 9 | The feature modules generated by `ng add` only register English texts, so after switching to German some labels (e.g. "Sign In / Register") stay in English | Mention it; add the `...TranslationsDe` resources in each feature module if a full German site is needed |
| Phase 4, Step 11 | The storefront's SSR server also needs allowed hosts; `SSR_ALLOWED_ORIGINS` in `server.ts` is a different, optional check | Run with `NG_ALLOWED_HOSTS=localhost` |
| Phase 3, Step 7 | The storefront sends `x-anonymous-consents`; the backend must allow it in CORS | Add it to `corsfilter.commercewebservices.allowedHeaders` (and `exposedHeaders`) |
| Phase 3, Step 6 | The 221121 storefront reads CMS pages from `users/{userId}/cms/pages` | Mention both paths; the plain `cms/pages` still works for curl |
