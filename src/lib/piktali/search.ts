import { base } from '$app/paths';
import { fetchJsonWithTimeout } from '../arasaac/cache';
import { boardBuilderSearchResult, matchPiktaliPictograms, piktaliManifestUrl, type PiktaliManifestPictogram, type PiktaliSearchResult } from './search-match';

export { matchPiktaliPictograms } from './search-match';

const PIKTALI_MANIFEST_TIMEOUT_MS = 5000;
let manifestRequest: Promise<PiktaliManifestPictogram[]> | undefined;

async function loadPiktaliManifest(): Promise<PiktaliManifestPictogram[]> {
  manifestRequest ??= fetchJsonWithTimeout<{ pictograms?: PiktaliManifestPictogram[] }>(
      piktaliManifestUrl(base, import.meta.env.DEV),
      PIKTALI_MANIFEST_TIMEOUT_MS
    ).then((manifest) => {
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
