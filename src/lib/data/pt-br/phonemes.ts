import type { SayMap } from '../speech-types';

// Forma falada dos sons isolados, usada pelo Guia de Articulação, pelo Guia PROMPT e pela Jornada das Letras.
// Como no sound-lottery: o espeak lê consoante solta pelo nome da letra ("eme", "cê" = /s/); o nome fônico dá o som.
export const PHONEME_SAY_PT: SayMap = {
  // Vogais soltas: "e" e "o" viram a conjunção [i] e o artigo [u]; vogal acentuada sozinha é lida pelo nome do acento
  // ("é agudo", "a til"), então o h mudo na frente deixa só a vogal. Para ẽ, ĩ e ũ, "hem", "him" e "hum" dão a mesma
  // nasal das palavras (dente, cinto, mundo)
  e: 'hé', o: 'ó', é: 'hé', ê: 'hê', ô: 'hô', ã: 'hã', ẽ: 'hem', ĩ: 'him', õ: 'hõ', ũ: 'hum',
  b: 'bê', c: 'quê', k: 'quê', d: 'dê', f: 'fê', g: 'guê', j: 'jê', l: 'lê', m: 'mê', n: 'nê',
  p: 'pê', s: 'sê', t: 'tê', v: 'vê', z: 'zê', ch: 'xê', lh: 'lhê', nh: 'nhê', rr: 'rê',
  // Tepe: não existe no início da palavra, então é falado entre vogais
  r: 'ara',
  // Sons prolongados exibidos pela Jornada das Letras
  fff: 'fê', jjj: 'jê', lll: 'lê', mmm: 'mê', nnn: 'nê', rrr: 'rê', sss: 'sê', vvv: 'vê', xxx: 'xê', zzz: 'zê',
};
