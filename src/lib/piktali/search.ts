import { base } from '$app/paths';
import { boardBuilderSearchResult, matchPiktaliPictograms, piktaliManifestUrl, type PiktaliManifestPictogram, type PiktaliSearchResult } from './search-match';

export { matchPiktaliPictograms } from './search-match';

let manifestRequest: Promise<PiktaliManifestPictogram[]> | undefined;

async function loadPiktaliManifest(): Promise<PiktaliManifestPictogram[]> {
	manifestRequest ??= fetch(piktaliManifestUrl(base, import.meta.env.DEV))
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
	const boardBuilderResult = boardBuilderSearchResult(query, locale, base);
	if (boardBuilderResult.length > 0) return boardBuilderResult;

	try {
		return matchPiktaliPictograms(await loadPiktaliManifest(), query, locale, base);
	} catch {
		return [];
	}
}
