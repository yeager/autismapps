/**
 * Sequence Data for Sequence Trainer
 *
 * Each sequence has:
 * - id: unique identifier
 * - category: grouping category
 * - level: difficulty (1=3 steps, 2=4 steps, 3=5-6 steps)
 * - title: { en, sv } translations
 * - steps: ordered array with description (en/sv), ARASAAC pictogram ID, order
 *
 * ALL ARASAAC IDs validated via https://api.arasaac.org/v1/pictograms/en/search/{word}
 * Using first result _id from each search.
 *
 * ARASAAC URL format: https://static.arasaac.org/pictograms/{id}/{id}_500.png
 */

export const CATEGORIES = [
  { id: 'daily', labelKey: 'seq.cat.daily', icon: '🏠', color: '#3498DB' },
  { id: 'cooking', labelKey: 'seq.cat.cooking', icon: '🍳', color: '#E67E22' },
  { id: 'social', labelKey: 'seq.cat.social', icon: '🤝', color: '#9B59B6' },
  { id: 'nature', labelKey: 'seq.cat.nature', icon: '🌱', color: '#27AE60' },
  { id: 'stories', labelKey: 'seq.cat.stories', icon: '📖', color: '#E74C3C' },
];

export const DIFFICULTY_LEVELS = [
  { level: 1, labelKey: 'seq.level.1', icon: '⭐', ages: '3-5', color: '#27AE60' },
  { level: 2, labelKey: 'seq.level.2', icon: '⭐⭐', ages: '5-7', color: '#F39C12' },
  { level: 3, labelKey: 'seq.level.3', icon: '⭐⭐⭐', ages: '7+', color: '#E74C3C' },
];

/** @type {Array<{id: string, category: string, level: number, title: {en: string, sv: string}, steps: Array<{description: {en: string, sv: string}, arasaacId: number, order: number}>}>} */
export const sequences = [
  // ═══════════════════════════════════════
  // DAILY ROUTINES
  // ═══════════════════════════════════════

  // 1. Brush teeth (Level 1 - 3 steps)
  {
    id: 'brush-teeth-easy',
    category: 'daily',
    level: 1,
    title: { en: 'Brush your teeth', sv: 'Borsta tänderna' },
    steps: [
      { description: { en: 'Get the toothbrush', sv: 'Ta tandborsten' }, arasaacId: 2694, order: 1 },
      { description: { en: 'Put toothpaste on', sv: 'Lägg på tandkräm' }, arasaacId: 2858, order: 2 },
      { description: { en: 'Brush your teeth', sv: 'Borsta tänderna' }, arasaacId: 2737, order: 3 },
    ],
  },

  // 2. Brush teeth full (Level 3 - 5 steps)
  {
    id: 'brush-teeth-full',
    category: 'daily',
    level: 3,
    title: { en: 'Brush teeth (all steps)', sv: 'Borsta tänderna (alla steg)' },
    steps: [
      { description: { en: 'Get the toothbrush', sv: 'Ta tandborsten' }, arasaacId: 2694, order: 1 },
      { description: { en: 'Put toothpaste on', sv: 'Lägg på tandkräm' }, arasaacId: 2858, order: 2 },
      { description: { en: 'Brush your teeth', sv: 'Borsta tänderna' }, arasaacId: 2737, order: 3 },
      { description: { en: 'Rinse your mouth', sv: 'Skölj munnen' }, arasaacId: 34824, order: 4 },
      { description: { en: 'Dry your mouth', sv: 'Torka munnen' }, arasaacId: 2593, order: 5 },
    ],
  },

  // 3. Morning routine (Level 2 - 4 steps)
  {
    id: 'morning-routine',
    category: 'daily',
    level: 2,
    title: { en: 'Morning routine', sv: 'Morgonrutin' },
    steps: [
      { description: { en: 'Wake up', sv: 'Vakna' }, arasaacId: 31874, order: 1 },
      { description: { en: 'Get dressed', sv: 'Klä på dig' }, arasaacId: 6627, order: 2 },
      { description: { en: 'Eat breakfast', sv: 'Ät frukost' }, arasaacId: 4626, order: 3 },
      { description: { en: 'Go to school', sv: 'Gå till skolan' }, arasaacId: 32446, order: 4 },
    ],
  },

  // 4. Wash hands (Level 1 - 3 steps)
  {
    id: 'wash-hands',
    category: 'daily',
    level: 1,
    title: { en: 'Wash your hands', sv: 'Tvätta händerna' },
    steps: [
      { description: { en: 'Turn on the water', sv: 'Starta vattnet' }, arasaacId: 32650, order: 1 },
      { description: { en: 'Use soap', sv: 'Använd tvål' }, arasaacId: 34846, order: 2 },
      { description: { en: 'Dry with towel', sv: 'Torka med handduk' }, arasaacId: 2593, order: 3 },
    ],
  },

  // 5. Get dressed (Level 3 - 5 steps)
  {
    id: 'get-dressed',
    category: 'daily',
    level: 3,
    title: { en: 'Get dressed', sv: 'Klä på dig' },
    steps: [
      { description: { en: 'Put on underwear', sv: 'Ta på underkläder' }, arasaacId: 25680, order: 1 },
      { description: { en: 'Put on shirt', sv: 'Ta på tröja' }, arasaacId: 13640, order: 2 },
      { description: { en: 'Put on pants', sv: 'Ta på byxor' }, arasaacId: 2565, order: 3 },
      { description: { en: 'Put on socks', sv: 'Ta på strumpor' }, arasaacId: 2298, order: 4 },
      { description: { en: 'Put on shoes', sv: 'Ta på skor' }, arasaacId: 2775, order: 5 },
    ],
  },

  // ═══════════════════════════════════════
  // COOKING
  // ═══════════════════════════════════════

  // 6. Make a sandwich (Level 1 - 3 steps)
  {
    id: 'sandwich-easy',
    category: 'cooking',
    level: 1,
    title: { en: 'Make a sandwich', sv: 'Gör en smörgås' },
    steps: [
      { description: { en: 'Get bread', sv: 'Ta bröd' }, arasaacId: 2494, order: 1 },
      { description: { en: 'Put on butter', sv: 'Lägg på smör' }, arasaacId: 2461, order: 2 },
      { description: { en: 'Put on cheese', sv: 'Lägg på ost' }, arasaacId: 2541, order: 3 },
    ],
  },

  // 7. Make a sandwich full (Level 3 - 5 steps)
  {
    id: 'sandwich-full',
    category: 'cooking',
    level: 3,
    title: { en: 'Make a sandwich (all steps)', sv: 'Gör en smörgås (alla steg)' },
    steps: [
      { description: { en: 'Get bread', sv: 'Ta bröd' }, arasaacId: 2494, order: 1 },
      { description: { en: 'Spread butter', sv: 'Bre smör' }, arasaacId: 2461, order: 2 },
      { description: { en: 'Add cheese', sv: 'Lägg på ost' }, arasaacId: 2541, order: 3 },
      { description: { en: 'Close the sandwich', sv: 'Stäng smörgåsen' }, arasaacId: 2281, order: 4 },
      { description: { en: 'Eat!', sv: 'Ät!' }, arasaacId: 6456, order: 5 },
    ],
  },

  // 8. Bake a cake (Level 3 - 5 steps)
  {
    id: 'bake-cake',
    category: 'cooking',
    level: 3,
    title: { en: 'Bake a cake', sv: 'Baka en kaka' },
    steps: [
      { description: { en: 'Get flour', sv: 'Ta mjöl' }, arasaacId: 8600, order: 1 },
      { description: { en: 'Add eggs', sv: 'Lägg i ägg' }, arasaacId: 2427, order: 2 },
      { description: { en: 'Mix together', sv: 'Blanda ihop' }, arasaacId: 5515, order: 3 },
      { description: { en: 'Put in oven', sv: 'Sätt i ugnen' }, arasaacId: 2426, order: 4 },
      { description: { en: 'The cake is done!', sv: 'Kakan är klar!' }, arasaacId: 2502, order: 5 },
    ],
  },

  // ═══════════════════════════════════════
  // SOCIAL SITUATIONS
  // ═══════════════════════════════════════

  // 9. Meet a friend (Level 1 - 3 steps)
  {
    id: 'meet-friend-easy',
    category: 'social',
    level: 1,
    title: { en: 'Meet a friend', sv: 'Träffa en kompis' },
    steps: [
      { description: { en: 'See your friend', sv: 'Se din kompis' }, arasaacId: 25790, order: 1 },
      { description: { en: 'Wave hello', sv: 'Vinka hej' }, arasaacId: 4706, order: 2 },
      { description: { en: 'Play together', sv: 'Leka tillsammans' }, arasaacId: 23392, order: 3 },
    ],
  },

  // 10. Meet a friend full (Level 2 - 4 steps)
  {
    id: 'meet-friend-full',
    category: 'social',
    level: 2,
    title: { en: 'Meet a friend (all steps)', sv: 'Träffa en kompis (alla steg)' },
    steps: [
      { description: { en: 'See your friend', sv: 'Se din kompis' }, arasaacId: 25790, order: 1 },
      { description: { en: 'Wave hello', sv: 'Vinka hej' }, arasaacId: 4706, order: 2 },
      { description: { en: 'Say hello', sv: 'Säg hej' }, arasaacId: 6522, order: 3 },
      { description: { en: 'Play together', sv: 'Leka tillsammans' }, arasaacId: 23392, order: 4 },
    ],
  },

  // 11. Go shopping (Level 2 - 4 steps)
  {
    id: 'go-shopping',
    category: 'social',
    level: 2,
    title: { en: 'Go shopping', sv: 'Handla' },
    steps: [
      { description: { en: 'Go to the store', sv: 'Gå till affären' }, arasaacId: 35695, order: 1 },
      { description: { en: 'Get a cart', sv: 'Ta en kundvagn' }, arasaacId: 21506, order: 2 },
      { description: { en: 'Pay with money', sv: 'Betala med pengar' }, arasaacId: 6457, order: 3 },
      { description: { en: 'Carry the bag', sv: 'Bär kassen' }, arasaacId: 23849, order: 4 },
    ],
  },

  // 12. Birthday party (Level 3 - 5 steps)
  {
    id: 'birthday-party',
    category: 'social',
    level: 3,
    title: { en: 'Birthday party', sv: 'Födelsedagskalas' },
    steps: [
      { description: { en: 'It\'s your birthday!', sv: 'Det är din födelsedag!' }, arasaacId: 37363, order: 1 },
      { description: { en: 'Open presents', sv: 'Öppna presenter' }, arasaacId: 25381, order: 2 },
      { description: { en: 'Blow out candles', sv: 'Blås ut ljusen' }, arasaacId: 7258, order: 3 },
      { description: { en: 'Eat cake', sv: 'Ät tårta' }, arasaacId: 2502, order: 4 },
      { description: { en: 'Celebrate!', sv: 'Fira!' }, arasaacId: 16649, order: 5 },
    ],
  },

  // ═══════════════════════════════════════
  // NATURE / SCIENCE
  // ═══════════════════════════════════════

  // 13. Plant growth (Level 2 - 4 steps)
  {
    id: 'plant-growth',
    category: 'nature',
    level: 2,
    title: { en: 'How a plant grows', sv: 'Hur en växt växer' },
    steps: [
      { description: { en: 'Plant a seed', sv: 'Plantera ett frö' }, arasaacId: 7245, order: 1 },
      { description: { en: 'Water the plant', sv: 'Vattna växten' }, arasaacId: 32464, order: 2 },
      { description: { en: 'A sprout appears', sv: 'En grodd kommer upp' }, arasaacId: 17183, order: 3 },
      { description: { en: 'A flower blooms', sv: 'En blomma blommar' }, arasaacId: 7104, order: 4 },
    ],
  },

  // 14. The seasons (Level 2 - 4 steps)
  {
    id: 'seasons',
    category: 'nature',
    level: 2,
    title: { en: 'The four seasons', sv: 'Årstiderna' },
    steps: [
      { description: { en: 'Spring', sv: 'Vår' }, arasaacId: 5553, order: 1 },
      { description: { en: 'Summer', sv: 'Sommar' }, arasaacId: 5604, order: 2 },
      { description: { en: 'Autumn', sv: 'Höst' }, arasaacId: 5531, order: 3 },
      { description: { en: 'Winter', sv: 'Vinter' }, arasaacId: 5493, order: 4 },
    ],
  },

  // 15. Rainy day (Level 1 - 3 steps)
  {
    id: 'rainy-day',
    category: 'nature',
    level: 1,
    title: { en: 'A rainy day', sv: 'En regnig dag' },
    steps: [
      { description: { en: 'Clouds in the sky', sv: 'Moln på himlen' }, arasaacId: 34383, order: 1 },
      { description: { en: 'It starts to rain', sv: 'Det börjar regna' }, arasaacId: 7148, order: 2 },
      { description: { en: 'Take an umbrella', sv: 'Ta ett paraply' }, arasaacId: 2500, order: 3 },
    ],
  },

  // ═══════════════════════════════════════
  // STORIES (3-picture narratives)
  // ═══════════════════════════════════════

  // 16. Going swimming (Level 1 - 3 steps)
  {
    id: 'go-swimming',
    category: 'stories',
    level: 1,
    title: { en: 'Going swimming', sv: 'Bada' },
    steps: [
      { description: { en: 'Put on swimsuit', sv: 'Ta på baddräkt' }, arasaacId: 2270, order: 1 },
      { description: { en: 'Take a shower', sv: 'Duscha' }, arasaacId: 26803, order: 2 },
      { description: { en: 'Swim!', sv: 'Simma!' }, arasaacId: 6568, order: 3 },
    ],
  },

  // 17. Bedtime (Level 2 - 4 steps)
  {
    id: 'bedtime',
    category: 'stories',
    level: 2,
    title: { en: 'Bedtime', sv: 'Läggdags' },
    steps: [
      { description: { en: 'Put on pajamas', sv: 'Ta på pyjamas' }, arasaacId: 2522, order: 1 },
      { description: { en: 'Brush teeth', sv: 'Borsta tänderna' }, arasaacId: 2737, order: 2 },
      { description: { en: 'Read a book', sv: 'Läs en bok' }, arasaacId: 7141, order: 3 },
      { description: { en: 'Go to sleep', sv: 'Sov gott' }, arasaacId: 6479, order: 4 },
    ],
  },

  // 18. Visit the library (Level 3 - 5 steps)
  {
    id: 'visit-library',
    category: 'stories',
    level: 3,
    title: { en: 'Visit the library', sv: 'Besök biblioteket' },
    steps: [
      { description: { en: 'Go to the library', sv: 'Gå till biblioteket' }, arasaacId: 6063, order: 1 },
      { description: { en: 'Show your card', sv: 'Visa ditt kort' }, arasaacId: 17208, order: 2 },
      { description: { en: 'Find a book', sv: 'Hitta en bok' }, arasaacId: 25191, order: 3 },
      { description: { en: 'Read the book', sv: 'Läs boken' }, arasaacId: 7141, order: 4 },
      { description: { en: 'Return the book', sv: 'Lämna tillbaka boken' }, arasaacId: 29714, order: 5 },
    ],
  },
];

/**
 * Get ARASAAC pictogram URL for a given ID
 */
export function getArasaacUrl(id) {
  return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
}

/**
 * Get sequences filtered by category and/or level
 */
export function getSequences({ category, level } = {}) {
  let filtered = sequences;
  if (category) filtered = filtered.filter(s => s.category === category);
  if (level) filtered = filtered.filter(s => s.level === level);
  return filtered;
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
