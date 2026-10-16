import type { SayMap, SyllableWordSet } from '../speech-types';

// Cada sílaba é falada sozinha. Evitados: s intervocálico (soaria [z] na palavra e [s] sozinho)
// e r intervocálico (tepe na palavra, R forte sozinho).
export const WORD_SETS_PT: SyllableWordSet[] = [
  {
    labelKey: 'syllableJump.set.easy',
    words: [
      { word: 'bolo', syllables: ['bo', 'lo'], icon: '🎂' },
      { word: 'pato', syllables: ['pa', 'to'], icon: '🦆' },
      { word: 'gato', syllables: ['ga', 'to'], icon: '🐱' },
      { word: 'sapo', syllables: ['sa', 'po'], icon: '🐸' },
      { word: 'uva', syllables: ['u', 'va'], icon: '🍇' },
      { word: 'dado', syllables: ['da', 'do'], icon: '🎲' },
      { word: 'vaca', syllables: ['va', 'ca'], icon: '🐄' },
      { word: 'pipa', syllables: ['pi', 'pa'], icon: '🪁' },
    ],
  },
  {
    labelKey: 'syllableJump.set.medium',
    words: [
      { word: 'banana', syllables: ['ba', 'na', 'na'], icon: '🍌' },
      { word: 'sapato', syllables: ['sa', 'pa', 'to'], icon: '👞' },
      { word: 'macaco', syllables: ['ma', 'ca', 'co'], icon: '🐒' },
      { word: 'tomate', syllables: ['to', 'ma', 'te'], icon: '🍅' },
      { word: 'cavalo', syllables: ['ca', 'va', 'lo'], icon: '🐴' },
      { word: 'janela', syllables: ['ja', 'ne', 'la'], icon: '🪟' },
      { word: 'pipoca', syllables: ['pi', 'po', 'ca'], icon: '🍿' },
      { word: 'galinha', syllables: ['ga', 'li', 'nha'], icon: '🐔' },
    ],
  },
  {
    labelKey: 'syllableJump.set.hard',
    words: [
      { word: 'borboleta', syllables: ['bor', 'bo', 'le', 'ta'], icon: '🦋' },
      { word: 'hipopótamo', syllables: ['hi', 'po', 'pó', 'ta', 'mo'], icon: '🦛' },
      { word: 'melancia', syllables: ['me', 'lan', 'ci', 'a'], icon: '🍉' },
      { word: 'abacaxi', syllables: ['a', 'ba', 'ca', 'xi'], icon: '🍍' },
      { word: 'chocolate', syllables: ['cho', 'co', 'la', 'te'], icon: '🍫' },
      { word: 'ambulância', syllables: ['am', 'bu', 'lân', 'ci', 'a'], icon: '🚑' },
      { word: 'computador', syllables: ['com', 'pu', 'ta', 'dor'], icon: '💻' },
      { word: 'bicicleta', syllables: ['bi', 'ci', 'cle', 'ta'], icon: '🚲' },
    ],
  },
];

export const SAY_PT: SayMap = {
  // Sozinhas, o espeak reduz "ne", "le", "me" e "cle" a [ɪ] e lê "am" como [ɐ̃w]: usa a vogal da palavra
  ne: 'né', le: 'lê', me: 'mê', cle: 'clé', am: 'hã',
  // "da", "na" e "la" sozinhos são lidos átonos (contrações e artigo)
  da: 'dá', na: 'ná', la: 'lá',
};
