/**
 * TAKK — Tecken som Alternativ och Kompletterande Kommunikation
 * (Signs as Alternative and Augmentative Communication)
 *
 * Swedish method combining signs with spoken language.
 * Key principles:
 * - Sign the KEY WORDS in a sentence (not every word)
 * - Always speak while signing (bimodal)
 * - Slows down speech naturally → better comprehension
 * - Visual + motor + auditory = multisensory learning
 *
 * Since sign images are copyrighted (SPSM/SU), we:
 * 1. Link to teckensprakslexikon.su.se for video demos
 * 2. Provide text descriptions of hand movements
 * 3. Use emoji hand shapes as visual cues
 */

export interface TakkSign {
	/** Swedish word */
	word: string;
	/** Emoji representing the hand shape */
	handEmoji: string;
	/** Short description of how to make the sign */
	description: string;
	/** URL to the official sign video (Stockholms universitet) */
	videoUrl: string;
}

/**
 * Core TAKK vocabulary — the most common/useful signs for AAC.
 * Based on the ~400 signs taught in TAKK courses (Habilitering & Hälsa).
 * Descriptions are simplified for parents/caregivers.
 */
export const TAKK_SIGNS: Record<string, TakkSign> = {
	// Core words (kärnord)
	'ja': { word: 'ja', handEmoji: '✊', description: 'takk.sign.ja', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=ja' },
	'nej': { word: 'nej', handEmoji: '🤚', description: 'takk.sign.nej', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=nej' },
	'mer': { word: 'mer', handEmoji: '🤏', description: 'takk.sign.mer', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=mer' },
	'slut': { word: 'slut', handEmoji: '🙌', description: 'takk.sign.slut', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=slut' },
	'hjälp': { word: 'hjälp', handEmoji: '🤲', description: 'takk.sign.hjalp', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=hjälp' },
	'vill': { word: 'vill', handEmoji: '☝️', description: 'takk.sign.vill', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=vill' },
	'inte': { word: 'inte', handEmoji: '🖐️', description: 'takk.sign.inte', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=inte' },
	'jag': { word: 'jag', handEmoji: '👆', description: 'takk.sign.jag', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=jag' },
	'du': { word: 'du', handEmoji: '👉', description: 'takk.sign.du', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=du' },
	'var': { word: 'var', handEmoji: '🤷', description: 'takk.sign.var', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=var' },
	'vad': { word: 'vad', handEmoji: '🤔', description: 'takk.sign.vad', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=vad' },

	// Verbs (verben)
	'äta': { word: 'äta', handEmoji: '🤏', description: 'takk.sign.ata', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=äta' },
	'dricka': { word: 'dricka', handEmoji: '🤙', description: 'takk.sign.dricka', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=dricka' },
	'sova': { word: 'sova', handEmoji: '😴', description: 'takk.sign.sova', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=sova' },
	'gå': { word: 'gå', handEmoji: '🚶', description: 'takk.sign.ga', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=gå' },
	'leka': { word: 'leka', handEmoji: '🤟', description: 'takk.sign.leka', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=leka' },
	'titta': { word: 'titta', handEmoji: '👀', description: 'takk.sign.titta', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=titta' },
	'läsa': { word: 'läsa', handEmoji: '📖', description: 'takk.sign.lasa', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=läsa' },

	// Feelings (känslor)
	'glad': { word: 'glad', handEmoji: '😊', description: 'takk.sign.glad', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=glad' },
	'ledsen': { word: 'ledsen', handEmoji: '😢', description: 'takk.sign.ledsen', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=ledsen' },
	'arg': { word: 'arg', handEmoji: '😡', description: 'takk.sign.arg', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=arg' },
	'rädd': { word: 'rädd', handEmoji: '😰', description: 'takk.sign.radd', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=rädd' },
	'trött': { word: 'trött', handEmoji: '😴', description: 'takk.sign.trott', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=trött' },

	// Daily life
	'toalett': { word: 'toalett', handEmoji: '🚽', description: 'takk.sign.toalett', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=toalett' },
	'mat': { word: 'mat', handEmoji: '🍽️', description: 'takk.sign.mat', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=mat' },
	'vatten': { word: 'vatten', handEmoji: '💧', description: 'takk.sign.vatten', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=vatten' },
	'hem': { word: 'hem', handEmoji: '🏠', description: 'takk.sign.hem', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=hem' },
	'skola': { word: 'skola', handEmoji: '🏫', description: 'takk.sign.skola', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=skola' },

	// Animals
	'hund': { word: 'hund', handEmoji: '🐕', description: 'takk.sign.hund', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=hund' },
	'katt': { word: 'katt', handEmoji: '🐈', description: 'takk.sign.katt', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=katt' },

	// People
	'mamma': { word: 'mamma', handEmoji: '👩', description: 'takk.sign.mamma', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=mamma' },
	'pappa': { word: 'pappa', handEmoji: '👨', description: 'takk.sign.pappa', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=pappa' },
	'kompis': { word: 'kompis', handEmoji: '🤝', description: 'takk.sign.kompis', videoUrl: 'https://teckensprakslexikon.su.se/sok?q=kompis' },
};

/**
 * Look up a TAKK sign for a Swedish word.
 */
export function getTakkSign(word: string): TakkSign | undefined {
	return TAKK_SIGNS[word.toLowerCase()];
}

/**
 * Check if a word has a TAKK sign in our vocabulary.
 */
export function hasTakkSign(word: string): boolean {
	return word.toLowerCase() in TAKK_SIGNS;
}

/**
 * Open the official sign video in a new tab.
 */
export function openSignVideo(word: string): void {
	const sign = getTakkSign(word);
	const url = sign?.videoUrl || `https://teckensprakslexikon.su.se/sok?q=${encodeURIComponent(word)}`;
	window.open(url, '_blank', 'noopener');
}

/**
 * Get all available TAKK signs as an array.
 */
export function getAllSigns(): TakkSign[] {
	return Object.values(TAKK_SIGNS);
}
