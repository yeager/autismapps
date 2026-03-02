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
  { id: 'katt', sv: 'katt', en: 'cat', gender: 'en', category: 'djur', arasaac: 7114, plural: 'katter' },
  { id: 'hund', sv: 'hund', en: 'dog', gender: 'en', category: 'djur', arasaac: 7202, plural: 'hundar' },
  { id: 'kanin', sv: 'kanin', en: 'rabbit', gender: 'en', category: 'djur', arasaac: 2351, plural: 'kaniner' },
  { id: 'häst', sv: 'häst', en: 'horse', gender: 'en', category: 'djur', arasaac: 2294, plural: 'hästar' },
  { id: 'ko', sv: 'ko', en: 'cow', gender: 'en', category: 'djur', arasaac: 2609, plural: 'kor' },
  { id: 'gris', sv: 'gris', en: 'pig', gender: 'en', category: 'djur', arasaac: 24972, plural: 'grisar' },
  { id: 'anka', sv: 'anka', en: 'duck', gender: 'en', category: 'djur', arasaac: 28479, plural: 'ankor' },
  { id: 'fågel', sv: 'fågel', en: 'bird', gender: 'en', category: 'djur', arasaac: 2490, plural: 'fåglar' },
  { id: 'fisk', sv: 'fisk', en: 'fish', gender: 'en', category: 'djur', arasaac: 2520, plural: 'fiskar' },
  { id: 'fjäril', sv: 'fjäril', en: 'butterfly', gender: 'en', category: 'djur', arasaac: 26200, plural: 'fjärilar' },
  { id: 'björn', sv: 'björn', en: 'bear', gender: 'en', category: 'djur', arasaac: 2488, plural: 'björnar' },
  { id: 'räv', sv: 'räv', en: 'fox', gender: 'en', category: 'djur', arasaac: 2623, plural: 'rävar' },
  { id: 'älg', sv: 'älg', en: 'moose', gender: 'en', category: 'djur', arasaac: 8010, plural: 'älgar' },
  { id: 'uggla', sv: 'uggla', en: 'owl', gender: 'en', category: 'djur', arasaac: 2671, plural: 'ugglor' },
  { id: 'groda', sv: 'groda', en: 'frog', gender: 'en', category: 'djur', arasaac: 28473, plural: 'grodor' },
  { id: 'sköldpadda', sv: 'sköldpadda', en: 'turtle', gender: 'en', category: 'djur', arasaac: 10241, plural: 'sköldpaddor' },
  { id: 'snigel', sv: 'snigel', en: 'snail', gender: 'en', category: 'djur', arasaac: 8061, plural: 'sniglar' },
  { id: 'spindel', sv: 'spindel', en: 'spider', gender: 'en', category: 'djur', arasaac: 38275, plural: 'spindlar' },
  { id: 'elefant', sv: 'elefant', en: 'elephant', gender: 'en', category: 'djur', arasaac: 2372, plural: 'elefanter' },
  { id: 'lejon', sv: 'lejon', en: 'lion', gender: 'ett', category: 'djur', arasaac: 25187, plural: 'lejon' },
  { id: 'apa', sv: 'apa', en: 'monkey', gender: 'en', category: 'djur', arasaac: 2477, plural: 'apor' },
  { id: 'orm', sv: 'orm', en: 'snake', gender: 'en', category: 'djur', arasaac: 2568, plural: 'ormar' },
  { id: 'myra', sv: 'myra', en: 'ant', gender: 'en', category: 'djur', arasaac: 2425, plural: 'myror' },
  { id: 'bi', sv: 'bi', en: 'bee', gender: 'ett', category: 'djur', arasaac: 24823, plural: 'bin' },
  { id: 'val', sv: 'val', en: 'whale', gender: 'en', category: 'djur', arasaac: 2268, plural: 'valar' },
  { id: 'delfin', sv: 'delfin', en: 'dolphin', gender: 'en', category: 'djur', arasaac: 2732, plural: 'delfiner' },
  { id: 'panda', sv: 'panda', en: 'panda', gender: 'en', category: 'djur', arasaac: 2869, plural: 'pandor' },
  { id: 'pingvin', sv: 'pingvin', en: 'penguin', gender: 'en', category: 'djur', arasaac: 3243, plural: 'pingviner' },
  { id: 'mus', sv: 'mus', en: 'mouse', gender: 'en', category: 'djur', arasaac: 2546, plural: 'möss' },
  { id: 'får', sv: 'får', en: 'sheep', gender: 'ett', category: 'djur', arasaac: 2489, plural: 'får' },

  // === PLATSER (25) ===
  { id: 'skog', sv: 'skog', en: 'forest', gender: 'en', category: 'platser', arasaac: 2666 },
  { id: 'sjö', sv: 'sjö', en: 'lake', gender: 'en', category: 'platser', arasaac: 6022 },
  { id: 'berg', sv: 'berg', en: 'mountain', gender: 'ett', category: 'platser', arasaac: 2909 },
  { id: 'strand', sv: 'strand', en: 'beach', gender: 'en', category: 'platser', arasaac: 30518 },
  { id: 'hus', sv: 'hus', en: 'house', gender: 'ett', category: 'platser', arasaac: 6964 },
  { id: 'slott', sv: 'slott', en: 'castle', gender: 'ett', category: 'platser', arasaac: 5422 },
  { id: 'trädgård', sv: 'trädgård', en: 'garden', gender: 'en', category: 'platser', arasaac: 2974 },
  { id: 'skola', sv: 'skola', en: 'school', gender: 'en', category: 'platser', arasaac: 32446 },
  { id: 'park', sv: 'park', en: 'park', gender: 'en', category: 'platser', arasaac: 5379 },
  { id: 'stad', sv: 'stad', en: 'city', gender: 'en', category: 'platser', arasaac: 2704 },
  { id: 'bondgård', sv: 'bondgård', en: 'farm', gender: 'en', category: 'platser', arasaac: 32482 },
  { id: 'hav', sv: 'hav', en: 'ocean', gender: 'ett', category: 'platser', arasaac: 2925 },
  { id: 'grotta', sv: 'grotta', en: 'cave', gender: 'en', category: 'platser', arasaac: 2729 },
  { id: 'bro', sv: 'bro', en: 'bridge', gender: 'en', category: 'platser', arasaac: 6194 },
  { id: 'torn', sv: 'torn', en: 'tower', gender: 'ett', category: 'platser', arasaac: 6232 },
  { id: 'bibliotek', sv: 'bibliotek', en: 'library', gender: 'ett', category: 'platser', arasaac: 6063 },
  { id: 'affär', sv: 'affär', en: 'shop', gender: 'en', category: 'platser', arasaac: 35695 },
  { id: 'lekplats', sv: 'lekplats', en: 'playground', gender: 'en', category: 'platser', arasaac: 33064 },
  { id: 'rymden', sv: 'rymden', en: 'space', gender: 'en', category: 'platser', arasaac: 25074 },
  { id: 'ö', sv: 'ö', en: 'island', gender: 'en', category: 'platser', arasaac: 2966 },
  { id: 'vulkan', sv: 'vulkan', en: 'volcano', gender: 'en', category: 'platser', arasaac: 6247 },
  { id: 'äng', sv: 'äng', en: 'meadow', gender: 'en', category: 'platser', arasaac: 6908 },
  { id: 'flod', sv: 'flod', en: 'river', gender: 'en', category: 'platser', arasaac: 2811 },
  { id: 'cirkus', sv: 'cirkus', en: 'circus', gender: 'en', category: 'platser', arasaac: 6450 },
  { id: 'zoo', sv: 'zoo', en: 'zoo', gender: 'ett', category: 'platser', arasaac: 4773 },

  // === SAKER (30) ===
  { id: 'boll', sv: 'boll', en: 'ball', gender: 'en', category: 'saker', arasaac: 3241 },
  { id: 'bok', sv: 'bok', en: 'book', gender: 'en', category: 'saker', arasaac: 25191 },
  { id: 'nyckel', sv: 'nyckel', en: 'key', gender: 'en', category: 'saker', arasaac: 8153 },
  { id: 'karta', sv: 'karta', en: 'map', gender: 'en', category: 'saker', arasaac: 5505 },
  { id: 'stjärna', sv: 'stjärna', en: 'star', gender: 'en', category: 'saker', arasaac: 2752 },
  { id: 'krona', sv: 'krona', en: 'crown', gender: 'en', category: 'saker', arasaac: 2718 },
  { id: 'svärd', sv: 'svärd', en: 'sword', gender: 'ett', category: 'saker', arasaac: 7093 },
  { id: 'trollstav', sv: 'trollstav', en: 'magic wand', gender: 'en', category: 'saker', arasaac: 6240 },
  { id: 'skattkista', sv: 'skattkista', en: 'treasure chest', gender: 'en', category: 'saker', arasaac: 2853 },
  { id: 'båt', sv: 'båt', en: 'boat', gender: 'en', category: 'saker', arasaac: 6932 },
  { id: 'cykel', sv: 'cykel', en: 'bicycle', gender: 'en', category: 'saker', arasaac: 6935 },
  { id: 'bil', sv: 'bil', en: 'car', gender: 'en', category: 'saker', arasaac: 2339 },
  { id: 'tåg', sv: 'tåg', en: 'train', gender: 'ett', category: 'saker', arasaac: 2603 },
  { id: 'flygplan', sv: 'flygplan', en: 'airplane', gender: 'ett', category: 'saker', arasaac: 6924 },
  { id: 'raket', sv: 'raket', en: 'rocket', gender: 'en', category: 'saker', arasaac: 2344 },
  { id: 'ballong', sv: 'ballong', en: 'balloon', gender: 'en', category: 'saker', arasaac: 2408 },
  { id: 'present', sv: 'present', en: 'gift', gender: 'en', category: 'saker', arasaac: 25381 },
  { id: 'lampa', sv: 'lampa', en: 'lamp', gender: 'en', category: 'saker', arasaac: 4936 },
  { id: 'spegel', sv: 'spegel', en: 'mirror', gender: 'en', category: 'saker', arasaac: 8573 },
  { id: 'paraply', sv: 'paraply', en: 'umbrella', gender: 'ett', category: 'saker', arasaac: 2500 },
  { id: 'blomma', sv: 'blomma', en: 'flower', gender: 'en', category: 'saker', arasaac: 7104 },
  { id: 'träd', sv: 'träd', en: 'tree', gender: 'ett', category: 'saker', arasaac: 3057 },
  { id: 'sol', sv: 'sol', en: 'sun', gender: 'en', category: 'saker', arasaac: 7252 },
  { id: 'måne', sv: 'måne', en: 'moon', gender: 'en', category: 'saker', arasaac: 2933 },
  { id: 'moln', sv: 'moln', en: 'cloud', gender: 'ett', category: 'saker', arasaac: 34383 },
  { id: 'regnbåge', sv: 'regnbåge', en: 'rainbow', gender: 'en', category: 'saker', arasaac: 2986 },
  { id: 'hjärta', sv: 'hjärta', en: 'heart', gender: 'ett', category: 'saker', arasaac: 4613 },
  { id: 'diamant', sv: 'diamant', en: 'diamond', gender: 'en', category: 'saker', arasaac: 6475 },
  { id: 'gitarr', sv: 'gitarr', en: 'guitar', gender: 'en', category: 'saker', arasaac: 2417 },
  { id: 'trumma', sv: 'trumma', en: 'drum', gender: 'en', category: 'saker', arasaac: 2578 },

  // === MAT (25) ===
  { id: 'äpple', sv: 'äpple', en: 'apple', gender: 'ett', category: 'mat', arasaac: 2462 },
  { id: 'banan', sv: 'banan', en: 'banana', gender: 'en', category: 'mat', arasaac: 2530 },
  { id: 'jordgubbe', sv: 'jordgubbe', en: 'strawberry', gender: 'en', category: 'mat', arasaac: 2400 },
  { id: 'morot', sv: 'morot', en: 'carrot', gender: 'en', category: 'mat', arasaac: 2619 },
  { id: 'glass', sv: 'glass', en: 'ice cream', gender: 'en', category: 'mat', arasaac: 35209 },
  { id: 'tårta', sv: 'tårta', en: 'cake', gender: 'en', category: 'mat', arasaac: 2502 },
  { id: 'pizza', sv: 'pizza', en: 'pizza', gender: 'en', category: 'mat', arasaac: 2527 },
  { id: 'smörgås', sv: 'smörgås', en: 'sandwich', gender: 'en', category: 'mat', arasaac: 2281 },
  { id: 'soppa', sv: 'soppa', en: 'soup', gender: 'en', category: 'mat', arasaac: 2573 },
  { id: 'pannkaka', sv: 'pannkaka', en: 'pancake', gender: 'en', category: 'mat', arasaac: 34233 },
  { id: 'choklad', sv: 'choklad', en: 'chocolate', gender: 'en', category: 'mat', arasaac: 25940 },
  { id: 'kaka', sv: 'kaka', en: 'cookie', gender: 'en', category: 'mat', arasaac: 8312 },
  { id: 'vattenmelon', sv: 'vattenmelon', en: 'watermelon', gender: 'en', category: 'mat', arasaac: 2557 },
  { id: 'druva', sv: 'druva', en: 'grape', gender: 'en', category: 'mat', arasaac: 9142 },
  { id: 'päron', sv: 'päron', en: 'pear', gender: 'ett', category: 'mat', arasaac: 2561 },
  { id: 'tomat', sv: 'tomat', en: 'tomato', gender: 'en', category: 'mat', arasaac: 2594 },
  { id: 'potatis', sv: 'potatis', en: 'potato', gender: 'en', category: 'mat', arasaac: 2503 },
  { id: 'bröd', sv: 'bröd', en: 'bread', gender: 'ett', category: 'mat', arasaac: 2494 },
  { id: 'ost', sv: 'ost', en: 'cheese', gender: 'en', category: 'mat', arasaac: 2541 },
  { id: 'mjölk', sv: 'mjölk', en: 'milk', gender: 'en', category: 'mat', arasaac: 2445 },
  { id: 'juice', sv: 'juice', en: 'juice', gender: 'en', category: 'mat', arasaac: 11461 },
  { id: 'vatten', sv: 'vatten', en: 'water', gender: 'ett', category: 'mat', arasaac: 32464 },
  { id: 'honung', sv: 'honung', en: 'honey', gender: 'en', category: 'mat', arasaac: 2911 },
  { id: 'korv', sv: 'korv', en: 'sausage', gender: 'en', category: 'mat', arasaac: 6647 },
  { id: 'fiskpinnar', sv: 'fiskpinnar', en: 'fish sticks', gender: 'en', category: 'mat', arasaac: 6653 },

  // === PERSONER (25) ===
  { id: 'prinsessa', sv: 'prinsessa', en: 'princess', gender: 'en', category: 'personer', arasaac: 5554 },
  { id: 'prins', sv: 'prins', en: 'prince', gender: 'en', category: 'personer', arasaac: 5555 },
  { id: 'kung', sv: 'kung', en: 'king', gender: 'en', category: 'personer', arasaac: 5563 },
  { id: 'drottning', sv: 'drottning', en: 'queen', gender: 'en', category: 'personer', arasaac: 5559 },
  { id: 'riddare', sv: 'riddare', en: 'knight', gender: 'en', category: 'personer', arasaac: 5406 },
  { id: 'trollkarl', sv: 'trollkarl', en: 'wizard', gender: 'en', category: 'personer', arasaac: 38024 },
  { id: 'häxa', sv: 'häxa', en: 'witch', gender: 'en', category: 'personer', arasaac: 5404 },
  { id: 'pirat', sv: 'pirat', en: 'pirate', gender: 'en', category: 'personer', arasaac: 6180 },
  { id: 'sjöjungfru', sv: 'sjöjungfru', en: 'mermaid', gender: 'en', category: 'personer', arasaac: 5589 },
  { id: 'drake', sv: 'drake', en: 'dragon', gender: 'en', category: 'personer', arasaac: 5572 },
  { id: 'robot', sv: 'robot', en: 'robot', gender: 'en', category: 'personer', arasaac: 6208 },
  { id: 'astronaut', sv: 'astronaut', en: 'astronaut', gender: 'en', category: 'personer', arasaac: 4569 },
  { id: 'clown', sv: 'clown', en: 'clown', gender: 'en', category: 'personer', arasaac: 2854 },
  { id: 'tomte', sv: 'tomte', en: 'gnome', gender: 'en', category: 'personer', arasaac: 5450 },
  { id: 'älva', sv: 'älva', en: 'fairy', gender: 'en', category: 'personer', arasaac: 5482 },
  { id: 'jätte', sv: 'jätte', en: 'giant', gender: 'en', category: 'personer', arasaac: 8375 },
  { id: 'troll', sv: 'troll', en: 'troll', gender: 'ett', category: 'personer', arasaac: 2602 },
  { id: 'barn', sv: 'barn', en: 'child', gender: 'ett', category: 'personer', arasaac: 7176 },
  { id: 'mamma', sv: 'mamma', en: 'mom', gender: 'en', category: 'personer', arasaac: 2458 },
  { id: 'pappa', sv: 'pappa', en: 'dad', gender: 'en', category: 'personer', arasaac: 31146 },
  { id: 'farmor', sv: 'farmor', en: 'grandma', gender: 'en', category: 'personer', arasaac: 23710 },
  { id: 'kompis', sv: 'kompis', en: 'friend', gender: 'en', category: 'personer', arasaac: 25790 },
  { id: 'lärare', sv: 'lärare', en: 'teacher', gender: 'en', category: 'personer', arasaac: 6556 },
  { id: 'sjörövare', sv: 'sjörövare', en: 'buccaneer', gender: 'en', category: 'personer', arasaac: 5507 },
  { id: 'docka', sv: 'docka', en: 'doll', gender: 'en', category: 'personer', arasaac: 26238 },

  // === VERB (35) ===
  { id: 'springa', sv: 'springa', en: 'run', gender: 'en', category: 'verb', arasaac: 6465 },
  { id: 'hoppa', sv: 'hoppa', en: 'jump', gender: 'en', category: 'verb', arasaac: 39052 },
  { id: 'simma', sv: 'simma', en: 'swim', gender: 'en', category: 'verb', arasaac: 6568 },
  { id: 'flyga', sv: 'flyga', en: 'fly', gender: 'en', category: 'verb', arasaac: 6246 },
  { id: 'äta', sv: 'äta', en: 'eat', gender: 'en', category: 'verb', arasaac: 6456 },
  { id: 'sova', sv: 'sova', en: 'sleep', gender: 'en', category: 'verb', arasaac: 6479 },
  { id: 'sjunga', sv: 'sjunga', en: 'sing', gender: 'en', category: 'verb', arasaac: 6960 },
  { id: 'dansa', sv: 'dansa', en: 'dance', gender: 'en', category: 'verb', arasaac: 35747 },
  { id: 'leka', sv: 'leka', en: 'play', gender: 'en', category: 'verb', arasaac: 23392 },
  { id: 'rita', sv: 'rita', en: 'draw', gender: 'en', category: 'verb', arasaac: 8088 },
  { id: 'bygga', sv: 'bygga', en: 'build', gender: 'en', category: 'verb', arasaac: 2713 },
  { id: 'gömma', sv: 'gömma', en: 'hide', gender: 'en', category: 'verb', arasaac: 6493 },
  { id: 'hitta', sv: 'hitta', en: 'find', gender: 'en', category: 'verb', arasaac: 24742 },
  { id: 'klättra', sv: 'klättra', en: 'climb', gender: 'en', category: 'verb', arasaac: 6617 },
  { id: 'trolla', sv: 'trolla', en: 'do magic', gender: 'en', category: 'verb', arasaac: 10157 },
  { id: 'skratta', sv: 'skratta', en: 'laugh', gender: 'en', category: 'verb', arasaac: 13354 },
  { id: 'gråta', sv: 'gråta', en: 'cry', gender: 'en', category: 'verb', arasaac: 7147 },
  { id: 'krama', sv: 'krama', en: 'hug', gender: 'en', category: 'verb', arasaac: 4550 },
  { id: 'viska', sv: 'viska', en: 'whisper', gender: 'en', category: 'verb', arasaac: 9037 },
  { id: 'ropa', sv: 'ropa', en: 'shout', gender: 'en', category: 'verb', arasaac: 6552 },
  { id: 'drömma', sv: 'drömma', en: 'dream', gender: 'en', category: 'verb', arasaac: 5590 },
  { id: 'tänka', sv: 'tänka', en: 'think', gender: 'en', category: 'verb', arasaac: 38796 },
  { id: 'hjälpa', sv: 'hjälpa', en: 'help', gender: 'en', category: 'verb', arasaac: 32648 },
  { id: 'dela', sv: 'dela', en: 'share', gender: 'en', category: 'verb', arasaac: 38900 },
  { id: 'laga', sv: 'laga', en: 'cook', gender: 'en', category: 'verb', arasaac: 30526 },
  { id: 'baka', sv: 'baka', en: 'bake', gender: 'en', category: 'verb', arasaac: 5487 },
  { id: 'måla', sv: 'måla', en: 'paint', gender: 'en', category: 'verb', arasaac: 2348 },
  { id: 'segla', sv: 'segla', en: 'sail', gender: 'en', category: 'verb', arasaac: 7170 },
  { id: 'åka', sv: 'åka', en: 'ride', gender: 'en', category: 'verb', arasaac: 6045 },
  { id: 'vänta', sv: 'vänta', en: 'wait', gender: 'en', category: 'verb', arasaac: 36914 },
  { id: 'le', sv: 'le', en: 'smile', gender: 'en', category: 'verb', arasaac: 13354 },
  { id: 'titta', sv: 'titta', en: 'look', gender: 'en', category: 'verb', arasaac: 6564 },
  { id: 'lyssna', sv: 'lyssna', en: 'listen', gender: 'en', category: 'verb', arasaac: 6572 },
  { id: 'fånga', sv: 'fånga', en: 'catch', gender: 'en', category: 'verb', arasaac: 8087 },
  { id: 'rädda', sv: 'rädda', en: 'rescue', gender: 'en', category: 'verb', arasaac: 9046 },
];

export function pictogramUrl(arasaacId: number, _size = 300): string {
  // ARASAAC only has 300, 500, 2500 sizes — always use 300 for thumbnails
  return `https://static.arasaac.org/pictograms/${arasaacId}/${arasaacId}_300.png`;
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
