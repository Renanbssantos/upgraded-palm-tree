# Phase 5 · Step 5 — Comparison page with a facade, RxJS and signals

Plan: `docs/training-plan.md` → Phase 5, Step 5 · Previous: `phase5-step04` · Next: `phase5-step06`

## Commands

```bash
cd mystore
ng generate component custom/product-comparison --skip-tests
# open http://localhost:4200/compare
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/product-comparison/product-comparison.ts` | `ProductService.get(code, [DETAILS, ATTRIBUTES])` + `combineLatest`; stretch: attribute rows |
| `mystore/src/app/custom/custom.module.ts` | `ProductComparisonComponent` mapping + table texts |
| `mystore/src/styles.scss` | table styles |

## Done when

`/compare` shows name, price and at least 3 aligned attributes.

Full solution of this step: `git diff phase5-step04 phase5-step05`
