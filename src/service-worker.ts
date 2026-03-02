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

  // For same-origin navigations: network-first with SPA fallback
  if (url.origin === location.origin && event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        // Try network first
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, clone));
            return addCoopCoep(networkResponse);
          }
        } catch {}

        // Fallback to cache for this exact URL
        const cached = await caches.match(event.request);
        if (cached) return addCoopCoep(cached);

        // SPA fallback: serve index.html (try both / and /index.html)
        const indexResponse =
          await caches.match(`${base}/index.html`) ||
          await caches.match(`${base}/`) ||
          await caches.match('/index.html') ||
          await caches.match('/');
        if (indexResponse) return addCoopCoep(indexResponse);

        return new Response('<html><body><h1>Offline</h1><p>Anslut till internet och försök igen.</p></body></html>', {
          status: 503,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })()
    );
    return;
  }

  // Skip external requests except ARASAAC images
  if (url.origin !== location.origin && !url.hostname.includes('arasaac.org')) return;

  const isAsset = ASSETS.includes(url.pathname);

  if (isAsset) {
    // Cache-first for static build assets
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
