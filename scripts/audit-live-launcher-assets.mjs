// Check that the live Loopia launchers serve every asset referenced by the
// matching localized builds. This catches partial uploads that leave a page
// shell online while its JavaScript entry points or route chunks are missing.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, resolve, sep } from 'node:path';

const variants = [
	{ name: 'English', directory: 'build', host: 'autismapps.online', basePath: '/launcher' },
	{ name: 'Swedish', directory: 'build-sv', host: 'autismappar.se', basePath: '/launcher-sv' }
];
const assetExtensions = new Set(['.js', '.css', '.wasm']);
const concurrency = 8;
const userAgent = 'Mozilla/5.0 (compatible; AutismappsLiveAssetAudit/1.0)';

function collectHtmlFiles(directory) {
	const files = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) files.push(...collectHtmlFiles(path));
		else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
	}
	return files;
}

function collectAssetReferences(html, pageUrl) {
	const urls = new Set();
	const tags = html.matchAll(/<(?:script|link)\b[^>]*>/gi);
	for (const [tag] of tags) {
		const attribute = tag.match(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/i);
		if (!attribute) continue;
		const raw = attribute[2].replaceAll('&amp;', '&');
		let url;
		try {
			url = new URL(raw, pageUrl);
		} catch {
			continue;
		}
		if (url.protocol !== 'https:' || !assetExtensions.has(url.pathname.slice(url.pathname.lastIndexOf('.')).toLowerCase())) continue;
		urls.add(url.href);
	}
	return urls;
}

function localPathForUrl(url, root, basePath) {
	if (!url.pathname.startsWith(`${basePath}/`)) return null;
	const relativePath = decodeURIComponent(url.pathname.slice(basePath.length + 1));
	const localPath = resolve(root, relativePath);
	const rootPath = resolve(root);
	if (!localPath.startsWith(`${rootPath}${sep}`)) throw new Error(`Asset escapes build directory: ${url.href}`);
	return localPath;
}

function digest(bytes) {
	return createHash('sha256').update(bytes).digest('hex');
}

async function checkUrl(url, variant, root) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 30_000);
	try {
		const response = await fetch(url, {
			headers: { 'User-Agent': userAgent, 'Cache-Control': 'no-cache' },
			cache: 'no-store',
			signal: controller.signal
		});
		if (!response.ok) return `${url} returned HTTP ${response.status}`;
		const remoteBytes = Buffer.from(await response.arrayBuffer());
		const localPath = localPathForUrl(new URL(url), root, variant.basePath);
		if (localPath && existsSync(localPath)) {
			const localBytes = readFileSync(localPath);
			if (digest(localBytes) !== digest(remoteBytes)) return `${url} differs from ${relative(root, localPath)}`;
		}
		return null;
	} catch (error) {
		return `${url} failed: ${error instanceof Error ? error.message : String(error)}`;
	} finally {
		clearTimeout(timeout);
	}
}

async function mapLimit(values, limit, callback) {
	const results = new Array(values.length);
	let next = 0;
	await Promise.all(Array.from({ length: Math.min(limit, values.length) }, async () => {
		while (true) {
			const index = next++;
			if (index >= values.length) return;
			results[index] = await callback(values[index]);
		}
	}));
	return results;
}

for (const variant of variants) {
	const root = resolve(variant.directory);
	if (!existsSync(root)) throw new Error(`Missing ${variant.directory}; build both localized launchers first.`);
	const pageFiles = collectHtmlFiles(root);
	const pageUrl = `https://${variant.host}${variant.basePath}/`;
	const assets = new Set();
	for (const pageFile of pageFiles) {
		const html = readFileSync(pageFile, 'utf8');
		for (const asset of collectAssetReferences(html, pageUrl)) assets.add(asset);
	}
	const errors = (await mapLimit([...assets].sort(), concurrency, (url) => checkUrl(url, variant, root))).filter(Boolean);
	if (errors.length) {
		console.error(`${variant.name}: ${errors.length} live asset problem(s) across ${pageFiles.length} prerendered HTML files:`);
		for (const error of errors) console.error(`- ${error}`);
		process.exitCode = 1;
	} else {
		console.log(`${variant.name}: ${assets.size} live JavaScript/CSS/WASM URLs return HTTP 200 and match the local build (${pageFiles.length} HTML files).`);
	}
}
