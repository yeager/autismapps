// Bump when replacing bundled traffic-safety art. Loopia uses versioned paths;
// other builds use query strings, and both forms are precached offline.
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

/**
 * Return a cache-busted URL for official traffic sign artwork.
 * Loopia can ignore query strings, so use a versioned path there too.
 * @param {string} basePath
 * @param {string} file
 * @param {boolean} [versionedPath]
 */
export function trafficSafetySignUrl(basePath, file, versionedPath = false) {
	const base = basePath.replace(/\/$/, '');
	const normalizedFile = file.replace(/^\//, '');
	if (versionedPath) {
		const filename = normalizedFile.split('/').at(-1);
		return `${base}/pictograms/traffic-safety/v${TRAFFIC_SAFETY_PICTOGRAM_REVISION}/signs/${filename}`;
	}
	return `${base}/${normalizedFile}?v=${TRAFFIC_SAFETY_PICTOGRAM_REVISION}`;
}
