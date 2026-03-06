/**
 * Swedish phoneme articulation data for Mouth Motor (Munmotorik-visualisering).
 *
 * Each entry describes WHERE to place tongue, lips, and jaw for one Swedish sound.
 * Used to drive the sagittal SVG cross-section and front lip view.
 *
 * Articulatory properties:
 *   lips:     closed | rounded | spread | open
 *   tongue:   neutral | front-high | front-low | back-high | back-low |
 *             tip-alveolar | tip-postalveolar | tip-dental | blade-palatal | body-palatal
 *   jaw:      wide | medium | narrow | closed
 *   velum:    closed (oral) | open (nasal)
 *   airflow:  burst | continuous | nasal | lateral | trill | none
 *   voiced:   true | false
 *
 * ARASAAC pictogram URLs:  https://static.arasaac.org/pictograms/{id}/{id}_500.png
 */

export const SOUND_TYPES = [
  { id: 'vowels',     labelKey: 'mouthMotor.type.vowels',     color: '#E74C3C', icon: '🔴' },
  { id: 'stops',      labelKey: 'mouthMotor.type.stops',      color: '#3498DB', icon: '🔵' },
  { id: 'fricatives', labelKey: 'mouthMotor.type.fricatives', color: '#2ECC71', icon: '🟢' },
  { id: 'nasals',     labelKey: 'mouthMotor.type.nasals',     color: '#9B59B6', icon: '🟣' },
  { id: 'liquids',    labelKey: 'mouthMotor.type.liquids',    color: '#E67E22', icon: '🟠' },
  { id: 'glides',     labelKey: 'mouthMotor.type.glides',     color: '#1ABC9C', icon: '🩵' },
];

/** @type {Array<{
 *   id: string, symbol: string, ipa: string, type: string,
 *   voiced: boolean, exampleWord: string, exampleWordEn: string,
 *   exampleArasaac: number,
 *   lips: string, tongue: string, jaw: string, velum: string, airflow: string,
 *   tongueX: number, tongueY: number, tongueTipX: number, tongueTipY: number,
 *   lipRound: number, lipOpen: number
 * }>} */
export const sounds = [
  // ─── VOWELS ───
  {
    id: 'a', symbol: 'a', ipa: 'ɑː', type: 'vowels',
    voiced: true, exampleWord: 'apa', exampleWordEn: 'monkey',
    exampleArasaac: 2434,
    lips: 'open', tongue: 'back-low', jaw: 'wide', velum: 'closed', airflow: 'continuous',
    tongueX: 0.45, tongueY: 0.75, tongueTipX: 0.35, tongueTipY: 0.72,
    lipRound: 0, lipOpen: 0.9,
  },
  {
    id: 'e', symbol: 'e', ipa: 'eː', type: 'vowels',
    voiced: true, exampleWord: 'ek', exampleWordEn: 'oak',
    exampleArasaac: 2919,
    lips: 'spread', tongue: 'front-high', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.35, tongueY: 0.42, tongueTipX: 0.28, tongueTipY: 0.48,
    lipRound: 0, lipOpen: 0.3,
  },
  {
    id: 'i', symbol: 'i', ipa: 'iː', type: 'vowels',
    voiced: true, exampleWord: 'is', exampleWordEn: 'ice cream',
    exampleArasaac: 8115,
    lips: 'spread', tongue: 'front-high', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.32, tongueY: 0.35, tongueTipX: 0.25, tongueTipY: 0.42,
    lipRound: 0, lipOpen: 0.15,
  },
  {
    id: 'o', symbol: 'o', ipa: 'uː', type: 'vowels',
    voiced: true, exampleWord: 'orm', exampleWordEn: 'snake',
    exampleArasaac: 2627,
    lips: 'rounded', tongue: 'back-high', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.55, tongueY: 0.40, tongueTipX: 0.35, tongueTipY: 0.55,
    lipRound: 0.9, lipOpen: 0.25,
  },
  {
    id: 'u', symbol: 'u', ipa: 'ʉː', type: 'vowels',
    voiced: true, exampleWord: 'uggla', exampleWordEn: 'owl',
    exampleArasaac: 2671,
    lips: 'rounded', tongue: 'front-high', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.38, tongueY: 0.38, tongueTipX: 0.30, tongueTipY: 0.48,
    lipRound: 0.85, lipOpen: 0.2,
  },
  {
    id: 'y', symbol: 'y', ipa: 'yː', type: 'vowels',
    voiced: true, exampleWord: 'yxa', exampleWordEn: 'axe',
    exampleArasaac: 2890,
    lips: 'rounded', tongue: 'front-high', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.33, tongueY: 0.34, tongueTipX: 0.26, tongueTipY: 0.44,
    lipRound: 0.8, lipOpen: 0.15,
  },
  {
    id: 'å', symbol: 'å', ipa: 'oː', type: 'vowels',
    voiced: true, exampleWord: 'ål', exampleWordEn: 'eel',
    exampleArasaac: 2629,
    lips: 'rounded', tongue: 'back-high', jaw: 'medium', velum: 'closed', airflow: 'continuous',
    tongueX: 0.52, tongueY: 0.42, tongueTipX: 0.35, tongueTipY: 0.55,
    lipRound: 0.8, lipOpen: 0.35,
  },
  {
    id: 'ä', symbol: 'ä', ipa: 'ɛː', type: 'vowels',
    voiced: true, exampleWord: 'äpple', exampleWordEn: 'apple',
    exampleArasaac: 2432,
    lips: 'spread', tongue: 'front-low', jaw: 'medium', velum: 'closed', airflow: 'continuous',
    tongueX: 0.35, tongueY: 0.55, tongueTipX: 0.28, tongueTipY: 0.58,
    lipRound: 0, lipOpen: 0.55,
  },
  {
    id: 'ö', symbol: 'ö', ipa: 'øː', type: 'vowels',
    voiced: true, exampleWord: 'öga', exampleWordEn: 'eye',
    exampleArasaac: 3185,
    lips: 'rounded', tongue: 'front-high', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.35, tongueY: 0.40, tongueTipX: 0.28, tongueTipY: 0.50,
    lipRound: 0.7, lipOpen: 0.3,
  },

  // ─── STOPS ───
  {
    id: 'b', symbol: 'b', ipa: 'b', type: 'stops',
    voiced: true, exampleWord: 'boll', exampleWordEn: 'ball',
    exampleArasaac: 2456,
    lips: 'closed', tongue: 'neutral', jaw: 'closed', velum: 'closed', airflow: 'burst',
    tongueX: 0.42, tongueY: 0.60, tongueTipX: 0.32, tongueTipY: 0.60,
    lipRound: 0, lipOpen: 0,
  },
  {
    id: 'd', symbol: 'd', ipa: 'd', type: 'stops',
    voiced: true, exampleWord: 'dörr', exampleWordEn: 'door',
    exampleArasaac: 3244,
    lips: 'open', tongue: 'tip-alveolar', jaw: 'narrow', velum: 'closed', airflow: 'burst',
    tongueX: 0.38, tongueY: 0.48, tongueTipX: 0.25, tongueTipY: 0.32,
    lipRound: 0, lipOpen: 0.3,
  },
  {
    id: 'g', symbol: 'g', ipa: 'ɡ', type: 'stops',
    voiced: true, exampleWord: 'gris', exampleWordEn: 'pig',
    exampleArasaac: 2519,
    lips: 'open', tongue: 'back-high', jaw: 'narrow', velum: 'closed', airflow: 'burst',
    tongueX: 0.55, tongueY: 0.38, tongueTipX: 0.35, tongueTipY: 0.55,
    lipRound: 0, lipOpen: 0.3,
  },
  {
    id: 'k', symbol: 'k', ipa: 'k', type: 'stops',
    voiced: false, exampleWord: 'katt', exampleWordEn: 'cat',
    exampleArasaac: 2463,
    lips: 'open', tongue: 'back-high', jaw: 'narrow', velum: 'closed', airflow: 'burst',
    tongueX: 0.55, tongueY: 0.36, tongueTipX: 0.35, tongueTipY: 0.55,
    lipRound: 0, lipOpen: 0.3,
  },
  {
    id: 'p', symbol: 'p', ipa: 'p', type: 'stops',
    voiced: false, exampleWord: 'pappa', exampleWordEn: 'daddy',
    exampleArasaac: 7029,
    lips: 'closed', tongue: 'neutral', jaw: 'closed', velum: 'closed', airflow: 'burst',
    tongueX: 0.42, tongueY: 0.60, tongueTipX: 0.32, tongueTipY: 0.60,
    lipRound: 0, lipOpen: 0,
  },
  {
    id: 't', symbol: 't', ipa: 't', type: 'stops',
    voiced: false, exampleWord: 'tåg', exampleWordEn: 'train',
    exampleArasaac: 2658,
    lips: 'open', tongue: 'tip-alveolar', jaw: 'narrow', velum: 'closed', airflow: 'burst',
    tongueX: 0.38, tongueY: 0.48, tongueTipX: 0.25, tongueTipY: 0.32,
    lipRound: 0, lipOpen: 0.3,
  },

  // ─── FRICATIVES ───
  {
    id: 'f', symbol: 'f', ipa: 'f', type: 'fricatives',
    voiced: false, exampleWord: 'fisk', exampleWordEn: 'fish',
    exampleArasaac: 2476,
    lips: 'open', tongue: 'neutral', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.42, tongueY: 0.58, tongueTipX: 0.32, tongueTipY: 0.58,
    lipRound: 0, lipOpen: 0.15,
    special: 'labiodental', // lower lip touches upper teeth
  },
  {
    id: 's', symbol: 's', ipa: 's', type: 'fricatives',
    voiced: false, exampleWord: 'sol', exampleWordEn: 'sun',
    exampleArasaac: 2381,
    lips: 'spread', tongue: 'tip-alveolar', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.36, tongueY: 0.42, tongueTipX: 0.24, tongueTipY: 0.34,
    lipRound: 0, lipOpen: 0.2,
  },
  {
    id: 'h', symbol: 'h', ipa: 'h', type: 'fricatives',
    voiced: false, exampleWord: 'hund', exampleWordEn: 'dog',
    exampleArasaac: 2478,
    lips: 'open', tongue: 'neutral', jaw: 'medium', velum: 'closed', airflow: 'continuous',
    tongueX: 0.42, tongueY: 0.58, tongueTipX: 0.32, tongueTipY: 0.58,
    lipRound: 0, lipOpen: 0.5,
    special: 'glottal',
  },
  {
    id: 'sj', symbol: 'sj', ipa: 'ɧ', type: 'fricatives',
    voiced: false, exampleWord: 'sjö', exampleWordEn: 'lake',
    exampleArasaac: 2382,
    lips: 'rounded', tongue: 'tip-postalveolar', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.40, tongueY: 0.42, tongueTipX: 0.27, tongueTipY: 0.36,
    lipRound: 0.6, lipOpen: 0.2,
  },
  {
    id: 'tj', symbol: 'tj', ipa: 'ɕ', type: 'fricatives',
    voiced: false, exampleWord: 'tjuv', exampleWordEn: 'thief',
    exampleArasaac: 2860,
    lips: 'spread', tongue: 'blade-palatal', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.38, tongueY: 0.36, tongueTipX: 0.26, tongueTipY: 0.34,
    lipRound: 0, lipOpen: 0.2,
  },

  // ─── NASALS ───
  {
    id: 'm', symbol: 'm', ipa: 'm', type: 'nasals',
    voiced: true, exampleWord: 'mamma', exampleWordEn: 'mum',
    exampleArasaac: 7028,
    lips: 'closed', tongue: 'neutral', jaw: 'closed', velum: 'open', airflow: 'nasal',
    tongueX: 0.42, tongueY: 0.58, tongueTipX: 0.32, tongueTipY: 0.58,
    lipRound: 0, lipOpen: 0,
  },
  {
    id: 'n', symbol: 'n', ipa: 'n', type: 'nasals',
    voiced: true, exampleWord: 'näsa', exampleWordEn: 'nose',
    exampleArasaac: 2684,
    lips: 'open', tongue: 'tip-alveolar', jaw: 'narrow', velum: 'open', airflow: 'nasal',
    tongueX: 0.38, tongueY: 0.48, tongueTipX: 0.25, tongueTipY: 0.32,
    lipRound: 0, lipOpen: 0.3,
  },
  {
    id: 'ng', symbol: 'ng', ipa: 'ŋ', type: 'nasals',
    voiced: true, exampleWord: 'ring', exampleWordEn: 'ring',
    exampleArasaac: 3221,
    lips: 'open', tongue: 'back-high', jaw: 'narrow', velum: 'open', airflow: 'nasal',
    tongueX: 0.55, tongueY: 0.38, tongueTipX: 0.35, tongueTipY: 0.55,
    lipRound: 0, lipOpen: 0.3,
  },

  // ─── LIQUIDS ───
  {
    id: 'l', symbol: 'l', ipa: 'l', type: 'liquids',
    voiced: true, exampleWord: 'lampa', exampleWordEn: 'lamp',
    exampleArasaac: 4936,
    lips: 'open', tongue: 'tip-alveolar', jaw: 'medium', velum: 'closed', airflow: 'lateral',
    tongueX: 0.38, tongueY: 0.45, tongueTipX: 0.25, tongueTipY: 0.30,
    lipRound: 0, lipOpen: 0.4,
  },
  {
    id: 'r', symbol: 'r', ipa: 'r', type: 'liquids',
    voiced: true, exampleWord: 'robot', exampleWordEn: 'robot',
    exampleArasaac: 6208,
    lips: 'open', tongue: 'tip-alveolar', jaw: 'medium', velum: 'closed', airflow: 'trill',
    tongueX: 0.36, tongueY: 0.44, tongueTipX: 0.24, tongueTipY: 0.30,
    lipRound: 0, lipOpen: 0.4,
  },

  // ─── GLIDES ───
  {
    id: 'j', symbol: 'j', ipa: 'j', type: 'glides',
    voiced: true, exampleWord: 'julgran', exampleWordEn: 'Christmas tree',
    exampleArasaac: 5966,
    lips: 'spread', tongue: 'body-palatal', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.38, tongueY: 0.35, tongueTipX: 0.28, tongueTipY: 0.45,
    lipRound: 0, lipOpen: 0.2,
  },
  {
    id: 'v', symbol: 'v', ipa: 'v', type: 'glides',
    voiced: true, exampleWord: 'vatten', exampleWordEn: 'water',
    exampleArasaac: 4780,
    lips: 'open', tongue: 'neutral', jaw: 'narrow', velum: 'closed', airflow: 'continuous',
    tongueX: 0.42, tongueY: 0.58, tongueTipX: 0.32, tongueTipY: 0.58,
    lipRound: 0, lipOpen: 0.15,
    special: 'labiodental',
  },
];

/**
 * Sound pairs for comparison view.
 * Each pair contrasts a minimal articulatory difference.
 */
export const SOUND_PAIRS = [
  { a: 'b', b: 'p', contrastKey: 'mouthMotor.pair.voicing' },   // voiced vs voiceless
  { a: 'd', b: 't', contrastKey: 'mouthMotor.pair.voicing' },
  { a: 'g', b: 'k', contrastKey: 'mouthMotor.pair.voicing' },
  { a: 's', b: 'sj', contrastKey: 'mouthMotor.pair.place' },    // alveolar vs postalveolar
  { a: 'sj', b: 'tj', contrastKey: 'mouthMotor.pair.place' },
  { a: 'm', b: 'n', contrastKey: 'mouthMotor.pair.place' },     // bilabial vs alveolar nasal
  { a: 'n', b: 'ng', contrastKey: 'mouthMotor.pair.place' },
  { a: 'l', b: 'r', contrastKey: 'mouthMotor.pair.manner' },    // lateral vs trill
  { a: 'i', b: 'y', contrastKey: 'mouthMotor.pair.rounding' },  // spread vs rounded
  { a: 'e', b: 'ö', contrastKey: 'mouthMotor.pair.rounding' },
  { a: 'a', b: 'å', contrastKey: 'mouthMotor.pair.rounding' },
];

/** Helper: get sound by id */
export function getSound(id) {
  return sounds.find(s => s.id === id);
}

/** Helper: get sounds by type */
export function getSoundsByType(type) {
  return sounds.filter(s => s.type === type);
}
