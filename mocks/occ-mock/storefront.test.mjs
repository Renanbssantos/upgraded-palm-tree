// What the Composable Storefront (221121.20) needs from the mock to render home, PDP, search and cart.
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

const get = async (url, headers = {}) => {
  const res = await fetch(url, { headers });
  return { status: res.status, headers: res.headers, body: res.headers.get('content-type')?.includes('json') ? await res.json() : await res.text() };
};
const positions = (page) => page.contentSlots.contentSlot.map((s) => s.position);

test('homepage via users/anonymous/cms/pages, with shared header and footer slots', async () => {
  const { body } = await get(`${BASE}/users/anonymous/cms/pages?lang=en&curr=USD`);
  assert.equal(body.template, 'LandingPage2Template');
  for (const p of ['Section1', 'SiteLogo', 'SearchBox', 'MiniCart', 'SiteLogin', 'SiteContext', 'NavigationBar', 'Footer'])
    assert.ok(positions(body).includes(p), `missing slot ${p}`);
});

test('product page for a known code, error for an unknown one, not-found page', async () => {
  const pdp = (await get(`${BASE}/users/anonymous/cms/pages?pageType=ProductPage&code=1934793`)).body;
  assert.equal(pdp.template, 'ProductDetailsPageTemplate');
  assert.ok(positions(pdp).includes('Summary'));
  assert.equal((await get(`${BASE}/users/anonymous/cms/pages?pageType=ProductPage&code=nope`)).status, 400);
  assert.equal((await get(`${BASE}/users/anonymous/cms/pages?pageType=ContentPage&pageLabelOrId=%2Fnot-found`)).body.template, 'ErrorPageTemplate');
});

test('navigation links are loaded through cms/components', async () => {
  const { body } = await get(`${BASE}/users/anonymous/cms/components?fields=DEFAULT&componentIds=CamerasCategoryLink%2CAboutLink`);
  assert.deepEqual(body.component.map((c) => c.typeCode), ['CMSLinkComponent', 'CMSLinkComponent']);
});

test('site context endpoints', async () => {
  assert.deepEqual((await get(`${BASE}/languages`)).body.languages.map((l) => l.isocode), ['en', 'de']);
  assert.deepEqual((await get(`${BASE}/currencies`)).body.currencies.map((c) => c.isocode), ['USD', 'JPY']);
});

test('product carousel filters, nested field levels and suggestions', async () => {
  const s = (await get(`${BASE}/products/search?fields=products(code,images(DEFAULT))&query=&filters=code%3A300938%2C872912`)).body;
  assert.deepEqual(s.products.map((p) => p.code), ['300938', '872912']);
  assert.ok(s.products[0].images[0].url, 'images(DEFAULT) must keep the image fields');
  assert.equal((await get(`${BASE}/products/suggestions?term=power&max=5`)).body.suggestions[0].value, 'PowerShot A480');
});

test('media placeholders, also with the double slash the storefront sends', async () => {
  const r = await get(`${host}//medias/logo.svg`);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-type'), 'image/svg+xml');
});

test('CORS preflight allows the storefront headers', async () => {
  const res = await fetch(`${BASE}/users/anonymous/cms/pages`, {
    method: 'OPTIONS',
    headers: { Origin: 'http://localhost:4200', 'Access-Control-Request-Headers': 'x-anonymous-consents' },
  });
  assert.match(res.headers.get('access-control-allow-headers'), /x-anonymous-consents/);
});
