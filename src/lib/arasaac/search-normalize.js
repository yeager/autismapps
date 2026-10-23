/** Normalize ARASAAC labels so accent marks do not prevent exact keyword matches. */
/** @param {string} value */
export function normalizePictogramKeyword(value) {
	return String(value)
		.normalize('NFKC')
		.toLocaleLowerCase('en')
		.trim()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
}

/** Compare labels and queries with the same accent/case normalization. */
/** @param {string} label @param {string} query @param {boolean} [exact] */
export function matchesPictogramKeyword(label, query, exact = false) {
	const normalizedLabel = normalizePictogramKeyword(label);
	const normalizedQuery = normalizePictogramKeyword(query);
	return exact ? normalizedLabel === normalizedQuery : normalizedLabel.includes(normalizedQuery);
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

/**
 * Map app names to useful pictogram concepts when users search by the tool name.
 * @param {string} value
 * @param {string} locale
 * @returns {string}
 */
export function resolvePictogramSearchTerm(value, locale = 'en') {
	const query = String(value).trim();
	if (!boardBuilderTerms.has(normalizePictogramKeyword(query))) return query;
	return locale === 'sv' ? 'tavla' : 'board';
}
