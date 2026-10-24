import { fetchJsonWithFallback } from '../arasaac/cache.ts';
import { piktaliManifestUrls, type PiktaliManifestPictogram } from './search-match.ts';

const PIKTALI_MANIFEST_TIMEOUT_MS = 5000;

type PiktaliManifest = { pictograms?: PiktaliManifestPictogram[] };

function isUsableManifest(manifest: PiktaliManifest): manifest is { pictograms: PiktaliManifestPictogram[] } {
	return Array.isArray(manifest.pictograms) && manifest.pictograms.length > 0 && manifest.pictograms.every((pictogram) =>
		Boolean(pictogram?.id && pictogram.symbol && pictogram.file && pictogram.labels && typeof pictogram.labels === 'object')
	);
}

/** Load the hosted catalog, falling back to a lazy bundled copy if the host cannot serve it. */
export async function fetchPiktaliManifest(
	basePath: string,
	development = false,
	fetcher: typeof fetch = fetch,
	bundledFallback: () => Promise<PiktaliManifest> = async () => (await import('./search-fallback.json', { with: { type: 'json' } })).default
): Promise<PiktaliManifestPictogram[]> {
	const manifest = await fetchJsonWithFallback<PiktaliManifest>(
		piktaliManifestUrls(basePath, development),
		PIKTALI_MANIFEST_TIMEOUT_MS,
		fetcher,
		bundledFallback
	);
	if (isUsableManifest(manifest)) return manifest.pictograms;

	const fallback = await bundledFallback();
	if (!isUsableManifest(fallback)) throw new Error('Invalid bundled Piktali manifest');
	return fallback.pictograms;
}
