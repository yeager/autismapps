/**
 * Sagostunden — Swedish word bank with ARASAAC pictogram IDs
 * ~170 words across 6 categories with grammatical gender (en/ett)
 */

export type Gender = 'en' | 'ett';
export type WordCategory = 'djur' | 'platser' | 'saker' | 'mat' | 'personer' | 'verb';

export interface Word {
  id: string;
  sv: string;
  en: string;
  gender: Gender;
  category: WordCategory;
  arasaac: number;
  plural?: string;
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
  { id: 'katt', sv: 'katt', en: 'cat', gender: 'en', category: 'djur', arasaac: 2501, plural: 'katter' },
  { id: 'hund', sv: 'hund', en: 'dog', gender: 'en', category: 'djur', arasaac: 2473, plural: 'hundar' },
  { id: 'kanin', sv: 'kanin', en: 'rabbit', gender: 'en', category: 'djur', arasaac: 2497, plural: 'kaniner' },
  { id: 'häst', sv: 'häst', en: 'horse', gender: 'en', category: 'djur', arasaac: 2487, plural: 'hästar' },
  { id: 'ko', sv: 'ko', en: 'cow', gender: 'en', category: 'djur', arasaac: 2457, plural: 'kor' },
  { id: 'gris', sv: 'gris', en: 'pig', gender: 'en', category: 'djur', arasaac: 2515, plural: 'grisar' },
  { id: 'anka', sv: 'anka', en: 'duck', gender: 'en', category: 'djur', arasaac: 2469, plural: 'ankor' },
  { id: 'fågel', sv: 'fågel', en: 'bird', gender: 'en', category: 'djur', arasaac: 2439, plural: 'fåglar' },
  { id: 'fisk', sv: 'fisk', en: 'fish', gender: 'en', category: 'djur', arasaac: 2475, plural: 'fiskar' },
  { id: 'fjäril', sv: 'fjäril', en: 'butterfly', gender: 'en', category: 'djur', arasaac: 2447, plural: 'fjärilar' },
  { id: 'björn', sv: 'björn', en: 'bear', gender: 'en', category: 'djur', arasaac: 2437, plural: 'björnar' },
  { id: 'räv', sv: 'räv', en: 'fox', gender: 'en', category: 'djur', arasaac: 2479, plural: 'rävar' },
  { id: 'älg', sv: 'älg', en: 'moose', gender: 'en', category: 'djur', arasaac: 2509, plural: 'älgar' },
  { id: 'uggla', sv: 'uggla', en: 'owl', gender: 'en', category: 'djur', arasaac: 2513, plural: 'ugglor' },
  { id: 'groda', sv: 'groda', en: 'frog', gender: 'en', category: 'djur', arasaac: 2481, plural: 'grodor' },
  { id: 'sköldpadda', sv: 'sköldpadda', en: 'turtle', gender: 'en', category: 'djur', arasaac: 2539, plural: 'sköldpaddor' },
  { id: 'snigel', sv: 'snigel', en: 'snail', gender: 'en', category: 'djur', arasaac: 2535, plural: 'sniglar' },
  { id: 'spindel', sv: 'spindel', en: 'spider', gender: 'en', category: 'djur', arasaac: 2537, plural: 'spindlar' },
  { id: 'elefant', sv: 'elefant', en: 'elephant', gender: 'en', category: 'djur', arasaac: 2471, plural: 'elefanter' },
  { id: 'lejon', sv: 'lejon', en: 'lion', gender: 'ett', category: 'djur', arasaac: 2503, plural: 'lejon' },
  { id: 'apa', sv: 'apa', en: 'monkey', gender: 'en', category: 'djur', arasaac: 2507, plural: 'apor' },
  { id: 'orm', sv: 'orm', en: 'snake', gender: 'en', category: 'djur', arasaac: 2533, plural: 'ormar' },
  { id: 'myra', sv: 'myra', en: 'ant', gender: 'en', category: 'djur', arasaac: 2431, plural: 'myror' },
  { id: 'bi', sv: 'bi', en: 'bee', gender: 'ett', category: 'djur', arasaac: 2435, plural: 'bin' },
  { id: 'val', sv: 'val', en: 'whale', gender: 'en', category: 'djur', arasaac: 2543, plural: 'valar' },
  { id: 'delfin', sv: 'delfin', en: 'dolphin', gender: 'en', category: 'djur', arasaac: 2465, plural: 'delfiner' },
  { id: 'panda', sv: 'panda', en: 'panda', gender: 'en', category: 'djur', arasaac: 2517, plural: 'pandor' },
  { id: 'pingvin', sv: 'pingvin', en: 'penguin', gender: 'en', category: 'djur', arasaac: 2519, plural: 'pingviner' },
  { id: 'mus', sv: 'mus', en: 'mouse', gender: 'en', category: 'djur', arasaac: 2511, plural: 'möss' },
  { id: 'får', sv: 'får', en: 'sheep', gender: 'ett', category: 'djur', arasaac: 2529, plural: 'får' },

  // === PLATSER (25) ===
  { id: 'skog', sv: 'skog', en: 'forest', gender: 'en', category: 'platser', arasaac: 6904 },
  { id: 'sjö', sv: 'sjö', en: 'lake', gender: 'en', category: 'platser', arasaac: 5523 },
  { id: 'berg', sv: 'berg', en: 'mountain', gender: 'ett', category: 'platser', arasaac: 5586 },
  { id: 'strand', sv: 'strand', en: 'beach', gender: 'en', category: 'platser', arasaac: 5410 },
  { id: 'hus', sv: 'hus', en: 'house', gender: 'ett', category: 'platser', arasaac: 2683 },
  { id: 'slott', sv: 'slott', en: 'castle', gender: 'ett', category: 'platser', arasaac: 2450 },
  { id: 'trädgård', sv: 'trädgård', en: 'garden', gender: 'en', category: 'platser', arasaac: 7045 },
  { id: 'skola', sv: 'skola', en: 'school', gender: 'en', category: 'platser', arasaac: 2765 },
  { id: 'park', sv: 'park', en: 'park', gender: 'en', category: 'platser', arasaac: 7698 },
  { id: 'stad', sv: 'stad', en: 'city', gender: 'en', category: 'platser', arasaac: 6783 },
  { id: 'bondgård', sv: 'bondgård', en: 'farm', gender: 'en', category: 'platser', arasaac: 2474 },
  { id: 'hav', sv: 'hav', en: 'ocean', gender: 'ett', category: 'platser', arasaac: 5607 },
  { id: 'grotta', sv: 'grotta', en: 'cave', gender: 'en', category: 'platser', arasaac: 7335 },
  { id: 'bro', sv: 'bro', en: 'bridge', gender: 'en', category: 'platser', arasaac: 4735 },
  { id: 'torn', sv: 'torn', en: 'tower', gender: 'ett', category: 'platser', arasaac: 5065 },
  { id: 'bibliotek', sv: 'bibliotek', en: 'library', gender: 'ett', category: 'platser', arasaac: 6875 },
  { id: 'affär', sv: 'affär', en: 'shop', gender: 'en', category: 'platser', arasaac: 2771 },
  { id: 'lekplats', sv: 'lekplats', en: 'playground', gender: 'en', category: 'platser', arasaac: 7700 },
  { id: 'rymden', sv: 'rymden', en: 'space', gender: 'en', category: 'platser', arasaac: 8505 },
  { id: 'ö', sv: 'ö', en: 'island', gender: 'en', category: 'platser', arasaac: 5504 },
  { id: 'vulkan', sv: 'vulkan', en: 'volcano', gender: 'en', category: 'platser', arasaac: 5650 },
  { id: 'äng', sv: 'äng', en: 'meadow', gender: 'en', category: 'platser', arasaac: 6908 },
  { id: 'flod', sv: 'flod', en: 'river', gender: 'en', category: 'platser', arasaac: 5621 },
  { id: 'cirkus', sv: 'cirkus', en: 'circus', gender: 'en', category: 'platser', arasaac: 5186 },
  { id: 'zoo', sv: 'zoo', en: 'zoo', gender: 'ett', category: 'platser', arasaac: 6953 },

  // === SAKER (30) ===
  { id: 'boll', sv: 'boll', en: 'ball', gender: 'en', category: 'saker', arasaac: 3441 },
  { id: 'bok', sv: 'bok', en: 'book', gender: 'en', category: 'saker', arasaac: 2686 },
  { id: 'nyckel', sv: 'nyckel', en: 'key', gender: 'en', category: 'saker', arasaac: 3053 },
  { id: 'karta', sv: 'karta', en: 'map', gender: 'en', category: 'saker', arasaac: 7459 },
  { id: 'stjärna', sv: 'stjärna', en: 'star', gender: 'en', category: 'saker', arasaac: 5646 },
  { id: 'krona', sv: 'krona', en: 'crown', gender: 'en', category: 'saker', arasaac: 4978 },
  { id: 'svärd', sv: 'svärd', en: 'sword', gender: 'ett', category: 'saker', arasaac: 4961 },
  { id: 'trollstav', sv: 'trollstav', en: 'magic wand', gender: 'en', category: 'saker', arasaac: 5087 },
  { id: 'skattkista', sv: 'skattkista', en: 'treasure chest', gender: 'en', category: 'saker', arasaac: 5063 },
  { id: 'båt', sv: 'båt', en: 'boat', gender: 'en', category: 'saker', arasaac: 3424 },
  { id: 'cykel', sv: 'cykel', en: 'bicycle', gender: 'en', category: 'saker', arasaac: 3393 },
  { id: 'bil', sv: 'bil', en: 'car', gender: 'en', category: 'saker', arasaac: 3389 },
  { id: 'tåg', sv: 'tåg', en: 'train', gender: 'ett', category: 'saker', arasaac: 3483 },
  { id: 'flygplan', sv: 'flygplan', en: 'airplane', gender: 'ett', category: 'saker', arasaac: 3378 },
  { id: 'raket', sv: 'raket', en: 'rocket', gender: 'en', category: 'saker', arasaac: 3475 },
  { id: 'ballong', sv: 'ballong', en: 'balloon', gender: 'en', category: 'saker', arasaac: 3442 },
  { id: 'present', sv: 'present', en: 'gift', gender: 'en', category: 'saker', arasaac: 4903 },
  { id: 'lampa', sv: 'lampa', en: 'lamp', gender: 'en', category: 'saker', arasaac: 2963 },
  { id: 'spegel', sv: 'spegel', en: 'mirror', gender: 'en', category: 'saker', arasaac: 3124 },
  { id: 'paraply', sv: 'paraply', en: 'umbrella', gender: 'ett', category: 'saker', arasaac: 3201 },
  { id: 'blomma', sv: 'blomma', en: 'flower', gender: 'en', category: 'saker', arasaac: 2830 },
  { id: 'träd', sv: 'träd', en: 'tree', gender: 'ett', category: 'saker', arasaac: 2878 },
  { id: 'sol', sv: 'sol', en: 'sun', gender: 'en', category: 'saker', arasaac: 5644 },
  { id: 'måne', sv: 'måne', en: 'moon', gender: 'en', category: 'saker', arasaac: 5582 },
  { id: 'moln', sv: 'moln', en: 'cloud', gender: 'ett', category: 'saker', arasaac: 5454 },
  { id: 'regnbåge', sv: 'regnbåge', en: 'rainbow', gender: 'en', category: 'saker', arasaac: 5617 },
  { id: 'hjärta', sv: 'hjärta', en: 'heart', gender: 'ett', category: 'saker', arasaac: 4856 },
  { id: 'diamant', sv: 'diamant', en: 'diamond', gender: 'en', category: 'saker', arasaac: 4980 },
  { id: 'gitarr', sv: 'gitarr', en: 'guitar', gender: 'en', category: 'saker', arasaac: 3656 },
  { id: 'trumma', sv: 'trumma', en: 'drum', gender: 'en', category: 'saker', arasaac: 3644 },

  // === MAT (25) ===
  { id: 'äpple', sv: 'äpple', en: 'apple', gender: 'ett', category: 'mat', arasaac: 2800 },
  { id: 'banan', sv: 'banan', en: 'banana', gender: 'en', category: 'mat', arasaac: 2804 },
  { id: 'jordgubbe', sv: 'jordgubbe', en: 'strawberry', gender: 'en', category: 'mat', arasaac: 2862 },
  { id: 'morot', sv: 'morot', en: 'carrot', gender: 'en', category: 'mat', arasaac: 2812 },
  { id: 'glass', sv: 'glass', en: 'ice cream', gender: 'en', category: 'mat', arasaac: 2930 },
  { id: 'tårta', sv: 'tårta', en: 'cake', gender: 'en', category: 'mat', arasaac: 2898 },
  { id: 'pizza', sv: 'pizza', en: 'pizza', gender: 'en', category: 'mat', arasaac: 2952 },
  { id: 'smörgås', sv: 'smörgås', en: 'sandwich', gender: 'en', category: 'mat', arasaac: 2964 },
  { id: 'soppa', sv: 'soppa', en: 'soup', gender: 'en', category: 'mat', arasaac: 2968 },
  { id: 'pannkaka', sv: 'pannkaka', en: 'pancake', gender: 'en', category: 'mat', arasaac: 2948 },
  { id: 'choklad', sv: 'choklad', en: 'chocolate', gender: 'en', category: 'mat', arasaac: 2902 },
  { id: 'kaka', sv: 'kaka', en: 'cookie', gender: 'en', category: 'mat', arasaac: 2908 },
  { id: 'vattenmelon', sv: 'vattenmelon', en: 'watermelon', gender: 'en', category: 'mat', arasaac: 2880 },
  { id: 'druva', sv: 'druva', en: 'grape', gender: 'en', category: 'mat', arasaac: 2848 },
  { id: 'päron', sv: 'päron', en: 'pear', gender: 'ett', category: 'mat', arasaac: 2858 },
  { id: 'tomat', sv: 'tomat', en: 'tomato', gender: 'en', category: 'mat', arasaac: 2876 },
  { id: 'potatis', sv: 'potatis', en: 'potato', gender: 'en', category: 'mat', arasaac: 2956 },
  { id: 'bröd', sv: 'bröd', en: 'bread', gender: 'ett', category: 'mat', arasaac: 2892 },
  { id: 'ost', sv: 'ost', en: 'cheese', gender: 'en', category: 'mat', arasaac: 2900 },
  { id: 'mjölk', sv: 'mjölk', en: 'milk', gender: 'en', category: 'mat', arasaac: 2942 },
  { id: 'juice', sv: 'juice', en: 'juice', gender: 'en', category: 'mat', arasaac: 2936 },
  { id: 'vatten', sv: 'vatten', en: 'water', gender: 'ett', category: 'mat', arasaac: 2982 },
  { id: 'honung', sv: 'honung', en: 'honey', gender: 'en', category: 'mat', arasaac: 2932 },
  { id: 'korv', sv: 'korv', en: 'sausage', gender: 'en', category: 'mat', arasaac: 2960 },
  { id: 'fiskpinnar', sv: 'fiskpinnar', en: 'fish sticks', gender: 'en', category: 'mat', arasaac: 2476 },

  // === PERSONER (25) ===
  { id: 'prinsessa', sv: 'prinsessa', en: 'princess', gender: 'en', category: 'personer', arasaac: 4920 },
  { id: 'prins', sv: 'prins', en: 'prince', gender: 'en', category: 'personer', arasaac: 4918 },
  { id: 'kung', sv: 'kung', en: 'king', gender: 'en', category: 'personer', arasaac: 4916 },
  { id: 'drottning', sv: 'drottning', en: 'queen', gender: 'en', category: 'personer', arasaac: 4922 },
  { id: 'riddare', sv: 'riddare', en: 'knight', gender: 'en', category: 'personer', arasaac: 4914 },
  { id: 'trollkarl', sv: 'trollkarl', en: 'wizard', gender: 'en', category: 'personer', arasaac: 5085 },
  { id: 'häxa', sv: 'häxa', en: 'witch', gender: 'en', category: 'personer', arasaac: 5083 },
  { id: 'pirat', sv: 'pirat', en: 'pirate', gender: 'en', category: 'personer', arasaac: 4898 },
  { id: 'sjöjungfru', sv: 'sjöjungfru', en: 'mermaid', gender: 'en', category: 'personer', arasaac: 11346 },
  { id: 'drake', sv: 'drake', en: 'dragon', gender: 'en', category: 'personer', arasaac: 5025 },
  { id: 'robot', sv: 'robot', en: 'robot', gender: 'en', category: 'personer', arasaac: 9942 },
  { id: 'astronaut', sv: 'astronaut', en: 'astronaut', gender: 'en', category: 'personer', arasaac: 8503 },
  { id: 'clown', sv: 'clown', en: 'clown', gender: 'en', category: 'personer', arasaac: 5182 },
  { id: 'tomte', sv: 'tomte', en: 'gnome', gender: 'en', category: 'personer', arasaac: 5165 },
  { id: 'älva', sv: 'älva', en: 'fairy', gender: 'en', category: 'personer', arasaac: 5029 },
  { id: 'jätte', sv: 'jätte', en: 'giant', gender: 'en', category: 'personer', arasaac: 5041 },
  { id: 'troll', sv: 'troll', en: 'troll', gender: 'ett', category: 'personer', arasaac: 5081 },
  { id: 'barn', sv: 'barn', en: 'child', gender: 'ett', category: 'personer', arasaac: 6573 },
  { id: 'mamma', sv: 'mamma', en: 'mom', gender: 'en', category: 'personer', arasaac: 6563 },
  { id: 'pappa', sv: 'pappa', en: 'dad', gender: 'en', category: 'personer', arasaac: 6561 },
  { id: 'farmor', sv: 'farmor', en: 'grandma', gender: 'en', category: 'personer', arasaac: 6557 },
  { id: 'kompis', sv: 'kompis', en: 'friend', gender: 'en', category: 'personer', arasaac: 6637 },
  { id: 'lärare', sv: 'lärare', en: 'teacher', gender: 'en', category: 'personer', arasaac: 6711 },
  { id: 'sjörövare', sv: 'sjörövare', en: 'buccaneer', gender: 'en', category: 'personer', arasaac: 4898 },
  { id: 'docka', sv: 'docka', en: 'doll', gender: 'en', category: 'personer', arasaac: 3545 },

  // === VERB (35) ===
  { id: 'springa', sv: 'springa', en: 'run', gender: 'en', category: 'verb', arasaac: 6441 },
  { id: 'hoppa', sv: 'hoppa', en: 'jump', gender: 'en', category: 'verb', arasaac: 6406 },
  { id: 'simma', sv: 'simma', en: 'swim', gender: 'en', category: 'verb', arasaac: 6460 },
  { id: 'flyga', sv: 'flyga', en: 'fly', gender: 'en', category: 'verb', arasaac: 6395 },
  { id: 'äta', sv: 'äta', en: 'eat', gender: 'en', category: 'verb', arasaac: 6390 },
  { id: 'sova', sv: 'sova', en: 'sleep', gender: 'en', category: 'verb', arasaac: 6454 },
  { id: 'sjunga', sv: 'sjunga', en: 'sing', gender: 'en', category: 'verb', arasaac: 6452 },
  { id: 'dansa', sv: 'dansa', en: 'dance', gender: 'en', category: 'verb', arasaac: 6382 },
  { id: 'leka', sv: 'leka', en: 'play', gender: 'en', category: 'verb', arasaac: 6416 },
  { id: 'rita', sv: 'rita', en: 'draw', gender: 'en', category: 'verb', arasaac: 6388 },
  { id: 'bygga', sv: 'bygga', en: 'build', gender: 'en', category: 'verb', arasaac: 6370 },
  { id: 'gömma', sv: 'gömma', en: 'hide', gender: 'en', category: 'verb', arasaac: 6402 },
  { id: 'hitta', sv: 'hitta', en: 'find', gender: 'en', category: 'verb', arasaac: 6393 },
  { id: 'klättra', sv: 'klättra', en: 'climb', gender: 'en', category: 'verb', arasaac: 6378 },
  { id: 'trolla', sv: 'trolla', en: 'do magic', gender: 'en', category: 'verb', arasaac: 5087 },
  { id: 'skratta', sv: 'skratta', en: 'laugh', gender: 'en', category: 'verb', arasaac: 6448 },
  { id: 'gråta', sv: 'gråta', en: 'cry', gender: 'en', category: 'verb', arasaac: 6380 },
  { id: 'krama', sv: 'krama', en: 'hug', gender: 'en', category: 'verb', arasaac: 6404 },
  { id: 'viska', sv: 'viska', en: 'whisper', gender: 'en', category: 'verb', arasaac: 6468 },
  { id: 'ropa', sv: 'ropa', en: 'shout', gender: 'en', category: 'verb', arasaac: 6450 },
  { id: 'drömma', sv: 'drömma', en: 'dream', gender: 'en', category: 'verb', arasaac: 6386 },
  { id: 'tänka', sv: 'tänka', en: 'think', gender: 'en', category: 'verb', arasaac: 6464 },
  { id: 'hjälpa', sv: 'hjälpa', en: 'help', gender: 'en', category: 'verb', arasaac: 6400 },
  { id: 'dela', sv: 'dela', en: 'share', gender: 'en', category: 'verb', arasaac: 6384 },
  { id: 'laga', sv: 'laga', en: 'cook', gender: 'en', category: 'verb', arasaac: 6373 },
  { id: 'baka', sv: 'baka', en: 'bake', gender: 'en', category: 'verb', arasaac: 6366 },
  { id: 'måla', sv: 'måla', en: 'paint', gender: 'en', category: 'verb', arasaac: 6424 },
  { id: 'segla', sv: 'segla', en: 'sail', gender: 'en', category: 'verb', arasaac: 6444 },
  { id: 'åka', sv: 'åka', en: 'ride', gender: 'en', category: 'verb', arasaac: 6438 },
  { id: 'vänta', sv: 'vänta', en: 'wait', gender: 'en', category: 'verb', arasaac: 6466 },
  { id: 'le', sv: 'le', en: 'smile', gender: 'en', category: 'verb', arasaac: 6456 },
  { id: 'titta', sv: 'titta', en: 'look', gender: 'en', category: 'verb', arasaac: 6420 },
  { id: 'lyssna', sv: 'lyssna', en: 'listen', gender: 'en', category: 'verb', arasaac: 6418 },
  { id: 'fånga', sv: 'fånga', en: 'catch', gender: 'en', category: 'verb', arasaac: 6376 },
  { id: 'rädda', sv: 'rädda', en: 'rescue', gender: 'en', category: 'verb', arasaac: 6436 },
];

export function pictogramUrl(arasaacId: number, size = 300): string {
  return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_${size}.png`;
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
