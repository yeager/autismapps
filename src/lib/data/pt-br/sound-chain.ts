import type { ChainLevel, SayMap } from '../speech-types';

// Os sons de cada corrente formam a palavra; dígrafos contam como um som ("ch").
// Palavras terminadas em -a: um -o final soaria [ʊ] na palavra e [ɔ] sozinho.
export const LEVELS_PT: ChainLevel[] = [
  {
    id: 'vowels', labelKey: 'soundChain.level.vowels',
    chains: [
      { sounds: ['a'], word: 'a', icon: '🅰️' },
      { sounds: ['o'], word: 'o', icon: '⭕' },
      { sounds: ['a', 'i'], word: 'ai', icon: '😣' },
      { sounds: ['u', 'i'], word: 'ui', icon: '🤕' },
      { sounds: ['a', 'u'], word: 'au', icon: '🐶' },
    ],
  },
  {
    id: 'cv', labelKey: 'soundChain.level.cv',
    chains: [
      { sounds: ['p', 'é'], word: 'pé', icon: '🦶' },
      { sounds: ['v', 'ó'], word: 'vó', icon: '👵' },
      { sounds: ['n', 'ó'], word: 'nó', icon: '🪢' },
      { sounds: ['ch', 'á'], word: 'chá', icon: '🍵' },
      { sounds: ['d', 'ó'], word: 'dó', icon: '🎵' },
    ],
  },
  {
    id: 'cvc', labelKey: 'soundChain.level.cvc',
    chains: [
      { sounds: ['s', 'o', 'l'], word: 'sol', icon: '☀️' },
      { sounds: ['m', 'a', 'r'], word: 'mar', icon: '🌊' },
      { sounds: ['m', 'e', 'l'], word: 'mel', icon: '🍯' },
      { sounds: ['s', 'a', 'l'], word: 'sal', icon: '🧂' },
      { sounds: ['l', 'u', 'z'], word: 'luz', icon: '💡' },
    ],
  },
  {
    id: 'words', labelKey: 'soundChain.level.words',
    chains: [
      { sounds: ['b', 'o', 'l', 'a'], word: 'bola', icon: '⚽' },
      { sounds: ['m', 'a', 'l', 'a'], word: 'mala', icon: '🧳' },
      { sounds: ['l', 'u', 'a'], word: 'lua', icon: '🌙' },
      { sounds: ['u', 'v', 'a'], word: 'uva', icon: '🍇' },
      { sounds: ['f', 'a', 'd', 'a'], word: 'fada', icon: '🧚' },
    ],
  },
];

export const SAY_PT: SayMap = {
  // Consoante sozinha: o espeak lê o nome da letra ("ene", "esse", "cê agá"); o nome fônico dá o som
  ch: 'xê', f: 'fê', l: 'lê', m: 'mê', n: 'nê', r: 'rê', s: 'sê',
  // "é" sozinho é lido "é agudo"; "e" já sai [ɛ]
  é: 'e',
};
