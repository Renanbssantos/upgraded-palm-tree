# Phase 2 · Step 8 — SSR and hydration

Plan: `docs/training-plan.md` → Phase 2, Step 8 · Previous: `phase2-step07` · Next: `phase2-step09`

## Commands

```bash
cd catalog
ng add @angular/ssr
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/app.routes.server.ts` | `RenderMode.Prerender` → `RenderMode.Server` (the build fails otherwise) |
| `catalog/src/app/last-visit/last-visit.ts` | create: `localStorage` inside `afterNextRender` |
| `catalog/src/app/app.ts` | import `LastVisit` |
| `catalog/src/app/app.html` | `<app-last-visit />` |

Provided: `ng add` creates/changes `server.ts`, `main.server.ts`, `app.config.server.ts`, `app.config.ts`, `angular.json`, `package.json`, `tsconfig.app.json`.

Note: ng add asks to confirm the installation: answer Y. Edit `app.routes.server.ts` before building: with `RenderMode.Prerender` the build fails on `product/:id`.

## Check (after the changes)

```bash
npm run build
NG_ALLOWED_HOSTS=localhost npm run serve:ssr:catalog   # http://localhost:4000
```

## Done when

"View page source" shows the products and the server log has no errors.

Full solution of this step: `git diff phase2-step07 phase2-step08`
