// Mock SAP Commerce backend (OCC v2 + authorization server). Zero dependencies.
//   node server.mjs            -> http://localhost:9002
// Env: PORT, ALLOWED_ORIGINS (space separated; default "http://localhost:4200 https://localhost:4200")
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { baseSites, customers, clients, products, cmsPages } from './data.mjs';

const clone = (o) => structuredClone(o);

// ---- fields parameter: BASIC / DEFAULT / FULL or a projection like "code,price(formattedValue)" ----
const LEVELS = {
  BASIC: ['code', 'name', 'url'],
  DEFAULT: ['code', 'name', 'url', 'summary', 'price', 'stock', 'images', 'averageRating'],
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
  if (Array.isArray(value)) return value.map((v) => pick(v, tree));
  const out = {};
  for (const [k, sub] of Object.entries(tree)) if (k in value) out[k] = pick(value[k], sub);
  return out;
}

function project(value, fields = 'DEFAULT') {
  if (fields === 'FULL') return value;
  if (LEVELS[fields]) return pick(value, Object.fromEntries(LEVELS[fields].map((f) => [f, true])));
  return pick(value, parseFields(fields));
}

const money = (value) => ({
  currencyIso: 'USD',
  value: Math.round(value * 100) / 100,
  formattedValue: `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
});

// ---- server factory (each instance has its own state, handy for tests) ----
export function createMockServer({ allowedOrigins = ['http://localhost:4200', 'https://localhost:4200'] } = {}) {
  const state = {
    staged: { products: clone(products), cms: clone(cmsPages) },
    online: { products: clone(products), cms: clone(cmsPages) },
    tokens: new Map(), // access_token -> { uid, exp }
    carts: [],
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
      Object.assign(cors, {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept-Language, Cache-Control',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        Vary: 'Origin',
      });
    }
    // every response from here on carries the CORS headers (or none, if the origin is not on the guest list)
    const origWriteHead = res.writeHead.bind(res);
    res.writeHead = (status, headers = {}) => origWriteHead(status, { ...cors, ...headers });

    if (req.method === 'OPTIONS') return send(res, 204);

    const url = new URL(req.url, 'http://mock');
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
        const comps = Object.values(state.staged.cms).flatMap((pg) => pg.contentSlots.contentSlot.flatMap((s) => s.components.component));
        const c = comps.find((x) => x.uid === uid);
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
      const hits = state.online.products.filter((p) => !term || `${p.name} ${p.manufacturer} ${p.code}`.toLowerCase().includes(term));
      const slice = hits.slice(page * pageSize, page * pageSize + pageSize);
      const res0 = {
        products: slice,
        pagination: { currentPage: page, pageSize, totalResults: hits.length, totalPages: Math.ceil(hits.length / pageSize) },
        freeTextSearch: q.get('query') ?? '',
      };
      // "fields" on search applies to the wrapper; named levels apply to each product
      const out = LEVELS[fields] || fields === 'FULL' ? { ...res0, products: project(slice, fields) } : pick(res0, parseFields(fields));
      return send(res, 200, out);
    }
    if (req.method === 'GET' && (r = /^products\/([^/]+)$/.exec(rest))) {
      const p = state.online.products.find((x) => x.code === r[1]);
      if (!p) return ocError(res, 400, 'UnknownIdentifierError', `Product with code '${r[1]}' not found!`);
      return send(res, 200, project(p, fields));
    }
    if (req.method === 'GET' && rest === 'cms/pages') {
      const label = (q.get('pageLabelOrId') ?? '').replace(/^\//, '') || 'homepage';
      const page = state.online.cms[label];
      if (!page) return ocError(res, 400, 'CMSItemNotFoundError', `No page found for pageLabelOrId '${label}'`);
      return send(res, 200, page);
    }

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
        if (!cart) return ocError(res, 400, 'CartError', `Cart not found.`);
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
    handle(req, res).catch((err) => {
      console.error(err);
      if (!res.headersSent) send(res, 500, { errors: [{ type: 'InternalError', message: String(err) }] });
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 9002);
  const origins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:4200 https://localhost:4200').split(/\s+/).filter(Boolean);
  createMockServer({ allowedOrigins: origins }).listen(port, () => {
    console.log(`Mock SAP Commerce listening on http://localhost:${port}  (allowed origins: ${origins.join(', ')})`);
    console.log(`  OCC   : http://localhost:${port}/occ/v2/electronics-spa`);
    console.log(`  OAuth : http://localhost:${port}/authorizationserver/oauth/token`);
  });
}
