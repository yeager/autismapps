// Version the static catalog URL so long lived host caches cannot keep serving
// a lookup file from a previous launcher deployment.
export const SWEDISH_LOOKUP_REVISION = '2026-10-23-search-catalog-1';

/** @param {string} basePath @param {boolean} [development] */
export function swedishLookupUrl(basePath, development = false) {
	const baseUrl = basePath.replace(/\/$/, '');
	const filename = development ? 'arasaac-sv.json' : `arasaac-sv-${SWEDISH_LOOKUP_REVISION}.json`;
	const cacheBuster = development ? '' : `?v=${SWEDISH_LOOKUP_REVISION}`;
	return `${baseUrl}/${filename}${cacheBuster}`;
}

/** @param {string} basePath @param {boolean} [development] */
export function swedishLookupUrls(basePath, development = false) {
	const primary = swedishLookupUrl(basePath, development);
	if (development) return [primary];
	const baseUrl = basePath.replace(/\/$/, '');
	return [primary, `${baseUrl}/arasaac-sv.json?v=${SWEDISH_LOOKUP_REVISION}`];
}
