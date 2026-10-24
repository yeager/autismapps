// Build one localized static launcher tree for the public /launcher/ URL.
process.env.BASE_PATH = process.env.LAUNCHER_BASE_PATH || '/launcher';
process.env.CI = 'true';

import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SWEDISH_LOOKUP_REVISION } from '../src/lib/arasaac/sv-lookup-url.js';
import { PIKTALI_MANIFEST_REVISION } from '../src/lib/piktali/manifest-url.js';

const { build } = await import('vite');
await build();

const outputDirectoryName = process.env.BUILD_OUTPUT_DIR || 'build';
const outputDirectory = fileURLToPath(new URL(`../${outputDirectoryName}/`, import.meta.url));
const prerenderLocale = process.env.VITE_PRERENDER_LOCALE === 'sv' ? 'sv' : 'en';

// Publish path-versioned catalog aliases as well as the stable source paths.
// Some host caches key only by pathname and ignore query-string cache busters.
const versionedCatalogs = [
	[
		new URL('../static/arasaac-sv.json', import.meta.url),
		join(outputDirectory, `arasaac-sv-${SWEDISH_LOOKUP_REVISION}.json`)
	],
	[
		new URL('../static/piktali-pictograms/manifest.json', import.meta.url),
		join(outputDirectory, 'piktali-pictograms', `manifest-${PIKTALI_MANIFEST_REVISION}.json`)
	]
];
for (const [source, destination] of versionedCatalogs) {
	mkdirSync(dirname(destination), { recursive: true });
	copyFileSync(source, destination);
}

// Keep extensionless static routes working even when an older deployment left
// a directory with the same name on the host (for example /launcher/about).
function addDirectoryIndexes(directory) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const sourcePath = join(directory, entry.name);
		if (entry.isDirectory()) {
			addDirectoryIndexes(sourcePath);
			continue;
		}
		if (!entry.isFile() || !entry.name.endsWith('.html') || ['index.html', 'fallback.html'].includes(entry.name)) continue;

		const aliasPath = join(directory, entry.name.slice(0, -'.html'.length), 'index.html');
		mkdirSync(dirname(aliasPath), { recursive: true });
		copyFileSync(sourcePath, aliasPath);
	}
}
addDirectoryIndexes(outputDirectory);

// Make server-rendered document metadata agree with the language variant.
const brand = prerenderLocale === 'sv' ? 'Autismappar' : 'Autismapps';
const canonicalHost = prerenderLocale === 'sv' ? 'https://autismappar.se' : 'https://autismapps.online';
const basePath = process.env.BASE_PATH.replace(/\/$/, '');
const canonicalBasePath = (process.env.CANONICAL_BASE_PATH || '/launcher').replace(/\/$/, '');
function localizeDocumentMetadata(directory) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			localizeDocumentMetadata(path);
			continue;
		}
		if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

		const relativePath = path.slice(outputDirectory.length).replaceAll('\\', '/');
		let route = relativePath.replace(/(?:^|\/)index\.html$/, '/').replace(/\.html$/, '');
		if (!route.startsWith('/')) route = `/${route}`;
		if (route === '/fallback' || route === '/404') route = '/';
		const canonical = `${canonicalHost}${canonicalBasePath}${route === '/' ? '/' : route}`;
		let html = readFileSync(path, 'utf8')
			.replace(/<html lang="[^"]*"/, `<html lang="${prerenderLocale}"`)
			.replace(/(<link rel="manifest" href=")[^"]*/, `$1${basePath}/manifest-${prerenderLocale}.json`)
			.replace(/(<meta property="og:locale" content=")[^"]*/, `$1${prerenderLocale === 'sv' ? 'sv_SE' : 'en_US'}`)
			.replace(/(<meta property="og:site_name" content=")[^"]*/, `$1${brand}`)
			.replace(/(<meta property="og:image" content=")[^"]*/, `$1${canonicalHost}/images/og-image.png`)
			.replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${canonicalHost}/images/og-image.png`)
			.replace(/(<meta name="apple-mobile-web-app-title" content=")[^"]*/, `$1${brand}`)
			.replace(/(<link rel="canonical" href=")[^"]*/, `$1${canonical}`)
			.replace(/(<meta property="og:url" content=")[^"]*/, `$1${canonical}`);
		if (prerenderLocale === 'en') {
			html = html
				.replace('Gratis visuella verktyg för kommunikation, rutiner, tid och känslor. Prova bildstöd och vardagsstöd som fungerar på mobil, surfplatta och dator.', 'Free visual tools for communication, routines, time and emotions. Explore picture support and everyday tools for phones, tablets and computers.')
				.replace('Upptäck kostnadsfria verktyg för kommunikation, rutiner, tid och känslor. Fungerar på mobil, surfplatta och dator.', 'Explore free tools for communication, routines, time and emotions. Works on phones, tablets and computers.')
				.replace('Autismappar — Visuellt vardagsstöd för autism och NPF', 'Autismapps — Visual everyday support for autism and neurodivergence')
				.replace('Autismappar — visuellt stöd i vardagen', 'Autismapps — visual support for everyday life')
				.replace('Kostnadsfria visuella verktyg för kommunikation och vardagsrutiner.', 'Free visual tools for communication and everyday routines.');
		} else {
			html = html
				.replace('Free visual tools for communication, routines, time and emotions. Explore picture support and everyday tools for phones, tablets and computers.', 'Gratis visuella verktyg för kommunikation, rutiner, tid och känslor. Prova bildstöd och vardagsstöd som fungerar på mobil, surfplatta och dator.')
				.replace('autism apps, neurodivergent children, ADHD, autism, AAC, communication boards, pictograms, speech support, routines, free apps, PWA', 'autism appar, NPF-appar, ADHD barn, språkstörning, bildstöd, PECS, talsyntes, verbal dyspraxi, CAS, AKK, AAC, specialpedagogik, gratis, PWA')
				.replace('Autismapps — Visual everyday support for autism and neurodivergence', 'Autismappar — Visuellt vardagsstöd för autism och NPF')
				.replace('Explore free tools for communication, routines, time and emotions. Works on phones, tablets and computers.', 'Upptäck kostnadsfria verktyg för kommunikation, rutiner, tid och känslor. Fungerar på mobil, surfplatta och dator.')
				.replace('Autismapps — visual support for everyday life', 'Autismappar — visuellt stöd i vardagen')
				.replace('Free visual tools for communication and everyday routines.', 'Kostnadsfria visuella verktyg för kommunikation och vardagsrutiner.');
		}
		writeFileSync(path, html);
	}
}
localizeDocumentMetadata(outputDirectory);

// GitHub Pages serves 404.html for every unknown/deep client-side route. Keep
// the fallback payload intact so its sessionStorage redirect can restore the
// requested path before SvelteKit starts.
copyFileSync(join(outputDirectory, 'fallback.html'), join(outputDirectory, '404.html'));

// Preserve the old public URLs for speech and dyspraxia support.
for (const alias of ['verbal-dyspraxi', 'sprakstorning']) {
	const aliasDirectory = join(outputDirectory, 'apps', alias);
	mkdirSync(aliasDirectory, { recursive: true });
	const aliasTitle = prerenderLocale === 'sv' ? 'Tal- och språkstöd' : 'Speech and language support';
	const aliasLink = prerenderLocale === 'sv' ? 'Öppna tal- och språkstöd' : 'Open speech and language support';
	writeFileSync(
		join(aliasDirectory, 'index.html'),
		`<!doctype html><html lang="${prerenderLocale}"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${basePath}/?category=speech"><title>${aliasTitle} — ${brand}</title><p><a href="${basePath}/?category=speech">${aliasLink}</a></p></html>\n`
	);
}

copyFileSync(
	new URL('../deploy/launcher.htaccess', import.meta.url),
	join(outputDirectory, '.htaccess')
);
