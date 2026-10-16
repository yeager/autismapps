// Libras: nenhuma fonte tem licença confirmada para exibir os vídeos dentro do app, então o sinal abre no
// Spread The Sign, em outra aba (link externo; nada é baixado nem embutido). Mesmas categorias e cores do sueco.
export interface SignWordPt {
  pt: string;
}

export interface SignCategoryPt {
  id: string;
  icon: string;
  color: string;
  words: SignWordPt[];
}

const words = (...list: string[]): SignWordPt[] => list.map((pt) => ({ pt }));

export const SIGN_CATEGORIES_PT: SignCategoryPt[] = [
  { id: 'people', icon: '👤', color: '#f5c542', words: words('mamãe', 'papai', 'amigo', 'eu', 'você') },
  { id: 'actions', icon: '🏃', color: '#4caf50', words: words('comer', 'beber', 'dormir', 'brincar', 'ajudar', 'parar') },
  { id: 'feelings', icon: '😊', color: '#2196f3', words: words('feliz', 'triste', 'bravo', 'medo', 'cansado') },
  // "casa" fica em Lugares: o sueco separa hus (coisa) e hem (lugar), o português usa "casa" para os dois
  { id: 'things', icon: '📦', color: '#ff9800', words: words('água', 'leite', 'pão', 'carro', 'bola', 'gato', 'sapato', 'casaco') },
  { id: 'social', icon: '💬', color: '#9c27b0', words: words('sim', 'não', 'obrigado', 'oi', 'banheiro') },
  { id: 'places', icon: '🏠', color: '#795548', words: words('escola', 'casa') },
];

export const SPREAD_THE_SIGN = 'https://www.spreadthesign.com';

/** Search page of the word in Libras (the pt.br interface shows Brazilian signs) */
export function signSearchUrlPt(word: string): string {
  return `${SPREAD_THE_SIGN}/pt.br/search/?q=${encodeURIComponent(word.trim())}`;
}

/** Local search, ignoring case and accents ("agua" finds "água") */
export function matchesPt(word: string, query: string): boolean {
  const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  return fold(word).includes(fold(query.trim()));
}
