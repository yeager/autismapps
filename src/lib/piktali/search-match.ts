import { normalizePictogramKeyword } from '../arasaac/search-normalize.js';
import { PIKTALI_MANIFEST_REVISION, piktaliManifestUrls } from './manifest-url.js';

export { PIKTALI_MANIFEST_REVISION, piktaliManifestUrl, piktaliManifestUrls } from './manifest-url.js';

export interface PiktaliManifestPictogram {
	id: string;
	symbol: string;
	labels: Record<string, string>;
	file: string;
	pictogramStatus?: string;
	review?: {
		translation?: string;
		aacUsability?: string;
		pictogram?: string;
		commercialRights?: string;
	};
}

/** Only expose Piktali entries whose labels, AAC usefulness and pictogram are approved. */
export function isApprovedPiktaliPictogram(pictogram: PiktaliManifestPictogram): boolean {
	return pictogram.pictogramStatus === 'approved'
		&& pictogram.review?.translation === 'approved'
		&& pictogram.review?.aacUsability === 'approved'
		&& pictogram.review?.pictogram === 'approved'
		&& pictogram.review?.commercialRights === 'approved';
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
		if (!isApprovedPiktaliPictogram(pictogram)) return [];
		const localizedLabel = locale === 'sv'
			? pictogram.labels['sv-SE'] || pictogram.labels['en-US']
			: pictogram.labels['en-US'] || pictogram.labels['sv-SE'];
		const localizedSearchLabel = normalizePictogramKeyword(localizedLabel || '');
		const exactLabels = [...new Set([
			pictogram.labels['sv-SE'],
			pictogram.labels['en-US'],
			pictogram.labels['es-ES'],
			pictogram.labels['es-MX']
		].filter((value): value is string => Boolean(value)))].map(normalizePictogramKeyword);
		const symbol = normalizePictogramKeyword(pictogram.symbol.replaceAll('-', ' '));
		const hasExactLabel = exactLabels.some((label) => searchForms.includes(label));
		const matchesLocalizedPrefix = searchForms.some((form) => localizedSearchLabel.startsWith(form));
		const localizedWords = localizedSearchLabel.split(/\s+/);
		const matchesLocalizedWordPrefix = searchForms.some((form) => localizedWords.some((word) => word.startsWith(form)));
		const matchesSymbolPrefix = symbol.split(' ').some((word) => word.startsWith(normalizedQuery));
		const isNumberSymbol = /^number\d+$/.test(pictogram.symbol);

		let score: number;
		if (isBoardBuilder) {
			if (pictogram.symbol !== 'communication-board') return [];
			score = 0;
		} else if (hasExactLabel || symbol === normalizedQuery) {
			score = 0;
		} else if (!isNumberSymbol && (matchesLocalizedPrefix || matchesSymbolPrefix)) {
			score = 1;
		} else if (!isNumberSymbol && matchesLocalizedWordPrefix) {
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
