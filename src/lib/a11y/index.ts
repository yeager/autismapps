import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'high-contrast';
export type TextSize = 'normal' | 'large' | 'extra-large';

function stored<T>(key: string, initial: T) {
  const val = browser ? localStorage.getItem(key) : null;
  const store = writable<T>(val ? JSON.parse(val) : initial);
  if (browser) {
    store.subscribe((v) => localStorage.setItem(key, JSON.stringify(v)));
  }
  return store;
}

export const theme = stored<Theme>('a11y-theme', 'light');
export const textSize = stored<TextSize>('a11y-text-size', 'large');
export const screenReaderEnabled = stored<boolean>('a11y-screen-reader', false);
export const reducedMotion = stored<boolean>('a11y-reduced-motion', false);
export const ttsSpeed = stored<number>('a11y-tts-speed', 0.7);
export const phoneticEmphasis = stored<boolean>('a11y-phonetic', true);
export const simpleMode = stored<boolean>('a11y-simple-mode', true);
export const arasaacBW = stored<boolean>('a11y-arasaac-bw', false);

export const textSizeClass = derived(textSize, ($s) => {
  switch ($s) {
    case 'large': return 'text-lg';
    case 'extra-large': return 'text-xl';
    default: return 'text-base';
  }
});

export const themeClass = derived(theme, ($t) => `theme-${$t}`);
