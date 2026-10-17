# Phase 2 · Step 2 — linkedSignal and resource

Plan: `docs/training-plan.md` → Phase 2, Step 2 · Previous: `phase2-step01` · Next: `phase2-step03`

## Commands

```bash
cd catalog
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/product-detail/product-detail.ts` | `httpResource` and `linkedSignal`, `templateUrl` |
| `catalog/src/app/product-detail/product-detail.html` | create: loading / error / success; exercise: "Try again" with `reload()` |

## Check (after the changes)

```bash
ng serve                       # open /product/1, then /product/2
```

## Done when

The detail page shows the three states and the gallery resets when the product changes.

Full solution of this step: `git diff phase2-step01 phase2-step02`
