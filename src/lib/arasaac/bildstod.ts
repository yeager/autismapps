/**
 * Bildstöd — Local Swedish pictogram service.
 * Provides Swedish/Nordic and NPF-specific pictograms not available in ARASAAC.
 * Hosted at autismappar.se/bildstod
 */

import { base } from '$app/paths';

const BILDSTOD_API = 'https://autismappar.se/bildstod/api/pictograms.json';
const BILDSTOD_BASE = 'https://autismappar.se/bildstod';

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

let cache: BildstodData | null = null;

/**
 * Load the bildstöd pictogram catalog.
 * Tries local base path first (for offline/PWA), falls back to remote.
 */
export async function loadBildstod(): Promise<BildstodData> {
  if (cache) return cache;
  
  // Try local copy first (bundled in build)
  try {
    const res = await fetch(`${base}/bildstod/pictograms.json`);
    if (res.ok) {
      cache = await res.json();
      return cache!;
    }
  } catch {}
  
  // Fallback to remote API
  try {
    const res = await fetch(BILDSTOD_API);
    if (res.ok) {
      cache = await res.json();
      return cache!;
    }
  } catch {}
  
  cache = { version: '0.0.0', pictograms: [], categories: [] };
  return cache;
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
  const q = query.toLowerCase().trim();
  
  if (!q) return [];
  
  const results: { id: number; keyword: string; url: string; slug: string; source: 'bildstod'; score: number }[] = [];
  
  for (const p of data.pictograms) {
    let score = 0;
    let matchedKeyword = '';
    
    // Check Swedish keywords
    for (const kw of p.keywords.sv) {
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
      for (const kw of p.keywords.en) {
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
      const allMeta = [...p.categories, ...p.tags, p.slug].join(' ').toLowerCase();
      if (allMeta.includes(q)) {
        score = 20;
        matchedKeyword = p.keywords.sv[0];
      }
    }
    
    if (score > 0) {
      results.push({
        id: p.id + 900000, // Offset to avoid ARASAAC ID collision
        keyword: matchedKeyword,
        url: `${BILDSTOD_BASE}/${p.files.png_500}`,
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
  return `${BILDSTOD_BASE}/pictograms/${ext}`;
}
