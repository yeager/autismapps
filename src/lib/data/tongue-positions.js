/**
 * Tongue position data for Swedish phonemes.
 *
 * Coordinate system: sagittal cross-section viewed from the right side.
 *   X: 0 = front (lips), 1 = back (pharynx)
 *   Y: 0 = top (palate), 1 = bottom (floor of mouth)
 *
 * Each entry defines bezier control points for the tongue surface curve,
 * plus articulatory features like velum state, lip shape, contact points,
 * airflow, and voicing.
 *
 * The SVG renderer interpolates between these positions for smooth animation.
 */

/** @typedef {'closed'|'open'} VelumState */
/** @typedef {'open-wide'|'open'|'neutral'|'rounded'|'spread'|'closed'} LipShape */
/** @typedef {'alveolar'|'velar'|'bilabial'|'labiodental'|'palatal'|'retroflex'|'postalveolar'|null} ContactPoint */

/**
 * @typedef {Object} TonguePosition
 * @property {[number,number]} tip - Tongue tip position [x, y]
 * @property {[number,number]} body - Tongue body position [x, y]
 * @property {[number,number]} root - Tongue root position [x, y]
 * @property {VelumState} velum - Velum (soft palate) state
 * @property {LipShape} lips - Lip shape
 * @property {ContactPoint} [contact] - Where tongue contacts roof of mouth
 * @property {string} [airflow] - Airflow pattern: 'groove', 'central', 'lateral'
 * @property {string} [vibrate] - What vibrates: 'tip', 'uvula'
 * @property {boolean} [voiced] - Whether vocal folds vibrate
 * @property {string} label - Display label
 * @property {string} ipa - IPA symbol
 * @property {string} example - Swedish example word
 */

/** @type {Record<string, TonguePosition>} */
export const tonguePositions = {
  // ===== LEVEL 1: VOWELS =====
  'a': {
    tip: [0.35, 0.65], body: [0.50, 0.55], root: [0.70, 0.50],
    velum: 'closed', lips: 'open-wide', voiced: true,
    label: 'A', ipa: 'ɑː', example: 'apa'
  },
  'e': {
    tip: [0.30, 0.45], body: [0.40, 0.30], root: [0.65, 0.42],
    velum: 'closed', lips: 'spread', voiced: true,
    label: 'E', ipa: 'eː', example: 'ek'
  },
  'i': {
    tip: [0.25, 0.30], body: [0.30, 0.18], root: [0.60, 0.40],
    velum: 'closed', lips: 'spread', voiced: true,
    label: 'I', ipa: 'iː', example: 'is'
  },
  'o': {
    tip: [0.35, 0.55], body: [0.55, 0.30], root: [0.70, 0.38],
    velum: 'closed', lips: 'rounded', voiced: true,
    label: 'O', ipa: 'uː', example: 'os'
  },
  'u': {
    tip: [0.30, 0.45], body: [0.50, 0.22], root: [0.68, 0.35],
    velum: 'closed', lips: 'rounded', voiced: true,
    label: 'U', ipa: 'ʉː', example: 'ut'
  },
  'y': {
    tip: [0.28, 0.35], body: [0.35, 0.20], root: [0.62, 0.38],
    velum: 'closed', lips: 'rounded', voiced: true,
    label: 'Y', ipa: 'yː', example: 'yta'
  },
  'å': {
    tip: [0.35, 0.58], body: [0.55, 0.35], root: [0.72, 0.40],
    velum: 'closed', lips: 'rounded', voiced: true,
    label: 'Å', ipa: 'oː', example: 'åka'
  },
  'ä': {
    tip: [0.30, 0.50], body: [0.40, 0.35], root: [0.65, 0.45],
    velum: 'closed', lips: 'spread', voiced: true,
    label: 'Ä', ipa: 'ɛː', example: 'äta'
  },
  'ö': {
    tip: [0.30, 0.42], body: [0.38, 0.25], root: [0.63, 0.40],
    velum: 'closed', lips: 'rounded', voiced: true,
    label: 'Ö', ipa: 'øː', example: 'öra'
  },

  // ===== LEVEL 2: STOPS =====
  'b': {
    tip: [0.35, 0.55], body: [0.48, 0.40], root: [0.68, 0.45],
    velum: 'closed', lips: 'closed', contact: 'bilabial', voiced: true,
    label: 'B', ipa: 'b', example: 'bok'
  },
  'd': {
    tip: [0.22, 0.15], body: [0.40, 0.30], root: [0.65, 0.42],
    velum: 'closed', lips: 'neutral', contact: 'alveolar', voiced: true,
    label: 'D', ipa: 'd', example: 'dag'
  },
  'g': {
    tip: [0.38, 0.52], body: [0.58, 0.15], root: [0.72, 0.30],
    velum: 'closed', lips: 'neutral', contact: 'velar', voiced: true,
    label: 'G', ipa: 'ɡ', example: 'gul'
  },
  'k': {
    tip: [0.40, 0.50], body: [0.60, 0.15], root: [0.70, 0.30],
    velum: 'closed', lips: 'neutral', contact: 'velar', voiced: false,
    label: 'K', ipa: 'k', example: 'katt'
  },
  'p': {
    tip: [0.35, 0.55], body: [0.48, 0.40], root: [0.68, 0.45],
    velum: 'closed', lips: 'closed', contact: 'bilabial', voiced: false,
    label: 'P', ipa: 'p', example: 'pappa'
  },
  't': {
    tip: [0.22, 0.15], body: [0.40, 0.30], root: [0.65, 0.42],
    velum: 'closed', lips: 'neutral', contact: 'alveolar', voiced: false,
    label: 'T', ipa: 't', example: 'tak'
  },

  // ===== LEVEL 3: FRICATIVES =====
  'f': {
    tip: [0.35, 0.55], body: [0.48, 0.38], root: [0.68, 0.44],
    velum: 'closed', lips: 'neutral', contact: 'labiodental', voiced: false,
    airflow: 'central',
    label: 'F', ipa: 'f', example: 'fisk'
  },
  'v': {
    tip: [0.35, 0.55], body: [0.48, 0.38], root: [0.68, 0.44],
    velum: 'closed', lips: 'neutral', contact: 'labiodental', voiced: true,
    airflow: 'central',
    label: 'V', ipa: 'v', example: 'val'
  },
  's': {
    tip: [0.22, 0.18], body: [0.38, 0.25], root: [0.62, 0.40],
    velum: 'closed', lips: 'spread', voiced: false,
    airflow: 'groove', contact: 'alveolar',
    label: 'S', ipa: 's', example: 'sol'
  },
  'sj': {
    tip: [0.30, 0.30], body: [0.45, 0.22], root: [0.65, 0.38],
    velum: 'closed', lips: 'rounded', voiced: false,
    airflow: 'central', contact: 'postalveolar',
    label: 'SJ', ipa: 'ɧ', example: 'sjö'
  },
  'tj': {
    tip: [0.25, 0.20], body: [0.35, 0.18], root: [0.60, 0.38],
    velum: 'closed', lips: 'spread', voiced: false,
    airflow: 'central', contact: 'palatal',
    label: 'TJ', ipa: 'ɕ', example: 'tjugo'
  },
  'h': {
    tip: [0.35, 0.55], body: [0.48, 0.40], root: [0.68, 0.45],
    velum: 'closed', lips: 'open', voiced: false,
    airflow: 'central',
    label: 'H', ipa: 'h', example: 'hund'
  },

  // ===== LEVEL 4: LIQUIDS & NASALS =====
  'l': {
    tip: [0.22, 0.15], body: [0.42, 0.35], root: [0.65, 0.42],
    velum: 'closed', lips: 'neutral', contact: 'alveolar', voiced: true,
    airflow: 'lateral',
    label: 'L', ipa: 'l', example: 'lampa'
  },
  'r': {
    tip: [0.22, 0.20], body: [0.40, 0.30], root: [0.63, 0.42],
    velum: 'closed', lips: 'neutral', voiced: true,
    vibrate: 'tip',
    label: 'R', ipa: 'r', example: 'ros'
  },
  'm': {
    tip: [0.35, 0.55], body: [0.48, 0.40], root: [0.68, 0.45],
    velum: 'open', lips: 'closed', contact: 'bilabial', voiced: true,
    label: 'M', ipa: 'm', example: 'mamma'
  },
  'n': {
    tip: [0.22, 0.15], body: [0.40, 0.35], root: [0.65, 0.42],
    velum: 'open', lips: 'neutral', contact: 'alveolar', voiced: true,
    label: 'N', ipa: 'n', example: 'nej'
  },
  'ng': {
    tip: [0.38, 0.50], body: [0.58, 0.15], root: [0.72, 0.32],
    velum: 'open', lips: 'neutral', contact: 'velar', voiced: true,
    label: 'NG', ipa: 'ŋ', example: 'ring'
  },

  // ===== LEVEL 5: RETROFLEXES (Swedish-specific!) =====
  'rt': {
    tip: [0.28, 0.12], body: [0.45, 0.25], root: [0.65, 0.40],
    velum: 'closed', lips: 'neutral', contact: 'retroflex', voiced: false,
    label: 'RT', ipa: 'ʈ', example: 'kart'
  },
  'rd': {
    tip: [0.28, 0.12], body: [0.45, 0.25], root: [0.65, 0.40],
    velum: 'closed', lips: 'neutral', contact: 'retroflex', voiced: true,
    label: 'RD', ipa: 'ɖ', example: 'bord'
  },
  'rn': {
    tip: [0.28, 0.12], body: [0.45, 0.28], root: [0.65, 0.40],
    velum: 'open', lips: 'neutral', contact: 'retroflex', voiced: true,
    label: 'RN', ipa: 'ɳ', example: 'barn'
  },
  'rl': {
    tip: [0.28, 0.12], body: [0.45, 0.30], root: [0.65, 0.42],
    velum: 'closed', lips: 'neutral', contact: 'retroflex', voiced: true,
    airflow: 'lateral',
    label: 'RL', ipa: 'ɭ', example: 'Karl'
  },
  'rs': {
    tip: [0.28, 0.14], body: [0.42, 0.25], root: [0.63, 0.40],
    velum: 'closed', lips: 'neutral', contact: 'retroflex', voiced: false,
    airflow: 'groove',
    label: 'RS', ipa: 'ʂ', example: 'fors'
  },
};

/**
 * Sound categories organized by progressive difficulty levels.
 */
export const soundLevels = [
  {
    id: 'vowels',
    level: 1,
    labelKey: 'tongueViewer.level.vowels',
    icon: '🗣️',
    sounds: ['a', 'e', 'i', 'o', 'u', 'y', 'å', 'ä', 'ö'],
  },
  {
    id: 'stops',
    level: 2,
    labelKey: 'tongueViewer.level.stops',
    icon: '💥',
    sounds: ['b', 'd', 'g', 'k', 'p', 't'],
  },
  {
    id: 'fricatives',
    level: 3,
    labelKey: 'tongueViewer.level.fricatives',
    icon: '💨',
    sounds: ['f', 'v', 's', 'sj', 'tj', 'h'],
  },
  {
    id: 'liquids-nasals',
    level: 4,
    labelKey: 'tongueViewer.level.liquidsNasals',
    icon: '🌊',
    sounds: ['l', 'r', 'm', 'n', 'ng'],
  },
  {
    id: 'retroflexes',
    level: 5,
    labelKey: 'tongueViewer.level.retroflexes',
    icon: '🇸🇪',
    sounds: ['rt', 'rd', 'rn', 'rl', 'rs'],
  },
];

/**
 * Practice sequences — common Swedish syllable patterns.
 */
export const practiceSequences = [
  { id: 'ba-da-ga', labelKey: 'tongueViewer.seq.badaga', sounds: ['b', 'a', 'd', 'a', 'g', 'a'], text: 'ba-da-ga' },
  { id: 'pa-ta-ka', labelKey: 'tongueViewer.seq.pataka', sounds: ['p', 'a', 't', 'a', 'k', 'a'], text: 'pa-ta-ka' },
  { id: 'ma-na-nga', labelKey: 'tongueViewer.seq.mananga', sounds: ['m', 'a', 'n', 'a', 'ng', 'a'], text: 'ma-na-nga' },
  { id: 'la-ra', labelKey: 'tongueViewer.seq.lara', sounds: ['l', 'a', 'r', 'a'], text: 'la-ra' },
  { id: 'si-sji-tji', labelKey: 'tongueViewer.seq.sisjitji', sounds: ['s', 'i', 'sj', 'i', 'tj', 'i'], text: 'si-sji-tji' },
  { id: 'rt-rd-rn-rl', labelKey: 'tongueViewer.seq.retroflexes', sounds: ['rt', 'a', 'rd', 'a', 'rn', 'a', 'rl', 'a'], text: 'rta-rda-rna-rla' },
];
