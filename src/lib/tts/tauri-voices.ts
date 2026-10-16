/**
 * Tauri-specific voice loading — serves bundled voice files
 * from Tauri resources instead of downloading from HuggingFace.
 */

let _isTauri: boolean | null = null;

export function isTauri(): boolean {
	if (_isTauri !== null) return _isTauri;
	try {
		_isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
	} catch {
		_isTauri = false;
	}
	return _isTauri;
}

/**
 * Get local URL for a bundled voice resource file.
 * Returns null if not running in Tauri or file not bundled.
 */
export async function getLocalVoiceUrl(filename: string): Promise<string | null> {
	if (!isTauri()) return null;
	try {
		const { resolveResource } = await import('@tauri-apps/api/path');
		const { convertFileSrc } = await import('@tauri-apps/api/core');
		const resourcePath = await resolveResource(`voices/${filename}`);
		return convertFileSrc(resourcePath);
	} catch (e) {
		console.warn('[TTS/Tauri] Failed to resolve local voice:', e);
		return null;
	}
}

/** Voice files bundled in the Tauri app (default voice of each locale; see build-native.yml) */
export const BUNDLED_VOICES: Record<string, { model: string; config: string }> = {
	'sv_SE-alma-medium': {
		model: 'sv_SE-alma-medium.onnx',
		config: 'sv_SE-alma-medium.onnx.json',
	},
	'pt_BR-cadu-medium': {
		model: 'pt_BR-cadu-medium.onnx',
		config: 'pt_BR-cadu-medium.onnx.json',
	},
};
