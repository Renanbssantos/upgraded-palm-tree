# Phase 4 · Step 9 — Translations (i18n)

Plan: `docs/training-plan.md` → Phase 4, Step 9 · Previous: `phase4-step08` · Next: `phase4-step10`

## Commands

```bash
cd mystore && npm start
# switch to German in the header
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/custom.module.ts` | `I18nConfig`: `en` / `de` texts in chunk `custom` (`shipping`, `cartBadge`) |
| `mystore/src/app/app.component.html` | shipping message through `cxTranslate` |
| `mystore/src/app/app.component.ts` | import `I18nModule` |
| `mystore/src/app/custom/cart-badge/cart-badge.ts` | `'cartBadge.items' | cxTranslate: { count }` |
| `mystore/src/app/custom/custom-product-summary/custom-product-summary.ts` | badge through `cxTranslate` |

## Done when

Every text of this phase changes with the language.

Full solution of this step: `git diff phase4-step08 phase4-step09`
