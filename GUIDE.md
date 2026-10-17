# Getting started

Plan: `docs/training-plan.md`. Each step of each phase has a branch `phaseN-stepNN` with the solution and a `GUIDE.md` (commands + files to change).

## One-time setup

```bash
node -v                        # v22.x
npm install -g npm@11 @angular/cli@21
git clone https://github.com/Renanbssantos/upgraded-palm-tree.git
cd upgraded-palm-tree
```

## Follow a step

```bash
git checkout phase2-step05      # read GUIDE.md, try it yourself first
git diff phase2-step04 phase2-step05   # compare with the solution
```

## Phases

| Phase | Steps | End of phase |
| --- | --- | --- |
| 1 — TypeScript and Angular fundamentals | `phase1-step01` … `phase1-step07` | `phase1` |
| 2 — Modern Angular and reactivity | `phase2-step01` … `phase2-step09` | `phase2` |
| 3 — SAP Commerce and OCC | `phase3-step01` … `phase3-step07` | `phase3` |
| 4 — Composable Storefront | `phase4-step01` … `phase4-step12` | `phase4` |
| 5 — Individual final project: product comparison | `phase5-step01` … `phase5-step10` | `phase5` |
