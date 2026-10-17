# Phase 1 · Step 7 — Routing: list and detail

Plan: `docs/training-plan.md` → Phase 1, Step 7 · Previous: `phase1-step06` · Next: `phase2-step01`

## Commands

```bash
cd catalog
ng generate component product-detail --inline-template --inline-style
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/app.routes.ts` | routes `""`, `product/:id`, `**` |
| `catalog/src/app/app.config.ts` | `provideRouter(routes, withComponentInputBinding())` |
| `catalog/src/app/product-detail/product-detail.ts` | `id` input; exercise: fetch with `toObservable` + `switchMap` |
| `catalog/src/app/product-list/product-list.html` | `[routerLink]` to each product |
| `catalog/src/app/product-list/product-list.ts` | import `RouterLink` |
| `catalog/src/app/app.html` | `<router-outlet />` |
| `catalog/src/app/app.ts` | import `RouterOutlet` |

## Check (after the changes)

```bash
ng serve                       # open /product/1
```

## Done when

Clicking a product opens `/product/:id` and the back button works.

Full solution of this step: `git diff phase1-step06 phase1-step07`
