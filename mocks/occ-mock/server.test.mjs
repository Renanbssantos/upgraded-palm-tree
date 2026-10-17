// Walks through the Phase 3 checkpoint against the mock: node --test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createMockServer } from './server.mjs';

let server, host, BASE;
before(async () => {
  server = createMockServer();
  await new Promise((r) => server.listen(0, r));
  host = `http://localhost:${server.address().port}`;
  BASE = `${host}/occ/v2/electronics-spa`;
});
after(() => server.close());

const j = async (url, init) => {
  const res = await fetch(url, init);
  const text = await res.text();
  return { status: res.status, headers: res.headers, body: text ? JSON.parse(text) : undefined };
};
const post = (url, body) => j(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('Step 1: base sites expose languages and currencies', async () => {
  const { body } = await j(`${host}/occ/v2/basesites`);
  const store = body.baseSites[0].stores[0];
  assert.equal(body.baseSites[0].uid, 'electronics-spa');
  assert.deepEqual(store.languages.map((l) => l.isocode), ['en', 'de']);
  assert.deepEqual(store.currencies.map((c) => c.isocode), ['USD', 'JPY']);
});

test('Step 2: Staged edits only reach the API after synchronization', async () => {
  const before = await j(`${BASE}/products/300938?fields=name`);
  await j(`${host}/mock/admin/products/300938`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Renamed' }) });
  assert.equal((await j(`${BASE}/products/300938?fields=name`)).body.name, before.body.name);
  await post(`${host}/mock/admin/sync`, { catalog: 'product' });
  assert.equal((await j(`${BASE}/products/300938?fields=name`)).body.name, 'Renamed');
});

test('Step 3: search, fields levels and projection', async () => {
  const s = await j(`${BASE}/products/search?query=canon&fields=DEFAULT`);
  assert.equal(s.body.pagination.totalResults, 2);
  const size = async (f) => JSON.stringify((await j(`${BASE}/products/1934793?fields=${f}`)).body).length;
  assert.ok((await size('BASIC')) < (await size('DEFAULT')));
  assert.ok((await size('DEFAULT')) < (await size('FULL')));
  const p = (await j(`${BASE}/products/1934793?fields=code,name,price(formattedValue)`)).body;
  assert.deepEqual(Object.keys(p), ['code', 'name', 'price']);
  assert.deepEqual(Object.keys(p.price), ['formattedValue']);
  assert.equal((await j(`${host}/occ/v2/products/1934793`)).status, 404); // base site left out
});

test('Step 4: OAuth2 password grant and 401s', async () => {
  assert.equal((await j(`${BASE}/users/current`)).status, 401);
  assert.equal((await j(`${BASE}/users/current`, { headers: { Authorization: 'Bearer nope' } })).status, 401);
  const form = (o) => ({ method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(o) });
  const bad = await j(`${host}/authorizationserver/oauth/token`, form({ client_id: 'x', client_secret: 'y', grant_type: 'password' }));
  assert.equal(bad.body.error, 'invalid_client');
  const tok = await j(`${host}/authorizationserver/oauth/token`, form({ client_id: 'mobile_android', client_secret: 'secret', grant_type: 'password', username: 'customer@example.com', password: 'Test1234!' }));
  assert.equal(tok.body.expires_in, 43199);
  const me = await j(`${BASE}/users/current`, { headers: { Authorization: `Bearer ${tok.body.access_token}` } });
  assert.equal(me.body.uid, 'customer@example.com');
});

test('Step 5: anonymous cart create, add, change, remove', async () => {
  const { guid } = (await post(`${BASE}/users/anonymous/carts`)).body;
  assert.ok(guid);
  const add = await post(`${BASE}/users/anonymous/carts/${guid}/entries`, { product: { code: '1934793' }, quantity: 1 });
  assert.equal(add.body.statusCode, 'success');
  let cart = (await j(`${BASE}/users/anonymous/carts/${guid}?fields=FULL`)).body;
  assert.equal(cart.entries[0].entryNumber, 0);
  assert.equal(cart.totalItems, 1);
  assert.equal(cart.totalPrice.formattedValue, '$264.69');
  const patch = await j(`${BASE}/users/anonymous/carts/${guid}/entries/0`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: 3 }) });
  assert.equal(patch.status, 200);
  cart = (await j(`${BASE}/users/anonymous/carts/${guid}?fields=FULL`)).body;
  assert.equal(cart.totalUnitCount, 3);
  assert.equal(cart.totalPrice.value, 794.07);
  assert.equal((await j(`${BASE}/users/anonymous/carts/${guid}/entries/0`, { method: 'DELETE' })).status, 200);
  assert.equal((await j(`${BASE}/users/anonymous/carts/${guid}?fields=FULL`)).body.totalItems, 0);
});

test('Step 6: CMS page has template, slots and component typeCodes; content syncs separately', async () => {
  const page = (await j(`${BASE}/cms/pages?pageType=ContentPage&pageLabelOrId=homepage`)).body;
  assert.equal(page.template, 'LandingPage2Template');
  const slot = page.contentSlots.contentSlot.find((s) => s.position === 'Section1');
  assert.equal(slot.components.component[0].typeCode, 'SimpleResponsiveBannerComponent');
  await j(`${host}/mock/admin/cms/components/ElectronicsHompageSplashBannerComponent`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'New banner' }) });
  await post(`${host}/mock/admin/sync`, { catalog: 'product' }); // wrong catalog: content unchanged
  const stale = (await j(`${BASE}/cms/pages?pageType=ContentPage&pageLabelOrId=homepage`)).body;
  assert.notEqual(stale.contentSlots.contentSlot[0].components.component[0].name, 'New banner');
  await post(`${host}/mock/admin/sync`, { catalog: 'content' });
  const fresh = (await j(`${BASE}/cms/pages?pageType=ContentPage&pageLabelOrId=homepage`)).body;
  assert.equal(fresh.contentSlots.contentSlot[0].components.component[0].name, 'New banner');
});

test('Step 7: CORS only for allowed origins', async () => {
  const ok = await fetch(`${BASE}/products/300938`, { headers: { Origin: 'http://localhost:4200' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:4200');
  const no = await fetch(`${BASE}/products/300938`, { headers: { Origin: 'http://evil.example' } });
  assert.equal(no.headers.get('access-control-allow-origin'), null);
  const pre = await fetch(`${BASE}/cms/pages`, { method: 'OPTIONS', headers: { Origin: 'http://localhost:4200', 'Access-Control-Request-Method': 'GET' } });
  assert.equal(pre.status, 204);
});
