import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speechChunks, stepOffsets } from '../../src/lib/data/tongue-sync.ts';
import { PRACTICE_SEQUENCES_PT } from '../../src/lib/data/pt-br/tongue-viewer.ts';

test('without `say`, every sound is its own chunk spoken by its label', () => {
  assert.deepEqual(speechChunks(['b', 'a'], undefined, (s) => s.toUpperCase()), [
    { start: 0, sounds: ['b'], text: 'B' },
    { start: 1, sounds: ['a'], text: 'A' },
  ]);
});

test('a syllable in `say` covers the silent sounds before it', () => {
  assert.deepEqual(speechChunks(['b', 'a', 'd', 'a'], ['', 'bá', '', 'dá'], (s) => s), [
    { start: 0, sounds: ['b', 'a'], text: 'bá' },
    { start: 2, sounds: ['d', 'a'], text: 'dá' },
  ]);
  assert.deepEqual(speechChunks(['a', 'l', 'a'], ['', '', 'ala'], (s) => s), [
    { start: 0, sounds: ['a', 'l', 'a'], text: 'ala' },
  ]);
});

test('every pt sequence is fully covered by spoken chunks (no trailing silent sounds)', () => {
  for (const seq of PRACTICE_SEQUENCES_PT) {
    const chunks = speechChunks(seq.sounds, seq.say, (s) => s);
    assert.deepEqual(chunks.flatMap((c) => c.sounds), seq.sounds, seq.id);
    assert.ok(chunks.every((c) => c.text), seq.id);
  }
});

test('the first sound is shown before the audio; the others are spread over its duration', () => {
  assert.deepEqual(stepOffsets(1, 900), []);
  assert.deepEqual(stepOffsets(2, 900), [300]);
  assert.deepEqual(stepOffsets(3, 1000), [250, 500]);
});

test('an unknown duration (Web Speech) falls back to an estimate per sound', () => {
  const offsets = stepOffsets(2, NaN);
  assert.equal(offsets.length, 1);
  assert.ok(offsets[0] > 0 && Number.isFinite(offsets[0]));
});
