/**
 * Category Sort — Category Data
 * All ARASAAC IDs validated via https://api.arasaac.org/v1/pictograms/en/search/{word}
 * ARASAAC URL: https://static.arasaac.org/pictograms/{id}/{id}_500.png
 */

export function arasaacUrl(id) {
  return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
}

/**
 * Category sets organized by level:
 * Level 1: 2 categories (concrete)
 * Level 2: 3 categories
 * Level 3: Abstract categories
 * Level 4: Odd one out
 */
export const CATEGORY_SETS = [
  // === LEVEL 1: 2 categories, concrete ===
  {
    id: 'animals-food',
    level: 1,
    nameKey: 'categorySort.set.animalsFood',
    categories: [
      {
        id: 'animals',
        labelKey: 'categorySort.cat.animals',
        icon: '🐾',
        items: [
          { id: 'dog', nameKey: 'categorySort.item.dog', arasaacId: 7202 },
          { id: 'cat', nameKey: 'categorySort.item.cat', arasaacId: 7114 },
          { id: 'horse', nameKey: 'categorySort.item.horse', arasaacId: 2294 },
          { id: 'bird', nameKey: 'categorySort.item.bird', arasaacId: 2490 },
          { id: 'fish', nameKey: 'categorySort.item.fish', arasaacId: 2520 },
          { id: 'rabbit', nameKey: 'categorySort.item.rabbit', arasaacId: 2351 },
        ],
      },
      {
        id: 'food',
        labelKey: 'categorySort.cat.food',
        icon: '🍽️',
        items: [
          { id: 'bread', nameKey: 'categorySort.item.bread', arasaacId: 2494 },
          { id: 'cheese', nameKey: 'categorySort.item.cheese', arasaacId: 2541 },
          { id: 'pizza', nameKey: 'categorySort.item.pizza', arasaacId: 2527 },
          { id: 'cake', nameKey: 'categorySort.item.cake', arasaacId: 2502 },
          { id: 'egg', nameKey: 'categorySort.item.egg', arasaacId: 2427 },
          { id: 'pasta', nameKey: 'categorySort.item.pasta', arasaacId: 8652 },
        ],
      },
    ],
  },
  {
    id: 'clothes-toys',
    level: 1,
    nameKey: 'categorySort.set.clothesToys',
    categories: [
      {
        id: 'clothes',
        labelKey: 'categorySort.cat.clothes',
        icon: '👕',
        items: [
          { id: 'shirt', nameKey: 'categorySort.item.shirt', arasaacId: 13640 },
          { id: 'pants', nameKey: 'categorySort.item.pants', arasaacId: 2565 },
          { id: 'shoe', nameKey: 'categorySort.item.shoe', arasaacId: 32922 },
          { id: 'hat', nameKey: 'categorySort.item.hat', arasaacId: 2572 },
          { id: 'sock', nameKey: 'categorySort.item.sock', arasaacId: 8339 },
          { id: 'jacket', nameKey: 'categorySort.item.jacket', arasaacId: 4872 },
        ],
      },
      {
        id: 'toys',
        labelKey: 'categorySort.cat.toys',
        icon: '🧸',
        items: [
          { id: 'ball', nameKey: 'categorySort.item.ball', arasaacId: 3241 },
          { id: 'doll', nameKey: 'categorySort.item.doll', arasaacId: 26238 },
          { id: 'teddybear', nameKey: 'categorySort.item.teddybear', arasaacId: 4945 },
          { id: 'puzzle', nameKey: 'categorySort.item.puzzle', arasaacId: 2540 },
          { id: 'blocks', nameKey: 'categorySort.item.blocks', arasaacId: 4935 },
          { id: 'drum', nameKey: 'categorySort.item.drum', arasaacId: 2578 },
        ],
      },
    ],
  },

  // === LEVEL 2: 3 categories ===
  {
    id: 'fruits-vegetables-drinks',
    level: 2,
    nameKey: 'categorySort.set.fruitsVegDrinks',
    categories: [
      {
        id: 'fruits',
        labelKey: 'categorySort.cat.fruits',
        icon: '🍎',
        items: [
          { id: 'apple', nameKey: 'categorySort.item.apple', arasaacId: 2462 },
          { id: 'banana', nameKey: 'categorySort.item.banana', arasaacId: 2530 },
          { id: 'strawberry', nameKey: 'categorySort.item.strawberry', arasaacId: 2400 },
          { id: 'pear', nameKey: 'categorySort.item.pear', arasaacId: 2561 },
          { id: 'watermelon', nameKey: 'categorySort.item.watermelon', arasaacId: 2557 },
        ],
      },
      {
        id: 'vegetables',
        labelKey: 'categorySort.cat.vegetables',
        icon: '🥕',
        items: [
          { id: 'carrot', nameKey: 'categorySort.item.carrot', arasaacId: 2619 },
          { id: 'tomato', nameKey: 'categorySort.item.tomato', arasaacId: 2594 },
          { id: 'potato', nameKey: 'categorySort.item.potato', arasaacId: 2503 },
          { id: 'broccoli', nameKey: 'categorySort.item.broccoli', arasaacId: 23853 },
          { id: 'cucumber', nameKey: 'categorySort.item.cucumber', arasaacId: 2847 },
        ],
      },
      {
        id: 'drinks',
        labelKey: 'categorySort.cat.drinks',
        icon: '🥤',
        items: [
          { id: 'water', nameKey: 'categorySort.item.water', arasaacId: 32464 },
          { id: 'milk', nameKey: 'categorySort.item.milk', arasaacId: 2445 },
          { id: 'juice', nameKey: 'categorySort.item.juice', arasaacId: 11461 },
          { id: 'tea', nameKey: 'categorySort.item.tea', arasaacId: 29802 },
          { id: 'coffee', nameKey: 'categorySort.item.coffee', arasaacId: 24479 },
        ],
      },
    ],
  },
  {
    id: 'vehicles-buildings',
    level: 2,
    nameKey: 'categorySort.set.vehiclesBuildings',
    categories: [
      {
        id: 'vehicles',
        labelKey: 'categorySort.cat.vehicles',
        icon: '🚗',
        items: [
          { id: 'car', nameKey: 'categorySort.item.car', arasaacId: 2339 },
          { id: 'bus', nameKey: 'categorySort.item.bus', arasaacId: 2262 },
          { id: 'train', nameKey: 'categorySort.item.train', arasaacId: 2603 },
          { id: 'airplane', nameKey: 'categorySort.item.airplane', arasaacId: 6924 },
          { id: 'bicycle', nameKey: 'categorySort.item.bicycle', arasaacId: 6935 },
          { id: 'boat', nameKey: 'categorySort.item.boat', arasaacId: 6932 },
        ],
      },
      {
        id: 'buildings',
        labelKey: 'categorySort.cat.buildings',
        icon: '🏠',
        items: [
          { id: 'house', nameKey: 'categorySort.item.house', arasaacId: 6964 },
          { id: 'school', nameKey: 'categorySort.item.school', arasaacId: 32446 },
          { id: 'hospital', nameKey: 'categorySort.item.hospital', arasaacId: 36210 },
          { id: 'church', nameKey: 'categorySort.item.church', arasaacId: 3118 },
          { id: 'shop', nameKey: 'categorySort.item.shop', arasaacId: 35695 },
          { id: 'castle', nameKey: 'categorySort.item.castle', arasaacId: 5422 },
        ],
      },
    ],
  },
  {
    id: 'body-clothes',
    level: 2,
    nameKey: 'categorySort.set.bodyClothes',
    categories: [
      {
        id: 'bodyparts',
        labelKey: 'categorySort.cat.bodyparts',
        icon: '🖐️',
        items: [
          { id: 'hand', nameKey: 'categorySort.item.hand', arasaacId: 28431 },
          { id: 'foot', nameKey: 'categorySort.item.foot', arasaacId: 25327 },
          { id: 'eye', nameKey: 'categorySort.item.eye', arasaacId: 6573 },
          { id: 'ear', nameKey: 'categorySort.item.ear', arasaacId: 2871 },
          { id: 'nose', nameKey: 'categorySort.item.nose', arasaacId: 2887 },
          { id: 'mouth', nameKey: 'categorySort.item.mouth', arasaacId: 2663 },
        ],
      },
      {
        id: 'clothes2',
        labelKey: 'categorySort.cat.clothes',
        icon: '👕',
        items: [
          { id: 'dress', nameKey: 'categorySort.item.dress', arasaacId: 6627 },
          { id: 'glove', nameKey: 'categorySort.item.glove', arasaacId: 8353 },
          { id: 'shirt2', nameKey: 'categorySort.item.shirt', arasaacId: 13640 },
          { id: 'hat2', nameKey: 'categorySort.item.hat', arasaacId: 2572 },
          { id: 'jacket2', nameKey: 'categorySort.item.jacket', arasaacId: 4872 },
          { id: 'sock2', nameKey: 'categorySort.item.sock', arasaacId: 8339 },
        ],
      },
    ],
  },

  // === LEVEL 3: Abstract categories ===
  {
    id: 'school-home-outdoor',
    level: 3,
    nameKey: 'categorySort.set.schoolHomeOutdoor',
    categories: [
      {
        id: 'atschool',
        labelKey: 'categorySort.cat.atSchool',
        icon: '🏫',
        items: [
          { id: 'book', nameKey: 'categorySort.item.book', arasaacId: 25191 },
          { id: 'pencil', nameKey: 'categorySort.item.pencil', arasaacId: 2440 },
          { id: 'scissors', nameKey: 'categorySort.item.scissors', arasaacId: 2591 },
          { id: 'ruler', nameKey: 'categorySort.item.ruler', arasaacId: 2815 },
          { id: 'backpack', nameKey: 'categorySort.item.backpack', arasaacId: 2475 },
        ],
      },
      {
        id: 'athome',
        labelKey: 'categorySort.cat.atHome',
        icon: '🏠',
        items: [
          { id: 'bed', nameKey: 'categorySort.item.bed', arasaacId: 25900 },
          { id: 'lamp', nameKey: 'categorySort.item.lamp', arasaacId: 4936 },
          { id: 'television', nameKey: 'categorySort.item.television', arasaacId: 25498 },
          { id: 'sofa', nameKey: 'categorySort.item.sofa', arasaacId: 25479 },
          { id: 'pillow', nameKey: 'categorySort.item.pillow', arasaacId: 2250 },
        ],
      },
      {
        id: 'outdoor',
        labelKey: 'categorySort.cat.outdoors',
        icon: '🌳',
        items: [
          { id: 'swing', nameKey: 'categorySort.item.swing', arasaacId: 4608 },
          { id: 'slide', nameKey: 'categorySort.item.slide', arasaacId: 4759 },
          { id: 'sandbox', nameKey: 'categorySort.item.sandbox', arasaacId: 6049 },
          { id: 'tree', nameKey: 'categorySort.item.tree', arasaacId: 3057 },
          { id: 'flower', nameKey: 'categorySort.item.flower', arasaacId: 7104 },
        ],
      },
    ],
  },
  {
    id: 'hot-cold',
    level: 3,
    nameKey: 'categorySort.set.hotCold',
    categories: [
      {
        id: 'hot',
        labelKey: 'categorySort.cat.hot',
        icon: '🔥',
        items: [
          { id: 'fire', nameKey: 'categorySort.item.fire', arasaacId: 4654 },
          { id: 'sun', nameKey: 'categorySort.item.sun', arasaacId: 7252 },
          { id: 'oven', nameKey: 'categorySort.item.oven', arasaacId: 2426 },
          { id: 'candle', nameKey: 'categorySort.item.candle', arasaacId: 6242 },
          { id: 'iron', nameKey: 'categorySort.item.iron', arasaacId: 2528 },
        ],
      },
      {
        id: 'cold',
        labelKey: 'categorySort.cat.cold',
        icon: '❄️',
        items: [
          { id: 'ice', nameKey: 'categorySort.item.ice', arasaacId: 7128 },
          { id: 'snow', nameKey: 'categorySort.item.snow', arasaacId: 7172 },
          { id: 'icecream', nameKey: 'categorySort.item.icecream', arasaacId: 3348 },
          { id: 'snowman', nameKey: 'categorySort.item.snowman', arasaacId: 3131 },
          { id: 'penguin', nameKey: 'categorySort.item.penguin', arasaacId: 3243 },
        ],
      },
    ],
  },
  {
    id: 'big-small',
    level: 3,
    nameKey: 'categorySort.set.bigSmall',
    categories: [
      {
        id: 'big',
        labelKey: 'categorySort.cat.big',
        icon: '🐘',
        items: [
          { id: 'elephant', nameKey: 'categorySort.item.elephant', arasaacId: 2372 },
          { id: 'whale', nameKey: 'categorySort.item.whale', arasaacId: 2268 },
          { id: 'dinosaur', nameKey: 'categorySort.item.dinosaur', arasaacId: 2738 },
          { id: 'mountain', nameKey: 'categorySort.item.mountain', arasaacId: 2909 },
          { id: 'giraffe', nameKey: 'categorySort.item.giraffe', arasaacId: 2437 },
        ],
      },
      {
        id: 'small',
        labelKey: 'categorySort.cat.small',
        icon: '🐜',
        items: [
          { id: 'ant', nameKey: 'categorySort.item.ant', arasaacId: 2425 },
          { id: 'butterfly', nameKey: 'categorySort.item.butterfly', arasaacId: 26200 },
          { id: 'key', nameKey: 'categorySort.item.key', arasaacId: 8153 },
          { id: 'coin', nameKey: 'categorySort.item.coin', arasaacId: 10279 },
          { id: 'ladybug', nameKey: 'categorySort.item.ladybug', arasaacId: 2924 },
        ],
      },
    ],
  },
  {
    id: 'living-nonliving',
    level: 3,
    nameKey: 'categorySort.set.livingNonliving',
    categories: [
      {
        id: 'living',
        labelKey: 'categorySort.cat.living',
        icon: '🌱',
        items: [
          { id: 'flower2', nameKey: 'categorySort.item.flower', arasaacId: 7104 },
          { id: 'baby', nameKey: 'categorySort.item.baby', arasaacId: 6060 },
          { id: 'turtle', nameKey: 'categorySort.item.turtle', arasaacId: 10241 },
          { id: 'frog', nameKey: 'categorySort.item.frog', arasaacId: 28473 },
          { id: 'bird2', nameKey: 'categorySort.item.bird', arasaacId: 2490 },
        ],
      },
      {
        id: 'nonliving',
        labelKey: 'categorySort.cat.nonliving',
        icon: '🪨',
        items: [
          { id: 'stone', nameKey: 'categorySort.item.stone', arasaacId: 6594 },
          { id: 'chair2', nameKey: 'categorySort.item.chair', arasaacId: 3155 },
          { id: 'spoon', nameKey: 'categorySort.item.spoon', arasaacId: 2362 },
          { id: 'cloud', nameKey: 'categorySort.item.cloud', arasaacId: 34383 },
          { id: 'cup', nameKey: 'categorySort.item.cup', arasaacId: 2582 },
        ],
      },
    ],
  },

  // === LEVEL 4: Odd one out ===
  {
    id: 'odd-animals',
    level: 4,
    nameKey: 'categorySort.set.oddAnimals',
    isOddOneOut: true,
    rounds: [
      {
        items: [
          { id: 'dog3', nameKey: 'categorySort.item.dog', arasaacId: 7202 },
          { id: 'cat3', nameKey: 'categorySort.item.cat', arasaacId: 7114 },
          { id: 'horse3', nameKey: 'categorySort.item.horse', arasaacId: 2294 },
          { id: 'pizza3', nameKey: 'categorySort.item.pizza', arasaacId: 2527, isOdd: true },
        ],
        hintKey: 'categorySort.hint.notAnimal',
      },
      {
        items: [
          { id: 'apple3', nameKey: 'categorySort.item.apple', arasaacId: 2462 },
          { id: 'banana3', nameKey: 'categorySort.item.banana', arasaacId: 2530 },
          { id: 'car3', nameKey: 'categorySort.item.car', arasaacId: 2339, isOdd: true },
          { id: 'pear3', nameKey: 'categorySort.item.pear', arasaacId: 2561 },
        ],
        hintKey: 'categorySort.hint.notFruit',
      },
      {
        items: [
          { id: 'shirt3', nameKey: 'categorySort.item.shirt', arasaacId: 13640 },
          { id: 'pants3', nameKey: 'categorySort.item.pants', arasaacId: 2565 },
          { id: 'fish3', nameKey: 'categorySort.item.fish', arasaacId: 2520, isOdd: true },
          { id: 'hat3', nameKey: 'categorySort.item.hat', arasaacId: 2572 },
        ],
        hintKey: 'categorySort.hint.notClothes',
      },
      {
        items: [
          { id: 'bus3', nameKey: 'categorySort.item.bus', arasaacId: 2262 },
          { id: 'train3', nameKey: 'categorySort.item.train', arasaacId: 2603 },
          { id: 'bicycle3', nameKey: 'categorySort.item.bicycle', arasaacId: 6935 },
          { id: 'flower3', nameKey: 'categorySort.item.flower', arasaacId: 7104, isOdd: true },
        ],
        hintKey: 'categorySort.hint.notVehicle',
      },
      {
        items: [
          { id: 'pencil3', nameKey: 'categorySort.item.pencil', arasaacId: 2440 },
          { id: 'book3', nameKey: 'categorySort.item.book', arasaacId: 25191 },
          { id: 'ruler3', nameKey: 'categorySort.item.ruler', arasaacId: 2815 },
          { id: 'cow3', nameKey: 'categorySort.item.cow', arasaacId: 2609, isOdd: true },
        ],
        hintKey: 'categorySort.hint.notSchool',
      },
    ],
  },
  {
    id: 'odd-mixed',
    level: 4,
    nameKey: 'categorySort.set.oddMixed',
    isOddOneOut: true,
    rounds: [
      {
        items: [
          { id: 'bed3', nameKey: 'categorySort.item.bed', arasaacId: 25900 },
          { id: 'sofa3', nameKey: 'categorySort.item.sofa', arasaacId: 25479 },
          { id: 'lamp3', nameKey: 'categorySort.item.lamp', arasaacId: 4936 },
          { id: 'elephant3', nameKey: 'categorySort.item.elephant', arasaacId: 2372, isOdd: true },
        ],
        hintKey: 'categorySort.hint.notFurniture',
      },
      {
        items: [
          { id: 'water3', nameKey: 'categorySort.item.water', arasaacId: 32464 },
          { id: 'milk3', nameKey: 'categorySort.item.milk', arasaacId: 2445 },
          { id: 'juice3', nameKey: 'categorySort.item.juice', arasaacId: 11461 },
          { id: 'scissors3', nameKey: 'categorySort.item.scissors', arasaacId: 2591, isOdd: true },
        ],
        hintKey: 'categorySort.hint.notDrink',
      },
      {
        items: [
          { id: 'fire3', nameKey: 'categorySort.item.fire', arasaacId: 4654 },
          { id: 'sun3', nameKey: 'categorySort.item.sun', arasaacId: 7252 },
          { id: 'candle3', nameKey: 'categorySort.item.candle', arasaacId: 6242 },
          { id: 'penguin3', nameKey: 'categorySort.item.penguin', arasaacId: 3243, isOdd: true },
        ],
        hintKey: 'categorySort.hint.notHot',
      },
      {
        items: [
          { id: 'rabbit3', nameKey: 'categorySort.item.rabbit', arasaacId: 2351 },
          { id: 'frog3', nameKey: 'categorySort.item.frog', arasaacId: 28473 },
          { id: 'stone3', nameKey: 'categorySort.item.stone', arasaacId: 6594, isOdd: true },
          { id: 'turtle3', nameKey: 'categorySort.item.turtle', arasaacId: 10241 },
        ],
        hintKey: 'categorySort.hint.notLiving',
      },
      {
        items: [
          { id: 'ant3', nameKey: 'categorySort.item.ant', arasaacId: 2425 },
          { id: 'ladybug3', nameKey: 'categorySort.item.ladybug', arasaacId: 2924 },
          { id: 'butterfly3', nameKey: 'categorySort.item.butterfly', arasaacId: 26200 },
          { id: 'mountain3', nameKey: 'categorySort.item.mountain', arasaacId: 2909, isOdd: true },
        ],
        hintKey: 'categorySort.hint.notSmall',
      },
    ],
  },
];

/** Get all sets for a given level */
export function getSetsForLevel(level) {
  return CATEGORY_SETS.filter((s) => s.level === level);
}

/** Get all items from all categories in a set, shuffled */
export function getAllItems(categorySet) {
  if (categorySet.isOddOneOut) return [];
  const items = [];
  for (const cat of categorySet.categories) {
    for (const item of cat.items) {
      items.push({ ...item, categoryId: cat.id });
    }
  }
  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
