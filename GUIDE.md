# Phase 2 · Step 3 — input, output, model and viewChild

Plan: `docs/training-plan.md` → Phase 2, Step 3 · Previous: `phase2-step02` · Next: `phase2-step04`

## Commands

```bash
cd catalog
ng generate component qty-selector --inline-template --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/qty-selector/qty-selector.ts` | `model`, `input`, `output`, `viewChild`; exercise: focus on limit |
| `catalog/src/app/product-detail/product-detail.ts` | `quantity` and `limit` signals, import `QtySelector` |
| `catalog/src/app/product-detail/product-detail.html` | `[(qty)]`, `(limitReached)` and the limit message |

## Check (after the changes)

```bash
ng serve
```

## Done when

`[(qty)]` works and the parent shows "Limit of N units".

Full solution of this step: `git diff phase2-step02 phase2-step03`
