/**
 * Swedish ARASAAC pictogram lookup.
 * Uses Danne's arasaac-sv.po translations (15607 entries).
 * Until ARASAAC has official Swedish support, this bridges the gap.
 */

let cache: Record<string, { sv: string; id: number }> | null = null;

export async function loadSvLookup(): Promise<Record<string, { sv: string; id: number }>> {
  if (cache) return cache;
  try {
    const res = await fetch('/arasaac-sv.json');
    if (res.ok) {
      cache = await res.json();
      return cache!;
    }
  } catch {}
  cache = {};
  return cache;
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
