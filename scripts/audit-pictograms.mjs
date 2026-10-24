import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { applySwedishLookupOverrides, SWEDISH_LOOKUP_OVERRIDES } from '../src/lib/arasaac/sv-lookup-overrides.js';
import { CATEGORY_SETS } from '../src/lib/data/category-data.js';
import { sequences } from '../src/lib/data/sequence-data.js';
import { sharedPictogramFiles } from '../src/lib/piktali/shared-pictogram-files.js';

const catalogUrl = 'https://api.arasaac.org/v1/pictograms/all/en';
const lookupPath = new URL('../static/arasaac-sv.json', import.meta.url);
const trafficPath = new URL('../static/pictograms/traffic-safety', import.meta.url);
const pictogramSourcePath = new URL('../src/lib/data/arasaac-data.js', import.meta.url);
const activityGridPath = new URL('../src/lib/components/traffic-safety/ActivityGrid.svelte', import.meta.url);
const piktaliSymbols = ['trafficlight', 'crosswalk', 'danger', 'safeplace', 'reflector', 'car'];
// Visually reviewed card art. Pin both the meaning and bytes so a manifest
// update cannot silently replace an approved image with a different symbol.
const reviewedPiktaliCards = {
  trafficlight: { file: 'assets/trafficlight-fd91ed3bdb7e-v2.svg', manifestFile: 'assets/trafficlight.webp', sha256: 'fd91ed3bdb7e9c5f4d89189293a68b12c4d4cb83a733ba871dde46bba5494585', labels: { 'sv-SE': 'Trafikljus', 'en-US': 'Traffic light' }, meaning: 'traffic light' },
  crosswalk: { file: 'assets/crosswalk-9302fa0c66df.webp', manifestFile: 'assets/crosswalk.webp', sha256: '9302fa0c66df4216e4069d2ee48dbf0ebb6924595aabac8e008b808b32e8f249', labels: { 'sv-SE': 'Övergångsställe', 'en-US': 'Crosswalk' }, meaning: 'pedestrian crossing' },
  danger: { file: 'assets/danger-4bc28024e9b4.webp', manifestFile: 'assets/danger.webp', sha256: '4bc28024e9b4fdc94ad3449fdd3eaf10d3cc85869016d52aa2851c60fa7a42cb', labels: { 'sv-SE': 'Fara', 'en-US': 'Danger' }, meaning: 'warning sign' },
  safeplace: { file: 'assets/safeplace-59c8550bf6e0-v2.svg', manifestFile: 'assets/safeplace.svg', sha256: '59c8550bf6e0671eb1b2b7df3ded3071221710ad572023baf4f4dcbadd190bcd', labels: { 'sv-SE': 'Trygg plats', 'en-US': 'Safe place' }, meaning: 'safe place' },
  reflector: { file: 'assets/reflector-vest-ce860b12f9aa-v2.svg', manifestFile: 'assets/reflector-vest.svg', sha256: 'ce860b12f9aa9cf8064aa486e0fad4a916eb770bceef255c3fe19511de18fac9', labels: { 'sv-SE': 'Reflexväst', 'en-US': 'Reflective vest' }, meaning: 'reflective vest' },
  car: { file: 'assets/car-a54a1ff80372.webp', manifestFile: 'assets/car.webp', sha256: 'a54a1ff803725ba41966ca5d1e0b8ff560d6a1b9f0d92bab02b0948cc8bce445', labels: { 'sv-SE': 'Bil', 'en-US': 'Car' }, meaning: 'car' }
};
const piktaliManifestPath = new URL('../static/piktali-pictograms/manifest.json', import.meta.url);
const piktaliSourcePath = new URL('../src/lib/piktali/pictograms.ts', import.meta.url);

// Human-reviewed semantic overrides where the exact English catalog keyword is
// misleading or the closest suitable ARASAAC image uses a different keyword.
const reviewedOverrides = new Map([
  ['park', { id: '2859', reason: 'A playground pictogram is a clearer park symbol than the catalog result showing a parked car.' }],
  ['mix', { id: '7162', reason: 'Shows mixing food rather than mixing flags.' }],
  ['blend', { id: '7162', reason: 'Shows mixing food rather than mixing flags.' }],
  ['seat', { id: '3155', reason: 'A chair is a clear visual representation of a seat; the exact catalog result was the letter h.' }],
  ['safe', { id: '12260', reason: 'Represents protection/security; the exact catalog result was a strongbox.' }]
]);

function normalizeKeyword(value) {
  return value.trim().toLocaleLowerCase('en').replace(/^\\(["\\])$/, '$1');
}

const [lookupText, trafficFiles, pictogramSource, activityGrid, piktaliManifestText, piktaliSource, catalogResponse] = await Promise.all([
  readFile(lookupPath, 'utf8'),
  readdir(trafficPath),
  readFile(pictogramSourcePath, 'utf8'),
  readFile(activityGridPath, 'utf8'),
  readFile(piktaliManifestPath, 'utf8'),
  readFile(piktaliSourcePath, 'utf8'),
  fetch(catalogUrl)
]);

if (!catalogResponse.ok) {
  throw new Error(`ARASAAC catalog request failed: HTTP ${catalogResponse.status}`);
}

const lookup = JSON.parse(lookupText.replace(/^\uFEFF/, ''));
const correctedLookup = applySwedishLookupOverrides(lookup);
const catalog = await catalogResponse.json();
const byId = new Map(catalog.map((pictogram) => [String(pictogram._id), pictogram]));
const errors = [];
let uniqueIds = new Set();

// Parse the simple numeric map from the source used by the UI so the card
// mappings and the local PNG bundle cannot silently drift apart.
const idsBlock = pictogramSource.match(/export const ARASAAC_IDS = \{([\s\S]*?)\n\};/);
if (!idsBlock) {
  errors.push('ARASAAC_IDS: could not find the exported pictogram map');
}
const pictogramIds = Object.fromEntries(
  [...(idsBlock?.[1] ?? '').matchAll(/^\s*([A-Za-z]\w*):\s*(\d+|null)\s*(?:,|$)/gm)]
    .map(([, key, value]) => [key, value === 'null' ? null : Number(value)])
);
const localPngIds = new Set(trafficFiles.filter((file) => file.endsWith('.png')).map((file) => file.slice(0, -4)));
for (const [key, id] of Object.entries(pictogramIds)) {
  if (id !== null && !localPngIds.has(String(id))) errors.push(`ARASAAC_IDS.${key}: missing local PNG ${id}.png`);
}
const expectedSymbols = {
  'traffic-lights': 'trafficlight',
  crosswalk: 'crosswalk',
  'road-signs': 'danger',
  'safe-places': 'safeplace',
  reflectors: 'reflector',
  vehicles: 'car'
};
for (const [activity, symbol] of Object.entries(expectedSymbols)) {
  if (!new RegExp(`[\\'\\\"]?${activity}[\\'\\\"]?:\\s*['\\\"]${symbol}['\\\"]`).test(activityGrid)) errors.push(`${activity} tile: expected Piktali ${symbol} mapping`);
}
const piktaliManifest = JSON.parse(piktaliManifestText);
const piktaliBySymbol = new Map(piktaliManifest.pictograms.map((pictogram) => [pictogram.symbol, pictogram]));
const piktaliManifestSymbols = new Set();
const piktaliManifestFiles = new Set();
let checkedPiktaliAssets = 0;

for (const [index, pictogram] of piktaliManifest.pictograms.entries()) {
  const label = pictogram.symbol || `manifest entry ${index}`;
  if (!pictogram.symbol) errors.push(`${label}: missing symbol`);
  else if (piktaliManifestSymbols.has(pictogram.symbol)) errors.push(`${label}: duplicate symbol`);
  else piktaliManifestSymbols.add(pictogram.symbol);

  if (!pictogram.file) {
    errors.push(`${label}: missing asset path`);
    continue;
  }
  if (piktaliManifestFiles.has(pictogram.file)) errors.push(`${label}: duplicate asset path ${pictogram.file}`);
  else piktaliManifestFiles.add(pictogram.file);
  if (!pictogram.file.startsWith('assets/')
    || pictogram.file.includes('\\')
    || pictogram.file.split('/').some((part) => !part || part === '.' || part === '..')) {
    errors.push(`${label}: asset path must be inside assets/ (${pictogram.file})`);
    continue;
  }

  const assetPath = new URL(`../static/piktali-pictograms/${pictogram.file}`, import.meta.url);
  const bytes = await readFile(assetPath).catch(() => null);
  if (!bytes) {
    errors.push(`${label}: missing asset ${pictogram.file}`);
    continue;
  }

  checkedPiktaliAssets++;
  if (bytes.length !== pictogram.bytes) errors.push(`${label}: byte count does not match manifest (${bytes.length} != ${pictogram.bytes})`);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== pictogram.sha256) errors.push(`${label}: SHA-256 does not match manifest`);

  if (pictogram.file.endsWith('.svg')) {
    const svg = bytes.toString('utf8');
    if (!/<svg\b[^>]*viewBox=/.test(svg)) errors.push(`${label}: SVG has no viewBox`);
    if (/\$\{[^}]+\}/.test(svg)) errors.push(`${label}: SVG contains an unresolved template expression`);
  } else if (pictogram.file.endsWith('.webp')) {
    if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
      errors.push(`${label}: invalid WebP signature`);
    }
  } else {
    errors.push(`${label}: unsupported asset type ${pictogram.file}`);
  }

  if (!pictogram.labels?.['sv-SE'] || !pictogram.labels?.['en-US']) {
    errors.push(`${label}: missing Swedish or English label`);
  }
}

const piktaliMapBlock = piktaliSource.match(/const files: Record<string, string> = \{([\s\S]*?)\n  \};/);
const piktaliAssetMap = Object.fromEntries(
  [...(piktaliMapBlock?.[1] ?? '').matchAll(/^\s*(\w+): '(assets\/[^']+)'/gm)]
    .map(([, symbol, file]) => [symbol, file])
);
if (!piktaliMapBlock) errors.push('Piktali traffic pictogram map: could not find the shared asset mapping');
const piktaliAssetSymbols = { trafficlight: 'trafficlight', crosswalk: 'crosswalk', danger: 'danger', safeplace: 'safeplace', reflector: 'reflector-vest', car: 'car' };
for (const symbol of piktaliSymbols) {
  const catalogSymbol = piktaliAssetSymbols[symbol];
  const pictogram = piktaliBySymbol.get(catalogSymbol);
  const reviewed = reviewedPiktaliCards[symbol];
  const expectedFile = reviewed?.file;
  const mappedFile = piktaliAssetMap[symbol];
  if (!pictogram) errors.push(`Piktali ${symbol}: missing symbol ${catalogSymbol} from the manifest`);
  if (pictogram?.file !== reviewed?.manifestFile) errors.push(`Piktali ${symbol}: catalog symbol should remain ${reviewed?.manifestFile}, got ${pictogram?.file}`);
  for (const [locale, label] of Object.entries(reviewed?.labels ?? {})) {
    if (pictogram?.labels?.[locale] !== label) errors.push(`Piktali ${symbol}: expected reviewed ${locale} label ${label}, got ${pictogram?.labels?.[locale]}`);
  }
  if (mappedFile !== expectedFile) errors.push(`Piktali ${symbol}: expected manifest asset ${expectedFile}, got ${mappedFile}`);
  if (expectedFile) {
    const assetPath = new URL(`../static/piktali-pictograms/${expectedFile}`, import.meta.url);
    const bytes = await readFile(assetPath).catch(() => null);
    if (!bytes) errors.push(`Piktali ${symbol}: missing original asset ${expectedFile}`);
    else {
      const sha256 = createHash('sha256').update(bytes).digest('hex');
      if (sha256 !== reviewed.sha256) errors.push(`Piktali ${symbol}: visually reviewed ${reviewed.meaning} image hash changed (${sha256})`);
      if (!expectedFile.includes(sha256.slice(0, 12))) errors.push(`Piktali ${symbol}: cache-safe filename must include the reviewed content hash`);
      if (expectedFile.endsWith('.svg') && !/<svg\b[^>]*viewBox=/.test(bytes.toString('utf8'))) errors.push(`Piktali ${symbol}: SVG has no viewBox`);
      else if (expectedFile.endsWith('.webp') && bytes.toString('ascii', 8, 12) !== 'WEBP') errors.push(`Piktali ${symbol}: invalid WebP signature`);
    }
  }
}

const categoryCoin = CATEGORY_SETS.flatMap((set) => set.categories ?? [])
  .flatMap((category) => category.items ?? [])
  .find((item) => item.id === 'coin');
const coinPictogram = piktaliBySymbol.get('coin');
const reviewedCoinSha256 = 'eb25b285b6685abddca8794dd3675ddc430be18a389c8439d233ae390b303a20';
if (categoryCoin?.piktaliSymbol !== 'coin' || 'arasaacId' in (categoryCoin ?? {})) {
  errors.push('Category Sort coin: expected the generic Piktali coin, not a currency-specific ARASAAC coin');
}
if (!coinPictogram || coinPictogram.file !== 'assets/coin.svg' || sharedPictogramFiles.coin !== coinPictogram.file) {
  errors.push('Category Sort coin: Piktali symbol, shared asset map, and manifest do not agree');
} else {
  if (coinPictogram.labels?.['sv-SE'] !== 'Mynt' || coinPictogram.labels?.['en-US'] !== 'Coin') {
    errors.push('Category Sort coin: expected reviewed Swedish and English labels');
  }
  const bytes = await readFile(new URL(`../static/piktali-pictograms/${coinPictogram.file}`, import.meta.url)).catch(() => null);
  if (!bytes || createHash('sha256').update(bytes).digest('hex') !== reviewedCoinSha256) {
    errors.push('Category Sort coin: reviewed generic coin artwork is missing or changed');
  }
}

const libraryReturn = sequences.find((sequence) => sequence.id === 'visit-library')?.steps
  .find((step) => step.description.en === 'Return the book');
if (libraryReturn?.arasaacId !== 6474) {
  errors.push(`Visit the library / Return the book: expected reviewed ARASAAC ID 6474, got ${libraryReturn?.arasaacId}`);
}

for (const [term, entry] of Object.entries(lookup)) {
  const pictogram = byId.get(String(entry.id));
  uniqueIds.add(entry.id);

  if (!pictogram) {
    errors.push(`${JSON.stringify(term)}: missing catalog ID ${entry.id}`);
    continue;
  }

  const keywords = new Set((pictogram.keywords ?? []).map(({ keyword }) => normalizeKeyword(keyword)));
  const override = reviewedOverrides.get(term);
  if (override) {
    if (String(entry.id) !== override.id) errors.push(`${JSON.stringify(term)}: reviewed override expected ID ${override.id}, got ${entry.id}`);
  } else if (!keywords.has(normalizeKeyword(term))) {
    errors.push(`${JSON.stringify(term)} -> ${entry.id}: not an official keyword (${[...keywords].join('; ')})`);
  }
}

for (const [term, correction] of Object.entries(SWEDISH_LOOKUP_OVERRIDES)) {
  if (correction === null) {
    if (term in correctedLookup) errors.push(`${JSON.stringify(term)}: reviewed unrelated catalog alias should be excluded`);
  } else if ((lookup[term] && lookup[term].id !== correction.id)
    || !byId.has(String(correction.id))
    || correctedLookup[term]?.sv !== correction.sv) {
    errors.push(`${JSON.stringify(term)}: reviewed Swedish correction does not match ARASAAC ID ${correction.id}`);
  }
}

const pngFiles = trafficFiles.filter((file) => file.endsWith('.png'));
for (const file of pngFiles) {
  const id = file.slice(0, -4);
  if (!byId.has(id)) errors.push(`traffic-safety/${file}: missing catalog ID`);
  const bytes = await readFile(join(trafficPath.pathname, file));
  if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    errors.push(`traffic-safety/${file}: invalid PNG signature`);
  }
}

console.log(`Checked ${Object.keys(lookup).length} Swedish lookup entries across ${uniqueIds.size} pictogram IDs.`);
console.log(`Checked ${Object.keys(SWEDISH_LOOKUP_OVERRIDES).length} reviewed Swedish alias corrections against their pictogram IDs.`);
console.log(`Checked ${pngFiles.length} local traffic-safety PNGs against the catalog and PNG signature.`);
console.log(`Checked ${Object.values(pictogramIds).filter((id) => id !== null).length} source ID assignments and the traffic-safety card image mappings.`);
console.log(`Checked ${checkedPiktaliAssets} Piktali manifest assets against their byte counts, SHA-256 hashes, file signatures, and Swedish/English labels.`);
console.log(`Checked all six traffic-safety cards resolve to the intended Piktali assets (${Object.values(expectedSymbols).join(', ')}).`);
console.log('Verified all six visually reviewed Piktali meanings, Swedish and English labels, asset paths, and pinned SHA-256 hashes.');
console.log('Verified Category Sort uses the pinned generic Piktali coin and the library sequence uses ARASAAC return-book ID 6474.');
console.log(`ARASAAC English catalog: ${catalog.length} pictograms.`);

if (errors.length) {
  console.error(`${errors.length} pictogram issue(s):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`All non-overridden lookup terms match official keywords; ${reviewedOverrides.size} documented visual overrides and all local traffic images are valid.`);
}
