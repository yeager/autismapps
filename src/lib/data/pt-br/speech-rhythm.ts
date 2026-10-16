import type { IntonationPattern, RhythmWord } from '../speech-types';

// Tônica em MAIÚSCULAS. Mistura oxítonas, paroxítonas, proparoxítonas e monossílabos.
export const RHYTHM_WORDS_PT: RhythmWord[] = [
  { text: 'mamãe', syllables: ['ma', 'MÃE'], stressIndex: 1, icon: '👩' },
  { text: 'papai', syllables: ['pa', 'PAI'], stressIndex: 1, icon: '👨' },
  { text: 'banana', syllables: ['ba', 'NA', 'na'], stressIndex: 1, icon: '🍌' },
  { text: 'café', syllables: ['ca', 'FÉ'], stressIndex: 1, icon: '☕' },
  { text: 'sorvete', syllables: ['sor', 'VE', 'te'], stressIndex: 1, icon: '🍦' },
  { text: 'lâmpada', syllables: ['LÂM', 'pa', 'da'], stressIndex: 0, icon: '💡' },
  { text: 'jacaré', syllables: ['ja', 'ca', 'RÉ'], stressIndex: 2, icon: '🐊' },
  { text: 'pão', syllables: ['PÃO'], stressIndex: 0, icon: '🍞' },
  { text: 'telefone', syllables: ['te', 'le', 'FO', 'ne'], stressIndex: 2, icon: '📞' },
  { text: 'pássaro', syllables: ['PÁS', 'sa', 'ro'], stressIndex: 0, icon: '🐦' },
  { text: 'futebol', syllables: ['fu', 'te', 'BOL'], stressIndex: 2, icon: '⚽' },
  { text: 'sol', syllables: ['SOL'], stressIndex: 0, icon: '☀️' },
  { text: 'elefante', syllables: ['e', 'le', 'FAN', 'te'], stressIndex: 2, icon: '🐘' },
  { text: 'árvore', syllables: ['ÁR', 'vo', 're'], stressIndex: 0, icon: '🌳' },
  { text: 'abacaxi', syllables: ['a', 'ba', 'ca', 'XI'], stressIndex: 3, icon: '🍍' },
];

// O mesmo texto como afirmação e como pergunta: no pt-BR a pergunta sim/não muda só a entonação.
// Um valor (1–5) por sílaba; aproximação a ser conferida na revisão.
export const INTONATION_PATTERNS_PT: IntonationPattern[] = [
  { text: 'É um gato.', icon: '🐱', contour: [3, 3, 2, 1], type: 'statement' },
  { text: 'É um gato?', icon: '🐱', contour: [3, 3, 5, 3], type: 'question' },
  { text: 'Que gato lindo!', icon: '🐱', contour: [4, 5, 3, 5, 2], type: 'exclamation' },
  { text: 'Você quer sorvete.', icon: '🍦', contour: [3, 3, 3, 3, 2, 1], type: 'statement' },
  { text: 'Você quer sorvete?', icon: '🍦', contour: [3, 3, 3, 3, 5, 3], type: 'question' },
  { text: 'Que sorvete gostoso!', icon: '🍦', contour: [4, 4, 5, 3, 3, 5, 2], type: 'exclamation' },
];
