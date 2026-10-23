import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesPictogramKeyword, normalizePictogramKeyword, resolvePictogramSearchTerm, searchPictogramLookup } from '../../src/lib/arasaac/search-normalize.js';

test('ARASAAC keyword matching ignores Portuguese accents', () => {
	for (const [query, label] of [['cafe', 'café'], ['agua', 'água'], ['onibus', 'ônibus']]) {
		assert.equal(normalizePictogramKeyword(query), normalizePictogramKeyword(label));
	}
});

test('keyword normalization retains case folding and surrounding whitespace behavior', () => {
	assert.equal(normalizePictogramKeyword('  CAFÉ  '), normalizePictogramKeyword('cafe'));
});

test('Swedish pictogram labels and queries match consistently with å, ä and ö', () => {
	for (const [query, label] of [['bla', 'blå'], ['apple', 'äpple'], ['ora', 'öra']]) {
		assert.ok(matchesPictogramKeyword(label, query, true), `${query} should exactly match ${label}`);
	}
	assert.ok(matchesPictogramKeyword('blå bil', 'bla'));
	assert.ok(!matchesPictogramKeyword('blå bil', 'gul', true));
});

test('Board Builder names map to relevant pictogram search terms', () => {
	assert.equal(resolvePictogramSearchTerm('Brädbyggaren', 'sv'), 'kommunikationskarta');
	assert.equal(resolvePictogramSearchTerm('Brädbyggarens', 'sv'), 'kommunikationskarta');
	assert.equal(resolvePictogramSearchTerm('Tavlbyggare', 'sv'), 'kommunikationskarta');
	assert.equal(resolvePictogramSearchTerm('Board Builder', 'en'), 'communication board');
	assert.equal(resolvePictogramSearchTerm('glad', 'sv'), 'glad');
});

test('ARASAAC lookup accepts Swedish queries on the English site and shows English labels', () => {
	const lookup = {
		dog: { sv: 'hund', id: 2517 },
		'dog food': { sv: 'hundmat', id: 7057 },
		cat: { sv: 'katt', id: 2406 }
	};
	const results = searchPictogramLookup(lookup, 'hund', 'en');
	assert.deepEqual(results.slice(0, 2), [
		{ id: 2517, keyword: 'dog', exact: true },
		{ id: 7057, keyword: 'dog food', exact: false }
	]);
});

test('ARASAAC lookup accepts English queries on the Swedish site and shows Swedish labels', () => {
	const lookup = { dog: { sv: 'hund', id: 2517 }, 'dog food': { sv: 'hundmat', id: 7057 } };
	const results = searchPictogramLookup(lookup, 'dog', 'sv');
	assert.deepEqual(results.slice(0, 2), [
		{ id: 2517, keyword: 'hund', exact: true },
		{ id: 7057, keyword: 'hundmat', exact: false }
	]);
});
