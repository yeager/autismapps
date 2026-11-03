import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getLocaleDomainRedirect, requestedLocaleFromParam, savedLocaleOverride } from '../../src/lib/i18n/domain-routing.js';

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
	assert.equal(requestedLocaleFromParam('pt_BR', 'sv'), null);
	assert.equal(requestedLocaleFromParam('pt-BR', null), 'pt_BR');
	assert.equal(requestedLocaleFromParam('sv', 'en'), null);
	assert.equal(requestedLocaleFromParam('en', 'sv'), null);
	assert.equal(requestedLocaleFromParam('de', 'en'), null);
});

test('Portuguese always uses the non-Swedish domain and preserves the selected route', () => {
	assert.equal(
		getLocaleDomainRedirect('pt_BR', 'https://autismappar.se/launcher/settings/?category=visual#language'),
		'https://autismapps.online/launcher/settings/?category=visual&locale=pt_BR#language'
	);
	assert.equal(getLocaleDomainRedirect('pt_BR', 'https://autismapps.online/launcher/settings/'), null);
});

test('a saved Portuguese locale is restored on autismapps.online but not autismappar.se', () => {
	assert.equal(savedLocaleOverride('pt_BR', 'en'), 'pt_BR');
	assert.equal(savedLocaleOverride('pt_BR', 'sv'), null);
	assert.equal(savedLocaleOverride('pt_BR', null), 'pt_BR');
	assert.equal(savedLocaleOverride('sv', 'en'), null);
});

test('the public homepage Portuguese links point directly to autismapps.online', () => {
	for (const path of ['../../deploy/root-site/index.html', '../../deploy/root-site/index-en.html']) {
		const html = readFileSync(new URL(path, import.meta.url), 'utf8');
		assert.match(html, /href="https:\/\/autismapps\.online\/launcher\/\?locale=pt-BR"/);
	}
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

test('Swedish app cards resolve to Swedish prerendered pages on the shared Loopia root', () => {
	const rootHtaccess = readFileSync(new URL('../../deploy/root-site/.htaccess', import.meta.url), 'utf8');
	const swedishHomepage = readFileSync(new URL('../../deploy/root-site/index.html', import.meta.url), 'utf8');
	assert.ok(rootHtaccess.includes('RewriteCond %{REQUEST_URI} ^/launcher/apps/([A-Za-z0-9-]+)/?$'));
	assert.ok(rootHtaccess.includes('RewriteCond %{DOCUMENT_ROOT}/launcher-sv/apps/%1/index.html -f'));
	assert.ok(rootHtaccess.includes('RewriteRule ^launcher/apps/[A-Za-z0-9-]+/?$ launcher-sv/apps/%1/index.html [END]'));
	assert.equal((swedishHomepage.match(/href="\/launcher-sv\/apps\/[a-z0-9-]+"/g) || []).length, 72);
	assert.doesNotMatch(swedishHomepage, /href="\/launcher\/apps\//);
});
