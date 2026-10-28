// Bump when the Piktali manifest changes so caches get a new URL path.
export const PIKTALI_MANIFEST_REVISION = '2026-10-28-piktali-reviewed-catalog-2';

/** @param {string} basePath @param {boolean} [development] */
export function piktaliManifestUrl(basePath, development = false) {
	const base = basePath.replace(/\/$/, '');
	const filename = development ? 'manifest.json' : `manifest-${PIKTALI_MANIFEST_REVISION}.json`;
	const cacheBuster = development ? '' : `?v=${PIKTALI_MANIFEST_REVISION}`;
	return `${base}/piktali-pictograms/${filename}${cacheBuster}`;
}

/** @param {string} basePath @param {boolean} [development] */
export function piktaliManifestUrls(basePath, development = false) {
	const primary = piktaliManifestUrl(basePath, development);
	if (development) return [primary];
	const base = basePath.replace(/\/$/, '');
	return [primary, `${base}/piktali-pictograms/manifest.json?v=${PIKTALI_MANIFEST_REVISION}`];
}
