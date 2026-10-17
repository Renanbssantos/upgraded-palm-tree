# Phase 4 · Step 2 — Create the app with schematics

Plan: `docs/training-plan.md` → Phase 4, Step 2 · Previous: `phase4-step01` · Next: `phase4-step03`

## Commands

```bash
ng new mystore --style=scss --ssr=false --file-name-style-guide=2016
cd mystore
ng add @spartacus/schematics@221121.20.0 --baseUrl http://localhost:9002 --baseSite electronics-spa --currency usd --language en --ssr
npm start                      # with the mock running: node mocks/occ-mock/server.mjs
```

## Files

| File | Change |
| --- | --- |
| `mystore/angular.json` | in `architect.test`, delete `stylePreprocessorOptions`, `styles`, `assets` |
| `mystore/src/app/app.component.spec.ts` | delete |
| `mystore/src/styles/spartacus/*.scss` | Windows only: `..\..\styles-config` → `../../styles-config` |

Provided: Everything else in `mystore/` comes from `ng new` + `ng add`. The mock (`mocks/occ-mock`) gets what the storefront asks for.

## Done when

The home page opens at `localhost:4200` with products.

Full solution of this step: `git diff phase4-step01 phase4-step02`
