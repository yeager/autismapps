import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getLocaleDomainRedirect, requestedLocaleFromParam, savedLocaleOverride } from '../../src/lib/i18n/domain-routing.js';

test('choosing Swedish from the English site preserves route, query, and hash on the Swedish domain', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismapps.online/launcher/settings/?category=visual#language'),
		'https://autismappar.se/launcher-sv/settings/?category=visual&locale=sv#language'
	);
});

test('choosing a domain language replaces an older explicit locale override', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismapps.online/launcher/settings/?category=visual&locale=pt-BR#language'),
		'https://autismappar.se/launcher-sv/settings/?category=visual&locale=sv#language'
	);
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismappar.se/launcher-sv/apps/traffic-safety/?locale=pt_BR'),
		'https://autismapps.online/launcher/apps/traffic-safety/?locale=en'
	);
});

test('choosing English from the Swedish site preserves the current app route on the English domain', () => {
	assert.equal(
		getLocaleDomainRedirect('en', 'https://autismappar.se/launcher-sv/apps/traffic-safety/'),
		'https://autismapps.online/launcher/apps/traffic-safety/?locale=en'
	);
});

test('choosing Portuguese from the Swedish launcher switches to the English launcher base', () => {
	assert.equal(
		getLocaleDomainRedirect('pt_BR', 'https://autismappar.se/launcher-sv/?category=visual#language'),
		'https://autismapps.online/launcher/?category=visual&locale=pt_BR#language'
	);
	assert.equal(
		getLocaleDomainRedirect('pt_BR', 'https://autismappar.se/launcher-sv/apps/traffic-safety/?view=quiz'),
		'https://autismapps.online/launcher/apps/traffic-safety/?view=quiz&locale=pt_BR'
	);
});

test('choosing Swedish from the English launcher switches to the Swedish launcher base', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismapps.online/launcher/apps/traffic-safety/?view=quiz'),
		'https://autismappar.se/launcher-sv/apps/traffic-safety/?view=quiz&locale=sv'
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
		getLocaleDomainRedirect('pt_BR', 'https://autismappar.se/launcher-sv/settings/?category=visual#language'),
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

test('English homepage launcher links keep English selected from a saved Portuguese session', () => {
	const html = readFileSync(new URL('../../deploy/root-site/index-en.html', import.meta.url), 'utf8');
	const links = [...html.matchAll(/<a href="([^"]+)" class="app-card"/g)].map((match) => match[1]);
	assert.equal(links.length, 72);
	assert.ok(links.every((href) => /^\/launcher\/apps\/[a-z0-9-]+\?locale=en$/.test(href)));
	const launcherLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
		.map((match) => match[1])
		.filter((href) => href.startsWith('/launcher/'));
	assert.ok(launcherLinks.length > links.length);
	assert.ok(launcherLinks.every((href) => new URL(href, 'https://autismapps.online').searchParams.get('locale') === 'en'));
});

test('same-domain language selections do not navigate', () => {
	assert.equal(getLocaleDomainRedirect('sv', 'https://autismappar.se/launcher-sv/settings/'), null);
	assert.equal(getLocaleDomainRedirect('en', 'https://autismapps.online/launcher/settings/'), null);
});

test('a launcher path is corrected when the host and launcher base do not match', () => {
	assert.equal(
		getLocaleDomainRedirect('pt_BR', 'https://autismapps.online/launcher-sv/?locale=sv'),
		'https://autismapps.online/launcher/?locale=pt_BR'
	);
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismappar.se/launcher/apps/board-builder/'),
		'https://autismappar.se/launcher-sv/apps/board-builder/?locale=sv'
	);
});

test('same-domain language selections replace a stale explicit locale override', () => {
	assert.equal(
		getLocaleDomainRedirect('sv', 'https://autismappar.se/launcher/settings/?locale=pt-BR&category=visual'),
		'https://autismappar.se/launcher-sv/settings/?locale=sv&category=visual'
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

test('Swedish app cards use the Swedish build and old generic launcher URLs redirect to its base path', () => {
	const rootHtaccess = readFileSync(new URL('../../deploy/root-site/.htaccess', import.meta.url), 'utf8');
	const launcherHtaccess = readFileSync(new URL('../../deploy/launcher.htaccess', import.meta.url), 'utf8');
	const swedishHomepage = readFileSync(new URL('../../deploy/root-site/index.html', import.meta.url), 'utf8');
	const appDetailGenerator = readFileSync(new URL('../../scripts/generate-app-detail-pages.mjs', import.meta.url), 'utf8');
	assert.ok(rootHtaccess.includes('RewriteRule ^launcher/?(.*)$ https://autismappar.se/launcher-sv/$1 [R=302,L,NE]'));
	assert.ok(launcherHtaccess.includes('RewriteCond %{REQUEST_URI} ^/launcher(?:/|$) [NC]'));
	assert.ok(launcherHtaccess.includes('RewriteRule ^(.*)$ https://autismappar.se/launcher-sv/$1 [R=302,L,NE]'));
	assert.equal((swedishHomepage.match(/href="\/launcher-sv\/apps\/[a-z0-9-]+"/g) || []).length, 72);
	assert.doesNotMatch(swedishHomepage, /href="\/launcher\/apps\//);
	assert.match(swedishHomepage, /href="\/launcher-sv\/"/);
	assert.match(appDetailGenerator, /locale === 'sv' \? 'https:\/\/autismappar\.se\/launcher-sv' : 'https:\/\/autismapps\.online\/launcher'/);
});

test('Swedish launcher is built under its own base path', () => {
	const buildScript = readFileSync(new URL('../../scripts/build-launcher-domains.mjs', import.meta.url), 'utf8');
	const launcherBuildScript = readFileSync(new URL('../../scripts/build-launcher.mjs', import.meta.url), 'utf8');
	assert.match(buildScript, /locale === 'sv' \? '\/launcher-sv' : '\/launcher'/);
	assert.match(launcherBuildScript, /process\.env\.BASE_PATH = process\.env\.BASE_PATH \|\|/);
	assert.match(launcherBuildScript, /RewriteCond %\{REQUEST_FILENAME\} !-f/);
	assert.match(launcherBuildScript, /RewriteRule \^\(\.\*\)\$ https:\/\/autismapps\.online\/launcher\/\$1 \[R=302,L,NE\]/);
});
