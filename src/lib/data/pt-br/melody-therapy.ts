import type { MitPhrase } from '../speech-types';

// Princípio de duas alturas da MIT: a sílaba tônica (stress) tem a nota mais alta (E4/G4) e a maior duração; as átonas ficam em C4/D4.
// Ids com prefixo "pt-" para o progresso salvo (mit-progress) não se misturar com o sueco.
// Sem "obrigado/obrigada" (flexiona com o gênero de quem fala): "valeu" é o agradecimento neutro, de registro informal.
export const PHRASES_PT: MitPhrase[] = [
  // === Cumprimentos ===
  { id: 'pt-oi', text: 'Oi', syllables: ['oi'], stress: 0, melody: [{ note: 'E4', duration: 0.5 }], category: 'greetings', arasaacId: 6522 },
  { id: 'pt-tchau', text: 'Tchau', syllables: ['tchau'], stress: 0, melody: [{ note: 'E4', duration: 0.5 }], category: 'greetings', arasaacId: 6028 },
  { id: 'pt-bom-dia', text: 'Bom dia', syllables: ['bom', 'di', 'a'], stress: 1,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'G4', duration: 0.5 }, { note: 'D4', duration: 0.4 }], category: 'greetings', arasaacId: 6944 },
  { id: 'pt-boa-noite', text: 'Boa noite', syllables: ['bo', 'a', 'noi', 'te'], stress: 2,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.5 }, { note: 'D4', duration: 0.4 }], category: 'greetings', arasaacId: 6942 },

  // === Pedidos ===
  { id: 'pt-eu-quero', text: 'Eu quero', syllables: ['eu', 'que', 'ro'], stress: 1,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'G4', duration: 0.5 }, { note: 'D4', duration: 0.4 }], category: 'wants', arasaacId: 5441 },
  { id: 'pt-nao-quero', text: 'Não quero', syllables: ['não', 'que', 'ro'], stress: 1,
    melody: [{ note: 'E4', duration: 0.4 }, { note: 'G4', duration: 0.5 }, { note: 'C4', duration: 0.4 }], category: 'wants', arasaacId: 6156 },
  { id: 'pt-mais', text: 'Mais', syllables: ['mais'], stress: 0, melody: [{ note: 'G4', duration: 0.6 }], category: 'wants', arasaacId: 5508 },
  { id: 'pt-quero-comer', text: 'Quero comer', syllables: ['que', 'ro', 'co', 'mer'], stress: 3,
    melody: [{ note: 'E4', duration: 0.4 }, { note: 'C4', duration: 0.3 }, { note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.6 }], category: 'wants', arasaacId: 6456 },

  // === Social ===
  { id: 'pt-por-favor', text: 'Por favor', syllables: ['por', 'fa', 'vor'], stress: 2,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.6 }], category: 'social', arasaacId: 8195 },
  { id: 'pt-desculpa', text: 'Desculpa', syllables: ['des', 'cul', 'pa'], stress: 1,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'G4', duration: 0.5 }, { note: 'D4', duration: 0.4 }], category: 'social', arasaacId: 38360 },
  { id: 'pt-me-ajuda', text: 'Me ajuda', syllables: ['me', 'a', 'ju', 'da'], stress: 2,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.5 }, { note: 'D4', duration: 0.4 }], category: 'social', arasaacId: 32648 },
  { id: 'pt-valeu', text: 'Valeu', syllables: ['va', 'leu'], stress: 1,
    melody: [{ note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.6 }], category: 'social', arasaacId: 8129 },

  // === Dia a dia ===
  { id: 'pt-vem-ca', text: 'Vem cá', syllables: ['vem', 'cá'], stress: 1,
    melody: [{ note: 'E4', duration: 0.4 }, { note: 'G4', duration: 0.5 }], category: 'everyday', arasaacId: 32669 },
  { id: 'pt-olha-la', text: 'Olha lá', syllables: ['o', 'lha', 'lá'], stress: 2,
    melody: [{ note: 'E4', duration: 0.4 }, { note: 'C4', duration: 0.3 }, { note: 'G4', duration: 0.5 }], category: 'everyday', arasaacId: 6564 },
  { id: 'pt-cade', text: 'Cadê?', syllables: ['ca', 'dê'], stress: 1,
    melody: [{ note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.6 }], category: 'everyday', arasaacId: 32872 },
  { id: 'pt-o-que-e', text: 'O que é?', syllables: ['o', 'que', 'é'], stress: 2,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.6 }], category: 'everyday', arasaacId: 22620 },
  { id: 'pt-eu-me-chamo', text: 'Eu me chamo', syllables: ['eu', 'me', 'cha', 'mo'], stress: 2,
    melody: [{ note: 'C4', duration: 0.3 }, { note: 'D4', duration: 0.3 }, { note: 'G4', duration: 0.5 }, { note: 'D4', duration: 0.4 }], category: 'everyday', arasaacId: 27357 },
];
