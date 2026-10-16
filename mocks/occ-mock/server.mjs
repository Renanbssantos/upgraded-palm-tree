// Mock SAP Commerce backend (OCC v2 + authorization server). Zero dependencies.
//   node server.mjs            -> http://localhost:9002
// Env: PORT, ALLOWED_ORIGINS (space separated; default "http://localhost:4200 https://localhost:4200")
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { baseSites, customers, clients, products, cmsPages, cmsComponents, sharedSlots } from './data.mjs';

const clone = (o) => structuredClone(o);

// ---- fields parameter: BASIC / DEFAULT / FULL or a projection like "code,price(formattedValue)" ----
const LEVELS = {
  BASIC: ['code', 'name', 'url'],
  DEFAULT: ['code', 'name', 'url', 'summary', 'description', 'purchasable', 'price', 'stock', 'images', 'averageRating'],
};

function parseFields(spec) {
  const root = {};
  let stack = [root];
  let token = '';
  const flush = () => {
    if (token) stack.at(-1)[token] ??= true;
    token = '';
  };
  for (const ch of spec) {
    if (ch === ',') flush();
    else if (ch === '(') {
      const child = {};
      stack.at(-1)[token] = child;
      token = '';
      stack.push(child);
    } else if (ch === ')') {
      flush();
      stack.pop();
    } else token += ch;
  }
  flush();
  return root;
}

function pick(value, tree) {
  if (tree === true || value === null || typeof value !== 'object') return value;
  // a level inside a projection, e.g. images(DEFAULT) or price(FULL): return the whole sub-object
  if (Object.keys(tree).some((k) => k in LEVELS || k === 'FULL')) return value;
  if (Array.isArray(value)) return value.map((v) => pick(v, tree));
  const out = {};
  for (const [k, sub] of Object.entries(tree)) if (k in value) out[k] = pick(value[k], sub);
  return out;
}

function project(value, fields = 'DEFAULT') {
  if (fields === 'FULL') return value;
  const tree = LEVELS[fields] ? {} : parseFields(fields);
  if (tree.FULL) return value;
  // "DEFAULT,foo,bar(baz)" = the DEFAULT level plus the listed fields (a field like
  // warrantyYears only comes back when it is requested by name, as in the real OCC)
  for (const level of Object.keys(LEVELS)) {
    if (fields !== level && !tree[level]) continue;
    delete tree[level];
    for (const f of LEVELS[level]) tree[f] ??= true;
  }
  return pick(value, tree);
}

const money = (value) => ({
  currencyIso: 'USD',
  value: Math.round(value * 100) / 100,
  formattedValue: `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
});

// ---- server factory (each instance has its own state, handy for tests) ----
export function createMockServer({ allowedOrigins = ['http://localhost:4200', 'https://localhost:4200'], log = false } = {}) {
  const cms = { pages: cmsPages, components: cmsComponents };
  const state = {
    staged: { products: clone(products), cms: clone(cms) },
    online: { products: clone(products), cms: clone(cms) },
    tokens: new Map(), // access_token -> { uid, exp }
    carts: [],
  };

  // Builds the OCC page response: page slots first, then the shared header/footer slots.
  const assemblePage = (page) => {
    const slot = ([position, uids]) => ({
      slotId: `${position}Slot`,
      position,
      name: `${position} Slot`,
      slotShared: position in sharedSlots,
      components: { component: uids.map((uid) => state.online.cms.components[uid]).filter(Boolean) },
    });
    const { slots, ...rest } = page;
    return { ...rest, contentSlots: { contentSlot: [...Object.entries(slots), ...Object.entries(sharedSlots)].map(slot) } };
  };
  const findPage = (q) => {
    const label = q.get('pageLabelOrId');
    const type = q.get('pageType') ?? 'ContentPage';
    if (type === 'ProductPage') return state.online.products.some((p) => p.code === q.get('code')) ? state.online.cms.pages.productDetails : undefined;
    if (!label && type === 'ContentPage') return state.online.cms.pages.homepage;
    if (!label) return undefined; // CategoryPage is not mocked yet
    return Object.values(state.online.cms.pages).find((p) => p.label === label || p.uid === label || `/${p.label}` === label);
  };

  const findCart = (user, id) =>
    state.carts.find((c) => c.owner === user && (user === 'anonymous' ? c.guid === id : c.code === id));

  const cartView = (cart, fields = 'DEFAULT') => {
    const entries = cart.entries.map((e, i) => {
      const p = state.online.products.find((x) => x.code === e.code);
      return {
        entryNumber: i,
        quantity: e.quantity,
        product: p,
        basePrice: money(p.price.value),
        totalPrice: money(p.price.value * e.quantity),
      };
    });
    const sub = entries.reduce((s, e) => s + e.totalPrice.value, 0);
    const full = {
      code: cart.code,
      guid: cart.owner === 'anonymous' ? cart.guid : undefined,
      type: 'cartWsDTO',
      entries,
      totalItems: entries.length,
      totalUnitCount: entries.reduce((n, e) => n + e.quantity, 0),
      subTotal: money(sub),
      totalPrice: money(sub),
      totalPriceWithTax: money(sub * 1.1),
    };
    if (fields === 'FULL') return full;
    if (fields === 'DEFAULT' || fields === 'BASIC') {
      const { entries: _drop, ...rest } = full;
      return fields === 'BASIC' ? { code: full.code, guid: full.guid } : { ...rest, entries: pick(entries, parseFields('entryNumber,quantity,product(code,name),totalPrice')) };
    }
    return pick(full, parseFields(fields));
  };

  const send = (res, status, body, headers = {}) => {
    res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
    res.end(body === undefined ? '' : JSON.stringify(body));
  };
  const ocError = (res, status, type, message) => send(res, status, { errors: [{ type, message }] });

  const readBody = (req) =>
    new Promise((resolve) => {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => resolve(raw));
    });

  const parseBody = (req, raw) => {
    if (!raw) return {};
    if ((req.headers['content-type'] ?? '').includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(raw));
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const authUser = (req) => {
    const m = /^Bearer (.+)$/.exec(req.headers.authorization ?? '');
    if (!m) return { error: 'unauthorized', description: 'Full authentication is required to access this resource' };
    const t = state.tokens.get(m[1]);
    if (!t || t.exp < Date.now()) return { error: 'invalid_token', description: `Invalid access token: ${m[1]}` };
    return { uid: t.uid };
  };

  async function handle(req, res) {
    const origin = req.headers.origin;
    const cors = {};
    if (origin && allowedOrigins.includes(origin)) {
      // Same lists a real backend needs in corsfilter.commercewebservices.allowedHeaders / exposedHeaders
      Object.assign(cors, {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers':
          'origin, content-type, accept, authorization, cache-control, x-anonymous-consents, x-profile-tag-debug, x-consent-reference, occ-personalization-id, occ-personalization-time',
        'Access-Control-Expose-Headers': 'x-anonymous-consents, occ-personalization-id, occ-personalization-time',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        Vary: 'Origin',
      });
    }
    // every response from here on carries the CORS headers (or none, if the origin is not on the guest list)
    const origWriteHead = res.writeHead.bind(res);
    res.writeHead = (status, headers = {}) => origWriteHead(status, { ...cors, ...headers });

    if (req.method === 'OPTIONS') return send(res, 204);

    // collapse "//" like a real server does (the storefront requests "<baseUrl>/" + "/medias/...")
    const url = new URL(req.url.replace(/^\/{2,}/, '/').replace(/([^:])\/{2,}/g, '$1/'), 'http://mock');
    const path = url.pathname;
    const q = url.searchParams;
    const raw = await readBody(req);
    const body = parseBody(req, raw);

    // ---- authorization server ----
    if (req.method === 'POST' && path === '/authorizationserver/oauth/token') {
      const clientId = body.client_id ?? '';
      const client = clients[clientId];
      if (!client || (client.secret !== null && client.secret !== body.client_secret))
        return send(res, 401, { error: 'invalid_client', error_description: `Bad client credentials` });
      if (!client.grants.includes(body.grant_type))
        return send(res, 400, { error: 'unauthorized_grant_type', error_description: `Unauthorized grant type: ${body.grant_type}` });
      let uid = 'client';
      if (body.grant_type === 'password') {
        const c = customers.find((x) => x.uid === body.username && x.password === body.password);
        if (!c) return send(res, 400, { error: 'invalid_grant', error_description: 'Bad credentials' });
        uid = c.uid;
      }
      const token = randomUUID();
      state.tokens.set(token, { uid, exp: Date.now() + 43199 * 1000 });
      return send(res, 200, { access_token: token, token_type: 'bearer', refresh_token: randomUUID(), expires_in: 43199, scope: 'basic openid', });
    }

    // ---- media: every /medias/<name> is a generated SVG placeholder showing <name> ----
    if (req.method === 'GET' && path.startsWith('/medias/')) {
      const label = decodeURIComponent(path.slice('/medias/'.length)).replace(/\.\w+$/, '');
      const hue = [...label].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 0);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="600" height="300" fill="hsl(${hue},45%,85%)"/><text x="300" y="160" font-family="sans-serif" font-size="32" text-anchor="middle" fill="hsl(${hue},45%,25%)">${label.replace(/[<&>]/g, '')}</text></svg>`;
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'max-age=3600' });
      return res.end(svg);
    }

    // ---- mock-only admin endpoints (stand-in for Backoffice / synchronization) ----
    if (path.startsWith('/mock/admin/')) {
      if (req.method === 'PATCH' && path.startsWith('/mock/admin/products/')) {
        const p = state.staged.products.find((x) => x.code === path.split('/').pop());
        if (!p) return ocError(res, 404, 'UnknownIdentifierError', 'Product not found');
        Object.assign(p, body);
        return send(res, 200, { staged: true, code: p.code, name: p.name });
      }
      if (req.method === 'PATCH' && path.startsWith('/mock/admin/cms/components/')) {
        const uid = path.split('/').pop();
        const c = state.staged.cms.components[uid];
        if (!c) return ocError(res, 404, 'UnknownIdentifierError', 'Component not found');
        Object.assign(c, body);
        return send(res, 200, { staged: true, uid });
      }
      if (req.method === 'POST' && path === '/mock/admin/sync') {
        const what = body.catalog ?? 'both'; // "product" | "content" | "both"
        if (what !== 'content') state.online.products = clone(state.staged.products);
        if (what !== 'product') state.online.cms = clone(state.staged.cms);
        return send(res, 200, { synchronized: what });
      }
      return ocError(res, 404, 'UnknownResourceError', 'Unknown admin endpoint');
    }

    // ---- OCC v2 ----
    if (path === '/occ/v2/basesites' && req.method === 'GET') {
      return send(res, 200, { baseSites: project(baseSites, q.get('fields') ?? 'FULL') });
    }

    const m = /^\/occ\/v2\/([^/]+)\/(.*)$/.exec(path);
    if (!m) return ocError(res, 404, 'UnknownResourceError', `No handler for ${req.method} ${path}`);
    const [, siteId, rest] = m;
    if (!baseSites.some((b) => b.uid === siteId)) return ocError(res, 404, 'UnknownResourceError', `No base site '${siteId}' (did you leave the base site out of the URL?)`);
    const fields = q.get('fields') ?? 'DEFAULT';
    let r;

    if (req.method === 'GET' && rest === 'products/search') {
      const term = (q.get('query') ?? '').split(':')[0].toLowerCase();
      const pageSize = Number(q.get('pageSize') ?? 20);
      const page = Number(q.get('currentPage') ?? 0);
      // filters=code:a,b,c is how the product carousel asks for specific products
      const codes = /^code:(.+)$/.exec(q.get('filters') ?? '')?.[1].split(',');
      const hits = state.online.products.filter(
        (p) => (!codes || codes.includes(p.code)) && (!term || `${p.name} ${p.manufacturer} ${p.code}`.toLowerCase().includes(term)),
      );
      const slice = hits.slice(page * pageSize, page * pageSize + pageSize);
      const res0 = {
        products: slice,
        pagination: { currentPage: page, pageSize, totalResults: hits.length, totalPages: Math.ceil(hits.length / pageSize) },
        freeTextSearch: q.get('query') ?? '',
        currentQuery: { query: { value: q.get('query') ?? '' }, url: `/search?q=${encodeURIComponent(q.get('query') ?? '')}` },
        sorts: [{ code: 'relevance', name: 'Relevance', selected: true }],
        facets: [],
        breadcrumbs: [],
      };
      // "fields" on search applies to the wrapper; named levels apply to each product
      const out = LEVELS[fields] || fields === 'FULL' ? { ...res0, products: project(slice, fields) } : pick(res0, parseFields(fields));
      return send(res, 200, out);
    }
    if (req.method === 'GET' && rest === 'products/suggestions') {
      const term = (q.get('term') ?? '').toLowerCase();
      const names = state.online.products.map((p) => p.name).filter((n) => term && n.toLowerCase().includes(term));
      return send(res, 200, { suggestions: names.slice(0, Number(q.get('max') ?? 5)).map((value) => ({ value })) });
    }
    if (req.method === 'GET' && (r = /^products\/([^/]+)\/reviews$/.exec(rest))) return send(res, 200, { reviews: [] });
    if (req.method === 'GET' && (r = /^products\/([^/]+)\/references$/.exec(rest))) {
      // every other product is a SIMILAR reference; the cheaper ones are also ACCESSORIES
      const others = state.online.products.filter((p) => p.code !== r[1]);
      const references = [
        ...others.map((p) => ({ referenceType: 'SIMILAR', preselected: false, target: p })),
        ...others.filter((p) => p.price.value < 300).map((p) => ({ referenceType: 'ACCESSORIES', preselected: false, target: p })),
      ].filter((ref) => !q.get('referenceType') || ref.referenceType === q.get('referenceType'));
      return send(res, 200, { references });
    }
    if (req.method === 'GET' && (r = /^products\/([^/]+)$/.exec(rest))) {
      const p = state.online.products.find((x) => x.code === r[1]);
      if (!p) return ocError(res, 400, 'UnknownIdentifierError', `Product with code '${r[1]}' not found!`);
      return send(res, 200, project(p, fields));
    }
    // CMS: the storefront uses users/{userId}/cms/...; the plain cms/... form is kept for the Phase 3 curl calls
    const cmsPath = rest.replace(/^users\/[^/]+\//, '');
    if (req.method === 'GET' && cmsPath === 'cms/pages') {
      const page = findPage(q);
      if (!page) return ocError(res, 400, 'CMSItemNotFoundError', `No page found for pageLabelOrId '${q.get('pageLabelOrId') ?? ''}' (pageType ${q.get('pageType') ?? 'ContentPage'})`);
      return send(res, 200, assemblePage(page));
    }
    if ((r = /^cms\/pages\/([^/]+)$/.exec(cmsPath)) && req.method === 'GET') {
      const page = state.online.cms.pages[r[1]];
      if (!page) return ocError(res, 400, 'CMSItemNotFoundError', `No page with uid '${r[1]}'`);
      return send(res, 200, assemblePage(page));
    }
    if (cmsPath === 'cms/components' && (req.method === 'GET' || req.method === 'POST')) {
      const ids = req.method === 'POST' ? (body.idList ?? []) : (q.get('componentIds') ?? '').split(',').filter(Boolean);
      const component = ids.map((id) => state.online.cms.components[id]).filter(Boolean);
      return send(res, 200, { component, pagination: { currentPage: 0, pageSize: component.length, totalResults: component.length, totalPages: 1 } });
    }
    if ((r = /^cms\/components\/([^/]+)$/.exec(cmsPath)) && req.method === 'GET') {
      const c = state.online.cms.components[r[1]];
      if (!c) return ocError(res, 400, 'CMSItemNotFoundError', `No component with uid '${r[1]}'`);
      return send(res, 200, c);
    }

    // site context
    const store = baseSites.find((b) => b.uid === siteId).stores[0];
    if (req.method === 'GET' && rest === 'languages')
      return send(res, 200, { languages: store.languages.map((l) => ({ ...l, nativeName: l.name, active: true })) });
    if (req.method === 'GET' && rest === 'currencies')
      return send(res, 200, { currencies: store.currencies.map((c) => ({ ...c, active: true })) });
    if (req.method === 'GET' && /^users\/[^/]+\/consenttemplates$/.test(rest)) return send(res, 200, { consentTemplates: [] });

    // carts and users
    r = /^users\/([^/]+)(?:\/(.*))?$/.exec(rest);
    if (r) {
      const user = r[1];
      const sub = r[2] ?? '';
      if (user !== 'anonymous') {
        const auth = authUser(req);
        if (auth.error) return send(res, 401, { error: auth.error, error_description: auth.description });
        if (user === 'current' && sub === '' && req.method === 'GET') {
          const c = customers.find((x) => x.uid === auth.uid);
          if (!c) return ocError(res, 403, 'ForbiddenError', 'Client credentials have no user profile');
          return send(res, 200, project({ uid: c.uid, name: c.name, firstName: c.firstName, lastName: c.lastName, displayUid: c.uid }, q.get('fields') ?? 'FULL'));
        }
      }
      const owner = user === 'anonymous' ? 'anonymous' : 'current';
      let c;
      if (req.method === 'POST' && sub === 'carts') {
        const cart = { owner, code: String(Math.floor(Math.random() * 1e8)).padStart(8, '0'), guid: randomUUID(), entries: [] };
        state.carts.push(cart);
        return send(res, 201, cartView(cart, 'FULL' === fields ? 'FULL' : 'BASIC'));
      }
      if ((c = /^carts\/([^/]+)(?:\/entries(?:\/(\d+))?)?$/.exec(sub))) {
        const cart = findCart(owner, c[1]);
        // same shape as the real OCC, so the storefront drops the stale cart silently
        // (e.g. after the mock restarts and forgets its in-memory carts)
        if (!cart) return send(res, 400, { errors: [{ type: 'CartError', message: 'Cart not found.', reason: 'notFound', subjectType: 'cart', subject: c[1] }] });
        const hasEntries = sub.includes('/entries');
        if (!hasEntries && req.method === 'GET') return send(res, 200, cartView(cart, fields));
        if (hasEntries && req.method === 'POST' && c[2] === undefined) {
          const code = body.product?.code;
          const prod = state.online.products.find((x) => x.code === code);
          if (!prod) return ocError(res, 400, 'UnknownIdentifierError', `Product with code '${code}' not found!`);
          const qty = Number(body.quantity ?? 1);
          const existing = cart.entries.find((e) => e.code === code);
          if (existing) existing.quantity += qty;
          else cart.entries.push({ code, quantity: qty });
          const idx = cart.entries.findIndex((e) => e.code === code);
          return send(res, 200, { statusCode: 'success', quantityAdded: qty, quantity: cart.entries[idx].quantity, entry: cartView(cart, 'FULL').entries[idx] });
        }
        if (hasEntries && c[2] !== undefined) {
          const i = Number(c[2]);
          if (!cart.entries[i]) return ocError(res, 400, 'CartEntryError', `Entry ${i} not found`);
          if (req.method === 'PATCH' || req.method === 'PUT') {
            cart.entries[i].quantity = Number(body.quantity);
            if (cart.entries[i].quantity <= 0) cart.entries.splice(i, 1);
            return send(res, 200, { statusCode: 'success', quantity: body.quantity });
          }
          if (req.method === 'DELETE') {
            cart.entries.splice(i, 1);
            return send(res, 200);
          }
        }
      }
    }

    return ocError(res, 404, 'UnknownResourceError', `No handler for ${req.method} ${path}`);
  }

  return http.createServer((req, res) => {
    // one line per request; unhandled calls stand out as 404 "No handler"
    if (log) res.on('finish', () => console.log(`${res.statusCode} ${req.method} ${req.url}`));
    handle(req, res).catch((err) => {
      console.error(err);
      if (!res.headersSent) send(res, 500, { errors: [{ type: 'InternalError', message: String(err) }] });
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 9002);
  const origins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:4200 https://localhost:4200').split(/\s+/).filter(Boolean);
  createMockServer({ allowedOrigins: origins, log: process.env.QUIET !== '1' }).listen(port, () => {
    console.log(`Mock SAP Commerce listening on http://localhost:${port}  (allowed origins: ${origins.join(', ')})`);
    console.log(`  OCC   : http://localhost:${port}/occ/v2/electronics-spa`);
    console.log(`  OAuth : http://localhost:${port}/authorizationserver/oauth/token`);
  });
}
