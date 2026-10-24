import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const messages = (locale) => JSON.parse(readFileSync(new URL(`../../src/lib/i18n/messages/${locale}.json`, import.meta.url), 'utf8'));

test('Swedish uses Autismappar and every other ready locale uses Autismapps', () => {
	assert.equal(messages('sv')['app.title.brand'], 'Autismappar');
	assert.equal(messages('en')['app.title.brand'], 'Autismapps');
	assert.equal(messages('pt_BR')['app.title.brand'], 'Autismapps');
});

test('offline setup links point to the matching language domain', () => {
	for (const key of ['offline.ios_step1', 'offline.android_step1', 'offline.desktop_step1']) {
		assert.match(messages('sv')[key], /autismappar\.se/);
		assert.match(messages('en')[key], /autismapps\.online/);
		assert.match(messages('pt_BR')[key], /autismapps\.online/);
	}
});
