import { writable, derived } from 'svelte/store';
import en from './messages/en.json';
import sv from './messages/sv.json';
import { getLocaleDef, DEFAULT_LOCALE } from './locales';

export { LOCALES, READY_LOCALES, getLocaleDef, detectLocale, isReadyLocale, pick } from './locales';

type TranslationCatalog = Record<string, string>;

function flattenCatalog(value: unknown, prefix = '', result: TranslationCatalog = {}): TranslationCatalog {
  if (typeof value === 'string') {
    if (prefix) result[prefix] = value;
    return result;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      flattenCatalog(nestedValue, prefix ? `${prefix}.${key}` : key, result);
    }
  }

  return result;
}

// en and sv are bundled up front (each has its own production domain, so the
// initial locale change never waits on a dynamic import); other locales are lazy-loaded.
const translations: Record<string, TranslationCatalog> = {
  en: flattenCatalog(en),
  sv: flattenCatalog(sv)
};
const loadedLocales = new Set(['en', 'sv']);

// Static builds are published on two language-specific domains. Seed the
// prerendered HTML with the matching language; the browser still selects its
// domain locale in the root layout before hydrating the page.
const initialLocale = import.meta.env.SSR && import.meta.env.VITE_PRERENDER_LOCALE === 'sv' ? 'sv' : 'en';
export const locale = writable(initialLocale);
export const fallbackLocale = DEFAULT_LOCALE;

/** Loads a dictionary; resolves false if the file does not exist. */
export async function loadLocale(lang: string): Promise<boolean> {
  if (loadedLocales.has(lang)) return true;
  try {
    const mod = await import(`./messages/${lang}.json`);
    translations[lang] = flattenCatalog(mod.default);
    loadedLocales.add(lang);
    return true;
  } catch {
    console.warn(`Locale ${lang} not found, falling back to ${fallbackLocale}`);
    return false;
  }
}

/** Switches the active locale (only if its dictionary loaded) and updates <html lang>. Resolves to the code actually applied. */
let setLocaleSeq = 0;
export function setLocale(lang: string): Promise<string> {
  const seq = ++setLocaleSeq;
  return loadLocale(lang).then((ok) => {
    const code = ok ? lang : fallbackLocale;
    // Only the latest call applies; superseded calls still resolve with the code they would have applied.
    if (seq !== setLocaleSeq) return code;
    locale.set(code);
    if (typeof document !== 'undefined') document.documentElement.lang = getLocaleDef(code).bcp47;
    return code;
  });
}

export const t = derived(locale, ($locale) => {
  return (key: string, params?: Record<string, string>): string => {
    const dict = translations[$locale] || translations[fallbackLocale];
    let val = dict[key] ?? translations[fallbackLocale]?.[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        val = val.replace(`{${k}}`, v);
      }
    }
    return val;
  };
});
