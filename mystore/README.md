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

Filled in as the project went; see the end of this file.

## How to run it

```bash
# terminal 1, at the repository root: mock SAP Commerce backend
node mocks/occ-mock/server.mjs

# terminal 2: the storefront on http://localhost:4200
cd mystore && npm install && npm start
```

Open a product, click "Compare", then follow the "Compare (N)" link in the header. Tests: `npm test`.
