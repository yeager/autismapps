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

test('visual review corrections for contact sheets 017 and 018 use the pictured meanings', () => {
	const expected = {
		'swedish bench': ['bänk', 4919],
		'psychomotricity blocks': ['motorikklossar', 4921],
		punch: ['hålslag', 4949],
		'fall tree': ['höstträd', 5063],
		gogles: ['dykarglasögon', 5074],
		'ice ring': ['skridskobana', 5088],
		'ice rink': ['isrink', 5088],
		'nativity scene': ['julkrubba', 5089],
		crib: ['julkrubba', 5089],
		creche: ['julkrubba', 5089],
		'beach pads': ['strandpaddlar', 5100],
		'button up': ['knäppa', 5357],
		sweeten: ['sockra', 5392],
		wineskin: ['vinsäck', 5401]
	};
	for (const [alias, [label, id]] of Object.entries(expected)) {
		assert.deepEqual(corrected[alias], { sv: label, id }, `${alias} should match pictogram ${id}`);
	}
});

test('visual review corrections for contact sheets 019 and 020 use the pictured meanings', () => {
	const expected = {
		string: ['tråd', 5454],
		plastered: ['gipsad', 5457],
		'ice cream maker': ['glassförsäljare', 5483],
		'ice-cream seller': ['glassförsäljare', 5483],
		'ice-cream vendor': ['glassförsäljare', 5483],
		'ice-cream man': ['glassförsäljare', 5483],
		baste: ['tråckla', 5486],
		tack: ['fästa', 5486],
		measure: ['mäta', 5510],
		operate: ['sköta', 5530],
		'clean the table': ['torka av bordet', 5558],
		'bring out': ['ta fram', 5568],
		'paper bank': ['pappersinsamling', 5575],
		'power saw': ['elektrisk såg', 5587],
		'coping saw': ['figursåg', 5588],
		plane: ['hyvel', 5609],
		'woodworking plane': ['hyvel', 5609]
	};
	for (const [alias, [label, id]] of Object.entries(expected)) {
		assert.deepEqual(corrected[alias], { sv: label, id }, `${alias} should match pictogram ${id}`);
	}
});

test('visual review corrections for contact sheets 021 and 022 use the pictured meanings', () => {
	const expected = {
		'sum up': ['summera', 5868],
		crook: ['herdestav', 5922],
		hush: ['tyst', 5936],
		'shut up': ['tyst', 5936],
		'skewered fruit': ['fruktspett', 5931],
		skewer: ['grillspett', 5931],
		whip: ['vispa', 5924],
		beat: ['vispa', 5924],
		'mixed skewer': ['blandat grillspett', 5932],
		'medium pig': ['medelstor gris', 5955],
		takeoff: ['lyfta', 5984],
		'pupìl': ['elev', 6041],
		board: ['planka', 6143],
		humpback: ['puckelrygg', 6020]
	};
	for (const [alias, [label, id]] of Object.entries(expected)) {
		assert.deepEqual(corrected[alias], { sv: label, id }, `${alias} should match pictogram ${id}`);
	}
});
