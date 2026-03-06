/**
 * Sensory Profile Data
 * All ARASAAC IDs validated via https://api.arasaac.org/v1/pictograms/en/search/{word}
 */

export const SENSES = [
  {
    id: 'hearing',
    emoji: '👂',
    label: 'sensory.sense.hearing',
    color: '#3498DB',
    items: [
      { id: 'loud_sounds', label: 'sensory.item.loud_sounds' },
      { id: 'background_noise', label: 'sensory.item.background_noise' },
      { id: 'specific_sounds', label: 'sensory.item.specific_sounds' },
      { id: 'sudden_noises', label: 'sensory.item.sudden_noises' },
    ]
  },
  {
    id: 'sight',
    emoji: '👁',
    label: 'sensory.sense.sight',
    color: '#9B59B6',
    items: [
      { id: 'bright_lights', label: 'sensory.item.bright_lights' },
      { id: 'patterns', label: 'sensory.item.patterns' },
      { id: 'flashing', label: 'sensory.item.flashing' },
      { id: 'crowds', label: 'sensory.item.crowds' },
    ]
  },
  {
    id: 'touch',
    emoji: '👐',
    label: 'sensory.sense.touch',
    color: '#E67E22',
    items: [
      { id: 'clothing_tags', label: 'sensory.item.clothing_tags' },
      { id: 'textures', label: 'sensory.item.textures' },
      { id: 'light_touch', label: 'sensory.item.light_touch' },
      { id: 'deep_pressure', label: 'sensory.item.deep_pressure' },
    ]
  },
  {
    id: 'smell',
    emoji: '👃',
    label: 'sensory.sense.smell',
    color: '#27AE60',
    items: [
      { id: 'food_smells', label: 'sensory.item.food_smells' },
      { id: 'perfume', label: 'sensory.item.perfume' },
      { id: 'cleaning_products', label: 'sensory.item.cleaning_products' },
    ]
  },
  {
    id: 'taste',
    emoji: '👅',
    label: 'sensory.sense.taste',
    color: '#E74C3C',
    items: [
      { id: 'food_textures', label: 'sensory.item.food_textures' },
      { id: 'temperatures', label: 'sensory.item.temperatures' },
      { id: 'strong_flavors', label: 'sensory.item.strong_flavors' },
    ]
  },
  {
    id: 'vestibular',
    emoji: '⚖️',
    label: 'sensory.sense.vestibular',
    color: '#F39C12',
    items: [
      { id: 'swinging', label: 'sensory.item.swinging' },
      { id: 'spinning_motion', label: 'sensory.item.spinning_motion' },
      { id: 'car_rides', label: 'sensory.item.car_rides' },
      { id: 'heights', label: 'sensory.item.heights' },
    ]
  },
  {
    id: 'proprioception',
    emoji: '💪',
    label: 'sensory.sense.proprioception',
    color: '#1ABC9C',
    items: [
      { id: 'body_awareness', label: 'sensory.item.body_awareness' },
      { id: 'clumsiness', label: 'sensory.item.clumsiness' },
      { id: 'heavy_work', label: 'sensory.item.heavy_work' },
    ]
  }
];

// Rating values
export const RATINGS = {
  SEEKING: 'seeking',    // Undersöker
  NEUTRAL: 'neutral',    // Neutral
  AVOIDING: 'avoiding',  // Undviker
};

export const RATING_VALUES = {
  seeking: 2,
  neutral: 1,
  avoiding: 0,
};

export const RATING_COLORS = {
  seeking: '#27AE60',
  neutral: '#F1C40F',
  avoiding: '#E74C3C',
};

/**
 * Activities with validated ARASAAC pictogram IDs.
 * Each activity has: id, label (i18n key), arasaacId, senseType (which senses it helps), type (seeking/calming/both)
 */
export const ACTIVITIES = [
  // Movement & Heavy Work (proprioception / vestibular seekers)
  { id: 'trampoline', label: 'sensory.activity.trampoline', arasaacId: 23891, senses: ['vestibular', 'proprioception'], type: 'seeking' },
  { id: 'swing', label: 'sensory.activity.swing', arasaacId: 4608, senses: ['vestibular'], type: 'seeking' },
  { id: 'jump', label: 'sensory.activity.jump', arasaacId: 39052, senses: ['vestibular', 'proprioception'], type: 'seeking' },
  { id: 'climbing', label: 'sensory.activity.climbing', arasaacId: 27741, senses: ['proprioception', 'vestibular'], type: 'seeking' },
  { id: 'dance', label: 'sensory.activity.dance', arasaacId: 35747, senses: ['vestibular', 'proprioception'], type: 'seeking' },
  { id: 'swimming', label: 'sensory.activity.swimming', arasaacId: 25038, senses: ['proprioception', 'touch'], type: 'seeking' },
  { id: 'bicycle', label: 'sensory.activity.bicycle', arasaacId: 6935, senses: ['vestibular', 'proprioception'], type: 'seeking' },
  { id: 'run', label: 'sensory.activity.run', arasaacId: 6465, senses: ['proprioception', 'vestibular'], type: 'seeking' },
  { id: 'yoga', label: 'sensory.activity.yoga', arasaacId: 9098, senses: ['proprioception', 'vestibular'], type: 'both' },
  { id: 'stretch', label: 'sensory.activity.stretch', arasaacId: 8989, senses: ['proprioception'], type: 'both' },
  { id: 'spinning', label: 'sensory.activity.spinning', arasaacId: 34102, senses: ['vestibular'], type: 'seeking' },

  // Touch & Fidget
  { id: 'fidget', label: 'sensory.activity.fidget', arasaacId: 38124, senses: ['touch', 'proprioception'], type: 'seeking' },
  { id: 'clay', label: 'sensory.activity.clay', arasaacId: 5908, senses: ['touch', 'proprioception'], type: 'both' },
  { id: 'sand_play', label: 'sensory.activity.sand_play', arasaacId: 4565, senses: ['touch'], type: 'seeking' },
  { id: 'water_play', label: 'sensory.activity.water_play', arasaacId: 32464, senses: ['touch'], type: 'both' },
  { id: 'bubbles', label: 'sensory.activity.bubbles', arasaacId: 8389, senses: ['sight', 'touch'], type: 'seeking' },
  { id: 'brush', label: 'sensory.activity.brush', arasaacId: 2694, senses: ['touch'], type: 'both' },
  { id: 'hug', label: 'sensory.activity.hug', arasaacId: 4550, senses: ['touch', 'proprioception'], type: 'both' },
  { id: 'massage', label: 'sensory.activity.massage', arasaacId: 9010, senses: ['touch', 'proprioception'], type: 'calming' },

  // Calming / Reducing input
  { id: 'weighted_blanket', label: 'sensory.activity.weighted_blanket', arasaacId: 2459, senses: ['touch', 'proprioception'], type: 'calming' },
  { id: 'headphones', label: 'sensory.activity.headphones', arasaacId: 5915, senses: ['hearing'], type: 'calming' },
  { id: 'sunglasses', label: 'sensory.activity.sunglasses', arasaacId: 3330, senses: ['sight'], type: 'calming' },
  { id: 'quiet_space', label: 'sensory.activity.quiet_space', arasaacId: 38050, senses: ['hearing', 'sight'], type: 'calming' },
  { id: 'deep_breathing', label: 'sensory.activity.deep_breathing', arasaacId: 34377, senses: ['proprioception'], type: 'calming' },
  { id: 'hammock', label: 'sensory.activity.hammock', arasaacId: 24563, senses: ['vestibular', 'proprioception'], type: 'calming' },
  { id: 'pillow', label: 'sensory.activity.pillow', arasaacId: 2250, senses: ['touch'], type: 'calming' },
  { id: 'rocking', label: 'sensory.activity.rocking', arasaacId: 4923, senses: ['vestibular'], type: 'calming' },
  { id: 'calm_music', label: 'sensory.activity.calm_music', arasaacId: 24791, senses: ['hearing'], type: 'calming' },

  // Oral/Taste
  { id: 'chew', label: 'sensory.activity.chew', arasaacId: 32654, senses: ['taste', 'proprioception'], type: 'seeking' },

  // Visual/Creative
  { id: 'drawing', label: 'sensory.activity.drawing', arasaacId: 11238, senses: ['sight', 'touch'], type: 'both' },
  { id: 'puzzle', label: 'sensory.activity.puzzle', arasaacId: 2540, senses: ['sight'], type: 'both' },
  { id: 'reading', label: 'sensory.activity.reading', arasaacId: 2447, senses: ['sight'], type: 'calming' },
  { id: 'ball_play', label: 'sensory.activity.ball_play', arasaacId: 3241, senses: ['proprioception', 'sight'], type: 'seeking' },
  { id: 'nature_walk', label: 'sensory.activity.nature_walk', arasaacId: 29951, senses: ['sight', 'hearing', 'smell'], type: 'both' },
  { id: 'cooking', label: 'sensory.activity.cooking', arasaacId: 30526, senses: ['taste', 'smell', 'touch'], type: 'seeking' },
  { id: 'singing', label: 'sensory.activity.singing', arasaacId: 6960, senses: ['hearing'], type: 'seeking' },
];

// Time slots for sensory diet
export const TIME_SLOTS = [
  { id: 'morning', label: 'sensory.time.morning', emoji: '🌅', color: '#F39C12' },
  { id: 'school', label: 'sensory.time.school', emoji: '🏫', color: '#3498DB' },
  { id: 'afternoon', label: 'sensory.time.afternoon', emoji: '☀️', color: '#E67E22' },
  { id: 'evening', label: 'sensory.time.evening', emoji: '🌙', color: '#9B59B6' },
];

/**
 * Strategy suggestions based on sense + rating combination
 */
export const STRATEGIES = {
  hearing: {
    seeking: ['sensory.strategy.hearing.seek.1', 'sensory.strategy.hearing.seek.2', 'sensory.strategy.hearing.seek.3'],
    avoiding: ['sensory.strategy.hearing.avoid.1', 'sensory.strategy.hearing.avoid.2', 'sensory.strategy.hearing.avoid.3'],
  },
  sight: {
    seeking: ['sensory.strategy.sight.seek.1', 'sensory.strategy.sight.seek.2', 'sensory.strategy.sight.seek.3'],
    avoiding: ['sensory.strategy.sight.avoid.1', 'sensory.strategy.sight.avoid.2', 'sensory.strategy.sight.avoid.3'],
  },
  touch: {
    seeking: ['sensory.strategy.touch.seek.1', 'sensory.strategy.touch.seek.2', 'sensory.strategy.touch.seek.3'],
    avoiding: ['sensory.strategy.touch.avoid.1', 'sensory.strategy.touch.avoid.2', 'sensory.strategy.touch.avoid.3'],
  },
  smell: {
    seeking: ['sensory.strategy.smell.seek.1', 'sensory.strategy.smell.seek.2', 'sensory.strategy.smell.seek.3'],
    avoiding: ['sensory.strategy.smell.avoid.1', 'sensory.strategy.smell.avoid.2', 'sensory.strategy.smell.avoid.3'],
  },
  taste: {
    seeking: ['sensory.strategy.taste.seek.1', 'sensory.strategy.taste.seek.2', 'sensory.strategy.taste.seek.3'],
    avoiding: ['sensory.strategy.taste.avoid.1', 'sensory.strategy.taste.avoid.2', 'sensory.strategy.taste.avoid.3'],
  },
  vestibular: {
    seeking: ['sensory.strategy.vestibular.seek.1', 'sensory.strategy.vestibular.seek.2', 'sensory.strategy.vestibular.seek.3'],
    avoiding: ['sensory.strategy.vestibular.avoid.1', 'sensory.strategy.vestibular.avoid.2', 'sensory.strategy.vestibular.avoid.3'],
  },
  proprioception: {
    seeking: ['sensory.strategy.proprioception.seek.1', 'sensory.strategy.proprioception.seek.2', 'sensory.strategy.proprioception.seek.3'],
    avoiding: ['sensory.strategy.proprioception.avoid.1', 'sensory.strategy.proprioception.avoid.2', 'sensory.strategy.proprioception.avoid.3'],
  },
};

/**
 * Get recommended activities based on a sensory profile
 */
export function getRecommendedActivities(profile) {
  const recommended = [];
  for (const [senseId, rating] of Object.entries(profile)) {
    if (rating === 'seeking') {
      recommended.push(...ACTIVITIES.filter(a => a.senses.includes(senseId) && (a.type === 'seeking' || a.type === 'both')));
    } else if (rating === 'avoiding') {
      recommended.push(...ACTIVITIES.filter(a => a.senses.includes(senseId) && (a.type === 'calming' || a.type === 'both')));
    }
  }
  // Deduplicate
  const seen = new Set();
  return recommended.filter(a => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}
