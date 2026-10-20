// Keeps the tongue-viewer animation in step with the speech: the sounds of a practice sequence are
// grouped by what is spoken at once (pt speaks whole syllables, "bá" covers b and a), and the later
// sounds of a group are shown while its audio plays.

export interface SpeechChunk {
	/** Index of the chunk's first sound in the sequence */
	start: number;
	sounds: string[];
	text: string;
}

/**
 * Without `say`, every sound is a chunk spoken by its label. With `say`, a non-empty entry closes a
 * chunk with the silent sounds before it (`['', 'bá']` → b and a, spoken as "bá").
 */
export function speechChunks(sounds: string[], say: string[] | undefined, labelOf: (sound: string) => string): SpeechChunk[] {
	const chunks: SpeechChunk[] = [];
	let start = 0;
	for (let i = 0; i < sounds.length; i++) {
		const text = say ? say[i] : labelOf(sounds[i]);
		if (!text && i < sounds.length - 1) continue;
		chunks.push({ start, sounds: sounds.slice(start, i + 1), text: text ?? '' });
		start = i + 1;
	}
	return chunks;
}

// Rough length of one sound in Web Speech, which doesn't report the duration
const ESTIMATED_SOUND_MS = 400;

/**
 * When to show each sound after the first (in ms from the audio start). The first is shown before the
 * audio; the others are spread over the first part of it, since moving the tongue takes time too.
 */
export function stepOffsets(count: number, durationMs: number): number[] {
	const duration = Number.isFinite(durationMs) && durationMs > 0 ? durationMs : count * ESTIMATED_SOUND_MS;
	return Array.from({ length: count - 1 }, (_, i) => Math.round(((i + 1) * duration) / (count + 1)));
}
