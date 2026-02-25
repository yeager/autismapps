declare module '@mintplex-labs/piper-tts-web' {
	interface PredictOptions {
		text: string;
		voiceId: string;
	}

	interface DownloadProgress {
		url: string;
		loaded: number;
		total: number;
	}

	export function predict(
		options: PredictOptions,
		onProgress?: (progress: DownloadProgress) => void
	): Promise<Blob>;

	export function download(
		voiceId: string,
		onProgress?: (progress: DownloadProgress) => void
	): Promise<void>;

	export function stored(): Promise<string[]>;
	export function remove(voiceId: string): Promise<void>;
	export function flush(): Promise<void>;
	export function voices(): Promise<Record<string, unknown>>;
}
