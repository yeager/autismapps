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

const boardBuilderTerms = new Set([
	'bradbyggare',
	'bradbyggaren',
	'tavlbyggare',
	'tavlbyggaren',
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
	const matches = pictograms.flatMap((pictogram, index) => {
		const localizedLabel = locale === 'sv'
			? pictogram.labels['sv-SE'] || pictogram.labels['en-US']
			: pictogram.labels['en-US'] || pictogram.labels['sv-SE'];
		const label = normalizePictogramKeyword(localizedLabel || '');
		const symbol = normalizePictogramKeyword(pictogram.symbol.replaceAll('-', ' '));

		let score: number;
		if (isBoardBuilder) {
			if (pictogram.symbol !== 'communication-board') return [];
			score = 0;
		} else if (label === normalizedQuery || symbol === normalizedQuery) {
			score = 0;
		} else if (label.startsWith(normalizedQuery) || symbol.startsWith(normalizedQuery)) {
			score = 1;
		} else if (label.includes(normalizedQuery) || symbol.includes(normalizedQuery)) {
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
