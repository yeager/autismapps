/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

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

  // Navigation requests: let GitHub Pages 404.html SPA fallback work normally.
  // Only intercept if truly offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network — GitHub Pages returns 404 with SPA HTML, which is fine
          const response = await fetch(event.request);
          // Accept any response that has HTML body (including 404 from GH Pages)
          if (response.status < 500) {
            return addCoopCoep(response);
          }
        } catch {}

        // Truly offline: serve cached index.html as SPA shell
        const cached =
          await caches.match('/index.html') ||
          await caches.match('/');
        if (cached) return addCoopCoep(cached);

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
