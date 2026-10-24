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

test('Piktali manifest loader uses the hosted catalog when available', async () => {
	let fallbackCalls = 0;
	const manifest = { pictograms: [{ id: 'dog', symbol: 'dog', labels: { 'sv-SE': 'Hund' }, file: 'assets/dog.webp' }] };
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => new Response(JSON.stringify(manifest)), async () => {
		fallbackCalls += 1;
		return manifest;
	});
	assert.deepEqual(loaded, manifest.pictograms);
	assert.equal(fallbackCalls, 0);
});

test('Piktali manifest loader uses the bundled catalog after a network failure', async () => {
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => { throw new TypeError('Network unavailable'); });
	assert.equal(loaded.length, fallback.pictograms.length);
	assert.ok(loaded.some(({ labels }) => labels['sv-SE'] === 'Hund'));
	assert.ok(loaded.some(({ labels }) => labels['en-US'] === 'Dog'));
});

test('Piktali manifest loader uses the bundled catalog after both hosted paths fail', async () => {
	const requested = [];
	const loaded = await fetchPiktaliManifest('/launcher', false, async (url) => {
		requested.push(url);
		return new Response('Not found', { status: 404 });
	});
	assert.equal(requested.length, 2);
	assert.equal(loaded.length, fallback.pictograms.length);
});

test('Piktali search finds Swedish pictograms after the hosted manifest returns an invalid shape', async () => {
	let fallbackCalls = 0;
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => new Response('{}'), async () => {
		fallbackCalls += 1;
		return fallback;
	});
	const results = matchPiktaliPictograms(loaded, 'Hund', 'sv', '/launcher');
	assert.ok(results.some(({ keyword, url }) => keyword === 'Hund' && url.includes('/piktali-pictograms/assets/dog.')));
	assert.equal(fallbackCalls, 1);
});
