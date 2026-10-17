# Phase 3 · Step 7 — CORS and the local environment

Plan: `docs/training-plan.md` → Phase 3, Step 7 · Previous: `phase3-step06` · Next: `phase4-step01`

## Commands

```bash
bash occ-calls/commands.sh
# browser console on another site: fetch('http://localhost:9002/occ/v2/basesites')
```

## Files

| File | Change |
| --- | --- |
| `occ-calls/commands.sh` | add: the `Access-Control-Allow-Origin` check |

## Done when

You recognize a CORS error and know it is fixed on the server.

Full solution of this step: `git diff phase3-step06 phase3-step07`
