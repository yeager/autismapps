import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SIGN_CATEGORIES_PT, signSearchUrlPt, matchesPt, SPREAD_THE_SIGN } from '../../src/lib/data/pt-br/sign-dictionary.ts';

test('the 6 categories keep the Swedish ids, icons and Fitzgerald colors', () => {
  assert.deepEqual(SIGN_CATEGORIES_PT.map((c) => [c.id, c.icon, c.color]), [
    ['people', '👤', '#f5c542'], ['actions', '🏃', '#4caf50'], ['feelings', '😊', '#2196f3'],
    ['things', '📦', '#ff9800'], ['social', '💬', '#9c27b0'], ['places', '🏠', '#795548'],
  ]);
});

test('31 unique words in NFC', () => {
  const words = SIGN_CATEGORIES_PT.flatMap((c) => c.words.map((w) => w.pt));
  assert.equal(words.length, 31);
  assert.equal(new Set(words).size, words.length);
  for (const w of words) assert.equal(w, w.normalize('NFC'), w);
});

test('the sign link points to the Spread The Sign pt.br search, encoded', () => {
  assert.equal(SPREAD_THE_SIGN, 'https://www.spreadthesign.com');
  assert.equal(signSearchUrlPt('água'), 'https://www.spreadthesign.com/pt.br/search/?q=%C3%A1gua');
  assert.equal(signSearchUrlPt('  com medo '), 'https://www.spreadthesign.com/pt.br/search/?q=com%20medo');
});

test('local search ignores case and accents', () => {
  assert.equal(matchesPt('água', 'agua'), true);
  assert.equal(matchesPt('pão', 'PAO'), true);
  assert.equal(matchesPt('obrigado', 'brig'), true);
  assert.equal(matchesPt('gato', 'casa'), false);
});
