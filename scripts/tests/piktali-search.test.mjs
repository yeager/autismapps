import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { boardBuilderSearchResult, matchPiktaliPictograms, piktaliManifestUrl, piktaliManifestUrls } from '../../src/lib/piktali/search-match.ts';

const manifest = JSON.parse(await readFile(new URL('../../static/piktali-pictograms/manifest.json', import.meta.url), 'utf8'));

test('Piktali manifest uses a versioned path in production and the stable file in development', () => {
	assert.equal(piktaliManifestUrl('/launcher'), '/launcher/piktali-pictograms/manifest-2026-10-24-piktali-visual-audit-1.json?v=2026-10-24-piktali-visual-audit-1');
	assert.equal(piktaliManifestUrl(''), '/piktali-pictograms/manifest-2026-10-24-piktali-visual-audit-1.json?v=2026-10-24-piktali-visual-audit-1');
	assert.equal(piktaliManifestUrl('/launcher', true), '/launcher/piktali-pictograms/manifest.json');
	assert.deepEqual(piktaliManifestUrls('/launcher'), [
		'/launcher/piktali-pictograms/manifest-2026-10-24-piktali-visual-audit-1.json?v=2026-10-24-piktali-visual-audit-1',
		'/launcher/piktali-pictograms/manifest.json?v=2026-10-24-piktali-visual-audit-1'
	]);
	assert.deepEqual(piktaliManifestUrls('/launcher', true), ['/launcher/piktali-pictograms/manifest.json']);
});

test('Board Builder name aliases return the local Piktali communication board', () => {
	for (const query of ['Brädbyggaren', 'Brädbyggare', 'Brädbyggarens', 'Tavlbyggare', 'Board Builder']) {
		const [result] = matchPiktaliPictograms(manifest.pictograms, query, 'sv', '/launcher');
		assert.equal(result.keyword, 'Kommunikationskarta');
		assert.equal(result.url, '/launcher/piktali-pictograms/assets/communication-board.svg');
		assert.ok(result.id < 0);
	}
});

test('Board Builder aliases return the bundled pictogram without a manifest', () => {
	for (const query of ['Brädbyggaren', 'Brädbyggarens', 'Tavlbyggare']) {
		const [result] = boardBuilderSearchResult(query, 'sv', '/launcher');
		assert.equal(result.keyword, 'Kommunikationskarta');
		assert.equal(result.url, '/launcher/piktali-pictograms/assets/communication-board.svg');
		assert.ok(result.id < 0);
	}
	assert.deepEqual(boardBuilderSearchResult('unknown', 'sv', '/launcher'), []);
});

test('Piktali search matches Swedish and English catalog labels', () => {
	const [swedish] = matchPiktaliPictograms(manifest.pictograms, 'hund', 'sv', '/launcher');
	const [english] = matchPiktaliPictograms(manifest.pictograms, 'dog', 'en', '/launcher');
	assert.equal(swedish.keyword, 'Hund');
	assert.equal(english.keyword, 'Dog');
	assert.equal(swedish.url, english.url);
});

test('Piktali fuzzy matches use the interface language and omit number symbols', () => {
	const results = matchPiktaliPictograms(manifest.pictograms, 'hund', 'sv', '/launcher');
	const labels = results.map((result) => result.keyword);
	assert.ok(labels.includes('Hund'));
	assert.ok(labels.includes('Gå ut med hunden'));
	assert.ok(!labels.some((label) => ['Hundra', 'Tvåhundra', 'Trehundra', 'Fyrahundra', 'Femhundra', 'Sjunka', 'Åska'].includes(label)));
});

test('Piktali search accepts a Swedish query on the English site and vice versa', () => {
	const englishResults = matchPiktaliPictograms(manifest.pictograms, 'hund', 'en', '/launcher');
	const [englishResult] = englishResults;
	const [swedishResult] = matchPiktaliPictograms(manifest.pictograms, 'dog', 'sv', '/launcher');
	assert.equal(englishResult.keyword, 'Dog');
	assert.equal(swedishResult.keyword, 'Hund');
	assert.equal(englishResult.url, swedishResult.url);
	assert.ok(!englishResults.some((result) => result.keyword === 'Thunder'));
});

test('Piktali search finds Swedish labels when the query is plural or definite', () => {
	for (const [query, label] of [['hundar', 'Hund'], ['katter', 'Katt'], ['hunden', 'Hund']]) {
		const results = matchPiktaliPictograms(manifest.pictograms, query, 'sv', '/launcher');
		assert.ok(results.some((result) => result.keyword === label), `${query} should find ${label}`);
	}
});
