# Phase 5 · Step 6 — Navigation access and badge

Plan: `docs/training-plan.md` → Phase 5, Step 6 · Previous: `phase5-step05` · Next: `phase5-step07`

## Commands

```bash
cd mystore
ng generate component custom/compare-badge --type= --inline-template --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `mystore/src/app/custom/compare-badge/compare-badge.ts` | `routerLink="/compare"`; stretch: `aria-live` region |
| `mystore/src/app/app.component.html` | outlet `SiteLinks`, `OutletPosition.AFTER` |
| `mystore/src/app/app.component.ts` | import `CompareBadge` |
| `mystore/src/styles.scss` | `.compare-badge` |

Provided: The mock header gets the `SiteLinks` slot (the outlet needs it).

## Check (after the changes)

```bash
npm start
```

## Done when

"Compare (N)" changes instantly on any page and links to `/compare`.

Full solution of this step: `git diff phase5-step05 phase5-step06`
