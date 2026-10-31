import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../../src/lib/components/traffic-safety/RoadSigns.svelte', import.meta.url), 'utf8');
const cacheModule = await readFile(new URL('../../src/lib/data/pictogram-cache.js', import.meta.url), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../../static/pictograms/traffic-safety/signs/manifest.json', import.meta.url), 'utf8'));
const sv = JSON.parse(await readFile(new URL('../../src/lib/i18n/messages/sv.json', import.meta.url), 'utf8'));
const en = JSON.parse(await readFile(new URL('../../src/lib/i18n/messages/en.json', import.meta.url), 'utf8'));
const appLocales = Object.fromEntries(await Promise.all(['sv', 'en', 'pt_BR'].map(async (locale) => [
	locale,
	JSON.parse(await readFile(new URL(`../../src/lib/i18n/messages/${locale}.json`, import.meta.url), 'utf8'))['traffic-safety']['road-signs']
])));
const launcherHtaccess = await readFile(new URL('../../deploy/launcher.htaccess', import.meta.url), 'utf8');
const serviceWorker = await readFile(new URL('../../src/service-worker.ts', import.meta.url), 'utf8');

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

test('every road-sign label and spoken explanation exists in the app runtime locales', () => {
	const swedishSet = component.split('const SIGNS_SE = [')[1]?.split('// Brazilian signs')[0] ?? '';
	const keys = [
		...[...swedishSet.matchAll(/nameKey:\s*'road-signs\.([^']+)'/g)].map((match) => match[1]),
		...[...swedishSet.matchAll(/descriptionKey:\s*'road-signs\.([^']+)'/g)].map((match) => match[1])
	];
	assert.equal(keys.length, 12, 'the six Swedish signs should each have a label and spoken explanation');
	for (const [locale, translations] of Object.entries(appLocales)) {
		for (const key of keys) {
			assert.equal(typeof translations[key], 'string', `${locale} is missing road-signs.${key}`);
			assert.ok(translations[key].trim(), `${locale} has an empty road-signs.${key}`);
		}
	}
});

test('official sign images are used consistently in overview, flashcard and quiz', () => {
	assert.equal((component.match(/src=\{signImage\((?:sign|signs\[currentSignIndex\])\)\}/g) ?? []).length, 3);
	assert.match(component, /import \{ base \} from '\$app\/paths'/);
	assert.match(component, /function signImage\(sign\)[\s\S]*?trafficSafetySignUrl\(base, sign\.image/);
	assert.match(component, /alt="" aria-hidden="true"/);
});

test('traffic sign images have Loopia path versioning and server-side aliases', async () => {
	const { trafficSafetySignUrl } = await import('../../src/lib/data/pictogram-cache.js');
	assert.equal(
		trafficSafetySignUrl('/launcher/', '/pictograms/traffic-safety/signs/stop-7169a31e6a62.png', true),
		'/launcher/pictograms/traffic-safety/v2026-10-28-reflective-accessories-6/signs/stop-7169a31e6a62.png'
	);
	assert.equal(
		trafficSafetySignUrl('/launcher/', '/pictograms/traffic-safety/signs/stop-7169a31e6a62.png'),
		'/launcher/pictograms/traffic-safety/signs/stop-7169a31e6a62.png?v=2026-10-28-reflective-accessories-6'
	);
	assert.match(cacheModule, /export function trafficSafetySignUrl/);
	assert.match(launcherHtaccess, /RewriteRule \^pictograms\/traffic-safety\/v\[A-Za-z0-9\._-\]\+\/signs/);
	assert.match(serviceWorker, /file\.replace\('\/pictograms\/traffic-safety\/signs\//);
});
