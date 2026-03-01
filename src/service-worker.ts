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
        // For navigation requests, serve cached page or SPA fallback (index.html)
        // SvelteKit's client-side router handles the actual routing
        const cached = await caches.match(event.request);
        if (cached) return addCoopCoep(cached);

        // SPA fallback: serve the index page for any /launcher/* route
        const indexResponse = await caches.match(`${base}/`);
        if (indexResponse) return addCoopCoep(indexResponse);

        // Last resort: try network
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) return addCoopCoep(networkResponse);
        } catch {}

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

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        return new Response('Offline', { status: 503 });
      });
    })
  );
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
