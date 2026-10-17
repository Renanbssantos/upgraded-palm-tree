# Product comparison

Phase 5 final project (reference solution) on top of the Phase 4 storefront.

## Goal

Let a shopper pick up to 4 products and see them side by side, to decide which one to buy.

## Screens

- **Product page (PDP):** a "Compare" button right after "Add to cart". It toggles between "Compare" and "Remove from comparison", and is disabled, with the reason shown below it, when the list is full.
- **Header:** a "Compare (N)" link next to the site links, visible only while the list has items, on every page.
- **`/compare` page:** a CMS content page with one table: a column per product, rows for name, price, rating and every technical attribute; a remove button per product and a "Clear" button. Empty list: a message.

## Rules

- At most 4 products. With 4 in the list, the button of a 5th product is disabled (nothing is replaced silently).
- Adding a product that is already in the list removes it (the button is a toggle), so it can never appear twice.
- The list lives in the browser (`localStorage`, key `compare`), survives reloads and is per browser, not per user account.
- On the server (SSR) the list is always empty; the browser fills it in after loading.
- A stored product that no longer exists is simply not shown.

## Data shown

Name, formatted price, average rating and the technical attributes from the product classifications (feature name → values). An attribute missing for a product shows "—".

## Definition of done

The acceptance criteria at the end of Phase 5 in the training plan:

- [ ] README with specification, decisions and how to run it
- [ ] Component mapped through the CMS (`flexType`) and `/compare` page coming from the CMS
- [ ] Button and badge added through outlets, without changing storefront templates
- [ ] Data obtained only through facades (no `HttpClient` directly in components)
- [ ] State in signals, persisted in the browser without breaking SSR
- [ ] Texts through i18n in at least 2 languages
- [ ] Service, button and page tests passing
- [ ] Version upgrade done and documented (see "Checks")
- [ ] Demo video (each person records their own)

## Technical decisions

- **Signals, not NgRx, for the list.** It is a few codes per browser; a root service with `signal`, `computed` and one `effect` (to persist) is enough and needs no actions or reducers.
- **The service owns the rules.** The limit of 4 and the toggle live in `ProductComparisonService`, so the button, the badge and the page cannot disagree.
- **`combineLatest`, not `forkJoin`.** `ProductService.get` never completes; `forkJoin` would never emit.
- **Scopes `DETAILS` + `ATTRIBUTES`.** The storefront merges them into one OCC request whose `fields` include `classifications`.
- **CMS page with a `CMSFlexComponent`.** No new backend type; the content team can move the component or the page like any other.
- **Outlets for the button and the badge.** Nothing from the storefront was copied or edited. Two templates can share one outlet: the shipping message and the compare button both sit after `ProductAddToCartComponent`.
- **The context in the URL (`urlParameters`).** Found during the SSR check (Step 8): with SSR, switching language reloads the page, and the server only renders German when the language is in the URL. `routerLink="/compare"` still works: the storefront adds `/electronics-spa/<lang>/<currency>` to it.
- **Missing attribute → "—".** A product without a feature keeps its column aligned instead of shifting the row.

## How to run it

```bash
# terminal 1, at the repository root: mock SAP Commerce backend
node mocks/occ-mock/server.mjs

# terminal 2: the storefront on http://localhost:4200
cd mystore && npm install && npm start
```

Open a product, click "Compare", then follow the "Compare (N)" link in the header. Tests: `npm test`.

SSR: `npm run build`, then `NG_ALLOWED_HOSTS=localhost npm run serve:ssr:mystore` (PowerShell: `$env:NG_ALLOWED_HOSTS="localhost"; npm run serve:ssr:mystore`).

## Checks

| Date | Check | Result |
| --- | --- | --- |
| 2026-10-17 | SSR, production build | `/compare` comes from the server with the empty-list message (no `localStorage` there) and fills in the browser; no hydration errors in the console, no errors in the server log |
| 2026-10-17 | SSR + second language | Fixed: without the context in the URL the page went back to English after the language switch; with `urlParameters` the server renders `lang="de"` and every compare text in German |
| 2026-10-17 | Keyboard | Tab reaches "Compare" right after "Add to cart", with a visible outline; Enter toggles it and focus stays on the button; the header badge is a link reached by Tab |
| 2026-10-17 | Screen reader cues | Disabled button points to the reason with `aria-describedby`; the badge sits in an `aria-live="polite"` region; the table has a caption and `scope` on every header |
| 2026-10-17 | Lighthouse | Not run in this environment; run it in Chrome DevTools on the PDP before and after the button |
