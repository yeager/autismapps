import { writable, derived, get } from 'svelte/store';
import en from '../../../messages/en.json';

const translations: Record<string, Record<string, string>> = { en };
const loadedLocales = new Set(['en']);

export const locale = writable('en');
export const fallbackLocale = 'en';

export async function loadLocale(lang: string) {
  if (loadedLocales.has(lang)) return;
  try {
    const mod = await import(`../../../messages/${lang}.json`);
    translations[lang] = mod.default;
    loadedLocales.add(lang);
  } catch {
    console.warn(`Locale ${lang} not found, falling back to ${fallbackLocale}`);
  }
}

export function setLocale(lang: string) {
  loadLocale(lang).then(() => locale.set(lang));
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
