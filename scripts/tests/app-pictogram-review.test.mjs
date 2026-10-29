import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { CATEGORY_SETS } from '../../src/lib/data/category-data.js';
import { sequences } from '../../src/lib/data/sequence-data.js';
import { sharedPictogramFiles } from '../../src/lib/piktali/shared-pictogram-files.js';
import { trafficSafetyPictogramUrl } from '../../src/lib/data/pictogram-cache.js';

const piktaliManifest = JSON.parse(fs.readFileSync(new URL('../../static/piktali-pictograms/manifest.json', import.meta.url), 'utf8'));
const safePlacesSource = fs.readFileSync(new URL('../../src/lib/components/traffic-safety/SafePlaces.svelte', import.meta.url), 'utf8');
const trafficLightsSource = fs.readFileSync(new URL('../../src/lib/components/traffic-safety/TrafficLights.svelte', import.meta.url), 'utf8');
const vehiclesSource = fs.readFileSync(new URL('../../src/lib/components/traffic-safety/Vehicles.svelte', import.meta.url), 'utf8');
const crosswalkSource = fs.readFileSync(new URL('../../src/lib/components/traffic-safety/Crosswalk.svelte', import.meta.url), 'utf8');
const reflectorsSource = fs.readFileSync(new URL('../../src/lib/components/traffic-safety/Reflectors.svelte', import.meta.url), 'utf8');
const trafficPictogramsSource = fs.readFileSync(new URL('../../src/lib/piktali/pictograms.ts', import.meta.url), 'utf8');
const serviceWorkerSource = fs.readFileSync(new URL('../../src/service-worker.ts', import.meta.url), 'utf8');

test('Category Sort uses the generic Piktali coin instead of a euro-denominated ARASAAC coin', () => {
  const coin = CATEGORY_SETS.flatMap((set) => set.categories ?? [])
    .flatMap((category) => category.items ?? [])
    .find((item) => item.id === 'coin');
  assert.ok(coin, 'coin item exists');
  assert.equal(coin.piktaliSymbol, 'coin');
  assert.equal('arasaacId' in coin, false);

  const manifest = JSON.parse(fs.readFileSync(new URL('../../static/piktali-pictograms/manifest.json', import.meta.url), 'utf8'));
  const pictogram = manifest.pictograms.find((item) => item.symbol === 'coin');
  assert.ok(pictogram, 'coin exists in the Piktali manifest');
  assert.equal(sharedPictogramFiles.coin, pictogram.file);
  assert.equal(pictogram.labels['sv-SE'], 'Mynt');
  assert.equal(pictogram.labels['en-US'], 'Coin');
  const bytes = fs.readFileSync(new URL(`../../static/piktali-pictograms/${pictogram.file}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'eb25b285b6685abddca8794dd3675ddc430be18a389c8439d233ae390b303a20');
});

test('library sequence shows the reviewed pictogram for returning a book', () => {
  const library = sequences.find((sequence) => sequence.id === 'visit-library');
  const step = library?.steps.find((item) => item.description.en === 'Return the book');
  assert.ok(step);
  assert.equal(step.arasaacId, 6474);
  assert.notEqual(step.arasaacId, 29714, '29714 depicts going home');
});

test('Safe Places uses matching bundled Piktali scene pictograms instead of emoji', () => {
  const scenarios = [
    ['sidewalk', 'sidewalk', 'sidewalk'],
    ['road', 'street', 'street'],
    ['parking', 'parkinglot', 'parkinglot'],
    ['playground', 'playground', 'playground'],
    ['crosswalk', 'crosswalk', 'crosswalk'],
    // Piktali has no motorway pictogram, so use its general street pictogram.
    ['highway', 'highway', 'street'],
    ['school-zone', 'school', 'school'],
    ['construction', 'roadworks', 'roadworks']
  ];

  for (const [scenarioId, symbol, manifestSymbol] of scenarios) {
    const start = safePlacesSource.indexOf(`id: '${scenarioId}'`);
    assert.notEqual(start, -1, `missing Safe Places scenario ${scenarioId}`);
    const block = safePlacesSource.slice(start, safePlacesSource.indexOf('\n    },', start));
    assert.ok(block.includes(`pictogram: '${symbol}'`), `${scenarioId} uses ${symbol}`);
    assert.doesNotMatch(block, /image:\s*['"][^'"]+['"]/, `${scenarioId} must not use an emoji image`);

    const pictogram = piktaliManifest.pictograms.find((item) => item.symbol === manifestSymbol);
    assert.ok(pictogram, `missing Piktali pictogram ${manifestSymbol}`);
    const fileMatch = trafficPictogramsSource.match(new RegExp(`${symbol}: '([^']+)'`));
    assert.ok(fileMatch, `${symbol} resolves to a Piktali file`);
    const mappedFile = fileMatch[1];
    const bytes = fs.readFileSync(new URL(`../../static/piktali-pictograms/${mappedFile}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), pictogram.sha256, `${symbol} asset matches its manifest hash`);
    const basename = mappedFile.split('/').at(-1).replaceAll('.', `${String.fromCharCode(92)}.`);
    assert.ok(serviceWorkerSource.includes(basename), `${symbol} is precached for offline use`);
  }

  assert.match(safePlacesSource, /<img[\s\S]*?src=\{scenarioPictogram\(scenarios\[currentScenario\]\)\}/);
});

test('Traffic Safety actions, vehicles and clothing use verified Piktali pictograms', () => {
  const assets = [
    ['stop', 'stop', trafficLightsSource],
    ['wait', 'wait', trafficLightsSource],
    ['go', 'go', trafficLightsSource],
    ['look', 'look', vehiclesSource],
    ['walk', 'walk', crosswalkSource],
    ['person', 'persongeneral', reflectorsSource],
    ['sun', 'sun', reflectorsSource],
    ['moon', 'moon', reflectorsSource],
    ['car', 'car', vehiclesSource],
    ['bus', 'bus', vehiclesSource],
    ['truck', 'truck', vehiclesSource],
    ['bicycle', 'bicycle', vehiclesSource],
    ['ambulance', 'ambulance', vehiclesSource],
    ['police-car', 'police-car', vehiclesSource],
    ['fire-engine', 'fire-engine', vehiclesSource],
    ['reflector', 'reflector-vest', reflectorsSource],
    ['helmet', 'helmet', reflectorsSource],
    ['backpack', 'backpack', reflectorsSource],
    ['shoes', 'shoes', reflectorsSource]
  ];

  for (const [mappingKey, manifestSymbol, componentSource] of assets) {
    const pictogram = piktaliManifest.pictograms.find((item) => item.symbol === manifestSymbol);
    assert.ok(pictogram, `missing Piktali pictogram ${manifestSymbol}`);
    assert.ok(componentSource.includes('piktaliTrafficPictogramUrl'), `component does not resolve ${mappingKey} through Piktali`);

    const escapedKey = mappingKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fileMatch = trafficPictogramsSource.match(new RegExp(`(?:^|\\s)['"]?${escapedKey}['"]?: '([^']+)'`, 'm'));
    assert.ok(fileMatch, `${mappingKey} resolves to a Piktali asset`);
    const mappedFile = fileMatch[1];
    const bytes = fs.readFileSync(new URL(`../../static/piktali-pictograms/${mappedFile}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), pictogram.sha256, `${mappingKey} asset matches its manifest hash`);
    const basename = mappedFile.split('/').at(-1).replaceAll('.', `${String.fromCharCode(92)}.`);
    assert.ok(serviceWorkerSource.includes(basename), `${mappingKey} is precached for offline use`);
  }

  assert.match(trafficPictogramsSource, /trafficSafetyPictogramUrl\(base, file/);
  assert.match(trafficLightsSource, /\{#if pictogramUrl\}/, 'all three traffic-light actions render their available pictogram');
  assert.match(vehiclesSource, /icon: 'police-car'/);
  assert.match(vehiclesSource, /icon: 'fire-engine'/);
  assert.match(crosswalkSource, /class="character-image"/);
  assert.match(reflectorsSource, /class="reflective-band"/, 'the reflective armband is drawn as a band, not represented by an unrelated pictogram');
  assert.match(reflectorsSource, /reflective-detail--helmet/);
  assert.match(reflectorsSource, /reflective-detail--bag/);
  assert.match(reflectorsSource, /reflective-detail--shoes/);
  assert.match(reflectorsSource, /nameKey: 'item-helmet'/);
  assert.match(reflectorsSource, /placedPictogram = reflector\.pictogram/);
  assert.match(reflectorsSource, /class="placed-reflector"[\s\S]*?src=\{placedPictogram\}/);
  assert.match(reflectorsSource, /dayPictogram/);
  assert.match(reflectorsSource, /nightPictogram/);
});

test('Traffic Safety Piktali assets use Loopia path versioning and keep query versioning elsewhere', () => {
  const file = 'assets/trafficlight-fd91ed3bdb7e-v2.svg';
  assert.equal(
    trafficSafetyPictogramUrl('/launcher/', file, true),
    '/launcher/piktali-pictograms/v2026-10-28-reflective-accessories-6/assets/trafficlight-fd91ed3bdb7e-v2.svg'
  );
  assert.equal(
    trafficSafetyPictogramUrl('/launcher/', file),
    '/launcher/piktali-pictograms/assets/trafficlight-fd91ed3bdb7e-v2.svg?v=2026-10-28-reflective-accessories-6'
  );
  assert.match(trafficPictogramsSource, /VITE_PIKTALI_ASSET_URL_MODE === 'path'/);
  assert.match(serviceWorkerSource, /pathVersionedPiktaliAssets[\s\S]*file\.replace\('\/piktali-pictograms\/assets\//);
});
