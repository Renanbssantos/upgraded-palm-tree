# Phase 4 · Step 11 — Storefront SSR

Plan: `docs/training-plan.md` → Phase 4, Step 11 · Previous: `phase4-step10` · Next: `phase4-step12`

## Commands

```bash
cd mystore
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/server.ts` | `NgExpressEngineDecorator.get(engine, { timeout: 3000, cache: false })` |

## Check (after the changes)

```bash
npm run build
NG_ALLOWED_HOSTS=localhost npm run serve:ssr:mystore   # http://localhost:4000
```

## Done when

"View page source" on the PDP contains the product and your summary.

Full solution of this step: `git diff phase4-step10 phase4-step11`
