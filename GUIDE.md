# Phase 5 · Step 3 — State service with signals

Plan: `docs/training-plan.md` → Phase 5, Step 3 · Previous: `phase5-step02` · Next: `phase5-step04`

## Commands

```bash
cd mystore
ng generate service custom/product-comparison/product-comparison --type=service --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/product-comparison/product-comparison.service.ts` | `codes`, `count`, `isFull`, `toggle`, `localStorage` via `effect`; stretch: `clear()`, `lastAdded` |

## Done when

The list survives a reload (DevTools → Local Storage → `compare`).

Full solution of this step: `git diff phase5-step02 phase5-step03`
