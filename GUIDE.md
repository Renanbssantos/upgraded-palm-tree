# Phase 5 · Step 8 — SSR, accessibility and performance

Plan: `docs/training-plan.md` → Phase 5, Step 8 · Previous: `phase5-step07` · Next: `phase5-step09`

## Commands

```bash
cd mystore
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/spartacus/spartacus-configuration.module.ts` | `urlParameters: ['baseSite', 'language', 'currency']` (SSR keeps the language) |
| `mystore/README.md` | "Checks" table and technical decisions |

## Check (after the changes)

```bash
npm run build
NG_ALLOWED_HOSTS=localhost npm run serve:ssr:mystore   # open /electronics-spa/de/USD/compare
# keyboard check, Lighthouse
```

## Done when

SSR, keyboard and Lighthouse checks noted in the README.

Full solution of this step: `git diff phase5-step07 phase5-step08`
