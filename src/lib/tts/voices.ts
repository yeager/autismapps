/**
 * Available Piper TTS voices.
 * Swedish has 2 voices (nst, lisa), English has many more.
 */

export interface VoiceOption {
	id: string;
	name: string;
	lang: string;
	gender: 'female' | 'male' | 'neutral';
	quality: 'low' | 'medium' | 'high';
	/** Size in MB (approximate) */
	sizeMb: number;
}

export const VOICES_SV: VoiceOption[] = [
	{ id: 'sv_SE-nst-medium', name: 'NST', lang: 'sv', gender: 'female', quality: 'medium', sizeMb: 18 },
	{ id: 'sv_SE-lisa-medium', name: 'Lisa', lang: 'sv', gender: 'female', quality: 'medium', sizeMb: 18 },
];

export const VOICES_EN: VoiceOption[] = [
	{ id: 'en_US-hfc_female-medium', name: 'HFC Female', lang: 'en', gender: 'female', quality: 'medium', sizeMb: 18 },
	{ id: 'en_US-hfc_male-medium', name: 'HFC Male', lang: 'en', gender: 'male', quality: 'medium', sizeMb: 18 },
	{ id: 'en_US-amy-medium', name: 'Amy', lang: 'en', gender: 'female', quality: 'medium', sizeMb: 18 },
	{ id: 'en_US-joe-medium', name: 'Joe', lang: 'en', gender: 'male', quality: 'medium', sizeMb: 18 },
	{ id: 'en_US-lessac-medium', name: 'Lessac', lang: 'en', gender: 'female', quality: 'medium', sizeMb: 18 },
	{ id: 'en_US-kristin-medium', name: 'Kristin', lang: 'en', gender: 'female', quality: 'medium', sizeMb: 18 },
	{ id: 'en_US-danny-low', name: 'Danny (light)', lang: 'en', gender: 'male', quality: 'low', sizeMb: 6 },
	{ id: 'en_US-lessac-high', name: 'Lessac (HD)', lang: 'en', gender: 'female', quality: 'high', sizeMb: 30 },
];

export function voicesForLang(lang: string): VoiceOption[] {
	if (lang === 'sv') return VOICES_SV;
	return VOICES_EN;
}

/**
 * Extra PATH_MAP entries not in the npm package (e.g., Lisa).
 * These get injected into PATH_MAP at runtime.
 */
export const EXTRA_PATH_MAP: Record<string, string> = {
	'sv_SE-lisa-medium': 'sv/sv_SE/lisa/medium/sv_SE-lisa-medium.onnx',
};
