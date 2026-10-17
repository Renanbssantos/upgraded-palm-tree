# upgraded-palm-tree

Angular + SAP Commerce Composable Storefront training track. The plan lives in [docs/training-plan.md](docs/training-plan.md); the original handoff notes are in [docs/handoff.md](docs/handoff.md).

## Branches

Each branch builds on the previous one and holds the verified reference solution up to that phase.

| Branch | Contents |
| --- | --- |
| `main` | Docs only |
| `phase1` | `catalog/` after Phase 1 (TypeScript and Angular fundamentals) |
| `phase2` | `catalog/` after Phase 2 (signals, RxJS, NgRx, SSR, tests) |
| `phase3` | `mocks/occ-mock/` (mock SAP Commerce backend) and `occ-calls/commands.sh` (the Phase 3 API calls) |

## Verified so far

- `phase2`: `catalog/` installs, `npm test` passes (4 tests) and `npm run build` (SSR) succeeds. Needs npm 11 (`npm install -g npm@11`) and reaches the public dummyjson.com API.
- `phase3`: `cd mocks/occ-mock && npm test` passes (7 tests), and `bash occ-calls/commands.sh` runs end to end against the mock.
