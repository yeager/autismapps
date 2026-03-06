/**
 * Prosody Training — Word and sentence data (Swedish)
 * Used by the Prosody Trainer app for stress, intonation, and rhythm exercises.
 */

export const twoSyllableWords = [
  { word: 'mamma', stress: 0, syllables: ['mam', 'ma'], icon: '👩' },
  { word: 'banan', stress: 1, syllables: ['ba', 'nan'], icon: '🍌' },
  { word: 'pappa', stress: 0, syllables: ['pap', 'pa'], icon: '👨' },
  { word: 'kaffe', stress: 0, syllables: ['kaf', 'fe'], icon: '☕' },
  { word: 'robot', stress: 1, syllables: ['ro', 'bot'], icon: '🤖' },
  { word: 'kanin', stress: 1, syllables: ['ka', 'nin'], icon: '🐰' },
  { word: 'lampa', stress: 0, syllables: ['lam', 'pa'], icon: '💡' },
  { word: 'fotboll', stress: 0, syllables: ['fot', 'boll'], icon: '⚽' },
  { word: 'hunden', stress: 0, syllables: ['hun', 'den'], icon: '🐕' },
  { word: 'citron', stress: 1, syllables: ['ci', 'tron'], icon: '🍋' },
];

export const threeSyllableWords = [
  { word: 'telefon', stress: 2, syllables: ['te', 'le', 'fon'], icon: '📞' },
  { word: 'elefant', stress: 2, syllables: ['e', 'le', 'fant'], icon: '🐘' },
  { word: 'choklad', stress: 0, syllables: ['cho', 'klad'], icon: '🍫' },
  { word: 'paraply', stress: 2, syllables: ['pa', 'ra', 'ply'], icon: '☂️' },
  { word: 'krokodil', stress: 2, syllables: ['kro', 'ko', 'dil'], icon: '🐊' },
  { word: 'dator', stress: 0, syllables: ['da', 'tor'], icon: '💻' },
  { word: 'popcorn', stress: 0, syllables: ['pop', 'corn'], icon: '🍿' },
  { word: 'ananas', stress: 2, syllables: ['a', 'na', 'nas'], icon: '🍍' },
  { word: 'tomaten', stress: 1, syllables: ['to', 'ma', 'ten'], icon: '🍅' },
  { word: 'helikopter', stress: 2, syllables: ['he', 'li', 'kop', 'ter'], icon: '🚁' },
];

export const intonationSentences = [
  // Statements (falling contour ↘)
  {
    text: 'Jag vill ha glass.',
    type: 'statement',
    icon: '🍦',
    contour: [50, 55, 60, 55, 45, 35],
  },
  {
    text: 'Det är en katt.',
    type: 'statement',
    icon: '🐱',
    contour: [50, 55, 50, 48, 40, 30],
  },
  {
    text: 'Vi åker hem nu.',
    type: 'statement',
    icon: '🏠',
    contour: [55, 58, 52, 48, 40, 30],
  },
  // Questions (rising contour ↗)
  {
    text: 'Vill du ha glass?',
    type: 'question',
    icon: '🍦',
    contour: [45, 42, 40, 45, 55, 70],
  },
  {
    text: 'Är det en katt?',
    type: 'question',
    icon: '🐱',
    contour: [45, 40, 38, 45, 55, 72],
  },
  {
    text: 'Ska vi gå ut?',
    type: 'question',
    icon: '🌳',
    contour: [42, 40, 42, 50, 60, 75],
  },
  // Exclamations (high start, dramatic fall ↗↘)
  {
    text: 'Vilken fin katt!',
    type: 'exclamation',
    icon: '🐱',
    contour: [70, 80, 85, 75, 55, 35],
  },
  {
    text: 'Vad god glass!',
    type: 'exclamation',
    icon: '🍦',
    contour: [65, 80, 85, 70, 50, 30],
  },
  {
    text: 'Titta, en regnbåge!',
    type: 'exclamation',
    icon: '🌈',
    contour: [70, 82, 88, 78, 55, 35],
  },
];

export const emotionData = [
  {
    emotion: 'glad',
    icon: '😊',
    sentence: 'Jag fick en present!',
    contour: [55, 65, 75, 80, 85, 80],
    arasaacId: 6011, // happy
  },
  {
    emotion: 'ledsen',
    icon: '😢',
    sentence: 'Min ballong flög iväg.',
    contour: [50, 45, 40, 38, 35, 30],
    arasaacId: 6054, // sad
  },
  {
    emotion: 'arg',
    icon: '😠',
    sentence: 'Sluta göra så!',
    contour: [75, 80, 85, 70, 55, 40],
    arasaacId: 6014, // angry
  },
  {
    emotion: 'förvånad',
    icon: '😲',
    sentence: 'Oj, vad hände!?',
    contour: [50, 60, 80, 90, 70, 50],
    arasaacId: 6062, // surprised
  },
];

export const rhythmPatterns = [
  {
    text: 'Kom hem nu',
    pattern: ['da', 'DA', 'da'],
    beats: [false, true, false],
    icon: '🏠',
  },
  {
    text: 'Jag vill ha',
    pattern: ['da', 'DA', 'da'],
    beats: [false, true, false],
    icon: '🙏',
  },
  {
    text: 'Vi ska gå',
    pattern: ['da', 'da', 'DA'],
    beats: [false, false, true],
    icon: '🚶',
  },
  {
    text: 'Var är du',
    pattern: ['DA', 'da', 'da'],
    beats: [true, false, false],
    icon: '🔍',
  },
  {
    text: 'Öppna dörren',
    pattern: ['DA', 'da', 'DA', 'da'],
    beats: [true, false, true, false],
    icon: '🚪',
  },
  {
    text: 'Jag är hungrig nu',
    pattern: ['da', 'da', 'DA', 'da', 'da'],
    beats: [false, false, true, false, false],
    icon: '🍽️',
  },
];

export const fullSentences = [
  {
    text: 'Hej, jag heter Axel.',
    type: 'statement',
    contour: [55, 60, 55, 50, 55, 50, 42, 35],
    icon: '👋',
  },
  {
    text: 'Kan jag få lite vatten?',
    type: 'question',
    contour: [50, 48, 45, 42, 45, 50, 60, 72],
    icon: '💧',
  },
  {
    text: 'Tack så jättemycket!',
    type: 'exclamation',
    contour: [65, 75, 82, 85, 80, 70, 50, 35],
    icon: '🙏',
  },
  {
    text: 'Vad ska vi göra idag?',
    type: 'question',
    contour: [50, 52, 48, 45, 48, 55, 65, 75],
    icon: '🤔',
  },
  {
    text: 'Det var jätteroligt!',
    type: 'exclamation',
    contour: [60, 70, 80, 88, 82, 68, 50, 35],
    icon: '😄',
  },
];

/** Level definitions */
export const LEVELS = [
  {
    id: 1,
    titleKey: 'prosody.level1.title',
    descKey: 'prosody.level1.desc',
    icon: '🔵',
    type: 'stress2',
  },
  {
    id: 2,
    titleKey: 'prosody.level2.title',
    descKey: 'prosody.level2.desc',
    icon: '🟢',
    type: 'stress3',
  },
  {
    id: 3,
    titleKey: 'prosody.level3.title',
    descKey: 'prosody.level3.desc',
    icon: '🟡',
    type: 'intonation',
  },
  {
    id: 4,
    titleKey: 'prosody.level4.title',
    descKey: 'prosody.level4.desc',
    icon: '🟠',
    type: 'emotion',
  },
  {
    id: 5,
    titleKey: 'prosody.level5.title',
    descKey: 'prosody.level5.desc',
    icon: '🔴',
    type: 'fullSentence',
  },
];
