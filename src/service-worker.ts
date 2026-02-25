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

  // For same-origin navigations, inject COOP/COEP headers to enable SharedArrayBuffer
  // (needed for ONNX/Piper WASM on GitHub Pages which doesn't support custom headers)
  if (url.origin === location.origin && event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cached = await caches.match(event.request);
        const response = cached || await fetch(event.request).catch(() => null);
        if (!response || response.status !== 200) {
          const fallback = await caches.match('/');
          if (fallback) return addCoopCoep(fallback);
          return new Response('Offline', { status: 503 });
        }
        // Cache it
        if (!cached) {
          const cache = await caches.open(CACHE);
          cache.put(event.request, response.clone());
        }
        return addCoopCoep(response);
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
