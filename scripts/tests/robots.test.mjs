import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const robots = readFileSync(new URL('../../static/robots.txt', import.meta.url), 'utf8');
const rootHtaccess = readFileSync(new URL('../../deploy/root-site/.htaccess', import.meta.url), 'utf8');

test('robots.txt advertises the sitemap on both language domains', () => {
	const sitemapUrls = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gm)].map((match) => match[1]);
	assert.deepEqual(sitemapUrls, [
		'https://autismappar.se/sitemap.xml',
		'https://autismapps.online/sitemap.xml'
	]);
});

test('robots.txt responses bypass host and browser caches', () => {
	assert.match(rootHtaccess, /<FilesMatch "\^\(service-worker\\\.js\|\.\*\\\.html\?\|lang\\\.js\|robots\\\.txt\)\$">/);
	assert.match(rootHtaccess, /Header set Cache-Control "no-cache, no-store, must-revalidate"/);
	assert.match(rootHtaccess, /Header set X-Accel-Expires "0"/);
});
