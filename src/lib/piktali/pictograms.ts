import { base } from '$app/paths';
import { dictionaryPictogramFiles } from './dictionary-files';

/**
 * Stable paths for the subset of shared Piktali pictograms used by the picture
 * dictionary. The complete manifest remains in static/piktali-pictograms for
 * applications that need the full catalog and its review metadata.
 */
export function piktaliPictogramUrl(symbol: string): string | null {
  const file = dictionaryPictogramFiles[symbol];
  return file ? `${base}/piktali-pictograms/${file}` : null;
}

export function piktaliDictionaryPictogramUrl(englishWord: string): string | null {
  return piktaliPictogramUrl(englishWord);
}
