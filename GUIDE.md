# Phase 4 · Step 10 — Custom attribute with a normalizer

Plan: `docs/training-plan.md` → Phase 4, Step 10 · Previous: `phase4-step09` · Next: `phase4-step11`

## Commands

```bash
curl "http://localhost:9002/occ/v2/electronics-spa/products/1934793?fields=DEFAULT,warrantyYears"
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/warranty.normalizer.ts` | create: `declare module` for `Product` + `WarrantyNormalizer` |
| `mystore/src/app/custom/custom.module.ts` | `PRODUCT_NORMALIZER` (`multi: true`), `details` endpoint + `warrantyYears`, `product.warranty` text |
| `mystore/src/app/custom/custom-product-summary/custom-product-summary.ts` | exercise: "Warranty: N years" |

## Done when

The summary shows the warranty and the rest of the PDP is intact.

Full solution of this step: `git diff phase4-step09 phase4-step10`
