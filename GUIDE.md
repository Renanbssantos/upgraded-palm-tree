# Phase 4 · Step 5 — Replace a CMS component

Plan: `docs/training-plan.md` → Phase 4, Step 5 · Previous: `phase4-step04` · Next: `phase4-step06`

## Commands

```bash
cd mystore
ng generate component custom/custom-product-summary --type= --inline-template --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/custom-product-summary/custom-product-summary.ts` | `CurrentProductService`; exercise: "Free shipping" above 200 |
| `mystore/src/app/custom/custom.module.ts` | `CmsConfig`: `ProductSummaryComponent` → `CustomProductSummary` |

## Check (after the changes)

```bash
npm start                      # open a product page
```

## Done when

The PDP shows your summary (inspect: `app-custom-product-summary`).

Full solution of this step: `git diff phase4-step04 phase4-step05`
