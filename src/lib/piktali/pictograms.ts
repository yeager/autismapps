import { base } from '$app/paths';

/**
 * Stable paths for the internally shared Piktali pictogram export.
 * The static manifest carries the per-image review status and provenance.
 */
export function piktaliPictogramUrl(symbol: string): string {
  return `${base}/piktali-pictograms/assets/${symbol}.webp`;
}

const dictionarySymbols: Record<string, string> = {
  dog: 'dog', cat: 'cat', horse: 'horse', cow: 'cow', bird: 'bird', fish: 'fish', rabbit: 'rabbit', pig: 'pig', lion: 'lion', elephant: 'elephant',
  apple: 'apple', carrot: 'carrot', tomato: 'tomato',
  sweater: 'sweater', pants: 'pants', shoes: 'shoes', hat: 'hat', gloves: 'gloves', dress: 'dress', boots: 'boots', socks: 'sock',
  head: 'head', eye: 'eye', ear: 'ear', nose: 'nose', mouth: 'mouth', hand: 'hand', foot: 'foot', arm: 'arm', leg: 'leg',
  house: 'house', door: 'door', window: 'window', chair: 'chair', table: 'table', bed: 'bed', lamp: 'lamp', kitchen: 'kitchen', bathroom: 'bathroom', key: 'key',
  book: 'book', pencil: 'pencil', school: 'school', backpack: 'backpack', paper: 'paper', scissors: 'scissors', ruler: 'ruler', computer: 'computer', clock: 'clock'
};

export function piktaliDictionaryPictogramUrl(englishWord: string): string | null {
  const symbol = dictionarySymbols[englishWord];
  return symbol ? piktaliPictogramUrl(symbol) : null;
}
