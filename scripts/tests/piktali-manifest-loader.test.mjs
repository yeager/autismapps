import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fetchPiktaliManifest } from '../../src/lib/piktali/manifest-loader.ts';
import { matchPiktaliPictograms } from '../../src/lib/piktali/search-match.ts';
import fallback from '../../src/lib/piktali/search-fallback.json' with { type: 'json' };

const sourceManifest = JSON.parse(await readFile(new URL('../../static/piktali-pictograms/manifest.json', import.meta.url), 'utf8'));

test('bundled Piktali fallback stays aligned with the source manifest', () => {
	assert.deepEqual(fallback.pictograms, sourceManifest.pictograms.map(({ id, symbol, labels, file }) => ({ id, symbol, labels, file })));
});

test('Piktali manifest loader uses the bundled catalog without depending on the host', async () => {
	let fetchCalls = 0;
	const manifest = { pictograms: [{ id: 'dog', symbol: 'dog', labels: { 'sv-SE': 'Hund' }, file: 'assets/dog.webp' }] };
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => {
		fetchCalls += 1;
		return new Response(JSON.stringify(manifest));
	}, async () => {
		return manifest;
	});
	assert.deepEqual(loaded, manifest.pictograms);
	assert.equal(fetchCalls, 0);
});

test('Piktali manifest loader prefers the bundled catalog so search is immediately available', async () => {
	let fetchCalls = 0;
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => {
		fetchCalls += 1;
		throw new TypeError('Network unavailable');
	});
	assert.equal(loaded.length, fallback.pictograms.length);
	assert.ok(loaded.some(({ labels }) => labels['sv-SE'] === 'Hund'));
	assert.ok(loaded.some(({ labels }) => labels['en-US'] === 'Dog'));
	assert.equal(fetchCalls, 0);
});

test('Piktali manifest loader uses hosted paths if the bundled chunk cannot load', async () => {
	const requested = [];
	const loaded = await fetchPiktaliManifest('/launcher', false, async (url) => {
		requested.push(url);
		return new Response(JSON.stringify(fallback));
	}, async () => { throw new Error('Bundled chunk unavailable'); });
	assert.equal(requested.length, 1);
	assert.equal(loaded.length, fallback.pictograms.length);
});

test('Piktali search finds Swedish pictograms from the bundled index', async () => {
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => new Response('{}'));
	const results = matchPiktaliPictograms(loaded, 'Hund', 'sv', '/launcher');
	assert.ok(results.some(({ keyword, url }) => keyword === 'Hund' && url.includes('/piktali-pictograms/assets/dog.')));
});
