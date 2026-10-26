import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { ALL_APPS } from '../../src/lib/apps.ts';
import { renderLegacyCategoryAlias, renderPage } from '../generate-app-detail-pages.mjs';

test('all registered apps have matching localized detail pages and same-host launch routes', () => {
	const ids = new Set();
	for (const app of ALL_APPS) {
		assert.equal(ids.has(app.id), false, `duplicate id ${app.id}`);
		ids.add(app.id);
		const html = renderPage(app);
		assert.match(html, new RegExp(`href="\\.\\./launcher/apps/${app.id}/"`));
		assert.match(html, new RegExp(`href="https://autismappar\\.se/apps/${app.id}\\.html"`));
		assert.match(html, new RegExp(`href="https://autismapps\\.online/apps/${app.id}\\.html"`));
		assert.match(html, /href="\.\.\/dataskydd\.html"/);
		assert.doesNotMatch(html, /href="\.\.\/privacy\/"/);
		assert.match(html, /data-sv="[^"]+" data-en="[^"]+"/);
		assert.match(html, /location\.hostname/);
		const [, inlineScript] = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/) ?? [];
		assert.ok(inlineScript, `${app.id} has a locale script`);
		assert.doesNotThrow(() => new Function(inlineScript), `${app.id} locale script parses`);
		assert.ok(fs.existsSync(new URL(`../../static/${app.icon.slice(1)}`, import.meta.url)), `${app.id} icon exists`);
	}
	assert.equal(ids.size, 72);
});

test('generated detail pages use relative launcher and icon URLs that preserve deployment base paths', () => {
	const app = ALL_APPS.find(({ id }) => id === 'board-builder');
	const html = renderPage(app);
	assert.match(html, /href="\.\.\/launcher\/apps\/board-builder\/"/);
	assert.match(html, /src="\.\.\/icons\/board-builder\.svg"/);
	assert.match(html, /href="\.\.\/"/);
});

test('legacy speech and language aliases open the existing speech category in either locale', () => {
	for (const alias of ['verbal-dyspraxi', 'sprakstorning']) {
		const html = renderLegacyCategoryAlias(alias);
		assert.match(html, /http-equiv="refresh" content="0;url=\/launcher\/\?category=speech"/);
		assert.match(html, /href="\/launcher\/\?category=speech"/);
		assert.doesNotMatch(html, new RegExp(`/launcher/apps/${alias}`));
		assert.match(html, /data-sv="Tal- och språkstöd — Autismappar" data-en="Speech and language support — Autismapps"/);
		const [, inlineScript] = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/) ?? [];
		assert.ok(inlineScript);
		assert.doesNotThrow(() => new Function(inlineScript));
	}
	assert.throws(() => renderLegacyCategoryAlias('unknown'), /Unsupported legacy app alias/);
});

test('detail pages choose Autismappar only on the Swedish host and preserve the GitHub Pages base path', () => {
	const app = ALL_APPS.find(({ id }) => id === 'board-builder');
	const html = renderPage(app);
	const [, script] = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/) ?? [];
	assert.ok(script);

	class MockMeta {}
	const name = { dataset: { sv: 'Brädbyggaren', en: 'Board Builder' }, textContent: 'Brädbyggaren' };
	const title = { dataset: { sv: 'Brädbyggaren — Autismappar', en: 'Board Builder — Autismapps' }, textContent: 'Brädbyggaren — Autismappar' };
	const description = new MockMeta();
	description.dataset = { sv: 'Svensk text', en: 'English text' };
	description.content = 'Svensk text';
	const links = [
		{ dataset: { switch: 'sv' }, href: '', setAttribute(name, value) { this[name] = value; }, removeAttribute(name) { delete this[name]; } },
		{ dataset: { switch: 'en' }, href: '', setAttribute(name, value) { this[name] = value; }, removeAttribute(name) { delete this[name]; } }
	];
	const canonical = { href: '' };
	function renderAt(hostname, pathname) {
		const document = {
			documentElement: { lang: 'sv' },
			querySelectorAll(selector) { return selector === '[data-switch]' ? links : [name, title, description]; },
			querySelector() { return canonical; }
		};
		vm.runInNewContext(script, { location: { hostname, pathname, search: '', hash: '' }, document, HTMLMetaElement: MockMeta });
		return { lang: document.documentElement.lang, name: name.textContent, title: title.textContent, description: description.content, links: links.map((link) => ({ href: link.href, current: link['aria-current'] })), canonical: canonical.href };
	}

	const swedish = renderAt('autismappar.se', '/apps/board-builder.html');
	assert.equal(swedish.lang, 'sv');
	assert.equal(swedish.name, 'Brädbyggaren');
	assert.equal(swedish.links[0].href, 'https://autismappar.se/apps/board-builder.html');
	assert.equal(swedish.links[1].href, 'https://autismapps.online/apps/board-builder.html');
	assert.equal(swedish.canonical, 'https://autismappar.se/apps/board-builder.html');

	const english = renderAt('autismapps.online', '/autismapps/apps/board-builder.html');
	assert.equal(english.lang, 'en');
	assert.equal(english.name, 'Board Builder');
	assert.equal(english.title, 'Board Builder — Autismapps');
	assert.equal(english.description, 'English text');
	assert.equal(english.canonical, 'https://autismapps.online/apps/board-builder.html');
	assert.equal(english.links[1].current, 'page');
});
