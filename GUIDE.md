# Phase 2 · Step 7 — Forms: reactive forms

Plan: `docs/training-plan.md` → Phase 2, Step 7 · Previous: `phase2-step06` · Next: `phase2-step08`

## Commands

```bash
cd catalog
ng generate component address-form --inline-style --skip-tests
```

## Files

| File | Change |
| --- | --- |
| `catalog/src/app/address-form/address-form.ts` | `FormBuilder` group with validators; exercise: `number` field |
| `catalog/src/app/address-form/address-form.html` | form, error messages, `[disabled]="form.invalid"` |
| `catalog/src/app/app.routes.ts` | route `address` |

## Check (after the changes)

```bash
ng serve                       # open /address
```

## Done when

The form validates e-mail, ZIP and number and only submits when valid.

Full solution of this step: `git diff phase2-step06 phase2-step07`
