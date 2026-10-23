import { normalizePictogramKeyword } from '../arasaac/search-normalize.js';

export interface PiktaliManifestPictogram {
	id: string;
	symbol: string;
	labels: Record<string, string>;
	file: string;
}

export interface PiktaliSearchResult {
	id: number;
	keyword: string;
	url: string;
	urlBW: string;
}

// Bump when the Piktali manifest changes so service workers and host caches
// cannot keep returning a catalog from an older deployment.
export const PIKTALI_MANIFEST_REVISION = '2026-10-23-board-builder-search-1';

export function piktaliManifestUrl(basePath: string): string {
	const base = basePath.replace(/\/$/, '');
	return `${base}/piktali-pictograms/manifest.json?v=${PIKTALI_MANIFEST_REVISION}`;
}

/** Match common Swedish inflections to a catalog's singular label. */
function swedishSearchForms(value: string): string[] {
	const forms = [value];
	for (const suffix of ['arna', 'erna', 'orna', 'ar', 'er', 'or', 'en', 'et', 'an', 'na', 'ne', 's']) {
		if (value.endsWith(suffix) && value.length - suffix.length >= 3) {
			forms.push(value.slice(0, -suffix.length));
		}
	}
	return [...new Set(forms)];
}

const boardBuilderTerms = new Set([
	'bradbyggare',
	'bradbyggaren',
	'bradbyggarens',
	'bradbyggarens sokning',
	'bradbyggaren sokning',
	'tavlbyggare',
	'tavlbyggaren',
	'tavlbyggarens',
	'board builder',
	'board builders',
	'boardbuilder'
]);

/** Match local Piktali symbols by localized label or stable symbol name. */
export function matchPiktaliPictograms(
	pictograms: PiktaliManifestPictogram[],
	query: string,
	locale: string,
	basePath: string,
	limit = 30
): PiktaliSearchResult[] {
	const normalizedQuery = normalizePictogramKeyword(query);
	if (!normalizedQuery) return [];

	const isBoardBuilder = boardBuilderTerms.has(normalizedQuery);
	const searchForms = swedishSearchForms(normalizedQuery);
	const matches = pictograms.flatMap((pictogram, index) => {
		const localizedLabel = locale === 'sv'
			? pictogram.labels['sv-SE'] || pictogram.labels['en-US']
			: pictogram.labels['en-US'] || pictogram.labels['sv-SE'];
		const searchableLabels = [...new Set([
			pictogram.labels['sv-SE'],
			pictogram.labels['en-US'],
			pictogram.labels['es-ES'],
			pictogram.labels['es-MX']
		].filter((value): value is string => Boolean(value)))].map(normalizePictogramKeyword);
		const symbol = normalizePictogramKeyword(pictogram.symbol.replaceAll('-', ' '));
		const matchingLabel = searchableLabels.find((label) =>
			searchForms.some((form) => form === label || label.startsWith(form) || label.includes(form))
		);

		let score: number;
		if (isBoardBuilder) {
			if (pictogram.symbol !== 'communication-board') return [];
			score = 0;
		} else if (matchingLabel && searchForms.some((form) => form === matchingLabel)) {
			score = 0;
		} else if (matchingLabel || symbol === normalizedQuery) {
			score = 1;
		} else if (searchableLabels.some((label) => label.startsWith(normalizedQuery)) || symbol.startsWith(normalizedQuery)) {
			score = 1;
		} else if (searchableLabels.some((label) => label.includes(normalizedQuery)) || symbol.includes(normalizedQuery)) {
			score = 2;
		} else {
			return [];
		}

		const url = `${basePath}/piktali-pictograms/${pictogram.file}`;
		return [{
			score,
			index,
			result: {
				// BoardCell stores a numeric pictogram ID. Negative IDs keep local
				// Piktali entries separate from ARASAAC's positive IDs.
				id: -(index + 1),
				keyword: localizedLabel || pictogram.symbol,
				url,
				urlBW: url
			}
		}];
	});

	return matches
		.sort((a, b) => a.score - b.score || a.index - b.index)
		.slice(0, limit)
		.map(({ result }) => result);
}
