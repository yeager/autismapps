// Verify domain-specific prerendered language, route coverage, and asset paths.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { SWEDISH_LOOKUP_REVISION } from '../src/lib/arasaac/sv-lookup-url.js';
import { PIKTALI_MANIFEST_REVISION } from '../src/lib/piktali/manifest-url.js';

const basePath = (process.env.LAUNCHER_BASE_PATH || '/launcher').replace(/\/$/, '');
const canonicalBasePath = (process.env.CANONICAL_BASE_PATH || '/launcher').replace(/\/$/, '');
const variants = [
	{ code: 'en', directory: 'build', host: 'autismapps.online', brand: 'Autismapps', marker: 'All tools' },
	{ code: 'sv', directory: 'build-sv', host: 'autismappar.se', brand: 'Autismappar', marker: 'Alla verktyg' }
];
const appRoutes = readdirSync('src/routes/apps', { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name)
	.sort();
const piktaliSource = readFileSync('static/piktali-pictograms/manifest.json');
const piktaliSourceManifest = JSON.parse(piktaliSource.toString('utf8'));

function expect(condition, message) {
	if (!condition) throw new Error(message);
}

function attr(html, pattern) {
	const match = html.match(pattern);
	return match?.[1] ?? '';
}

for (const variant of variants) {
	const root = resolve(variant.directory);
	const requiredCatalogs = [
		`arasaac-sv-${SWEDISH_LOOKUP_REVISION}.json`,
		join('piktali-pictograms', `manifest-${PIKTALI_MANIFEST_REVISION}.json`)
	];
	for (const catalog of requiredCatalogs) {
		const path = join(root, catalog);
		expect(existsSync(path), `${variant.directory}: missing required search catalog ${catalog}`);
		expect(readFileSync(path).length > 0, `${variant.directory}: empty required search catalog ${catalog}`);
	}
	const piktaliCatalogPath = join(root, 'piktali-pictograms', `manifest-${PIKTALI_MANIFEST_REVISION}.json`);
	const piktaliCatalogBytes = readFileSync(piktaliCatalogPath);
	expect(piktaliCatalogBytes.equals(piktaliSource), `${variant.directory}: Piktali manifest differs from the source catalog`);
	const piktaliCatalog = JSON.parse(piktaliCatalogBytes.toString('utf8'));
	expect(Array.isArray(piktaliCatalog.pictograms) && piktaliCatalog.pictograms.length > 0, `${variant.directory}: Piktali catalog has no pictograms`);
	expect(piktaliCatalog.pictograms.some((pictogram) => pictogram.labels?.['sv-SE'] === 'Hund'), `${variant.directory}: Piktali catalog cannot find the Swedish dog label`);
	expect(piktaliCatalog.pictograms.some((pictogram) => pictogram.labels?.['en-US'] === 'Dog'), `${variant.directory}: Piktali catalog cannot find the English dog label`);
	for (const pictogram of piktaliCatalog.pictograms) {
		expect(typeof pictogram.file === 'string' && pictogram.file.startsWith('assets/'), `${variant.directory}: invalid Piktali asset path ${pictogram.file}`);
		const assetPath = resolve(root, 'piktali-pictograms', pictogram.file);
		expect(assetPath.startsWith(`${resolve(root, 'piktali-pictograms')}${sep}`), `${variant.directory}: Piktali asset escapes its catalog directory`);
		expect(existsSync(assetPath), `${variant.directory}: missing Piktali asset ${pictogram.file}`);
		expect(statSync(assetPath).size === pictogram.bytes, `${variant.directory}: wrong byte count for Piktali asset ${pictogram.file}`);
	}
	const home = readFileSync(join(root, 'index.html'), 'utf8');
	expect(home.includes(`<html lang="${variant.code}"`), `${variant.directory}: wrong home lang`);
	expect(home.includes(variant.marker), `${variant.directory}: missing localized home marker`);
	expect(home.includes(`href="https://${variant.host}${canonicalBasePath}/"`), `${variant.directory}: wrong home canonical host`);
	expect(home.includes(`content="${variant.brand}"`), `${variant.directory}: wrong site brand metadata`);
	expect(home.includes(`${basePath}/manifest-${variant.code}.json`), `${variant.directory}: wrong language manifest`);

	for (const slug of appRoutes) {
		const path = join(root, 'apps', slug, 'index.html');
		expect(existsSync(path), `${variant.directory}: missing route ${slug}`);
		const html = readFileSync(path, 'utf8');
		expect(html.includes(`<html lang="${variant.code}"`), `${variant.directory}/${slug}: wrong lang`);
		expect(html.includes(`href="https://${variant.host}${canonicalBasePath}/apps/${slug}/"`), `${variant.directory}/${slug}: wrong canonical`);
		expect(html.includes(`content="${variant.brand}"`), `${variant.directory}/${slug}: wrong brand metadata`);

		const assets = [
			...html.matchAll(/(?:src|href)="([^"#?]+\.(?:js|css|wasm))"/g)
		].map((match) => match[1]);
		for (const asset of assets) {
			if (!asset.startsWith(`${basePath}/`)) continue;
			const localPath = resolve(root, asset.slice(basePath.length + 1));
			expect(localPath.startsWith(`${root}${sep}`), `${variant.directory}/${slug}: asset escapes build tree`);
			expect(existsSync(localPath), `${variant.directory}/${slug}: missing asset ${relative(root, localPath)}`);
		}
	}
}

const trafficSv = readFileSync(join('build-sv', 'apps', 'traffic-safety', 'index.html'), 'utf8');
expect(/<h1[^>]*>\s*Trafiksäkerhet\s*<\/h1>/.test(trafficSv), 'Swedish Traffic Safety heading is not prerendered in Swedish');
const trafficEn = readFileSync(join('build', 'apps', 'traffic-safety', 'index.html'), 'utf8');
expect(/<h1[^>]*>\s*Traffic Safety\s*<\/h1>/.test(trafficEn), 'English Traffic Safety heading is not prerendered in English');

console.log(`Verified ${appRoutes.length} app routes, localized HTML, canonical metadata, local assets, and versioned search catalogs in English and Swedish builds.`);
console.log(`Verified all ${piktaliSourceManifest.pictograms.length} Piktali assets in both builds, including the Swedish and English dog search labels.`);
