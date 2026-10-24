import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJsonCache, fetchJsonWithFallback, fetchJsonWithTimeout } from '../../src/lib/arasaac/cache.ts';

const URL_A = 'https://api.arasaac.org/v1/pictograms/en/search/cat';
const URL_B = 'https://api.arasaac.org/v1/pictograms/en/search/dog';
const DAY = 24 * 60 * 60 * 1000;

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

test('fetchJsonWithTimeout aborts while a response body is still loading', async () => {
  let aborted = false;
  const fetcher = async (_url, { signal }) => new Response(new ReadableStream({
    start(controller) {
      signal.addEventListener('abort', () => {
        aborted = true;
        controller.error(new DOMException('The request was aborted', 'AbortError'));
      }, { once: true });
    }
  }), { headers: { 'content-type': 'application/json' } });

  await assert.rejects(fetchJsonWithTimeout(URL_A, 20, fetcher), { name: 'AbortError' });
  assert.equal(aborted, true);
});

test('fetchJsonWithFallback tries the stable catalog URL after a missing versioned file', async () => {
  const requested = [];
  const fetcher = async (url) => {
    requested.push(url);
    if (url.endsWith('/versioned.json')) return new Response('', { status: 404 });
    return Response.json({ entries: 1 });
  };
  const data = await fetchJsonWithFallback(['/launcher/versioned.json', '/launcher/stable.json?v=1'], 100, fetcher);
  assert.deepEqual(requested, ['/launcher/versioned.json', '/launcher/stable.json?v=1']);
  assert.deepEqual(data, { entries: 1 });
});

test('fetchJsonWithFallback uses the bundled catalog immediately after a network failure', async () => {
  const requested = [];
  const fetcher = async (url) => {
    requested.push(url);
    throw new TypeError('Failed to fetch');
  };
  const data = await fetchJsonWithFallback(
    ['/launcher/versioned.json', '/launcher/stable.json'],
    100,
    fetcher,
    async () => ({ entries: 'bundled' })
  );
  assert.deepEqual(requested, ['/launcher/versioned.json']);
  assert.deepEqual(data, { entries: 'bundled' });
});

/** Fake fetch: responder(url, n) returns the Response of the n-th call */
function fakeFetch(responder) {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    return responder(url, calls.length);
  };
  fn.calls = calls;
  return fn;
}

/** Minimal Cache Storage (open → match/put) over Maps */
function fakeCaches() {
  const stores = new Map();
  return {
    stores,
    async open(name) {
      if (!stores.has(name)) {
        const entries = new Map();
        stores.set(name, {
          entries,
          async match(url) {
            const r = entries.get(url);
            return r ? r.clone() : undefined;
          },
          async put(url, response) {
            entries.set(url, response.clone());
          },
        });
      }
      return stores.get(name);
    },
  };
}

test('concurrent requests for the same URL share one fetch', async () => {
  const fetch = fakeFetch(() => json([{ _id: 1 }]));
  const cache = createJsonCache({ fetch, caches: null });
  const [a, b] = await Promise.all([cache.get(URL_A), cache.get(URL_A)]);
  assert.deepEqual(a, [{ _id: 1 }]);
  assert.deepEqual(b, [{ _id: 1 }]);
  assert.equal(fetch.calls.length, 1);
});

test('a repeated request is served from memory', async () => {
  const fetch = fakeFetch(() => json([{ _id: 1 }]));
  const cache = createJsonCache({ fetch, caches: null });
  await cache.get(URL_A);
  await cache.get(URL_A);
  await cache.get(URL_B);
  assert.deepEqual(fetch.calls, [URL_A, URL_B]);
});

test('the persistent store survives a new cache instance (reload, other tab)', async () => {
  const fetch = fakeFetch(() => json([{ _id: 1 }]));
  const caches = fakeCaches();
  await createJsonCache({ fetch, caches, now: () => 1000 }).get(URL_A);
  const data = await createJsonCache({ fetch, caches, now: () => 2000 }).get(URL_A);
  assert.deepEqual(data, [{ _id: 1 }]);
  assert.equal(fetch.calls.length, 1);
  assert.ok(caches.stores.has('arasaac-api-v1'));
});

test('entries older than 30 days are fetched again', async () => {
  const fetch = fakeFetch((url, n) => json([{ _id: n }]));
  const caches = fakeCaches();
  await createJsonCache({ fetch, caches, now: () => 0 }).get(URL_A);
  const fresh = await createJsonCache({ fetch, caches, now: () => 29 * DAY }).get(URL_A);
  assert.deepEqual(fresh, [{ _id: 1 }]);
  const renewed = await createJsonCache({ fetch, caches, now: () => 31 * DAY }).get(URL_A);
  assert.deepEqual(renewed, [{ _id: 2 }]);
  assert.equal(fetch.calls.length, 2);
});

test('without network an expired entry is still used', async () => {
  const caches = fakeCaches();
  await createJsonCache({ fetch: fakeFetch(() => json([{ _id: 1 }])), caches, now: () => 0 }).get(URL_A);
  const offline = fakeFetch(() => { throw new TypeError('Failed to fetch'); });
  const data = await createJsonCache({ fetch: offline, caches, now: () => 60 * DAY }).get(URL_A);
  assert.deepEqual(data, [{ _id: 1 }]);
  assert.equal(offline.calls.length, 1);
});

test('HTTP errors are not cached and the next call retries', async () => {
  const fetch = fakeFetch((url, n) => (n === 1 ? json({ error: 'busy' }, 503) : json([{ _id: 7 }])));
  const caches = fakeCaches();
  const cache = createJsonCache({ fetch, caches });
  await assert.rejects(cache.get(URL_A), /HTTP 503/);
  assert.equal((await caches.open('arasaac-api-v1')).entries.size, 0);
  assert.deepEqual(await cache.get(URL_A), [{ _id: 7 }]);
  assert.equal(fetch.calls.length, 2);
});

test('memory keeps at most maxEntries URLs', async () => {
  const fetch = fakeFetch(() => json([]));
  const cache = createJsonCache({ fetch, caches: null, maxEntries: 2 });
  await cache.get(URL_A);
  await cache.get(URL_B);
  await cache.get('https://api.arasaac.org/v1/pictograms/en/search/cow');
  await cache.get(URL_A);
  assert.equal(fetch.calls.length, 4, 'URL_A was evicted and fetched again');
});
