# Phase 1 · Step 5 — Templates and control flow

Plan: `docs/training-plan.md` → Phase 1, Step 5 · Previous: `phase1-step04` · Next: `phase1-step06`

## Commands

```bash
cd catalog
ng generate component product-list
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/product-list/product-list.ts` | test data in a signal, `term` and `filtered` |
| `catalog/src/app/product-list/product-list.html` | search input, `@for` / `@empty`; exercise: stock badges with `@if` |
| `catalog/src/app/app.ts` | import `ProductList` |
| `catalog/src/app/app.html` | `<app-product-list />` |

## Done when

Search filters as you type and the empty message shows when nothing matches.

Full solution of this step: `git diff phase1-step04 phase1-step05`
