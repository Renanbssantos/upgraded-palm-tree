# Phase 4 · Step 1 — Library access (RBSC or local registry)

Plan: `docs/training-plan.md` → Phase 4, Step 1 · Previous: `phase3-step07` · Next: `phase4-step02`

## Commands

```bash
mkdir mystore
# write mystore/.npmrc (see Files)
```

## Files

| File | Change |
| --- | --- |
| `mystore/.npmrc` | `@spartacus:registry=...` (here the local Verdaccio; in a client project, RBSC with its credential) |

## Check (after the changes)

```bash
cd mystore && npm view @spartacus/core versions
```

## Done when

`npm view @spartacus/core versions` lists 221121.x versions.

Full solution of this step: `git diff phase3-step07 phase4-step01`
