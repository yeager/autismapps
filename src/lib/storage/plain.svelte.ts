/**
 * Plain copy of a value for IndexedDB. Pages hand Svelte 5 `$state` values (proxies, at any depth) to the
 * save functions, and IndexedDB can't structured-clone a proxy: `put` failed with DataCloneError.
 * `$state.snapshot` keeps Dates, Maps, Sets and Blobs; it's a rune, hence this `.svelte.ts` module.
 */
export function plain<T>(value: T): T {
	return $state.snapshot(value) as T;
}
