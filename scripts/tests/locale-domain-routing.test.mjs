import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLocaleDomainRedirect, requestedLocaleFromParam } from '../../src/lib/i18n/domain-routing.js';

test('choosing Swedish from the English site preserves route, query, and hash on the Swedish domain', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismapps.online/launcher/settings/?category=visual#language'),
		'https://autismappar.se/launcher/settings/?category=visual&locale=sv#language'
	);
});

test('choosing a domain language replaces an older explicit locale override', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismapps.online/launcher/settings/?category=visual&locale=pt-BR#language'),
		'https://autismappar.se/launcher/settings/?category=visual&locale=sv#language'
	);
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismappar.se/launcher/apps/traffic-safety/?locale=pt_BR'),
		'https://autismapps.online/launcher/apps/traffic-safety/?locale=en'
	);
});

test('choosing English from the Swedish site preserves the current app route on the English domain', () => {
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismappar.se/launcher/apps/traffic-safety/'),
		'https://autismapps.online/launcher/apps/traffic-safety/?locale=en'
	);
});

test('redirect carries the chosen domain language over a saved language on the target domain', () => {
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismappar.se/launcher/apps/traffic-safety/?view=quiz#question'),
		'https://autismapps.online/launcher/apps/traffic-safety/?view=quiz&locale=en#question'
	);
	assert.equal(requestedLocaleFromParam('en', 'en'), 'en');
	assert.equal(requestedLocaleFromParam('sv', 'sv'), 'sv');
	assert.equal(requestedLocaleFromParam('pt-BR', 'en'), 'pt_BR');
	assert.equal(requestedLocaleFromParam('pt_BR', 'sv'), 'pt_BR');
	assert.equal(requestedLocaleFromParam('sv', 'en'), null);
	assert.equal(requestedLocaleFromParam('en', 'sv'), null);
	assert.equal(requestedLocaleFromParam('de', 'en'), null);
});

test('Portuguese stays on the selected production domain because it has no separate domain', () => {
	assert.equal(getLocaleDomainRedirect('pt_BR', 'https://autismappar.se/launcher/settings/'), null);
	assert.equal(getLocaleDomainRedirect('pt_BR', 'https://autismapps.online/launcher/settings/'), null);
});

test('same-domain language selections do not navigate', () => {
	assert.equal(getLocaleDomainRedirect('sv', 'https://autismappar.se/launcher/settings/'), null);
	assert.equal(getLocaleDomainRedirect('en', 'https://autismapps.online/launcher/settings/'), null);
});

test('same-domain language selections replace a stale explicit locale override', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismappar.se/launcher/settings/?locale=pt-BR&category=visual'),
		'https://autismappar.se/launcher/settings/?locale=sv&category=visual'
	);
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismapps.online/launcher/?locale=pt_BR'),
		'https://autismapps.online/launcher/?locale=en'
	);
});

test('local development stays on its current origin', () => {
	assert.equal(getLocaleDomainRedirect('sv', 'http://127.0.0.1:8777/launcher/settings/'), null);
	assert.equal(getLocaleDomainRedirect('en', 'http://localhost:5173/launcher/'), null);
});

test('www aliases redirect to the canonical production host', () => {
	assert.equal(
		getLocaleDomainRedirect('en', 'https://www.autismappar.se/launcher/'),
		'https://autismapps.online/launcher/?locale=en'
	);
});
