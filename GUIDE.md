# Phase 4 · Step 6 — Outlets

Plan: `docs/training-plan.md` → Phase 4, Step 6 · Previous: `phase4-step05` · Next: `phase4-step07`

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/app.component.ts` | import `OutletRefDirective`, expose `OutletPosition` |
| `mystore/src/app/app.component.html` | remove the temporary badge; `ng-template`s with `[cxOutletPos]="OutletPosition.AFTER"` on `ProductAddToCartComponent` and `MiniCartComponent` |

## Check (after the changes)

```bash
cd mystore && npm start
```

## Done when

The shipping message shows after the button and the badge next to the mini cart.

Full solution of this step: `git diff phase4-step05 phase4-step06`
