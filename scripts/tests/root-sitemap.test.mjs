import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ALL_APPS } from '../../src/lib/apps.ts';

const sitemap = readFileSync(new URL('../../static/sitemap.xml', import.meta.url), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]));

test('the sitemap lists canonical launcher URLs for each language domain', () => {
	const swedish = urls.filter((url) => url.hostname === 'autismappar.se');
	const english = urls.filter((url) => url.hostname === 'autismapps.online');
	assert.equal(swedish.length, 150);
	assert.equal(english.length, 150);
	assert.ok(swedish.some((url) => url.pathname === '/launcher-sv/'));
	assert.ok(swedish.some((url) => url.pathname === '/launcher-sv/about/'));
	assert.ok(swedish.some((url) => url.pathname === '/launcher-sv/settings/'));
	assert.equal(swedish.filter((url) => url.pathname.startsWith('/launcher/')).length, 0);
	assert.equal(swedish.filter((url) => url.pathname.startsWith('/launcher-sv/apps/')).length, 72);
	assert.ok(english.some((url) => url.pathname === '/launcher/'));
	assert.ok(english.some((url) => url.pathname === '/launcher/about/'));
	assert.ok(english.some((url) => url.pathname === '/launcher/settings/'));
	assert.equal(english.filter((url) => url.pathname.startsWith('/launcher/apps/')).length, 72);
	assert.equal(swedish.filter((url) => /^\/apps\/[a-z0-9-]+\.html$/.test(url.pathname)).length, 72);
	assert.equal(english.filter((url) => /^\/apps\/[a-z0-9-]+\.html$/.test(url.pathname)).length, 72);
	for (const app of ALL_APPS) {
		assert.ok(swedish.some((url) => url.pathname === `/apps/${app.id}.html`), `Swedish sitemap is missing ${app.id}`);
		assert.ok(english.some((url) => url.pathname === `/apps/${app.id}.html`), `English sitemap is missing ${app.id}`);
	}
});
