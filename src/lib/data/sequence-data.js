/**
 * Sequence Data for Sequence Trainer
 *
 * Each sequence has:
 * - id: unique identifier
 * - category: grouping category
 * - level: difficulty (1=3 steps, 2=4 steps, 3=5-6 steps)
 * - title: { en, sv, pt_BR } translations
 * - steps: ordered array with description (en/sv/pt_BR), ARASAAC pictogram ID, order
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

/** @type {Array<{id: string, category: string, level: number, title: {en: string, sv: string, pt_BR: string}, steps: Array<{description: {en: string, sv: string, pt_BR: string}, arasaacId: number, order: number}>}>} */
export const sequences = [
  // ═══════════════════════════════════════
  // DAILY ROUTINES
  // ═══════════════════════════════════════

  // 1. Brush teeth (Level 1 - 3 steps)
  {
    id: 'brush-teeth-easy',
    category: 'daily',
    level: 1,
    title: { en: 'Brush your teeth', sv: 'Borsta tänderna', pt_BR: 'Escovar os dentes' },
    steps: [
      { description: { en: 'Get the toothbrush', sv: 'Ta tandborsten', pt_BR: 'Pegue a escova de dentes' }, arasaacId: 2694, order: 1 },
      { description: { en: 'Put toothpaste on', sv: 'Lägg på tandkräm', pt_BR: 'Coloque a pasta de dente' }, arasaacId: 2858, order: 2 },
      { description: { en: 'Brush your teeth', sv: 'Borsta tänderna', pt_BR: 'Escove os dentes' }, arasaacId: 2737, order: 3 },
    ],
  },

  // 2. Brush teeth full (Level 3 - 5 steps)
  {
    id: 'brush-teeth-full',
    category: 'daily',
    level: 3,
    title: { en: 'Brush teeth (all steps)', sv: 'Borsta tänderna (alla steg)', pt_BR: 'Escovar os dentes (todos os passos)' },
    steps: [
      { description: { en: 'Get the toothbrush', sv: 'Ta tandborsten', pt_BR: 'Pegue a escova de dentes' }, arasaacId: 2694, order: 1 },
      { description: { en: 'Put toothpaste on', sv: 'Lägg på tandkräm', pt_BR: 'Coloque a pasta de dente' }, arasaacId: 2858, order: 2 },
      { description: { en: 'Brush your teeth', sv: 'Borsta tänderna', pt_BR: 'Escove os dentes' }, arasaacId: 2737, order: 3 },
      { description: { en: 'Rinse your mouth', sv: 'Skölj munnen', pt_BR: 'Enxágue a boca' }, arasaacId: 34824, order: 4 },
      { description: { en: 'Dry your mouth', sv: 'Torka munnen', pt_BR: 'Seque a boca' }, arasaacId: 2593, order: 5 },
    ],
  },

  // 3. Morning routine (Level 2 - 4 steps)
  {
    id: 'morning-routine',
    category: 'daily',
    level: 2,
    title: { en: 'Morning routine', sv: 'Morgonrutin', pt_BR: 'Rotina da manhã' },
    steps: [
      { description: { en: 'Wake up', sv: 'Vakna', pt_BR: 'Acorde' }, arasaacId: 8989, order: 1 },
      { description: { en: 'Get dressed', sv: 'Klä på dig', pt_BR: 'Vista a roupa' }, arasaacId: 6627, order: 2 },
      { description: { en: 'Eat breakfast', sv: 'Ät frukost', pt_BR: 'Tome o café da manhã' }, arasaacId: 4626, order: 3 },
      { description: { en: 'Go to school', sv: 'Gå till skolan', pt_BR: 'Vá para a escola' }, arasaacId: 32446, order: 4 },
    ],
  },

  // 4. Wash hands (Level 1 - 3 steps)
  {
    id: 'wash-hands',
    category: 'daily',
    level: 1,
    title: { en: 'Wash your hands', sv: 'Tvätta händerna', pt_BR: 'Lavar as mãos' },
    steps: [
      { description: { en: 'Turn on the water', sv: 'Starta vattnet', pt_BR: 'Abra a torneira' }, arasaacId: 32650, order: 1 },
      { description: { en: 'Use soap', sv: 'Använd tvål', pt_BR: 'Use sabonete' }, arasaacId: 34846, order: 2 },
      { description: { en: 'Dry with towel', sv: 'Torka med handduk', pt_BR: 'Seque com a toalha' }, arasaacId: 2593, order: 3 },
    ],
  },

  // 5. Get dressed (Level 3 - 5 steps)
  {
    id: 'get-dressed',
    category: 'daily',
    level: 3,
    title: { en: 'Get dressed', sv: 'Klä på dig', pt_BR: 'Se vestir' },
    steps: [
      { description: { en: 'Put on underwear', sv: 'Ta på underkläder', pt_BR: 'Vista a cueca ou a calcinha' }, arasaacId: 25680, order: 1 },
      { description: { en: 'Put on shirt', sv: 'Ta på tröja', pt_BR: 'Vista a camiseta' }, arasaacId: 13640, order: 2 },
      { description: { en: 'Put on pants', sv: 'Ta på byxor', pt_BR: 'Vista a calça' }, arasaacId: 2565, order: 3 },
      { description: { en: 'Put on socks', sv: 'Ta på strumpor', pt_BR: 'Calce as meias' }, arasaacId: 2298, order: 4 },
      { description: { en: 'Put on shoes', sv: 'Ta på skor', pt_BR: 'Calce os sapatos' }, arasaacId: 2622, order: 5 },
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
    title: { en: 'Make a sandwich', sv: 'Gör en smörgås', pt_BR: 'Fazer um sanduíche' },
    steps: [
      { description: { en: 'Get bread', sv: 'Ta bröd', pt_BR: 'Pegue o pão' }, arasaacId: 2494, order: 1 },
      { description: { en: 'Put on butter', sv: 'Lägg på smör', pt_BR: 'Passe manteiga' }, arasaacId: 2461, order: 2 },
      { description: { en: 'Put on cheese', sv: 'Lägg på ost', pt_BR: 'Coloque o queijo' }, arasaacId: 2541, order: 3 },
    ],
  },

  // 7. Make a sandwich full (Level 3 - 5 steps)
  {
    id: 'sandwich-full',
    category: 'cooking',
    level: 3,
    title: { en: 'Make a sandwich (all steps)', sv: 'Gör en smörgås (alla steg)', pt_BR: 'Fazer um sanduíche (todos os passos)' },
    steps: [
      { description: { en: 'Get bread', sv: 'Ta bröd', pt_BR: 'Pegue o pão' }, arasaacId: 2494, order: 1 },
      { description: { en: 'Spread butter', sv: 'Bre smör', pt_BR: 'Passe manteiga' }, arasaacId: 2461, order: 2 },
      { description: { en: 'Add cheese', sv: 'Lägg på ost', pt_BR: 'Coloque o queijo' }, arasaacId: 2541, order: 3 },
      { description: { en: 'Close the sandwich', sv: 'Stäng smörgåsen', pt_BR: 'Feche o sanduíche' }, arasaacId: 2281, order: 4 },
      { description: { en: 'Eat!', sv: 'Ät!', pt_BR: 'Coma!' }, arasaacId: 6456, order: 5 },
    ],
  },

  // 8. Bake a cake (Level 3 - 5 steps)
  {
    id: 'bake-cake',
    category: 'cooking',
    level: 3,
    title: { en: 'Bake a cake', sv: 'Baka en kaka', pt_BR: 'Fazer um bolo' },
    steps: [
      { description: { en: 'Get flour', sv: 'Ta mjöl', pt_BR: 'Pegue a farinha' }, arasaacId: 8600, order: 1 },
      { description: { en: 'Add eggs', sv: 'Lägg i ägg', pt_BR: 'Adicione os ovos' }, arasaacId: 2427, order: 2 },
      { description: { en: 'Mix together', sv: 'Blanda ihop', pt_BR: 'Misture tudo' }, arasaacId: 25738, order: 3 },
      { description: { en: 'Put in oven', sv: 'Sätt i ugnen', pt_BR: 'Coloque no forno' }, arasaacId: 2426, order: 4 },
      { description: { en: 'The cake is done!', sv: 'Kakan är klar!', pt_BR: 'O bolo está pronto!' }, arasaacId: 2502, order: 5 },
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
    title: { en: 'Meet a friend', sv: 'Träffa en kompis', pt_BR: 'Encontrar um amigo' },
    steps: [
      { description: { en: 'See your friend', sv: 'Se din kompis', pt_BR: 'Veja seu amigo' }, arasaacId: 25790, order: 1 },
      { description: { en: 'Wave hello', sv: 'Vinka hej', pt_BR: 'Acene para dar oi' }, arasaacId: 4706, order: 2 },
      { description: { en: 'Play together', sv: 'Leka tillsammans', pt_BR: 'Brinquem juntos' }, arasaacId: 23392, order: 3 },
    ],
  },

  // 10. Meet a friend full (Level 2 - 4 steps)
  {
    id: 'meet-friend-full',
    category: 'social',
    level: 2,
    title: { en: 'Meet a friend (all steps)', sv: 'Träffa en kompis (alla steg)', pt_BR: 'Encontrar um amigo (todos os passos)' },
    steps: [
      { description: { en: 'See your friend', sv: 'Se din kompis', pt_BR: 'Veja seu amigo' }, arasaacId: 25790, order: 1 },
      { description: { en: 'Wave hello', sv: 'Vinka hej', pt_BR: 'Acene para dar oi' }, arasaacId: 4706, order: 2 },
      { description: { en: 'Say hello', sv: 'Säg hej', pt_BR: 'Diga oi' }, arasaacId: 6522, order: 3 },
      { description: { en: 'Play together', sv: 'Leka tillsammans', pt_BR: 'Brinquem juntos' }, arasaacId: 23392, order: 4 },
    ],
  },

  // 11. Go shopping (Level 2 - 4 steps)
  {
    id: 'go-shopping',
    category: 'social',
    level: 2,
    title: { en: 'Go shopping', sv: 'Handla', pt_BR: 'Fazer compras' },
    steps: [
      { description: { en: 'Go to the store', sv: 'Gå till affären', pt_BR: 'Vá ao mercado' }, arasaacId: 35695, order: 1 },
      { description: { en: 'Get a cart', sv: 'Ta en kundvagn', pt_BR: 'Pegue um carrinho' }, arasaacId: 30618, order: 2 },
      { description: { en: 'Pay with money', sv: 'Betala med pengar', pt_BR: 'Pague com dinheiro' }, arasaacId: 6457, order: 3 },
      { description: { en: 'Carry the bag', sv: 'Bär kassen', pt_BR: 'Leve a sacola' }, arasaacId: 23849, order: 4 },
    ],
  },

  // 12. Birthday party (Level 3 - 5 steps)
  {
    id: 'birthday-party',
    category: 'social',
    level: 3,
    title: { en: 'Birthday party', sv: 'Födelsedagskalas', pt_BR: 'Festa de aniversário' },
    steps: [
      { description: { en: 'It\'s your birthday!', sv: 'Det är din födelsedag!', pt_BR: 'É o seu aniversário!' }, arasaacId: 37363, order: 1 },
      { description: { en: 'Open presents', sv: 'Öppna presenter', pt_BR: 'Abra os presentes' }, arasaacId: 25381, order: 2 },
      { description: { en: 'Blow out candles', sv: 'Blås ut ljusen', pt_BR: 'Apague as velinhas' }, arasaacId: 7258, order: 3 },
      { description: { en: 'Eat cake', sv: 'Ät tårta', pt_BR: 'Coma o bolo' }, arasaacId: 2502, order: 4 },
      { description: { en: 'Celebrate!', sv: 'Fira!', pt_BR: 'Comemore!' }, arasaacId: 16649, order: 5 },
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
    title: { en: 'How a plant grows', sv: 'Hur en växt växer', pt_BR: 'Como uma planta cresce' },
    steps: [
      { description: { en: 'Plant a seed', sv: 'Plantera ett frö', pt_BR: 'Plante uma semente' }, arasaacId: 7245, order: 1 },
      { description: { en: 'Water the plant', sv: 'Vattna växten', pt_BR: 'Regue a planta' }, arasaacId: 32464, order: 2 },
      { description: { en: 'A sprout appears', sv: 'En grodd kommer upp', pt_BR: 'Aparece um brotinho' }, arasaacId: 17183, order: 3 },
      { description: { en: 'A flower blooms', sv: 'En blomma blommar', pt_BR: 'A flor desabrocha' }, arasaacId: 7104, order: 4 },
    ],
  },

  // 14. The seasons (Level 2 - 4 steps)
  {
    id: 'seasons',
    category: 'nature',
    level: 2,
    title: { en: 'The four seasons', sv: 'Årstiderna', pt_BR: 'As quatro estações' },
    steps: [
      { description: { en: 'Spring', sv: 'Vår', pt_BR: 'Primavera' }, arasaacId: 5553, order: 1 },
      { description: { en: 'Summer', sv: 'Sommar', pt_BR: 'Verão' }, arasaacId: 5604, order: 2 },
      { description: { en: 'Autumn', sv: 'Höst', pt_BR: 'Outono' }, arasaacId: 5531, order: 3 },
      { description: { en: 'Winter', sv: 'Vinter', pt_BR: 'Inverno' }, arasaacId: 5493, order: 4 },
    ],
  },

  // 15. Rainy day (Level 1 - 3 steps)
  {
    id: 'rainy-day',
    category: 'nature',
    level: 1,
    title: { en: 'A rainy day', sv: 'En regnig dag', pt_BR: 'Um dia de chuva' },
    steps: [
      { description: { en: 'Clouds in the sky', sv: 'Moln på himlen', pt_BR: 'Nuvens no céu' }, arasaacId: 34383, order: 1 },
      { description: { en: 'It starts to rain', sv: 'Det börjar regna', pt_BR: 'Começa a chover' }, arasaacId: 7148, order: 2 },
      { description: { en: 'Take an umbrella', sv: 'Ta ett paraply', pt_BR: 'Pegue o guarda-chuva' }, arasaacId: 2500, order: 3 },
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
    title: { en: 'Going swimming', sv: 'Bada', pt_BR: 'Ir nadar' },
    steps: [
      { description: { en: 'Put on swimsuit', sv: 'Ta på baddräkt', pt_BR: 'Vista o maiô ou a sunga' }, arasaacId: 2270, order: 1 },
      { description: { en: 'Take a shower', sv: 'Duscha', pt_BR: 'Tome banho' }, arasaacId: 26803, order: 2 },
      { description: { en: 'Swim!', sv: 'Simma!', pt_BR: 'Nade!' }, arasaacId: 6568, order: 3 },
    ],
  },

  // 17. Bedtime (Level 2 - 4 steps)
  {
    id: 'bedtime',
    category: 'stories',
    level: 2,
    title: { en: 'Bedtime', sv: 'Läggdags', pt_BR: 'Hora de dormir' },
    steps: [
      { description: { en: 'Put on pajamas', sv: 'Ta på pyjamas', pt_BR: 'Vista o pijama' }, arasaacId: 2522, order: 1 },
      { description: { en: 'Brush teeth', sv: 'Borsta tänderna', pt_BR: 'Escove os dentes' }, arasaacId: 2737, order: 2 },
      { description: { en: 'Read a book', sv: 'Läs en bok', pt_BR: 'Leia um livro' }, arasaacId: 7141, order: 3 },
      { description: { en: 'Go to sleep', sv: 'Sov gott', pt_BR: 'Vá dormir' }, arasaacId: 6479, order: 4 },
    ],
  },

  // 18. Visit the library (Level 3 - 5 steps)
  {
    id: 'visit-library',
    category: 'stories',
    level: 3,
    title: { en: 'Visit the library', sv: 'Besök biblioteket', pt_BR: 'Visitar a biblioteca' },
    steps: [
      { description: { en: 'Go to the library', sv: 'Gå till biblioteket', pt_BR: 'Vá até a biblioteca' }, arasaacId: 6063, order: 1 },
      { description: { en: 'Show your card', sv: 'Visa ditt kort', pt_BR: 'Mostre sua carteirinha' }, arasaacId: 17208, order: 2 },
      { description: { en: 'Find a book', sv: 'Hitta en bok', pt_BR: 'Encontre um livro' }, arasaacId: 25191, order: 3 },
      { description: { en: 'Read the book', sv: 'Läs boken', pt_BR: 'Leia o livro' }, arasaacId: 7141, order: 4 },
      { description: { en: 'Return the book', sv: 'Lämna tillbaka boken', pt_BR: 'Devolva o livro' }, arasaacId: 6474, order: 5 },
    ],
  },
];

/**
 * Get ARASAAC pictogram URL for a given ID
 */
/** @param {number} id */
export function getArasaacUrl(id) {
  return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
}

/**
 * Get sequences filtered by category and/or level
 */
/** @param {{ category?: string, level?: number }} options */
export function getSequences({ category, level } = {}) {
  let filtered = sequences;
  if (category) filtered = filtered.filter(s => s.category === category);
  if (level) filtered = filtered.filter(s => s.level === level);
  return filtered;
}

/**
 * Shuffle an array (Fisher-Yates)
 */
/** @template T @param {T[]} arr @returns {T[]} */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
