import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesPictogramKeyword, normalizePictogramKeyword, resolvePictogramSearchTerm } from '../../src/lib/arasaac/search-normalize.js';

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
	assert.equal(resolvePictogramSearchTerm('Brädbyggaren', 'sv'), 'tavla');
	assert.equal(resolvePictogramSearchTerm('Tavlbyggare', 'sv'), 'tavla');
	assert.equal(resolvePictogramSearchTerm('Board Builder', 'en'), 'board');
	assert.equal(resolvePictogramSearchTerm('glad', 'sv'), 'glad');
});
