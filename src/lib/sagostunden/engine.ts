/**
 * Sagostunden — Story generation engine (sv, en, pt_BR)
 */

import { ALL_WORDS, type Word, type WordCategory } from './words';
import { TEMPLATES, type StoryTemplate } from './templates';
import { fillPt } from './grammar-pt';

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

type Filler = (paragraph: string, words: Record<string, Word>) => string;

/** Swedish: {en_X} → "en katt" / "ett lejon", {def_X} → "katten", {X} → "katt" */
function fillSv(p: string, words: Record<string, Word>): string {
  let text = p;
  for (const [key, word] of Object.entries(words)) {
    const article = word.gender === 'ett' ? 'ett' : 'en';
    text = text.replace(new RegExp(`\\{en_${key}\\}`, 'g'), `${article} ${word.sv}`);
    text = text.replace(new RegExp(`\\{def_${key}\\}`, 'g'), definiteSv(word.sv, word.gender));
    text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), word.sv);
  }
  return capitalize(text);
}

/** English: {a_X} → "a cat" / "an owl", {def_X} → "the cat", {X} → "cat" */
function fillEn(p: string, words: Record<string, Word>): string {
  let text = p;
  for (const [key, word] of Object.entries(words)) {
    const article = articleEn(word.en);
    text = text.replace(new RegExp(`\\{a_${key}\\}`, 'g'), `${article} ${word.en}`);
    text = text.replace(new RegExp(`\\{en_${key}\\}`, 'g'), `${article} ${word.en}`);
    text = text.replace(new RegExp(`\\{def_${key}\\}`, 'g'), `the ${word.en}`);
    text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), word.en);
  }
  return capitalize(text);
}

const FILLERS: Record<string, Filler> = {
  sv: fillSv,
  en: fillEn,
  pt_BR: (p, words) =>
    fillPt(p, Object.fromEntries(Object.entries(words).map(([k, w]) => [k, { text: w.pt_BR.text, gender: w.pt_BR.gender }]))),
};

/** Fill a template for the story language (unknown languages fall back to English) */
export function fillTemplate(template: StoryTemplate, words: Record<string, Word>, lang: string): string[] {
  const fill = FILLERS[lang] ?? FILLERS.en;
  const paragraphs = template.paragraphs[lang] ?? template.paragraphs.en ?? template.paragraphs.sv;
  return paragraphs.map((p) => fill(p, words));
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

  const paragraphs = fillTemplate(tmpl, words, locale);

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
