import type { ProsodyContent } from '../speech-types';

// Contornos (0–100) seguem as formas suecas, ajustados ao pt-BR: na pergunta sim/não a voz sobe na última tônica e
// desce nas átonas seguintes ("sorVEte?"); na pergunta com "o que" o contorno desce. Conferir na revisão (modelo de Moraes).
export const PROSODY_PT: ProsodyContent = {
  twoSyllableWords: [
    { word: 'bola', stress: 0, syllables: ['bo', 'la'], icon: '⚽' },
    { word: 'café', stress: 1, syllables: ['ca', 'fé'], icon: '☕' },
    { word: 'gato', stress: 0, syllables: ['ga', 'to'], icon: '🐱' },
    { word: 'pato', stress: 0, syllables: ['pa', 'to'], icon: '🦆' },
    { word: 'sofá', stress: 1, syllables: ['so', 'fá'], icon: '🛋️' },
    { word: 'papai', stress: 1, syllables: ['pa', 'pai'], icon: '👨' },
    { word: 'casa', stress: 0, syllables: ['ca', 'sa'], icon: '🏠' },
    { word: 'bebê', stress: 1, syllables: ['be', 'bê'], icon: '👶' },
    { word: 'uva', stress: 0, syllables: ['u', 'va'], icon: '🍇' },
    { word: 'avó', stress: 1, syllables: ['a', 'vó'], icon: '👵' },
  ],
  threeSyllableWords: [
    { word: 'banana', stress: 1, syllables: ['ba', 'na', 'na'], icon: '🍌' },
    { word: 'pássaro', stress: 0, syllables: ['pás', 'sa', 'ro'], icon: '🐦' },
    { word: 'jacaré', stress: 2, syllables: ['ja', 'ca', 'ré'], icon: '🐊' },
    { word: 'sapato', stress: 1, syllables: ['sa', 'pa', 'to'], icon: '👞' },
    { word: 'música', stress: 0, syllables: ['mú', 'si', 'ca'], icon: '🎵' },
    { word: 'picolé', stress: 2, syllables: ['pi', 'co', 'lé'], icon: '🍦' },
    { word: 'boneca', stress: 1, syllables: ['bo', 'ne', 'ca'], icon: '🪆' },
    { word: 'lâmpada', stress: 0, syllables: ['lâm', 'pa', 'da'], icon: '💡' },
    { word: 'caracol', stress: 2, syllables: ['ca', 'ra', 'col'], icon: '🐌' },
    { word: 'macaco', stress: 1, syllables: ['ma', 'ca', 'co'], icon: '🐒' },
  ],
  intonationSentences: [
    { text: 'Eu quero sorvete.', type: 'statement', icon: '🍦', contour: [50, 55, 60, 55, 45, 35] },
    { text: 'É um gato.', type: 'statement', icon: '🐱', contour: [50, 55, 50, 48, 40, 30] },
    { text: 'Vamos para casa.', type: 'statement', icon: '🏠', contour: [55, 58, 52, 48, 40, 30] },
    { text: 'Você quer sorvete?', type: 'question', icon: '🍦', contour: [45, 42, 40, 48, 72, 55] },
    { text: 'É um gato?', type: 'question', icon: '🐱', contour: [45, 40, 38, 46, 74, 58] },
    { text: 'Vamos sair?', type: 'question', icon: '🌳', contour: [42, 40, 42, 50, 60, 75] },
    { text: 'Que sorvete gostoso!', type: 'exclamation', icon: '🍦', contour: [70, 80, 85, 75, 55, 35] },
    { text: 'Que gato lindo!', type: 'exclamation', icon: '🐱', contour: [65, 80, 85, 70, 50, 30] },
    { text: 'Olha, um arco-íris!', type: 'exclamation', icon: '🌈', contour: [70, 82, 88, 78, 55, 35] },
  ],
  emotionData: [
    { emotion: 'glad', icon: '😊', sentence: 'Ganhei um presente!', contour: [55, 65, 75, 80, 85, 80] },
    { emotion: 'ledsen', icon: '😢', sentence: 'Meu balão voou.', contour: [50, 45, 40, 38, 35, 30] },
    { emotion: 'arg', icon: '😠', sentence: 'Para com isso!', contour: [75, 80, 85, 70, 55, 40] },
    { emotion: 'förvånad', icon: '😲', sentence: 'Nossa, o que aconteceu?!', contour: [50, 60, 80, 90, 70, 50] },
  ],
  // Sem vogal encostando na da palavra seguinte, para a contagem de sílabas não depender de elisão
  rhythmPatterns: [
    { text: 'Vem pra cá', syllables: ['vem', 'pra', 'cá'], pattern: ['da', 'da', 'DA'], beats: [false, false, true], icon: '👋' },
    { text: 'Eu quero', syllables: ['eu', 'que', 'ro'], pattern: ['da', 'DA', 'da'], beats: [false, true, false], icon: '🙏' },
    { text: 'Bom dia', syllables: ['bom', 'di', 'a'], pattern: ['da', 'DA', 'da'], beats: [false, true, false], icon: '☀️' },
    { text: 'Cadê você?', syllables: ['ca', 'dê', 'vo', 'cê'], pattern: ['da', 'DA', 'da', 'DA'], beats: [false, true, false, true], icon: '🔍' },
    { text: 'Quero bolo', syllables: ['que', 'ro', 'bo', 'lo'], pattern: ['DA', 'da', 'DA', 'da'], beats: [true, false, true, false], icon: '🎂' },
    { text: 'Estou com fome', syllables: ['es', 'tou', 'com', 'fo', 'me'], pattern: ['da', 'DA', 'da', 'DA', 'da'], beats: [false, true, false, true, false], icon: '🍽️' },
  ],
  fullSentences: [
    { text: 'Oi, eu me chamo Ana.', type: 'statement', contour: [55, 60, 55, 50, 55, 50, 42, 35], icon: '👋' },
    { text: 'Posso tomar um pouco de água?', type: 'question', contour: [50, 48, 45, 42, 45, 50, 72, 55], icon: '💧' },
    { text: 'Que dia lindo!', type: 'exclamation', contour: [65, 75, 82, 85, 80, 70, 50, 35], icon: '☀️' },
    { text: 'O que vamos fazer hoje?', type: 'question', contour: [60, 75, 65, 58, 52, 48, 42, 35], icon: '🤔' },
    { text: 'Foi muito divertido!', type: 'exclamation', contour: [60, 70, 80, 88, 82, 68, 50, 35], icon: '😄' },
  ],
};
