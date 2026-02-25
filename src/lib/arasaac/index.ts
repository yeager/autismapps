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
  const locale = lang === 'sv' ? 'sv' : 'en';
  try {
    const res = await fetch(`${API_BASE}/pictograms/${locale}/search/${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data: Pictogram[] = await res.json();
    return data.slice(0, 50).map((p) => ({
      id: p._id,
      keyword: p.keywords[0]?.keyword || query,
      url: getPictogramUrl(p._id, false),
      urlBW: getPictogramUrl(p._id, true)
    }));
  } catch {
    return [];
  }
}

export function getPictogramUrl(
  id: number,
  bw: boolean = false,
  size: number = 300
): string {
  const base = `${API_BASE}/pictograms/${id}`;
  const params = new URLSearchParams();
  if (bw) params.set('color', 'false');
  if (size !== 300) params.set('resolution', String(size));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
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
