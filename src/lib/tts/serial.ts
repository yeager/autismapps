/**
 * Runs async tasks one at a time, in call order. A task that fails rejects only its own caller.
 * Used for Piper: onnxruntime-web allows a single run per WASM module ("Session already started").
 */
export function createSerialQueue() {
	let tail: Promise<unknown> = Promise.resolve();
	return function enqueue<T>(task: () => Promise<T>): Promise<T> {
		const result = tail.then(task);
		tail = result.catch(() => {});
		return result;
	};
}
