# Phase 1 · Step 6 — Services, dependency injection and HTTP

Plan: `docs/training-plan.md` → Phase 1, Step 6 · Previous: `phase1-step05` · Next: `phase1-step07`

## Commands

```bash
cd catalog
ng generate service product --type=service
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/product.model.ts` | create the `Product` interface |
| `catalog/src/app/product.service.ts` | `list()`; exercise: `byId(id)` |
| `catalog/src/app/app.config.ts` | add `provideHttpClient()` |
| `catalog/src/app/product-list/product-list.ts` | replace the test data with `toSignal(service.list()...)` |

## Done when

The list shows real products from dummyjson.com.

Full solution of this step: `git diff phase1-step05 phase1-step06`
