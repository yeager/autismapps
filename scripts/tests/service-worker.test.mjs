import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/service-worker.ts', import.meta.url), 'utf8');

/** Names imported from the `$service-worker` virtual module */
function serviceWorkerImports(code) {
  const m = code.match(/import\s*\{([^}]*)\}\s*from\s*['"]\$service-worker['"]/);
  return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
}

test('the service worker imports only what SvelteKit dev also exports', () => {
  // SvelteKit's dev module exports build, files, prerendered and version — `base` only exists in the
  // build, so importing it was a SyntaxError under `npm run dev` (the base comes from the scope instead).
  const allowed = ['build', 'files', 'prerendered', 'version'];
  const imported = serviceWorkerImports(src);
  assert.ok(imported.length > 0, 'expected an import from $service-worker');
  for (const name of imported) assert.ok(allowed.includes(name), `${name} is not exported in dev`);
});

test('the base path is derived from the registration scope', () => {
  assert.match(src, /new URL\(sw\.registration\.scope\)\.pathname/);
});

test('service-worker installation does not precache every static file', () => {
  // The static tree includes thousands of Piktali SVGs and tens of megabytes of
  // other assets. They are cached on first use by the runtime network-first path.
  assert.match(src, /const ASSETS = \[\s*\.\.\.build,\s*\.\.\.prerendered,/);
  assert.doesNotMatch(src, /const ASSETS = \[[^\]]*\.\.\.files,/s);
});

test('the large ONNX Runtime WASM stays lazy so it cannot block service-worker installation', () => {
  assert.match(src, /const PRECACHE_ASSETS = ASSETS\.filter\(\(asset\) => !asset\.endsWith\('\.wasm'\)\)/);
  assert.match(src, /cache\.addAll\(PRECACHE_ASSETS\)/);
  assert.match(src, /const isAsset = ASSETS\.includes\(url\.pathname\)/);
});

test('large WASM is fetched on demand without a Cache Storage write', () => {
  assert.match(src, /if \(url\.pathname\.endsWith\('\.wasm'\)\) \{\s*event\.respondWith\(fetch\(event\.request\)\.catch\(\(\) => new Response\('Offline', \{ status: 503 \}\)\)\)/);
});

test('the service worker precaches every versioned traffic-safety card pictogram', () => {
  const cardAssets = [
    'trafficlight-b90e2485662d.webp',
    'crosswalk-9302fa0c66df.webp',
    'danger-4bc28024e9b4.webp',
    'safeplace-59c8550bf6e0.svg',
    'reflector-vest-ce860b12f9aa.svg',
    'car-a54a1ff80372.webp'
  ];

  assert.match(src, /const versionedPiktaliTrafficAssets = files/);
  assert.match(src, /\.\.\.versionedPiktaliTrafficAssets/);
  for (const asset of cardAssets) {
    const pattern = asset.replace('.', '\\.');
    assert.ok(src.includes(pattern), `missing cached pictogram ${asset}`);
  }
});
