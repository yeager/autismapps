import { fetchJsonWithFallback } from '../arasaac/cache.ts';
import { piktaliManifestUrls, type PiktaliManifestPictogram } from './search-match.ts';

const PIKTALI_MANIFEST_TIMEOUT_MS = 5000;

type PiktaliManifest = { pictograms?: PiktaliManifestPictogram[] };

function isUsableManifest(manifest: PiktaliManifest): manifest is { pictograms: PiktaliManifestPictogram[] } {
	return Array.isArray(manifest.pictograms) && manifest.pictograms.length > 0 && manifest.pictograms.every((pictogram) =>
		Boolean(pictogram?.id && pictogram.symbol && pictogram.file && pictogram.labels && typeof pictogram.labels === 'object')
	);
}

/** Load the small bundled search index first so searches work through stale or offline hosts. */
export async function fetchPiktaliManifest(
	basePath: string,
	development = false,
	fetcher: typeof fetch = fetch,
	bundledFallback: () => Promise<PiktaliManifest> = async () => (await import('./search-fallback.json', { with: { type: 'json' } })).default
): Promise<PiktaliManifestPictogram[]> {
	try {
		const bundled = await bundledFallback();
		if (isUsableManifest(bundled)) return bundled.pictograms;
	} catch {
		// Try the hosted copy below if the lazy local chunk cannot be loaded.
	}

	const hosted = await fetchJsonWithFallback<PiktaliManifest>(
		piktaliManifestUrls(basePath, development),
		PIKTALI_MANIFEST_TIMEOUT_MS,
		fetcher
	);
	if (!isUsableManifest(hosted)) throw new Error('Invalid hosted Piktali manifest');
	return hosted.pictograms;
}
