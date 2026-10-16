import type { PracticeSet, SayMap } from '../speech-types';

// Sílabas, palavras e expressões funcionais; mesma distribuição de dificuldade do sueco
export const PRACTICE_SETS_PT: PracticeSet[] = [
  {
    id: 'simple', labelKey: 'speechPractice.set.simple',
    items: [
      { text: 'ma', icon: '👩', difficulty: 1 },
      { text: 'pa', icon: '👨', difficulty: 1 },
      { text: 'ba', icon: '👶', difficulty: 1 },
      { text: 'da', icon: '👋', difficulty: 1 },
      { text: 'na', icon: '🙂', difficulty: 1 },
      { text: 'la', icon: '🎵', difficulty: 1 },
    ],
  },
  {
    id: 'words', labelKey: 'speechPractice.set.words',
    items: [
      { text: 'oi', icon: '👋', difficulty: 1 },
      { text: 'sim', icon: '✅', difficulty: 1 },
      { text: 'não', icon: '❌', difficulty: 1 },
      { text: 'mais', icon: '➕', difficulty: 1 },
      { text: 'comida', icon: '🍽️', difficulty: 2 },
      { text: 'água', icon: '💧', difficulty: 2 },
      { text: 'ajuda', icon: '🆘', difficulty: 2 },
      { text: 'olha', icon: '👀', difficulty: 2 },
    ],
  },
  {
    id: 'phrases', labelKey: 'speechPractice.set.phrases',
    items: [
      { text: 'eu quero', icon: '🙋', difficulty: 2 },
      { text: 'eu quero isso', icon: '🤲', difficulty: 2 },
      { text: 'o que é isso', icon: '❓', difficulty: 3 },
      { text: 'pode me dar', icon: '🙏', difficulty: 3 },
      { text: 'meu nome é', icon: '📛', difficulty: 2 },
      { text: 'vem ver', icon: '👀', difficulty: 3 },
    ],
  },
];

export const SAY_PT: SayMap = {
  // "da", "na" e "la" sozinhos são lidos átonos (contrações e artigo); com acento ficam tônicos
  da: 'dá', na: 'ná', la: 'lá',
};
