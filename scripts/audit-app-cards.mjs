import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_APPS } from '../src/lib/apps.ts';

const locales = [
	{ code: 'en', build: 'build', messages: JSON.parse(readFileSync('src/lib/i18n/messages/en.json', 'utf8')) },
	{ code: 'sv', build: 'build-sv', messages: JSON.parse(readFileSync('src/lib/i18n/messages/sv.json', 'utf8')) }
];

const errors = [];
const ids = new Set();
const routes = new Set();

function normalizeText(value) {
	return value
		.replace(/<[^>]*>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&#x27;/gi, "'")
		.replace(/&apos;/gi, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\s+/g, ' ')
		.trim()
		.toLocaleLowerCase();
}

for (const app of ALL_APPS) {
	if (ids.has(app.id)) errors.push(`Duplicate app id: ${app.id}`);
	ids.add(app.id);

	if (routes.has(app.route)) errors.push(`Multiple app cards point to ${app.route}`);
	routes.add(app.route);

	const routeSlug = app.route.replace(/^\/apps\//, '');
	if (!app.route.startsWith('/apps/') || routeSlug !== app.id) {
		errors.push(`${app.id}: card route ${app.route} does not match its app id`);
	}

	const routeSource = ['+page.svelte', '+page.js', '+page.ts'].some((file) =>
	existsSync(join('src/routes', app.route, file))
	);
	if (!routeSource) errors.push(`${app.id}: route source is missing for ${app.route}`);

	if (!existsSync(join('static', app.icon.replace(/^\//, '')))) {
		errors.push(`${app.id}: icon is missing at ${app.icon}`);
	}

	for (const locale of locales) {
		for (const key of [app.name, app.description]) {
			if (typeof locale.messages[key] !== 'string' || !locale.messages[key].trim()) {
				errors.push(`${app.id}: missing ${locale.code} translation ${key}`);
			}
		}

		const routeHtml = join(locale.build, app.route, 'index.html');
		if (!existsSync(routeHtml)) {
			errors.push(`${app.id}: built route is missing from ${locale.build}`);
			continue;
		}

		const html = readFileSync(routeHtml, 'utf8');
		const cardName = normalizeText(locale.messages[app.name]);
		const title = normalizeText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
		if (!title || !title.includes(cardName)) {
			errors.push(`${app.id}: ${locale.code} page title "${title}" does not include the app name "${cardName}"`);
		}
		const heading = normalizeText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
		if (!heading || !heading.includes(cardName)) {
			errors.push(`${app.id}: ${locale.code} route heading "${heading}" does not match card name "${cardName}"`);
		}

		const builtIcon = join(locale.build, app.icon.replace(/^\//, ''));
		if (!existsSync(builtIcon)) errors.push(`${app.id}: ${locale.code} build is missing icon ${app.icon}`);
	}
}

for (const rootCatalog of [
	{ code: 'sv', file: 'deploy/root-site/index.html', routePrefix: '/launcher-sv/apps/' },
	{ code: 'en', file: 'deploy/root-site/index-en.html', routePrefix: '/launcher/apps/' }
]) {
	if (!existsSync(rootCatalog.file)) {
		errors.push(`${rootCatalog.code}: root catalogue is missing at ${rootCatalog.file}`);
		continue;
	}

	const html = readFileSync(rootCatalog.file, 'utf8');
	const cards = [...html.matchAll(/<a\b[^>]*class="app-card"[^>]*>[\s\S]*?<\/a>/g)].map(([card]) => {
		const href = card.match(/\bhref="([^"]+)"/)?.[1] ?? '';
		const id = href.match(/\/apps\/([a-z0-9-]+)(?:\?|$)/)?.[1] ?? '';
		const title = card.match(/<h3\b[^>]*>[\s\S]*?<span\b[^>]*\bdata-sv="([^"]*)"[^>]*\bdata-en="([^"]*)"[^>]*>/i);
		const description = card.match(/<p\b[^>]*\bdata-sv="([^"]*)"[^>]*\bdata-en="([^"]*)"[^>]*>/i);
		const category = card.match(/\bdata-cat="([^"]+)"/)?.[1] ?? '';
		const englishSearch = card.match(/\bdata-en-search="([^"]*)"/)?.[1] ?? '';
		return { id, href, title: title?.slice(1) ?? [], description: description?.slice(1) ?? [], category, englishSearch };
	});

	if (cards.length !== ALL_APPS.length) {
		errors.push(`${rootCatalog.code}: root catalogue has ${cards.length} cards for ${ALL_APPS.length} registered apps`);
	}

	const rootIds = new Set();
	for (const card of cards) {
		if (!card.id) {
			errors.push(`${rootCatalog.code}: root catalogue card has no app route (${card.href || 'missing href'})`);
			continue;
		}
		if (rootIds.has(card.id)) errors.push(`${rootCatalog.code}: duplicate root catalogue card ${card.id}`);
		rootIds.add(card.id);
		const app = ALL_APPS.find(({ id }) => id === card.id);
		if (!app) {
			errors.push(`${rootCatalog.code}: root catalogue links to unknown app ${card.id}`);
			continue;
		}

		const expectedHref = `${rootCatalog.routePrefix}${app.id}${rootCatalog.code === 'en' ? '?locale=en' : ''}`;
		if (card.href !== expectedHref) errors.push(`${rootCatalog.code}: ${app.id} links to ${card.href}, expected ${expectedHref}`);
		if (card.category !== app.category) errors.push(`${rootCatalog.code}: ${app.id} uses category ${card.category}, expected ${app.category}`);
		if (card.title.length !== 2 || normalizeText(card.title[0]) !== normalizeText(locales.find(({ code }) => code === 'sv').messages[app.name]) || normalizeText(card.title[1]) !== normalizeText(locales.find(({ code }) => code === 'en').messages[app.name])) {
			errors.push(`${rootCatalog.code}: ${app.id} root catalogue title does not match the localized app registry`);
		}
		if (card.description.length !== 2 || normalizeText(card.description[0]) !== normalizeText(locales.find(({ code }) => code === 'sv').messages[app.description]) || normalizeText(card.description[1]) !== normalizeText(locales.find(({ code }) => code === 'en').messages[app.description])) {
			errors.push(`${rootCatalog.code}: ${app.id} root catalogue description does not match the localized app registry`);
		}
		const englishMessages = locales.find(({ code }) => code === 'en').messages;
		if (!normalizeText(card.englishSearch).includes(normalizeText(englishMessages[app.name])) || !normalizeText(card.englishSearch).includes(normalizeText(englishMessages[app.description]))) {
			errors.push(`${rootCatalog.code}: ${app.id} root catalogue search text is missing English app text`);
		}
	}

	for (const app of ALL_APPS) {
		if (!rootIds.has(app.id)) errors.push(`${rootCatalog.code}: root catalogue is missing ${app.id}`);
	}
}

if (errors.length) {
	console.error(`App card audit found ${errors.length} problem(s):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log(`Verified ${ALL_APPS.length} launcher cards and both root-site catalogues: unique ids/routes, matching source pages, localized names and descriptions, correct root links/categories/search text, and icons in both builds.`);
}
