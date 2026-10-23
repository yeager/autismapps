import { base } from '$app/paths';
import { matchPiktaliPictograms, type PiktaliManifestPictogram, type PiktaliSearchResult } from './search-match';

export { matchPiktaliPictograms } from './search-match';

let manifestRequest: Promise<PiktaliManifestPictogram[]> | undefined;

async function loadPiktaliManifest(): Promise<PiktaliManifestPictogram[]> {
	manifestRequest ??= fetch(`${base}/piktali-pictograms/manifest.json`)
		.then((response) => {
			if (!response.ok) throw new Error(`Piktali manifest request failed: ${response.status}`);
			return response.json();
		})
		.then((manifest: { pictograms?: PiktaliManifestPictogram[] }) => {
			if (!Array.isArray(manifest.pictograms)) throw new Error('Invalid Piktali manifest');
			return manifest.pictograms;
		})
		.catch((error) => {
			manifestRequest = undefined;
			throw error;
		});
	return manifestRequest;
}

/** Search the Piktali catalog on demand so it does not enlarge the initial page bundle. */
export async function searchPiktaliPictograms(
	query: string,
	locale: string
): Promise<PiktaliSearchResult[]> {
	try {
		return matchPiktaliPictograms(await loadPiktaliManifest(), query, locale, base);
	} catch {
		return [];
	}
}
