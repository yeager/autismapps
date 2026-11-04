import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sitemap = readFileSync(new URL('../../static/sitemap.xml', import.meta.url), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]));

test('the sitemap lists canonical launcher URLs for each language domain', () => {
	const swedish = urls.filter((url) => url.hostname === 'autismappar.se');
	const english = urls.filter((url) => url.hostname === 'autismapps.online');
	assert.equal(swedish.length, 78);
	assert.equal(english.length, 78);
	assert.ok(swedish.some((url) => url.pathname === '/launcher-sv/'));
	assert.ok(swedish.some((url) => url.pathname === '/launcher-sv/about/'));
	assert.ok(swedish.some((url) => url.pathname === '/launcher-sv/settings/'));
	assert.equal(swedish.filter((url) => url.pathname.startsWith('/launcher/')).length, 0);
	assert.equal(swedish.filter((url) => url.pathname.startsWith('/launcher-sv/apps/')).length, 72);
	assert.ok(english.some((url) => url.pathname === '/launcher/'));
	assert.ok(english.some((url) => url.pathname === '/launcher/about/'));
	assert.ok(english.some((url) => url.pathname === '/launcher/settings/'));
	assert.equal(english.filter((url) => url.pathname.startsWith('/launcher/apps/')).length, 72);
});
