import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const appCss = readFileSync(new URL('../../src/app.css', import.meta.url), 'utf8');
const appHtml = readFileSync(new URL('../../src/app.html', import.meta.url), 'utf8');

test('the app viewport prevents double-tap zoom while retaining pinch zoom', () => {
	assert.match(appCss, /html\s*\{[^}]*\btouch-action:\s*manipulation\s*;/s);
});

test('the viewport meta tag does not disable user scaling', () => {
	const viewport = appHtml.match(/<meta\s+name="viewport"\s+content="([^"]+)"/i)?.[1] ?? '';
	assert.notEqual(viewport, '', 'viewport meta tag is present');
	assert.doesNotMatch(viewport, /maximum-scale\s*=\s*1(?:\.0+)?|user-scalable\s*=\s*no/i);
});
