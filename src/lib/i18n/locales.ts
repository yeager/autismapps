/**
 * Central locale registry — single source of truth for every language the app knows.
 * Pure module (no $lib/$app/svelte imports) so it can be unit-tested with node:test.
 */

export interface LocaleDef {
  /** Code used for i18n files and stores: 'sv', 'en', 'pt_BR', ... */
  code: string;
  /** Native name shown in pickers */
  label: string;
  /** Emoji flag; rendered through flagSvg() */
  flag: string;
  /** BCP-47 tag for <html lang>, Web Speech and Intl date formatting */
  bcp47: string;
  /** Language code expected by the ARASAAC API (verify before enabling a locale) */
  arasaac: string;
  /** false = shown as "coming soon" in settings, hidden from the home picker */
  ready: boolean;
}

export const DEFAULT_LOCALE = 'en';

export const LOCALES: LocaleDef[] = [
  { code: 'sv', label: 'Svenska', flag: '🇸🇪', bcp47: 'sv-SE', arasaac: 'sv', ready: true },
  { code: 'en', label: 'English', flag: '🇬🇧', bcp47: 'en-US', arasaac: 'en', ready: true },
  { code: 'pt_BR', label: 'Português (BR)', flag: '🇧🇷', bcp47: 'pt-BR', arasaac: 'br', ready: true },
  { code: 'da', label: 'Dansk', flag: '🇩🇰', bcp47: 'da-DK', arasaac: 'en', ready: false },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', bcp47: 'de-DE', arasaac: 'en', ready: false },
  { code: 'es', label: 'Español', flag: '🇪🇸', bcp47: 'es-ES', arasaac: 'en', ready: false },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮', bcp47: 'fi-FI', arasaac: 'en', ready: false },
  { code: 'fr', label: 'Français', flag: '🇫🇷', bcp47: 'fr-FR', arasaac: 'en', ready: false },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', bcp47: 'it-IT', arasaac: 'en', ready: false },
  { code: 'nb', label: 'Norsk bokmål', flag: '🇳🇴', bcp47: 'nb-NO', arasaac: 'en', ready: false },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', bcp47: 'nl-NL', arasaac: 'en', ready: false },
  { code: 'pl', label: 'Polski', flag: '🇵🇱', bcp47: 'pl-PL', arasaac: 'en', ready: false },
];

export const READY_LOCALES: LocaleDef[] = LOCALES.filter((l) => l.ready);

export function getLocaleDef(code: string): LocaleDef {
  return LOCALES.find((l) => l.code === code) ?? LOCALES.find((l) => l.code === DEFAULT_LOCALE)!;
}

export function isReadyLocale(code: string): boolean {
  return READY_LOCALES.some((l) => l.code === code);
}

/** First-visit language from navigator.language: pt-* → pt_BR, sv-* → sv, anything else → en */
export function detectLocale(navLang: string | null | undefined): string {
  const l = (navLang || '').toLowerCase();
  if (l.startsWith('pt')) return 'pt_BR';
  if (l.startsWith('sv')) return 'sv';
  return DEFAULT_LOCALE;
}

/** Pick the value for `code` from a per-locale object; falls back to en, then sv. */
export function pick<T>(obj: Partial<Record<string, T>>, code: string): T {
  return (obj[code] ?? obj.en ?? obj.sv) as T;
}
