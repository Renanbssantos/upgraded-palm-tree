# Phase 2 · Step 6 — @defer and zoneless change detection

Plan: `docs/training-plan.md` → Phase 2, Step 6 · Previous: `phase2-step05` · Next: `phase2-step07`

## Commands

```bash
cd catalog
ng generate component product-reviews --inline-template --inline-style --skip-tests
ng generate component experiment --inline-template --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/product-detail/product-detail.html` | tall spacer + `@defer (on viewport)` with placeholder / loading / error |
| `catalog/src/app/product-detail/product-detail.ts` | import `ProductReviews` |
| `catalog/src/app/product-reviews/product-reviews.ts` | minimal component with a `productId` input |
| `catalog/src/app/experiment/experiment.ts` | plain counter vs signal counter |
| `catalog/src/app/app.routes.ts` | route `experiment` |

## Check (after the changes)

```bash
ng serve --no-hmr               # without HMR, so @defer creates its own chunk
```

## Done when

A new `chunk-*.js` loads when you scroll; "Plain" stays at 0 until the signal changes.

Full solution of this step: `git diff phase2-step05 phase2-step06`
