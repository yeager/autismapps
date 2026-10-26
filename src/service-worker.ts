/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';
import { TRAFFIC_SAFETY_PICTOGRAM_REVISION } from '$lib/data/pictogram-cache.js';
import { detectLocale, pick } from '$lib/i18n/locales';

const sw = self as unknown as ServiceWorkerGlobalScope;
// Not imported from $service-worker: SvelteKit's dev module doesn't export `base` (only the build does),
// so the import was a SyntaxError under `npm run dev`. The scope is the base path ("/autismapps/" on Pages).
const base = new URL(sw.registration.scope).pathname.replace(/\/$/, '');
const CACHE = `cache-${version}`;
// Pictograms never change for a given id, so they live in a cache that survives deploys
// (the page keeps ARASAAC API answers in `arasaac-api-v1`, see src/lib/arasaac/cache.ts)
const IMAGE_CACHE = 'arasaac-images-v1';
const MAX_IMAGES = 1500;

const versionedPictogramAssets = files
	.filter((file) => /\/pictograms\/traffic-safety\/\d+\.png$/.test(file))
	.map((file) => `${file}?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}`);
const versionedPiktaliTrafficAssets = files
	.filter((file) => /\/piktali-pictograms\/assets\/(trafficlight-fd91ed3bdb7e-v2\.svg|crosswalk-9302fa0c66df\.webp|danger-4bc28024e9b4\.webp|safeplace-59c8550bf6e0-v2\.svg|reflector-vest-ce860b12f9aa-v2\.svg|car-a54a1ff80372\.webp|sidewalk\.svg|street\.svg|parkinglot\.svg|playground\.webp|school\.webp|roadworks\.svg)$/.test(file))
	.map((file) => `${file}?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}`);
const versionedTrafficSignAssets = files
	.filter((file) => /\/pictograms\/traffic-safety\/signs\/[a-z0-9-]+\.png$/.test(file))
	.map((file) => `${file}?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}`);

// Paths from $service-worker already include the base path (/autismapps on Pages).
// Prerendered pages are cached too so navigations work offline.
const ASSETS = [
  ...build,
  ...prerendered,
  ...versionedPictogramAssets,
  ...versionedPiktaliTrafficAssets,
  ...versionedTrafficSignAssets
];
// The ONNX Runtime WASM is about 25 MB. Cache.addAll rejects it on some
// browsers, which would prevent the entire service worker from installing.
// Keep it in ASSETS for routing, but fetch it on demand without Cache Storage.
const PRECACHE_ASSETS = ASSETS.filter((asset) => !asset.endsWith('.wasm'));
// Match requests by pathname while retaining query strings in the Cache key.
// Versioned card pictograms are precached as `file.svg?v=...`, but fetch events
// expose the pathname separately from the query string.
const ASSET_PATHS = new Set(ASSETS.map((asset) => new URL(asset, sw.registration.scope).pathname));

// Shown only when offline and no page shell is cached. The app's saved locale lives in
// localStorage (not reachable from a service worker), so this follows the browser language.
const OFFLINE_TEXT: Record<string, { lang: string; title: string; body: string }> = {
  en: { lang: 'en', title: 'Offline', body: 'Connect to the internet and try again.' },
  sv: { lang: 'sv', title: 'Offline', body: 'Anslut till internet och försök igen.' },
  pt_BR: { lang: 'pt-BR', title: 'Sem conexão', body: 'Conecte-se à internet e tente novamente.' }
};

function offlineResponse(): Response {
  const text = pick(OFFLINE_TEXT, detectLocale(sw.navigator.language));
  const html = `<!doctype html><html lang="${text.lang}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1"><title>${text.title}</title></head>` +
    `<body style="font-family:system-ui,sans-serif;text-align:center;padding:48px 16px">` +
    `<h1>${text.title}</h1><p>${text.body}</p></body></html>`;
  return new Response(html, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => {
      sw.skipWaiting();
    })
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      for (const key of keys) {
        if (key !== CACHE && !key.startsWith('arasaac-')) await caches.delete(key);
      }
      sw.clients.claim();
    })
  );
});

sw.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Navigation requests: let GitHub Pages 404.html SPA fallback work normally.
  // Only intercept if truly offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        let cache: Cache | undefined;
        try {
          cache = await caches.open(CACHE);
        } catch {}

        // Keep query strings (which may contain a child's name or avatar) out
        // of the cache key. The route shell is identical without them, and
        // SvelteKit can still read the current URL after the cached page loads.
        const cacheUrl = new URL(event.request.url);
        cacheUrl.search = '';
        cacheUrl.hash = '';
        const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });

        try {
          // Try network — GitHub Pages returns 404 with SPA HTML, which is fine
          const response = await fetch(event.request);
          // Cache successful HTML documents so previously visited routes remain
          // available offline. Do not cache error pages or query-string data.
          if (
            cache &&
            response.status === 200 &&
            response.headers.get('content-type')?.includes('text/html') &&
            new URL(response.url || event.request.url).origin === location.origin
          ) {
            try {
              await cache.put(cacheKey, response.clone());
            } catch {}
          }
          // Accept any response below 500 (including the GitHub Pages SPA fallback).
          // A 5xx falls back to a cached copy of the route, else the real error is shown.
          if (response.status < 500) {
            return addCoopCoep(response);
          }
          const previous = cache ? await cache.match(cacheKey).catch(() => undefined) : undefined;
          return addCoopCoep(previous ?? response);
        } catch {}

        // Truly offline: serve this route if it was visited (or prerendered) before, then fall
        // back to the launcher shell for routes without a cached document.
        let cached: Response | undefined;
        try {
          cached =
            (await caches.match(cacheKey)) ||
            (await caches.match(`${base}/index.html`)) ||
            (await caches.match(`${base}/`));
        } catch {}
        if (cached) return addCoopCoep(cached);

        return offlineResponse();
      })()
    );
    return;
  }

  // Cache Piper TTS model files from HuggingFace (cache-first after first download)
  if (url.hostname.includes('huggingface.co') && (url.pathname.endsWith('.onnx') || url.pathname.endsWith('.onnx.json') || url.pathname.endsWith('.wasm') || url.pathname.endsWith('.data'))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // ARASAAC API: cached by the page (src/lib/arasaac/cache.ts)
  if (url.hostname === 'api.arasaac.org') return;

  if (url.hostname === 'static.arasaac.org') {
    event.respondWith(arasaacImage(event.request));
    return;
  }

  // Skip external requests except ARASAAC images
  if (url.origin !== location.origin && !url.hostname.includes('arasaac.org')) return;

  const isAsset = ASSET_PATHS.has(url.pathname);

  if (isAsset) {
    // Cache Storage fails on this large response in supported browsers. Let
    // the network handle it on demand without making service-worker install fail.
    if (url.pathname.endsWith('.wasm')) {
      event.respondWith(fetch(event.request).catch(() => new Response('Offline', { status: 503 })));
      return;
    }

    // Cache-first for static build assets
    event.respondWith(
      (async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        try {
          const response = await fetch(event.request);
          if (response.status === 200) {
            try {
              const cache = await caches.open(CACHE);
              await cache.put(event.request, response.clone());
            } catch {
              // Storage may be full or unavailable; the downloaded file still works online.
            }
          }
          return response;
        } catch {
          return new Response('Offline', { status: 503 });
        }
      })()
    );
  } else {
    // Network-first for dynamic content (ARASAAC images etc)
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || new Response('Offline', { status: 503 });
        });
      })
    );
  }
});

// Cache-first. Fetched with CORS (ARASAAC allows it) so the stored copy is not opaque: Chrome counts
// ~7 MB of quota for every opaque response.
async function arasaacImage(request: Request): Promise<Response> {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request.url);
  if (cached) return cached;
  try {
    const response = await fetch(request.url, { mode: 'cors', credentials: 'omit' });
    if (response.ok) {
      await cache.put(request.url, response.clone());
      void trimImages(cache);
    }
    return response;
  } catch {
    try {
      return await fetch(request);
    } catch {
      return new Response('Offline', { status: 503 });
    }
  }
}

// Keys come back in insertion order: drop the oldest beyond MAX_IMAGES
async function trimImages(cache: Cache): Promise<void> {
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - MAX_IMAGES))) await cache.delete(key);
}

function addCoopCoep(response: Response): Response {
  // Don't add COOP/COEP — it breaks cross-origin images (ARASAAC pictograms)
  return response;
}
