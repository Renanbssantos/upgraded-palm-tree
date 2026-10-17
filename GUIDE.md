# Phase 3 · Step 4 — OAuth2 authentication

Plan: `docs/training-plan.md` → Phase 3, Step 4 · Previous: `phase3-step03` · Next: `phase3-step05`

## Commands

```bash
bash occ-calls/commands.sh
```

## Files

| File | Change |
| --- | --- |
| `occ-calls/commands.sh` | add: password grant, `/users/current` with the token; exercise: 401 without / with a bad token |

Note: Mock user: `customer@example.com` (see `mocks/occ-mock/data.mjs`).

## Done when

You get a token, call `/users/current` and can explain a 401.

Full solution of this step: `git diff phase3-step03 phase3-step04`
