// Bump when the Piktali manifest changes so caches get a new URL path.
export const PIKTALI_MANIFEST_REVISION = '2026-10-23-board-builder-search-1';

/** @param {string} basePath @param {boolean} [development] */
export function piktaliManifestUrl(basePath, development = false) {
	const base = basePath.replace(/\/$/, '');
	const filename = development ? 'manifest.json' : `manifest-${PIKTALI_MANIFEST_REVISION}.json`;
	const cacheBuster = development ? '' : `?v=${PIKTALI_MANIFEST_REVISION}`;
	return `${base}/piktali-pictograms/${filename}${cacheBuster}`;
}
