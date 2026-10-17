# Phase 4 · Step 3 — Read the generated configuration

Plan: `docs/training-plan.md` → Phase 4, Step 3 · Previous: `phase4-step02` · Next: `phase4-step04`

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/spartacus/spartacus-configuration.module.ts` | `language: ['en', 'de']` and `de: translationsDe` in the i18n resources (exercise: `['de', 'en']`) |

## Check (after the changes)

```bash
cd mystore && npm start
```

## Done when

German shows in the language selector and the storefront texts change.

Full solution of this step: `git diff phase4-step02 phase4-step03`
