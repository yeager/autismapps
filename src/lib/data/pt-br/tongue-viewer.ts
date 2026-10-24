import type { PracticeSequence, SoundLevel, TonguePosition } from '../speech-types';

// Posições do pt-BR. Os sons novos partem das posições suecas mais próximas (aproximações, ver documento de revisão):
// é ≈ ä, ê ≈ e, ô ≈ å, u ≈ o sueco [uː]; ó um grau mais aberto que ô; nasais = oral + véu aberto;
// ch/j ≈ sj; lh/nh = dorso no palato; rr = fundo da língua perto do véu, sem fechar; tepe = contato alveolar, sem vibração.
export const TONGUE_POSITIONS_PT: Record<string, TonguePosition> = {
  // ===== NÍVEL 1: VOGAIS ORAIS =====
  a: { tip: [0.35, 0.65], body: [0.48, 0.55], root: [0.70, 0.50], velum: 'closed', lips: 'open-wide', voiced: true, label: 'A', ipa: 'a', example: 'árvore' },
  é: { tip: [0.30, 0.50], body: [0.40, 0.35], root: [0.65, 0.45], velum: 'closed', lips: 'spread', voiced: true, label: 'É', ipa: 'ɛ', example: 'pé' },
  ê: { tip: [0.30, 0.45], body: [0.40, 0.30], root: [0.65, 0.42], velum: 'closed', lips: 'spread', voiced: true, label: 'Ê', ipa: 'e', example: 'mesa' },
  i: { tip: [0.25, 0.30], body: [0.30, 0.18], root: [0.60, 0.40], velum: 'closed', lips: 'spread', voiced: true, label: 'I', ipa: 'i', example: 'ilha' },
  ó: { tip: [0.35, 0.60], body: [0.55, 0.42], root: [0.72, 0.45], velum: 'closed', lips: 'rounded', voiced: true, label: 'Ó', ipa: 'ɔ', example: 'óculos' },
  ô: { tip: [0.35, 0.58], body: [0.55, 0.35], root: [0.72, 0.40], velum: 'closed', lips: 'rounded', voiced: true, label: 'Ô', ipa: 'o', example: 'ovo' },
  u: { tip: [0.35, 0.55], body: [0.55, 0.30], root: [0.70, 0.38], velum: 'closed', lips: 'rounded', voiced: true, label: 'U', ipa: 'u', example: 'uva' },

  // ===== NÍVEL 2: OCLUSIVAS =====
  p: { tip: [0.35, 0.55], body: [0.48, 0.40], root: [0.68, 0.45], velum: 'closed', lips: 'closed', contact: 'bilabial', voiced: false, label: 'P', ipa: 'p', example: 'pato' },
  b: { tip: [0.35, 0.55], body: [0.48, 0.40], root: [0.68, 0.45], velum: 'closed', lips: 'closed', contact: 'bilabial', voiced: true, label: 'B', ipa: 'b', example: 'bola' },
  t: { tip: [0.22, 0.15], body: [0.40, 0.30], root: [0.65, 0.42], velum: 'closed', lips: 'neutral', contact: 'alveolar', voiced: false, label: 'T', ipa: 't', example: 'tatu' },
  d: { tip: [0.22, 0.15], body: [0.40, 0.30], root: [0.65, 0.42], velum: 'closed', lips: 'neutral', contact: 'alveolar', voiced: true, label: 'D', ipa: 'd', example: 'dado' },
  c: { tip: [0.40, 0.50], body: [0.60, 0.15], root: [0.70, 0.30], velum: 'closed', lips: 'neutral', contact: 'velar', voiced: false, label: 'C', ipa: 'k', example: 'casa' },
  g: { tip: [0.38, 0.52], body: [0.58, 0.15], root: [0.72, 0.30], velum: 'closed', lips: 'neutral', contact: 'velar', voiced: true, label: 'G', ipa: 'ɡ', example: 'gato' },

  // ===== NÍVEL 3: FRICATIVAS =====
  f: { tip: [0.35, 0.55], body: [0.48, 0.38], root: [0.68, 0.44], velum: 'closed', lips: 'neutral', contact: 'labiodental', voiced: false, airflow: 'central', label: 'F', ipa: 'f', example: 'faca' },
  v: { tip: [0.35, 0.55], body: [0.48, 0.38], root: [0.68, 0.44], velum: 'closed', lips: 'neutral', contact: 'labiodental', voiced: true, airflow: 'central', label: 'V', ipa: 'v', example: 'vaca' },
  s: { tip: [0.22, 0.18], body: [0.38, 0.25], root: [0.62, 0.40], velum: 'closed', lips: 'spread', voiced: false, airflow: 'groove', contact: 'alveolar', label: 'S', ipa: 's', example: 'sapo' },
  z: { tip: [0.22, 0.18], body: [0.38, 0.25], root: [0.62, 0.40], velum: 'closed', lips: 'spread', voiced: true, airflow: 'groove', contact: 'alveolar', label: 'Z', ipa: 'z', example: 'zebra' },
  ch: { tip: [0.27, 0.25], body: [0.42, 0.22], root: [0.64, 0.38], velum: 'closed', lips: 'rounded', voiced: false, airflow: 'central', contact: 'postalveolar', label: 'CH', ipa: 'ʃ', example: 'chave' },
  j: { tip: [0.27, 0.25], body: [0.42, 0.22], root: [0.64, 0.38], velum: 'closed', lips: 'rounded', voiced: true, airflow: 'central', contact: 'postalveolar', label: 'J', ipa: 'ʒ', example: 'janela' },
  rr: { tip: [0.40, 0.52], body: [0.60, 0.20], root: [0.72, 0.32], velum: 'closed', lips: 'neutral', voiced: false, airflow: 'central', contact: 'velar', label: 'RR', ipa: 'x', example: 'rato' },

  // ===== NÍVEL 4: LÍQUIDAS E NASAIS =====
  l: { tip: [0.22, 0.15], body: [0.42, 0.35], root: [0.65, 0.42], velum: 'closed', lips: 'neutral', contact: 'alveolar', voiced: true, airflow: 'lateral', label: 'L', ipa: 'l', example: 'lua' },
  lh: { tip: [0.30, 0.40], body: [0.38, 0.16], root: [0.62, 0.38], velum: 'closed', lips: 'neutral', contact: 'palatal', voiced: true, airflow: 'lateral', label: 'LH', ipa: 'ʎ', example: 'abelha' },
  r: { tip: [0.22, 0.17], body: [0.40, 0.32], root: [0.64, 0.42], velum: 'closed', lips: 'neutral', contact: 'alveolar', voiced: true, label: 'R', ipa: 'ɾ', example: 'arara' },
  m: { tip: [0.35, 0.55], body: [0.48, 0.40], root: [0.68, 0.45], velum: 'open', lips: 'closed', contact: 'bilabial', voiced: true, label: 'M', ipa: 'm', example: 'macaco' },
  n: { tip: [0.22, 0.15], body: [0.40, 0.35], root: [0.65, 0.42], velum: 'open', lips: 'neutral', contact: 'alveolar', voiced: true, label: 'N', ipa: 'n', example: 'navio' },
  nh: { tip: [0.30, 0.40], body: [0.38, 0.16], root: [0.62, 0.38], velum: 'open', lips: 'neutral', contact: 'palatal', voiced: true, label: 'NH', ipa: 'ɲ', example: 'ninho' },

  // ===== NÍVEL 5: VOGAIS NASAIS (próprias do português) =====
  ã: { tip: [0.33, 0.60], body: [0.48, 0.45], root: [0.68, 0.45], velum: 'open', lips: 'open', voiced: true, label: 'Ã', ipa: 'ɐ̃', example: 'maçã' },
  ẽ: { tip: [0.30, 0.45], body: [0.40, 0.30], root: [0.65, 0.42], velum: 'open', lips: 'spread', voiced: true, label: 'Ẽ', ipa: 'ẽ', example: 'dente' },
  ĩ: { tip: [0.25, 0.30], body: [0.30, 0.18], root: [0.60, 0.40], velum: 'open', lips: 'spread', voiced: true, label: 'Ĩ', ipa: 'ĩ', example: 'cinto' },
  õ: { tip: [0.35, 0.58], body: [0.55, 0.35], root: [0.72, 0.40], velum: 'open', lips: 'rounded', voiced: true, label: 'Õ', ipa: 'õ', example: 'ponte' },
  ũ: { tip: [0.35, 0.55], body: [0.55, 0.30], root: [0.70, 0.38], velum: 'open', lips: 'rounded', voiced: true, label: 'Ũ', ipa: 'ũ', example: 'mundo' },
};

export const SOUND_LEVELS_PT: SoundLevel[] = [
  { id: 'vowels', level: 1, labelKey: 'tongueViewer.level.vowels', icon: '🗣️', sounds: ['a', 'é', 'ê', 'i', 'ó', 'ô', 'u'] },
  { id: 'stops', level: 2, labelKey: 'tongueViewer.level.stops', icon: '💥', sounds: ['p', 'b', 't', 'd', 'c', 'g'] },
  { id: 'fricatives', level: 3, labelKey: 'tongueViewer.level.fricatives', icon: '💨', sounds: ['f', 'v', 's', 'z', 'ch', 'j', 'rr'] },
  { id: 'liquids-nasals', level: 4, labelKey: 'tongueViewer.level.liquidsNasals', icon: '🌊', sounds: ['l', 'lh', 'r', 'm', 'n', 'nh'] },
  { id: 'nasal-vowels', level: 5, labelKey: 'tongueViewer.level.nasalVowels', icon: '🇧🇷', sounds: ['ã', 'ẽ', 'ĩ', 'õ', 'ũ'] },
];

// A animação passa som a som; a fala acontece na vogal, com a sílaba inteira (consoante solta seria soletrada).
// Acentos evitam as leituras átonas ("da" contração, "ta"); o tepe só existe entre vogais, daí "ala-ara-alha".
// Vogal acentuada sozinha é lida pelo nome do acento ("a til"): o h mudo na frente deixa só a vogal.
export const PRACTICE_SEQUENCES_PT: PracticeSequence[] = [
  { id: 'ba-da-ga', sounds: ['b', 'a', 'd', 'a', 'g', 'a'], text: 'ba-da-ga', say: ['', 'bá', '', 'dá', '', 'gá'] },
  { id: 'pa-ta-ca', sounds: ['p', 'a', 't', 'a', 'c', 'a'], text: 'pa-ta-ca', say: ['', 'pá', '', 'tá', '', 'cá'] },
  { id: 'ma-na-nha', sounds: ['m', 'a', 'n', 'a', 'nh', 'a'], text: 'ma-na-nha', say: ['', 'má', '', 'ná', '', 'nhá'] },
  { id: 'ala-ara-alha', sounds: ['a', 'l', 'a', 'a', 'r', 'a', 'a', 'lh', 'a'], text: 'ala-ara-alha', say: ['', '', 'ala', '', '', 'ara', '', '', 'alha'] },
  { id: 'sa-za-cha-ja', sounds: ['s', 'a', 'z', 'a', 'ch', 'a', 'j', 'a'], text: 'sa-za-cha-ja', say: ['', 'sá', '', 'zá', '', 'chá', '', 'já'] },
  { id: 'a-ã-ô-õ', sounds: ['a', 'ã', 'ô', 'õ'], text: 'a-ã-ô-õ', say: ['á', 'hã', 'hô', 'hõ'] },
];
