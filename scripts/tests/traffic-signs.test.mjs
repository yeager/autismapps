import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../../src/lib/components/traffic-safety/RoadSigns.svelte', import.meta.url), 'utf8');
const sv = JSON.parse(await readFile(new URL('../../src/lib/i18n/messages/sv.json', import.meta.url), 'utf8'));
const en = JSON.parse(await readFile(new URL('../../src/lib/i18n/messages/en.json', import.meta.url), 'utf8'));

function sign(id) {
	const start = component.indexOf(`id: '${id}'`);
	assert.notEqual(start, -1, `missing sign ${id}`);
	const end = component.indexOf('\n    },', start);
	assert.notEqual(end, -1, `unterminated sign ${id}`);
	return component.slice(start, end);
}

test('Swedish stop sign displays the official STOP text', () => {
	assert.match(sign('stop'), />STOP<\/text>/);
	assert.doesNotMatch(sign('stop'), />STOPP<\/text>/);
});

test('crosswalk sign contains the blue square, white triangle, pedestrian and crossing stripes', () => {
	const svg = sign('crosswalk');
	assert.match(svg, /fill="#0066A1"/);
	assert.match(svg, /M60 15 L108 99 H12 Z/);
	assert.match(svg, /fill="#111111"/);
	assert.match(svg, /M22 101 L34 82/);
});

test('Swedish warning signs use a red border around a yellow triangle', () => {
	for (const id of ['warning', 'playground']) {
		const svg = sign(id);
		assert.match(svg, /fill="#FFCC00"/);
		assert.match(svg, /(stroke|fill)="#E5323B"/);
	}
	assert.equal(sv['traffic-safety']['road-signs']['children-warning'], 'Varning för barn');
	assert.equal(en['traffic-safety']['road-signs']['children-warning'], 'Warning: children');
});

test('cycle-path sign has the blue D4 circle and a complete bicycle', () => {
	const svg = sign('bicycle-path');
	assert.match(svg, /<circle cx="60" cy="60" r="52" fill="#0066A1"/);
	assert.match(svg, /<circle cx="31" cy="78" r="20"/);
	assert.match(svg, /<circle cx="89" cy="78" r="20"/);
	assert.match(svg, /L31 78 L59 78 L78 48/);
	assert.equal(sv['traffic-safety']['road-signs']['bicycle-path'], 'Påbjuden cykelbana');
});

test('children warning has two black figures inside a yellow red-bordered triangle', () => {
	const svg = sign('playground');
	assert.match(svg, /M60 8 L114 108 H6 Z/);
	assert.match(svg, /<circle cx="47" cy="42"/);
	assert.match(svg, /<circle cx="72" cy="48"/);
	assert.match(svg, /children-warning-description/);
});

test('speed-limit sign retains the 30 km/h restriction graphic', () => {
	const svg = sign('speed-limit');
	assert.match(svg, /stroke="#FF0000"/);
	assert.match(svg, />30<\/text>/);
});
