import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { applySwedishLookupOverrides, SWEDISH_LOOKUP_OVERRIDES } from '../src/lib/arasaac/sv-lookup-overrides.js';

const catalogUrl = 'https://api.arasaac.org/v1/pictograms/all/en';
const lookupPath = new URL('../static/arasaac-sv.json', import.meta.url);
const trafficPath = new URL('../static/pictograms/traffic-safety', import.meta.url);
const pictogramSourcePath = new URL('../src/lib/data/arasaac-data.js', import.meta.url);
const activityGridPath = new URL('../src/lib/components/traffic-safety/ActivityGrid.svelte', import.meta.url);
const piktaliSymbols = ['trafficlight', 'crosswalk', 'safeplace', 'reflector', 'car'];
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
  'safe-places': 'safeplace',
  reflectors: 'reflector',
  vehicles: 'car'
};
if (pictogramIds.warning !== 25315 || !trafficFiles.includes('25315.png')) errors.push('road-signs tile: expected ARASAAC warning triangle 25315');
if (!activityGrid.includes("getPictogram('warning')")) errors.push('road-signs tile: must use the warning pictogram');
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
const piktaliAssetSymbols = { trafficlight: 'trafficlight', crosswalk: 'crosswalk', safeplace: 'safeplace', reflector: 'reflector-vest', car: 'car' };
for (const symbol of piktaliSymbols) {
  const catalogSymbol = piktaliAssetSymbols[symbol];
  const pictogram = piktaliBySymbol.get(catalogSymbol);
  const expectedFile = pictogram?.file;
  const mappedFile = piktaliAssetMap[symbol];
  if (!pictogram) errors.push(`Piktali ${symbol}: missing symbol ${catalogSymbol} from the manifest`);
  if (mappedFile !== expectedFile) errors.push(`Piktali ${symbol}: expected manifest asset ${expectedFile}, got ${mappedFile}`);
  if (expectedFile) {
    const assetPath = new URL(`../static/piktali-pictograms/${expectedFile}`, import.meta.url);
    const bytes = await readFile(assetPath).catch(() => null);
    if (!bytes) errors.push(`Piktali ${symbol}: missing original asset ${expectedFile}`);
    else if (expectedFile.endsWith('.svg') && !/<svg\b[^>]*viewBox=/.test(bytes.toString('utf8'))) errors.push(`Piktali ${symbol}: SVG has no viewBox`);
    else if (expectedFile.endsWith('.webp') && bytes.toString('ascii', 8, 12) !== 'WEBP') errors.push(`Piktali ${symbol}: invalid WebP signature`);
  }
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
console.log(`Checked five traffic-safety cards resolve to Piktali assets (${Object.values(expectedSymbols).join(', ')}) and road signs use the ARASAAC warning triangle.`);
console.log(`ARASAAC English catalog: ${catalog.length} pictograms.`);

if (errors.length) {
  console.error(`${errors.length} pictogram issue(s):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`All non-overridden lookup terms match official keywords; ${reviewedOverrides.size} documented visual overrides and all local traffic images are valid.`);
}
