import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const aliases = [
	{ file: 'instruktioner.html', route: '/launcher/instruktioner/', sourceRoute: 'src/routes/instruktioner/+page.svelte' },
	{ file: 'material.html', route: '/launcher/material/', sourceRoute: 'src/routes/material/+page.svelte' }
];

test('legacy root aliases redirect to existing localized launcher routes', () => {
	for (const alias of aliases) {
		const html = readFileSync(new URL(`../../deploy/root-site/${alias.file}`, import.meta.url), 'utf8');
		const route = alias.route.replaceAll('/', '\\/');
		assert.match(html, new RegExp(`const path = '${route}'`), `${alias.file} should point to ${alias.route}`);
		assert.match(html, /window\.location\.search \+ window\.location\.hash/, `${alias.file} should preserve query and fragment`);
		assert.match(html, new RegExp(`href="${alias.route.replaceAll('/', '\\/')}"`), `${alias.file} should provide a working no-script link`);
		assert.ok(readFileSync(new URL(`../../${alias.sourceRoute}`, import.meta.url), 'utf8').length > 0, `${alias.route} should exist in the launcher source`);
	}
});
