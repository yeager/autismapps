import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_APPS, CATEGORY_META } from '../src/lib/apps.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATIC_DIR = path.join(ROOT, 'static');
const OUTPUT_DIR = path.resolve(process.env.APP_DETAIL_OUTPUT_DIR || path.join(ROOT, 'build-loopia-root', 'apps'));
const messages = {
	sv: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/i18n/messages/sv.json'), 'utf8')),
	en: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/i18n/messages/en.json'), 'utf8'))
};

function escapeHtml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function text(locale, key) {
	const value = messages[locale][key];
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`Missing ${locale} app-detail text: ${key}`);
	}
	return value;
}

function leaf(sv, en) {
	return `<span data-sv="${escapeHtml(sv)}" data-en="${escapeHtml(en)}">${escapeHtml(sv)}</span>`;
}

export function renderPage(app) {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(app.id)) throw new Error(`Unsafe app id: ${app.id}`);
	if (!app.ready) throw new Error(`App detail page requested for unavailable app: ${app.id}`);
	const svName = text('sv', app.name);
	const enName = text('en', app.name);
	const svDescription = text('sv', app.description);
	const enDescription = text('en', app.description);
	const categoryKey = CATEGORY_META[app.category]?.label;
	if (!categoryKey) throw new Error(`Missing category metadata for ${app.id}`);
	const svCategory = text('sv', categoryKey);
	const enCategory = text('en', categoryKey);
	const iconPath = app.icon.replace(/^\//, '../');
	if (!iconPath.startsWith('../icons/')) throw new Error(`Unexpected app icon path for ${app.id}: ${app.icon}`);
	if (!fs.existsSync(path.join(STATIC_DIR, app.icon.slice(1)))) throw new Error(`Missing app icon for ${app.id}: ${app.icon}`);
	const launchPath = `../launcher/apps/${app.id}/`;
	const canonical = `https://autismappar.se/apps/${app.id}.html`;
	const englishCanonical = `https://autismapps.online/apps/${app.id}.html`;
	const svTitle = `${svName} — Autismappar`;
	const enTitle = `${enName} — Autismapps`;

	return `<!doctype html>
<html lang="sv">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="color-scheme" content="light">
	<meta name="description" content="${escapeHtml(svDescription)}" data-sv="${escapeHtml(svDescription)}" data-en="${escapeHtml(enDescription)}">
	<meta property="og:type" content="website">
	<meta property="og:title" content="${escapeHtml(svTitle)}" data-sv="${escapeHtml(svTitle)}" data-en="${escapeHtml(enTitle)}">
	<meta property="og:description" content="${escapeHtml(svDescription)}" data-sv="${escapeHtml(svDescription)}" data-en="${escapeHtml(enDescription)}">
	<meta property="og:site_name" content="Autismappar" data-sv="Autismappar" data-en="Autismapps">
	<link rel="canonical" href="${canonical}">
	<link rel="alternate" hreflang="sv" href="${canonical}">
	<link rel="alternate" hreflang="en" href="${englishCanonical}">
	<link rel="alternate" hreflang="x-default" href="${englishCanonical}">
	<title data-sv="${escapeHtml(svTitle)}" data-en="${escapeHtml(enTitle)}">${escapeHtml(svTitle)}</title>
	<style>
		:root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18312a; background: #f4f6f3; font-synthesis: none; text-rendering: optimizeLegibility; }
		* { box-sizing: border-box; }
		body { min-width: 320px; min-height: 100vh; margin: 0; display: flex; flex-direction: column; }
		a { color: inherit; }
		a:focus-visible { outline: 3px solid #d16c24; outline-offset: 4px; }
		.skip { position: absolute; left: 1rem; top: -5rem; z-index: 2; padding: .75rem 1rem; border-radius: .75rem; background: white; }
		.skip:focus { top: 1rem; }
		.topbar { width: min(100% - 2rem, 1080px); margin: 0 auto; min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
		.brand { display: inline-flex; align-items: center; gap: .65rem; font-weight: 750; font-size: 1.05rem; text-decoration: none; letter-spacing: -.02em; }
		.brand-mark { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: .7rem; color: white; background: #355c4e; }
		.languages { display: flex; align-items: center; gap: .25rem; padding: .25rem; border: 1px solid #dce4df; border-radius: 999px; background: #fff; }
		.languages a { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; padding: .45rem .8rem; border-radius: 999px; font-size: .9rem; text-decoration: none; }
		.languages a[aria-current="page"] { color: white; background: #355c4e; }
		main { width: min(100% - 2rem, 900px); margin: auto; padding: 2rem 0 4rem; }
		.back { display: inline-flex; min-height: 44px; align-items: center; gap: .5rem; margin-bottom: 1.25rem; color: #49645b; font-weight: 650; text-decoration: none; }
		.panel { --accent: #355c4e; overflow: hidden; border: 1px solid #e2e9e4; border-radius: 1.5rem; background: white; box-shadow: 0 16px 48px rgb(24 49 42 / 8%); }
		.panel-head { display: grid; grid-template-columns: 112px 1fr; align-items: center; gap: 1.5rem; padding: clamp(1.5rem, 5vw, 3rem); background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, white), white 72%); }
		.app-icon { width: 112px; height: 112px; display: grid; place-items: center; padding: 1rem; border: 1px solid #e5ebe7; border-radius: 1.25rem; background: white; }
		.app-icon img { width: 100%; height: 100%; object-fit: contain; }
		.eyebrow { margin: 0 0 .45rem; color: var(--accent); font-size: .78rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
		h1 { margin: 0; color: #172b25; font-size: clamp(2rem, 6vw, 3.25rem); line-height: 1.08; letter-spacing: -.045em; }
		.description { max-width: 38rem; margin: .85rem 0 0; color: #52645d; font-size: clamp(1.05rem, 2.4vw, 1.25rem); line-height: 1.6; }
		.panel-body { padding: 0 clamp(1.5rem, 5vw, 3rem) clamp(1.5rem, 5vw, 3rem); }
		.actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
		.primary { min-height: 54px; display: inline-flex; align-items: center; justify-content: center; gap: .55rem; padding: .8rem 1.25rem; border: 0; border-radius: .9rem; color: white; background: #355c4e; font-size: 1.05rem; font-weight: 750; text-decoration: none; box-shadow: 0 6px 16px rgb(53 92 78 / 20%); }
		.primary:hover { background: #294b3e; }
		.secondary { min-height: 50px; display: inline-flex; align-items: center; justify-content: center; padding: .7rem 1rem; border: 1px solid #dce4df; border-radius: .9rem; color: #294b3e; background: #f7f9f7; font-weight: 700; text-decoration: none; }
		.note { margin: 1.25rem 0 0; color: #60736b; font-size: .94rem; line-height: 1.5; }
		.footer { width: min(100% - 2rem, 1080px); margin: 0 auto; padding: 1.25rem 0 2rem; border-top: 1px solid #e1e8e3; color: #64756e; font-size: .9rem; }
		.footer a { text-decoration-thickness: .08em; text-underline-offset: .2em; }
		@media (max-width: 560px) { .topbar { min-height: 68px; } main { padding-top: 1rem; } .panel-head { grid-template-columns: 76px 1fr; gap: 1rem; padding: 1.25rem; } .app-icon { width: 76px; height: 76px; padding: .7rem; border-radius: 1rem; } .panel-body { padding: 0 1.25rem 1.5rem; } .actions { align-items: stretch; flex-direction: column; } .primary, .secondary { width: 100%; } }
		@media (prefers-reduced-motion: no-preference) { .panel { animation: appear .28s ease-out both; } @keyframes appear { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } } }
	</style>
</head>
<body>
	<a class="skip" href="#main">${leaf('Hoppa till innehållet', 'Skip to content')}</a>
	<header class="topbar">
		<a class="brand" href="../"><span class="brand-mark" aria-hidden="true">A</span>${leaf('Autismappar', 'Autismapps')}</a>
		<nav class="languages" aria-label="Language">
			<a data-switch="sv" href="${canonical}" lang="sv">SV</a>
			<a data-switch="en" href="${englishCanonical}" lang="en">EN</a>
		</nav>
	</header>
	<main id="main">
		<a class="back" href="../">← ${leaf('Alla verktyg', 'All tools')}</a>
		<article class="panel" style="--accent:${escapeHtml(CATEGORY_META[app.category].color)}">
			<div class="panel-head">
				<div class="app-icon"><img src="${escapeHtml(iconPath)}" alt="" width="80" height="80"></div>
				<div>
					<p class="eyebrow">${leaf(svCategory, enCategory)}</p>
					<h1>${leaf(svName, enName)}</h1>
					<p class="description">${leaf(svDescription, enDescription)}</p>
				</div>
			</div>
			<div class="panel-body">
				<div class="actions">
					<a class="primary" href="${launchPath}">▶ <span>${leaf('Öppna verktyget', 'Open tool')}</span></a>
					<a class="secondary" href="../">${leaf('Se alla verktyg', 'Browse all tools')}</a>
				</div>
				<p class="note">${leaf('Gratis att använda · Fungerar på mobil, surfplatta och dator · Inget konto behövs', 'Free to use · Works on phones, tablets and computers · No account needed')}</p>
			</div>
		</article>
	</main>
	<footer class="footer"><span>© 2026 ${leaf('Autismappar', 'Autismapps')}</span> · <a href="../privacy/">${leaf('Dataskydd', 'Privacy')}</a></footer>
	<script>
		(() => {
			const host = location.hostname.toLowerCase();
			const locale = host === 'autismappar.se' || host === 'www.autismappar.se' ? 'sv' : 'en';
			document.documentElement.lang = locale;
			for (const node of document.querySelectorAll('[data-sv][data-en]')) {
				if (node instanceof HTMLMetaElement) node.content = node.dataset[locale] || node.content;
				else node.textContent = node.dataset[locale] || node.textContent;
			}
			const pagePath = location.pathname.startsWith('/autismapps/')
				? location.pathname.slice('/autismapps'.length)
				: location.pathname;
			for (const link of document.querySelectorAll('[data-switch]')) {
				const targetHost = link.dataset.switch === 'sv' ? 'autismappar.se' : 'autismapps.online';
				link.href = 'https://' + targetHost + pagePath + location.search + location.hash;
				if (link.dataset.switch === locale) link.setAttribute('aria-current', 'page');
				else link.removeAttribute('aria-current');
			}
			const canonical = document.querySelector('link[rel="canonical"]');
			if (canonical) canonical.href = 'https://' + (locale === 'sv' ? 'autismappar.se' : 'autismapps.online') + pagePath;
		})();
	</script>
</body>
</html>
`;
}

export function generatePages(outputDir = OUTPUT_DIR) {
	fs.mkdirSync(outputDir, { recursive: true });
	const seen = new Set();
	for (const app of ALL_APPS) {
		if (seen.has(app.id)) throw new Error(`Duplicate app-detail page id: ${app.id}`);
		seen.add(app.id);
		fs.writeFileSync(path.join(outputDir, `${app.id}.html`), renderPage(app));
	}
	return seen.size;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	console.log(`Generated ${generatePages()} localized app-detail pages in ${OUTPUT_DIR}`);
}
