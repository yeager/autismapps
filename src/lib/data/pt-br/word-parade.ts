import type { MinimalPair } from '../speech-types';

// Pares mínimos do português do Brasil. Revisão: docs/pt-br-revisao-fono.md
export const MINIMAL_PAIRS_PT: MinimalPair[] = [
  // Sonoridade
  { word1: 'faca', word2: 'vaca', icon1: '🔪', icon2: '🐄', contrastType: 'voicing' },
  { word1: 'pomba', word2: 'bomba', icon1: '🕊️', icon2: '💣', contrastType: 'voicing' },
  { word1: 'tia', word2: 'dia', icon1: '👩', icon2: '☀️', contrastType: 'voicing' },
  { word1: 'doce', word2: 'doze', icon1: '🍭', icon2: '🕛', contrastType: 'voicing' },
  { word1: 'chato', word2: 'jato', icon1: '😒', icon2: '✈️', contrastType: 'voicing' },
  // Ponto
  { word1: 'pia', word2: 'tia', icon1: '🚰', icon2: '👩', contrastType: 'place' },
  { word1: 'mão', word2: 'não', icon1: '✋', icon2: '❌', contrastType: 'place' },
  { word1: 'dado', word2: 'gado', icon1: '🎲', icon2: '🐂', contrastType: 'place' },
  { word1: 'corta', word2: 'torta', icon1: '✂️', icon2: '🥧', contrastType: 'place' },
  { word1: 'fala', word2: 'sala', icon1: '🗣️', icon2: '🛋️', contrastType: 'place' },
  // Modo
  { word1: 'mala', word2: 'bala', icon1: '🧳', icon2: '🍬', contrastType: 'manner' },
  { word1: 'lua', word2: 'rua', icon1: '🌙', icon2: '🛣️', contrastType: 'manner' },
  { word1: 'nó', word2: 'dó', icon1: '🪢', icon2: '🎵', contrastType: 'manner' },
  { word1: 'vela', word2: 'bela', icon1: '🕯️', icon2: '👸', contrastType: 'manner' },
  { word1: 'pé', word2: 'fé', icon1: '🦶', icon2: '🙏', contrastType: 'manner' },
  // Vogal
  { word1: 'sal', word2: 'sol', icon1: '🧂', icon2: '☀️', contrastType: 'vowel' },
  { word1: 'vovó', word2: 'vovô', icon1: '👵', icon2: '👴', contrastType: 'vowel' },
  { word1: 'lá', word2: 'lã', icon1: '👉', icon2: '🧶', contrastType: 'vowel' },
];
