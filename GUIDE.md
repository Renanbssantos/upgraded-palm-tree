# Phase 2 · Step 5 — NgRx: the storefront's global state

Plan: `docs/training-plan.md` → Phase 2, Step 5 · Previous: `phase2-step04` · Next: `phase2-step06`

## Commands

```bash
cd catalog
ng add @ngrx/store
npm install @ngrx/store-devtools
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/state/cart.actions.ts` | create `addItem`; exercise: `removeItem` |
| `catalog/src/app/state/cart.reducer.ts` | create `CartState` and `cartReducer` |
| `catalog/src/app/state/cart.selectors.ts` | create `selectCart`, `selectTotal` |
| `catalog/src/app/app.config.ts` | replace the empty `provideStore()` with `provideStore({ cart: cartReducer })`, add `provideStoreDevtools()` |
| `catalog/src/app/cart/cart.ts` | `store.dispatch(...)` and `store.selectSignal(selectTotal)` |

## Done when

Actions show up in Redux DevTools and the store total updates.

Full solution of this step: `git diff phase2-step04 phase2-step05`
