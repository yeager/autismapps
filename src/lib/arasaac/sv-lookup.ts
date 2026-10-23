/**
 * Swedish ARASAAC pictogram lookup.
 * Uses Danne's arasaac-sv.po translations (15607 entries).
 * Until ARASAAC has official Swedish support, this bridges the gap.
 */

import { base } from '$app/paths';
import { applySwedishLookupOverrides } from './sv-lookup-overrides.js';
import { swedishLookupUrl } from './sv-lookup-url.js';

let cache: Record<string, { sv: string; id: number }> | null = null;
let loading: Promise<Record<string, { sv: string; id: number }>> | null = null;

export function loadSvLookup(): Promise<Record<string, { sv: string; id: number }>> {
  if (cache) return Promise.resolve(cache);
  // Concurrent searches (apps look up a whole vocabulary at once) share one load of the 785 KB file
  loading ??= (async () => {
    try {
      const res = await fetch(swedishLookupUrl(base));
      if (res.ok) {
        const data: unknown = await res.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
			const corrected = applySwedishLookupOverrides(data as Record<string, { sv: string; id: number }>);
			cache = corrected;
			return corrected;
        }
      }
    } catch {}
    // Do not memoize a failed fetch: a temporary offline or hosting error should
    // not permanently disable Swedish pictogram search for this page session.
    return {};
  })().finally(() => {
    loading = null;
  });
  return loading;
}

/**
 * Translate an English ARASAAC keyword to Swedish.
 * Returns the Swedish word, or the English word if no translation found.
 */
export async function translateKeyword(en: string): Promise<string> {
  const lookup = await loadSvLookup();
  const entry = lookup[en.toLowerCase()];
  return entry?.sv || en;
}

/**
 * Get pictogram ID for an English keyword (from the .po file).
 * Returns 0 if not found.
 */
export async function getPictogramIdFromPo(en: string): Promise<number> {
  const lookup = await loadSvLookup();
  const entry = lookup[en.toLowerCase()];
  return entry?.id || 0;
}

/**
 * Translate a list of English keywords to Swedish.
 */
export async function translateKeywords(words: string[]): Promise<{ en: string; sv: string; id: number }[]> {
  const lookup = await loadSvLookup();
  return words.map(w => {
    const entry = lookup[w.toLowerCase()];
    return { en: w, sv: entry?.sv || w, id: entry?.id || 0 };
  });
}
