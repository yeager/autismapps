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
