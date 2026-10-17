# Training Plan: Angular + SAP Commerce Composable Storefront

Oct 1, 2026 · @Renan

## Goal and assumptions

In 10 weeks, each team member should be able to build, customize and ship a feature in the Composable Storefront without hands-on help. The track goes from Angular basics to an individual final project on the current storefront version.

**How the plan works:** it is individual and self-paced. Each phase is a numbered step-by-step guide, and every step follows the same order: the concept explained with an everyday analogy, code commented line by line, an exercise with a hint and a solution, the most common mistakes, the link to the official documentation and a "Done when" criterion. Phases 2, 3 and 4 open with a diagram of the core idea. Angular is taught in its modern form (standalone components, signals, effect, linkedSignal, resource, @defer, zoneless), without leaving out RxJS and NgRx, which the storefront still uses. Acronyms are explained the first time they appear and collected in the Glossary at the end.

**Target versions** (current product line): Composable Storefront 221121.x, Angular 21 and Node.js 22. The Angular 19 to 21 upgrade shipped in the February 2026 storefront release, and 221121.x releases require Node.js 22 ([KBA 3363029](https://userapps.support.sap.com/sap/support/knowledge/en/3363029), [Knack Systems](https://www.knacksystems.com/blog/jdk-21-on-sap-commerce-cloud-what-changes-who-it-affects-how-to-get-there)). Confirm the exact version of your client project before starting.

**Assumptions**

- Audience: developers with a JavaScript, HTML and CSS background; Angular and SAP Commerce may be new.
- Time: about 6 hours per week (5 h following the steps + 1 h for notes and review).
- Environment: access to an SAP Commerce backend (sandbox, CCv2 development environment or local install) and to the storefront libraries.
- People who already know Angular can skip Phases 1 and 2 after passing each phase checkpoint.

**Tested on October 15, 2026** (Node 22.22, npm 11, Angular CLI 21.2):

- **Phases 1 and 2:** every snippet and exercise solution was built, run in a headless browser and tested; the fixes found are already in the steps (npm bug, service naming, `Product` model, zoneless experiment, `@defer` with `--no-hmr`, SSR render mode and allowed hosts, generated specs).
- **Phases 3 and 4 (re-tested October 16, 2026):** every API call and every Phase 4 step and exercise was run end to end with Composable Storefront 221121.20.0 (libraries built from the `release/221121.20.x` source) against a mock SAP Commerce backend that imitates the OCC; the fixes found are already in the steps (`ng new` flag for the schematic, Windows style imports, test target, outlet position binding, layout breakpoints, storefront texts in other languages, SSR allowed hosts, CMS endpoint and CORS headers).
- **Phase 5:** every class, import path, config key, CMS/slot name and `ng add` flag was checked against the current Spartacus source on GitHub.
- None of it was run against a **real** SAP Commerce backend; do a first pass in your project environment before rolling the plan out.

## How to run the exercises

Every exercise runs in one of four places: an Angular project (terminal + browser), the test runner, API calls (terminal or Postman) or the SAP Commerce admin tools. Set them up once using this section; after that, each step has a short **How to run it** box right before its exercise.

### One-time setup

1. Install Node.js 22, the Angular CLI 21 (Phase 1, Step 1), [VS Code](https://code.visualstudio.com/) with the **Angular Language Service** extension, [Git](https://git-scm.com/downloads) and Chrome. On Windows, use the **Git Bash** terminal so the `curl` and `echo` commands in this plan work as written.
2. Create a `training/` folder with one project per stage:

```text
training/
  catalog/     ← Phases 1 and 2 (created in Phase 1, Step 3)
  occ-calls/   ← Phase 3: a commands.sh file where you save every API call
  mystore/     ← Phases 4 and 5 (created in Phase 4, Step 2)
```

3. Save your progress after every step, so you can always go back:

```bash
git init                                  # once, inside each project folder
git add . && git commit -m "phase1-step4" # after each step
```

**No-install option for Phases 1 and 2:** you can also run them in the browser on [StackBlitz](https://stackblitz.com) by opening a new Angular project. It is great for a quick start, but SSR (Phase 2, Step 8) and the storefront (Phases 4 and 5) need the local setup.

### Where to run what

| What you are running | Where | How | Where you see the result |
| --- | --- | --- | --- |
| Angular code (components, services, config) | Terminal in the project folder | `ng serve` (Phases 1–2) or `npm start` (Phases 4–5), and leave it running | Browser at `http://localhost:4200`; errors in the terminal and in the browser console (F12) |
| Anything that depends on SSR | Terminal | `npm run build`, then the `serve:ssr` script from `package.json` with `NG_ALLOWED_HOSTS=localhost` (Phase 2, Step 8) | Browser at the port the terminal prints; right-click → "View page source"; server errors in the terminal |
| Tests | A second terminal | `ng test` | Pass/fail list in the terminal |
| API calls (`curl`) | Terminal, or Postman if you prefer clicking | Paste the command; in Postman, use Import → Raw text and paste the `curl` | JSON response in the terminal or in Postman's response panel |
| Browser-only snippets (`fetch`) | Browser console (F12 → Console) | Paste and press Enter | The console itself |
| ImpEx scripts | HAC (Hybris Administration Console) at `https://<backend>/hac` | Console → ImpEx Import → paste → Import content | Success message in HAC; the data in Backoffice |
| Content and product changes | Backoffice at `https://<backend>/backoffice`, or SmartEdit | Edit, then synchronize the catalog | The OCC API response, then the storefront |

### Where each code snippet goes

The snippets in this plan show the important part and often leave out `import` lines. Use this table to know where to paste each kind of code.

| The snippet has... | Put it in... | How to create the file |
| --- | --- | --- |
| `@Component({...}) export class X` | `x.ts` (the component file) | `ng generate component x`, then replace the class and its decorator |
| `@Injectable({...}) export class XService` | `x.service.ts` | `ng generate service x --type=service` |
| A field or method alone (e.g. `total = computed(...)`) | Inside the class of the component or service being worked on | — |
| HTML (`@if`, `@for`, `<form>`) | The component's template (`x.html`, or `template:` inside `x.ts`) | — |
| `provideHttpClient()`, `provideRouter(...)` and other `provide...` (Phases 1–2) | The `providers` array in `src/app/app.config.ts` | Already exists |
| `provideConfig(...)` or `{ provide: ..., multi: true }` (Phases 4–5) | The `providers` of your custom module (template below) | Create it once |
| `<ng-template cxOutletRef=...>` | `src/app/app.component.html` (or `app.html`) | Already exists |
| CSS variables and global styles | `src/styles.scss` | Already exists |
| `describe(...)` / `it(...)` | The `.spec.ts` file next to the file you are testing | Created by `ng generate` |

**The custom module for Phases 4 and 5.** Keep all your storefront customizations in one place:

```typescript
// src/app/custom/custom.module.ts
import { NgModule } from '@angular/core';
import { provideConfig } from '@spartacus/core';

@NgModule({
  providers: [
    // paste every provideConfig(...) and provider from Phase 4 and 5 here
  ],
})
export class CustomModule {}
```

Then add `CustomModule` to the `imports` array of `src/app/app.module.ts` (or, if your generated app is standalone, add `importProvidersFrom(CustomModule)` to `app.config.ts`).

**Missing imports:** when VS Code underlines a name in red (e.g. `signal`, `inject`, `map`), put the cursor on it and press **Ctrl+.** (Cmd+. on Mac) → "Add import". This fixes most errors when pasting snippets.

### The run loop

1. Keep `ng serve` (or `npm start`) running in a terminal.
2. Paste or edit the code and save the file.
3. The browser reloads on its own; check the result.
4. Nothing changed or the page is blank? Read the **terminal** first (build errors), then the **browser console** (runtime errors).
5. It works? Commit, and move on to the step's exercise.

### Quick fixes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Cannot find name 'signal'` (or `inject`, `map`...) | Missing import | Ctrl+. → Add import |
| `'app-x' is not a known element` | Component not listed in the parent's `imports` | Add it to the `imports: [...]` of the parent component |
| `No provider for HttpClient` | HTTP not switched on | Add `provideHttpClient()` to `app.config.ts` |
| Changes don't show up | `ng serve` stopped, or the browser cached the page | Look at the terminal; restart it; hard reload with Ctrl+Shift+R |
| `Port 4200 is already in use` | Another `ng serve` is running | Close it, or run `ng serve --port 4300` |
| Blank storefront with red CORS errors | Backend doesn't allow `localhost:4200`, or one of the storefront's headers | Phase 3, Step 7 |
| `localStorage is not defined` (server terminal) | Browser-only code running during SSR | Phase 2, Step 8 |
| Backoffice change missing from the API | Catalog not synchronized | Phase 3, Step 2 |

## Track overview

&#91;embedded content: 10-week track · 5 phases\]

The first two phases build the Angular foundation; Phase 3 introduces the backend; Phases 4 and 5 spend half of the time on the storefront itself.

## Phase 1 — TypeScript and Angular fundamentals (weeks 1 and 2)

By the end of this phase you will have a small Angular product catalog with a list, a detail page and search, using a public API (Application Programming Interface). It is a small-scale "rehearsal" of what the storefront does at large scale.

**How to read each step:** first the **Concept** (what it is and why it exists, with an analogy), then **In practice** (code commented line by line), How to run it (where to paste the code, which command to use and where to see the result), an **Exercise** with a hint and a solution, the **Common mistakes** and, finally, the documentation and the "Done when" criterion. Try the exercise before looking at the solution.

### Step 1 — Set up the environment

**Concept.** Node.js is the "engine" that runs JavaScript outside the browser; it runs the build tools. npm (Node Package Manager) is the "parts store": it downloads libraries. The Angular CLI (Command Line Interface) is the "site foreman": it creates projects, generates files and builds. We use the same versions as the current storefront (Node.js 22 and Angular 21), so you don't learn something that doesn't apply to the real project.

**In practice.**

```bash
node -v                         # shows the Node version; expected: v22.x
npm -v                          # npm ships with Node
npm install -g @angular/cli@21  # -g = global install, available in any folder
ng version                      # confirms the "ng" command exists and its version
```

**How to run it.**

1. Open a terminal (Git Bash on Windows, Terminal on Mac/Linux).
2. Type the commands one at a time and press Enter after each.
3. Compare the output with the comments on the right.

**Exercise.** Find out which TypeScript version came with the Angular CLI.

- *Hint:* the output of one of the commands above lists several packages.
- *Solution:* run `ng version` inside a project (Step 3) and look for the `typescript` line.

**Common mistakes.**

- `ng: command not found`: the global npm folder is not on the PATH. Close and reopen the terminal; if it persists, use a version manager such as nvm.
- Node 18 or 20 installed: Angular 21 refuses older versions. Install Node 22 LTS (Long-Term Support).
- `npm error Cannot read properties of null (reading 'edgesOut')` during `ng new` or `npm install`: a bug in npm 10, the version bundled with Node 22. Run `npm install -g npm@11`, then `npm install` inside the project folder. (Confirmed while testing this plan.)

Documentation: [Angular installation](https://angular.dev/installation) · [Node.js download](https://nodejs.org/en/download)

Done when: `ng version` shows Angular CLI 21.x.

### Step 2 — TypeScript essentials

**Concept.** TypeScript (TS) is JavaScript with types. Think of types as labels on moving boxes: a box labeled "plates" only takes plates. If you try to pack a shoe, TypeScript complains *before* the code runs, not later when a customer sees the error. The storefront is written entirely in TypeScript; understanding `interface` and generics is a must to read its code.

**In practice.**

```typescript
// "interface" describes the shape of an object: which fields it has and their types
interface Product {
  code: string;                                     // required
  name: string;                                     // required
  price?: { value: number; currencyIso: string };   // "?" makes the field optional
}

// Generic: <T> is a "type variable". The function works for any list
// whose items have at least a "code" field (that is what "extends" requires)
function findByCode<T extends { code: string }>(items: T[], code: string): T | undefined {
  return items.find((item) => item.code === code); // returns the item or undefined
}

const tv: Product = { code: 'TV-55', name: 'TV 55"' };
const found = findByCode([tv], 'TV-55'); // TS knows "found" is Product | undefined
```

**How to run it.**

1. The easiest way: open the [TypeScript Playground](https://www.typescriptlang.org/play) in the browser, paste the code on the left and click **Run**.
2. Add `console.log(found);` at the end to see the result in the **Logs** tab on the right.
3. Type errors appear underlined in red as you type, without running anything. Try `const x: Product = { code: 1 }` to see one.

**Exercise.** Create a `CartEntry` interface with `product: Product` and `quantity: number`, and a `total(entries)` function that sums `price.value * quantity`, handling products without a price.

- *Hint:* use `?.` (optional chaining) and `??` (default value).
- *Solution:*

```typescript
interface CartEntry { product: Product; quantity: number; }
const total = (entries: CartEntry[]) =>
  entries.reduce((sum, e) => sum + (e.product.price?.value ?? 0) * e.quantity, 0);
```

**Common mistakes.**

- Using `any` to "make the error go away": you lose all protection. Prefer proper types or `unknown`.
- Forgetting that optional fields can be `undefined`: reading `price.value` without `?.` breaks on products without a price.

Documentation: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) · [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

Done when: you solve the exercise without looking at the solution and can explain what `T extends { code: string }` requires.

### Step 3 — Create the project and understand its structure

**Concept.** An Angular project is like a house: `main.ts` is the front door, `app.config.ts` is the fuse box (it switches on global services such as HTTP and routing) and `app.routes.ts` is the floor plan (which URL shows which screen).

**In practice.**

```bash
ng new catalog --style=scss --ssr=false  # SCSS (Sassy CSS) = styles with variables; SSR comes in Phase 2
cd catalog
ng serve                                 # builds and serves at http://localhost:4200
```

```text
src/
  main.ts            ← starts the application (bootstrapApplication)
  index.html         ← the only HTML page; Angular renders everything inside it
  styles.scss        ← global styles
  app/
    app.ts           ← root component (the "frame" around every screen)
    app.config.ts    ← global providers (HTTP, routing...)
    app.routes.ts    ← route table
```

From Angular 20 on, the CLI generates names without the `.component` suffix (e.g. `app.ts`, class `App`). In older code, including the storefront, you will see `app.component.ts`; it is the same thing.

**How to run it.**

1. In the terminal, go to your `training/` folder and run the `ng new` command. Answer the questions with Enter (defaults).
2. Run `cd catalog` and then `ng serve`.
3. Open `http://localhost:4200` in Chrome. Leave the terminal open: as long as `ng serve` is running, every saved file reloads the page.
4. Open the `catalog` folder in VS Code (File → Open Folder) to see the file tree.

**Exercise.** Change the title shown on the home page and watch the screen update on its own.

- *Hint:* look for the root component template.
- *Solution:* edit `app.html` (or the `template` in `app.ts`); `ng serve` rebuilds and reloads.

**Common mistakes.**

- Port 4200 in use: run `ng serve --port 4300`.
- Editing files inside `node_modules`: never change installed libraries; the change disappears on the next `npm install`. This rule matters twice as much in the storefront.

Documentation: [Angular CLI](https://angular.dev/tools/cli) · [Official tutorial](https://angular.dev/tutorials/learn-angular)

Done when: you can explain the role of each file in the tree above.

### Step 4 — Standalone components and signals

**Concept.** A component is a LEGO brick of the screen: it has a look (template), style and behavior (class). "Standalone" means the brick declares on its own what it uses (`imports`), with no NgModule. A **signal** is a variable that announces when it changes, like a spreadsheet cell: when A1 changes, every formula that depends on A1 recalculates. In the template you read a signal by calling it as a function: `name()`.

**In practice.**

```bash
ng generate component product-card   # creates product-card.ts, .html, .scss and .spec.ts
```

```typescript
import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',        // the tag used to place the component: <app-product-card>
  imports: [CurrencyPipe],             // standalone: declare here everything the template uses
  template: `
    <h3>{{ name() }}</h3>              <!-- reads the "name" signal (note the parentheses) -->
    <p>{{ price() | currency: 'USD' }}</p>   <!-- the pipe formats as currency -->
    @if (isExpensive()) { <span>Premium</span> }
  `,
})
export class ProductCard {
  name = input.required<string>();     // data from the parent component; required
  price = input<number>(0);            // data from the parent; defaults to 0
  isExpensive = computed(() => this.price() > 1000); // recalculates when price changes
}
```

In the parent component: `<app-product-card [name]="'Laptop'" [price]="1500" />`. The square brackets `[ ]` mean "pass this value to the input".

**How to run it.**

1. With `ng serve` running, open a **second terminal** in the `catalog` folder and run `ng generate component product-card`.
2. Open `src/app/product-card/product-card.ts` and replace its whole content with the snippet above.
3. Open the root component (`src/app/app.ts`): add `ProductCard` to its `imports: [...]` array.
4. In the root template (`src/app/app.html`), delete the sample content and add `<app-product-card [name]="'Laptop'" [price]="1500" />`. Save and look at the browser.

**Exercise.** Add a `discount` input (percentage, default 0) and show the final price with the discount.

- *Hint:* the final price depends on two inputs; which function derives values from other signals?
- *Solution:* `discount = input(0);` and `finalPrice = computed(() => this.price() * (1 - this.discount() / 100));`

**Common mistakes.**

- Writing `{{ name }}` without parentheses: you get the function text, not the value.
- Using a pipe or component without adding it to `imports`: the error says the element or pipe "is not known".

Documentation: [Components](https://angular.dev/guide/components) · [Inputs](https://angular.dev/guide/components/inputs) · [Signals](https://angular.dev/guide/signals)

Done when: the card shows the name, price and discounted price coming from the parent.

### Step 5 — Templates and control flow

**Concept.** The template is HTML with superpowers. Control flow (`@if`, `@for`, `@switch`) decides *what* shows up, like the instructions in a recipe ("if there are eggs, make an omelet; for each guest, one plate"). The `track` in `@for` tells Angular how to recognize each item, so it only redraws what changed.

**In practice.**

```html
<input (input)="term.set($any($event.target).value)" placeholder="Search" />
<!-- (event)="action": on every keystroke, stores the text in the "term" signal -->

@for (p of filtered(); track p.id) {      <!-- repeats for each product; "track" = item identity -->
  <app-product-card [name]="p.title" [price]="p.price" />
} @empty {                                <!-- shown when the list is empty -->
  <p>No products found.</p>
}
```

```typescript
term = signal('');                                            // typed text
filtered = computed(() =>                                     // filtered list, always up to date
  this.products().filter((p) => p.title.toLowerCase().includes(this.term().toLowerCase())),
);
```

**How to run it.**

1. Generate a list component: `ng generate component product-list`, and show it in `app.html` with `<app-product-list />` (add `ProductList` to the root `imports`).
2. Paste the TypeScript snippet inside the `ProductList` class and the HTML snippet in `product-list.html`. Add `ProductCard` to `ProductList`'s `imports`.
3. Until Step 6 brings real data, create test data in the class: `products = signal([{ id: 1, title: 'Phone', price: 300, stock: 3 }, { id: 2, title: 'Laptop', price: 1500, stock: 0 }]);`
4. Save, then type in the search box and watch the list filter.

**Exercise.** Show an "Out of stock" badge when `p.stock === 0`, "Only a few left" when it is below 5, and nothing otherwise.

- *Hint:* chain `@if` / `@else if`.
- *Solution:* `@if (p.stock === 0) { <span>Out of stock</span> } @else if (p.stock < 5) { <span>Only a few left</span> }`

**Common mistakes.**

- `track $index` on lists that change order: Angular mixes up the items. Use a unique id.
- Mixing the old syntax (`*ngIf`, `*ngFor`) with the new one in new files: it works, but prefer `@if`/`@for`. Learn to recognize the old one; it appears in the storefront code.

Documentation: [Control flow](https://angular.dev/guide/templates/control-flow) · [Binding and events](https://angular.dev/guide/templates)

Done when: search filters the list as you type and the empty message shows when nothing matches.

### Step 6 — Services, dependency injection and HTTP

**Concept.** Components should take care of the screen; fetching data is a **service**'s job. DI (Dependency Injection) works like a waiter: the component asks "I want the ProductService" with `inject()` and Angular hands over a ready instance, without the component knowing how it was built. `HttpClient` makes HTTP (HyperText Transfer Protocol) calls and returns an **Observable**, a "promise of data" you will study in depth in Phase 2. This same design (component → service → HTTP) is the basis of the storefront's facades.

**In practice.**

```typescript
// app.config.ts — "switches on" HTTP for the whole application
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};

// product.service.ts
@Injectable({ providedIn: 'root' })        // 'root' = a single instance for the whole app
export class ProductService {
  private http = inject(HttpClient);       // asks Angular for HttpClient
  list() {
    // GET on the public test API; <...> declares the expected response shape
    return this.http.get<{ products: Product[] }>('https://dummyjson.com/products');
  }
}

// product-list.ts — the component only consumes
export class ProductList {
  private service = inject(ProductService);
  // toSignal turns the Observable into a signal; before the response, initialValue applies
  products = toSignal(this.service.list().pipe(map((r) => r.products)), { initialValue: [] });
}
```

**How to run it.**

1. Add `provideHttpClient()` to the `providers` array in `src/app/app.config.ts` (keep what is already there).
2. Create the `Product` model below in `src/app/product.model.ts`, then import it in the service with `import { Product } from './product.model';`.
3. Run `ng generate service product --type=service` and replace the content of `product.service.ts` with the service snippet. Without `--type=service`, Angular 21 names the file `product.ts` and the class `Product`, which clashes with the model.
4. In `ProductList`, delete the test data from Step 5 and paste the `service` and `products` lines from the component snippet.
5. Save. To see the raw API response, open `https://dummyjson.com/products` directly in the browser, or watch it in DevTools → Network.

```typescript
// src/app/product.model.ts — shape of a product returned by dummyjson.com
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
}
```

**Exercise.** Add a `byId(id)` method to the service that fetches `https://dummyjson.com/products/{id}`.

- *Hint:* use a template string (text between backticks) to build the URL with the id.
- *Solution:*

```typescript
byId(id: string) {
  // ${id} is replaced by the variable's value inside the template string
  return this.http.get<Product>(`https://dummyjson.com/products/${id}`);
}
```

**Common mistakes.**

- Forgetting `provideHttpClient()`: error "No provider for HttpClient".
- Calling `this.http.get(...)` and expecting the request to happen: Observables are lazy and only run when someone subscribes (`toSignal` does it for you).
- Putting HTTP logic directly in the component: it works, but it is forbidden in the storefront; get used to going through services.

Documentation: [Dependency injection](https://angular.dev/guide/di) · [HttpClient](https://angular.dev/guide/http) · [toSignal](https://angular.dev/ecosystem/rxjs-interop)

Done when: the list shows real products coming from the API.

### Step 7 — Routing: list and detail

**Concept.** The router is the app's GPS (Global Positioning System): it looks at the URL (Uniform Resource Locator) and decides which component to show, without reloading the page. That makes the app an SPA (Single-Page Application). Variable parts of the URL, such as `:id`, become parameters the component receives.

**In practice.**

```typescript
// app.routes.ts — the "URL → component" table
export const routes: Routes = [
  { path: '', component: ProductList },             // http://localhost:4200/
  { path: 'product/:id', component: ProductDetail }, // :id is variable, e.g. /product/7
  { path: '**', redirectTo: '' },                    // any other URL goes back to the list
];

// app.config.ts — withComponentInputBinding delivers :id as a component input
providers: [provideHttpClient(), provideRouter(routes, withComponentInputBinding())],

// product-detail.ts
export class ProductDetail {
  id = input.required<string>();   // automatically receives :id from the URL
}
```

In the list template, replace the card with a link: `<a [routerLink]="['/product', p.id]">{{ p.title }}</a>` (import `RouterLink`). In the root component, `<router-outlet />` marks where the route's screen appears.

**How to run it.**

1. Run `ng generate component product-detail`.
2. Paste the routes into `src/app/app.routes.ts` and update `provideRouter(...)` in `app.config.ts` to include `withComponentInputBinding()`.
3. In `app.html`, replace `<app-product-list />` with `<router-outlet />` (import `RouterOutlet` in the root component).
4. Open `http://localhost:4200/product/1` directly in the address bar to test the detail page, then click through from the list.

**Exercise.** Make the detail page fetch the product by id using the method from the previous exercise.

- *Hint:* the id changes when you navigate between products; Step 2 of Phase 2 shows the most elegant way. For now, use `toObservable(this.id)` + `switchMap`.
- *Solution:* `product = toSignal(toObservable(this.id).pipe(switchMap((id) => this.service.byId(id))));`

**Common mistakes.**

- Forgetting `<router-outlet />`: the URL changes but nothing shows.
- Using `<a href>` instead of `routerLink`: the whole page reloads and state is lost.

Documentation: [Routing](https://angular.dev/guide/routing) · [Reading route state](https://angular.dev/guide/routing/read-route-state)

Done when: clicking a product opens `/product/:id` with its data and the browser back button works.

### Phase 1 checkpoint

- [ ] List, detail and search working
- [ ] At least 2 standalone components and 1 injected service
- [ ] All exercises done before checking the solutions
- [ ] Code versioned in a personal Git repository

## Phase 2 — Modern Angular and reactivity (weeks 3 and 4)

By the end of this phase you will master Angular's new features (signals, effect, linkedSignal, resource, @defer, zoneless) as well as RxJS and NgRx, which the storefront uses in almost every service. Keep evolving the catalog from Phase 1.

**The core idea: reactivity.** Instead of telling the screen to update, you declare *what* each value depends on, and Angular updates on its own when something changes. Angular has two tools for this, and you will use both:

|  | Signals | RxJS (Observables) |
| --- | --- | --- |
| Analogy | Spreadsheet cell: always has a current value | Factory conveyor belt: items pass by over time |
| Best for | Screen state and derived values | Async events, requests, cancellation, timing (debounce) |
| Where it shows up | New Angular code, your components | Storefront facades and services |
| Bridge | `toObservable(signal)` | `toSignal(observable)` |

The diagram below shows how the signal pieces connect.

&#91;embedded content: signal reactivity flow · write, derive, react\]

Read it left to right: an event writes to a signal, the computed recalculates, and the template and the effect react, with no manual update call.

### Step 1 — signal, computed and effect

**Concept.** These are three different roles, as in the diagram above:

- `signal`: holds a value you can change (the spreadsheet cell you type into).
- `computed`: a value calculated from others (the cell with a formula). It is read-only and only recalculates when something it uses changes.
- `effect`: an action that happens *because of* a change but does not produce a value (like an alarm that rings when the temperature changes). Use it for things outside Angular: logging, `localStorage`, analytics.

The golden rule: if you want a **value**, use `computed`; if you want to **do something**, use `effect`.

**In practice.**

```typescript
export class Cart {
  // signal holding an array of items; <...> declares the item type
  items = signal<{ code: string; qty: number; price: number }[]>([]);

  // computed: sums qty × price; recalculates on its own when "items" changes
  total = computed(() => this.items().reduce((sum, i) => sum + i.qty * i.price, 0));

  constructor() {
    // effect: runs now and again whenever "total" changes
    effect(() => console.log('Cart total:', this.total()));
  }

  add(code: string, price: number) {
    // update receives the current value and returns a NEW array (never mutate the old one)
    this.items.update((list) => [...list, { code, qty: 1, price }]);
  }

  clear() {
    this.items.set([]); // set replaces the whole value
  }
}
```

**How to run it.**

1. Keep working in the `catalog` project. Run `ng generate component cart` and paste the class snippet into `cart.ts`.
2. Give it a minimal template: `<button (click)="add('A', 10)">Add A</button> <button (click)="clear()">Clear</button> <p>Total: {{ total() }}</p>`.
3. Show it in `app.html` with `<app-cart />` (outside `<router-outlet />`, so it appears on every page) and add `Cart` to the root `imports`.
4. Open the browser console (F12): each click prints the new total, proving the `effect` runs.

**Exercise.** Create a `computed` called `itemCount` with the sum of quantities and an `increment(code)` method that increases an item's quantity.

- *Hint:* in `update`, use `map` to return a new array with the changed item.
- *Solution:*

```typescript
itemCount = computed(() => this.items().reduce((n, i) => n + i.qty, 0));
increment(code: string) {
  this.items.update((list) => list.map((i) => (i.code === code ? { ...i, qty: i.qty + 1 } : i)));
}
```

**Common mistakes.**

- Mutating the array "from the inside" (`this.items().push(...)`): the signal does not notice, because the reference stays the same. Always return a new array.
- Using `effect` to copy one signal into another (`effect(() => this.b.set(this.a() * 2))`): that should be a `computed`.
- Calling `effect()` outside the constructor or a class field: you get an "injection context" error.

Documentation: [Signals (signal, computed, effect, untracked)](https://angular.dev/guide/signals)

Done when: total and count update on their own and you can explain, in your own words, when to use `computed` and when to use `effect`.

### Step 2 — linkedSignal and resource

**Concept.**

- `linkedSignal` is a signal you can change, but that **resets to a default** when its source changes. Analogy: the size picker in a clothing store. You choose "M", but when you switch to another shirt it goes back to that shirt's default size.
- `resource` / `httpResource` load async data and expose everything as signals: `value()`, `isLoading()` and `error()`. Analogy: a package tracker that always shows the current status ("on the way", "delivered", "failed"). When the id changes, it fetches again on its own.

**In practice.**

```typescript
export class ProductDetail {
  id = input.required<string>(); // comes from the route (Phase 1, Step 7)

  // The function builds the URL by reading this.id(). When the id changes, the request is redone.
  product = httpResource<Product>(() => `https://dummyjson.com/products/${this.id()}`);

  // Starts on the first image and goes back to it whenever the product changes,
  // but the user can pick another one with selectedImage.set(url)
  selectedImage = linkedSignal(() => this.product.value()?.images?.[0]);
}
```

```html
@if (product.isLoading()) {
  <p>Loading...</p>                          <!-- while the request is in flight -->
} @else if (product.error()) {
  <p>Could not load the product.</p>         <!-- if the API failed -->
} @else {
  <img [src]="selectedImage()" />
  @for (img of product.value()?.images; track img) {
    <button (click)="selectedImage.set(img)">View</button>  <!-- swaps the main image -->
  }
}
```

Compare with the exercise in Phase 1, Step 7: `httpResource` replaces `toObservable` + `switchMap` and also gives you loading and error states.

**How to run it.**

1. Open `product-detail.ts` from Phase 1, Step 7 and replace the old `product` field with the `httpResource` and `linkedSignal` lines (keep the `id` input). `httpResource` is imported from `@angular/common/http`.
2. Paste the HTML snippet into `product-detail.html`.
3. Open `http://localhost:4200/product/1`, then change the URL to `/product/2`: the image resets to the new product's first image.
4. To see the loading state, open DevTools → Network → set throttling to "Slow 4G" and reload.

**Exercise.** Add a "Try again" button that shows up in the error state.

- *Hint:* resources have a method to fetch again.
- *Solution:* `<button (click)="product.reload()">Try again</button>`. To test it, change the URL to one that doesn't exist.

**Common mistakes.**

- Reading `product.value().title` without `?.`: while loading, the value is `undefined`.
- Expecting `httpResource` to POST or change data: it is designed for **reading**. To write, keep using `HttpClient`.

Documentation: [linkedSignal](https://angular.dev/guide/signals/linked-signal) · [resource](https://angular.dev/guide/signals/resource) · [httpResource](https://angular.dev/guide/http/http-resource)

Done when: the detail page shows all three states (loading, error, success) and the gallery goes back to the first image when you switch products.

### Step 3 — input, output, model and viewChild

**Concept.** These are a component's "doors":

- `input()`: data coming in, from parent to child (the parent hands it over).
- `output()`: events going out, from child to parent (the child lets it know).
- `model()`: two-way; the parent hands over a value and the child can change it back, like a shared remote control.
- `viewChild()`: a "flashlight" to find an element inside its own template (e.g. to focus a field).

All of them are signals. The storefront code still uses the older decorator form (`@Input`, `@Output`, `@ViewChild`); learn to recognize both.

**In practice.**

```typescript
@Component({
  selector: 'app-qty-selector',
  template: `
    <button (click)="decrement()">-</button>
    <input #qtyInput [value]="qty()" readonly />   <!-- #qtyInput names the element -->
    <button (click)="increment()">+</button>
  `,
})
export class QtySelector {
  qty = model(1);                                  // parent uses [(qty)]="quantity"
  max = input(10);                                 // limit set by the parent
  limitReached = output<number>();                 // event emitted to the parent
  inputEl = viewChild<ElementRef<HTMLInputElement>>('qtyInput'); // finds #qtyInput

  increment() {
    if (this.qty() >= this.max()) {
      this.limitReached.emit(this.max());          // tells the parent
      return;
    }
    this.qty.update((q) => q + 1);                 // changes it, and the parent sees the new value
  }
  decrement() { this.qty.update((q) => Math.max(1, q - 1)); }
}
```

In the parent: `<app-qty-selector [(qty)]="quantity" [max]="5" (limitReached)="warn($event)" />`. The `[( )]` syntax, nicknamed "banana in a box", binds both directions.

**How to run it.**

1. Run `ng generate component qty-selector` and paste the snippet into `qty-selector.ts`.
2. In `product-detail.ts`, add `quantity = signal(1);` and `warn(max: number) { alert('Limit: ' + max); }`, and add `QtySelector` to its `imports`.
3. In `product-detail.html`, add the parent line from the text below the snippet plus `<p>Selected: {{ quantity() }}</p>`.
4. Click + and − and watch "Selected" change in the parent: that is two-way binding at work.

**Exercise.** When the limit is reached, focus the field and show the message "Limit of N units" in the parent.

- *Hint:* use `this.inputEl()?.nativeElement.focus()` in the child; in the parent, store `$event` in a signal.
- *Solution:* in the child, call `focus()` before `emit`. In the parent, create `limit = signal<number | null>(null)` and use `(limitReached)="limit.set($event)"` with `@if (limit()) { <p>Limit of {{ limit() }} units</p> }`.

**Common mistakes.**

- Trying `this.max.set(...)` on an `input()`: inputs are read-only in the child. For two-way, use `model()`.
- Reading `viewChild()` in the constructor: the element doesn't exist yet. Read it in an event, in an `effect` or after rendering.

Documentation: [Inputs](https://angular.dev/guide/components/inputs) · [Outputs](https://angular.dev/guide/components/outputs) · [Model inputs](https://angular.dev/guide/signals/inputs) · [Queries](https://angular.dev/guide/components/queries)

Done when: the selector works with `[(qty)]` and the parent shows the limit message.

### Step 4 — RxJS and the bridge to signals

**Concept.** An Observable is a **factory conveyor belt**: items (values) pass by over time. Operators are the **stations** along the belt: one filters, another transforms, another waits. Nothing moves until someone turns the belt on, that is, subscribes (`subscribe`, the `async` pipe or `toSignal`). RxJS (Reactive Extensions for JavaScript) shines where signals don't reach: timing (waiting for the user to stop typing) and cancellation (dropping a stale search when a new one arrives). The storefront exposes almost everything as Observables, so this is a must-have skill.

**In practice.**

```typescript
export class Search {
  private http = inject(HttpClient);
  term = signal('');                                   // typed text (signal)

  results = toSignal(                                  // in the end, back to a signal for the template
    toObservable(this.term).pipe(                      // turns the signal into a belt
      debounceTime(300),                               // waits 300 ms without typing
      distinctUntilChanged(),                          // ignores it if the text didn't change
      filter((q) => q.length >= 2),                    // only searches with 2+ letters
      switchMap((q) =>                                 // a new search CANCELS the previous one
        this.http.get<{ products: Product[] }>(`https://dummyjson.com/products/search?q=${q}`),
      ),
      map((r) => r.products),                          // takes just the list from the response
      catchError(() => of([])),                        // on error, returns an empty list
    ),
    { initialValue: [] as Product[] },                 // value before the first response
  );
}
```

Operators to master, with their "station": `map` (transforms), `filter` (discards), `switchMap` (switches to another belt, cancelling the previous one), `combineLatest` (joins belts), `debounceTime` (waits), `distinctUntilChanged` (ignores repeats), `take` (takes N and stops), `catchError` (handles failures). Also learn `takeUntilDestroyed()` to end manual subscriptions.

**How to run it.**

1. Run `ng generate component search` and paste the class into `search.ts`. Operators (`debounceTime`, `switchMap`...) come from `rxjs`; `toSignal` and `toObservable` from `@angular/core/rxjs-interop` (Ctrl+. adds them).
2. Template: `<input (input)="term.set($any($event.target).value)" placeholder="Search" /> @for (p of results(); track p.id) { <p>{{ p.title }}</p> }`.
3. Add a route `{ path: 'search', component: Search }` and open `http://localhost:4200/search`.
4. Open DevTools → Network → filter "search": type fast and confirm only one request goes out after you stop typing.

**Exercise.** Replace `switchMap` with `mergeMap`, type fast and watch the browser's Network tab. What changes?

- *Hint:* look at how many requests stay "pending" and which response shows up last.
- *Solution:* with `mergeMap` no search is cancelled; an old response can arrive after the new one and show the wrong results. That is why searches use `switchMap`.

**Common mistakes.**

- Calling `subscribe` inside `subscribe`: use operators such as `switchMap`.
- Subscribing manually and never unsubscribing: memory leak. Prefer `toSignal` or the `async` pipe, which clean up on their own.
- Forgetting `catchError`: an error closes the belt forever and search stops working.

Documentation: [RxJS: Observable](https://rxjs.dev/guide/observable) · [RxJS: operators](https://rxjs.dev/guide/operators) · [RxJS and signals interop](https://angular.dev/ecosystem/rxjs-interop)

Done when: debounced search works and you can explain the difference between `switchMap` and `mergeMap`.

### Step 5 — NgRx: the storefront's global state

**Concept.** When several screens need the same data (the cart shows up in the header, the mini cart and checkout), it lives in a global **store**. Analogy: a bank.

- **Action** is the request at the counter ("deposit $50"); it only describes what happened.
- **Reducer** is the teller who updates the balance; a pure function that takes the state and the action and returns the new state.
- **Selector** is the statement; it reads parts of the state.
- **Effect** (NgRx's) is the clerk who calls another bank; it reacts to actions and calls APIs.

Note: NgRx "effects" have nothing to do with the signals `effect()`. In the storefront you rarely touch the store directly: you use **facades**, which hide these pieces (Phase 4). But you need to understand them to debug.

**In practice.**

```typescript
// cart.actions.ts — the "request"
export const addItem = createAction('[Cart] Add Item', props<{ code: string; price: number }>());

// cart.reducer.ts — the "teller": takes current state + action, returns a NEW state
export const cartReducer = createReducer(
  initialState,
  on(addItem, (state, { code, price }) => ({
    ...state,                                           // copies the rest of the state
    items: [...state.items, { code, price, qty: 1 }],   // new array with the item
  })),
);

// cart.selectors.ts — the "statement"
export const selectCart = createFeatureSelector<CartState>('cart');
export const selectTotal = createSelector(selectCart, (s) =>
  s.items.reduce((t, i) => t + i.price * i.qty, 0),
);

// in the component
private store = inject(Store);
total = this.store.selectSignal(selectTotal);           // reads the selector as a signal
add(code: string, price: number) {
  this.store.dispatch(addItem({ code, price }));        // sends the request
}
```

Install the Redux DevTools browser extension and register `provideStoreDevtools()`: you will see every action and the state before and after. The same tool works with the storefront.

**How to run it.**

1. Install NgRx: `ng add @ngrx/store` and `npm install @ngrx/store-devtools@21` (without `@21` npm takes the latest major, which needs a newer Angular).
2. Create a `src/app/state/` folder with `cart.actions.ts`, `cart.reducer.ts` and `cart.selectors.ts`, and paste each part of the snippet into its file. Define the state shape at the top of the reducer: `export interface CartState { items: { code: string; price: number; qty: number }[] }` and `const initialState: CartState = { items: [] };`.
3. In `app.config.ts`, `ng add` already inserted an empty `provideStore()`: replace it with `provideStore({ cart: cartReducer })` (don't add a second one), and add `provideStoreDevtools()`.
4. Change the `Cart` component from Step 1 to use `store.dispatch` and `selectSignal`. Install the **Redux DevTools** Chrome extension, open DevTools → Redux tab, click Add and watch each action.

**Exercise.** Create a `removeItem({ code })` action and handle it in the reducer.

- *Hint:* use `filter` to return an array without the item.
- *Solution:* `on(removeItem, (state, { code }) => ({ ...state, items: state.items.filter((i) => i.code !== code) }))`

**Common mistakes.**

- Mutating state inside the reducer (`state.items.push(...)`): reducers must be pure and return new objects.
- Calling an API inside the reducer: that is an NgRx effect's job.
- Mixing up the two "effects" (NgRx and signals).

Documentation: [NgRx Store](https://ngrx.io/guide/store) · [NgRx Effects](https://ngrx.io/guide/effects) · [Store DevTools](https://ngrx.io/guide/store-devtools) · [NgRx Signals (modern alternative, not used by the storefront)](https://ngrx.io/guide/signals)

Done when: the cart works through NgRx, the total is read with `selectSignal` and you can follow the actions in Redux DevTools.

### Step 6 — @defer and zoneless change detection

**Concept.**

- `@defer` postpones loading a piece of the screen (and its code) until it is needed. Analogy: the restaurant only brings dessert when you finish your main course, not everything at once. The page opens faster.
- **Change detection** is how Angular figures out it needs to redraw the screen. Before, the Zone.js library watched *everything* (every click, timer, request) and triggered a check of the whole screen: a guard who checks every room whenever they hear a noise. In **zoneless** mode, Angular only redraws when a signal read by the template changes: each room has its own sensor. New projects in Angular 21 are zoneless by default; that is why signals stopped being optional.

**In practice.**

```html
@defer (on viewport) {                       <!-- loads when the block enters the screen -->
  <app-product-reviews [productId]="id()" />
} @placeholder {                             <!-- shown BEFORE loading starts -->
  <p>Reviews appear as you scroll down.</p>
} @loading (minimum 300ms) {                 <!-- while loading; a 300 ms minimum avoids flicker -->
  <p>Loading reviews...</p>
} @error {
  <p>Could not load the reviews.</p>
}
```

```typescript
// New Angular 21 projects are zoneless by default: package.json has no zone.js,
// and no provider is needed. (Older apps opt in with provideZonelessChangeDetection().)

// Experiment: the plain counter changes every second, but Angular is never told
export class Experiment {
  plainCounter = 0;                  // plain variable
  signalCounter = signal(0);         // signal
  constructor() {
    setInterval(() => this.plainCounter++, 1000); // Angular is NOT notified
  }
}
```

```html
<!-- experiment.html -->
<p>Plain: {{ plainCounter }} | Signal: {{ signalCounter() }}</p>
<button (click)="signalCounter.set(signalCounter() + 1)">Bump signal</button>
```

**How to run it.**

1. For `@defer`: create a simple `product-reviews` component (`ng generate component product-reviews`) with any text, then wrap it with the `@defer` snippet at the **bottom** of `product-detail.html` (add enough content above it, e.g. `<div style="height: 2000px"></div>`, so you need to scroll).
2. Restart the dev server **without hot reload**: `ng serve --no-hmr`. With the default `ng serve`, hot reload loads deferred code up front and you won't see the split.
3. Open DevTools → Network → JS, reload, scroll down and watch a new `chunk-*.js` file load.
4. For the zoneless experiment: generate an `experiment` component, paste the class and the template, add a route `{ path: 'experiment', component: Experiment }` and open `/experiment`. Wait a few seconds, then click the button.

**Exercise.** Run the experiment above and explain the result. Then change the `@defer` trigger to `on interaction` and see what changes.

- *Hint:* open the Network tab and filter by JS to see when the reviews code is downloaded.
- *Solution:* the screen stays at "Plain: 0" no matter how long you wait, because nothing tells Angular about the plain variable. When you click the button, the signal change triggers a render and the plain counter suddenly jumps to the real value (e.g. 3). Lesson: in zoneless mode the screen only updates when a signal (or an event in the template) asks for it. With `on interaction`, the reviews block only loads when the user clicks or focuses the placeholder.

**Common mistakes.**

- Putting inside `@defer` a component that is also used outside it: the code is not split and deferring has no effect.
- In zoneless mode, changing plain variables and expecting the screen to update. Use signals or, in legacy code, `ChangeDetectorRef.markForCheck()`.

Documentation: [Deferrable views (@defer)](https://angular.dev/guide/templates/defer) · [Zoneless](https://angular.dev/guide/zoneless)

Done when: reviews only load when you scroll (confirmed in the Network tab) and you can explain the experiment's result.

### Step 7 — Forms: reactive forms and Signal Forms

**Concept.** A reactive form is a "model" of the form in code: each field is a `FormControl` that knows its value, whether it is valid and whether the user has touched it. `FormGroup` groups fields, like a form sheet with several lines. Validators are the "inspector" for each line. The storefront uses Reactive Forms in registration, address and checkout, so master this API first. **Signal Forms** are Angular 21's new, signal-based API, still experimental: get to know them, but don't use them in production yet.

**In practice.**

```typescript
export class AddressForm {
  // nonNullable: on reset, fields go back to '' instead of null
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],                      // required, e-mail format
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]], // 12345 or 12345-6789
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();       // makes the error messages show up
      return;
    }
    console.log(this.form.getRawValue()); // { email: '...', zip: '...' }
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="submit()">   <!-- import ReactiveFormsModule -->
  <input formControlName="email" />
  @if (form.controls.email.touched && form.controls.email.hasError('email')) {
    <small>Invalid e-mail</small>
  }
  <input formControlName="zip" />
  @if (form.controls.zip.touched && form.controls.zip.invalid) {
    <small>Enter a valid ZIP code</small>
  }
  <button type="submit">Save</button>
</form>
```

**How to run it.**

1. Run `ng generate component address-form`, paste the class into `address-form.ts` and the HTML into `address-form.html`.
2. Add `ReactiveFormsModule` to the component's `imports`.
3. Add a route `{ path: 'address', component: AddressForm }` and open `http://localhost:4200/address`.
4. Click Save with empty fields (errors appear), fill them in correctly and click again: the values are printed in the browser console.

**Exercise.** Add a `number` field (required, digits only) and disable the button while the form is invalid.

- *Hint:* `Validators.pattern(/^\d+$/)` and `[disabled]` on the button.
- *Solution:* `number: ['', [Validators.required, Validators.pattern(/^\d+$/)]]` and `<button [disabled]="form.invalid">`.

**Common mistakes.**

- Showing the error before the user types: use `touched` or `dirty` in the condition.
- Forgetting to import `ReactiveFormsModule`: error "Can't bind to 'formGroup'".

Documentation: [Reactive Forms](https://angular.dev/guide/forms/reactive-forms) · [Validation](https://angular.dev/guide/forms/form-validation) · [Forms overview, including Signal Forms](https://angular.dev/guide/forms)

Done when: the form validates e-mail, ZIP code and number, and only submits when everything is right.

### Step 8 — SSR and hydration

**Concept.** Without SSR (Server-Side Rendering), the browser gets an empty page and builds everything with JavaScript, like receiving flat-pack furniture. With SSR, the server sends ready-made HTML, the furniture arrives assembled: it shows up faster and search engines can read it (SEO, Search Engine Optimization). **Hydration** is when Angular "turns on the power" of that ready-made HTML in the browser, wiring up clicks and events without redrawing everything. The storefront always runs with SSR in production. The key detail: on the server there is no `window`, `document` or `localStorage`.

**In practice.**

```bash
ng add @angular/ssr                          # adds the server, configuration and hydration
npm run build                                # builds browser and server bundles
npm run serve:ssr:catalog                    # starts the Node server with SSR
```

```typescript
export class LastVisit {
  constructor() {
    // afterNextRender only runs in the BROWSER, after the screen has rendered
    afterNextRender(() => {
      localStorage.setItem('lastVisit', new Date().toISOString());
    });
  }
}

// Alternative: check the platform explicitly
private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
```

**How to run it.**

1. Stop `ng serve` (Ctrl+C) and run `ng add @angular/ssr` in the `catalog` folder; accept the defaults.
2. **Required fix:** open the new `src/app/app.routes.server.ts` and change `RenderMode.Prerender` to `RenderMode.Server`. By default Angular 21 tries to pre-render every route at build time, and the build fails on `product/:id` ("getPrerenderParams is missing").
3. Run `npm run build`, then start the server allowing `localhost` as host: `NG_ALLOWED_HOSTS=localhost npm run serve:ssr:catalog` (on Windows PowerShell: `$env:NG_ALLOWED_HOSTS="localhost"; npm run serve:ssr:catalog`). Without it, the server rejects the request and silently falls back to client rendering.
4. Open `http://localhost:4000`, then right-click → **View page source**: the product titles should be in the HTML. In DevTools you see the same page either way, so the source view is the real test.
5. Keep this terminal visible: server-side errors (like `localStorage is not defined`) appear here, not in the browser.

**Exercise.** Put `localStorage.getItem('x')` directly in a component's constructor, run with SSR and read the error in the terminal. Then fix it.

- *Hint:* the error shows up in the server terminal, not in the browser console.
- *Solution:* the server reports `localStorage is not defined`. Move the read into `afterNextRender` or guard it with `isBrowser`.

**Common mistakes.**

- Assuming it works because `ng serve` showed no error: dev mode can hide SSR problems. Always test with the production build.
- Generating different content on the server and in the browser (e.g. `Math.random()` or the current time in the template): hydration complains about a mismatch.

Documentation: [SSR](https://angular.dev/guide/ssr) · [Hydration](https://angular.dev/guide/hydration) · [Incremental hydration](https://angular.dev/guide/incremental-hydration)

Done when: "View page source" in the browser shows the products in the HTML and the server terminal shows no errors.

### Step 9 — Testing

**Concept.** Tests are a safety net: they guarantee that what worked keeps working after a change, especially during the storefront's monthly upgrades. A test has three beats: **arrange** (set up the scenario), **act** (run it) and **assert** (`expect`). `TestBed` is a "lab Angular" where you swap real dependencies for fake ones (mocks), like a flight simulator. In Angular 21, new projects use Vitest as the test runner; storefront projects generated earlier may use Karma and Jasmine, with nearly identical syntax.

**In practice.**

```typescript
describe('Cart', () => {                       // groups the Cart tests
  it('sums the total', () => {                 // one scenario
    // arrange: create the Cart inside the "lab Angular"
    const cart = TestBed.runInInjectionContext(() => new Cart());
    // act
    cart.add('A', 10);
    cart.add('B', 5);
    // assert
    expect(cart.total()).toBe(15);
  });
});

// Service with fake HTTP: no real request goes out
describe('ProductService', () => {
  it('fetches products', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(ProductService);
    const http = TestBed.inject(HttpTestingController);

    let result: Product[] = [];
    service.list().subscribe((r) => (result = r.products));
    http.expectOne('https://dummyjson.com/products').flush({ products: [{ id: 1, title: 'TV' }] });

    expect(result.length).toBe(1);
  });
});
```

```bash
ng test   # runs the tests and watches for changes
```

**How to run it.**

1. First, delete the `.spec.ts` files that `ng generate` created and you haven't written yourself (`app.spec.ts`, `product-card.spec.ts`, `product-list.spec.ts`...). Their default "should create" tests fail as soon as a component needs inputs, the router or HTTP. From now on you can generate components with `--skip-tests`.
2. Open a second terminal in `catalog` and run `ng test`. It keeps watching files and re-runs on every save (`ng test --watch=false` runs once).
3. Paste the `Cart` test into `cart.spec.ts` and the `ProductService` test into `product.service.spec.ts`. Since `Cart` now uses the NgRx store (Step 5), configure it first: `TestBed.configureTestingModule({ providers: [provideStore({ cart: cartReducer })] });`. `provideHttpClientTesting` and `HttpTestingController` come from `@angular/common/http/testing`.
4. Read the result in the terminal: green ✓ = passed; red ✗ shows the expected and received values. Break a test on purpose (e.g. expect 16) to see a failure.

**Exercise.** Write a test for `removeItem` from Step 5 and another for the limit rule from Step 3.

- *Hint:* for the limit, call `increment()` more times than `max` and check the value of `qty()`.
- *Solution:* create the component with `TestBed.createComponent(QtySelector)`, set the input with `fixture.componentRef.setInput('max', 2)`, call `increment()` three times and expect `qty()` to equal 2.

**Common mistakes.**

- Testing implementation details (a private variable's name) instead of behavior: the test breaks on every refactor.
- Making real HTTP calls in tests: they get slow and flaky. Use `HttpTestingController`.

Documentation: [Testing in Angular](https://angular.dev/guide/testing) · [Testing services](https://angular.dev/guide/testing/services) · [Testing HTTP](https://angular.dev/guide/http/testing) · [Vitest](https://vitest.dev/guide/)

Done when: at least 5 tests pass, including one for a signal, one for a component and one for a service with fake HTTP.

### Phase 2 checkpoint

- [ ] Detail page with `httpResource` and `linkedSignal`, with loading and error states
- [ ] RxJS search converted to a signal
- [ ] NgRx cart read through `selectSignal`, followed in Redux DevTools
- [ ] One `@defer` block and the app working with SSR
- [ ] 5 or more tests passing
- [ ] You can explain this phase's reactivity diagram without looking

## Phase 3 — SAP Commerce and OCC (week 5)

By the end of this phase you will understand the backend from a front-end developer's point of view and run a purchase flow through the API only, with no screen at all.

**The core idea: headless.** SAP Commerce is a "headless" backend: it stores products, prices, carts and orders, but does not draw screens. Think of a restaurant kitchen that only serves through a delivery app. The kitchen (SAP Commerce) cooks; the menu and the orders go through a standard counter, the OCC (Omni Commerce Connect), a REST (Representational State Transfer) API. The storefront is the app the customer uses: it only talks to that counter ([Spartacus repository](https://github.com/SAP/spartacus)).

Even the page **layout** comes from the backend, through the CMS (Content Management System). The diagram below shows how a CMS page becomes components on screen; it is the key to understanding Phase 4.

&#91;embedded content: from CMS page to Angular component · 4 levels on each side\]

A page has a template; the template has slots; each slot has CMS components. The storefront receives this tree through the OCC and, for each component, looks up in the `cmsComponents` mapping which Angular component to render.

### Step 1 — Get access to a backend

**Concept.** To study the front end you need a working "kitchen". The options are a development environment on CCv2 (Commerce Cloud v2, SAP's managed cloud) or a local install with sample data for the storefront. Two names you will use all the time: the **base URL** (the server address) and the **base site** (the store inside it, e.g. `electronics-spa`). One server can host several stores.

**In practice.**

```bash
# lists the stores (base sites) available on the server
curl "https://<host>/occ/v2/basesites"
# in the response, look for "uid": that is the base site name
```

**How to run it.**

1. Easiest: paste `https://<host>/occ/v2/basesites` into the browser address bar. Chrome shows the JSON; tick "Pretty-print" if offered.
2. Or in the terminal: run the `curl` command. Add `| npx json` at the end (`curl ... | npx json`) to get indented, readable JSON.
3. Create `training/occ-calls/commands.sh` and paste every command that worked, with a comment above it. You will reuse them all week.

**Exercise.** Find out, in the response above, which languages and currencies your base site supports.

- *Hint:* look inside `stores` for the `languages` and `currencies` fields.
- *Solution:* each base site lists its stores; in each store, `languages[].isocode` and `currencies[].isocode` hold the codes (e.g. `en`, `USD`). You will use them in the Phase 4 configuration.

**Common mistakes.**

- Certificate error on a local environment: the server uses HTTPS with a self-signed certificate. For study purposes, use `curl -k`; in the browser, accept the certificate once.
- Confusing the base site name with the catalog name: they are different things (`electronics-spa` versus `electronicsProductCatalog`).

Documentation: [Composable Storefront on the SAP Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), Getting Started section, page "Setting Up SAP Commerce Cloud for use with Composable Storefront"

Done when: you have the base URL, base site, languages and currencies written down.

### Step 2 — Domain concepts

**Concept.** Before opening the API, learn the "kitchen" vocabulary:

- **Base site**: the store; defines catalogs, languages and currencies.
- **Catalog and versions**: every catalog exists in two versions. *Staged* is the draft, where editing happens; *Online* is what customers see. **Synchronization** copies the draft to the published version, like "publishing" a blog post.
- **Product, variant, price and stock**: separate entities in the backend (a T-shirt is the base product; "blue, M" is the variant). The OCC combines everything in the response.
- **Product catalog versus content catalog**: one stores products; the other stores CMS pages and components. Each has its own Staged and Online versions.

**How to run it.**

1. Open Backoffice at `https://<backend>/backoffice` and log in with the credentials from whoever manages the environment.
2. Left menu: Catalog → Products. Search for a product, pick the row whose catalog version is **Staged**, edit the name and click Save.
3. Call the product in the API (`$BASE/products/<code>`): the old name is still there.
4. Synchronize: Catalog → Catalogs → select the product catalog → **Synchronize** (Staged → Online). Call the API again.

**Exercise.** In Backoffice (SAP Commerce's admin interface), change a product's name in the Staged version and check whether it changes in the API.

- *Hint:* the public API reads the Online version.
- *Solution:* the name only changes in the API after the product catalog is synchronized. This is the number one reason for "my change didn't show up".

**Common mistakes.**

- Editing the Online version directly: the next synchronization overwrites the change.
- Forgetting that content (CMS) and products are synchronized separately.

Documentation: [SAP Commerce Cloud on the SAP Help Portal](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD) · [SAP Learning](https://learning.sap.com) (search for "SAP Commerce Cloud")

Done when: you can explain the difference between Staged and Online and between the two catalog types.

### Step 3 — Explore the OCC with Swagger

**Concept.** Swagger UI is the OCC's "interactive menu": it lists every endpoint, its parameters and response formats, and lets you try each call in the browser. The `fields` parameter controls the response size: `BASIC` (minimal), `DEFAULT` (common) or `FULL` (everything). You can also list specific fields, which is exactly what the storefront does to avoid transferring useless data.

**In practice.**

```bash
BASE=https://<host>/occ/v2/electronics-spa   # variable so you don't repeat the address

# text search; "query" is the term and "fields" the response size
curl "$BASE/products/search?query=camera&fields=DEFAULT"

# product detail with every field
curl "$BASE/products/<code>?fields=FULL"

# only the fields you need: code, name and formatted price
curl "$BASE/products/<code>?fields=code,name,price(formattedValue)"
```

Swagger usually lives at `https://<host>/occ/v2/swagger-ui/index.html` (the path may vary by version).

**How to run it.**

1. In the terminal, first set the variable: `BASE=https://<host>/occ/v2/electronics-spa` (it lasts until you close the terminal; save it at the top of `commands.sh`).
2. To get a real product code, run the search command and copy a `code` from the response.
3. In Swagger: open the URL, expand a group (e.g. "Products"), click an endpoint → **Try it out** → fill in `baseSiteId` with `electronics-spa` → **Execute**.
4. Postman alternative: Import → Raw text → paste the `curl` (replace `$BASE` with the full address first).

**Exercise.** Compare the size of the `BASIC`, `DEFAULT` and `FULL` responses for the same product.

- *Hint:* `curl -s ... | wc -c` counts bytes.
- *Solution:* `FULL` is usually several times larger. That is why the storefront only asks for the fields each screen uses, and why, in Phase 4, you will need to *add* a new field to the list when you create a custom attribute.

**Common mistakes.**

- Leaving the base site out of the URL (`/occ/v2/products/...`): you get a 404.
- Copying URLs with spaces without encoding them: use `%20` or let the browser or Swagger build the URL.

Done when: you can find in Swagger the endpoint groups for products, carts, users and orders.

### Step 4 — OAuth2 authentication

**Concept.** OAuth2 (Open Authorization 2.0) works like an event wristband: you identify yourself once at the entrance (login) and get a wristband, the **token**. After that, you show the wristband at each restricted area, without repeating your password. Public endpoints (catalog, search) don't need a wristband; user endpoints (profile, orders, saved cart) do. The storefront handles all of this automatically, but you need to understand it to debug 401 errors.

**In practice.**

```bash
# 1. trade username and password for a token ("password" grant type; for study only)
#    requires the legacy "mobile_android" client to exist in the backend
curl -X POST "https://<host>/authorizationserver/oauth/token" \
  -d "client_id=mobile_android&client_secret=secret" \
  -d "grant_type=password&username=<email>&password=<password>"
# response: { "access_token": "abc...", "expires_in": 43199, ... }

# 2. use the token in the Authorization header
curl -H "Authorization: Bearer <access_token>" "$BASE/users/current"
```

**Which client does the storefront use?** Current versions log users in with the **Authorization Code flow** (the user types the password on the authorization server's own login page) and the public client `mobile_android_public`. This is controlled by the feature toggle `authorizationCodeFlowByDefault`, enabled by default and meant for CCv2 authorization servers from the September 2025 update on. Older setups use the `mobile_android` client with the password grant, which is what the `curl` above simulates; it is the easiest way to get a token by hand for study. Ask whoever manages the backend which clients exist. `expires_in` tells you in how many seconds the wristband expires.

**How to run it.**

1. You need a test customer. Easiest: register one through the storefront's "Sign in / Register" page, or ask for test credentials.
2. Run the token command and copy the `access_token` value (without quotes).
3. Save it in a variable to avoid pasting it every time: `TOKEN=<paste here>`, then `curl -H "Authorization: Bearer $TOKEN" "$BASE/users/current"`.
4. In Postman: Authorization tab → Type "Bearer Token" → paste the token.

**Exercise.** Call `/users/current` without the header and then with an invalid token. Write down the response codes.

- *Hint:* `curl -i` shows the HTTP status.
- *Solution:* both return 401 (unauthorized). In the storefront, an unexpected 401 is almost always an expired token or a misconfigured client.

**Common mistakes.**

- `mobile_android (or mobile_android_public)` client not registered in the backend: `invalid_client` error.
- Forgetting the word `Bearer` before the token.

Done when: you get a token, call `/users/current` and can explain what a 401 is.

### Step 5 — Cart flow through the API only

**Concept.** Every purchase flow in the storefront is a sequence of OCC calls. Doing the flow "by hand" shows what the storefront does behind each click. For visitors who are not logged in, the cart is **anonymous** and identified by a `guid`, like a coat-check ticket: whoever has the ticket can access the cart.

**In practice.**

```bash
# 1. create an anonymous cart (keep the "guid" from the response)
curl -X POST "$BASE/users/anonymous/carts"

# 2. add an item: JSON (JavaScript Object Notation) body with code and quantity
curl -X POST "$BASE/users/anonymous/carts/<guid>/entries" \
  -H "Content-Type: application/json" \
  -d '{"product": {"code": "<code>"}, "quantity": 1}'

# 3. view the full cart, with totals calculated by the backend
curl "$BASE/users/anonymous/carts/<guid>?fields=FULL"
```

**How to run it.**

1. Run the first command and copy the `guid` from the response; store it: `GUID=<paste here>`.
2. In the other commands, replace `<guid>` with `$GUID` and `<code>` with a real product code from Step 3.
3. Run the commands in order and read the full cart at the end: look for `entries`, `totalItems` and `totalPrice`.
4. Save the sequence in `commands.sh`: it is your checkpoint evidence.

**Exercise.** Change the item quantity to 3 and then remove it.

- *Hint:* each cart item has an entry number (`entryNumber`) starting at 0. Look in Swagger for the PATCH and DELETE methods on `entries`.
- *Solution:*

```bash
curl -X PATCH "$BASE/users/anonymous/carts/<guid>/entries/0" \
  -H "Content-Type: application/json" -d '{"quantity": 3}'
curl -X DELETE "$BASE/users/anonymous/carts/<guid>/entries/0"
```

**Common mistakes.**

- Using the cart `code` instead of the `guid` for anonymous carts: logged-in users use the `code`; anonymous ones use the `guid`.
- A "wrong" price or total: the backend does the math (promotions, taxes). The front end only displays it.

Done when: you create, change and empty a cart through the API only, with the commands saved in a file.

### Step 6 — How a CMS page reaches the screen

**Concept.** This is the diagram from the start of this phase, in practice. A CMS page works like a house plan: the **template** is the type of plan ("single-story, 3 bedrooms"); the **slots** are the rooms; the **components** are the furniture in each room. The content team swaps furniture through Backoffice or SmartEdit (the visual page editor) without a front-end deploy.

**In practice.**

```bash
curl "$BASE/cms/pages?pageType=ContentPage&pageLabelOrId=homepage"
```

```text
{
  "template": "LandingPage2Template",              ← the type of plan
  "contentSlots": {
    "contentSlot": [
      {
        "position": "Section1",                    ← a room (slot)
        "components": {
          "component": [
            {
              "uid": "ElectronicsHompageSplashBannerComponent",   ← THIS banner
              "typeCode": "SimpleResponsiveBannerComponent"       ← the TYPE of furniture
            }
          ]
        }
      }
    ]
  }
}
```

Above is a simplified response with notes on the right (they don't exist in the real response). What matters: `template`, the `position` of each slot and the `typeCode` of each component. The storefront uses the `typeCode` to choose the Angular component.

**The storefront's own call.** The 221121 storefront asks for pages on a user-scoped path: `$BASE/users/anonymous/cms/pages` (or `users/current/...` after login), and for the home page it sends no `pageLabelOrId` at all. The response has the same structure; it also brings the header and footer slots (`SiteLogo`, `SearchBox`, `MiniCart`, `NavigationBar`, `Footer`...), which every page shares through its template. When you look for CMS calls in DevTools → Network, filter by `cms/pages`, not by the full path above.

**How to run it.**

1. Run the `curl` and pipe it to a file to read calmly: `curl "$BASE/cms/pages?pageType=ContentPage&pageLabelOrId=homepage" > home.json`, then open `home.json` in VS Code and use **Format Document** (Shift+Alt+F).
2. Use Ctrl+F in VS Code to find `"template"`, then each `"position"` and `"typeCode"`.
3. For the exercise, SmartEdit is the visual way: open `https://<backend>/smartedit`, pick the electronics site and the home page, double-click a banner to edit it.
4. Synchronize the **content** catalog (in SmartEdit: the sync panel; in Backoffice: Catalog → Catalogs → the content catalog → Synchronize) and call the API again.

**Exercise.** In Backoffice or SmartEdit, change the text or image of a home page banner, synchronize the **content catalog** and check the change in the API.

- *Hint:* the electronics content catalog is called `electronics-spaContentCatalog`.
- *Solution:* after synchronization, the component shows up with the new data in the same `cms/pages` call. If it doesn't, check that you edited the Staged version and synchronized.

**Common mistakes.**

- Confusing `uid` (the instance, "this banner") with `typeCode` (the type, "a banner"). The storefront mapping uses the type.
- Expecting to see the change in the front end without synchronizing.

Documentation: [Customizing CMS Components](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/eaef8c61b6d9477daf75bff9ac1b7eb4/864a3158bf9f49c99e6196e4e0d27323.html) (read the introduction now; the rest is for Phase 4)

Done when: you redraw this phase's diagram for the home page with the real template, slot and typeCode names.

### Step 7 — CORS and the local environment

**Concept.** CORS (Cross-Origin Resource Sharing) is the browser's doorman. When a page on `localhost:4200` tries to call a server at another address, the browser asks the server: "can this visitor come in?". If the origin is not on the server's guest list, the browser blocks the call. Note: `curl` works and the browser doesn't, because only browsers enforce CORS.

**In practice.**

```properties
# SAP Commerce local.properties: the OCC's "guest list"
corsfilter.commercewebservices.allowedOrigins=http://localhost:4200 https://localhost:4200
# the storefront also sends its own headers (e.g. x-anonymous-consents): they must be allowed
corsfilter.commercewebservices.allowedHeaders=origin content-type accept authorization cache-control x-anonymous-consents x-profile-tag-debug x-consent-reference occ-personalization-id occ-personalization-time
# and the ones the storefront reads from the responses must be exposed
corsfilter.commercewebservices.exposedHeaders=x-anonymous-consents occ-personalization-id occ-personalization-time
```

On CCv2, these settings live in the environment properties; ask whoever manages the backend. The origin is the most common gap, but a missing header gives a blank storefront just the same.

**How to run it.**

1. Open any website (e.g. `https://angular.dev`) in Chrome.
2. Press F12 → **Console** tab.
3. Paste the `fetch(...)` command with your backend address and press Enter. If Chrome asks you to type "allow pasting", type it and paste again.
4. Read the red message. Then run the same URL with `curl` in the terminal and notice it works: the difference is the browser.

**Exercise.** Open the browser console on any page and run `fetch('https://<host>/occ/v2/basesites')`. Read the message.

- *Hint:* the message mentions "Access-Control-Allow-Origin".
- *Solution:* if the page's origin is not allowed, you get a CORS error. That is the error you will see if the local storefront points to a backend that doesn't know `localhost:4200`.

**Common mistakes.**

- Trying to "fix" CORS in Angular code: the fix is always on the server.
- Allowing `http` but browsing over `https` (or the other way around): the origin includes protocol and port.
- Allowing the origin but not the headers: the console says `Request header field x-anonymous-consents is not allowed by Access-Control-Allow-Headers in preflight response`. Add the header to `allowedHeaders`.

Documentation: [Composable Storefront on the SAP Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), page "Cross-Origin Resource Sharing (CORS)"

Done when: you can recognize a CORS error and know where to fix it.

### Phase 3 checkpoint

- [ ] Search, detail and full cart flow (create, change, remove) through the API, with commands saved
- [ ] OAuth2 token obtained and used; you can explain a 401 error
- [ ] Home page diagram with the real template, slot and typeCode names
- [ ] You can explain Staged versus Online and why a change "didn't show up"

## Phase 4 — Composable Storefront (weeks 6 to 8)

By the end of this phase you will install the storefront, understand its architecture and customize it using only the official extension points.

**The core idea: extend, never edit.** The storefront ships as npm libraries, and SAP publishes updates every month. Think of a rental car: you can change the floor mats, add a phone holder and adjust the seats, but you don't open the engine, because the rental company swaps the engine at every service. That is why every customization goes through **configuration** (`provideConfig`), **CMS component mapping**, **outlets** or **service replacement** via dependency injection. Copying files out of the libraries into your project breaks upgrades.

**Where the documentation is.** The official, current source is the [Composable Storefront SAP Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT) (Storefront Development Guide). The [sap.github.io/spartacus-docs](https://sap.github.io/spartacus-docs/) site covers the open-source 4.x version and is no longer maintained, but it explains the concepts well; use it as support and confirm details on the Help Portal. When in doubt, the [source code on GitHub](https://github.com/SAP/spartacus) is the final reference.

The diagram below shows the path a piece of data takes inside the storefront. Keep it handy: almost every "where does this come from?" question is answered by it.

&#91;embedded content: storefront layers · from component to OCC\]

You work in two layers: at the top, consuming facades in your components; and second from the bottom, adjusting endpoints and converters when the backend brings new data. The layers in between belong to the storefront.

### Week 6 — Installation and architecture

#### Step 1 — Library access through RBSC

**Concept.** The official storefront libraries are not on the public npm registry: they live on RBSC (Repository-Based Shipment Channel), SAP's private npm repository, open to SAP Commerce Cloud customers. Think of a wholesaler that only sells to card-holding members. The `.npmrc` file is where you tell npm: "`@spartacus` packages come from this wholesaler, and here is my member card".

**In practice.**

```ini
# .npmrc at the project root
# 1. packages starting with @spartacus come from RBSC
@spartacus:registry=https://73554900100900004337.npmsrv.base.repositories.cloud.sap/
# 2. technical user credential (user:password in base64)
//73554900100900004337.npmsrv.base.repositories.cloud.sap/:_auth=<base64 of user:password>
# 3. always send the credential
always-auth=true
```

```bash
# generate the base64 credential (Linux/macOS)
echo -n 'user:password' | base64
```

**How to run it.**

1. Get the technical user and password for RBSC from your project lead.
2. In the terminal, run the `echo ... | base64` command with them and copy the result.
3. The `.npmrc` goes in the root of the project you will create in Step 2 (`training/mystore/`). Create the folder now if needed and save the file there with the base64 value in place of `<base64 of user:password>`.
4. From that folder, run `npm view @spartacus/core versions`.

**Exercise.** List the available versions of `@spartacus/core` and find the latest in the 221121 line.

- *Hint:* `npm view <package> versions`.
- *Solution:* `npm view @spartacus/core versions --json` lists them all; the last `221121.x` is the one you will install.

**Common mistakes.**

- 401 or 404 on install: wrong credential or `.npmrc` in the wrong folder.
- Committing `.npmrc` with the password: use environment variables or keep the file out of Git.

Documentation: [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), page "Installing Composable Storefront Libraries from the Repository Based Shipment Channel" (confirm the exact registry URL there)

Done when: `npm view @spartacus/core versions` returns the list of versions.

#### Step 2 — Create the app with schematics

**Concept.** Schematics are "automatic recipes" for the Angular CLI: instead of you following 30 installation steps, `ng add` installs the libraries, creates the configuration files and imports the styles. It is the same mechanism that will run upgrades (`ng update`) in Phase 5.

**In practice.**

```bash
# 1. empty Angular app
#    --file-name-style-guide=2016: the schematic looks for app.component.ts,
#    and Angular 21 would otherwise name it app.ts
ng new mystore --style=scss --ssr=false --file-name-style-guide=2016
cd mystore

# 2. install and configure the storefront
#    --baseUrl:  base URL from Phase 3, Step 1
#    --baseSite: the store
#    --currency / --language: defaults
#    --ssr:      sets up SSR right away
ng add @spartacus/schematics@<version-221121.x> \
  --baseUrl https://<host> \
  --baseSite electronics-spa \
  --currency usd --language en \
  --ssr

# 3. start the app
npm start
```

The schematic asks interactive questions about which features to install (cart, checkout, user...). For learning, accept the defaults.

**How to run it.**

1. From `training/`, run `ng new mystore ...`, then copy your `.npmrc` from Step 1 into `mystore/`.
2. Inside `mystore/`, run the `ng add` command with your backend address and the exact version from Step 1. Answer the prompts with Enter.
3. **Fix the test setup** the schematic leaves behind (otherwise `ng test` fails in Phase 5): open `angular.json`, find `projects → mystore → architect → test` and delete its `stylePreprocessorOptions`, `styles` and `assets` (they are Karma options; Angular 21 tests run on Vitest). Also delete `src/app/app.component.spec.ts`: it looks for the `<h1>` of the page you just replaced.
4. **Windows only:** if the build says `Can't find stylesheet to import` for `'..\..\styles-config'`, open the files in `src/styles/spartacus/` and change the backslashes in that first `@import` to `/` (`'../../styles-config'`). On macOS, Linux and WSL this doesn't happen.
5. Run `npm start` and open `http://localhost:4200`. The first load can take a minute.
6. Commit right away (`git add . && git commit -m "phase4-install"`): this clean install is your safe point to return to.

**Exercise.** After installing, open `package.json` and list which `@spartacus/*` packages were added.

- *Hint:* look under `dependencies`.
- *Solution:* you will see `@spartacus/core`, `@spartacus/storefront`, `@spartacus/styles`, `@spartacus/assets` and the feature libraries you chose (e.g. `@spartacus/cart`, `@spartacus/checkout`, `@spartacus/user`). All on the same version; mixing versions breaks the app.

**Common mistakes.**

- Schematic version that doesn't match the supported Angular version: follow the compatibility matrix.
- `Could not find app.component.ts file. Please re-create your application`: the app was created without `--file-name-style-guide=2016`. Delete the folder and run `ng new` again with the flag.
- `ng test` says `Data path "" must NOT have additional properties(stylePreprocessorOptions)`: item 3 of "How to run it" was skipped.
- Blank screen with CORS errors in the console: the backend hasn't allowed `localhost:4200` or one of the storefront's headers (Phase 3, Step 7).

Documentation: [Schematics (concepts and flags)](https://sap.github.io/spartacus-docs/schematics/) · [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), pages "Building the Composable Storefront From Libraries" and "Schematics"

Done when: the `electronics-spa` home page opens at `localhost:4200` with real products.

#### Step 3 — Read the generated configuration

**Concept.** Almost everything in the storefront is configurable through `provideConfig`, and configurations from several places are **merged**, like transparent overlays: SAP provides the default layer and you put yours on top, changing only what you need. *Feature modules* are like rooms with closed doors: the checkout code is only downloaded when the user enters checkout (lazy loading).

**In practice.**

```typescript
// src/app/spartacus/spartacus-configuration.module.ts (excerpt)
provideConfig(<OccConfig>{
  backend: { occ: { baseUrl: 'https://<host>' } },   // where the OCC lives
}),
provideConfig(<SiteContextConfig>{
  context: {
    baseSite: ['electronics-spa'],                    // store(s)
    currency: ['USD'],                                // the first one is the default
    language: ['en'],
    urlParameters: ['baseSite', 'language', 'currency'], // shown in the URL: /electronics-spa/en/USD/
  },
}),
```

The generated file has no `urlParameters` line: without it the context is not in the URL, and you switch language with the selector in the header. Add the line if you want to see it in the URL.

Also open `spartacus-features.module.ts`: each import there is a feature (cart, checkout, user), loaded on demand.

**How to run it.**

1. Open `src/app/spartacus/spartacus-configuration.module.ts` in VS Code and find the `SiteContextConfig` block.
2. Change the `language` array, save, and wait for `npm start` to rebuild.
3. Look at the URL in the browser and at the header texts.
4. Undo the change afterwards (or commit it on a separate branch) so the next steps start from the default configuration.

**Exercise.** Add German (`de`) and make it the default. See what changes in the URL and in the texts.

- *Hint:* the order of the array matters.
- *Solution:* `language: ['de', 'en']`, and in the `I18nConfig` block of the same file register the German texts next to the English ones: `resources: { en: translationsEn, de: translationsDe }` (both from `@spartacus/assets`). The language must also be active on the base site, as you saw in Phase 3, Step 1. With `urlParameters`, the URL now has `/de/`. Without the German resources, the selector says German but the texts stay in English.

**Common mistakes.**

- Configuring a language or currency the base site doesn't support: the page loads with no content or with an error.
- Repeating `provideConfig` with conflicting values in different modules and not knowing which one wins: the last registered configuration wins.

Documentation: [Site context configuration](https://sap.github.io/spartacus-docs/automatic-context-configuration/) · [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), pages "Reference App Structure" and "Configuring the Base URL"

Done when: you change the default language and can explain what each feature module loads.

#### Step 4 — Use facades with signals

**Concept.** Look at the layers diagram above again. The **facade** is a hotel front desk: you ask for "towels in room 302" and don't need to know whether they come from the laundry or the storeroom. Your component asks for "the active cart" and the facade takes care of the store, the connector and the OCC. Facades are the **stable** part of the storefront: SAP avoids changing their signatures between versions, which is why code that only uses facades survives upgrades. They return Observables; convert them with `toSignal`, as in Phase 2.

**In practice.**

```typescript
import { ActiveCartFacade } from '@spartacus/cart/base/root'; // facades live in the "/root" packages

@Component({
  selector: 'app-cart-badge',
  template: `<span>{{ totalItems() }} items</span>`,
})
export class CartBadge {
  private activeCart = inject(ActiveCartFacade);   // asks Angular for the facade (DI)

  totalItems = toSignal(
    this.activeCart.getActive().pipe(               // Observable<Cart> of the active cart
      map((cart) => cart.totalItems ?? 0),          // takes just the item count
    ),
    { initialValue: 0 },                            // shows 0 before loading
  );
}
```

Put the badge on screen with an outlet (Step 6) or inside a component you have already mapped.

**How to run it.**

1. Create the custom module from "How to run the exercises" (`src/app/custom/custom.module.ts`) if you haven't yet, and import it in `app.module.ts`.
2. Generate the badge: `ng generate component custom/cart-badge --type= --inline-template --inline-style --skip-tests` and paste the snippet into `cart-badge.ts`. The project uses the 2016 file names, so without `--type=` the file would be `cart-badge.component.ts`.
3. Show it temporarily at the top of `app.component.html`: `<app-cart-badge />` (Step 6 moves it to the right place). The generated root component (`App` in `app.component.ts`) is standalone even though the storefront itself is configured through `app.module.ts`, so add `CartBadge` to the `imports` of `App`.
4. Add a product to the cart in the storefront and watch the badge number change.

**Exercise.** Also show the cart's formatted total value.

- *Hint:* the `Cart` object has `totalPrice` with `formattedValue`.
- *Solution:* `total = toSignal(this.activeCart.getActive().pipe(map((c) => c.totalPrice?.formattedValue ?? '')), { initialValue: '' });`

**Common mistakes.**

- Importing from internal paths (e.g. `@spartacus/cart/base/core`) instead of `/root`: it works today and breaks on upgrade.
- Injecting the NgRx `Store` and reading the storefront state directly: that is the "back door"; use the facade.

Documentation: [Connecting to Other Systems (connectors, adapters, converters)](https://sap.github.io/spartacus-docs/connecting-to-other-systems/) · [Facade source code on GitHub](https://github.com/SAP/spartacus)

Done when: the badge shows the real item count and total, and you can redraw the layers diagram with the cart's class names.

### Week 7 — CMS and visual customization

#### Step 5 — Replace a CMS component

**Concept.** Go back to the CMS diagram in Phase 3: each `typeCode` becomes an Angular component through the `cmsComponents` mapping. Replacing a component means swapping one type of "furniture" across the whole house: you say "wherever the CMS asks for `ProductSummaryComponent`, use my component". The rest of the page stays the storefront's, and the content team can still move the component around in SmartEdit. The PDP (Product Details Page) is built entirely this way.

**In practice.**

```typescript
import { CurrentProductService } from '@spartacus/storefront';

@Component({
  selector: 'app-custom-product-summary',
  template: `
    @if (product(); as p) {                        <!-- only renders once the product has arrived -->
      <h2>{{ p.name }}</h2>
      <p class="price">{{ p.price?.formattedValue }}</p>
      <p [innerHTML]="p.summary"></p>              <!-- summary comes with HTML from the backend -->
    }
  `,
})
export class CustomProductSummary {
  // CurrentProductService knows which product is in the PDP URL
  product = toSignal(inject(CurrentProductService).getProduct());
}

// Registration: "wherever the CMS asks for ProductSummaryComponent, use CustomProductSummary"
provideConfig(<CmsConfig>{
  cmsComponents: {
    ProductSummaryComponent: { component: CustomProductSummary },
  },
}),
```

For components that receive **data from the CMS itself** (e.g. a banner with an image and link set in Backoffice), inject `CmsComponentData`:

```typescript
export class CustomBanner {
  // CmsComponentData delivers the fields the content team filled in
  private componentData = inject<CmsComponentData<CmsBannerComponent>>(CmsComponentData);
  data = toSignal(this.componentData.data$);   // data()?.headline, data()?.media...
}
```

**How to run it.**

1. Run `ng generate component custom/custom-product-summary --type= --inline-template --inline-style --skip-tests` and paste the component part of the snippet into its `.ts` file.
2. Paste the `provideConfig(<CmsConfig>{...})` part into the `providers` of `CustomModule`.
3. Open any product page in the storefront (click a product on the home page).
4. Right-click your summary → Inspect: the element should be `app-custom-product-summary` instead of the storefront's original.

**Exercise.** Replace `ProductSummaryComponent` and add a "Free shipping" badge when the price is above 200.

- *Hint:* `p.price?.value` holds the number; a `computed` keeps the template clean.
- *Solution:* `freeShipping = computed(() => (this.product()?.price?.value ?? 0) > 200);` and `@if (freeShipping()) { <span>Free shipping</span> }`.

**Common mistakes.**

- Misspelling the `typeCode` (capitalization, plural): nothing happens and no error shows up. Check the name in the `cms/pages` response.
- Copying the library's original component "to start from it": it becomes your code to maintain on every upgrade. Start from scratch and reuse services and facades.

Documentation: [Customizing CMS Components (Help Portal)](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/eaef8c61b6d9477daf75bff9ac1b7eb4/864a3158bf9f49c99e6196e4e0d27323.html) · [Product Details Page (Help Portal)](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/eaef8c61b6d9477daf75bff9ac1b7eb4/98d213e86e514b79b119a6eff0cfda1d.html) · [Code examples (spartacus-docs)](https://sap.github.io/spartacus-docs/customizing-cms-components/)

Done when: the PDP shows your summary with the badge, and the rest of the page stays the same.

#### Step 6 — Outlets

**Concept.** If Step 5 swaps the whole piece of furniture, an outlet is placing a decoration on top of it, before or after it, or swapping just that piece in one specific spot. The storefront leaves named "sockets" all over the screen (slot names, component names and a few fixed points such as `cx-header`). You plug your content into the right socket. Use outlets for small additions; to replace a CMS component, prefer Step 5.

**In practice.**

```typescript
// app.component.ts — the root component is standalone: import the directive and expose the enum
import { OutletPosition, OutletRefDirective, StorefrontComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-root',
  imports: [StorefrontComponent, OutletRefDirective],
  templateUrl: './app.component.html',
})
export class App {
  // cxOutletPos expects the OutletPosition enum (BEFORE, AFTER, REPLACE), not a plain string
  protected readonly OutletPosition = OutletPosition;
}
```

```html
<!-- app.component.html (or another component that is always loaded) -->

<!-- BEFORE: shows up before the add-to-cart component -->
<ng-template cxOutletRef="ProductAddToCartComponent" [cxOutletPos]="OutletPosition.BEFORE">
  <p class="shipping">Free shipping over $200</p>
</ng-template>

<!-- no cxOutletPos = "replace": replaces the whole footer -->
<ng-template cxOutletRef="cx-footer">
  <app-my-footer />
</ng-template>
```

To find socket names, inspect the page in the browser: `cx-page-slot` elements carry the slot position as a class, and components show up as `cx-*` tags.

**How to run it.**

1. Open `src/app/app.component.html`: it usually contains only `<cx-storefront />`. Paste the `ng-template` blocks **below** it.
2. In `src/app/app.component.ts`, add `OutletRefDirective` to the `imports` and the `OutletPosition` field, as in the TypeScript snippet. (In an app whose root component is declared in an NgModule, import `OutletRefModule` in that module instead.)
3. Open a product page and look next to the "Add to cart" button.
4. To discover outlet names, right-click any area → Inspect, and look at the `cx-*` tag or the slot class on the nearest `cx-page-slot`.

**Exercise.** Show the shipping message *after* the button instead of before. Then add the `CartBadge` from Step 4 next to the mini cart.

- *Hint:* change `cxOutletPos`. The mini cart is the `MiniCartComponent`.
- *Solution:* `[cxOutletPos]="OutletPosition.AFTER"` on the first; `<ng-template cxOutletRef="MiniCartComponent" [cxOutletPos]="OutletPosition.AFTER"><app-cart-badge /></ng-template>` for the second (with `CartBadge` in the `imports` of `App`).

**Common mistakes.**

- Placing the `ng-template` in a component that only shows on some pages: the outlet disappears on the others.
- Using `replace` by accident (forgetting `cxOutletPos`) and "losing" a component.
- Writing `cxOutletPos="after"`: the generated app uses strict template checking, so the build fails with `Type '"after"' is not assignable to type 'OutletPosition'`. Bind the enum: `[cxOutletPos]="OutletPosition.AFTER"`.

Documentation: [SAP Learning video: Extending the Storefront with Outlets](https://learning.sap.com/videos/extending-the-sap-commerce-cloud-composable-storefront-with-outlets) · [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), page "Outlets"

Done when: the message shows after the button and the badge next to the mini cart.

#### Step 7 — Layout per page template

**Concept.** The CMS says *which* slots a page has; the front end's `LayoutConfig` says *in what order* they appear, and can change that order by screen size. Analogy: the furniture is the same, but in a small apartment (phone) you arrange it differently than in a big house (desktop). Breakpoints: `xs` (phone), `sm`, `md`, `lg`, `xl` (wide screens).

**In practice.**

```typescript
provideConfig(<LayoutConfig>{
  layoutSlots: {
    ProductDetailsPageTemplate: {                  // template name, as it comes from the CMS
      // default: used when neither this breakpoint nor a smaller one has its own rule
      slots: ['Summary', 'Tabs', 'UpSelling', 'CrossSelling', 'PlaceholderContentSlot'],
      // on large screens, recommendations move up right after the summary
      lg: { slots: ['Summary', 'UpSelling', 'CrossSelling', 'Tabs', 'PlaceholderContentSlot'] },
    },
  },
}),
```

**How a breakpoint picks its rule.** The storefront first looks for a rule for the current breakpoint; if there is none, it takes the rule of the closest **smaller** breakpoint that has one, and only then the default `slots`. So an `xs` rule also applies to `sm` and `md`, unless they have their own.

**How to run it.**

1. Paste the `provideConfig(<LayoutConfig>{...})` into `CustomModule`'s `providers` and save.
2. Open a product page on a wide window and note the order of the sections.
3. Open DevTools → toggle the device toolbar (Ctrl+Shift+M) → pick a phone size and reload, then a tablet size (768 px wide) and reload again.
4. Compare the slot names with the `cms/pages` response for a product page if something disappears. A quick check in the console: `[...document.querySelectorAll('cx-page-layout > cx-page-slot')].map(s => s.getAttribute('position'))`.

**Exercise.** Hide the `CrossSelling` slot on phones only.

- *Hint:* a slot left out of the list isn't rendered. Then check a tablet too: remember how a breakpoint picks its rule.
- *Solution:* add `xs: { slots: ['Summary', 'Tabs', 'UpSelling', 'PlaceholderContentSlot'] }` **and** `md: { slots: ['Summary', 'Tabs', 'UpSelling', 'CrossSelling', 'PlaceholderContentSlot'] }`. Without the `md` rule, tablets inherit the `xs` list and lose CrossSelling too.

**Common mistakes.**

- Leaving a slot out of the list: its content disappears silently. Cross-check with the `cms/pages` response.
- Expecting a breakpoint without its own rule to use the default `slots`: it uses the closest smaller rule first.
- Using layout to hide content that should be removed in the CMS: the data is still loaded.

Documentation: [Page Layout (concepts and examples)](https://sap.github.io/spartacus-docs/page-layout/) · [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), page "Page Layout"

Done when: the order changes on desktop, CrossSelling disappears on phones (but not on tablets) and everything else stays the same.

#### Step 8 — Styles and theme

**Concept.** The storefront uses SCSS and global CSS (Cascading Style Sheets) variables prefixed with `--cx-`. They work like a house's paint palette: changing the "primary color" paint repaints every button, link and highlight at once. Rewriting each component's style would be repainting wall by wall, and every upgrade could peel the paint off.

**In practice.**

```scss
// src/styles.scss — overrides the global "palette" (paste at the END of the file)
:root {
  --cx-color-primary: #0a6ed1;          // buttons, links and highlights
  --cx-color-secondary: #354a5f;
}

// the storefront has no font variable: set the font on body and every component inherits it
body {
  font-family: 'Inter', sans-serif;
}

// targeted tweak: only the shipping message from Step 6
.shipping {
  color: var(--cx-color-success);       // reuses a palette color
  font-weight: 600;
}
```

**How to run it.**

1. Open `src/styles.scss` and paste the `:root` block at the **end** of the file (after the storefront style imports), so your values win.
2. Save and look at buttons and links on any page.
3. For the exercise, in DevTools → Elements select `<html>` and scroll the Styles panel to see every `--cx-*` variable and its current value. You can edit a value there to preview before changing the file.

**Exercise.** Find the name of the variable that sets the default text color and change it.

- *Hint:* in DevTools, select `:root` (or `html`) and look at the `--cx-color-*` variables listed under Styles.
- *Solution:* look for the text variables among the `--cx-color-*` ones and override it in `:root`. The exact name may vary by version, which is why investigating in DevTools is the exercise.

**Common mistakes.**

- Using `!important` to "beat" the default style: it turns into a specificity war. Prefer the variables.
- Styling through components' internal classes: they can change on upgrades.

Documentation: [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), pages "Styling and Theming" and "CSS Architecture" · "Styling with Global Variables" video on [SAP Learning](https://learning.sap.com)

Done when: the primary color and font change across the whole site with a few lines.

#### Step 9 — Translations (i18n)

**Concept.** i18n (internationalization; 18 letters between the "i" and the "n") means taking texts out of the code and putting them in per-language "dictionaries". The component asks for a **key** (`shipping.freeAbove`) and the storefront returns the text in the active language. Texts are grouped into **chunks**, like dictionary chapters, so only what is needed gets loaded.

**In practice.**

```typescript
provideConfig(<I18nConfig>{
  i18n: {
    resources: {
      // language → chunk → keys
      en: { custom: { shipping: { freeAbove: 'Free shipping over {{ value }}' } } },
      de: { custom: { shipping: { freeAbove: 'Kostenloser Versand ab {{ value }}' } } },
    },
    // tells which chunk holds the top-level key "shipping"
    chunks: { custom: ['shipping'] },
  },
}),
```

```html
<!-- {{ value }} in the text is filled with the parameter passed to the pipe -->
<p>{{ 'shipping.freeAbove' | cxTranslate: { value: '$200' } }}</p>
```

**How to run it.**

1. Paste the `provideConfig(<I18nConfig>{...})` into `CustomModule`'s `providers`.
2. In the outlet template from Step 6, replace the fixed text with the `cxTranslate` line. If the pipe is not found, import `I18nModule` from `@spartacus/core`.
3. Switch languages with the language selector in the storefront header (or the URL segment, e.g. `/en/` → `/de/`) if the base site has that language.
4. If you see the key instead of the text, check the chunk name and the key path letter by letter.

**Exercise.** Translate the "Free shipping" badge from Step 5 and the badge text from Step 4.

- *Hint:* create the keys `shipping.badge` and `cartBadge.items` (the latter in its own chunk).
- *Solution:* add `badge` inside `shipping` and a `cartBadge: { items: '{{ count }} items' }` block with its chunk; use `'cartBadge.items' | cxTranslate: { count: totalItems() }`.

**Common mistakes.**

- The screen shows the key instead of the text (e.g. `shipping.freeAbove`): the key is missing from `chunks`, or the active language has no text for it.
- After switching to German, some storefront labels (e.g. "Sign In / Register") stay in English: each feature module generated by `ng add` (`src/app/spartacus/features/...`) registers only its English texts. To translate them, add the matching German resources in each module (e.g. `userAccountTranslationsDe` next to `userAccountTranslationsEn`).
- Concatenating text in code (`'Free shipping over ' + value`): impossible to translate. Use parameters.

Documentation: [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), page "Internationalization (i18n)"

Done when: every text you created in this phase comes from i18n and changes when you switch languages.

### Week 8 — Custom data, SSR and quality

#### Step 10 — Custom attribute with a normalizer

**Concept.** When the backend adds a new product field (e.g. `warrantyYears`), three things must happen in the front end, all in the second-to-last layer of the diagram:

1. **Request the field:** the OCC only returns the fields listed in `fields` (Phase 3, Step 3). You add the new field to the endpoint URL.
2. **Convert:** a **normalizer** is a translator at customs. Data arrives in the "OCC language" (`Occ.Product`) and leaves in the "storefront language" (`Product`). You add your translator to the queue without removing the existing ones (`multi: true`).
3. **Type it:** tell TypeScript that `Product` now has `warrantyYears`, so the editor and compiler can help.

Exposing the field in the OCC is backend work (WsDTO, the response object, and a populator); agree on it with whoever owns the backend.

**In practice.**

```typescript
// 1. TYPE: "module augmentation" adds a field to the storefront's Product interface
declare module '@spartacus/core' {
  interface Product {
    warrantyYears?: number;
  }
}

// 2. CONVERT: the normalizer receives the OCC response (source)
//    and the product already converted by the default normalizers (target)
@Injectable({ providedIn: 'root' })
export class WarrantyNormalizer implements Converter<Occ.Product, Product> {
  convert(source: Occ.Product, target?: Product): Product {
    const result = target ?? ({ ...source } as Product);    // uses the target if present
    result.warrantyYears = (source as any).warrantyYears;   // copies the new field
    return result;
  }
}

// 3. REGISTER the normalizer and REQUEST the field from the OCC
providers: [
  // multi: true = adds to the normalizer queue without replacing the defaults
  { provide: PRODUCT_NORMALIZER, useExisting: WarrantyNormalizer, multi: true },
  provideConfig(<OccConfig>{
    backend: { occ: { endpoints: { product: {
      // "details" scope: the storefront's default value (current source) + the new field at the end
      details:
        'products/${productCode}?fields=averageRating,stock(DEFAULT),description,availableForPickup,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,tags,images(FULL),warrantyYears',
    } } } },
  }),
],
```

Before overriding `details`, copy the current value from the source code of the version you use and only append the field; otherwise, other parts of the PDP lose data.

**How to run it.**

1. First, check whether the backend already returns the field: `curl "$BASE/products/<code>?fields=FULL" | npx json` and search for it. If it doesn't exist, practice with an existing field the PDP doesn't show yet (e.g. `numberOfReviews`).
2. Create `src/app/custom/warranty.normalizer.ts` with parts 1 and 2 of the snippet.
3. Paste part 3 into `CustomModule`'s `providers`.
4. Open a product page, then DevTools → Network → filter "products": click the request and confirm the URL contains your field and the response brings it.

**Exercise.** Show the warranty in the summary from Step 5 ("Warranty: N years"), translated with i18n.

- *Hint:* since the field is typed, `p.warrantyYears` works in the template without a cast.
- *Solution:* `@if (p.warrantyYears) { <p>{{ 'product.warranty' | cxTranslate: { years: p.warrantyYears } }}</p> }`, with the key registered as in Step 9.

**Common mistakes.**

- Registering the normalizer without `multi: true`: you replace all default normalizers and the product arrives broken.
- Forgetting to request the field in `fields`: the normalizer runs, but the field never comes from the OCC.
- Overriding `details` with a shorter list than the original: images, price or stock disappear from the PDP.

Documentation: [Connecting to Other Systems, converters section](https://sap.github.io/spartacus-docs/connecting-to-other-systems/) · [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), pages "Configuring Endpoints" and "Extending Built-In Models"

Done when: the custom summary shows the warranty and the rest of the PDP is still complete.

#### Step 11 — Storefront SSR

**Concept.** You met SSR in Phase 2. In the storefront it is mandatory in production, and SAP adds a "kitchen manager", the `NgExpressEngineDecorator`. If a page takes too long to render on the server (e.g. slow OCC), it doesn't keep the customer waiting: it serves the CSR (Client-Side Rendering, built in the browser) version and finishes the server render in the background, keeping it for the next request.

**In practice.**

```bash
npm run build                                          # builds the browser and server bundles
NG_ALLOWED_HOSTS=localhost npm run serve:ssr:mystore   # allowed hosts, as in Phase 2, Step 8
```

```typescript
// src/server.ts (excerpt; the file generated for your version may differ)
const ngExpressEngine = NgExpressEngineDecorator.get(engine, {
  timeout: 3000,   // after 3 s without finishing, responds with CSR
  cache: false,    // in production, caching usually lives in a layer in front (CDN)
});
```

**How to run it.**

1. Stop `npm start` (Ctrl+C) and run `npm run build`.
2. Find the SSR script in `package.json` (e.g. `serve:ssr:mystore`) and run it allowing `localhost` as host: `NG_ALLOWED_HOSTS=localhost npm run serve:ssr:mystore` (on Windows PowerShell: `$env:NG_ALLOWED_HOSTS="localhost"; npm run serve:ssr:mystore`). The storefront's `server.ts` also has an `SSR_ALLOWED_ORIGINS` check; that one is optional and does not replace `NG_ALLOWED_HOSTS`.
3. Open the address the terminal prints (port 4000 by default), go to a product page, then right-click → **View page source** and search (Ctrl+F) for the product name.
4. Watch the terminal while you browse: SSR errors and timeouts appear there.

**Exercise.** Review every component you created in this phase looking for browser-only code. Then check the HTML generated by the server.

- *Hint:* search for `window`, `document`, `localStorage` and `setInterval`.
- *Solution:* move that code into `afterNextRender` or guard it with `isPlatformBrowser` (Phase 2, Step 8). Then open "View page source" on the PDP: the product name and your summary should be in the HTML.

**Common mistakes.**

- `baseUrl` pointing to a backend the SSR server can't reach (internal network, invalid certificate): rendering hits the timeout and everything falls back to CSR without you noticing.
- Starting the server without `NG_ALLOWED_HOSTS`: the terminal prints `URL with hostname "localhost" is not allowed` and every page falls back to CSR, so "View page source" shows an almost empty page.
- Using `setInterval` or long timers in components: the server waits for the app to "stabilize" and rendering is delayed.

Documentation: [SSR in Spartacus](https://sap.github.io/spartacus-docs/server-side-rendering-in-spartacus/) · [SSR optimization](https://sap.github.io/spartacus-docs/server-side-rendering-optimization/) · [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), page "Server-Side Rendering Optimization"

Done when: the server HTML contains the PDP content and the terminal shows no errors.

#### Step 12 — Accessibility and performance

**Concept.** Accessibility (a11y) means making sure everyone can use the site: people who navigate only with a keyboard, people using screen readers, people with low vision. A ramp at the entrance helps wheelchair users, but also anyone pushing a stroller; good HTML helps screen readers and also SEO. The storefront follows WCAG (Web Content Accessibility Guidelines); your components must not make it worse. Chrome's Lighthouse measures accessibility and performance.

**In practice.**

```html
<!-- a real button (not a clickable <div>): gets focus and works with Enter/Space -->
<button type="button" (click)="add()"
        [attr.aria-label]="'Add ' + p.name + ' to cart'">  <!-- what the screen reader says -->
  Add
</button>

<!-- every informative image needs alternative text -->
<img [src]="p.images?.PRIMARY?.product?.url" [alt]="p.name" />
```

**How to run it.**

1. Click the address bar, then press Tab repeatedly: a visible outline should move through the page in a logical order.
2. For Lighthouse: DevTools → **Lighthouse** tab → tick Accessibility and Performance → **Analyze page load**. Run it on the production build (Step 11) for realistic numbers.
3. Save the score before and after your changes in the README.

**Exercise.** Navigate the PDP using only the keyboard (Tab, Shift+Tab, Enter) and try to add a product to the cart, going through your components.

- *Hint:* watch whether focus stays visible and whether the order makes sense.
- *Solution:* clickable elements made with `div` or `span` don't get focus; switch them to `button` or `a`. If the focus outline disappears, check whether some of your CSS removed `outline`.

**Common mistakes.**

- `outline: none` "to look nicer": keyboard users get lost.
- Images with no `alt` or with `alt="image"`: the screen reader helps no one.

Documentation: [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), pages "Accessibility" and "Deferred Loading" · [WCAG 2.1 (W3C)](https://www.w3.org/TR/WCAG21/) · [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)

Done when: you complete a purchase with the keyboard only and the Lighthouse accessibility score doesn't drop with your components.

### Phase 4 checkpoint

- [ ] Storefront running against the development backend
- [ ] Cart badge using a facade and signals
- [ ] CMS component replaced and outlets working
- [ ] Layout, theme and translations customized
- [ ] Custom attribute shown through a normalizer
- [ ] Everything working with SSR and keyboard navigation
- [ ] You can explain the layers diagram, pointing out where each customization went
- [ ] Self-review with the checklist in "Progress tracking and self-assessment"

## Phase 5 — Individual final project (weeks 9 and 10)

Each person delivers, on their own, a complete feature: a **product comparison tool**. It needs no new backend code and uses everything studied so far. Think of it as the driving test: nothing new, but everything together and without the instructor.

**What the comparison tool does:** a "Compare" button on the PDP adds the product to a list (up to 4 items, stored in the browser); the `/compare` page shows the products side by side with price, rating and technical attributes.

**Project map:** each part uses a technique from an earlier phase.

| Part | Technique | Where you learned it |
| --- | --- | --- |
| `/compare` page coming from the CMS | CMSFlexComponent and mapping | Phase 3 Step 6, Phase 4 Step 5 |
| List of chosen products | Service with signals and effect | Phase 2 Step 1 |
| "Compare" button on the PDP | Outlet + facade | Phase 4 Steps 4 and 6 |
| Comparison table | Facade + RxJS + `toSignal` | Phase 2 Step 4, Phase 4 Step 4 |
| Texts in 2 languages | i18n | Phase 4 Step 9 |
| Works with SSR | `isPlatformBrowser` | Phase 2 Step 8 |
| Tests | TestBed and mocks | Phase 2 Step 9 |

In this phase, each step has an optional **Stretch goal** instead of an exercise, and solutions are shorter: the idea is for you to build it on your own.

### Step 1 — Write a mini specification

**Concept.** Before building, draw the plan. A short spec avoids rework and trains the requirement-reading you will do on real projects. It answers: what the user can do, which rules apply and how to know it's done.

**In practice.** Create `README.md` with these sections:

```markdown
# Product comparison
## Goal              — one sentence
## Screens           — button on the PDP, badge in the header, /compare page
## Rules             — max 4 items; what happens on the 5th; list stored in the browser
## Data shown        — name, price, rating, technical attributes
## Definition of done — copy the acceptance criteria from the end of this phase
## Technical decisions — fill in as the project goes
```

**How to run it.**

1. Work in the `mystore` project from Phase 4 and create a branch for the project: `git checkout -b final-project`.
2. Open `README.md` at the project root in VS Code, paste the template and fill in each section.
3. Press Ctrl+Shift+V in VS Code to preview the Markdown formatted.

**Stretch goal.** Show the README to someone who didn't take the course and ask them to explain what will be delivered.

**Common mistakes.** Skipping this step and discovering the rules halfway through the code ("what if the user adds the same product twice?").

Done when: the README answers "what, which rules and when is it done".

### Step 2 — Create the page and the component in the CMS

**Concept.** For the `/compare` page to exist, the CMS needs a page with a component on it. Creating a new component *type* would require backend code. The shortcut is `CMSFlexComponent`, a "wildcard" component: its `flexType` attribute works as a label that tells the storefront "render the Angular component named X here". In the mapping, the storefront uses `flexType` instead of `typeCode`.

**In practice.** Create it through Backoffice or with ImpEx (SAP Commerce's data import format):

```text
# variables: which content catalog and version (Staged) to write to
$contentCatalog=electronics-spaContentCatalog
$contentCV=catalogVersion(CatalogVersion.catalog(Catalog.id[default=$contentCatalog]),CatalogVersion.version[default=Staged])[default=$contentCatalog:Staged]

# creates (or updates) the wildcard component; flexType = the name used in the front-end mapping
INSERT_UPDATE CMSFlexComponent;$contentCV[unique=true];uid[unique=true];name;flexType
;;ProductComparisonFlexComponent;Product Comparison;ProductComparisonComponent
```

Then create a ContentPage with the label `/compare`, put the component in one of its slots and **synchronize the content catalog**. The storefront resolves unknown URLs by looking for a content page with that label.

**How to run it.**

1. Open HAC at `https://<backend>/hac` → Console → **ImpEx Import**.
2. Paste the ImpEx script into the text area and click **Import content**. A green message means it worked; red shows the failing line.
3. Create the page in Backoffice (WCMS → Page → Content Page → +), with label `/compare`, a template such as `ContentPage1Template`, and add `ProductComparisonFlexComponent` to one of its slots. SmartEdit is an easier visual alternative.
4. Synchronize the content catalog and run the `curl` from the stretch goal.

**Stretch goal.** Confirm through the API, before writing any Angular code, that the page and component exist.

- *Solution:* `curl "$BASE/cms/pages?pageType=ContentPage&pageLabelOrId=/compare"` should list the component with `typeCode` `CMSFlexComponent` and the right `flexType`.

**Common mistakes.** Forgetting to synchronize (the page returns 404); creating the page in the Online version.

Documentation: [Customizing CMS Components (Help Portal), sections on flexType and placeholder components](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/eaef8c61b6d9477daf75bff9ac1b7eb4/864a3158bf9f49c99e6196e4e0d27323.html) · [SAP Commerce on the Help Portal](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD) (search for "ImpEx")

Done when: the API returns the `/compare` page with the component.

### Step 3 — State service with signals

**Concept.** The comparison list is small, per-user state, so signals are enough; NgRx would be a truck to carry a backpack. The service "owns" the list: it stores it, applies the rules (max 4) and persists it in the browser. The catch is SSR: there is no `localStorage` on the server.

**In practice.**

```typescript
@Injectable({ providedIn: 'root' })                     // one list for the whole app
export class ProductComparisonService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID)); // are we in the browser?

  readonly codes = signal<string[]>(this.load());       // codes of the chosen products
  readonly count = computed(() => this.codes().length); // how many
  readonly isFull = computed(() => this.count() >= 4);  // the max rule

  constructor() {
    // on every list change, save it in the browser (never on the server)
    effect(() => {
      if (this.isBrowser) localStorage.setItem('compare', JSON.stringify(this.codes()));
    });
  }

  has(code: string) {
    return this.codes().includes(code);
  }

  toggle(code: string) {
    this.codes.update((list) =>
      list.includes(code)
        ? list.filter((c) => c !== code)               // already there: remove
        : this.isFull() ? list : [...list, code],      // not there: add if it fits
    );
  }

  private load(): string[] {
    if (!this.isBrowser) return [];                    // on the server, start empty
    try {
      return JSON.parse(localStorage.getItem('compare') ?? '[]');
    } catch {
      return [];                                       // corrupted data: start over
    }
  }
}
```

**How to run it.**

1. Run `ng generate service custom/product-comparison --type=service` and replace the file content with the snippet.
2. You can't see a service on screen yet; test it after Step 4 with DevTools → Application → Local Storage → `http://localhost:4200` → the `compare` key.
3. Commit.

**Stretch goal.** Add a `clear()` method and a `lastAdded` signal with the last code added.

**Common mistakes.** Reading `localStorage` in an initializer without the platform check (SSR breaks); using `push` on the array (the signal doesn't notice).

Documentation: [Signals and effect](https://angular.dev/guide/signals) · [SSR: browser-only code](https://angular.dev/guide/ssr)

Done when: the list survives a page reload and the SSR build shows no errors.

### Step 4 — "Compare" button through an outlet

**Concept.** The button is a small addition next to "Add to cart", so the right path is an outlet (Phase 4, Step 6). It needs to know which product is on screen (the `CurrentProductService` facade) and talk to the service from Step 3.

**In practice.**

```typescript
@Component({
  selector: 'app-compare-button',
  imports: [I18nModule],                                       // for the cxTranslate pipe
  template: `
    @if (product(); as p) {
      <!-- disabled when the list is full and this product is not in it -->
      <button type="button" class="btn btn-secondary"
              [disabled]="!comparison.has(p.code!) && comparison.isFull()"
              (click)="comparison.toggle(p.code!)">
        {{ (comparison.has(p.code!) ? 'compare.remove' : 'compare.add') | cxTranslate }}
      </button>
    }
  `,
})
export class CompareButton {
  comparison = inject(ProductComparisonService);                  // public: used in the template
  product = toSignal(inject(CurrentProductService).getProduct()); // product on the PDP
}
```

```html
<!-- in app.component.html -->
<ng-template cxOutletRef="ProductAddToCartComponent" cxOutletPos="after">
  <app-compare-button />
</ng-template>
```

**How to run it.**

1. Run `ng generate component custom/compare-button --type= --inline-template --inline-style --skip-tests` and paste the component snippet.
2. Paste the `ng-template` into `app.component.html`, below `<cx-storefront>` (same place as Phase 4, Step 6).
3. Register the `compare.add`, `compare.remove`, `compare.empty` and `compare.badge` keys in your i18n config (Phase 4, Step 9), in a `compare` chunk.
4. Open a product page, click the button and check Local Storage: the product code appears in the `compare` key.

**Stretch goal.** When the list is full, show the reason below the disabled button ("Limit of 4 products"), translated.

**Common mistakes.** Forgetting to register the `compare.add` and `compare.remove` keys in i18n (the keys show up on screen); using a clickable `div` instead of a `button`.

Documentation: [Outlets (SAP Learning video)](https://learning.sap.com/videos/extending-the-sap-commerce-cloud-composable-storefront-with-outlets) · Phase 4, Step 9 for the translations

Done when: the button toggles between add and remove and is disabled with 4 items.

### Step 5 — Comparison page with a facade, RxJS and signals

**Concept.** The page gets a list of codes and needs a full product for each. It is the classic case for RxJS: `switchMap` switches the search when the list changes and `combineLatest` waits for every response and joins them, like a waiter who only serves the table when every dish is ready. The `ProductService` facade fetches each product with **scopes**: `DETAILS` brings price and images; `ATTRIBUTES` brings classifications (technical attributes).

**In practice.**

```typescript
@Component({
  selector: 'app-product-comparison',
  imports: [I18nModule],
  template: `
    @if (products().length === 0) {
      <p>{{ 'compare.empty' | cxTranslate }}</p>
    } @else {
      <table class="comparison">
        <tr>
          <th scope="row">Product</th>
          @for (p of products(); track p.code) { <th scope="col">{{ p.name }}</th> }
        </tr>
        <tr>
          <th scope="row">Price</th>
          @for (p of products(); track p.code) { <td>{{ p.price?.formattedValue }}</td> }
        </tr>
      </table>
    }
  `,
})
export class ProductComparison {
  private comparison = inject(ProductComparisonService);
  private productService = inject(ProductService);           // product facade

  products = toSignal(
    toObservable(this.comparison.codes).pipe(                 // signal → belt
      switchMap((codes) =>
        codes.length
          ? combineLatest(                                    // waits for every product
              codes.map((c) => this.productService.get(c, [ProductScope.DETAILS, ProductScope.ATTRIBUTES])),
            )
          : of([]),                                           // empty list: nothing to fetch
      ),
      map((list) => list.filter((p): p is Product => !!p)),   // drops the ones not loaded yet
    ),
    { initialValue: [] as Product[] },
  );
}

// links the flexType from Step 2 to this component
provideConfig(<CmsConfig>{
  cmsComponents: { ProductComparisonComponent: { component: ProductComparison } },
}),
```

**How to run it.**

1. Run `ng generate component custom/product-comparison --type= --inline-template --inline-style --skip-tests` and paste the component snippet.
2. Paste the `provideConfig(<CmsConfig>{...})` into `CustomModule`'s `providers`.
3. Add 2 or 3 products with the button from Step 4, then open `http://localhost:4200/electronics-spa/en/USD/compare` (adjust to your base site, language and currency).
4. Blank page? Check, in order: the `cms/pages` call for `/compare` (Step 2), the `flexType` spelling in the mapping, and the browser console.

**Stretch goal.** Build the technical attribute rows from `product.classifications`. Each classification has `features`, and each feature has `name` and `featureValues`. Use a `computed` that collects the names of all features and, for each product, the matching value (or "—" when there is none).

**Common mistakes.** Using `forkJoin` instead of `combineLatest`: facades don't "complete" (they keep emitting), and `forkJoin` waits for completion, so nothing shows up. Requesting only `DETAILS` and wondering why attributes are missing.

Documentation: [Customizing CMS Components](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/eaef8c61b6d9477daf75bff9ac1b7eb4/864a3158bf9f49c99e6196e4e0d27323.html) · [RxJS and signals interop](https://angular.dev/ecosystem/rxjs-interop) · [ProductService on GitHub](https://github.com/SAP/spartacus) (folder `projects/core/src/product`)

Done when: `/compare` shows the chosen products with name, price and at least 3 aligned technical attributes.

### Step 6 — Navigation access and badge

**Concept.** Comparing is useless if the user can't find the page. A badge in the header ("Compare (2)") shows how many items are in the list and links to `/compare`. Since the service is a single instance (`providedIn: 'root'`) and uses signals, the badge updates instantly on any page, with no extra communication between components.

**In practice.**

```typescript
@Component({
  selector: 'app-compare-badge',
  imports: [RouterLink, I18nModule],
  template: `
    @if (comparison.count() > 0) {                     <!-- only shows when there are items -->
      <a routerLink="/compare">
        {{ 'compare.badge' | cxTranslate: { count: comparison.count() } }}
      </a>
    }
  `,
})
export class CompareBadge {
  comparison = inject(ProductComparisonService);
}
```

Plug the badge in with an outlet on a header slot, for example `<ng-template cxOutletRef="SiteLinks" cxOutletPos="after">`. Inspect the header to pick the right slot for your version.

**How to run it.**

1. Run `ng generate component custom/compare-badge --type= --inline-template --inline-style --skip-tests` and paste the snippet.
2. Inspect the header in the browser to choose a slot, then add a second `ng-template` in `app.component.html` using that slot name.
3. Add a product to the comparison and navigate to the home page: the badge should already show the count.

**Stretch goal.** Announce the change to screen readers when an item enters the list.

- *Hint:* a region with `aria-live="polite"` makes the screen reader speak when its text changes.

**Common mistakes.** Using `href` instead of `routerLink` (the page reloads); placing the outlet in a component that doesn't show on every page.

Done when: the counter changes instantly on any page and the link goes to `/compare`.

### Step 7 — Testing

**Concept.** Test the business rules, which are what can break without anyone noticing: the limit of 4, adding and removing, the empty list. For the page component, swap the real facade for a fake one (mock), like a movie stunt double: nobody needs a backend to test.

**In practice.**

```typescript
describe('ProductComparisonService', () => {
  it('caps the list at 4 products', () => {
    const service = TestBed.inject(ProductComparisonService);  // arrange
    ['A', 'B', 'C', 'D', 'E'].forEach((c) => service.toggle(c)); // act: tries 5
    expect(service.count()).toBe(4);                            // assert
    expect(service.has('E')).toBe(false);
  });

  it('removes a product already in the list', () => {
    const service = TestBed.inject(ProductComparisonService);
    service.toggle('A');
    service.toggle('A');
    expect(service.count()).toBe(0);
  });
});

// page component with the facade replaced by a stunt double
TestBed.configureTestingModule({
  providers: [{ provide: ProductService, useValue: { get: () => of(mockProduct) } }],
});
```

**How to run it.**

1. Paste the service tests into `product-comparison.service.spec.ts` (created in Step 3) and add `beforeEach(() => localStorage.clear());` at the top of the `describe`.
2. For the page test, create `mockProduct` in the spec: `const mockProduct = { code: 'A', name: 'Phone', price: { formattedValue: '$300' } };`.
3. Run `ng test` in a second terminal and leave it watching while you write the tests.

**Stretch goal.** Test that `CompareButton` is disabled when the list is full.

**Common mistakes.** Forgetting that `localStorage` persists between tests in the test browser: clear it in a `beforeEach` so one test doesn't "leak" into another.

Documentation: [Testing in Angular](https://angular.dev/guide/testing) · [Testing components](https://angular.dev/guide/testing/components-basics)

Done when: the service, button and page have passing tests.

### Step 8 — SSR, accessibility and performance

**Concept.** This is the "inspection" before handing over the house. Three questions: does it work when the page is built on the server? Does it work with a keyboard only and with a screen reader? Did it make the site slower?

**In practice.**

- **SSR:** run the production build with SSR and open `/compare`. The list comes empty from the server (there is no `localStorage` there) and fills in the browser; that is expected.
- **Accessibility:** table with `<th scope="col">` and `<th scope="row">`, button operable by keyboard and every text through i18n.
- **Performance:** run Lighthouse on the PDP before and after the button; the score must not drop.

**How to run it.** Repeat the routines you already know: the SSR build from Phase 4, Step 11; the keyboard and Lighthouse checks from Phase 4, Step 12. Write each result as a short line in the README (date, what you checked, result).

**Common mistakes.** Testing only with `ng serve` and finding the SSR error in the client's environment.

Done when: the three checks are done and noted in the README.

### Step 9 — Upgrade exercise

**Concept.** On real projects the storefront is updated often: SAP publishes monthly releases and moves to a new major Angular version once a year, in February, with breaking changes; in the other months releases tend to be compatible ([KBA 3435022](https://userapps.support.sap.com/sap/support/knowledge/en/3435022)). This step shows whether your code followed the "extend, never edit" rule: the more you used facades and configuration, the less breaks.

**In practice.**

```bash
git checkout -b upgrade                         # work on a separate branch
ng update @spartacus/schematics@<new-version>   # the schematic applies automatic migrations
npm install
npm run build && ng test                        # builds and runs the tests
```

**How to run it.**

1. Commit everything first: the upgrade must start from a clean state (`git status` shows nothing to commit).
2. Check the next available version with `npm view @spartacus/core versions` (Phase 4, Step 1) and read its update guide on the Help Portal.
3. Run the commands; if `ng update` asks questions, accept the defaults.
4. Use `git diff` to see everything the migration changed, then run the app and the tests.

**Stretch goal.** Read the release notes for the new version and list what could affect your comparison tool, even if nothing broke.

**Common mistakes.** Skipping versions without reading each one's guide; updating only some `@spartacus/*` packages (they must all be on the same version).

Documentation: [Help Portal](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT), section "Updating Composable Storefront" · [Release policy and compatibility matrix](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/10a8bc7f635b4e3db6f6bb7880e58a7d/ba62c2c708ec4751a2612a512177419b.html)

Done when: the project builds and the tests pass on the new version; the README records what had to change.

### Step 10 — Delivery

**Concept.** Explaining what you did is part of the job: day to day, you will present solutions to the team and to the client.

**In practice.** Record a video of up to 5 minutes showing the comparison tool working and explaining two technical decisions (e.g. why signals and not NgRx; why `combineLatest` and not `forkJoin`). Share the repository link and the video.

**How to run it.** Any screen recorder works: on Windows, Win+Alt+R (Xbox Game Bar) or Clipchamp; on Mac, Cmd+Shift+5. Push the branch to your Git remote (`git push -u origin final-project`) and share the link together with the video.

### Final project acceptance criteria

- [ ] README with specification, decisions and how to run it
- [ ] Component mapped through the CMS (`flexType`) and `/compare` page coming from the CMS
- [ ] Button and badge added through outlets, without changing storefront templates
- [ ] Data obtained only through facades (no `HttpClient` directly in components)
- [ ] State in signals, persisted in the browser without breaking SSR
- [ ] Texts through i18n in at least 2 languages
- [ ] Service, button and page tests passing
- [ ] Version upgrade done and documented
- [ ] Demo video

**Alternative projects** (same criteria, for anyone who wants variety): recently viewed products; an extra order-notes step in checkout; an availability notice on the PDP using OCC stock data.

## Progress tracking and self-assessment

The plan is designed to be followed on your own: every step has a "Done when" criterion and every phase ends in a checkpoint. Only move on to the next phase once the checkpoint is complete.

**Suggested weekly routine**

- 5 h of study and practice following the week's steps.
- 30 min of notes: write in your repository's README what you learned, open questions and useful links.
- 30 min of review: reread the week's code using the checklist below.

**Self-review checklist (use it on all storefront code)**

- [ ] Components talk only to facades, never to `HttpClient` or the NgRx store directly
- [ ] No code copied from the libraries; customizations only through config, CMS mapping, outlets or providers
- [ ] No `window`, `document` or `localStorage` without SSR protection
- [ ] Visible texts come from i18n
- [ ] Interactive elements work with the keyboard and have accessible labels
- [ ] Observables converted with `toSignal` or closed with `takeUntilDestroyed`
- [ ] Tests cover the new logic

**Optional support:** if someone on the team has Spartacus experience, a 30-minute chat at the end of each phase helps validate the checkpoint. It is not required to follow the plan.

## Glossary of acronyms and terms

Each acronym is also explained the first time it appears in the text. Alphabetical order.

| Acronym or term | Stands for | What it is in this context |
| --- | --- | --- |
| a11y | Accessibility (11 letters between "a" and "y") | Making the site usable by people with disabilities |
| API | Application Programming Interface | Contract that lets one system call another (e.g. the OCC) |
| CCv2 | Commerce Cloud version 2 | SAP's managed cloud that hosts SAP Commerce and the storefront |
| CDN | Content Delivery Network | Network of servers that deliver static files close to the user |
| CLI | Command Line Interface | Terminal tool; here, Angular's `ng` |
| CMS | Content Management System | Part of SAP Commerce that defines pages, slots and components |
| CORS | Cross-Origin Resource Sharing | Browser rule for calls between different domains |
| CSR | Client-Side Rendering | Rendering the page in the browser |
| CSS / SCSS | Cascading Style Sheets / Sassy CSS | Style language / its extension with variables and nesting |
| DI | Dependency Injection | Angular mechanism that hands services to components |
| DTO / WsDTO | Data Transfer Object / Web Service DTO | Object that defines the shape of data in the OCC response |
| e2e | End-to-end | Test that simulates a user going through the whole system |
| GPS | Global Positioning System | Used here as an analogy for the router |
| HTML | HyperText Markup Language | Page markup language |
| HTTP | HyperText Transfer Protocol | Protocol for requests between browser and server |
| i18n | Internationalization (18 letters between "i" and "n") | Support for multiple languages and formats |
| ImpEx | Import/Export | File format for importing data into SAP Commerce |
| JDK | Java Development Kit | Java platform the SAP Commerce backend runs on |
| JSON | JavaScript Object Notation | Text format of the data exchanged with the OCC |
| KBA | Knowledge Base Article | SAP support article (SAP for Me) |
| LTS | Long-Term Support | Version with extended support (e.g. Node.js 22) |
| NgRx | Angular (ng) + Reactive Extensions | Global state library used by the storefront |
| npm | Node Package Manager | JavaScript package manager |
| OAuth2 | Open Authorization 2.0 | Token-based authorization protocol used by the OCC |
| OCC | Omni Commerce Connect | SAP Commerce REST API consumed by the storefront |
| PDP | Product Details Page | A single product's detail page |
| PLP | Product Listing Page | Product listing or search page |
| PWA | Progressive Web App | Website that behaves like an app (offline, installable) |
| RBSC | Repository-Based Shipment Channel | SAP's private npm repository with the official libraries |
| REST | Representational State Transfer | API style based on URLs and HTTP verbs |
| RxJS | Reactive Extensions for JavaScript | Library of Observables and operators |
| SAP | Systeme, Anwendungen und Produkte (Systems, Applications and Products) | German company behind SAP Commerce Cloud |
| SEO | Search Engine Optimization | Practices that help a site rank well in search engines |
| SPA | Single-Page Application | App that changes screens without reloading the page, like the storefront |
| SSR | Server-Side Rendering | Generating the HTML on the server before sending it to the browser |
| TS | TypeScript | JavaScript with types, Angular's language |
| UI / UX | User Interface / User Experience | Visual interface / experience of use |
| URL | Uniform Resource Locator | Address of a page or endpoint |
| WCAG | Web Content Accessibility Guidelines | W3C accessibility guidelines |
| W3C | World Wide Web Consortium | Organization that defines web standards |

## Resources and references

**Angular**

- [angular.dev — official tutorials and guides](https://angular.dev/tutorials)
- [RxJS — documentation](https://rxjs.dev/guide/overview)
- [NgRx — documentation](https://ngrx.io/docs)

**Composable Storefront and SAP Commerce**

- [Composable Storefront documentation (SAP Help Portal)](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT)
- [SAP/spartacus repository on GitHub](https://github.com/SAP/spartacus) — source code, issues and examples
- [Release policy and compatibility matrix](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/10a8bc7f635b4e3db6f6bb7880e58a7d/ba62c2c708ec4751a2612a512177419b.html)
- [Release numbering changes and Node.js policy](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/10a8bc7f635b4e3db6f6bb7880e58a7d/5fea969613a341308e2519c5f2827331.html)
- [KBA 3363029 — Node.js versions supported on CCv2](https://userapps.support.sap.com/sap/support/knowledge/en/3363029) (SAP for Me login)
- [KBA 3435022 — version alignment and yearly Angular cycle](https://userapps.support.sap.com/sap/support/knowledge/en/3435022)
- [JDK 21 / Angular 21 update guide (Knack Systems)](https://www.knacksystems.com/blog/jdk-21-on-sap-commerce-cloud-what-changes-who-it-affects-how-to-get-there)
- SAP Learning: search for the SAP Commerce Cloud and Composable Storefront courses at [learning.sap.com](https://learning.sap.com)
