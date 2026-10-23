// Version the static catalog URL so long lived host caches cannot keep serving
// a lookup file from a previous launcher deployment.
export const SWEDISH_LOOKUP_REVISION = '2026-10-23-search-catalog-1';

/** @param {string} basePath */
export function swedishLookupUrl(basePath) {
	const baseUrl = basePath.replace(/\/$/, '');
	return `${baseUrl}/arasaac-sv.json?v=${SWEDISH_LOOKUP_REVISION}`;
}
