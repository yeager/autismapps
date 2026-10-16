import type { PhonemeData, SayMap } from '../speech-types';

// Os 13 fonemas equivalentes aos do sueco + CH, J, Z, LH e NH. R = R forte (rato, rua, rei).
// Contínuos aparecem prolongados (fff); "cu" fica fora da família do C (palavrão quando dito sozinho).
export const PHONEMES_PT: PhonemeData[] = [
  { sound: 'B', isolation: 'b', syllables: ['ba', 'be', 'bi', 'bo', 'bu'], words: [{ text: 'bola', icon: '⚽' }, { text: 'banana', icon: '🍌' }, { text: 'boca', icon: '👄' }, { text: 'bebê', icon: '👶' }], sentences: ['A bola é azul.', 'O bebê bebe leite.', 'A banana é boa.'] },
  { sound: 'C', isolation: 'c', syllables: ['ca', 'que', 'qui', 'co'], words: [{ text: 'casa', icon: '🏠' }, { text: 'cama', icon: '🛏️' }, { text: 'copo', icon: '🥤' }, { text: 'cavalo', icon: '🐴' }], sentences: ['A casa é grande.', 'O cavalo corre.', 'O copo caiu.'] },
  { sound: 'CH', isolation: 'ch', syllables: ['cha', 'che', 'chi', 'cho', 'chu'], words: [{ text: 'chave', icon: '🔑' }, { text: 'chuva', icon: '🌧️' }, { text: 'chapéu', icon: '👒' }, { text: 'chocolate', icon: '🍫' }], sentences: ['A chuva chegou.', 'A chave abre a porta.', 'O chocolate é gostoso.'] },
  { sound: 'D', isolation: 'd', syllables: ['da', 'de', 'di', 'do', 'du'], words: [{ text: 'dado', icon: '🎲' }, { text: 'dente', icon: '🦷' }, { text: 'dedo', icon: '☝️' }, { text: 'doce', icon: '🍭' }], sentences: ['O dado caiu.', 'O dente é branco.', 'O doce é bom.'] },
  { sound: 'F', isolation: 'fff', syllables: ['fa', 'fe', 'fi', 'fo', 'fu'], words: [{ text: 'faca', icon: '🔪' }, { text: 'foca', icon: '🦭' }, { text: 'fogo', icon: '🔥' }, { text: 'fada', icon: '🧚' }], sentences: ['A foca nada.', 'O fogo é quente.', 'A fada voa.'] },
  { sound: 'G', isolation: 'g', syllables: ['ga', 'gue', 'gui', 'go', 'gu'], words: [{ text: 'gato', icon: '🐱' }, { text: 'galo', icon: '🐓' }, { text: 'gota', icon: '💧' }, { text: 'gorila', icon: '🦍' }], sentences: ['O gato dorme.', 'O galo canta.', 'A gota caiu.'] },
  { sound: 'J', isolation: 'jjj', syllables: ['ja', 'je', 'ji', 'jo', 'ju'], words: [{ text: 'jacaré', icon: '🐊' }, { text: 'janela', icon: '🪟' }, { text: 'joaninha', icon: '🐞' }, { text: 'jogo', icon: '🎮' }], sentences: ['O jacaré nada.', 'A janela está aberta.', 'A joaninha é vermelha.'] },
  { sound: 'L', isolation: 'lll', syllables: ['la', 'le', 'li', 'lo', 'lu'], words: [{ text: 'lua', icon: '🌙' }, { text: 'leão', icon: '🦁' }, { text: 'lápis', icon: '✏️' }, { text: 'livro', icon: '📖' }], sentences: ['A lua brilha.', 'O leão ruge.', 'O livro é legal.'] },
  { sound: 'LH', isolation: 'lh', syllables: ['lha', 'lhe', 'lhi', 'lho', 'lhu'], words: [{ text: 'lhama', icon: '🦙' }, { text: 'coelho', icon: '🐰' }, { text: 'abelha', icon: '🐝' }, { text: 'palhaço', icon: '🤡' }], sentences: ['A abelha voa.', 'O coelho pula.', 'O palhaço é engraçado.'] },
  { sound: 'M', isolation: 'mmm', syllables: ['ma', 'me', 'mi', 'mo', 'mu'], words: [{ text: 'mão', icon: '✋' }, { text: 'mamãe', icon: '👩' }, { text: 'maçã', icon: '🍎' }, { text: 'macaco', icon: '🐒' }], sentences: ['A mamãe me abraça.', 'O macaco come banana.', 'A maçã é vermelha.'] },
  { sound: 'N', isolation: 'nnn', syllables: ['na', 'ne', 'ni', 'no', 'nu'], words: [{ text: 'nariz', icon: '👃' }, { text: 'navio', icon: '🚢' }, { text: 'nuvem', icon: '☁️' }, { text: 'nove', icon: '9️⃣' }], sentences: ['O nariz é pequeno.', 'O navio navega.', 'A nuvem é branca.'] },
  { sound: 'NH', isolation: 'nh', syllables: ['nha', 'nhe', 'nhi', 'nho', 'nhu'], words: [{ text: 'galinha', icon: '🐔' }, { text: 'aranha', icon: '🕷️' }, { text: 'banho', icon: '🛁' }, { text: 'unha', icon: '💅' }], sentences: ['A galinha come milho.', 'A aranha sobe.', 'Eu tomo banho.'] },
  { sound: 'P', isolation: 'p', syllables: ['pa', 'pe', 'pi', 'po', 'pu'], words: [{ text: 'pato', icon: '🦆' }, { text: 'pé', icon: '🦶' }, { text: 'peixe', icon: '🐟' }, { text: 'pipoca', icon: '🍿' }], sentences: ['O pato nada.', 'O peixe pula.', 'A pipoca estoura.'] },
  { sound: 'R', isolation: 'rrr', syllables: ['ra', 're', 'ri', 'ro', 'ru'], words: [{ text: 'rato', icon: '🐭' }, { text: 'rosa', icon: '🌹' }, { text: 'rei', icon: '🤴' }, { text: 'relógio', icon: '⌚' }], sentences: ['O rato roeu a roupa do rei.', 'A rosa é vermelha.', 'O rei tem uma coroa.'] },
  { sound: 'S', isolation: 'sss', syllables: ['sa', 'se', 'si', 'so', 'su'], words: [{ text: 'sapo', icon: '🐸' }, { text: 'sol', icon: '☀️' }, { text: 'suco', icon: '🧃' }, { text: 'sapato', icon: '👞' }], sentences: ['O sapo pula.', 'O sol brilha.', 'O suco é gelado.'] },
  { sound: 'T', isolation: 't', syllables: ['ta', 'te', 'ti', 'to', 'tu'], words: [{ text: 'tomate', icon: '🍅' }, { text: 'telefone', icon: '📞' }, { text: 'tigre', icon: '🐯' }, { text: 'tartaruga', icon: '🐢' }], sentences: ['O tigre corre.', 'O tomate é vermelho.', 'A tartaruga anda devagar.'] },
  { sound: 'V', isolation: 'vvv', syllables: ['va', 've', 'vi', 'vo', 'vu'], words: [{ text: 'vaca', icon: '🐄' }, { text: 'vela', icon: '🕯️' }, { text: 'vovó', icon: '👵' }, { text: 'violão', icon: '🎸' }], sentences: ['A vaca come capim.', 'A vela está acesa.', 'A vovó toca violão.'] },
  { sound: 'Z', isolation: 'zzz', syllables: ['za', 'ze', 'zi', 'zo', 'zu'], words: [{ text: 'zebra', icon: '🦓' }, { text: 'zero', icon: '0️⃣' }, { text: 'azul', icon: '🔵' }, { text: 'zangado', icon: '😠' }], sentences: ['A zebra corre.', 'O zero é redondo.', 'O céu é azul.'] },
];

export const SAY_PT: SayMap = {
  // Som isolado: o espeak soletra a letra ("eme", "cê" = /s/, "cê agá"); o nome fônico dá o som certo
  c: 'quê', ch: 'xê', fff: 'fê', g: 'guê', jjj: 'jê', lll: 'lê', lh: 'lhê', mmm: 'mê',
  nnn: 'nê', nh: 'nhê', rrr: 'rê', sss: 'sê', vvv: 'vê', zzz: 'zê',
  // Famílias silábicas recitadas como no bê-á-bá: sozinhos, "be", "se", "do" etc. saem reduzidos ([ɪ], [ʊ])
  be: 'bé', bo: 'bó', que: 'qué', co: 'có', che: 'ché', cho: 'chó', da: 'dá', de: 'dé', do: 'dó',
  fe: 'fé', fo: 'fó', gue: 'gué', go: 'gó', je: 'jé', jo: 'jó', la: 'lá', le: 'lé', lo: 'ló',
  lhe: 'lhé', lho: 'lhó', me: 'mé', mo: 'mó', na: 'ná', ne: 'né', no: 'nó', nhe: 'nhé', nho: 'nhó',
  pe: 'pé', po: 'pó', re: 'ré', ro: 'ró', se: 'sé', so: 'só', te: 'té', to: 'tó', ve: 'vé',
  vo: 'vó', ze: 'zé', zo: 'zó',
};
