import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../../src/lib/components/traffic-safety/RoadSigns.svelte', import.meta.url), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../../static/pictograms/traffic-safety/signs/manifest.json', import.meta.url), 'utf8'));
const sv = JSON.parse(await readFile(new URL('../../src/lib/i18n/messages/sv.json', import.meta.url), 'utf8'));
const en = JSON.parse(await readFile(new URL('../../src/lib/i18n/messages/en.json', import.meta.url), 'utf8'));

function sign(id) {
	const start = component.indexOf(`id: '${id}'`);
	assert.notEqual(start, -1, `missing sign ${id}`);
	const ends = ['\n    },', '\n  ];']
		.map((marker) => component.indexOf(marker, start))
		.filter((index) => index >= 0);
	const end = Math.min(...ends);
	assert.notEqual(end, -1, `unterminated sign ${id}`);
	return component.slice(start, end);
}

const reviewedSwedishSigns = [
	{ componentId: 'stop', manifestId: 'stop', nameKey: 'stop', meaning: 'B2 stopplikt', sv: 'Stopp', en: 'Stop' },
	{ componentId: 'crosswalk', manifestId: 'crosswalk', nameKey: 'crosswalk', meaning: 'B3 övergångsställe', sv: 'Övergångsställe', en: 'Crosswalk' },
	{ componentId: 'warning', manifestId: 'warning', nameKey: 'warning', meaning: 'A40 varning för annan fara', sv: 'Varning', en: 'Warning' },
	{ componentId: 'bicycle-path', manifestId: 'bicycle-path', nameKey: 'bicycle-path', meaning: 'D4 påbjuden cykelbana', sv: 'Påbjuden cykelbana', en: 'Mandatory cycle path' },
	{ componentId: 'children-warning', manifestId: 'children-warning', nameKey: 'children-warning', meaning: 'A15 varning för barn', sv: 'Varning för barn', en: 'Warning: children' },
	{ componentId: 'speed-limit', manifestId: 'speed-limit-30', nameKey: 'speed-limit', meaning: 'C31 hastighetsbegränsning 30 km/h', sv: 'Hastighetsbegränsning 30', en: 'Speed Limit 30' }
];

test('all Swedish traffic sign cards map to the matching official sign image', async () => {
	assert.equal(manifest.source, 'Transportstyrelsen');
	assert.match(manifest.reuse, /used freely/i);
	assert.equal(reviewedSwedishSigns.length, 6);

	for (const expected of reviewedSwedishSigns) {
		const record = manifest.signs[expected.manifestId];
		assert.ok(record, `missing manifest entry ${expected.manifestId}`);
		assert.equal(record.meaning, expected.meaning);
		assert.match(record.image_url, /^https:\/\/www\.transportstyrelsen\.se\/globalassets\//);

		const block = sign(expected.componentId);
		assert.match(block, new RegExp(`image: '/pictograms/traffic-safety/signs/${record.file}'`));
		assert.doesNotMatch(block, /svg:/, `${expected.componentId} must use its reviewed official artwork`);

		const bytes = await readFile(new URL(`../../static/pictograms/traffic-safety/signs/${record.file}`, import.meta.url));
		assert.deepEqual(bytes.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
		assert.equal(bytes.length, record.bytes);
		assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);

		assert.equal(sv['traffic-safety']['road-signs'][expected.nameKey], expected.sv);
		assert.equal(en['traffic-safety']['road-signs'][expected.nameKey], expected.en);
	}
});

test('children warning and speed-limit cards cannot drift to misleading labels', () => {
	const children = sign('children-warning');
	assert.match(children, /nameKey: 'road-signs\.children-warning'/);
	assert.match(children, /descriptionKey: 'road-signs\.children-warning-description'/);
	assert.equal(sv['traffic-safety']['road-signs']['children-warning'], 'Varning för barn');
	assert.equal(en['traffic-safety']['road-signs']['children-warning'], 'Warning: children');
	assert.equal(sv['traffic-safety']['road-signs']['speed-limit'], 'Hastighetsbegränsning 30');
});

test('official sign images are used consistently in overview, flashcard and quiz', () => {
	assert.equal((component.match(/src={`\$\{base\}\$\{(?:sign|signs\[currentSignIndex\])\.image\}`}/g) ?? []).length, 3);
	assert.match(component, /import \{ base \} from '\$app\/paths'/);
	assert.match(component, /alt="" aria-hidden="true"/);
});
