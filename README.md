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
| `phase5` | `mystore/` with the final project (product comparison); spec, decisions and checks in [mystore/README.md](mystore/README.md) |
| `phase5-step01` … `phase5-step10` | The final project step by step: each branch is the state at the end of that step and builds on the previous one (`phase5` = `phase5-step10`) |

### One branch per step

Every step of every phase has its own branch, `phaseN-stepNN`, with the state at the end of that step (exercise solution included). Each one builds on the previous step, and the first step of a phase builds on the last step of the previous phase, so `git diff phase2-step04 phase2-step05` shows exactly what Step 5 of Phase 2 adds.

| Phase | Branches | Last step = |
| --- | --- | --- |
| 1 | `phase1-step01` … `phase1-step07` | `phase1` (same files) |
| 2 | `phase2-step01` … `phase2-step09` | `phase2` |
| 3 | `phase3-step01` … `phase3-step07` | `phase3` |
| 4 | `phase4-step01` … `phase4-step12` | `phase4` |
| 5 | `phase5-step01` … `phase5-step10` | `phase5` |

Steps with nothing to commit are empty commits that say where the work happens: Phase 1 Steps 1–2 (machine setup, TypeScript Playground) and Phase 3 Step 2 (Backoffice, or the mock's admin endpoints). Verified on 2026-10-17: every step with Angular code builds (`ng build`); Phase 2 Step 9, Phase 4 Step 12 and Phase 5 Steps 7+ also pass `npm test`; every Phase 3 step runs its `occ-calls/commands.sh` end to end against the mock. In Phase 4, Steps 2–11 have no specs yet, so `ng test` reports "No tests found" there.

## Verified so far

- `phase2`: `catalog/` installs, `npm test` passes (4 tests) and `npm run build` (SSR) succeeds. Needs npm 11 (`npm install -g npm@11`) and reaches the public dummyjson.com API.
- `phase3`: `cd mocks/occ-mock && npm test` passes, and `bash occ-calls/commands.sh` runs end to end against the mock.
- `phase4`: `mystore/` builds and `npm test` passes (6 tests). Home, product page, search, not-found page and the anonymous cart work in the browser against the mock with no console errors, and every Phase 4 exercise was checked in the browser: custom summary with badge and warranty, outlets, slot order on desktop / tablet / phone, theme variables, English and German texts, SSR HTML with the custom summary, and adding to the cart with the keyboard only. The mock has 16 tests. Lighthouse was not run (do it in Chrome DevTools, Step 12).
- `phase5`: `npm test` passes (18 tests) and the mock has 17. Checked in the browser, also on the production SSR build: Compare button and its limit, badge on every page, `/compare` from the CMS with aligned attributes, English and German, no hydration errors, keyboard only. The upgrade step could not be done: no release newer than 221121.20.0 exists yet.

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

## Phase 5 findings (not yet applied to the plan)

| Where | Problem | Fix |
| --- | --- | --- |
| Phase 5, Step 4 | The outlet snippet still uses `cxOutletPos="after"`, which does not compile with strict templates | `[cxOutletPos]="OutletPosition.AFTER"`, as already fixed in Phase 4, Step 6 |
| Phase 4, Step 3 and Phase 5, Steps 5 and 8 | With SSR, switching language reloads the page (feature toggle `reloadOnLanguageChange`) and, without the context in the URL, the server renders the default language again: German is lost on the production build. The `/electronics-spa/en/USD/compare` URL in Step 5 also only exists with `urlParameters` | Recommend `urlParameters: ['baseSite', 'language', 'currency']` in Phase 4, Step 3 (not just "if you want to see it in the URL") |
| Phase 5, Step 6 | The `SiteLinks` outlet only renders if the CMS page has a `SiteLinks` slot (the electronics-spa sample data has it); without it the badge silently does not appear | Mention it; inspect the header slots and pick one that exists in your content |
| Phase 5, Step 7 | Testing that the effect saved the list needs `TestBed.tick()` before reading `localStorage` | Add it to the example |
| Phase 5, Step 3 | Checked: reading `localStorage` while building the service causes no hydration error (the server renders the empty list and the browser fills it in) | No change needed |
