/**
 * TTS module — Piper WASM is the PRIMARY engine.
 * Web Speech API is fallback ONLY if Piper completely fails.
 * Default rate is 0.5x (slow for children with language disorders).
 */
import { get, writable } from 'svelte/store';
import { ttsSpeed } from '$lib/a11y';
import { locale } from '$lib/i18n';
import { browser } from '$app/environment';
import { base } from '$app/paths';
import { EXTRA_PATH_MAP, CUSTOM_VOICE_URLS } from './voices';
import { isTauri, getLocalVoiceUrl, BUNDLED_VOICES } from './tauri-voices';

const DEFAULT_RATE = 0.5;

// Selected voice IDs per language — persisted in localStorage
// Default Swedish voice is Alma (custom-trained for these apps)
export const selectedVoiceSv = writable<string>(
	browser ? localStorage.getItem('tts-voice-sv') || 'sv_SE-alma-medium' : 'sv_SE-alma-medium'
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

// Proactively init TTS engine on load so status is available immediately
if (browser) {
	setTimeout(() => initPiper(), 500);
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

// Detect iOS/iPadOS — Piper WASM requires SharedArrayBuffer which Safari lacks
function isIOSDevice(): boolean {
	if (!browser) return false;
	const ua = navigator.userAgent;
	return /iPad|iPhone|iPod/.test(ua) ||
		(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS
}

function initPiper(): Promise<typeof import('@mintplex-labs/piper-tts-web') | null> {
	if (!browser) return Promise.resolve(null);
	if (piperModule) return Promise.resolve(piperModule);
	if (piperFailed) return Promise.resolve(null);

	if (!piperInitPromise) {
		piperInitPromise = (async () => {
			// Skip Piper entirely on iOS/iPadOS — no SharedArrayBuffer support
			if (isIOSDevice()) {
				console.log('[TTS] iOS/iPadOS detected — using Web Speech API (Piper WASM not supported)');
				piperFailed = true;
				updateStatus({ piperFailed: true, engine: 'webspeech', lastError: 'iOS/iPadOS: Piper WASM stöds ej — använder Web Speech API' });
				return null;
			}

			try {
				console.log('[TTS] Loading Piper WASM...');

				// CRITICAL: Configure onnxruntime-web BEFORE importing piper-tts-web.
				const ort = await import('onnxruntime-web');
				ort.env.wasm.numThreads = 1;
				ort.env.wasm.proxy = false;
				const wasmBase = (base || '') + '/';
				ort.env.wasm.wasmPaths = wasmBase;
				console.log(`[TTS] ONNX: threads=1, proxy=false, wasmPaths=${wasmBase}`);

				const mod = await import('@mintplex-labs/piper-tts-web');
				piperModule = mod;
				piperReady = true;
				updateStatus({ piperReady: true, engine: 'piper' });

				// Patch PATH_MAP with extra voices (Lisa, Alma, etc.)
				patchPathMap(mod);

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
 * Inject extra voice entries into the library's PATH_MAP.
 * PATH_MAP is a const but its properties are mutable.
 */
function patchPathMap(mod: typeof import('@mintplex-labs/piper-tts-web')) {
	if (pathMapPatched) return;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const pathMap = (mod as any).PATH_MAP;
		if (pathMap && typeof pathMap === 'object') {
			for (const [voiceId, path] of Object.entries(EXTRA_PATH_MAP)) {
				if (!(voiceId in pathMap)) {
					pathMap[voiceId] = path;
					console.log(`[TTS] Added ${voiceId} to PATH_MAP`);
				}
			}
		} else {
			console.warn('[TTS] PATH_MAP not found on module — custom voices may not work');
		}
		pathMapPatched = true;
	} catch (e) {
		console.warn('[TTS] PATH_MAP patch failed:', e);
	}
}

/**
 * Custom download for voices hosted outside diffusionstudio/piper-voices.
 * Downloads model + config into OPFS with the standard filename convention
 * so the piper library finds them in cache.
 */
async function downloadCustomVoice(
	voiceId: string,
	callback?: (progress: { loaded: number; total: number }) => void
): Promise<void> {
	const urls = CUSTOM_VOICE_URLS[voiceId];
	if (!urls) return;

	// In Tauri: load from bundled resources instead of network
	const bundled = BUNDLED_VOICES[voiceId];
	if (bundled && isTauri()) {
		console.log(`[TTS] Loading bundled voice ${voiceId} from Tauri resources`);
		for (const key of ['model', 'config'] as const) {
			const filename = bundled[key];
			const localUrl = await getLocalVoiceUrl(filename);
			if (!localUrl) {
				console.warn(`[TTS] Bundled file ${filename} not found, falling back to network`);
				break;
			}
			const res = await fetch(localUrl);
			if (!res.ok) {
				console.warn(`[TTS] Failed to fetch bundled ${filename}: ${res.status}`);
				break;
			}
			const blob = await res.blob();
			const root = await navigator.storage.getDirectory();
			const dir = await root.getDirectoryHandle('piper', { create: true });
			const file = await dir.getFileHandle(filename, { create: true });
			const writable = await file.createWritable();
			await writable.write(blob);
			await writable.close();
			console.log(`[TTS] Cached bundled ${filename} in OPFS`);
			if (key === 'model' && callback) {
				callback({ loaded: blob.size, total: blob.size });
			}
		}
		return;
	}

	console.log(`[TTS] Custom download for ${voiceId} from ${urls.model}`);

	// Download both model and config
	const downloads = [
		{ url: urls.model, reportProgress: true },
		{ url: urls.config, reportProgress: false },
	];

	for (const dl of downloads) {
		const res = await fetch(dl.url);
		if (!res.ok) throw new Error(`Failed to fetch ${dl.url}: ${res.status}`);

		const contentLength = +(res.headers.get('Content-Length') ?? 0);
		const reader = res.body?.getReader();
		const chunks: Uint8Array[] = [];
		let received = 0;

		if (reader) {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				chunks.push(value);
				received += value.length;
				if (dl.reportProgress && callback) {
					callback({ loaded: received, total: contentLength });
				}
			}
		}

		const blob = new Blob(chunks, { type: res.headers.get('Content-Type') ?? undefined });

		// Write to OPFS with the filename the piper library expects
		const root = await navigator.storage.getDirectory();
		const dir = await root.getDirectoryHandle('piper', { create: true });
		const filename = dl.url.split('/').at(-1)!;
		const file = await dir.getFileHandle(filename, { create: true });
		const writable = await file.createWritable();
		await writable.write(blob);
		await writable.close();
		console.log(`[TTS] Cached ${filename} in OPFS`);
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
		let stored: string[] = [];
		try { stored = await piper.stored(); } catch { stored = []; }
		if (!stored.includes(voiceId)) {
			console.log(`[TTS] Downloading voice: ${voiceId}...`);
			if (voiceId in CUSTOM_VOICE_URLS) {
				await downloadCustomVoice(voiceId, (progress) => {
					const pct = progress.total ? Math.round((progress.loaded * 100) / progress.total) : 0;
					console.log(`[TTS] Download ${voiceId}: ${pct}%`);
				});
			} else {
				await piper.download(voiceId, (progress) => {
					const pct = progress.total ? Math.round((progress.loaded * 100) / progress.total) : 0;
					console.log(`[TTS] Download ${voiceId}: ${pct}%`);
				});
			}
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
	try {
		return await piper.stored();
	} catch (e) {
		console.warn('[TTS] stored() failed (corrupt IndexedDB?), clearing cache:', e);
		try {
			const dbs = await indexedDB.databases();
			for (const dbInfo of dbs) {
				if (dbInfo.name && (dbInfo.name.includes('piper') || dbInfo.name.includes('onnx'))) {
					indexedDB.deleteDatabase(dbInfo.name);
					console.log(`[TTS] Deleted corrupt DB: ${dbInfo.name}`);
				}
			}
		} catch { /* ignore */ }
		return [];
	}
}

/** Remove a cached voice */
export async function removeVoice(voiceId: string): Promise<void> {
	const piper = await initPiper();
	if (!piper) return;
	try { await piper.remove(voiceId); } catch { /* ignore */ }
}

// Phonetic substitutions for words that TTS engines mispronounce
const PHONETIC_SV: Record<string, string> = {
	'autismappar': 'auttism-appar',
	'Autismappar': 'Auttism-appar',
	'ARASAAC': 'arrasaak',
	'TEACCH': 'tiitch',
	'PECS': 'peks',
	'LAMP': 'lamp',
};

function applyPhonetics(text: string, lang: string): string {
	const map = lang === 'sv' ? PHONETIC_SV : {};
	let result = text;
	for (const [word, phonetic] of Object.entries(map)) {
		result = result.replaceAll(word, phonetic);
	}
	return result;
}

export async function speak(text: string, opts: TTSOptions = {}): Promise<void> {
	stop();
	if (!text || !browser) return;

	const lang = opts.lang || get(locale);
	const storeRate = get(ttsSpeed);
	const rate = opts.rate ?? (storeRate !== 1.0 ? storeRate : DEFAULT_RATE);
	text = applyPhonetics(text, lang);

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
					if (voiceId in CUSTOM_VOICE_URLS) {
						await downloadCustomVoice(voiceId, (p) => {
							const pct = p.total ? Math.round((p.loaded * 100) / p.total) : 0;
							console.log(`[TTS] Re-download ${voiceId}: ${pct}%`);
						});
					} else {
						await piper.download(voiceId, (p) => {
							const pct = p.total ? Math.round((p.loaded * 100) / p.total) : 0;
							console.log(`[TTS] Re-download ${voiceId}: ${pct}%`);
						});
					}
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

	// For custom-hosted voices, ensure they're downloaded first
	if (voiceId in CUSTOM_VOICE_URLS) {
		let stored: string[] = [];
		try { stored = await piper.stored(); } catch { stored = []; }
		if (!stored.includes(voiceId)) {
			console.log(`[TTS] Auto-downloading custom voice ${voiceId}...`);
			await downloadCustomVoice(voiceId);
		}
	}

	const wav = await piper.predict({ text, voiceId });
	if (!wav || wav.size === 0) throw new Error('Piper returned empty WAV');

	const audio = new Audio();
	audio.src = URL.createObjectURL(wav);
	// Piper is much faster than Web Speech — halve the rate for Piper
	audio.playbackRate = rate * 0.5;

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
	const voiceId = getVoiceId(lang);

	// If user selected a specific Web Speech voice, use it
	if (voiceId.startsWith('webspeech:')) {
		const uri = voiceId.replace('webspeech:', '');
		const match = voices.find((v) => v.voiceURI === uri);
		if (match) utterance.voice = match;
	} else {
		const langPrefix = utterance.lang.split('-')[0];
		const preferred = voices.find((v) => v.lang.startsWith(langPrefix) && v.localService);
		const fallback = voices.find((v) => v.lang.startsWith(langPrefix));
		if (preferred) utterance.voice = preferred;
		else if (fallback) utterance.voice = fallback;
	}

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
