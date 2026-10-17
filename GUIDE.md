# Phase 3 · Step 2 — Domain concepts (Staged vs Online)

Plan: `docs/training-plan.md` → Phase 3, Step 2 · Previous: `phase3-step01` · Next: `phase3-step03`

## Commands

```bash
# real backend: edit a Staged product in Backoffice, then synchronize the catalog
# mock: the same with its admin endpoints
curl -X PATCH localhost:9002/mock/admin/products/300938 -H "Content-Type: application/json" -d '{"name":"New name"}'
curl -X POST localhost:9002/mock/admin/sync -H "Content-Type: application/json" -d '{"catalog":"product"}'
```

Note: No code: the change only reaches the API after the sync.

## Done when

You can explain Staged vs Online and product vs content catalog.

Full solution of this step: `git diff phase3-step01 phase3-step02`
