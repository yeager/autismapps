/**
 * Human-reviewed Swedish corrections for ambiguous or mistranslated ARASAAC
 * catalog aliases. The JSON lookup remains the upstream/export snapshot.
 */
export const SWEDISH_LOOKUP_OVERRIDES = Object.freeze({
	'passenger vehicle': { sv: 'buss', id: 2262 },
	coach: { sv: 'buss', id: 2262 },
	tambourine: { sv: 'tamburin', id: 2495 },
	trainers: { sv: 'träningsskor', id: 2621 },
	buttock: { sv: 'skinka', id: 2730 },
	backside: { sv: 'bakdel', id: 2730 },
	bum: { sv: 'rumpa', id: 2730 },
	back: { sv: 'rygg', id: 2748 },
	plant: { sv: 'plantera', id: 2828 },
	set: { sv: 'plantera', id: 2828 },
	'round table': { sv: 'runt bord', id: 2917 },
	bow: { sv: 'rosett', id: 2946 },
	knot: { sv: 'rosett', id: 2946 },
	present: { sv: 'gåva', id: 3149 },
	'people carrier': { sv: 'minibuss', id: 3206 },
	cleaner: { sv: 'städare', id: 3238 },
	content: { sv: 'nöjd', id: 3245 },
	model: { sv: 'modellera', id: 3283 },
	mould: { sv: 'modellera', id: 3283 },
	mold: { sv: 'modellera', id: 3283 },
	'wall plug': { sv: 'väggplugg', id: 3390 },
	'plastic dowel': { sv: 'plastplugg', id: 3390 },
	'screw anchor': { sv: 'expansionsplugg', id: 3390 },
	rawlplug: { sv: 'rawlplugg', id: 3390 },
	canteen: { sv: 'fältflaska', id: 4587 },
	chilly: null,
	call: { sv: 'ropa', id: 4686 },
	dumb: { sv: 'stum', id: 4702 },
	pipe: { sv: 'pipa', id: 4722 },
	'tobacco pipe': { sv: 'tobakspipa', id: 4722 },
	sunshade: { sv: 'parasoll', id: 4746 },
	blow: { sv: 'blåsa', id: 4747 },
	sandcastle: { sv: 'sandslott', id: 4790 }
});

/**
 * Apply reviewed corrections without mutating the imported catalog snapshot.
 * @param {Record<string, { sv: string, id: number }>} lookup
 * @returns {Record<string, { sv: string, id: number }>} corrected
 */
export function applySwedishLookupOverrides(lookup) {
	const corrected = { ...lookup };
	for (const [alias, value] of Object.entries(SWEDISH_LOOKUP_OVERRIDES)) {
		if (value === null) delete corrected[alias];
		else corrected[alias] = value;
	}
	return corrected;
}
