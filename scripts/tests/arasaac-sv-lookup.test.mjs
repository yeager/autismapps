import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applySwedishLookupOverrides, SWEDISH_LOOKUP_OVERRIDES } from '../../src/lib/arasaac/sv-lookup-overrides.js';

const catalog = JSON.parse(await readFile(new URL('../../static/arasaac-sv.json', import.meta.url), 'utf8'));
const corrected = applySwedishLookupOverrides(catalog);

test('reviewed Swedish labels match the pictograms and intended meanings', () => {
	for (const [alias, correction] of Object.entries(SWEDISH_LOOKUP_OVERRIDES)) {
		if (correction === null) {
			assert.equal(corrected[alias], undefined, `${alias} should not select an unrelated pictogram`);
			continue;
		}
		assert.ok(Object.values(catalog).some((entry) => entry.id === correction.id), `${alias} should point to a known ARASAAC ID`);
		if (catalog[alias]) assert.equal(catalog[alias].id, correction.id, `${alias} should keep its reviewed ARASAAC ID`);
		assert.equal(corrected[alias]?.sv, correction.sv, `${alias} should use its reviewed Swedish label`);
	}
});

test('applying Swedish label corrections does not mutate the catalog snapshot', () => {
	assert.equal(catalog.tambourine.sv, 'panna');
	assert.equal(corrected.tambourine.sv, 'tamburin');
	assert.notEqual(corrected, catalog);
});
