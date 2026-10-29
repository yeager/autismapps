import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLocaleDomainRedirect } from '../../src/lib/i18n/domain-routing.js';

test('choosing Swedish from the English site preserves route, query, and hash on the Swedish domain', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismapps.online/launcher/settings/?category=visual#language'),
		'https://autismappar.se/launcher/settings/?category=visual#language'
	);
});

test('choosing a domain language drops an older explicit locale override', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismapps.online/launcher/settings/?category=visual&locale=pt-BR#language'),
		'https://autismappar.se/launcher/settings/?category=visual#language'
	);
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismappar.se/launcher/apps/traffic-safety/?locale=pt_BR'),
		'https://autismapps.online/launcher/apps/traffic-safety/'
	);
});

test('choosing English from the Swedish site preserves the current app route on the English domain', () => {
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismappar.se/launcher/apps/traffic-safety/'),
		'https://autismapps.online/launcher/apps/traffic-safety/'
	);
});

test('Portuguese stays on the selected production domain because it has no separate domain', () => {
	assert.equal(getLocaleDomainRedirect('pt_BR', 'https://autismappar.se/launcher/settings/'), null);
	assert.equal(getLocaleDomainRedirect('pt_BR', 'https://autismapps.online/launcher/settings/'), null);
});

test('same-domain language selections do not navigate', () => {
	assert.equal(getLocaleDomainRedirect('sv', 'https://autismappar.se/launcher/settings/'), null);
	assert.equal(getLocaleDomainRedirect('en', 'https://autismapps.online/launcher/settings/'), null);
});

test('same-domain language selections clear a stale explicit locale override', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismappar.se/launcher/settings/?locale=pt-BR&category=visual'),
		'https://autismappar.se/launcher/settings/?category=visual'
	);
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismapps.online/launcher/?locale=pt_BR'),
		'https://autismapps.online/launcher/'
	);
});

test('local development stays on its current origin', () => {
	assert.equal(getLocaleDomainRedirect('sv', 'http://127.0.0.1:8777/launcher/settings/'), null);
	assert.equal(getLocaleDomainRedirect('en', 'http://localhost:5173/launcher/'), null);
});

test('www aliases redirect to the canonical production host', () => {
	assert.equal(
		getLocaleDomainRedirect('en', 'https://www.autismappar.se/launcher/'),
		'https://autismapps.online/launcher/'
	);
});
