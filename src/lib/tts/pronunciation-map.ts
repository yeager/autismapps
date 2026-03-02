/**
 * Swedish pronunciation preprocessing for Web Speech API.
 * Maps English loanwords and tricky Swedish words to phonetic spellings
 * that the Web Speech API Swedish voice can pronounce correctly.
 *
 * Only used for Web Speech API fallback — Piper handles Swedish natively.
 */

// Words mapped to how they should be spelled for Swedish Web Speech API to say them right
const SV_PRONUNCIATION_MAP: Record<string, string> = {
	// ---- Tech / Internet ----
	'wifi': 'wajfaj',
	'bluetooth': 'blåtuth',
	'router': 'rauter',
	'server': 'sörver',
	'browser': 'braoser',
	'app': 'äpp',
	'appar': 'äppar',
	'appen': 'äppen',
	'apparna': 'äpparna',
	'apps': 'äpps',
	'ipad': 'ajpädd',
	'iphone': 'ajfån',
	'tablet': 'täbblett',
	'tableten': 'täbbletten',
	'laptop': 'läptopp',
	'desktop': 'desstopp',
	'streaming': 'strimming',
	'streama': 'strimma',
	'streamar': 'strimmar',
	'online': 'ånnlajn',
	'offline': 'åfflajn',
	'email': 'imejl',
	'google': 'gågell',
	'youtube': 'jåtjubb',
	'instagram': 'innstagramm',
	'tiktok': 'ticktåck',
	'minecraft': 'majnkraft',
	'roblox': 'råblåcks',
	'fortnite': 'fårtnajt',
	'pokemon': 'påkemånn',
	'download': 'daunlådd',
	'login': 'låggin',
	'password': 'pässörd',
	'screenshot': 'skrinshjått',
	'update': 'appdejt',
	'emoji': 'imåji',
	'emojis': 'imåjis',

	// ---- English loanwords (everyday) ----
	'juice': 'jus',
	'smoothie': 'smudi',
	'smoothien': 'smudien',
	'cool': 'kuul',
	'nice': 'najs',
	'crazy': 'krejsi',
	'sorry': 'såri',
	'please': 'pliis',
	'okay': 'åkej',
	'baby': 'bejbi',
	'babyn': 'bejbin',
	'story': 'ståri',
	'stories': 'ståris',
	'game': 'gejm',
	'gamer': 'gejmer',
	'gaming': 'gejming',
	'level': 'levvel',
	'team': 'tiim',
	'match': 'mätch',
	'score': 'skåår',
	'like': 'lajk',
	'likes': 'lajks',
	'share': 'sjäär',
	'chill': 'tsjill',
	'chilla': 'tsjilla',
	'party': 'parti',
	'partyt': 'partit',
	'happy': 'häppi',
	'lunch': 'lönch',
	'brunch': 'brönch',
	'chips': 'tchipps',
	'popcorn': 'poppkårn',
	'sandwich': 'sändvitsch',
	'toast': 'tåst',
	'cake': 'kejk',
	'cupcake': 'kappkejk',
	'cookie': 'kuki',
	'cookies': 'kukis',
	'garage': 'garasj',
	'design': 'dissajn',
	'designa': 'dissajna',
	'check': 'tjeck',
	'checka': 'tjecka',
	'checkar': 'tjeckar',
	'show': 'sjåo',
	'shower': 'sjaoer',
	'shoppa': 'sjåppa',
	'shopping': 'sjåpping',
	'weekend': 'wiikend',
	'feature': 'fiitjer',
	'image': 'immidj',
	'random': 'rändom',
	'basic': 'bejsick',
	'fake': 'fejk',
	'hype': 'hajp',
	'cringe': 'krindj',
	'vintage': 'vinntidj',
	'hoodie': 'huddi',
	'outfit': 'aotfitt',
	'style': 'stajl',
	'selfie': 'selfi',
	'hashtag': 'häsjtägg',
	'influencer': 'influenser',
	'podcast': 'påddkast',
	'trailer': 'trejler',

	// ---- Children's / school context ----
	'timer': 'tajmer',
	'timern': 'tajmern',
	'timeout': 'tajmaot',
	'puzzle': 'passel',
	'memory': 'memmori',

	// ---- Autism / therapy terms ----
	'autism': 'aotism',
	'autismen': 'aotismen',
	'autismspektrum': 'aotismspektrum',
	'autistisk': 'aotistisk',
	'autistiska': 'aotistiska',
	'autistiskt': 'aotistiskt',
	'ARASAAC': 'arrasaak',
	'TEACCH': 'tiitsch',
	'PECS': 'pecks',

	// ---- Music / entertainment ----
	'playlist': 'plejlist',
	'playlisten': 'plejlisten',
	'shuffle': 'sjaffel',
	'pause': 'pååss',
	'volume': 'vollym',
	'speaker': 'spiiker',
	'headset': 'heddsett',
};

// Build a single regex from all keys for fast matching
let cachedRegex: RegExp | null = null;

function getRegex(): RegExp {
	if (!cachedRegex) {
		const keys = Object.keys(SV_PRONUNCIATION_MAP).sort((a, b) => b.length - a.length);
		const escaped = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		cachedRegex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
	}
	return cachedRegex;
}

function transferCase(original: string, replacement: string): string {
	if (original === original.toUpperCase() && original.length > 1) return replacement.toUpperCase();
	if (original[0] === original[0].toUpperCase()) {
		return replacement[0].toUpperCase() + replacement.slice(1);
	}
	return replacement;
}

/**
 * Preprocess text for Web Speech API pronunciation.
 * Only activates for Swedish. Returns text unchanged for other languages.
 */
export function preprocessText(text: string, lang: string): string {
	if (lang !== 'sv') return text;
	const regex = getRegex();
	regex.lastIndex = 0;
	return text.replace(regex, (match) => {
		const key = match.toLowerCase();
		const replacement = SV_PRONUNCIATION_MAP[key];
		if (!replacement) return match;
		return transferCase(match, replacement);
	});
}
