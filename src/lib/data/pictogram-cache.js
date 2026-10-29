// Bump when replacing a bundled traffic-safety pictogram or official sign. The
// query string avoids stale CDN/browser copies and is also precached offline.
export const TRAFFIC_SAFETY_PICTOGRAM_REVISION = '2026-10-28-reflective-accessories-6';

/**
 * Return a cache-busted URL for bundled traffic-safety art.
 * Loopia may ignore query strings, so its build uses the Apache-rewritten path
 * alias. GitHub Pages and development keep the query-string form.
 * @param {string} basePath
 * @param {string} file
 * @param {boolean} [versionedPath]
 */
export function trafficSafetyPictogramUrl(basePath, file, versionedPath = false) {
	const base = basePath.replace(/\/$/, '');
	if (versionedPath) {
		return `${base}/piktali-pictograms/v${TRAFFIC_SAFETY_PICTOGRAM_REVISION}/${file}`;
	}
	return `${base}/piktali-pictograms/${file}?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}`;
}
