// Check prerendered launcher links against the files and fragments in each locale build.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const basePath = (process.env.LAUNCHER_BASE_PATH || '/launcher').replace(/\/$/, '');
const variants = ['build', 'build-sv'];
const siteHostnames = new Set(['autismappar.se', 'autismapps.online']);

function isSiteHostname(hostname) {
	return [...siteHostnames].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function fail(message) {
	throw new Error(message);
}

function decode(value, context) {
	try {
		return decodeURIComponent(value);
	} catch {
		fail(`${context}: invalid percent encoding in ${value}`);
	}
}

function collectHtmlFiles(directory) {
	const files = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) files.push(...collectHtmlFiles(path));
		else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
	}
	return files;
}

function idsIn(html) {
	return new Set([...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/g)].map((match) => match[2]));
}

function outputFileForPath(root, pathname, context) {
	if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return null;
	const relativePath = decode(pathname.slice(basePath.length).replace(/^\//, ''), context);
	let output = resolve(root, relativePath || '.');
	const rootPath = resolve(root);
	if (!output.startsWith(`${rootPath}${sep}`) && output !== rootPath) fail(`${context}: link escapes build directory`);
	if (existsSync(output)) {
		if (statSync(output).isFile()) return output;
		if (statSync(output).isDirectory()) return join(output, 'index.html');
	}
	if (pathname.endsWith('/') || !relativePath || !/\.[a-z0-9]+$/i.test(relativePath)) output = join(output, 'index.html');
	return output;
}

for (const variant of variants) {
	const root = resolve(variant);
	const files = collectHtmlFiles(root);
	const idsByFile = new Map(files.map((file) => [file, idsIn(readFileSync(file, 'utf8'))]));
	let checked = 0;
	const errors = [];

	for (const sourceFile of files) {
		const html = readFileSync(sourceFile, 'utf8');
		const sourceIds = idsByFile.get(sourceFile);
		for (const match of html.matchAll(/\bhref\s*=\s*(["'])(.*?)\1/g)) {
			const href = match[2].replaceAll('&amp;', '&');
			if (!href) continue;
			if (/^(?:mailto|tel|sms|javascript|data):/i.test(href)) continue;
			if (href.startsWith('#')) {
				const fragment = decode(href.slice(1), href);
				checked++;
				if (!sourceIds.has(fragment)) errors.push(`${relative(root, sourceFile)} -> ${href} (missing #${fragment})`);
				continue;
			}

			let url;
			try {
				url = new URL(href, `https://local.invalid${basePath}/`);
			} catch {
				errors.push(`${relative(root, sourceFile)}: invalid href ${href}`);
				continue;
			}
			if (url.origin !== 'https://local.invalid' && !isSiteHostname(url.hostname)) continue;
			const target = outputFileForPath(root, url.pathname, `${relative(root, sourceFile)} -> ${href}`);
			if (!target) continue;
			checked++;
			if (!existsSync(target)) {
				errors.push(`${relative(root, sourceFile)} -> ${href} (missing ${relative(root, target)})`);
				continue;
			}
			if (url.hash) {
				const fragment = decode(url.hash.slice(1), href);
				const targetIds = idsByFile.get(target);
				if (targetIds && !targetIds.has(fragment)) {
					errors.push(`${relative(root, sourceFile)} -> ${href} (missing #${fragment})`);
				}
			}
		}
	}

	if (errors.length) fail(`${variant}: ${errors.length} broken internal link(s):\n${errors.join('\n')}`);
	console.log(`${variant}: verified ${checked} internal launcher links and fragments across ${files.length} HTML files.`);
}
