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

test('Swedish legacy launcher URLs redirect to the Swedish build base path', () => {
	const rules = readFileSync(new URL('../../deploy/root-site/.htaccess', import.meta.url), 'utf8');
	assert.match(rules, /RewriteCond %\{HTTP_HOST\} \^\(www\\\.\)\?autismappar\\\.se\$ \[NC\]/);
	assert.match(rules, /RewriteRule \^launcher\/\?\(\.\*\)\$ https:\/\/autismappar\.se\/launcher-sv\/\$1 \[R=302,L,NE\]/);
	assert.doesNotMatch(rules, /RewriteRule \^launcher\/\(\.\*\)\$ launcher-sv\/\$1/);
});

test('duplicate launcher prefixes redirect to the matching language launcher', () => {
	const rules = readFileSync(new URL('../../deploy/root-site/.htaccess', import.meta.url), 'utf8');
	assert.match(rules, /RewriteRule \^launcher\/launcher\/\?\(\.\*\)\$ https:\/\/autismappar\.se\/launcher-sv\/\$1 \[R=301,L,NE\]/);
	assert.match(rules, /RewriteRule \^launcher\/launcher\/\?\(\.\*\)\$ https:\/\/autismapps\.online\/launcher\/\$1 \[R=301,L,NE\]/);
});

test('missing assets in the Swedish launcher resolve on the canonical non-Swedish host', () => {
	const build = readFileSync(new URL('../../scripts/build-launcher.mjs', import.meta.url), 'utf8');
	assert.match(build, /RewriteRule \^\(\.\*\)\$ https:\/\/autismapps\.online\/launcher\/\$1 \[R=302,L,NE\]/);
});
