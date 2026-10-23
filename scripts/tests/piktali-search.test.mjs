import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { matchPiktaliPictograms } from '../../src/lib/piktali/search-match.ts';

const manifest = JSON.parse(await readFile(new URL('../../static/piktali-pictograms/manifest.json', import.meta.url), 'utf8'));

test('Board Builder name aliases return the local Piktali communication board', () => {
	for (const query of ['Brädbyggaren', 'Brädbyggare', 'Tavlbyggare', 'Board Builder']) {
		const [result] = matchPiktaliPictograms(manifest.pictograms, query, 'sv', '/launcher');
		assert.equal(result.keyword, 'Kommunikationskarta');
		assert.equal(result.url, '/launcher/piktali-pictograms/assets/communication-board.svg');
		assert.ok(result.id < 0);
	}
});

test('Piktali search matches Swedish and English catalog labels', () => {
	const [swedish] = matchPiktaliPictograms(manifest.pictograms, 'hund', 'sv', '/launcher');
	const [english] = matchPiktaliPictograms(manifest.pictograms, 'dog', 'en', '/launcher');
	assert.equal(swedish.keyword, 'Hund');
	assert.equal(english.keyword, 'Dog');
	assert.equal(swedish.url, english.url);
});

test('Piktali search finds Swedish labels when the query is plural or definite', () => {
	for (const [query, label] of [['hundar', 'Hund'], ['katter', 'Katt'], ['hunden', 'Hund']]) {
		const results = matchPiktaliPictograms(manifest.pictograms, query, 'sv', '/launcher');
		assert.ok(results.some((result) => result.keyword === label), `${query} should find ${label}`);
	}
});
