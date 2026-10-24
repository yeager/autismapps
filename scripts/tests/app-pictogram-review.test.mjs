import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { CATEGORY_SETS } from '../../src/lib/data/category-data.js';
import { sequences } from '../../src/lib/data/sequence-data.js';
import { sharedPictogramFiles } from '../../src/lib/piktali/shared-pictogram-files.js';

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
