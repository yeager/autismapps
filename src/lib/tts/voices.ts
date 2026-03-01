/**
 * Available Piper TTS voices.
 * Swedish has 3 voices (alma, nst, lisa), English has many more.
 */

export interface VoiceOption {
	id: string;
	name: string;
	lang: string;
	gender: 'female' | 'male' | 'neutral';
	quality: 'low' | 'medium' | 'high';
	/** Size in MB (approximate) */
	sizeMb: number;
	/** Optional description shown in settings */
	description?: string;
}

export const VOICES_SV: VoiceOption[] = [
	{ id: 'sv_SE-alma-medium', name: 'Alma', lang: 'sv', gender: 'female', quality: 'medium', sizeMb: 63, description: 'Alma — kvinnlig röst, tränad för barn med NPF' },
	{ id: 'sv_SE-nst-medium', name: 'Axel', lang: 'sv', gender: 'male', quality: 'medium', sizeMb: 18, description: 'Axel — manlig röst (NST)' },
	{ id: 'sv_SE-lisa-medium', name: 'Lisa', lang: 'sv', gender: 'female', quality: 'medium', sizeMb: 18, description: 'Lisa — kvinnlig röst' },
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
 * Extra PATH_MAP entries not in the npm package.
 * These get injected into PATH_MAP at runtime so the library
 * recognizes these voice IDs for caching/stored() checks.
 */
export const EXTRA_PATH_MAP: Record<string, string> = {
	'sv_SE-lisa-medium': 'sv/sv_SE/lisa/medium/sv_SE-lisa-medium.onnx',
	'sv_SE-alma-medium': 'sv/sv_SE/alma/medium/sv_SE-alma-medium.onnx',
};

/**
 * Voices hosted on a different HuggingFace repo than the default
 * diffusionstudio/piper-voices. Maps voice ID to base URL.
 * The library's download() won't work for these — we handle them
 * with a custom download in index.ts.
 */
export const CUSTOM_VOICE_URLS: Record<string, { model: string; config: string }> = {
	'sv_SE-alma-medium': {
		model: 'https://huggingface.co/yeagersthlm/piper-voice-sv-alma/resolve/main/sv_SE-alma-medium.onnx',
		config: 'https://huggingface.co/yeagersthlm/piper-voice-sv-alma/resolve/main/sv_SE-alma-medium.onnx.json',
	},
	'sv_SE-lisa-medium': {
		model: 'https://huggingface.co/rhasspy/piper-voices/resolve/main/sv/sv_SE/lisa/medium/sv_SE-lisa-medium.onnx',
		config: 'https://huggingface.co/rhasspy/piper-voices/resolve/main/sv/sv_SE/lisa/medium/sv_SE-lisa-medium.onnx.json',
	},
};
