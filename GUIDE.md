# Phase 2 · Step 1 — signal, computed and effect

Plan: `docs/training-plan.md` → Phase 2, Step 1 · Previous: `phase1-step07` · Next: `phase2-step02`

## Commands

```bash
cd catalog
ng generate component cart --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/cart/cart.ts` | `items`, `total`, `effect`; exercise: `itemCount` and `increment()` |
| `catalog/src/app/app.ts` | import `Cart` |
| `catalog/src/app/app.html` | `<app-cart />` above `<router-outlet />` |

## Done when

Total and count update on their own and the console logs every new total.

Full solution of this step: `git diff phase1-step07 phase2-step01`
