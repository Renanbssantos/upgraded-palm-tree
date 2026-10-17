# Phase 4 · Step 4 — Use facades with signals

Plan: `docs/training-plan.md` → Phase 4, Step 4 · Previous: `phase4-step03` · Next: `phase4-step05`

## Commands

```bash
cd mystore
ng generate component custom/cart-badge --type= --inline-template --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/custom.module.ts` | create the empty `CustomModule` |
| `mystore/src/app/app.module.ts` | add `CustomModule` to `imports` |
| `mystore/src/app/custom/cart-badge/cart-badge.ts` | `ActiveCartFacade` + `toSignal`; exercise: formatted total |
| `mystore/src/app/app.component.ts` | import `CartBadge` |
| `mystore/src/app/app.component.html` | temporary `<app-cart-badge />` above `<cx-storefront />` |

## Check (after the changes)

```bash
npm start                      # add a product to the cart
```

## Done when

The badge shows the real item count and total after adding to the cart.

Full solution of this step: `git diff phase4-step03 phase4-step04`
