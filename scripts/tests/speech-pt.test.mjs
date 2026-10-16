import { test } from 'node:test';
import assert from 'node:assert/strict';

// Invariants of the pt-BR speech content (src/lib/data/pt-br/). Each test loads its module dynamically,
// so a missing module only fails its own test.
const load = (name) => import(`../../src/lib/data/pt-br/${name}.ts`);

/** Lowercase, without diacritics or spaces */
const bare = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, '').toLowerCase();

function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return [...Object.keys(value), ...Object.values(value).flatMap(strings)];
  return [];
}

/** NFC everywhere (word-builder splits words into letters) and no Swedish letters left behind */
function assertCleanStrings(mod) {
  for (const s of strings(Object.values(mod))) {
    assert.equal(s, s.normalize('NFC'), `not NFC: ${s}`);
    assert.doesNotMatch(s, /[åäöÅÄÖ]/, `Swedish letter in: ${s}`);
  }
}

function assertUnique(list, label) {
  const seen = new Set();
  for (const item of list) {
    assert.ok(!seen.has(item), `${label}: duplicated "${item}"`);
    seen.add(item);
  }
}

/** A SAY_PT entry whose key is never spoken is a typo or a leftover */
function assertSayKeysSpoken(say, spoken, label) {
  for (const key of Object.keys(say)) assert.ok(spoken.has(key), `${label}: SAY_PT['${key}'] is never spoken`);
}

function levenshtein(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

test('word-parade: 18 minimal pairs, 4 contrast types, one-segment differences', async () => {
  const mod = await load('word-parade');
  assertCleanStrings(mod);
  const pairs = mod.MINIMAL_PAIRS_PT;
  assert.equal(pairs.length, 18);
  for (const type of ['voicing', 'place', 'manner', 'vowel']) assert.ok(pairs.some((p) => p.contrastType === type), type);
  assertUnique(pairs.map((p) => `${p.word1}/${p.word2}`), 'pairs');
  for (const p of pairs) {
    const dist = levenshtein(p.word1, p.word2);
    assert.ok(dist >= 1 && dist <= 2, `${p.word1}/${p.word2}: distance ${dist}`);
    assert.ok(p.icon1 && p.icon2, `${p.word1}/${p.word2}: missing icon`);
  }
});

test('word-builder: 12 uppercase words of 2 to 6 letters', async () => {
  const mod = await load('word-builder');
  assertCleanStrings(mod);
  const words = mod.WORDS_PT;
  assert.equal(words.length, 12);
  assertUnique(words.map((w) => w.word), 'words');
  for (const w of words) {
    assert.equal(w.word, w.word.toUpperCase(), w.word);
    const letters = w.word.split('');
    assert.ok(letters.length >= 2 && letters.length <= 6, `${w.word}: ${letters.length} letters`);
    assert.ok(w.hint, `${w.word}: missing hint`);
  }
});

test('speech-rhythm: stressed syllable in capitals, every stress position, valid contours', async () => {
  const mod = await load('speech-rhythm');
  assertCleanStrings(mod);
  const words = mod.RHYTHM_WORDS_PT;
  assert.equal(words.length, 15);
  assertUnique(words.map((w) => w.text), 'words');
  const kinds = { oxitona: 0, paroxitona: 0, proparoxitona: 0, monossilabo: 0 };
  for (const w of words) {
    assert.equal(w.syllables.join('').toLowerCase(), w.text, w.text);
    assert.ok(w.stressIndex >= 0 && w.stressIndex < w.syllables.length, w.text);
    w.syllables.forEach((s, i) => {
      assert.equal(s, i === w.stressIndex ? s.toUpperCase() : s.toLowerCase(), `${w.text}: syllable ${i}`);
    });
    const fromEnd = w.syllables.length - 1 - w.stressIndex;
    assert.ok(fromEnd <= 2, `${w.text}: stress before the antepenult`);
    if (w.syllables.length === 1) kinds.monossilabo++;
    else kinds[['oxitona', 'paroxitona', 'proparoxitona'][fromEnd]]++;
  }
  for (const kind of ['oxitona', 'paroxitona', 'proparoxitona']) assert.ok(kinds[kind] >= 3, `${kind}: ${kinds[kind]}`);
  const patterns = mod.INTONATION_PATTERNS_PT;
  assert.equal(patterns.length, 6);
  for (const type of ['statement', 'question', 'exclamation']) assert.equal(patterns.filter((p) => p.type === type).length, 2, type);
  for (const p of patterns) {
    assert.ok(p.contour.length >= 3 && p.contour.length <= 8, p.text);
    assert.ok(p.contour.every((v) => Number.isInteger(v) && v >= 1 && v <= 5), p.text);
  }
});

test('the-mimic: four DTTC levels with the Swedish item counts', async () => {
  const mod = await load('the-mimic');
  assertCleanStrings(mod);
  const data = mod.LEVEL_DATA_PT;
  assert.deepEqual(Object.keys(data), ['sounds', 'words', 'phrases', 'sentences']);
  assert.deepEqual(Object.values(data).map((items) => items.length), [15, 15, 12, 10]);
  for (const [level, items] of Object.entries(data)) {
    assertUnique(items.map((i) => i.text), level);
    for (const i of items) assert.ok(i.icon, `${level}: ${i.text} without icon`);
  }
  for (const s of data.sentences) assert.match(s.text, /^[A-ZÀ-Ú].*[.?!]$/u, s.text);
  assertSayKeysSpoken(mod.SAY_PT, new Set(Object.values(data).flat().map((i) => i.text)), 'the-mimic');
});

test('speech-practice: three sets with difficulty 1 to 3', async () => {
  const mod = await load('speech-practice');
  assertCleanStrings(mod);
  const sets = mod.PRACTICE_SETS_PT;
  assert.deepEqual(sets.map((s) => s.id), ['simple', 'words', 'phrases']);
  assert.deepEqual(sets.map((s) => s.items.length), [6, 8, 6]);
  for (const set of sets) {
    assert.equal(set.labelKey, `speechPractice.set.${set.id}`);
    assertUnique(set.items.map((i) => i.text), set.id);
    for (const i of set.items) assert.ok([1, 2, 3].includes(i.difficulty), `${set.id}: ${i.text}`);
  }
  assertSayKeysSpoken(mod.SAY_PT, new Set(sets.flatMap((s) => s.items.map((i) => i.text))), 'speech-practice');
});

test('syllable-jump: syllables rebuild each word; counts follow the set labels', async () => {
  const mod = await load('syllable-jump');
  assertCleanStrings(mod);
  const sets = mod.WORD_SETS_PT;
  const ranges = { 'syllableJump.set.easy': [2, 2], 'syllableJump.set.medium': [2, 3], 'syllableJump.set.hard': [3, 5] };
  assert.deepEqual(sets.map((s) => s.labelKey), Object.keys(ranges));
  const spoken = new Set();
  for (const set of sets) {
    assert.equal(set.words.length, 8, set.labelKey);
    assertUnique(set.words.map((w) => w.word), set.labelKey);
    const [min, max] = ranges[set.labelKey];
    for (const w of set.words) {
      assert.equal(w.syllables.join(''), w.word, w.word);
      assert.ok(w.syllables.length >= min && w.syllables.length <= max, `${w.word}: ${w.syllables.length} syllables`);
      assert.ok(w.icon, w.word);
      spoken.add(w.word);
      for (const s of w.syllables) spoken.add(s);
    }
  }
  assertSayKeysSpoken(mod.SAY_PT, spoken, 'syllable-jump');
});

test('sound-chain: the sounds of each chain spell its word', async () => {
  const mod = await load('sound-chain');
  assertCleanStrings(mod);
  const levels = mod.LEVELS_PT;
  assert.deepEqual(levels.map((l) => l.id), ['vowels', 'cv', 'cvc', 'words']);
  const spoken = new Set();
  for (const level of levels) {
    assert.equal(level.labelKey, `soundChain.level.${level.id}`);
    assert.equal(level.chains.length, 5, level.id);
    assertUnique(level.chains.map((c) => c.word), level.id);
    for (const c of level.chains) {
      assert.equal(c.sounds.join(''), c.word, c.word);
      assert.ok(c.icon, c.word);
      spoken.add(c.word);
      for (const s of c.sounds) spoken.add(s);
    }
  }
  assert.ok(levels[0].chains.every((c) => c.sounds.every((s) => /^[aeiou]$/.test(s))), 'vowels level has only vowels');
  assertSayKeysSpoken(mod.SAY_PT, spoken, 'sound-chain');
});

test('sound-lottery: 18 phonemes, target grapheme everywhere, no isolated "cu"', async () => {
  const mod = await load('sound-lottery');
  assertCleanStrings(mod);
  const phonemes = mod.PHONEMES_PT;
  assert.deepEqual(phonemes.map((p) => p.sound), ['B', 'C', 'CH', 'D', 'F', 'G', 'J', 'L', 'LH', 'M', 'N', 'NH', 'P', 'R', 'S', 'T', 'V', 'Z']);
  const starts = { C: ['c', 'qu'], G: ['g', 'gu'] };
  const spoken = new Set();
  for (const p of phonemes) {
    const target = p.sound.toLowerCase();
    assert.ok(p.isolation.startsWith(target), `${p.sound}: isolation ${p.isolation}`);
    assert.ok(p.syllables.length >= 4, `${p.sound}: ${p.syllables.length} syllables`);
    assertUnique(p.syllables, `${p.sound} syllables`);
    for (const s of p.syllables) assert.ok((starts[p.sound] ?? [target]).some((g) => s.startsWith(g)), `${p.sound}: syllable ${s}`);
    assert.equal(p.words.length, 4, p.sound);
    assertUnique(p.words.map((w) => w.text), `${p.sound} words`);
    for (const w of p.words) {
      assert.ok(w.text.includes(target), `${p.sound}: word ${w.text}`);
      assert.ok(w.icon, w.text);
    }
    assert.equal(p.sentences.length, 3, p.sound);
    for (const s of p.sentences) assert.ok(s.toLowerCase().includes(target), `${p.sound}: sentence ${s}`);
    for (const t of [p.isolation, ...p.syllables, ...p.words.map((w) => w.text), ...p.sentences]) spoken.add(t);
  }
  assert.ok(!phonemes.some((p) => p.syllables.includes('cu')), '"cu" is a swear word when said alone');
  assertSayKeysSpoken(mod.SAY_PT, spoken, 'sound-lottery');
});

test('rest-trainer: 5 levels × 8; display and spoken form follow syllables and stress', async () => {
  const mod = await load('rest-trainer');
  assertCleanStrings(mod);
  const levels = mod.LEVELS_PT;
  assert.deepEqual(levels.map((l) => l.id), [1, 2, 3, 4, 5]);
  const spoken = new Set();
  for (const level of levels) {
    assert.equal(level.nameKey, `restTrainer.level${level.id}.name`);
    assert.equal(level.descKey, `restTrainer.level${level.id}.desc`);
    assert.equal(level.sequences.length, 8, `level ${level.id}`);
    assertUnique(level.sequences.map((s) => s.id), `level ${level.id} ids`);
    assertUnique(level.sequences.map((s) => s.display), `level ${level.id} displays`);
    for (const seq of level.sequences) {
      assert.equal(seq.stress.length, seq.syllables.length, seq.id);
      assert.ok(seq.stress.every((s) => s === 0 || s === 1) && seq.stress.includes(1), seq.id);
      assert.equal(seq.display, seq.syllables.map((s, i) => (seq.stress[i] ? s.toUpperCase() : s)).join('-'), seq.id);
      assert.ok(seq.say, `${seq.id}: missing spoken form`);
      assert.equal(bare(seq.say), bare(seq.syllables.join('')), `${seq.id}: ${seq.say}`);
      for (const s of seq.syllables) {
        // Made-up syllables: no h, r, j, x, ch, c/g before e/i, t/d before e/i (palatalized)
        if (level.id > 1) assert.match(s, /^(qu|gu|[pbtdcgfvmnls])[aeiou]$/, `${seq.id}: ${s}`);
        assert.ok(!['cu', 'te', 'ti', 'de', 'di', 'ce', 'ci', 'ge', 'gi'].includes(s), `${seq.id}: ${s}`);
        spoken.add(s);
      }
    }
  }
  assertSayKeysSpoken(mod.SAY_PT, spoken, 'rest-trainer');
});
