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

/** Search the bilingual local catalog, preferring the interface language.
 * @param {Record<string, {sv: string, id: number}>} lookup
 * @param {string} query
 * @param {string} [locale]
 * @param {number} [limit]
 */
export function searchPictogramLookup(lookup, query, locale = 'en', limit = 50) {
	const isSwedish = locale === 'sv' || locale === '';
	const fields = isSwedish ? ['sv', 'en'] : ['en', 'sv'];
	const seenIds = new Set();
	const matches = [];
	for (const exact of [true, false]) {
		for (const field of fields) {
			for (const [en, entry] of Object.entries(lookup)) {
				if (!entry?.id || seenIds.has(entry.id)) continue;
				// Searching for the Swedish animal "hund" should not also return
				// the unrelated number "hundra" / "hundred" and its compounds.
				if (normalizePictogramKeyword(query) === 'hund' && (
					/\bhundred\b/.test(normalizePictogramKeyword(en))
					|| /hundra$/.test(normalizePictogramKeyword(entry.sv || ''))
				)) continue;
				const label = field === 'sv' ? entry.sv : en;
				if (!label || !matchesPictogramKeyword(label, query, exact)) continue;
				seenIds.add(entry.id);
				matches.push({
					id: entry.id,
					keyword: isSwedish ? entry.sv : en,
					exact
				});
				if (matches.length >= limit) return matches;
			}
		}
	}
	return matches;
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

/**
 * Map app names to useful pictogram concepts when users search by the tool name.
 * @param {string} value
 * @param {string} locale
 * @returns {string}
 */
export function resolvePictogramSearchTerm(value, locale = 'en') {
	const query = String(value).trim();
	if (!boardBuilderTerms.has(normalizePictogramKeyword(query))) return query;
	// The app name is not a pictogram concept. Searching for "tavla" returns
	// unrelated classroom objects; use the actual communication-board label.
	return locale === 'sv' ? 'kommunikationskarta' : 'communication board';
}
