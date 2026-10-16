import type { MimicItem, MimicLevel, SayMap } from '../speech-types';

// Hierarquia DTTC: sons → palavras → expressões → frases. Sem palavras com gênero do falante (obrigado/a).
export const LEVEL_DATA_PT: Record<MimicLevel, MimicItem[]> = {
  sounds: [
    { text: 'aaa', icon: '😮' }, { text: 'ooo', icon: '😯' }, { text: 'eee', icon: '😊' },
    { text: 'iii', icon: '😁' }, { text: 'uuu', icon: '😗' }, { text: 'mmm', icon: '😶' },
    { text: 'xiu', icon: '🤫' }, { text: 'fuuu', icon: '💨' }, { text: 'lá lá lá', icon: '🎵' },
    { text: 'ba', icon: '👶' }, { text: 'ma', icon: '👩' }, { text: 'pa', icon: '👨' },
    { text: 'da', icon: '👋' }, { text: 'na', icon: '😊' }, { text: 'ca', icon: '🏠' },
  ],
  words: [
    { text: 'mamãe', icon: '👩' }, { text: 'papai', icon: '👨' }, { text: 'oi', icon: '😃' },
    { text: 'sim', icon: '✅' }, { text: 'não', icon: '❌' }, { text: 'tchau', icon: '👋' },
    { text: 'cachorro', icon: '🐕' }, { text: 'gato', icon: '🐱' }, { text: 'bola', icon: '⚽' },
    { text: 'comida', icon: '🍽️' }, { text: 'água', icon: '💧' }, { text: 'sorvete', icon: '🍦' },
    { text: 'carro', icon: '🚗' }, { text: 'livro', icon: '📖' }, { text: 'sol', icon: '☀️' },
  ],
  phrases: [
    { text: 'eu quero', icon: '🙋' }, { text: 'eu quero mais', icon: '➕' },
    { text: 'vem cá', icon: '👋' }, { text: 'olha lá', icon: '👀' },
    { text: 'o que é isso', icon: '❓' }, { text: 'cadê', icon: '🔍' },
    { text: 'me ajuda', icon: '🆘' }, { text: 'meu nome é', icon: '📛' },
    { text: 'me dá', icon: '🤲' }, { text: 'por favor', icon: '🙏' },
    { text: 'eu gosto de', icon: '❤️' }, { text: 'vamos lá', icon: '🏃' },
  ],
  sentences: [
    { text: 'Eu quero comer.', icon: '🍽️' },
    { text: 'Posso tomar água?', icon: '💧' },
    { text: 'Olha, um cachorro grande!', icon: '🐕' },
    { text: 'Eu quero brincar lá fora.', icon: '🏞️' },
    { text: 'Cadê o meu livro?', icon: '📖' },
    { text: 'Vamos para o parque.', icon: '🏞️' },
    { text: 'Eu gosto de sorvete.', icon: '🍦' },
    { text: 'Mamãe, vem ver!', icon: '👩' },
    { text: 'O gato dorme na cama.', icon: '🐱' },
    { text: 'Você pode me ajudar?', icon: '🆘' },
  ],
};

export const SAY_PT: SayMap = {
  // Sons prolongados: o espeak soletra "mmm" ("eme eme eme") e lê "aaa"/"uuu" com glides;
  // vogais acentuadas repetidas e interjeições saem limpas
  aaa: 'ááá', ooo: 'ôôô', eee: 'êêê', iii: 'ííí', uuu: 'úúú', mmm: 'humm', fuuu: 'fúúú',
  // "da" e "na" sozinhos são lidos átonos (contrações); com acento ficam como as outras sílabas
  da: 'dá', na: 'ná',
};
