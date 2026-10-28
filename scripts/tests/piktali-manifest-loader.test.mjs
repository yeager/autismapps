import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fetchPiktaliManifest } from '../../src/lib/piktali/manifest-loader.ts';
import { isApprovedPiktaliPictogram, matchPiktaliPictograms } from '../../src/lib/piktali/search-match.ts';
import fallback from '../../src/lib/piktali/search-fallback.json' with { type: 'json' };

const sourceManifest = JSON.parse(await readFile(new URL('../../static/piktali-pictograms/manifest.json', import.meta.url), 'utf8'));

test('bundled Piktali fallback stays aligned with the source manifest', () => {
	const approved = sourceManifest.pictograms.filter(isApprovedPiktaliPictogram);
	assert.deepEqual(fallback.pictograms, approved.map(({ id, symbol, labels, file, pictogramStatus, review }) => ({
		id,
		symbol,
		labels,
		file,
		pictogramStatus,
		review: {
			translation: review.translation,
			aacUsability: review.aacUsability,
			pictogram: review.pictogram,
			commercialRights: review.commercialRights
		}
	})));
	assert.equal(sourceManifest.productionReadyCount, approved.length);
	assert.equal(sourceManifest.includePending, false);
	assert.equal(approved.length, 5003);
	assert.ok(fallback.pictograms.every(isApprovedPiktaliPictogram));
	assert.ok(fallback.pictograms.length > 0);
	assert.equal(sourceManifest.ownerReviewConfirmation?.source, 'user confirmation in the Autismappar project conversation');
	assert.ok(sourceManifest.pictograms.every(({ review }) => review?.commercialRights === 'approved'));
});

test('Piktali manifest loader uses the bundled catalog without depending on the host', async () => {
	let fetchCalls = 0;
	const manifest = { pictograms: [{ id: 'dog', symbol: 'dog', labels: { 'sv-SE': 'Hund' }, file: 'assets/dog.webp', pictogramStatus: 'approved', review: { translation: 'approved', aacUsability: 'approved', pictogram: 'approved', commercialRights: 'approved' } }] };
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => {
		fetchCalls += 1;
		return new Response(JSON.stringify(manifest));
	}, async () => {
		return manifest;
	});
	assert.deepEqual(loaded, manifest.pictograms);
	assert.equal(fetchCalls, 0);
});

test('Piktali loader excludes entries still awaiting review', async () => {
	const approved = { id: 'dog', symbol: 'dog', labels: { 'sv-SE': 'Hund' }, file: 'assets/dog.webp', pictogramStatus: 'approved', review: { translation: 'approved', aacUsability: 'approved', pictogram: 'approved', commercialRights: 'approved' } };
	const pending = { id: 'wolf', symbol: 'wolf', labels: { 'sv-SE': 'Varg' }, file: 'assets/wolf.svg', pictogramStatus: 'original-draft', review: { translation: 'draft', aacUsability: 'pending', pictogram: 'pending', commercialRights: 'pending' } };
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => new Response('{}'), async () => ({ pictograms: [approved, pending] }));
	assert.deepEqual(loaded, [approved]);
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
	const approved = fallback.pictograms[0];
	const pending = { ...approved, id: 'unreviewed', pictogramStatus: 'original-draft', review: { translation: 'draft', aacUsability: 'pending', pictogram: 'pending', commercialRights: 'pending' } };
	const loaded = await fetchPiktaliManifest('/launcher', false, async (url) => {
		requested.push(url);
		return new Response(JSON.stringify({ pictograms: [approved, pending] }));
	}, async () => { throw new Error('Bundled chunk unavailable'); });
	assert.equal(requested.length, 1);
	assert.deepEqual(loaded, [approved]);
});

test('Piktali search finds Swedish pictograms from the bundled index', async () => {
	const loaded = await fetchPiktaliManifest('/launcher', false, async () => new Response('{}'));
	const results = matchPiktaliPictograms(loaded, 'Hund', 'sv', '/launcher');
	assert.ok(results.some(({ keyword, url }) => keyword === 'Hund' && url.includes('/piktali-pictograms/assets/dog.')));
});
