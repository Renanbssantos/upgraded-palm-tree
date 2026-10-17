# Phase 2 · Step 9 — Testing

Plan: `docs/training-plan.md` → Phase 2, Step 9 · Previous: `phase2-step08` · Next: `phase3-step01`

## Commands

```bash
cd catalog
ng test --watch=false
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/cart/cart.spec.ts` | create: total, and `removeItem` in the reducer (with `provideStore`) |
| `catalog/src/app/qty-selector/qty-selector.spec.ts` | create: stops at `max` |
| `catalog/src/app/product.service.spec.ts` | `HttpTestingController` instead of "should be created" |
| `catalog/src/app/*.spec.ts (generated)` | delete `app.spec.ts`, `product-card`, `product-list`, `product-detail` specs |

## Done when

`ng test` passes (4 tests).

Full solution of this step: `git diff phase2-step08 phase2-step09`
