# Phase 3 · Step 2 — Domain concepts (Staged vs Online)

Plan: `docs/training-plan.md` → Phase 3, Step 2 · Previous: `phase3-step01` · Next: `phase3-step03`

## Commands

```bash
# real backend: edit a Staged product in Backoffice, then synchronize the catalog
# mock: the same with its admin endpoints (keep "Camera" in the name: Step 3 searches for it)
curl -X PATCH localhost:9002/mock/admin/products/300938 -H "Content-Type: application/json" -d '{"name":"Photosmart E317 Camera (renamed)"}'
curl "localhost:9002/occ/v2/electronics-spa/products/300938?fields=name"   # still the old name
curl -X POST localhost:9002/mock/admin/sync -H "Content-Type: application/json" -d '{"catalog":"product"}'
curl "localhost:9002/occ/v2/electronics-spa/products/300938?fields=name"   # now the new name
```

Note: No code: the change only reaches the API after the sync. Restarting the mock brings the original data back.

## Done when

You can explain Staged vs Online and product vs content catalog.

Full solution of this step: `git diff phase3-step01 phase3-step02`
