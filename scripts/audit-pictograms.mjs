import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const catalogUrl = 'https://api.arasaac.org/v1/pictograms/all/en';
const lookupPath = new URL('../static/arasaac-sv.json', import.meta.url);
const trafficPath = new URL('../static/pictograms/traffic-safety', import.meta.url);
const pictogramSourcePath = new URL('../src/lib/data/arasaac-data.js', import.meta.url);
const activityGridPath = new URL('../src/lib/components/traffic-safety/ActivityGrid.svelte', import.meta.url);
const piktaliSymbols = ['trafficlight', 'crosswalk', 'safeplace', 'vest', 'car'];

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

const [lookupText, trafficFiles, pictogramSource, activityGrid, piktaliSvgs, catalogResponse] = await Promise.all([
  readFile(lookupPath, 'utf8'),
  readdir(trafficPath),
  readFile(pictogramSourcePath, 'utf8'),
  readFile(activityGridPath, 'utf8'),
  Promise.all(piktaliSymbols.map((name) => readFile(new URL(`../static/pictograms/traffic-safety/piktali-${name}.svg`, import.meta.url), 'utf8').catch(() => ''))),
  fetch(catalogUrl)
]);

if (!catalogResponse.ok) {
  throw new Error(`ARASAAC catalog request failed: HTTP ${catalogResponse.status}`);
}

const lookup = JSON.parse(lookupText.replace(/^\uFEFF/, ''));
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
const expectedSymbols = { 'traffic-lights': 'trafficlight', crosswalk: 'crosswalk', 'safe-places': 'safeplace', reflectors: 'vest', vehicles: 'car' };
if (pictogramIds.warning !== 25315 || !trafficFiles.includes('25315.png')) errors.push('road-signs tile: expected ARASAAC warning triangle 25315');
if (!activityGrid.includes("getPictogram('warning')")) errors.push('road-signs tile: must use the warning pictogram');
for (const [activity, symbol] of Object.entries(expectedSymbols)) {
  if (!new RegExp(`[\\'\\\"]?${activity}[\\'\\\"]?:\\s*['\\\"]${symbol}['\\\"]`).test(activityGrid)) errors.push(`${activity} tile: expected Piktali ${symbol} mapping`);
  if (!trafficFiles.includes(`piktali-${symbol}.svg`)) errors.push(`${activity} tile: missing Piktali ${symbol} SVG`);
}
for (let index = 0; index < piktaliSvgs.length; index++) {
  const svg = piktaliSvgs[index];
  const symbol = piktaliSymbols[index];
  if (!/<svg\b[^>]*viewBox="0 0 100 100"/.test(svg) || !new RegExp(`Piktali [^<]+ pictogram`).test(svg)) {
    errors.push(`Piktali ${symbol} SVG is missing its viewBox or descriptive title`);
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
console.log(`Checked ${pngFiles.length} local traffic-safety PNGs against the catalog and PNG signature.`);
console.log(`Checked ${Object.values(pictogramIds).filter((id) => id !== null).length} source ID assignments and the traffic-safety card image mappings.`);
console.log(`Checked five traffic-safety cards use Piktali pictograms (${piktaliSymbols.join(', ')}) and road signs use the ARASAAC warning triangle.`);
console.log(`ARASAAC English catalog: ${catalog.length} pictograms.`);

if (errors.length) {
  console.error(`${errors.length} pictogram issue(s):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`All non-overridden lookup terms match official keywords; ${reviewedOverrides.size} documented visual overrides and all local traffic images are valid.`);
}
