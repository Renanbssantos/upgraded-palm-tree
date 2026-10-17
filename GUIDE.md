# Phase 4 — Composable Storefront

Plan: `docs/training-plan.md` → Phase 4. This branch is the end of the phase (same files as `phase4-step12`).

## Run it

```bash
node mocks/occ-mock/server.mjs   # terminal 1: mock backend on :9002
cd mystore && npm install && npm start   # terminal 2 (needs the @spartacus registry, see .npmrc)
```

## Steps

| Branch | Step |
| --- | --- |
| `phase4-step01` | Library access (RBSC or local registry) |
| `phase4-step02` | Create the app with schematics |
| `phase4-step03` | Read the generated configuration |
| `phase4-step04` | Use facades with signals |
| `phase4-step05` | Replace a CMS component |
| `phase4-step06` | Outlets |
| `phase4-step07` | Layout per page template |
| `phase4-step08` | Styles and theme |
| `phase4-step09` | Translations (i18n) |
| `phase4-step10` | Custom attribute with a normalizer |
| `phase4-step11` | Storefront SSR |
| `phase4-step12` | Accessibility and performance |

Each step branch has its own `GUIDE.md` with the commands and the files to change.
