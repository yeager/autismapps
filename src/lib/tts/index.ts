import { get } from 'svelte/store';
import { ttsSpeed, phoneticEmphasis } from '$lib/a11y';
import { locale } from '$lib/i18n';

let speaking = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export interface TTSOptions {
  lang?: string;
  rate?: number;
  onWord?: (charIndex: number, charLength: number) => void;
  onEnd?: () => void;
}

export function speak(text: string, opts: TTSOptions = {}): void {
  stop();
  if (!text || !('speechSynthesis' in window)) return;

  const lang = opts.lang || get(locale);
  const rate = opts.rate ?? get(ttsSpeed);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'sv' ? 'sv-SE' : lang === 'en' ? 'en-US' : lang;
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Try to find a good voice
  const voices = speechSynthesis.getVoices();
  const langPrefix = utterance.lang.split('-')[0];
  const preferred = voices.find(v => v.lang.startsWith(langPrefix) && v.localService);
  const fallback = voices.find(v => v.lang.startsWith(langPrefix));
  if (preferred) utterance.voice = preferred;
  else if (fallback) utterance.voice = fallback;

  if (opts.onWord) {
    utterance.addEventListener('boundary', (e) => {
      if (e.name === 'word') {
        opts.onWord!(e.charIndex, e.charLength);
      }
    });
  }

  utterance.onend = () => {
    speaking = false;
    currentUtterance = null;
    opts.onEnd?.();
  };

  speaking = true;
  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

export function stop(): void {
  if (speaking) {
    speechSynthesis.cancel();
    speaking = false;
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  return speaking;
}

// Speak on hover/focus for accessibility
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
