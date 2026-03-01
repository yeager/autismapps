/**
 * Sagostunden — Story generation engine
 */

import { ALL_WORDS, type Word, type WordCategory } from './words';
import { TEMPLATES, fillTemplate, type StoryTemplate } from './templates';

export interface GeneratedStory {
  id: string;
  template: StoryTemplate;
  words: Record<string, Word>;
  paragraphs: string[];
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

/**
 * Generate a story from a template using provided or random words.
 */
export function generateStory(
  template?: StoryTemplate,
  selectedWords?: Partial<Record<string, Word>>
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
    Object.entries(words).map(([k, w]) => [k, { sv: w.sv, gender: w.gender }])
  );

  const paragraphs = fillTemplate(tmpl, wordMap);

  return {
    id: uid(),
    template: tmpl,
    words,
    paragraphs,
    createdAt: Date.now(),
  };
}

/**
 * Generate a fully random story
 */
export function generateRandomStory(): GeneratedStory {
  return generateStory();
}

/**
 * Get all available templates
 */
export function getTemplates(): StoryTemplate[] {
  return TEMPLATES;
}
