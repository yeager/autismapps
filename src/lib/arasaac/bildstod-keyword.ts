interface BildstodKeywords {
	sv: string[];
	en: string[];
}

interface BildstodKeywordSource {
	keywords: BildstodKeywords;
}

/** Keep result labels in the interface language, even when the other
 * language's keyword matched the query. Preserve a matched localized synonym. */
export function localizedBildstodKeyword(
	pictogram: BildstodKeywordSource,
	lang: string,
	matchedKeyword: string
): string {
	const preferred = lang === 'sv' ? pictogram.keywords.sv : pictogram.keywords.en;
	if (preferred?.some((keyword) => keyword.toLocaleLowerCase() === matchedKeyword.toLocaleLowerCase())) {
		return matchedKeyword;
	}
	return preferred?.[0] || matchedKeyword;
}
