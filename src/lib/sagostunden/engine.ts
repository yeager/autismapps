/**
 * Sagostunden — Story generation engine (bilingual)
 */

import { ALL_WORDS, type Word, type WordCategory } from './words';
import { TEMPLATES, type StoryTemplate } from './templates';

export interface GeneratedStory {
  id: string;
  template: StoryTemplate;
  words: Record<string, Word>;
  paragraphs: string[];
  locale: string;
  createdAt: number;
}

const SLOT_TO_CATEGORY: Record<string, WordCategory> = {
  DJUR: 'djur',
  PLATS: 'platser',
  SAK: 'saker',
  MAT: 'mat',
  PERSON: 'personer',
  VERB: 'verb',
};

/** Pick a random item from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a unique ID */
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** English indefinite article */
function articleEn(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

/** Swedish definite form (bestämd form)
 *  en-ord: katt→katten, fjäril→fjärilen, apa→apan, clown→clownen
 *  ett-ord: lejon→lejonet, paraply→paraplyet, äpple→äpplet
 */
function definiteSv(word: string, gender: string): string {
  const w = word.toLowerCase();
  if (gender === 'ett') {
    // ett-ord: ends in vowel → +t, else → +et
    if (/[aeiouyåäö]$/.test(w)) return w + 't';
    return w + 'et';
  }
  // en-ord: ends in vowel → +n, else → +en
  if (/[aeiouyåäö]$/.test(w)) return w + 'n';
  return w + 'en';
}

/** Capitalize first character of a string */
function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Fill a template with selected words, locale-aware.
 * Swedish: {en_X} → "en katt" / "ett lejon", {X} → "katt"
 * English: {a_X} → "a cat" / "an owl", {X} → "cat"
 */
export function fillTemplate(
  template: StoryTemplate,
  wordMap: Record<string, { sv: string; en: string; gender: string }>,
  locale: string
): string[] {
  const lang = locale.startsWith('en') ? 'en' : 'sv';
  const paragraphs = template.paragraphs[lang] || template.paragraphs['sv'];

  return paragraphs.map(p => {
    let text = p;
    for (const [key, word] of Object.entries(wordMap)) {
      const name = lang === 'en' ? word.en : word.sv;

      if (lang === 'sv') {
        // Swedish: {en_X} → "en katt" / "ett lejon" (indefinite)
        const article = word.gender === 'ett' ? 'ett' : 'en';
        text = text.replace(new RegExp(`\\{en_${key}\\}`, 'g'), `${article} ${name}`);
        // Swedish: {def_X} → "katten" / "lejonet" (definite, explicit)
        const def = definiteSv(name, word.gender);
        text = text.replace(new RegExp(`\\{def_${key}\\}`, 'g'), def);
        // Swedish: {X} → base form (use {def_X} for explicit definite)
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), name);
      } else {
        // English: {a_X} → "a cat" / "an elephant"
        const article = articleEn(name);
        text = text.replace(new RegExp(`\\{a_${key}\\}`, 'g'), `${article} ${name}`);
        text = text.replace(new RegExp(`\\{en_${key}\\}`, 'g'), `${article} ${name}`);
        // English: {def_X} → "the cat"
        text = text.replace(new RegExp(`\\{def_${key}\\}`, 'g'), `the ${name}`);
        // English: {X} → base form (use {def_X} for explicit "the X")
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), name);
      }
    }
    // Capitalize first character of each paragraph
    return capitalize(text);
  });
}

/**
 * Generate a story from a template using provided or random words.
 */
export function generateStory(
  template?: StoryTemplate,
  selectedWords?: Partial<Record<string, Word>>,
  locale: string = 'sv'
): GeneratedStory {
  const tmpl = template || pick(TEMPLATES);
  const words: Record<string, Word> = {};

  for (const slot of tmpl.slots) {
    if (selectedWords?.[slot]) {
      words[slot] = selectedWords[slot]!;
    } else {
      const cat = SLOT_TO_CATEGORY[slot];
      if (cat) {
        const pool = ALL_WORDS.filter(w => w.category === cat);
        words[slot] = pick(pool);
      }
    }
  }

  const wordMap = Object.fromEntries(
    Object.entries(words).map(([k, w]) => [k, { sv: w.sv, en: w.en, gender: w.gender }])
  );

  const paragraphs = fillTemplate(tmpl, wordMap, locale);

  return {
    id: uid(),
    template: tmpl,
    words,
    paragraphs,
    locale,
    createdAt: Date.now(),
  };
}

/**
 * Generate a fully random story
 */
export function generateRandomStory(locale: string = 'sv'): GeneratedStory {
  return generateStory(undefined, undefined, locale);
}

/**
 * Get all available templates
 */
export function getTemplates(): StoryTemplate[] {
  return TEMPLATES;
}
