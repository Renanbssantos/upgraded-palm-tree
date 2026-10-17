# Phase 2 · Step 4 — RxJS and the bridge to signals

Plan: `docs/training-plan.md` → Phase 2, Step 4 · Previous: `phase2-step03` · Next: `phase2-step05`

## Commands

```bash
cd catalog
ng generate component search --inline-template --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/search/search.ts` | `toObservable` → `debounceTime`, `switchMap`, `catchError` → `toSignal` |
| `catalog/src/app/app.routes.ts` | route `search` |

## Check (after the changes)

```bash
ng serve                       # open /search, DevTools → Network
```

## Done when

One request goes out after you stop typing; you can explain `switchMap` vs `mergeMap`.

Full solution of this step: `git diff phase2-step03 phase2-step04`
