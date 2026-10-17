# Phase 5 · Step 7 — Testing

Plan: `docs/training-plan.md` → Phase 5, Step 7 · Previous: `phase5-step06` · Next: `phase5-step08`

## Commands

```bash
cd mystore
npm test
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/product-comparison/product-comparison.service.spec.ts` | limit, toggle, clear, persistence (`TestBed.tick()`) |
| `mystore/src/app/custom/compare-button/compare-button.spec.ts` | toggle; stretch: disabled when full |
| `mystore/src/app/custom/product-comparison/product-comparison.spec.ts` | fake `ProductService`: empty state, columns, attributes |

## Done when

`npm test` passes (18 tests).

Full solution of this step: `git diff phase5-step06 phase5-step07`
