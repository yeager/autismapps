import { base } from '$app/paths';
import manifest from '../../../static/piktali-pictograms/manifest.json';

/**
 * Stable paths for the internally shared Piktali pictogram export.
 * File formats and review metadata come from the shared manifest, so SVG and
 * WebP pictures are both usable by consuming applications.
 */
type SharedPictogram = {
  symbol: string;
  file: string;
};

const fileBySymbol = new Map(
  (manifest.pictograms as SharedPictogram[]).map(({ symbol, file }) => [symbol, file])
);

export function piktaliPictogramUrl(symbol: string): string | null {
  const file = fileBySymbol.get(symbol);
  return file ? `${base}/piktali-pictograms/${file}` : null;
}

/**
 * The picture dictionary uses English lookup keys. Most are canonical catalog
 * symbols; only terms with a deliberately different catalog key need aliases.
 */
const dictionarySymbolAliases: Record<string, string> = {
  'ice cream': 'icecream',
  jacket: 'coat',
  socks: 'sock',
  't-shirt': 'shirt',
  tv: 'television',
  pen: 'pencil'
};

export function piktaliDictionaryPictogramUrl(englishWord: string): string | null {
  return piktaliPictogramUrl(dictionarySymbolAliases[englishWord] ?? englishWord);
}
