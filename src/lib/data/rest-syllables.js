/**
 * ReST — Rapid Syllable Transition Training
 * Syllable data and level definitions for CAS/verbal dyspraxia therapy.
 *
 * Swedish CV (consonant-vowel) syllables used throughout.
 * Stress patterns: 1 = stressed (BIG), 0 = unstressed (small)
 */

// All available Swedish CV syllables
const CONSONANTS = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v'];
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'y', 'å', 'ä', 'ö'];

/**
 * Generate a random CV syllable
 */
export function randomSyllable() {
  const c = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
  const v = VOWELS[Math.floor(Math.random() * VOWELS.length)];
  return c + v;
}

/**
 * @typedef {Object} SyllableSequence
 * @property {string} id - Unique identifier
 * @property {string[]} syllables - Array of syllables
 * @property {number[]} stress - Stress pattern (1=stressed, 0=unstressed)
 * @property {string} display - Human-readable display string
 */

/**
 * @typedef {Object} Level
 * @property {number} id - Level number
 * @property {string} nameKey - i18n key for level name
 * @property {string} descKey - i18n key for level description
 * @property {string} icon - Emoji icon
 * @property {SyllableSequence[]} sequences - Available sequences
 * @property {number} defaultSpeed - Default TTS speed for this level
 * @property {boolean} speedChallenge - Whether speed increases over time
 */

/** @type {Level[]} */
export const LEVELS = [
  {
    id: 1,
    nameKey: 'restTrainer.level1.name',
    descKey: 'restTrainer.level1.desc',
    icon: '🟢',
    defaultSpeed: 0.3,
    speedChallenge: false,
    sequences: [
      { id: 'l1-1', syllables: ['ba', 'na'], stress: [1, 0], display: 'BA-na' },
      { id: 'l1-2', syllables: ['bi', 'la'], stress: [1, 0], display: 'BI-la' },
      { id: 'l1-3', syllables: ['da', 'ta'], stress: [1, 0], display: 'DA-ta' },
      { id: 'l1-4', syllables: ['ma', 'ma'], stress: [1, 0], display: 'MA-ma' },
      { id: 'l1-5', syllables: ['pa', 'pa'], stress: [1, 0], display: 'PA-pa' },
      { id: 'l1-6', syllables: ['ka', 'ka'], stress: [1, 0], display: 'KA-ka' },
      { id: 'l1-7', syllables: ['va', 'ra'], stress: [1, 0], display: 'VA-ra' },
      { id: 'l1-8', syllables: ['ha', 'ja'], stress: [0, 1], display: 'ha-JA' },
    ],
  },
  {
    id: 2,
    nameKey: 'restTrainer.level2.name',
    descKey: 'restTrainer.level2.desc',
    icon: '🔵',
    defaultSpeed: 0.4,
    speedChallenge: false,
    sequences: [
      { id: 'l2-1', syllables: ['fi', 'ku'], stress: [1, 0], display: 'FI-ku' },
      { id: 'l2-2', syllables: ['me', 'ta'], stress: [0, 1], display: 'me-TA' },
      { id: 'l2-3', syllables: ['so', 'la'], stress: [1, 0], display: 'SO-la' },
      { id: 'l2-4', syllables: ['nä', 'bo'], stress: [0, 1], display: 'nä-BO' },
      { id: 'l2-5', syllables: ['ry', 'ge'], stress: [1, 0], display: 'RY-ge' },
      { id: 'l2-6', syllables: ['hö', 'vi'], stress: [0, 1], display: 'hö-VI' },
      { id: 'l2-7', syllables: ['lå', 'du'], stress: [1, 0], display: 'LÅ-du' },
      { id: 'l2-8', syllables: ['pä', 'gu'], stress: [0, 1], display: 'pä-GU' },
    ],
  },
  {
    id: 3,
    nameKey: 'restTrainer.level3.name',
    descKey: 'restTrainer.level3.desc',
    icon: '🟡',
    defaultSpeed: 0.4,
    speedChallenge: false,
    sequences: [
      { id: 'l3-1', syllables: ['ba', 'na', 'na'], stress: [1, 0, 0], display: 'BA-na-na' },
      { id: 'l3-2', syllables: ['fi', 'ku', 'la'], stress: [1, 0, 0], display: 'FI-ku-la' },
      { id: 'l3-3', syllables: ['me', 'ta', 'so'], stress: [0, 1, 0], display: 'me-TA-so' },
      { id: 'l3-4', syllables: ['da', 'le', 'ri'], stress: [0, 0, 1], display: 'da-le-RI' },
      { id: 'l3-5', syllables: ['to', 'ma', 'te'], stress: [1, 0, 0], display: 'TO-ma-te' },
      { id: 'l3-6', syllables: ['pa', 'vu', 'nä'], stress: [0, 1, 0], display: 'pa-VU-nä' },
      { id: 'l3-7', syllables: ['ky', 'la', 'fo'], stress: [0, 0, 1], display: 'ky-la-FO' },
      { id: 'l3-8', syllables: ['se', 'bi', 'go'], stress: [1, 0, 0], display: 'SE-bi-go' },
    ],
  },
  {
    id: 4,
    nameKey: 'restTrainer.level4.name',
    descKey: 'restTrainer.level4.desc',
    icon: '🟠',
    defaultSpeed: 0.5,
    speedChallenge: false,
    sequences: [
      // Variable stress on 2 syllables
      { id: 'l4-1', syllables: ['ba', 'da'], stress: [1, 0], display: 'BA-da' },
      { id: 'l4-2', syllables: ['ba', 'da'], stress: [0, 1], display: 'ba-DA' },
      { id: 'l4-3', syllables: ['fi', 'la'], stress: [1, 0], display: 'FI-la' },
      { id: 'l4-4', syllables: ['fi', 'la'], stress: [0, 1], display: 'fi-LA' },
      // Variable stress on 3 syllables
      { id: 'l4-5', syllables: ['ma', 'ne', 'ko'], stress: [1, 0, 0], display: 'MA-ne-ko' },
      { id: 'l4-6', syllables: ['ma', 'ne', 'ko'], stress: [0, 1, 0], display: 'ma-NE-ko' },
      { id: 'l4-7', syllables: ['ma', 'ne', 'ko'], stress: [0, 0, 1], display: 'ma-ne-KO' },
      { id: 'l4-8', syllables: ['tu', 'ra', 'bi'], stress: [1, 0, 1], display: 'TU-ra-BI' },
    ],
  },
  {
    id: 5,
    nameKey: 'restTrainer.level5.name',
    descKey: 'restTrainer.level5.desc',
    icon: '🔴',
    defaultSpeed: 0.5,
    speedChallenge: true,
    sequences: [
      { id: 'l5-1', syllables: ['ba', 'da', 'ka'], stress: [1, 0, 0], display: 'BA-da-ka' },
      { id: 'l5-2', syllables: ['fi', 'so', 'me'], stress: [0, 1, 0], display: 'fi-SO-me' },
      { id: 'l5-3', syllables: ['la', 'nu', 'pe'], stress: [0, 0, 1], display: 'la-nu-PE' },
      { id: 'l5-4', syllables: ['te', 'vy', 'gö'], stress: [1, 0, 1], display: 'TE-vy-GÖ' },
      { id: 'l5-5', syllables: ['rå', 'hi'], stress: [1, 0], display: 'RÅ-hi' },
      { id: 'l5-6', syllables: ['jä', 'ku', 'sa'], stress: [1, 1, 0], display: 'JÄ-KU-sa' },
      { id: 'l5-7', syllables: ['bö', 'ni', 'fa'], stress: [0, 1, 1], display: 'bö-NI-FA' },
      { id: 'l5-8', syllables: ['du', 'me', 'la'], stress: [1, 0, 0], display: 'DU-me-la' },
    ],
  },
];

/**
 * Star thresholds for scoring
 * Based on attempt count and self-assessment
 */
export const STAR_THRESHOLDS = {
  FIRST_TRY: 3,    // ⭐⭐⭐ — perfect on first attempt
  GOOD: 2,         // ⭐⭐ — good after a few tries
  TRIED: 1,        // ⭐ — completed with effort
};

/**
 * Speed progression for Level 5 (speed challenge)
 * Each round increases speed by this factor
 */
export const SPEED_INCREMENT = 0.1;
export const MIN_SPEED = 0.1;
export const MAX_SPEED = 2.0;
export const DEFAULT_SPEED = 0.5;
