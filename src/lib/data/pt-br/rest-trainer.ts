import type { RestLevel, SayMap } from '../speech-types';

// ReST em pt-BR. Nível 1: palavras reais; demais: pseudopalavras só com p b t d c g f v m n l s + a e i o u,
// sem t/d antes de e/i (palatalização), sem s entre vogais na forma falada (soaria /z/) e sem palavrões.
// `say` é a sequência inteira como uma palavra, com acento gráfico onde a regra não põe a tônica;
// ô em vez de ó para a vogal bater com a sílaba falada sozinha ("to" → [to]).
export const LEVELS_PT: RestLevel[] = [
  {
    id: 1, nameKey: 'restTrainer.level1.name', descKey: 'restTrainer.level1.desc', icon: '🟢',
    defaultSpeed: 0.3, speedChallenge: false,
    sequences: [
      { id: 'l1-1', syllables: ['ba', 'la'], stress: [1, 0], display: 'BA-la', say: 'bala' },
      { id: 'l1-2', syllables: ['ma', 'la'], stress: [1, 0], display: 'MA-la', say: 'mala' },
      { id: 'l1-3', syllables: ['va', 'ca'], stress: [1, 0], display: 'VA-ca', say: 'vaca' },
      { id: 'l1-4', syllables: ['fa', 'da'], stress: [1, 0], display: 'FA-da', say: 'fada' },
      { id: 'l1-5', syllables: ['pi', 'pa'], stress: [1, 0], display: 'PI-pa', say: 'pipa' },
      { id: 'l1-6', syllables: ['ca', 'ma'], stress: [1, 0], display: 'CA-ma', say: 'cama' },
      { id: 'l1-7', syllables: ['ca', 'fé'], stress: [0, 1], display: 'ca-FÉ', say: 'café' },
      { id: 'l1-8', syllables: ['vo', 'vó'], stress: [0, 1], display: 'vo-VÓ', say: 'vovó' },
    ],
  },
  {
    id: 2, nameKey: 'restTrainer.level2.name', descKey: 'restTrainer.level2.desc', icon: '🔵',
    defaultSpeed: 0.4, speedChallenge: false,
    sequences: [
      { id: 'l2-1', syllables: ['fi', 'mu'], stress: [1, 0], display: 'FI-mu', say: 'fímu' },
      { id: 'l2-2', syllables: ['ma', 'vi'], stress: [0, 1], display: 'ma-VI', say: 'mavi' },
      { id: 'l2-3', syllables: ['su', 'fa'], stress: [1, 0], display: 'SU-fa', say: 'sufa' },
      { id: 'l2-4', syllables: ['nu', 'pa'], stress: [0, 1], display: 'nu-PA', say: 'nupá' },
      { id: 'l2-5', syllables: ['vu', 'ga'], stress: [1, 0], display: 'VU-ga', say: 'vuga' },
      { id: 'l2-6', syllables: ['bi', 'gu'], stress: [0, 1], display: 'bi-GU', say: 'bigu' },
      { id: 'l2-7', syllables: ['lu', 'mo'], stress: [1, 0], display: 'LU-mo', say: 'lumo' },
      { id: 'l2-8', syllables: ['pu', 'mi'], stress: [0, 1], display: 'pu-MI', say: 'pumi' },
    ],
  },
  {
    id: 3, nameKey: 'restTrainer.level3.name', descKey: 'restTrainer.level3.desc', icon: '🟡',
    defaultSpeed: 0.4, speedChallenge: false,
    sequences: [
      { id: 'l3-1', syllables: ['ba', 'ni', 'fa'], stress: [1, 0, 0], display: 'BA-ni-fa', say: 'bánifa' },
      { id: 'l3-2', syllables: ['fi', 'gu', 'la'], stress: [0, 1, 0], display: 'fi-GU-la', say: 'figula' },
      { id: 'l3-3', syllables: ['mo', 'va', 'fi'], stress: [0, 0, 1], display: 'mo-va-FI', say: 'movafi' },
      { id: 'l3-4', syllables: ['to', 'ma', 'vu'], stress: [1, 0, 0], display: 'TO-ma-vu', say: 'tômavu' },
      { id: 'l3-5', syllables: ['pa', 'vu', 'ma'], stress: [0, 1, 0], display: 'pa-VU-ma', say: 'pavuma' },
      { id: 'l3-6', syllables: ['gu', 'la', 'fi'], stress: [0, 0, 1], display: 'gu-la-FI', say: 'gulafi' },
      { id: 'l3-7', syllables: ['su', 'mi', 'ga'], stress: [1, 0, 0], display: 'SU-mi-ga', say: 'súmiga' },
      { id: 'l3-8', syllables: ['na', 'fo', 'li'], stress: [0, 1, 0], display: 'na-FO-li', say: 'nafôli' },
    ],
  },
  {
    id: 4, nameKey: 'restTrainer.level4.name', descKey: 'restTrainer.level4.desc', icon: '🟠',
    defaultSpeed: 0.5, speedChallenge: false,
    sequences: [
      // Mesmas sílabas, tônica em lugares diferentes
      { id: 'l4-1', syllables: ['ba', 'fu'], stress: [1, 0], display: 'BA-fu', say: 'báfu' },
      { id: 'l4-2', syllables: ['ba', 'fu'], stress: [0, 1], display: 'ba-FU', say: 'bafu' },
      { id: 'l4-3', syllables: ['mi', 'la'], stress: [1, 0], display: 'MI-la', say: 'mila' },
      { id: 'l4-4', syllables: ['mi', 'la'], stress: [0, 1], display: 'mi-LA', say: 'milá' },
      { id: 'l4-5', syllables: ['ma', 'vi', 'go'], stress: [1, 0, 0], display: 'MA-vi-go', say: 'mávigo' },
      { id: 'l4-6', syllables: ['ma', 'vi', 'go'], stress: [0, 1, 0], display: 'ma-VI-go', say: 'mavigo' },
      { id: 'l4-7', syllables: ['ma', 'vi', 'go'], stress: [0, 0, 1], display: 'ma-vi-GO', say: 'mavigô' },
      { id: 'l4-8', syllables: ['tu', 'pa', 'fi'], stress: [1, 0, 1], display: 'TU-pa-FI', say: 'túpa fí' },
    ],
  },
  {
    id: 5, nameKey: 'restTrainer.level5.name', descKey: 'restTrainer.level5.desc', icon: '🔴',
    defaultSpeed: 0.5, speedChallenge: true,
    sequences: [
      { id: 'l5-1', syllables: ['ba', 'gu', 'ca'], stress: [1, 0, 0], display: 'BA-gu-ca', say: 'báguca' },
      { id: 'l5-2', syllables: ['fi', 'go', 'ma'], stress: [0, 1, 0], display: 'fi-GO-ma', say: 'figoma' },
      { id: 'l5-3', syllables: ['la', 'nu', 'pi'], stress: [0, 0, 1], display: 'la-nu-PI', say: 'lanupi' },
      { id: 'l5-4', syllables: ['vo', 'mu', 'sa'], stress: [1, 0, 1], display: 'VO-mu-SA', say: 'vômu sá' },
      { id: 'l5-5', syllables: ['gu', 'fa'], stress: [1, 0], display: 'GU-fa', say: 'gufa' },
      { id: 'l5-6', syllables: ['pa', 'mi', 'vu'], stress: [1, 1, 0], display: 'PA-MI-vu', say: 'pá mívu' },
      { id: 'l5-7', syllables: ['su', 'ni', 'fa'], stress: [0, 1, 1], display: 'su-NI-FA', say: 'suní fá' },
      { id: 'l5-8', syllables: ['mu', 'go', 'la'], stress: [1, 0, 0], display: 'MU-go-la', say: 'múgola' },
    ],
  },
];

export const SAY_PT: SayMap = {
  // "da", "la" e "na" sozinhos são lidos átonos (contrações e artigo); com acento ficam como as outras sílabas
  da: 'dá', la: 'lá', na: 'ná',
};
