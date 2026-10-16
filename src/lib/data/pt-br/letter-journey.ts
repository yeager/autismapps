import type { LetterDef, LetterWord, SayMap } from '../speech-types';

// Alfabeto de 26 letras. "sound" é o som exibido; a forma falada vem de PHONEME_SAY_PT + SAY_PT (combinados na página).
// "explore" já é o texto falado: nome + som, uma vez só quando os dois soam iguais ("bê."); "hé." porque "é" sozinho é lido "é agudo".
// H, K, Q, W e Y nunca são alvo do "Encontre a letra" (mudo, estrangeiras, sempre com u).
export const LETTERS_PT: LetterDef[] = [
  { letter: 'A', name: 'á', sound: 'a', cue: '😮', vowel: true, explore: 'á.', mouth: 'Abra bem a boca — como no dentista.' },
  { letter: 'B', name: 'bê', sound: 'b', cue: '👄', vowel: false, explore: 'bê.', mouth: 'Junte os lábios e solte de uma vez.' },
  { letter: 'C', name: 'cê', sound: 'c', cue: '😶', vowel: false, explore: 'cê. quê.', mouth: 'O fundo da língua toca o céu da boca e solta com um estalo (casa). Antes de E e I, o C soa como S (cebola).' },
  { letter: 'D', name: 'dê', sound: 'd', cue: '👅', vowel: false, explore: 'dê.', mouth: 'A ponta da língua toca atrás dos dentes de cima. Antes de I, soa mais chiado (dia).' },
  { letter: 'E', name: 'é', sound: 'e', cue: '😊', vowel: true, explore: 'hé.', mouth: 'Sorriso largo — lábios esticados. O E pode ser aberto (é) ou fechado (ê).' },
  { letter: 'F', name: 'efe', sound: 'fff', cue: '🦷', vowel: false, explore: 'éfe. fê.', mouth: 'Dentes de cima no lábio de baixo, sopre o ar.' },
  { letter: 'G', name: 'gê', sound: 'g', cue: '😶', vowel: false, explore: 'gê. guê.', mouth: 'O fundo da língua toca o fundo do céu da boca (gato). Antes de E e I, o G soa como J (girafa).' },
  { letter: 'H', name: 'agá', sound: '', cue: '🤫', vowel: false, explore: 'agá.', noTarget: true, mouth: 'O H sozinho não tem som (hora). Junto com C, L ou N, forma CH, LH e NH.' },
  { letter: 'I', name: 'i', sound: 'i', cue: '😁', vowel: true, explore: 'i.', mouth: 'Sorrisão — lábios esticados, língua no alto.' },
  { letter: 'J', name: 'jota', sound: 'jjj', cue: '😗', vowel: false, explore: 'jota. jê.', mouth: 'Lábios para a frente e a língua perto do céu da boca, com voz — um chiado que vibra.' },
  { letter: 'K', name: 'cá', sound: 'k', cue: '😶', vowel: false, explore: 'cá. quê.', noTarget: true, mouth: 'Igual ao C de casa. Aparece em palavras estrangeiras (kiwi).' },
  { letter: 'L', name: 'ele', sound: 'lll', cue: '👅', vowel: false, explore: 'éle. lê.', mouth: 'Ponta da língua atrás dos dentes de cima, com voz. No fim da sílaba, o L soa como U (sol).' },
  { letter: 'M', name: 'eme', sound: 'mmm', cue: '👄', vowel: false, explore: 'ême. mê.', mouth: 'Junte os lábios e cantarole pelo nariz. No fim da sílaba, o M deixa a vogal nasal (campo).' },
  { letter: 'N', name: 'ene', sound: 'nnn', cue: '👅', vowel: false, explore: 'êne. nê.', mouth: 'Língua atrás dos dentes de cima, cantarole pelo nariz. No fim da sílaba, o N deixa a vogal nasal (canto).' },
  { letter: 'O', name: 'ó', sound: 'o', cue: '😮', vowel: true, explore: 'ó.', mouth: 'Arredonde os lábios como um círculo. O O pode ser aberto (ó) ou fechado (ô).' },
  { letter: 'P', name: 'pê', sound: 'p', cue: '👄', vowel: false, explore: 'pê.', mouth: 'Junte os lábios e solte um sopro de ar.' },
  { letter: 'Q', name: 'quê', sound: 'k', cue: '😶', vowel: false, explore: 'quê.', noTarget: true, mouth: 'Igual ao C de casa. O Q sempre vem com U (queijo).' },
  { letter: 'R', name: 'erre', sound: 'rrr', cue: '👅', vowel: false, explore: 'érre. rê.', mouth: 'No começo da palavra, o R forte sai do fundo da boca (rato). Entre vogais, a ponta da língua bate uma vez só (arara).' },
  { letter: 'S', name: 'esse', sound: 'sss', cue: '😬', vowel: false, explore: 'ésse. sê.', mouth: 'Dentes quase juntos, língua atrás dos dentes: faça sss como uma cobra. Entre vogais, o S soa como Z (casa).' },
  { letter: 'T', name: 'tê', sound: 't', cue: '👅', vowel: false, explore: 'tê.', mouth: 'A ponta da língua bate rápido atrás dos dentes de cima. Antes de I, soa mais chiado (tia).' },
  { letter: 'U', name: 'u', sound: 'u', cue: '😗', vowel: true, explore: 'u.', mouth: 'Lábios para a frente, abertura pequena e redonda.' },
  { letter: 'V', name: 'vê', sound: 'vvv', cue: '🦷', vowel: false, explore: 'vê.', mouth: 'Dentes de cima no lábio de baixo, com voz (como o F, mas vibrando).' },
  { letter: 'W', name: 'dáblio', sound: 'u', cue: '😗', vowel: false, explore: 'dáblio. u.', noTarget: true, mouth: 'Aparece em palavras estrangeiras. Soa como U (kiwi) ou como V.' },
  { letter: 'X', name: 'xis', sound: 'xxx', cue: '😗', vowel: false, explore: 'xis. xê.', mouth: 'Lábios para a frente e um chiado: xxx (xícara). Às vezes soa como KS, Z ou S (táxi, exame, próximo).' },
  { letter: 'Y', name: 'ípsilon', sound: 'i', cue: '😁', vowel: true, explore: 'ípsilon. i.', noTarget: true, mouth: 'Aparece em palavras estrangeiras. Soa como I.' },
  { letter: 'Z', name: 'zê', sound: 'zzz', cue: '😬', vowel: false, explore: 'zê.', mouth: 'Como o S, mas com voz: zzz, como uma abelha.' },
];

// Palavras para soletrar letra a letra: só letras que soam como na tabela (ver testes).
// Nível 1: CV.CV terminadas em a/u. Nível 2: encontro com l e s em coda. Nível 3: três sílabas.
export const WORDS_PT: Record<1 | 2 | 3, LetterWord[]> = {
  1: [
    { word: 'BOLA', icon: '⚽', syllables: ['BO', 'LA'], stress: 0 },
    { word: 'FACA', icon: '🔪', syllables: ['FA', 'CA'], stress: 0 },
    { word: 'VACA', icon: '🐄', syllables: ['VA', 'CA'], stress: 0 },
    { word: 'MALA', icon: '🧳', syllables: ['MA', 'LA'], stress: 0 },
    { word: 'PIPA', icon: '🪁', syllables: ['PI', 'PA'], stress: 0 },
    { word: 'FADA', icon: '🧚', syllables: ['FA', 'DA'], stress: 0 },
    { word: 'CAMA', icon: '🛏️', syllables: ['CA', 'MA'], stress: 0 },
    { word: 'LUA', icon: '🌙', syllables: ['LU', 'A'], stress: 0 },
    { word: 'UVA', icon: '🍇', syllables: ['U', 'VA'], stress: 0 },
    { word: 'BOCA', icon: '👄', syllables: ['BO', 'CA'], stress: 0 },
    { word: 'GOTA', icon: '💧', syllables: ['GO', 'TA'], stress: 0 },
    { word: 'LATA', icon: '🥫', syllables: ['LA', 'TA'], stress: 0 },
  ],
  2: [
    { word: 'BLOCO', icon: '🧱', syllables: ['BLO', 'CO'], stress: 0 },
    { word: 'PLACA', icon: '🪧', syllables: ['PLA', 'CA'], stress: 0 },
    { word: 'GLOBO', icon: '🌐', syllables: ['GLO', 'BO'], stress: 0 },
    { word: 'PLUMA', icon: '🪶', syllables: ['PLU', 'MA'], stress: 0 },
    { word: 'FESTA', icon: '🎉', syllables: ['FES', 'TA'], stress: 0 },
    { word: 'PASTA', icon: '📁', syllables: ['PAS', 'TA'], stress: 0 },
    { word: 'MOSCA', icon: '🪰', syllables: ['MOS', 'CA'], stress: 0 },
    { word: 'PESCA', icon: '🎣', syllables: ['PES', 'CA'], stress: 0 },
    { word: 'LISTA', icon: '📋', syllables: ['LIS', 'TA'], stress: 0 },
  ],
  3: [
    { word: 'BANANA', icon: '🍌', syllables: ['BA', 'NA', 'NA'], stress: 1 },
    { word: 'BONECA', icon: '🪆', syllables: ['BO', 'NE', 'CA'], stress: 1 },
    { word: 'SAPATO', icon: '👞', syllables: ['SA', 'PA', 'TO'], stress: 1 },
    { word: 'MACACO', icon: '🐒', syllables: ['MA', 'CA', 'CO'], stress: 1 },
    { word: 'PANELA', icon: '🍲', syllables: ['PA', 'NE', 'LA'], stress: 1 },
    { word: 'JANELA', icon: '🪟', syllables: ['JA', 'NE', 'LA'], stress: 1 },
    { word: 'PIPOCA', icon: '🍿', syllables: ['PI', 'PO', 'CA'], stress: 1 },
    { word: 'CAVALO', icon: '🐴', syllables: ['CA', 'VA', 'LO'], stress: 1 },
  ],
};

// Coarticulação: c e g mudam de som antes de e/i e ficam fora do CV; em VC, só as consoantes que o português aceita no fim da sílaba
export const CV_CONSONANTS_PT = ['B', 'D', 'F', 'J', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'];
export const VC_CONSONANTS_PT = ['L', 'M', 'N', 'R', 'S'];
export const CV_VOWELS_PT = ['A', 'E', 'I', 'O', 'U'];

// Sílabas soltas (consultadas em minúsculas): como no sound-lottery, sem acento saem reduzidas ([bi], [du]) ou viram clíticos ("da", "se")
export const SAY_PT: SayMap = {
  be: 'bé', bo: 'bó', da: 'dá', de: 'dé', do: 'dó', fe: 'fé', fo: 'fó', je: 'jé', jo: 'jó',
  la: 'lá', le: 'lé', lo: 'ló', me: 'mé', mo: 'mó', na: 'ná', ne: 'né', no: 'nó', pe: 'pé', po: 'pó',
  re: 'ré', ro: 'ró', se: 'sé', so: 'só', te: 'té', to: 'tó', ve: 'vé', vo: 'vó', ze: 'zé', zo: 'zó',
  // Sílabas das palavras: "fes" e "pes" saem reduzidas ([fɪs]); "blo" sai fechado, mas "bloco" tem o aberto
  fes: 'fés', pes: 'pés', blo: 'bló',
  // Pares VC: "os" é lido como o artigo [us]; "in" sai sem nasal; "ol" sai com l, mas no fim da sílaba o l soa [w]
  os: 'ós', in: 'im', ol: 'óu',
};
