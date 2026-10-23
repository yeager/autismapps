import { normalizePictogramKeyword } from '../arasaac/search-normalize.js';
import { PIKTALI_MANIFEST_REVISION, piktaliManifestUrl } from './manifest-url.js';

export { PIKTALI_MANIFEST_REVISION, piktaliManifestUrl } from './manifest-url.js';

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

export function isBoardBuilderSearchTerm(query: string): boolean {
	return boardBuilderTerms.has(normalizePictogramKeyword(query));
}

/** Return the bundled communication-board symbol without fetching the catalog. */
export function boardBuilderSearchResult(
	query: string,
	locale: string,
	basePath: string
): PiktaliSearchResult[] {
	if (!isBoardBuilderSearchTerm(query)) return [];
	const base = basePath.replace(/\/$/, '');
	const url = `${base}/piktali-pictograms/assets/communication-board.svg`;
	return [{
		// Reserve a low, stable ID outside the manifest's sequential range.
		id: -2_000_000_000,
		keyword: locale === 'sv' ? 'Kommunikationskarta' : 'Communication board',
		url,
		urlBW: url
	}];
}

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

	const isBoardBuilder = isBoardBuilderSearchTerm(query);
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
