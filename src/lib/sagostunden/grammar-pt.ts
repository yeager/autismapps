// Portuguese filling for the Sagostunden templates. Pure functions (no imports) so node:test can load them.
//
// Tokens (X is a slot: DJUR, PLATS, SAK, MAT, PERSON, VERB):
//   {X}         the word as is                 gato / vaca
//   {o_X}       definite article               o gato / a vaca
//   {um_X}      indefinite article             um gato / uma vaca
//   {no_X}      em + article                   no castelo / na floresta
//   {do_X}      de + article                   do rei / da rainha
//   {ao_X}      a + article                    ao parque / à praia
//   {pelo_X}    por + article                  pelo parque / pela praia
//   {seu_X}     possessive (agrees with X)     seu livro / sua estrela
//   {este_X}    demonstrative                  este livro / esta estrela
//   {X|m|f}     word chosen by X's gender      {DJUR|cansado|cansada}
//   {X+Y|m|f}   f only when every slot is f    {DJUR+PERSON|juntos|juntas}
// "num", "dum" are not used: templates write "em {um_X}", "de {um_X}".

export type GenderPt = 'm' | 'f';

export interface SlotPt {
  text: string;
  gender?: GenderPt;
}

const FORMS: Record<string, [string, string]> = {
  o: ['o', 'a'],
  um: ['um', 'uma'],
  no: ['no', 'na'],
  do: ['do', 'da'],
  ao: ['ao', 'à'],
  pelo: ['pelo', 'pela'],
  seu: ['seu', 'sua'],
  este: ['este', 'esta'],
};

export const PT_TOKEN = /\{(?:(o|um|no|do|ao|pelo|seu|este)_)?([A-Z]+(?:\+[A-Z]+)*)(?:\|([^|{}]*)\|([^|{}]*))?\}/g;

/** Capital at the start of the paragraph (after an opening quote too) and after ". ", "! ", "? " */
export function capitalizeSentences(text: string): string {
  return text
    .replace(/^(\s*["“]?)(\p{Ll})/u, (_, pre: string, ch: string) => pre + ch.toUpperCase())
    .replace(/([.!?] +)(\p{Ll})/gu, (_, pre: string, ch: string) => pre + ch.toUpperCase());
}

export function fillPt(text: string, slots: Record<string, SlotPt>): string {
  const filled = text.replace(
    PT_TOKEN,
    (match: string, form: string | undefined, names: string, masc?: string, fem?: string) => {
      const words = names.split('+').map((name) => slots[name]);
      if (words.some((w) => !w)) return match;
      if (masc !== undefined && fem !== undefined) return words.every((w) => w.gender === 'f') ? fem : masc;
      const word = words[0];
      if (!form) return word.text;
      return `${FORMS[form][word.gender === 'f' ? 1 : 0]} ${word.text}`;
    }
  );
  return capitalizeSentences(filled);
}
