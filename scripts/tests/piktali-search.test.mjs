import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { boardBuilderSearchResult, matchPiktaliPictograms, piktaliManifestUrl } from '../../src/lib/piktali/search-match.ts';

const manifest = JSON.parse(await readFile(new URL('../../static/piktali-pictograms/manifest.json', import.meta.url), 'utf8'));

test('Piktali manifest URL changes between deployments and keeps the launcher base path', () => {
	assert.equal(piktaliManifestUrl('/launcher'), '/launcher/piktali-pictograms/manifest.json?v=2026-10-23-board-builder-search-1');
	assert.equal(piktaliManifestUrl(''), '/piktali-pictograms/manifest.json?v=2026-10-23-board-builder-search-1');
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

test('Piktali search accepts a Swedish query on the English site and vice versa', () => {
	const [englishResult] = matchPiktaliPictograms(manifest.pictograms, 'hund', 'en', '/launcher');
	const [swedishResult] = matchPiktaliPictograms(manifest.pictograms, 'dog', 'sv', '/launcher');
	assert.equal(englishResult.keyword, 'Dog');
	assert.equal(swedishResult.keyword, 'Hund');
	assert.equal(englishResult.url, swedishResult.url);
});

test('Piktali search finds Swedish labels when the query is plural or definite', () => {
	for (const [query, label] of [['hundar', 'Hund'], ['katter', 'Katt'], ['hunden', 'Hund']]) {
		const results = matchPiktaliPictograms(manifest.pictograms, query, 'sv', '/launcher');
		assert.ok(results.some((result) => result.keyword === label), `${query} should find ${label}`);
	}
});
