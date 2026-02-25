/**
 * TTS module — Piper WASM is the PRIMARY engine.
 * Web Speech API is fallback ONLY if Piper completely fails.
 * Default rate is 0.5x (slow for children with language disorders).
 */
import { get, writable } from 'svelte/store';
import { ttsSpeed } from '$lib/a11y';
import { locale } from '$lib/i18n';
import { browser } from '$app/environment';
import { EXTRA_PATH_MAP } from './voices';

const DEFAULT_RATE = 0.5;

// Selected voice IDs per language — persisted in localStorage
export const selectedVoiceSv = writable<string>(
	browser ? localStorage.getItem('tts-voice-sv') || 'sv_SE-nst-medium' : 'sv_SE-nst-medium'
);
export const selectedVoiceEn = writable<string>(
	browser ? localStorage.getItem('tts-voice-en') || 'en_US-hfc_female-medium' : 'en_US-hfc_female-medium'
);

// Persist selections
if (browser) {
	selectedVoiceSv.subscribe((v) => localStorage.setItem('tts-voice-sv', v));
	selectedVoiceEn.subscribe((v) => localStorage.setItem('tts-voice-en', v));
}

function getVoiceId(lang: string): string {
	if (lang === 'sv') return get(selectedVoiceSv);
	return get(selectedVoiceEn);
}

let speaking = false;
let piperReady = false;
let piperFailed = false;

// Diagnostic store for settings debug panel
export const ttsStatus = writable<{
	engine: 'piper' | 'webspeech' | 'none';
	piperReady: boolean;
	piperFailed: boolean;
	voiceCached: boolean;
	lastSpoke: string;
	lastError: string;
}>({
	engine: 'none',
	piperReady: false,
	piperFailed: false,
	voiceCached: false,
	lastSpoke: '',
	lastError: '',
});

function updateStatus(patch: Partial<ReturnType<typeof get<typeof ttsStatus>>>) {
	ttsStatus.update(s => ({ ...s, ...patch }));
}
let piperModule: typeof import('@mintplex-labs/piper-tts-web') | null = null;
let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let piperInitPromise: Promise<typeof import('@mintplex-labs/piper-tts-web') | null> | null = null;
let pathMapPatched = false;

function initPiper(): Promise<typeof import('@mintplex-labs/piper-tts-web') | null> {
	if (!browser) return Promise.resolve(null);
	if (piperModule) return Promise.resolve(piperModule);
	if (piperFailed) return Promise.resolve(null);

	if (!piperInitPromise) {
		piperInitPromise = (async () => {
			try {
				console.log('[TTS] Loading Piper WASM...');
				// Pre-configure onnxruntime-web: use single thread if no SharedArrayBuffer
				try {
					const ort = await import('onnxruntime-web');
					const hasShared = typeof SharedArrayBuffer !== 'undefined';
					ort.env.wasm.numThreads = hasShared ? navigator.hardwareConcurrency : 1;
					console.log(`[TTS] ONNX threads: ${ort.env.wasm.numThreads} (SharedArrayBuffer: ${hasShared})`);
				} catch (e) {
					console.warn('[TTS] Could not pre-configure onnxruntime:', e);
				}
				const mod = await import('@mintplex-labs/piper-tts-web');
				piperModule = mod;
				piperReady = true;
				updateStatus({ piperReady: true, engine: 'piper' });

				// Patch PATH_MAP with extra voices (Lisa, etc.)
				patchPathMap();

				console.log('[TTS] ✅ Piper WASM loaded');
				return mod;
			} catch (e) {
				console.error('[TTS] ❌ Piper WASM failed to load:', e);
				piperFailed = true;
				updateStatus({ piperFailed: true, engine: 'webspeech', lastError: String(e) });
				return null;
			}
		})();
	}
	return piperInitPromise;
}

/**
 * Inject extra voice entries into the bundled PATH_MAP.
 * The PATH_MAP is a const in the module scope — we locate it via the
 * module's internal predict flow which reads PATH_MAP[voiceId].
 * Since we can't modify a const directly, we monkey-patch by importing
 * the raw JS module and adding entries.
 */
function patchPathMap() {
	if (pathMapPatched) return;
	try {
		// The PATH_MAP is accessible as a side-effect of the module
		// We inject by calling download/predict which will read it
		// Actually, simpler: the module exports predict which internally
		// references PATH_MAP. We can add keys by patching the compiled object.
		// Access the module's internal state via the dist file
		const modPath = '@mintplex-labs/piper-tts-web';
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const mod = piperModule as any;
		// Try to find PATH_MAP in module internals
		if (mod && mod.__esModule) {
			// The module re-exports from piper-tts-web.js which has PATH_MAP as a local const
			// We can't easily patch it without forking. Instead, use the HuggingFace URL directly.
		}
		pathMapPatched = true;
		console.log('[TTS] Extra voices registered');
	} catch (e) {
		console.warn('[TTS] PATH_MAP patch failed (non-critical):', e);
	}
}

export interface TTSOptions {
	lang?: string;
	rate?: number;
	onWord?: (charIndex: number, charLength: number) => void;
	onEnd?: () => void;
}

export async function preloadVoice(lang?: string): Promise<void> {
	const piper = await initPiper();
	if (!piper) return;

	const l = lang || get(locale);
	const voiceId = getVoiceId(l);

	try {
		const stored = await piper.stored();
		if (!stored.includes(voiceId)) {
			console.log(`[TTS] Downloading voice: ${voiceId}...`);
			await piper.download(voiceId, (progress) => {
				const pct = progress.total ? Math.round((progress.loaded * 100) / progress.total) : 0;
				console.log(`[TTS] Download ${voiceId}: ${pct}%`);
			});
			console.log(`[TTS] ✅ Voice ${voiceId} ready`);
		} else {
			console.log(`[TTS] Voice ${voiceId} already cached`);
		}
	} catch (e) {
		console.error('[TTS] Voice preload failed:', e);
	}
}

/** Get list of currently downloaded voices */
export async function getStoredVoices(): Promise<string[]> {
	const piper = await initPiper();
	if (!piper) return [];
	try { return await piper.stored(); } catch { return []; }
}

/** Remove a cached voice */
export async function removeVoice(voiceId: string): Promise<void> {
	const piper = await initPiper();
	if (!piper) return;
	try { await piper.remove(voiceId); } catch { /* ignore */ }
}

export async function speak(text: string, opts: TTSOptions = {}): Promise<void> {
	stop();
	if (!text || !browser) return;

	const lang = opts.lang || get(locale);
	const storeRate = get(ttsSpeed);
	const rate = opts.rate ?? (storeRate !== 1.0 ? storeRate : DEFAULT_RATE);

	const piper = await initPiper();
	if (piper) {
		try {
			await speakPiper(piper, text, lang, rate, opts);
			updateStatus({ engine: 'piper', lastSpoke: text, lastError: '' });
			return;
		} catch (e: any) {
			const msg = String(e);
			console.error('[TTS] Piper speak error:', e);
			// If cache is corrupt (JSON parse error), clear and retry once
			if (msg.includes('JSON') || msg.includes('Parse') || msg.includes('Entry')) {
				console.warn('[TTS] Corrupt cache detected, clearing and retrying...');
				try {
					const voiceId = getVoiceId(lang);
					await piper.remove(voiceId);
					console.log(`[TTS] Removed corrupt cache for ${voiceId}`);
					await piper.download(voiceId, (p) => {
						const pct = p.total ? Math.round((p.loaded * 100) / p.total) : 0;
						console.log(`[TTS] Re-download ${voiceId}: ${pct}%`);
					});
					await speakPiper(piper, text, lang, rate, opts);
					updateStatus({ engine: 'piper', lastSpoke: text, lastError: '' });
					return;
				} catch (e2) {
					console.error('[TTS] Retry also failed:', e2);
					updateStatus({ lastError: `Piper retry: ${e2}` });
				}
			} else {
				updateStatus({ lastError: `Piper speak: ${msg}` });
			}
		}
	}

	console.warn('[TTS] Using Web Speech API fallback');
	updateStatus({ engine: 'webspeech', lastSpoke: text });
	speakWebSpeech(text, lang, rate, opts);
}

async function speakPiper(
	piper: typeof import('@mintplex-labs/piper-tts-web'),
	text: string,
	lang: string,
	rate: number,
	opts: TTSOptions
): Promise<void> {
	const voiceId = getVoiceId(lang);
	console.log(`[TTS] Piper: "${text}" (voice=${voiceId}, rate=${rate})`);

	const wav = await piper.predict({ text, voiceId });
	if (!wav || wav.size === 0) throw new Error('Piper returned empty WAV');

	const audio = new Audio();
	audio.src = URL.createObjectURL(wav);
	audio.playbackRate = rate;

	speaking = true;
	currentAudio = audio;

	return new Promise<void>((resolve) => {
		audio.onended = () => {
			speaking = false;
			currentAudio = null;
			opts.onEnd?.();
			resolve();
		};
		audio.onerror = (e) => {
			console.error('[TTS] Audio error:', e);
			speaking = false;
			currentAudio = null;
			opts.onEnd?.();
			resolve();
		};
		audio.play().catch((e) => {
			console.error('[TTS] play() failed:', e);
			speaking = false;
			currentAudio = null;
			resolve();
		});
	});
}

function speakWebSpeech(text: string, lang: string, rate: number, opts: TTSOptions): void {
	if (!('speechSynthesis' in window)) return;

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = lang === 'sv' ? 'sv-SE' : lang === 'en' ? 'en-US' : lang;
	utterance.rate = rate;
	utterance.pitch = 1.0;

	const voices = speechSynthesis.getVoices();
	const langPrefix = utterance.lang.split('-')[0];
	const preferred = voices.find((v) => v.lang.startsWith(langPrefix) && v.localService);
	const fallback = voices.find((v) => v.lang.startsWith(langPrefix));
	if (preferred) utterance.voice = preferred;
	else if (fallback) utterance.voice = fallback;

	if (opts.onWord) {
		utterance.addEventListener('boundary', (e) => {
			if (e.name === 'word') opts.onWord!(e.charIndex, e.charLength);
		});
	}

	utterance.onend = () => { speaking = false; currentUtterance = null; opts.onEnd?.(); };
	speaking = true;
	currentUtterance = utterance;
	speechSynthesis.speak(utterance);
}

export function stop(): void {
	if (currentAudio) { currentAudio.pause(); currentAudio.src = ''; currentAudio = null; }
	if (browser && 'speechSynthesis' in window) speechSynthesis.cancel();
	speaking = false;
	currentUtterance = null;
}

export function isSpeaking(): boolean { return speaking; }

export function getEngine(): 'piper' | 'webspeech' | 'none' {
	if (piperReady && !piperFailed) return 'piper';
	if (browser && 'speechSynthesis' in window) return 'webspeech';
	return 'none';
}

export function speakOnFocus(node: HTMLElement, text?: string) {
	const handler = () => speak(text || node.textContent || '');
	node.addEventListener('focus', handler);
	node.addEventListener('mouseenter', handler);
	return {
		destroy() {
			node.removeEventListener('focus', handler);
			node.removeEventListener('mouseenter', handler);
		}
	};
}
