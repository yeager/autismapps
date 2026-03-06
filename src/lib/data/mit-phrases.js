/**
 * MIT Phrase Database
 * Each phrase has syllables mapped to notes on the C major scale.
 * Stress syllables get higher notes or longer durations.
 * ARASAAC IDs use format: https://static.arasaac.org/pictograms/{id}/{id}_500.png
 */

/** @typedef {{ note: string, duration: number }} NoteEvent */
/** @typedef {{ id: string, text: string, syllables: string[], melody: NoteEvent[], category: string, arasaacId: number }} MITPhrase */

// Note frequencies (Hz) for Web Audio API
export const NOTE_FREQ = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
};

// Categories with i18n keys and icons
export const CATEGORIES = [
  { id: 'greetings', labelKey: 'melodyTherapy.cat.greetings', icon: '👋', color: '#E67E22' },
  { id: 'wants', labelKey: 'melodyTherapy.cat.wants', icon: '🤲', color: '#3498DB' },
  { id: 'social', labelKey: 'melodyTherapy.cat.social', icon: '🤝', color: '#9B59B6' },
  { id: 'everyday', labelKey: 'melodyTherapy.cat.everyday', icon: '🏠', color: '#27AE60' },
];

// MIT 4-step protocol
export const MIT_STEPS = [
  { id: 'humming', labelKey: 'melodyTherapy.step.humming', icon: '🎵', descKey: 'melodyTherapy.stepDesc.humming', color: '#3498DB' },
  { id: 'singing', labelKey: 'melodyTherapy.step.singing', icon: '🎤', descKey: 'melodyTherapy.stepDesc.singing', color: '#27AE60' },
  { id: 'sprechgesang', labelKey: 'melodyTherapy.step.sprechgesang', icon: '🗣️', descKey: 'melodyTherapy.stepDesc.sprechgesang', color: '#F39C12' },
  { id: 'speaking', labelKey: 'melodyTherapy.step.speaking', icon: '💬', descKey: 'melodyTherapy.stepDesc.speaking', color: '#E74C3C' },
];

/** @type {MITPhrase[]} */
export const phrases = [
  // === Hälsningar (Greetings) ===
  {
    id: 'hej',
    text: 'Hej',
    syllables: ['hej'],
    melody: [{ note: 'E4', duration: 0.5 }],
    category: 'greetings',
    arasaacId: 6106,
  },
  {
    id: 'hejda',
    text: 'Hejdå',
    syllables: ['hej', 'då'],
    melody: [
      { note: 'E4', duration: 0.4 },
      { note: 'C4', duration: 0.6 },
    ],
    category: 'greetings',
    arasaacId: 6726,
  },
  {
    id: 'god-morgon',
    text: 'God morgon',
    syllables: ['god', 'mor', 'gon'],
    melody: [
      { note: 'C4', duration: 0.3 },
      { note: 'E4', duration: 0.4 },
      { note: 'G4', duration: 0.5 },
    ],
    category: 'greetings',
    arasaacId: 12264,
  },
  {
    id: 'god-natt',
    text: 'God natt',
    syllables: ['god', 'natt'],
    melody: [
      { note: 'E4', duration: 0.4 },
      { note: 'C4', duration: 0.6 },
    ],
    category: 'greetings',
    arasaacId: 12269,
  },

  // === Önskemål (Wants) ===
  {
    id: 'jag-vill-ha',
    text: 'Jag vill ha',
    syllables: ['jag', 'vill', 'ha'],
    melody: [
      { note: 'C4', duration: 0.4 },
      { note: 'E4', duration: 0.4 },
      { note: 'G4', duration: 0.6 },
    ],
    category: 'wants',
    arasaacId: 36257,
  },
  {
    id: 'jag-vill-inte',
    text: 'Jag vill inte',
    syllables: ['jag', 'vill', 'in', 'te'],
    melody: [
      { note: 'G4', duration: 0.3 },
      { note: 'E4', duration: 0.3 },
      { note: 'D4', duration: 0.3 },
      { note: 'C4', duration: 0.5 },
    ],
    category: 'wants',
    arasaacId: 5765,
  },
  {
    id: 'mer',
    text: 'Mer',
    syllables: ['mer'],
    melody: [{ note: 'G4', duration: 0.6 }],
    category: 'wants',
    arasaacId: 7063,
  },
  {
    id: 'jag-ar-hungrig',
    text: 'Jag är hungrig',
    syllables: ['jag', 'är', 'hung', 'rig'],
    melody: [
      { note: 'C4', duration: 0.3 },
      { note: 'D4', duration: 0.3 },
      { note: 'E4', duration: 0.4 },
      { note: 'C4', duration: 0.4 },
    ],
    category: 'wants',
    arasaacId: 2463,
  },

  // === Socialt (Social) ===
  {
    id: 'tack',
    text: 'Tack',
    syllables: ['tack'],
    melody: [{ note: 'G4', duration: 0.5 }],
    category: 'social',
    arasaacId: 25594,
  },
  {
    id: 'tack-sa-mycket',
    text: 'Tack så mycket',
    syllables: ['tack', 'så', 'myc', 'ket'],
    melody: [
      { note: 'G4', duration: 0.3 },
      { note: 'E4', duration: 0.3 },
      { note: 'C4', duration: 0.3 },
      { note: 'C4', duration: 0.5 },
    ],
    category: 'social',
    arasaacId: 25594,
  },
  {
    id: 'forlat',
    text: 'Förlåt',
    syllables: ['för', 'låt'],
    melody: [
      { note: 'E4', duration: 0.4 },
      { note: 'C4', duration: 0.6 },
    ],
    category: 'social',
    arasaacId: 6573,
  },
  {
    id: 'snalla',
    text: 'Snälla',
    syllables: ['snäl', 'la'],
    melody: [
      { note: 'E4', duration: 0.4 },
      { note: 'G4', duration: 0.5 },
    ],
    category: 'social',
    arasaacId: 6022,
  },

  // === Vardagsfraser (Everyday Phrases) ===
  {
    id: 'kom-hit',
    text: 'Kom hit',
    syllables: ['kom', 'hit'],
    melody: [
      { note: 'G4', duration: 0.4 },
      { note: 'E4', duration: 0.5 },
    ],
    category: 'everyday',
    arasaacId: 8942,
  },
  {
    id: 'titta-dar',
    text: 'Titta där',
    syllables: ['tit', 'ta', 'där'],
    melody: [
      { note: 'C4', duration: 0.3 },
      { note: 'E4', duration: 0.3 },
      { note: 'G4', duration: 0.5 },
    ],
    category: 'everyday',
    arasaacId: 6790,
  },
  {
    id: 'var-ar',
    text: 'Var är',
    syllables: ['var', 'är'],
    melody: [
      { note: 'E4', duration: 0.4 },
      { note: 'G4', duration: 0.5 },
    ],
    category: 'everyday',
    arasaacId: 36755,
  },
  {
    id: 'vad-ar-det',
    text: 'Vad är det',
    syllables: ['vad', 'är', 'det'],
    melody: [
      { note: 'C4', duration: 0.3 },
      { note: 'E4', duration: 0.4 },
      { note: 'G4', duration: 0.5 },
    ],
    category: 'everyday',
    arasaacId: 25608,
  },
  {
    id: 'jag-heter',
    text: 'Jag heter',
    syllables: ['jag', 'he', 'ter'],
    melody: [
      { note: 'C4', duration: 0.3 },
      { note: 'E4', duration: 0.4 },
      { note: 'G4', duration: 0.5 },
    ],
    category: 'everyday',
    arasaacId: 9671,
  },
];

/**
 * Get phrases filtered by category
 * @param {string} categoryId
 * @returns {MITPhrase[]}
 */
export function getPhrasesByCategory(categoryId) {
  return phrases.filter((p) => p.category === categoryId);
}

/**
 * Get ARASAAC pictogram URL
 * @param {number} id
 * @returns {string}
 */
export function getArasaacUrl(id) {
  return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
}
