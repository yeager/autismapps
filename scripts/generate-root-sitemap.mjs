import { writeFile } from 'node:fs/promises';
import { ALL_APPS } from '../src/lib/apps.ts';

const domains = ['https://autismappar.se', 'https://autismapps.online'];
const mainPages = [
	{ path: '/', priority: '1.0' },
	{ path: '/launcher/', priority: '0.9' },
	{ path: '/launcher/about', priority: '0.5' },
	{ path: '/launcher/settings', priority: '0.3' },
	{ path: '/bildstod/', priority: '0.6' },
	{ path: '/skriv/', priority: '0.6' }
];

const urls = [
	...domains.flatMap((domain) => [
		...mainPages.map(({ path, priority }) => ({ loc: `${domain}${path}`, priority })),
		...ALL_APPS.map((app) => ({ loc: `${domain}/launcher${app.route}`, priority: '0.8' }))
	])
];

const xmlEscape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const entries = urls.map(({ loc, priority }) => `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <priority>${priority}</priority>\n  </url>`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

await writeFile(new URL('../static/sitemap.xml', import.meta.url), sitemap);
console.log(`Generated sitemap with ${urls.length} URLs (${ALL_APPS.length} app routes on ${domains.length} domains).`);
