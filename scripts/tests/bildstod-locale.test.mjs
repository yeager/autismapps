import test from 'node:test';
import assert from 'node:assert/strict';
import { localizedBildstodKeyword } from '../../src/lib/arasaac/bildstod-keyword.ts';

const hotDog = {
	keywords: {
		sv: ['korv med bröd', 'varmkorv'],
		en: ['hot dog', 'frankfurter']
	}
};

test('Bildstöd labels use the English interface language', () => {
	assert.equal(localizedBildstodKeyword(hotDog, 'en', 'hot dog'), 'hot dog');
	assert.equal(localizedBildstodKeyword(hotDog, 'en', 'korv med bröd'), 'hot dog');
	assert.equal(localizedBildstodKeyword(hotDog, 'en', 'frankfurter'), 'frankfurter');
});

test('Bildstöd labels use the Swedish interface language', () => {
	assert.equal(localizedBildstodKeyword(hotDog, 'sv', 'korv med bröd'), 'korv med bröd');
	assert.equal(localizedBildstodKeyword(hotDog, 'sv', 'hot dog'), 'korv med bröd');
});

test('Bildstöd falls back to the matched keyword when no localized label exists', () => {
	assert.equal(localizedBildstodKeyword({ keywords: { sv: [], en: [] } }, 'en', 'animal'), 'animal');
});
