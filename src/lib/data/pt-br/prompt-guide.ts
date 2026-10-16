import type { PromptCategoryDef, PromptSound } from '../speech-types';

export const CATEGORIES_PT: PromptCategoryDef[] = [
  { id: 'jaw', labelKey: 'promptGuide.cat.jaw', icon: '🦴', color: '#E74C3C' },
  { id: 'lips', labelKey: 'promptGuide.cat.lips', icon: '👄', color: '#E67E22' },
  { id: 'tongue-tip', labelKey: 'promptGuide.cat.tongueTip', icon: '👅', color: '#3498DB' },
  { id: 'back', labelKey: 'promptGuide.cat.back', icon: '🔙', color: '#27AE60' },
  { id: 'combined', labelKey: 'promptGuide.cat.combined', icon: '🇧🇷', color: '#9B59B6' },
];

// Sons que existem no sueco: dicas traduzidas da versão sueca/inglesa (o /p/ do português não é aspirado).
// analogy: dica construída por analogia com as existentes, sem equivalente sueco — validar com fonoaudiólogo(a) com formação PROMPT.
export const PROMPT_PT: PromptSound[] = [
  // ═══ MANDÍBULA (m, b, p) ═══
  {
    sound: 'm', ipa: 'm', category: 'jaw', touchZone: 'under-chin', direction: 'up', pressure: 'medium', duration: 'sustained',
    description: 'Coloque o dedo indicador embaixo do queixo. Empurre de leve para cima, para ajudar a mandíbula a fechar. Mantenha o toque enquanto a criança faz /m/ com os lábios fechados.',
    steps: [
      'Coloque o dedo indicador embaixo do queixo da criança',
      'Empurre de leve para cima, para fechar a mandíbula',
      'Lábios juntos — digam "mmm" juntos',
      'Mantenha até o som terminar',
    ],
    exampleWord: 'mamãe', arasaacId: 2458, videoPlaceholder: true,
  },
  {
    sound: 'b', ipa: 'b', category: 'jaw', touchZone: 'under-chin', direction: 'up', pressure: 'medium', duration: 'brief',
    description: 'Coloque o dedo indicador embaixo do queixo. Empurre para cima para ajudar a fechar a mandíbula no /b/.',
    steps: [
      'Coloque a mão embaixo do queixo da criança',
      'Empurre de leve para cima',
      'Digam "b" juntos enquanto você empurra',
      'Solte quando o som sair',
    ],
    exampleWord: 'bola', arasaacId: 2269, videoPlaceholder: true,
  },
  {
    sound: 'p', ipa: 'p', category: 'jaw', touchZone: 'under-chin', direction: 'up', pressure: 'medium', duration: 'brief',
    description: 'O mesmo apoio do /b/ — indicador embaixo do queixo, empurrando para cima. O /p/ não tem voz: o ar sai de uma vez, sem vibração na garganta.',
    steps: [
      'Coloque o dedo indicador embaixo do queixo',
      'Empurre de leve para cima, para fechar a mandíbula',
      'Incentive um sopro de ar — digam "p"',
      'Solte rápido depois do som',
    ],
    exampleWord: 'pato', arasaacId: 2563, videoPlaceholder: true,
  },

  // ═══ LÁBIOS (f, v) ═══
  {
    sound: 'f', ipa: 'f', category: 'lips', touchZone: 'lower-lip', direction: 'up', pressure: 'light', duration: 'sustained',
    description: 'Empurre de leve o lábio de baixo para cima, até os dentes de cima. O ar passa pela fresta.',
    steps: [
      'Coloque o dedo embaixo do lábio de baixo da criança',
      'Levante o lábio de leve até os dentes de cima',
      'Incentive a criança a soprar — "ffff"',
      'Mantenha a posição enquanto o ar passa',
    ],
    exampleWord: 'faca', arasaacId: 4931, videoPlaceholder: true,
  },
  {
    sound: 'v', ipa: 'v', category: 'lips', touchZone: 'lower-lip', direction: 'up', pressure: 'light', duration: 'sustained',
    description: 'Igual ao /f/, mas com voz (vibração). Lábio de baixo nos dentes de cima. Sinta a vibração!',
    steps: [
      'Levante o lábio de baixo até os dentes de cima (como no /f/)',
      'Coloque a outra mão no pescoço para sentir a vibração',
      'Digam "vvvv" — sintam a vibração',
      'Mantenha até a vibração ficar clara',
    ],
    exampleWord: 'vaca', arasaacId: 2609, videoPlaceholder: true,
  },

  // ═══ PONTA DA LÍNGUA (t, d, n, l, s, z) ═══
  {
    sound: 't', ipa: 't', category: 'tongue-tip', touchZone: 'chin-front', direction: 'up', pressure: 'light', duration: 'brief',
    description: 'Apoie embaixo da ponta do queixo. Faça uma pressão leve para cima e para a frente, para a língua alcançar a gengiva atrás dos dentes de cima.',
    steps: [
      'Coloque o polegar embaixo da ponta do queixo',
      'Empurre de leve para cima e para a frente',
      'Incentive a criança a dizer "t" com a ponta da língua levantada',
      'Solte logo depois do som',
    ],
    exampleWord: 'tatu', arasaacId: 8031, videoPlaceholder: true,
  },
  {
    sound: 'd', ipa: 'd', category: 'tongue-tip', touchZone: 'chin-front', direction: 'up', pressure: 'light', duration: 'brief',
    description: 'Igual ao /t/, mas com voz. Apoie embaixo do queixo e empurre para cima. Sinta a vibração.',
    steps: [
      'Coloque o polegar embaixo da ponta do queixo',
      'Empurre de leve para cima (como no /t/)',
      'Digam "d" — sintam a vibração no pescoço',
      'Solte depois do som',
    ],
    exampleWord: 'dado', arasaacId: 2731, videoPlaceholder: true,
  },
  {
    sound: 'n', ipa: 'n', category: 'tongue-tip', touchZone: 'nose-side', touchZoneSecondary: 'chin-front', direction: 'up', pressure: 'light', duration: 'hold',
    description: 'Toque a lateral do nariz para mostrar que o som é nasal e apoie embaixo do queixo para a posição da língua. O ar sai pelo nariz.',
    steps: [
      'Coloque o dedo de leve na lateral do nariz',
      'Apoie embaixo do queixo com a outra mão',
      'Digam "nnn" — sintam o ar saindo pelo nariz',
      'Mantenha até ouvir o som nasal',
    ],
    exampleWord: 'navio', arasaacId: 6932, videoPlaceholder: true,
  },
  {
    sound: 'l', ipa: 'l', category: 'tongue-tip', touchZone: 'chin-front', direction: 'up', pressure: 'medium', duration: 'hold',
    description: 'Apoie embaixo do queixo e empurre para cima para levantar a língua. A ponta da língua fica na gengiva atrás dos dentes de cima, e o ar passa pelos lados.',
    steps: [
      'Coloque o polegar embaixo da ponta do queixo',
      'Empurre para cima para levantar a língua',
      'Incentive "lll" — a língua fica lá em cima',
      'Mantenha enquanto o ar passa pelos lados',
    ],
    exampleWord: 'lua', arasaacId: 2933, videoPlaceholder: true,
  },
  {
    sound: 's', ipa: 's', category: 'tongue-tip', touchZone: 'chin-front', direction: 'forward', pressure: 'light', duration: 'sustained',
    description: 'Apoio leve embaixo do queixo, direcionando para a frente. A ponta da língua fica perto da gengiva atrás dos dentes, sem encostar. O ar passa por uma fresta estreita.',
    steps: [
      'Coloque o dedo embaixo da ponta do queixo',
      'Faça uma pressão leve para a frente',
      'Incentive "ssss" — dentes quase juntos',
      'Mantenha enquanto o ar chia',
    ],
    exampleWord: 'sapo', arasaacId: 2543, videoPlaceholder: true,
  },
  {
    sound: 'z', ipa: 'z', category: 'tongue-tip', touchZone: 'chin-front', direction: 'forward', pressure: 'light', duration: 'sustained', analogy: true,
    description: 'Igual ao /s/, mas com voz. Apoio leve embaixo do queixo, direcionando para a frente, e a outra mão no pescoço para sentir a vibração.',
    steps: [
      'Coloque o dedo embaixo da ponta do queixo (como no /s/)',
      'Coloque a outra mão no pescoço para sentir a vibração',
      'Digam "zzzz" — como uma abelha',
      'Mantenha até a vibração ficar clara',
    ],
    exampleWord: 'zebra', arasaacId: 2324, videoPlaceholder: true,
  },

  // ═══ POSTERIORES (c, g, rr) ═══
  {
    sound: 'c', ipa: 'k', category: 'back', touchZone: 'jaw-angle-left', touchZoneSecondary: 'jaw-angle-right', direction: 'up', pressure: 'medium', duration: 'brief',
    description: 'Empurre embaixo do ângulo da mandíbula, dos dois lados, para ajudar o fundo da língua a tocar o céu da boca. O toque é por fora — você não toca a língua.',
    steps: [
      'Coloque os dedos embaixo do ângulo da mandíbula (dos dois lados)',
      'Empurre de leve para cima',
      'Digam "k" (como em casa) — o fundo da língua sobe',
      'Solte rápido depois do som',
    ],
    exampleWord: 'casa', arasaacId: 2317, videoPlaceholder: true,
  },
  {
    sound: 'g', ipa: 'ɡ', category: 'back', touchZone: 'jaw-angle-left', touchZoneSecondary: 'jaw-angle-right', direction: 'up', pressure: 'medium', duration: 'brief',
    description: 'Igual ao /k/, mas com voz. Empurre embaixo do ângulo da mandíbula para apoiar o contato do fundo da língua.',
    steps: [
      'Coloque os dedos embaixo do ângulo da mandíbula (dos dois lados)',
      'Empurre de leve para cima (como no /k/)',
      'Digam "g" (como em gato) — sintam a vibração',
      'Solte rápido',
    ],
    exampleWord: 'gato', arasaacId: 7114, videoPlaceholder: true,
  },
  {
    sound: 'rr', ipa: 'x', category: 'back', touchZone: 'jaw-angle-left', touchZoneSecondary: 'jaw-angle-right', direction: 'up', pressure: 'light', duration: 'sustained', analogy: true,
    description: 'O R forte (rato) é feito no fundo da boca: o fundo da língua chega perto do céu da boca, sem fechar, e o ar passa raspando. Apoie embaixo do ângulo da mandíbula, como no /k/, mas sem estalo.',
    steps: [
      'Coloque os dedos embaixo do ângulo da mandíbula (dos dois lados)',
      'Empurre bem de leve para cima',
      'Digam "rrr" (como em rato) — o ar passa raspando no fundo da boca',
      'Mantenha enquanto o ar passa',
    ],
    exampleWord: 'rato', arasaacId: 2546, videoPlaceholder: true,
  },

  // ═══ SONS DO PORTUGUÊS (ch, j, lh, nh, r) ═══
  {
    sound: 'ch', ipa: 'ʃ', category: 'combined', touchZone: 'cheek-left', touchZoneSecondary: 'cheek-right', direction: 'inward', pressure: 'light', duration: 'sustained', analogy: true,
    description: 'Toques leves nas bochechas, para dentro, ajudam a arredondar e projetar os lábios. A língua fica perto do céu da boca, um pouco atrás do /s/, e o ar passa chiando.',
    steps: [
      'Coloque os dedos nas duas bochechas',
      'Empurre de leve para dentro, para arredondar a boca',
      'Incentive a criança a projetar os lábios — "xxxx" (como em chave)',
      'Mantenha enquanto o ar passa',
    ],
    exampleWord: 'chave', arasaacId: 8153, videoPlaceholder: true,
  },
  {
    sound: 'j', ipa: 'ʒ', category: 'combined', touchZone: 'cheek-left', touchZoneSecondary: 'cheek-right', direction: 'inward', pressure: 'light', duration: 'sustained', analogy: true,
    description: 'Igual ao ch, mas com voz. Com uma mão, toque as duas bochechas (polegar de um lado, indicador do outro) para arredondar os lábios; a outra mão vai no pescoço, para sentir a vibração.',
    steps: [
      'Toque as bochechas com uma mão (como no ch)',
      'Arredonde e projete os lábios',
      'Digam "jjjj" (como em janela) — sintam a vibração no pescoço',
      'Mantenha até a vibração ficar clara',
    ],
    exampleWord: 'janela', arasaacId: 2611, videoPlaceholder: true,
  },
  {
    sound: 'lh', ipa: 'ʎ', category: 'combined', touchZone: 'chin-front', direction: 'up', pressure: 'medium', duration: 'hold', analogy: true,
    description: 'Apoie embaixo do queixo e empurre para cima: o meio da língua sobe e encosta no céu da boca, e a ponta fica atrás dos dentes de baixo. O ar passa pelos lados.',
    steps: [
      'Coloque o polegar embaixo do queixo',
      'Empurre para cima, para levantar o meio da língua',
      'Digam "lhe" (como em abelha) — o meio da língua encosta no céu da boca',
      'Mantenha enquanto o ar passa pelos lados',
    ],
    exampleWord: 'abelha', arasaacId: 24823, videoPlaceholder: true,
  },
  {
    sound: 'nh', ipa: 'ɲ', category: 'combined', touchZone: 'nose-side', touchZoneSecondary: 'chin-front', direction: 'up', pressure: 'light', duration: 'hold', analogy: true,
    description: 'Como o /n/, mas com o meio da língua no céu da boca. Toque a lateral do nariz para mostrar que o som é nasal e apoie embaixo do queixo.',
    steps: [
      'Coloque o dedo de leve na lateral do nariz',
      'Apoie embaixo do queixo com a outra mão e empurre para cima',
      'Digam "nhe" (como em ninho) — o ar sai pelo nariz',
      'Mantenha até ouvir o som nasal',
    ],
    exampleWord: 'ninho', arasaacId: 7173, videoPlaceholder: true,
  },
  {
    sound: 'r', ipa: 'ɾ', category: 'combined', touchZone: 'chin-front', direction: 'up', pressure: 'light', duration: 'brief', analogy: true,
    description: 'O R entre vogais (arara) é um toque rápido da ponta da língua atrás dos dentes de cima. Apoie embaixo da ponta do queixo e faça um toque leve e rápido, como no /t/ e no /d/.',
    steps: [
      'Coloque o polegar embaixo da ponta do queixo',
      'Faça um toque leve e rápido para cima',
      'Digam "ara" — a ponta da língua bate uma vez só',
      'Solte logo depois do toque',
    ],
    exampleWord: 'arara', arasaacId: 2934, videoPlaceholder: true,
  },
];
