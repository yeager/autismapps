/**
 * Sagostunden — word bank with ARASAAC pictogram IDs
 * ~170 words across 6 categories with grammatical gender (sv: en/ett, pt-BR: m/f).
 * The IDs were checked against the ARASAAC API (keywords in pt-BR) — most of the old ones were wrong.
 */

export type Gender = 'en' | 'ett';
export type WordCategory = 'djur' | 'platser' | 'saker' | 'mat' | 'personer' | 'verb';

export interface WordPt {
  text: string;
  /** Grammatical gender; verbs have none */
  gender?: 'm' | 'f';
  /** Pictogram for the pt concept when it differs from the Swedish one */
  arasaac?: number;
}

export interface Word {
  id: string;
  sv: string;
  en: string;
  gender: Gender;
  category: WordCategory;
  arasaac: number;
  plural?: string;
  pt_BR: WordPt;
}

export const WORD_CATEGORIES: Record<WordCategory, { label: string; emoji: string }> = {
  djur:     { label: 'sagostunden.cat.animals', emoji: '🐾' },
  platser:  { label: 'sagostunden.cat.places', emoji: '🏠' },
  saker:    { label: 'sagostunden.cat.things', emoji: '🎁' },
  mat:      { label: 'sagostunden.cat.food', emoji: '🍎' },
  personer: { label: 'sagostunden.cat.people', emoji: '👤' },
  verb:     { label: 'sagostunden.cat.actions', emoji: '⚡' },
};

export const ALL_WORDS: Word[] = [
  // === DJUR (30) ===
  { id: 'katt', sv: 'katt', en: 'cat', gender: 'en', category: 'djur', arasaac: 7114, plural: 'katter', pt_BR: { text: 'gato', gender: 'm' } },
  { id: 'hund', sv: 'hund', en: 'dog', gender: 'en', category: 'djur', arasaac: 2517, plural: 'hundar', pt_BR: { text: 'cachorro', gender: 'm' } },
  { id: 'kanin', sv: 'kanin', en: 'rabbit', gender: 'en', category: 'djur', arasaac: 2351, plural: 'kaniner', pt_BR: { text: 'coelho', gender: 'm' } },
  { id: 'häst', sv: 'häst', en: 'horse', gender: 'en', category: 'djur', arasaac: 2294, plural: 'hästar', pt_BR: { text: 'cavalo', gender: 'm' } },
  { id: 'ko', sv: 'ko', en: 'cow', gender: 'en', category: 'djur', arasaac: 2609, plural: 'kor', pt_BR: { text: 'vaca', gender: 'f' } },
  { id: 'gris', sv: 'gris', en: 'pig', gender: 'en', category: 'djur', arasaac: 24972, plural: 'grisar', pt_BR: { text: 'porco', gender: 'm' } },
  { id: 'anka', sv: 'anka', en: 'duck', gender: 'en', category: 'djur', arasaac: 2563, plural: 'ankor', pt_BR: { text: 'pato', gender: 'm' } },
  { id: 'fågel', sv: 'fågel', en: 'bird', gender: 'en', category: 'djur', arasaac: 2490, plural: 'fåglar', pt_BR: { text: 'pássaro', gender: 'm' } },
  { id: 'fisk', sv: 'fisk', en: 'fish', gender: 'en', category: 'djur', arasaac: 2520, plural: 'fiskar', pt_BR: { text: 'peixe', gender: 'm' } },
  { id: 'fjäril', sv: 'fjäril', en: 'butterfly', gender: 'en', category: 'djur', arasaac: 2465, plural: 'fjärilar', pt_BR: { text: 'borboleta', gender: 'f' } },
  { id: 'björn', sv: 'björn', en: 'bear', gender: 'en', category: 'djur', arasaac: 2488, plural: 'björnar', pt_BR: { text: 'urso', gender: 'm' } },
  { id: 'räv', sv: 'räv', en: 'fox', gender: 'en', category: 'djur', arasaac: 2623, plural: 'rävar', pt_BR: { text: 'raposa', gender: 'f' } },
  { id: 'älg', sv: 'älg', en: 'moose', gender: 'en', category: 'djur', arasaac: 8010, plural: 'älgar', pt_BR: { text: 'alce', gender: 'm' } },
  { id: 'uggla', sv: 'uggla', en: 'owl', gender: 'en', category: 'djur', arasaac: 2671, plural: 'ugglor', pt_BR: { text: 'coruja', gender: 'f' } },
  { id: 'groda', sv: 'groda', en: 'frog', gender: 'en', category: 'djur', arasaac: 2543, plural: 'grodor', pt_BR: { text: 'sapo', gender: 'm' } },
  { id: 'sköldpadda', sv: 'sköldpadda', en: 'turtle', gender: 'en', category: 'djur', arasaac: 10241, plural: 'sköldpaddor', pt_BR: { text: 'tartaruga', gender: 'f' } },
  { id: 'snigel', sv: 'snigel', en: 'snail', gender: 'en', category: 'djur', arasaac: 8061, plural: 'sniglar', pt_BR: { text: 'caracol', gender: 'm' } },
  { id: 'spindel', sv: 'spindel', en: 'spider', gender: 'en', category: 'djur', arasaac: 38275, plural: 'spindlar', pt_BR: { text: 'aranha', gender: 'f' } },
  { id: 'elefant', sv: 'elefant', en: 'elephant', gender: 'en', category: 'djur', arasaac: 2372, plural: 'elefanter', pt_BR: { text: 'elefante', gender: 'm' } },
  { id: 'lejon', sv: 'lejon', en: 'lion', gender: 'ett', category: 'djur', arasaac: 25187, plural: 'lejon', pt_BR: { text: 'leão', gender: 'm' } },
  { id: 'apa', sv: 'apa', en: 'monkey', gender: 'en', category: 'djur', arasaac: 2477, plural: 'apor', pt_BR: { text: 'macaco', gender: 'm' } },
  { id: 'orm', sv: 'orm', en: 'snake', gender: 'en', category: 'djur', arasaac: 2568, plural: 'ormar', pt_BR: { text: 'cobra', gender: 'f' } },
  { id: 'myra', sv: 'myra', en: 'ant', gender: 'en', category: 'djur', arasaac: 2425, plural: 'myror', pt_BR: { text: 'formiga', gender: 'f' } },
  { id: 'bi', sv: 'bi', en: 'bee', gender: 'ett', category: 'djur', arasaac: 24823, plural: 'bin', pt_BR: { text: 'abelha', gender: 'f' } },
  { id: 'val', sv: 'val', en: 'whale', gender: 'en', category: 'djur', arasaac: 2268, plural: 'valar', pt_BR: { text: 'baleia', gender: 'f' } },
  { id: 'delfin', sv: 'delfin', en: 'dolphin', gender: 'en', category: 'djur', arasaac: 2732, plural: 'delfiner', pt_BR: { text: 'golfinho', gender: 'm' } },
  { id: 'panda', sv: 'panda', en: 'panda', gender: 'en', category: 'djur', arasaac: 2869, plural: 'pandor', pt_BR: { text: 'panda', gender: 'm' } },
  { id: 'pingvin', sv: 'pingvin', en: 'penguin', gender: 'en', category: 'djur', arasaac: 3243, plural: 'pingviner', pt_BR: { text: 'pinguim', gender: 'm' } },
  { id: 'mus', sv: 'mus', en: 'mouse', gender: 'en', category: 'djur', arasaac: 2546, plural: 'möss', pt_BR: { text: 'rato', gender: 'm' } },
  { id: 'får', sv: 'får', en: 'sheep', gender: 'ett', category: 'djur', arasaac: 2489, plural: 'får', pt_BR: { text: 'ovelha', gender: 'f' } },

  // === PLATSER (25) ===
  { id: 'skog', sv: 'skog', en: 'forest', gender: 'en', category: 'platser', arasaac: 2666, pt_BR: { text: 'floresta', gender: 'f' } },
  { id: 'sjö', sv: 'sjö', en: 'lake', gender: 'en', category: 'platser', arasaac: 6022, pt_BR: { text: 'lago', gender: 'm' } },
  { id: 'berg', sv: 'berg', en: 'mountain', gender: 'ett', category: 'platser', arasaac: 2909, pt_BR: { text: 'montanha', gender: 'f' } },
  { id: 'strand', sv: 'strand', en: 'beach', gender: 'en', category: 'platser', arasaac: 30518, pt_BR: { text: 'praia', gender: 'f' } },
  { id: 'hus', sv: 'hus', en: 'house', gender: 'ett', category: 'platser', arasaac: 2317, pt_BR: { text: 'casa', gender: 'f' } },
  { id: 'slott', sv: 'slott', en: 'castle', gender: 'ett', category: 'platser', arasaac: 5950, pt_BR: { text: 'castelo', gender: 'm' } },
  { id: 'trädgård', sv: 'trädgård', en: 'garden', gender: 'en', category: 'platser', arasaac: 2434, pt_BR: { text: 'jardim', gender: 'm' } },
  { id: 'skola', sv: 'skola', en: 'school', gender: 'en', category: 'platser', arasaac: 3082, pt_BR: { text: 'escola', gender: 'f' } },
  { id: 'park', sv: 'park', en: 'park', gender: 'en', category: 'platser', arasaac: 6184, pt_BR: { text: 'praça', gender: 'f' } },
  { id: 'stad', sv: 'stad', en: 'city', gender: 'en', category: 'platser', arasaac: 2704, pt_BR: { text: 'cidade', gender: 'f' } },
  { id: 'bondgård', sv: 'bondgård', en: 'farm', gender: 'en', category: 'platser', arasaac: 32482, pt_BR: { text: 'fazenda', gender: 'f' } },
  { id: 'hav', sv: 'hav', en: 'ocean', gender: 'ett', category: 'platser', arasaac: 2925, pt_BR: { text: 'mar', gender: 'm' } },
  { id: 'grotta', sv: 'grotta', en: 'cave', gender: 'en', category: 'platser', arasaac: 2729, pt_BR: { text: 'caverna', gender: 'f' } },
  { id: 'bro', sv: 'bro', en: 'bridge', gender: 'en', category: 'platser', arasaac: 6194, pt_BR: { text: 'ponte', gender: 'f' } },
  { id: 'torn', sv: 'torn', en: 'tower', gender: 'ett', category: 'platser', arasaac: 6232, pt_BR: { text: 'torre', gender: 'f' } },
  { id: 'bibliotek', sv: 'bibliotek', en: 'library', gender: 'ett', category: 'platser', arasaac: 6063, pt_BR: { text: 'biblioteca', gender: 'f' } },
  { id: 'affär', sv: 'affär', en: 'shop', gender: 'en', category: 'platser', arasaac: 35695, pt_BR: { text: 'loja', gender: 'f' } },
  { id: 'lekplats', sv: 'lekplats', en: 'playground', gender: 'en', category: 'platser', arasaac: 38085, pt_BR: { text: 'parquinho', gender: 'm' } },
  { id: 'rymden', sv: 'rymden', en: 'space', gender: 'en', category: 'platser', arasaac: 25074, pt_BR: { text: 'espaço', gender: 'm' } },
  { id: 'ö', sv: 'ö', en: 'island', gender: 'en', category: 'platser', arasaac: 2966, pt_BR: { text: 'ilha', gender: 'f' } },
  { id: 'vulkan', sv: 'vulkan', en: 'volcano', gender: 'en', category: 'platser', arasaac: 6247, pt_BR: { text: 'vulcão', gender: 'm' } },
  { id: 'äng', sv: 'äng', en: 'meadow', gender: 'en', category: 'platser', arasaac: 2683, pt_BR: { text: 'campo', gender: 'm' } },
  { id: 'flod', sv: 'flod', en: 'river', gender: 'en', category: 'platser', arasaac: 2811, pt_BR: { text: 'rio', gender: 'm' } },
  { id: 'cirkus', sv: 'cirkus', en: 'circus', gender: 'en', category: 'platser', arasaac: 6450, pt_BR: { text: 'circo', gender: 'm' } },
  { id: 'zoo', sv: 'zoo', en: 'zoo', gender: 'ett', category: 'platser', arasaac: 4773, pt_BR: { text: 'zoológico', gender: 'm' } },

  // === SAKER (30) ===
  { id: 'boll', sv: 'boll', en: 'ball', gender: 'en', category: 'saker', arasaac: 2269, pt_BR: { text: 'bola', gender: 'f' } },
  { id: 'bok', sv: 'bok', en: 'book', gender: 'en', category: 'saker', arasaac: 2450, pt_BR: { text: 'livro', gender: 'm' } },
  { id: 'nyckel', sv: 'nyckel', en: 'key', gender: 'en', category: 'saker', arasaac: 8153, pt_BR: { text: 'chave', gender: 'f' } },
  { id: 'karta', sv: 'karta', en: 'map', gender: 'en', category: 'saker', arasaac: 5505, pt_BR: { text: 'mapa', gender: 'm' } },
  { id: 'stjärna', sv: 'stjärna', en: 'star', gender: 'en', category: 'saker', arasaac: 4644, pt_BR: { text: 'estrela', gender: 'f' } },
  { id: 'krona', sv: 'krona', en: 'crown', gender: 'en', category: 'saker', arasaac: 2718, pt_BR: { text: 'coroa', gender: 'f' } },
  { id: 'svärd', sv: 'svärd', en: 'sword', gender: 'ett', category: 'saker', arasaac: 7093, pt_BR: { text: 'espada', gender: 'f' } },
  { id: 'trollstav', sv: 'trollstav', en: 'magic wand', gender: 'en', category: 'saker', arasaac: 6240, pt_BR: { text: 'varinha mágica', gender: 'f' } },
  { id: 'skattkista', sv: 'skattkista', en: 'treasure chest', gender: 'en', category: 'saker', arasaac: 5966, pt_BR: { text: 'baú do tesouro', gender: 'm' } },
  { id: 'båt', sv: 'båt', en: 'boat', gender: 'en', category: 'saker', arasaac: 6932, pt_BR: { text: 'barco', gender: 'm' } },
  { id: 'cykel', sv: 'cykel', en: 'bicycle', gender: 'en', category: 'saker', arasaac: 6935, pt_BR: { text: 'bicicleta', gender: 'f' } },
  { id: 'bil', sv: 'bil', en: 'car', gender: 'en', category: 'saker', arasaac: 2339, pt_BR: { text: 'carro', gender: 'm' } },
  { id: 'tåg', sv: 'tåg', en: 'train', gender: 'ett', category: 'saker', arasaac: 2603, pt_BR: { text: 'trem', gender: 'm' } },
  { id: 'flygplan', sv: 'flygplan', en: 'airplane', gender: 'ett', category: 'saker', arasaac: 6924, pt_BR: { text: 'avião', gender: 'm' } },
  { id: 'raket', sv: 'raket', en: 'rocket', gender: 'en', category: 'saker', arasaac: 2344, pt_BR: { text: 'foguete', gender: 'm' } },
  { id: 'ballong', sv: 'ballong', en: 'balloon', gender: 'en', category: 'saker', arasaac: 2408, pt_BR: { text: 'balão', gender: 'm' } },
  { id: 'present', sv: 'present', en: 'gift', gender: 'en', category: 'saker', arasaac: 25381, pt_BR: { text: 'presente', gender: 'm' } },
  { id: 'lampa', sv: 'lampa', en: 'lamp', gender: 'en', category: 'saker', arasaac: 4936, pt_BR: { text: 'abajur', gender: 'm' } },
  { id: 'spegel', sv: 'spegel', en: 'mirror', gender: 'en', category: 'saker', arasaac: 8573, pt_BR: { text: 'espelho', gender: 'm' } },
  { id: 'paraply', sv: 'paraply', en: 'umbrella', gender: 'ett', category: 'saker', arasaac: 2500, pt_BR: { text: 'guarda-chuva', gender: 'm' } },
  { id: 'blomma', sv: 'blomma', en: 'flower', gender: 'en', category: 'saker', arasaac: 7104, pt_BR: { text: 'flor', gender: 'f' } },
  { id: 'träd', sv: 'träd', en: 'tree', gender: 'ett', category: 'saker', arasaac: 3057, pt_BR: { text: 'árvore', gender: 'f' } },
  { id: 'sol', sv: 'sol', en: 'sun', gender: 'en', category: 'saker', arasaac: 7252, pt_BR: { text: 'sol', gender: 'm' } },
  { id: 'måne', sv: 'måne', en: 'moon', gender: 'en', category: 'saker', arasaac: 2933, pt_BR: { text: 'lua', gender: 'f' } },
  { id: 'moln', sv: 'moln', en: 'cloud', gender: 'ett', category: 'saker', arasaac: 2883, pt_BR: { text: 'nuvem', gender: 'f' } },
  { id: 'regnbåge', sv: 'regnbåge', en: 'rainbow', gender: 'en', category: 'saker', arasaac: 2986, pt_BR: { text: 'arco-íris', gender: 'm' } },
  { id: 'hjärta', sv: 'hjärta', en: 'heart', gender: 'ett', category: 'saker', arasaac: 4613, pt_BR: { text: 'coração', gender: 'm' } },
  { id: 'diamant', sv: 'diamant', en: 'diamond', gender: 'en', category: 'saker', arasaac: 6475, pt_BR: { text: 'diamante', gender: 'm' } },
  { id: 'gitarr', sv: 'gitarr', en: 'guitar', gender: 'en', category: 'saker', arasaac: 2417, pt_BR: { text: 'violão', gender: 'm' } },
  { id: 'trumma', sv: 'trumma', en: 'drum', gender: 'en', category: 'saker', arasaac: 2578, pt_BR: { text: 'tambor', gender: 'm' } },

  // === MAT (25) ===
  { id: 'äpple', sv: 'äpple', en: 'apple', gender: 'ett', category: 'mat', arasaac: 2462, pt_BR: { text: 'maçã', gender: 'f' } },
  { id: 'banan', sv: 'banan', en: 'banana', gender: 'en', category: 'mat', arasaac: 2530, pt_BR: { text: 'banana', gender: 'f' } },
  { id: 'jordgubbe', sv: 'jordgubbe', en: 'strawberry', gender: 'en', category: 'mat', arasaac: 2400, pt_BR: { text: 'morango', gender: 'm' } },
  { id: 'morot', sv: 'morot', en: 'carrot', gender: 'en', category: 'mat', arasaac: 2619, pt_BR: { text: 'cenoura', gender: 'f' } },
  { id: 'glass', sv: 'glass', en: 'ice cream', gender: 'en', category: 'mat', arasaac: 2420, pt_BR: { text: 'sorvete', gender: 'm' } },
  { id: 'tårta', sv: 'tårta', en: 'cake', gender: 'en', category: 'mat', arasaac: 2579, pt_BR: { text: 'bolo', gender: 'm' } },
  { id: 'pizza', sv: 'pizza', en: 'pizza', gender: 'en', category: 'mat', arasaac: 2527, pt_BR: { text: 'pizza', gender: 'f' } },
  { id: 'smörgås', sv: 'smörgås', en: 'sandwich', gender: 'en', category: 'mat', arasaac: 2281, pt_BR: { text: 'sanduíche', gender: 'm' } },
  { id: 'soppa', sv: 'soppa', en: 'soup', gender: 'en', category: 'mat', arasaac: 2573, pt_BR: { text: 'sopa', gender: 'f' } },
  { id: 'pannkaka', sv: 'pannkaka', en: 'pancake', gender: 'en', category: 'mat', arasaac: 34233, pt_BR: { text: 'panqueca', gender: 'f' } },
  { id: 'choklad', sv: 'choklad', en: 'chocolate', gender: 'en', category: 'mat', arasaac: 25940, pt_BR: { text: 'chocolate', gender: 'm' } },
  { id: 'kaka', sv: 'kaka', en: 'cookie', gender: 'en', category: 'mat', arasaac: 8312, pt_BR: { text: 'biscoito', gender: 'm' } },
  { id: 'vattenmelon', sv: 'vattenmelon', en: 'watermelon', gender: 'en', category: 'mat', arasaac: 2557, pt_BR: { text: 'melancia', gender: 'f' } },
  { id: 'druva', sv: 'druva', en: 'grape', gender: 'en', category: 'mat', arasaac: 3247, pt_BR: { text: 'uva', gender: 'f' } },
  { id: 'päron', sv: 'päron', en: 'pear', gender: 'ett', category: 'mat', arasaac: 2561, pt_BR: { text: 'pera', gender: 'f' } },
  { id: 'tomat', sv: 'tomat', en: 'tomato', gender: 'en', category: 'mat', arasaac: 2594, pt_BR: { text: 'tomate', gender: 'm' } },
  { id: 'potatis', sv: 'potatis', en: 'potato', gender: 'en', category: 'mat', arasaac: 2503, pt_BR: { text: 'batata', gender: 'f' } },
  { id: 'bröd', sv: 'bröd', en: 'bread', gender: 'ett', category: 'mat', arasaac: 10230, pt_BR: { text: 'pão', gender: 'm' } },
  { id: 'ost', sv: 'ost', en: 'cheese', gender: 'en', category: 'mat', arasaac: 2541, pt_BR: { text: 'queijo', gender: 'm' } },
  { id: 'mjölk', sv: 'mjölk', en: 'milk', gender: 'en', category: 'mat', arasaac: 2445, pt_BR: { text: 'leite', gender: 'm' } },
  { id: 'juice', sv: 'juice', en: 'juice', gender: 'en', category: 'mat', arasaac: 11461, pt_BR: { text: 'suco', gender: 'm' } },
  { id: 'vatten', sv: 'vatten', en: 'water', gender: 'ett', category: 'mat', arasaac: 32464, pt_BR: { text: 'água', gender: 'f' } },
  { id: 'honung', sv: 'honung', en: 'honey', gender: 'en', category: 'mat', arasaac: 2911, pt_BR: { text: 'mel', gender: 'm' } },
  { id: 'korv', sv: 'korv', en: 'sausage', gender: 'en', category: 'mat', arasaac: 6647, pt_BR: { text: 'salsicha', gender: 'f' } },
  { id: 'fiskpinnar', sv: 'fiskpinnar', en: 'fish sticks', gender: 'en', category: 'mat', arasaac: 6653, pt_BR: { text: 'peixe empanado', gender: 'm' } },

  // === PERSONER (25) ===
  { id: 'prinsessa', sv: 'prinsessa', en: 'princess', gender: 'en', category: 'personer', arasaac: 5554, pt_BR: { text: 'princesa', gender: 'f' } },
  { id: 'prins', sv: 'prins', en: 'prince', gender: 'en', category: 'personer', arasaac: 5555, pt_BR: { text: 'príncipe', gender: 'm' } },
  { id: 'kung', sv: 'kung', en: 'king', gender: 'en', category: 'personer', arasaac: 5563, pt_BR: { text: 'rei', gender: 'm' } },
  { id: 'drottning', sv: 'drottning', en: 'queen', gender: 'en', category: 'personer', arasaac: 5559, pt_BR: { text: 'rainha', gender: 'f' } },
  { id: 'riddare', sv: 'riddare', en: 'knight', gender: 'en', category: 'personer', arasaac: 5406, pt_BR: { text: 'cavaleiro', gender: 'm' } },
  { id: 'trollkarl', sv: 'trollkarl', en: 'wizard', gender: 'en', category: 'personer', arasaac: 38024, pt_BR: { text: 'mago', gender: 'm' } },
  { id: 'häxa', sv: 'häxa', en: 'witch', gender: 'en', category: 'personer', arasaac: 5404, pt_BR: { text: 'bruxa', gender: 'f' } },
  { id: 'pirat', sv: 'pirat', en: 'pirate', gender: 'en', category: 'personer', arasaac: 6180, pt_BR: { text: 'pirata', gender: 'm' } },
  { id: 'sjöjungfru', sv: 'sjöjungfru', en: 'mermaid', gender: 'en', category: 'personer', arasaac: 5589, pt_BR: { text: 'sereia', gender: 'f' } },
  { id: 'drake', sv: 'drake', en: 'dragon', gender: 'en', category: 'personer', arasaac: 5572, pt_BR: { text: 'dragão', gender: 'm' } },
  { id: 'robot', sv: 'robot', en: 'robot', gender: 'en', category: 'personer', arasaac: 6208, pt_BR: { text: 'robô', gender: 'm' } },
  { id: 'astronaut', sv: 'astronaut', en: 'astronaut', gender: 'en', category: 'personer', arasaac: 4569, pt_BR: { text: 'astronauta', gender: 'm' } },
  { id: 'clown', sv: 'clown', en: 'clown', gender: 'en', category: 'personer', arasaac: 2854, pt_BR: { text: 'palhaço', gender: 'm' } },
  { id: 'tomte', sv: 'tomte', en: 'gnome', gender: 'en', category: 'personer', arasaac: 5450, pt_BR: { text: 'gnomo', gender: 'm' } },
  { id: 'älva', sv: 'älva', en: 'fairy', gender: 'en', category: 'personer', arasaac: 5482, pt_BR: { text: 'fada', gender: 'f' } },
  { id: 'jätte', sv: 'jätte', en: 'giant', gender: 'en', category: 'personer', arasaac: 8375, pt_BR: { text: 'gigante', gender: 'm' } },
  { id: 'troll', sv: 'troll', en: 'troll', gender: 'ett', category: 'personer', arasaac: 6160, pt_BR: { text: 'ogro', gender: 'm' } },
  { id: 'barn', sv: 'barn', en: 'child', gender: 'ett', category: 'personer', arasaac: 7176, pt_BR: { text: 'menino', gender: 'm' } },
  { id: 'mamma', sv: 'mamma', en: 'mom', gender: 'en', category: 'personer', arasaac: 2458, pt_BR: { text: 'mamãe', gender: 'f' } },
  { id: 'pappa', sv: 'pappa', en: 'dad', gender: 'en', category: 'personer', arasaac: 31146, pt_BR: { text: 'papai', gender: 'm' } },
  { id: 'farmor', sv: 'farmor', en: 'grandma', gender: 'en', category: 'personer', arasaac: 23710, pt_BR: { text: 'vovó', gender: 'f' } },
  { id: 'kompis', sv: 'kompis', en: 'friend', gender: 'en', category: 'personer', arasaac: 25790, pt_BR: { text: 'amigo', gender: 'm' } },
  { id: 'lärare', sv: 'lärare', en: 'teacher', gender: 'en', category: 'personer', arasaac: 6556, pt_BR: { text: 'professor', gender: 'm' } },
  { id: 'sjörövare', sv: 'sjörövare', en: 'buccaneer', gender: 'en', category: 'personer', arasaac: 6180, pt_BR: { text: 'capitão', gender: 'm', arasaac: 24937 } },
  { id: 'docka', sv: 'docka', en: 'doll', gender: 'en', category: 'personer', arasaac: 26238, pt_BR: { text: 'boneca', gender: 'f' } },

  // === VERB (35) ===
  { id: 'springa', sv: 'springa', en: 'run', gender: 'en', category: 'verb', arasaac: 6465, pt_BR: { text: 'correr' } },
  { id: 'hoppa', sv: 'hoppa', en: 'jump', gender: 'en', category: 'verb', arasaac: 39052, pt_BR: { text: 'pular' } },
  { id: 'simma', sv: 'simma', en: 'swim', gender: 'en', category: 'verb', arasaac: 6568, pt_BR: { text: 'nadar' } },
  { id: 'flyga', sv: 'flyga', en: 'fly', gender: 'en', category: 'verb', arasaac: 6246, pt_BR: { text: 'voar' } },
  { id: 'äta', sv: 'äta', en: 'eat', gender: 'en', category: 'verb', arasaac: 6456, pt_BR: { text: 'comer' } },
  { id: 'sova', sv: 'sova', en: 'sleep', gender: 'en', category: 'verb', arasaac: 6479, pt_BR: { text: 'dormir' } },
  { id: 'sjunga', sv: 'sjunga', en: 'sing', gender: 'en', category: 'verb', arasaac: 6960, pt_BR: { text: 'cantar' } },
  { id: 'dansa', sv: 'dansa', en: 'dance', gender: 'en', category: 'verb', arasaac: 35747, pt_BR: { text: 'dançar' } },
  { id: 'leka', sv: 'leka', en: 'play', gender: 'en', category: 'verb', arasaac: 2439, pt_BR: { text: 'brincar' } },
  { id: 'rita', sv: 'rita', en: 'draw', gender: 'en', category: 'verb', arasaac: 8088, pt_BR: { text: 'desenhar' } },
  { id: 'bygga', sv: 'bygga', en: 'build', gender: 'en', category: 'verb', arasaac: 2713, pt_BR: { text: 'construir' } },
  { id: 'gömma', sv: 'gömma', en: 'hide', gender: 'en', category: 'verb', arasaac: 6493, pt_BR: { text: 'brincar de esconde-esconde', arasaac: 21845 } },
  { id: 'hitta', sv: 'hitta', en: 'find', gender: 'en', category: 'verb', arasaac: 24742, pt_BR: { text: 'procurar tesouros', arasaac: 21466 } },
  { id: 'klättra', sv: 'klättra', en: 'climb', gender: 'en', category: 'verb', arasaac: 8236, pt_BR: { text: 'subir em árvores' } },
  { id: 'trolla', sv: 'trolla', en: 'do magic', gender: 'en', category: 'verb', arasaac: 36299, pt_BR: { text: 'fazer mágica' } },
  { id: 'skratta', sv: 'skratta', en: 'laugh', gender: 'en', category: 'verb', arasaac: 13354, pt_BR: { text: 'rir' } },
  { id: 'gråta', sv: 'gråta', en: 'cry', gender: 'en', category: 'verb', arasaac: 7147, pt_BR: { text: 'chorar' } },
  { id: 'krama', sv: 'krama', en: 'hug', gender: 'en', category: 'verb', arasaac: 4550, pt_BR: { text: 'dar abraços' } },
  { id: 'viska', sv: 'viska', en: 'whisper', gender: 'en', category: 'verb', arasaac: 9037, pt_BR: { text: 'cochichar' } },
  { id: 'ropa', sv: 'ropa', en: 'shout', gender: 'en', category: 'verb', arasaac: 6552, pt_BR: { text: 'gritar' } },
  { id: 'drömma', sv: 'drömma', en: 'dream', gender: 'en', category: 'verb', arasaac: 5590, pt_BR: { text: 'sonhar' } },
  { id: 'tänka', sv: 'tänka', en: 'think', gender: 'en', category: 'verb', arasaac: 38796, pt_BR: { text: 'pensar' } },
  { id: 'hjälpa', sv: 'hjälpa', en: 'help', gender: 'en', category: 'verb', arasaac: 32648, pt_BR: { text: 'ajudar' } },
  { id: 'dela', sv: 'dela', en: 'share', gender: 'en', category: 'verb', arasaac: 38900, pt_BR: { text: 'compartilhar' } },
  { id: 'laga', sv: 'laga', en: 'cook', gender: 'en', category: 'verb', arasaac: 2342, pt_BR: { text: 'cozinhar' } },
  { id: 'baka', sv: 'baka', en: 'bake', gender: 'en', category: 'verb', arasaac: 5487, pt_BR: { text: 'fazer bolo' } },
  { id: 'måla', sv: 'måla', en: 'paint', gender: 'en', category: 'verb', arasaac: 2348, pt_BR: { text: 'pintar' } },
  { id: 'segla', sv: 'segla', en: 'sail', gender: 'en', category: 'verb', arasaac: 7170, pt_BR: { text: 'velejar' } },
  { id: 'åka', sv: 'åka', en: 'ride', gender: 'en', category: 'verb', arasaac: 6045, pt_BR: { text: 'andar de bicicleta' } },
  { id: 'vänta', sv: 'vänta', en: 'wait', gender: 'en', category: 'verb', arasaac: 36914, pt_BR: { text: 'esperar' } },
  { id: 'le', sv: 'le', en: 'smile', gender: 'en', category: 'verb', arasaac: 3245, pt_BR: { text: 'sorrir' } },
  { id: 'titta', sv: 'titta', en: 'look', gender: 'en', category: 'verb', arasaac: 6564, pt_BR: { text: 'olhar as nuvens' } },
  { id: 'lyssna', sv: 'lyssna', en: 'listen', gender: 'en', category: 'verb', arasaac: 6572, pt_BR: { text: 'ouvir música' } },
  { id: 'fånga', sv: 'fånga', en: 'catch', gender: 'en', category: 'verb', arasaac: 29945, pt_BR: { text: 'brincar de pega-pega' } },
  { id: 'rädda', sv: 'rädda', en: 'rescue', gender: 'en', category: 'verb', arasaac: 9046, pt_BR: { text: 'salvar o dia' } },
];

export function pictogramUrl(arasaacId: number, size = 300): string {
  // ARASAAC only supports sizes 300, 500, 2500
  const validSize = size <= 300 ? 300 : size <= 500 ? 500 : 2500;
  return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_${validSize}.png`;
}

/** Word shown and spoken for the story language (unknown → en) */
export function wordLabel(word: Word, lang: string): string {
  return ({ sv: word.sv, en: word.en, pt_BR: word.pt_BR.text } as Record<string, string>)[lang] ?? word.en;
}

/** Pictogram id for the story language */
export function wordPicto(word: Word, lang: string): number {
  return (lang === 'pt_BR' && word.pt_BR.arasaac) || word.arasaac;
}

export function wordsByCategory(cat: WordCategory): Word[] {
  return ALL_WORDS.filter(w => w.category === cat);
}

export function randomWords(count: number, categories?: WordCategory[]): Word[] {
  let pool = categories ? ALL_WORDS.filter(w => categories.includes(w.category)) : [...ALL_WORDS];
  const result: Word[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}
