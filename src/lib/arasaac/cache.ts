// Cache for ARASAAC API JSON. The API sends no caching headers, so without this every search hit the
// network on every visit (the vocabulary apps search once per word). Two layers: memory (also shares one
// request between concurrent callers) and Cache Storage, which survives reloads and deploys. Where Cache
// Storage is missing (Tauri custom protocol, SSR, insecure context) only the memory layer is used.

export interface JsonCacheOptions {
  fetch?: (url: string) => Promise<Response>;
  /** null disables the persistent layer; undefined uses the global `caches` when it exists */
  caches?: Pick<CacheStorage, 'open'> | null;
  now?: () => number;
  ttlMs?: number;
  cacheName?: string;
  /** URLs kept in memory (oldest dropped first) */
  maxEntries?: number;
  /** Aborts the default fetch after this many ms (a slow API must not stall the app); ignored with `fetch` */
  timeoutMs?: number;
}

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

const DAY = 24 * 60 * 60 * 1000;
const STAMP = 'x-cached-at';

export function createJsonCache(opts: JsonCacheOptions = {}) {
  const timeoutMs = opts.timeoutMs;
  const doFetch =
    opts.fetch ?? ((url: string) => (timeoutMs ? fetchWithTimeout(url, timeoutMs) : fetch(url)));
  const storage = opts.caches !== undefined ? opts.caches : typeof caches !== 'undefined' ? caches : null;
  const now = opts.now ?? Date.now;
  const ttl = opts.ttlMs ?? 30 * DAY;
  const cacheName = opts.cacheName ?? 'arasaac-api-v1';
  const maxEntries = opts.maxEntries ?? 300;
  const memory = new Map<string, Promise<unknown>>();

  async function openStore(): Promise<Cache | null> {
    if (!storage) return null;
    try {
      return await storage.open(cacheName);
    } catch {
      return null;
    }
  }

  async function load(url: string): Promise<unknown> {
    const store = await openStore();
    let stale: unknown;
    if (store) {
      try {
        const hit = await store.match(url);
        if (hit) {
          const data = await hit.json();
          if (now() - Number(hit.headers.get(STAMP) ?? 0) < ttl) return data;
          stale = data;
        }
      } catch {
        // unreadable entry: fetch it again
      }
    }
    let res: Response;
    try {
      res = await doFetch(url);
    } catch (e) {
      if (stale !== undefined) return stale;
      throw e;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const data = await res.json();
    if (store) {
      try {
        await store.put(url, new Response(JSON.stringify(data), {
          headers: { 'content-type': 'application/json', [STAMP]: String(now()) },
        }));
      } catch {
        // quota exceeded or storage blocked: memory still has it
      }
    }
    return data;
  }

  function get<T = unknown>(url: string): Promise<T> {
    let pending = memory.get(url);
    if (!pending) {
      const created = load(url);
      memory.set(url, created);
      if (memory.size > maxEntries) memory.delete(memory.keys().next().value as string);
      // A failure must not stick: the next call retries
      created.catch(() => {
        if (memory.get(url) === created) memory.delete(url);
      });
      pending = created;
    }
    return pending as Promise<T>;
  }

  return { get };
}

/** Shared cache for the app (global fetch with a 5 s timeout and Cache Storage) */
export const cachedJson = createJsonCache({ timeoutMs: 5000 }).get;
