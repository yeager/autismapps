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

if (errors.length) {
	console.error(`App card audit found ${errors.length} problem(s):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log(`Verified ${ALL_APPS.length} app cards: unique ids/routes, matching route slugs, source pages, localized names and descriptions, matching English/Swedish route headings, and icons in both builds.`);
}
