# Phase 3 · Step 1 — Get access to a backend

Plan: `docs/training-plan.md` → Phase 3, Step 1 · Previous: `phase2-step09` · Next: `phase3-step02`

## Commands

```bash
cd mocks/occ-mock && npm start          # mock backend on http://localhost:9002 (or use your real backend)
curl http://localhost:9002/occ/v2/basesites
```

## Files

| File | Change |
| --- | --- |
| `occ-calls/commands.sh` | create: variables and the base sites call |

Provided: `mocks/occ-mock/` (mock SAP Commerce backend, `npm test` in that folder runs its checks).

## Done when

You have the base URL, base site, languages and currencies written down.

Full solution of this step: `git diff phase2-step09 phase3-step01`
