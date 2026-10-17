# Phase 5 · Step 2 — Create the page and the component in the CMS

Plan: `docs/training-plan.md` → Phase 5, Step 2 · Previous: `phase5-step01` · Next: `phase5-step03`

## Commands

```bash
curl "http://localhost:9002/occ/v2/electronics-spa/cms/pages?pageType=ContentPage&pageLabelOrId=/compare"
```

## Files

| File | Change |
| --- | --- |
| `mystore/cms/product-comparison.impex` | the `CMSFlexComponent` (flexType `ProductComparisonComponent`) for a real backend |

Provided: The mock already has the `/compare` page and more product attributes (`mocks/occ-mock/data.mjs`).

## Done when

The API returns `/compare` with the `CMSFlexComponent`.

Full solution of this step: `git diff phase5-step01 phase5-step02`
