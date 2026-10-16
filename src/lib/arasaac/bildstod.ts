/**
 * Bildstöd — Local Swedish pictogram service.
 * Provides Swedish/Nordic and NPF-specific pictograms not available in ARASAAC.
 * Hosted at autismappar.se/bildstod
 */

import { createJsonCache } from './cache';

const DEFAULT_BILDSTOD_BASE = 'https://autismappar.se/bildstod/bildstod-service';

function getBildstodBase(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    const isAutismappsDomain = hostname === 'autismappar.se'
      || hostname.endsWith('.autismappar.se')
      || hostname === 'autismapps.online'
      || hostname.endsWith('.autismapps.online');

    // Both production domains ship the Bildstöd service. Keeping requests on
    // the current origin avoids cross-origin failures on autismapps.online.
    if (isAutismappsDomain) return `${window.location.origin}/bildstod/bildstod-service`;
  }

  return DEFAULT_BILDSTOD_BASE;
}

export interface BildstodPictogram {
  id: number;
  slug: string;
  keywords: { sv: string[]; en: string[] };
  categories: string[];
  description: { sv: string; en: string };
  files: { svg: string; png_500: string };
  tags: string[];
}

interface BildstodData {
  version: string;
  pictograms: BildstodPictogram[];
  categories: { id: string; name: { sv: string; en: string } }[];
}

// Cached like the ARASAAC answers (./cache.ts), with a short timeout: Bildstöd is searched
// before ARASAAC, so a slow service must not hold the pictogram search up
const bildstodJson = createJsonCache({ timeoutMs: 1500 }).get;

let cache: BildstodData | null = null;
let loading: Promise<BildstodData> | null = null;

function isBildstodData(value: unknown): value is BildstodData {
  if (!value || typeof value !== 'object') return false;
  const pictograms = (value as { pictograms?: unknown }).pictograms;
  return Array.isArray(pictograms) && pictograms.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const pictogram = item as Partial<BildstodPictogram>;
    return typeof pictogram.id === 'number'
      && Array.isArray(pictogram.keywords?.sv)
      && Array.isArray(pictogram.keywords?.en)
      && Array.isArray(pictogram.categories)
      && typeof pictogram.slug === 'string'
      && typeof pictogram.files?.png_500 === 'string';
  });
}

/**
 * Load the bildstöd pictogram catalog from the matching remote API.
 * Concurrent searches (apps look up a whole vocabulary at once) share one load;
 * a failed load is not memoized, so the next search retries.
 */
export function loadBildstod(): Promise<BildstodData> {
  if (cache) return Promise.resolve(cache);
  loading ??= (async () => {
    try {
      const data = await bildstodJson<unknown>(`${getBildstodBase()}/api/pictograms.json`);
      if (isBildstodData(data)) {
        cache = data;
        return cache;
      }
    } catch {}
    return { version: '0.0.0', pictograms: [], categories: [] };
  })().finally(() => {
    loading = null;
  });
  return loading;
}

/**
 * Search bildstöd pictograms by Swedish or English keyword.
 * Returns results compatible with the ARASAAC search format.
 */
export async function searchBildstod(
  query: string,
  lang: string = 'sv'
): Promise<{ id: number; keyword: string; url: string; slug: string; source: 'bildstod' }[]> {
  const data = await loadBildstod();
  const bildstodBase = getBildstodBase();
  const q = query.toLowerCase().trim();
  
  if (!q) return [];
  
  const results: { id: number; keyword: string; url: string; slug: string; source: 'bildstod'; score: number }[] = [];
  
  for (const p of data.pictograms) {
    let score = 0;
    let matchedKeyword = '';
    
    // Check Swedish keywords
    for (const kw of p.keywords.sv ?? []) {
      const kwLower = kw.toLowerCase();
      if (kwLower === q) {
        score = 100; // Exact match
        matchedKeyword = kw;
        break;
      } else if (kwLower.startsWith(q)) {
        score = Math.max(score, 80);
        if (!matchedKeyword) matchedKeyword = kw;
      } else if (kwLower.includes(q)) {
        score = Math.max(score, 50);
        if (!matchedKeyword) matchedKeyword = kw;
      }
    }
    
    // Check English keywords (lower priority)
    if (score === 0) {
      for (const kw of p.keywords.en ?? []) {
        const kwLower = kw.toLowerCase();
        if (kwLower === q) {
          score = 70;
          matchedKeyword = p.keywords.sv[0] || kw; // Show Swedish
          break;
        } else if (kwLower.includes(q)) {
          score = Math.max(score, 30);
          if (!matchedKeyword) matchedKeyword = p.keywords.sv[0] || kw;
        }
      }
    }
    
    // Check categories and tags
    if (score === 0) {
      const allMeta = [...(p.categories ?? []), ...(p.tags ?? []), p.slug ?? ''].join(' ').toLowerCase();
      if (allMeta.includes(q)) {
        score = 20;
        matchedKeyword = p.keywords.sv[0];
      }
    }
    
    if (score > 0) {
      results.push({
        id: p.id >= 900000 ? p.id : p.id + 900000, // Offset only if not already offset
        keyword: matchedKeyword,
        url: `${bildstodBase}/${p.files.png_500}`,
        slug: p.slug,
        source: 'bildstod' as const,
        score
      });
    }
  }
  
  // Sort by score (best matches first)
  results.sort((a, b) => b.score - a.score);
  return results.map(({ score, ...r }) => r);
}

/**
 * Get a specific bildstöd pictogram by slug.
 */
export async function getBildstodBySlug(slug: string): Promise<BildstodPictogram | null> {
  const data = await loadBildstod();
  return data.pictograms.find(p => p.slug === slug) || null;
}

/**
 * Get bildstöd pictogram image URL.
 */
export function getBildstodUrl(slug: string, format: 'svg' | 'png' = 'png'): string {
  const ext = format === 'svg' ? `${slug}.svg` : `${slug}.png`;
  return `${getBildstodBase()}/pictograms/${ext}`;
}
