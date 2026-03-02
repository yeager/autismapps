/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { base, build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;
const CACHE = `cache-${version}`;

const ASSETS = [
  ...build,
  ...files
];

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => {
      sw.skipWaiting();
    })
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      for (const key of keys) {
        if (key !== CACHE) await caches.delete(key);
      }
      sw.clients.claim();
    })
  );
});

sw.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For same-origin navigations, inject COOP/COEP headers to enable SharedArrayBuffer
  // (needed for ONNX/Piper WASM on GitHub Pages which doesn't support custom headers)
  if (url.origin === location.origin && event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        // Network-first for navigation requests
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            // Update cache with fresh response
            const clone = networkResponse.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, clone));
            return addCoopCoep(networkResponse);
          }
        } catch {}

        // Fallback to cache
        const cached = await caches.match(event.request);
        if (cached) return addCoopCoep(cached);

        // SPA fallback: serve the index page
        const indexResponse = await caches.match(`${base}/`);
        if (indexResponse) return addCoopCoep(indexResponse);

        // Truly offline
        return new Response('<html><body><h1>Offline</h1><p>Appen är inte tillgänglig offline ännu. Anslut till internet och försök igen.</p></body></html>', {
          status: 503,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })()
    );
    return;
  }

  // Skip external requests except ARASAAC API images
  if (url.origin !== location.origin && !url.hostname.includes('arasaac.org')) return;

  const isAsset = ASSETS.includes(url.pathname);

  if (isAsset) {
    // Cache-first for known static assets
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => new Response('Offline', { status: 503 }));
      })
    );
  } else {
    // Network-first for dynamic content and ARASAAC images
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

function addCoopCoep(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
