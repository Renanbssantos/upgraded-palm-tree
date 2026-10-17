# Phase 4 · Step 12 — Accessibility and performance

Plan: `docs/training-plan.md` → Phase 4, Step 12 · Previous: `phase4-step11` · Next: `phase5-step01`

## Commands

```bash
cd mystore
npm test
# keyboard only: Tab to "Add to cart", Enter; Lighthouse in Chrome DevTools
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/cart-badge/cart-badge.spec.ts` | create: fake `ActiveCartFacade` |
| `mystore/src/app/custom/custom-product-summary/custom-product-summary.spec.ts` | create: fake `CurrentProductService` |
| `mystore/src/app/custom/warranty.normalizer.spec.ts` | create |

## Done when

A purchase works with the keyboard only and `npm test` passes (6 tests).

Full solution of this step: `git diff phase4-step11 phase4-step12`
