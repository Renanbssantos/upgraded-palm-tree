# Phase 1 · Step 4 — Standalone components and signals

Plan: `docs/training-plan.md` → Phase 1, Step 4 · Previous: `phase1-step03` · Next: `phase1-step05`

## Commands

```bash
cd catalog
ng generate component product-card --inline-template --inline-style
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/product-card/product-card.ts` | `input()`, `computed()`; exercise: `discount` input and `finalPrice` |
| `catalog/src/app/app.ts` | add `ProductCard` to `imports` |
| `catalog/src/app/app.html` | replace the sample content with `<app-product-card ... />` |

## Check (after the changes)

```bash
ng serve
```

## Done when

The card shows name, price and discounted price coming from the parent.

Full solution of this step: `git diff phase1-step03 phase1-step04`
