import { loadSvLookup } from './sv-lookup';
import { searchBildstod } from './bildstod';

const API_BASE = 'https://api.arasaac.org/v1';
const CACHE_NAME = 'arasaac-pictograms';

export interface Pictogram {
  _id: number;
  keywords: { keyword: string; type: number; meaning?: string }[];
  categories: string[];
  synsets: string[];
  tags: string[];
}

export interface PictogramSearchResult {
  id: number;
  keyword: string;
  url: string;
  urlBW: string;
}

export async function searchPictograms(
  query: string,
  lang: string = 'en'
): Promise<PictogramSearchResult[]> {
  const queryLower = query.toLowerCase().trim();
  const seenIds = new Set<number>();
  const results: PictogramSearchResult[] = [];

  // === STEP 1: ALWAYS search bildstöd FIRST (140 Swedish/NPF pictograms) ===
  // These are curated for Swedish culture and NPF — always prioritize
  try {
    const bildstodResults = await searchBildstod(query, lang === '' ? 'sv' : lang);
    for (const b of bildstodResults) {
      if (!seenIds.has(b.id)) {
        results.push({ id: b.id, keyword: b.keyword, url: b.url, urlBW: b.url });
        seenIds.add(b.id);
      }
    }
  } catch {}

  // === STEP 2: Swedish ARASAAC lookup (15,607 translations) ===
  if (lang === 'sv' || lang === '') {
    const lookup = await loadSvLookup();

    // 2a: Exact match on SWEDISH value (prevents "barn" → "ladugård")
    for (const [en, entry] of Object.entries(lookup)) {
      if (entry.sv.toLowerCase() === queryLower && entry.id && !seenIds.has(entry.id)) {
        results.push({ id: entry.id, keyword: entry.sv, url: getPictogramUrl(entry.id, false), urlBW: getPictogramUrl(entry.id, true) });
        seenIds.add(entry.id);
        break;
      }
    }

    // 2b: Exact match on English key
    const exactEnKey = lookup[queryLower];
    if (exactEnKey?.id && !seenIds.has(exactEnKey.id)) {
      results.push({ id: exactEnKey.id, keyword: exactEnKey.sv, url: getPictogramUrl(exactEnKey.id, false), urlBW: getPictogramUrl(exactEnKey.id, true) });
      seenIds.add(exactEnKey.id);
    }

    // 2c: Partial matches — Swedish values first, then English keys
    if (results.length < 50) {
      const svPartial: PictogramSearchResult[] = [];
      const enPartial: PictogramSearchResult[] = [];
      for (const [en, entry] of Object.entries(lookup)) {
        if (!entry.id || seenIds.has(entry.id)) continue;
        const svLower = entry.sv.toLowerCase();
        if (svLower.includes(queryLower)) {
          const item = { id: entry.id, keyword: entry.sv, url: getPictogramUrl(entry.id, false), urlBW: getPictogramUrl(entry.id, true) };
          if (svLower === queryLower) svPartial.unshift(item); else svPartial.push(item);
          seenIds.add(entry.id);
        } else if (en.includes(queryLower) && !seenIds.has(entry.id)) {
          enPartial.push({ id: entry.id, keyword: entry.sv, url: getPictogramUrl(entry.id, false), urlBW: getPictogramUrl(entry.id, true) });
          seenIds.add(entry.id);
        }
      }
      results.push(...svPartial, ...enPartial);
    }

    if (results.length > 0) {
      return results.slice(0, 50);
    }
  }

  // === STEP 3: Fallback to ARASAAC API (if no local results) ===
  try {
    const searchLang = lang === 'sv' ? 'en' : (lang || 'en');
    const res = await fetch(`${API_BASE}/pictograms/${searchLang}/search/${encodeURIComponent(query)}`);
    if (!res.ok) return results.slice(0, 50);
    const data: Pictogram[] = await res.json();
    const lookup = lang === 'sv' ? await loadSvLookup() : null;
    for (const p of data.slice(0, 50)) {
      if (seenIds.has(p._id)) continue;
      const enKeyword = p.keywords[0]?.keyword || query;
      const keyword = lookup ? (lookup[enKeyword.toLowerCase()]?.sv || enKeyword) : enKeyword;
      results.push({
        id: p._id,
        keyword,
        url: getPictogramUrl(p._id, false),
        urlBW: getPictogramUrl(p._id, true)
      });
      seenIds.add(p._id);
    }
  } catch {}

  return results.slice(0, 50);
}

export function getPictogramUrl(
  id: number,
  bw: boolean = false,
  size: number = 300
): string {
  // Valid sizes: 300, 500, 2500
  const validSize = [300, 500, 2500].includes(size) ? size : 300;
  return `https://static.arasaac.org/pictograms/${id}/${id}_${validSize}.png`;
}

export async function getPictogramById(id: number, lang: string = 'en'): Promise<Pictogram | null> {
  try {
    const locale = lang === 'sv' ? 'sv' : 'en';
    const res = await fetch(`${API_BASE}/pictograms/${locale}/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Pre-built category pictogram mappings for templates
export const CATEGORY_PICTOGRAMS: Record<string, number[]> = {
  food: [2444, 2445, 2446, 2447, 2448, 2449, 2450, 2451],
  hygiene: [6891, 6892, 6893, 6894, 6895],
  emotions: [7085, 7086, 7087, 7088, 7089],
  school: [4773, 4774, 4775, 4776, 4777],
  home: [3241, 3242, 3243, 3244, 3245],
  clothes: [2019, 2020, 2021, 2022, 2023]
};

// Re-export bildstöd for direct access
export { searchBildstod, getBildstodBySlug, getBildstodUrl } from "./bildstod";
