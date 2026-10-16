import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flatten, compareDicts, placeholders, filterKnown } from '../check-i18n.mjs';

test('flatten nested objects and arrays', () => {
  assert.deepEqual(flatten({ a: { b: 'x', c: ['y', 'z'] } }), { 'a.b': 'x', 'a.c.0': 'y', 'a.c.1': 'z' });
});

test('placeholders extracts {name} tokens sorted', () => {
  assert.deepEqual(placeholders('Hi {name}, {n} stars'), ['{n}', '{name}']);
  assert.deepEqual(placeholders('none'), []);
});

test('compareDicts reports missing, extra, placeholder and empty problems', () => {
  const src = { a: 'Hello {name}', b: 'Bye', c: 'Cat' };
  const tgt = { a: 'Olá', b: '', d: 'extra' };
  const r = compareDicts(src, tgt, { allowSame: [] });
  assert.deepEqual(r.missing, ['c']);
  assert.deepEqual(r.extra, ['d']);
  assert.deepEqual(r.placeholderMismatch, ['a']);
  assert.deepEqual(r.empty, ['b']);
});

test('compareDicts flags untranslated (identical) values unless allowed', () => {
  const r = compareDicts({ a: 'PECS®', b: 'Hello' }, { a: 'PECS®', b: 'Hello' }, { allowSame: ['PECS®'] });
  assert.deepEqual(r.same, ['b']);
});

test('compareDicts flags values much longer than source', () => {
  const r = compareDicts({ a: 'Go' }, { a: 'Vamos lá agora mesmo' }, { allowSame: [], maxRatio: 1.6, minLen: 1 });
  assert.deepEqual(r.long, ['a']);
});

test('filterKnown removes known keys', () => {
  assert.deepEqual(filterKnown(['a', 'b'], ['b']), ['a']);
});
