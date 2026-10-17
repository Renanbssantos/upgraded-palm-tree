# Phase 5 · Step 4 — "Compare" button through an outlet

Plan: `docs/training-plan.md` → Phase 5, Step 4 · Previous: `phase5-step03` · Next: `phase5-step05`

## Commands

```bash
cd mystore
ng generate component custom/compare-button --type= --inline-template --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/compare-button/compare-button.ts` | toggle button; stretch: reason when the list is full |
| `mystore/src/app/app.component.html` | outlet `ProductAddToCartComponent`, `OutletPosition.AFTER` |
| `mystore/src/app/app.component.ts` | import `CompareButton` |
| `mystore/src/app/custom/custom.module.ts` | chunk `compare`: `add`, `remove`, `limit`, `empty`, `badge` (en / de) |
| `mystore/src/styles.scss` | `.compare-button`, `.compare-limit` |

Provided: The mock gets a 5th product to try the limit.

## Check (after the changes)

```bash
npm start                      # open a product page, click Compare
```

## Done when

The button toggles and is disabled with 4 other products in the list.

Full solution of this step: `git diff phase5-step03 phase5-step04`
