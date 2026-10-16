// Content types of the speech apps. The Swedish data stays inline in each page and the pt-BR data lives in
// src/lib/data/pt-br/; both use these types so pick() returns a single shape.

/** Displayed text → text sent to the TTS, for short strings the pt-BR phonemizer reads wrong */
export type SayMap = Record<string, string>;

// word-parade
export interface MinimalPair {
  word1: string;
  word2: string;
  icon1: string;
  icon2: string;
  contrastType: 'voicing' | 'place' | 'manner' | 'vowel';
}

// sound-lottery
export interface PhonemeData {
  sound: string;
  isolation: string;
  syllables: string[];
  words: { text: string; icon: string }[];
  sentences: string[];
}

// sound-chain
export interface SoundChain {
  sounds: string[];
  word: string;
  /** Not rendered; only the Swedish data carries it */
  wordKey?: string;
  icon: string;
}

export interface ChainLevel {
  id: string;
  labelKey: string;
  chains: SoundChain[];
}

// syllable-jump
export interface SyllableWord {
  word: string;
  syllables: string[];
  icon: string;
}

export interface SyllableWordSet {
  labelKey: string;
  words: SyllableWord[];
}

// the-mimic
export type MimicLevel = 'sounds' | 'words' | 'phrases' | 'sentences';

export interface MimicItem {
  text: string;
  icon: string;
}

// speech-practice
export interface PracticeItem {
  text: string;
  icon: string;
  /** Not rendered; only the Swedish data carries it */
  labelKey?: string;
  difficulty: number; // 1-3
}

export interface PracticeSet {
  id: string;
  labelKey: string;
  items: PracticeItem[];
}

// word-builder
export interface BuilderWord {
  word: string;
  hint: string;
}

// speech-rhythm
export interface RhythmWord {
  text: string;
  syllables: string[];
  stressIndex: number;
  icon: string;
}

export interface IntonationPattern {
  text: string;
  icon: string;
  contour: number[];
  type: 'statement' | 'question' | 'exclamation';
}

// rest-trainer (the Swedish levels are in rest-syllables.js, typed with JSDoc)
export interface SyllableSequence {
  id: string;
  syllables: string[];
  /** 1 = stressed, 0 = unstressed */
  stress: number[];
  display: string;
  /** Spoken form of the whole sequence; without it the syllables are spoken as separate words */
  say?: string;
}

export interface RestLevel {
  id: number;
  nameKey: string;
  descKey: string;
  icon: string;
  defaultSpeed: number;
  speedChallenge: boolean;
  sequences: SyllableSequence[];
}

// ── Ciclo C: sounds, letters and prosody ──

// mouth-motor (Swedish data: src/lib/data/mouth-sounds.js)
export type MouthSoundType = 'vowels' | 'stops' | 'fricatives' | 'nasals' | 'liquids' | 'glides';

export interface MouthSound {
  id: string;
  symbol: string;
  ipa: string;
  type: MouthSoundType;
  voiced: boolean;
  exampleWord: string;
  /** Only the Swedish data carries it; not rendered */
  exampleWordEn?: string;
  exampleArasaac: number;
  lips: 'closed' | 'rounded' | 'spread' | 'open';
  tongue:
    | 'neutral' | 'front-high' | 'front-low' | 'back-high' | 'back-low'
    | 'tip-alveolar' | 'tip-postalveolar' | 'tip-dental' | 'blade-palatal' | 'body-palatal';
  jaw: 'wide' | 'medium' | 'narrow' | 'closed';
  velum: 'closed' | 'open';
  airflow: 'burst' | 'continuous' | 'nasal' | 'lateral' | 'trill' | 'tap' | 'none';
  tongueX: number;
  tongueY: number;
  tongueTipX: number;
  tongueTipY: number;
  lipRound: number;
  lipOpen: number;
  special?: 'labiodental' | 'glottal';
}

export interface SoundPair {
  a: string;
  b: string;
  contrastKey: string;
}

// tongue-viewer (Swedish data: src/lib/data/tongue-positions.js)
export interface TonguePosition {
  tip: [number, number];
  body: [number, number];
  root: [number, number];
  velum: 'closed' | 'open';
  lips: 'open-wide' | 'open' | 'neutral' | 'rounded' | 'spread' | 'closed';
  contact?: 'alveolar' | 'velar' | 'bilabial' | 'labiodental' | 'palatal' | 'retroflex' | 'postalveolar';
  airflow?: 'groove' | 'central' | 'lateral';
  vibrate?: 'tip';
  voiced: boolean;
  label: string;
  ipa: string;
  example: string;
}

export interface SoundLevel {
  id: string;
  level: number;
  labelKey: string;
  icon: string;
  sounds: string[];
}

export interface PracticeSequence {
  id: string;
  /** Not rendered; only the Swedish data carries it */
  labelKey?: string;
  sounds: string[];
  text: string;
  /** Text spoken at each step ('' = silent). Without it, each sound's label is spoken (Swedish data) */
  say?: string[];
}

// letter-journey (Swedish data inline in the page)
export interface LetterDef {
  letter: string;
  /** Letter name as displayed */
  name: string;
  /** Sound as displayed; '' for a silent letter */
  sound: string;
  /** Mouth-cue emoji */
  cue: string;
  /** Mouth hint: an i18n key (Swedish data) or the text itself (pt data) */
  mouthKey?: string;
  mouth?: string;
  vowel: boolean;
  /** What Explore says when the letter is tapped */
  explore: string;
  /** Never the target of "Find the letter" (silent or loanword letters) */
  noTarget?: boolean;
}

export interface LetterWord {
  word: string;
  /** i18n key of the translation shown under the word (Swedish data) */
  hint?: string;
  /** Emoji shown under the word instead of the hint (pt data) */
  icon?: string;
  syllables: string[];
  stress: number;
}

// prompt-guide (Swedish data: src/lib/data/prompt-data.js)
export type PromptCategory = 'jaw' | 'lips' | 'tongue-tip' | 'back' | 'combined';

export interface PromptCategoryDef {
  id: PromptCategory;
  labelKey: string;
  icon: string;
  color: string;
}

/** A PROMPT entry with its texts already resolved for the locale */
export interface PromptSound {
  sound: string;
  ipa: string;
  category: PromptCategory;
  touchZone: string;
  touchZoneSecondary?: string;
  direction: 'up' | 'down' | 'forward' | 'back' | 'inward' | 'lateral' | 'none';
  pressure: 'light' | 'medium' | 'firm';
  duration: 'brief' | 'hold' | 'sustained';
  description: string;
  steps: string[];
  exampleWord: string;
  arasaacId: number;
  videoPlaceholder?: boolean;
  /** pt cue built by analogy with the existing ones; the review doc flags it */
  analogy?: boolean;
}

// prosody-trainer (Swedish data: src/lib/data/prosody-data.js)
export interface ProsodyWord {
  word: string;
  stress: number;
  syllables: string[];
  icon: string;
}

export interface IntonationSentence {
  text: string;
  type: 'statement' | 'question' | 'exclamation';
  icon: string;
  contour: number[];
}

export interface EmotionItem {
  /** Also the i18n key suffix (prosody.emotion.*) */
  emotion: 'glad' | 'ledsen' | 'arg' | 'förvånad';
  icon: string;
  sentence: string;
  contour: number[];
  /** Only the Swedish data carries it; not rendered */
  arasaacId?: number;
}

export interface RhythmPattern {
  text: string;
  pattern: ('da' | 'DA')[];
  beats: boolean[];
  icon: string;
  /** Only the pt data carries it, for the tests */
  syllables?: string[];
}

export interface ProsodyContent {
  twoSyllableWords: ProsodyWord[];
  threeSyllableWords: ProsodyWord[];
  intonationSentences: IntonationSentence[];
  emotionData: EmotionItem[];
  rhythmPatterns: RhythmPattern[];
  fullSentences: IntonationSentence[];
}

// melody-therapy (Swedish data: src/lib/data/mit-phrases.js)
export interface MitNote {
  note: 'C4' | 'D4' | 'E4' | 'F4' | 'G4' | 'A4';
  duration: number;
}

export interface MitPhrase {
  id: string;
  text: string;
  syllables: string[];
  melody: MitNote[];
  category: 'greetings' | 'wants' | 'social' | 'everyday';
  arasaacId: number;
  /** Index of the stressed syllable (pt data, checked by the tests) */
  stress?: number;
}
