# Phase 5 · Step 9 — Upgrade exercise

Plan: `docs/training-plan.md` → Phase 5, Step 9 · Previous: `phase5-step08` · Next: `phase5-step10`

## Commands

```bash
git checkout -b upgrade
ng update @spartacus/schematics@<new-version>
npm install
npm run build && npm test
```

## Files

| File | Change |
| --- | --- |
| `mystore/README.md` | "Upgrade" section (no newer release yet on 2026-10-17) |

## Done when

Builds and tests pass on the new version, changes noted in the README.

Full solution of this step: `git diff phase5-step08 phase5-step09`
