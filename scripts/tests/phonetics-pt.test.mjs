import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PHONEME_SAY_PT } from '../../src/lib/data/pt-br/phonemes.ts';
import { SOUNDS_PT, SOUND_PAIRS_PT } from '../../src/lib/data/pt-br/mouth-motor.ts';
import { SOUND_TYPES } from '../../src/lib/data/mouth-sounds.js';
import { TONGUE_POSITIONS_PT, SOUND_LEVELS_PT, PRACTICE_SEQUENCES_PT } from '../../src/lib/data/pt-br/tongue-viewer.ts';
import {
  LETTERS_PT, WORDS_PT, CV_CONSONANTS_PT, VC_CONSONANTS_PT, CV_VOWELS_PT, SAY_PT as LETTER_SAY_PT,
} from '../../src/lib/data/pt-br/letter-journey.ts';
import { PROMPT_PT, CATEGORIES_PT } from '../../src/lib/data/pt-br/prompt-guide.ts';
import { TOUCH_ZONES, PRESSURE_LEVELS, DURATION_TYPES, DIRECTION_ANGLES } from '../../src/lib/data/prompt-data.js';
import { PROSODY_PT } from '../../src/lib/data/pt-br/prosody-trainer.ts';
import * as PROSODY_SV from '../../src/lib/data/prosody-data.js';
import { PHRASES_PT } from '../../src/lib/data/pt-br/melody-therapy.ts';
import { phrases as PHRASES_SV, NOTE_FREQ, CATEGORIES as MIT_CATEGORIES } from '../../src/lib/data/mit-phrases.js';

const strings = (data) => (JSON.stringify(data).match(/"(?:[^"\\]|\\.)*"/g) ?? []).map((s) => JSON.parse(s));
const count = (xs) => xs.reduce((m, x) => ({ ...m, [x]: (m[x] ?? 0) + 1 }), {});
const letters = (s) => s.toLowerCase().replace(/[^a-zà-ú]/g, '');

test('pt-BR phonetics data is NFC', () => {
  const all = [PHONEME_SAY_PT, SOUNDS_PT, SOUND_PAIRS_PT, TONGUE_POSITIONS_PT, SOUND_LEVELS_PT, PRACTICE_SEQUENCES_PT,
    LETTERS_PT, WORDS_PT, LETTER_SAY_PT, PROMPT_PT, CATEGORIES_PT, PROSODY_PT, PHRASES_PT];
  for (const data of all) for (const s of strings(data)) assert.equal(s, s.normalize('NFC'), s);
});

// ── mouth-motor ──
const MOUTH = {
  lips: ['closed', 'rounded', 'spread', 'open'],
  tongue: ['neutral', 'front-high', 'front-low', 'back-high', 'back-low', 'tip-alveolar', 'tip-postalveolar', 'tip-dental', 'blade-palatal', 'body-palatal'],
  jaw: ['wide', 'medium', 'narrow', 'closed'],
  velum: ['closed', 'open'],
  airflow: ['burst', 'continuous', 'nasal', 'lateral', 'trill', 'tap', 'none'],
};

test('mouth-motor: 33 sounds with values the diagrams know', () => {
  assert.equal(SOUNDS_PT.length, 33);
  assert.equal(new Set(SOUNDS_PT.map((s) => s.id)).size, SOUNDS_PT.length);
  const types = SOUND_TYPES.map((t) => t.id);
  for (const s of SOUNDS_PT) {
    assert.ok(types.includes(s.type), `${s.id}: type ${s.type}`);
    for (const [field, values] of Object.entries(MOUTH)) assert.ok(values.includes(s[field]), `${s.id}: ${field} ${s[field]}`);
    for (const f of ['tongueX', 'tongueY', 'tongueTipX', 'tongueTipY', 'lipRound', 'lipOpen']) assert.ok(s[f] >= 0 && s[f] <= 1, `${s.id}: ${f}`);
    assert.ok(Number.isInteger(s.exampleArasaac) && s.exampleArasaac > 0, s.id);
    assert.ok(s.symbol && s.ipa && s.exampleWord, s.id);
    assert.equal(s.velum === 'open', s.airflow === 'nasal', `${s.id}: open velum ⇔ nasal airflow`);
  }
  assert.deepEqual(count(SOUNDS_PT.map((s) => s.type)), { vowels: 12, stops: 6, fricatives: 7, nasals: 3, liquids: 3, glides: 2 });
});

test('mouth-motor: 16 pairs between existing sounds, with a known contrast', () => {
  const ids = new Set(SOUNDS_PT.map((s) => s.id));
  const contrasts = ['voicing', 'place', 'manner', 'height', 'nasality'].map((c) => `mouthMotor.pair.${c}`);
  assert.equal(SOUND_PAIRS_PT.length, 16);
  for (const p of SOUND_PAIRS_PT) {
    assert.ok(ids.has(p.a) && ids.has(p.b) && p.a !== p.b, `${p.a}/${p.b}`);
    assert.ok(contrasts.includes(p.contrastKey), p.contrastKey);
  }
});

// ── tongue-viewer ──
test('tongue-viewer: every position sits in exactly one level; sequences use known positions', () => {
  const ids = Object.keys(TONGUE_POSITIONS_PT);
  assert.equal(ids.length, 31);
  assert.deepEqual(SOUND_LEVELS_PT.map((l) => l.sounds.length), [7, 6, 7, 6, 5]);
  assert.deepEqual(SOUND_LEVELS_PT.flatMap((l) => l.sounds).sort(), [...ids].sort());
  assert.equal(PRACTICE_SEQUENCES_PT.length, 6);
  for (const seq of PRACTICE_SEQUENCES_PT) {
    for (const s of seq.sounds) assert.ok(ids.includes(s), `${seq.id}: ${s}`);
    assert.equal(seq.say?.length, seq.sounds.length, seq.id);
    assert.ok(seq.say.some(Boolean), seq.id);
  }
});

test('tongue-viewer: positions are drawable', () => {
  const contacts = ['alveolar', 'velar', 'bilabial', 'labiodental', 'palatal', 'retroflex', 'postalveolar'];
  const lips = ['open-wide', 'open', 'neutral', 'rounded', 'spread', 'closed'];
  for (const [id, p] of Object.entries(TONGUE_POSITIONS_PT)) {
    for (const k of ['tip', 'body', 'root']) for (const v of p[k]) assert.ok(v >= 0 && v <= 1, `${id}.${k}`);
    assert.ok(['open', 'closed'].includes(p.velum), id);
    assert.ok(lips.includes(p.lips), `${id}: lips ${p.lips}`);
    if (p.contact) assert.ok(contacts.includes(p.contact), `${id}: contact ${p.contact}`);
    if (p.airflow) assert.ok(['groove', 'central', 'lateral'].includes(p.airflow), `${id}: airflow ${p.airflow}`);
    assert.equal(p.vibrate, undefined, `${id}: the pt tap is not drawn as a trill`);
    assert.ok(p.label && p.ipa && p.example, id);
  }
});

// ── letter-journey ──
const LJ_SAY = { ...PHONEME_SAY_PT, ...LETTER_SAY_PT };
const spoken = (s) => LJ_SAY[s.toLowerCase()] ?? s.toLowerCase();

test('letter-journey: the 26 letters A–Z', () => {
  assert.equal(LETTERS_PT.map((l) => l.letter).join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  for (const l of LETTERS_PT) {
    assert.ok(l.name && l.cue && l.mouth, l.letter);
    assert.ok(l.explore.endsWith('.'), l.letter);
  }
  assert.deepEqual(LETTERS_PT.filter((l) => l.noTarget).map((l) => l.letter), ['H', 'K', 'Q', 'W', 'Y']);
  assert.equal(LETTERS_PT.find((l) => l.letter === 'H').sound, '');
});

test('letter-journey: "Find the letter" targets all sound different; same-sound groups', () => {
  const targets = LETTERS_PT.filter((l) => !l.noTarget).map((l) => spoken(l.sound));
  assert.equal(new Set(targets).size, targets.length);
  const by = (x) => spoken(LETTERS_PT.find((l) => l.letter === x).sound);
  assert.equal(by('C'), by('K'));
  assert.equal(by('K'), by('Q'));
  assert.equal(by('I'), by('Y'));
  assert.equal(by('U'), by('W'));
});

// [regra, descrição, deve casar?]
const WORD_RULES = [
  [/^[A-Z]+$/, 'só letras maiúsculas sem acento', true],
  [/[HKQWXY]/, 'h, k, q, w, x, y'],
  [/CH|LH|NH|RR|SS|QU|GU/, 'dígrafo'],
  [/[CG](?![AOUL])/, 'c/g antes de e/i ou de consoante'],
  [/[AEIOU]S[AEIOU]/, 's entre vogais'],
  [/.R/, 'r fora do início'],
  [/[MNL](?![AEIOU])/, 'm/n/l sem vogal depois'],
  [/[TD][EI]/, 't/d antes de e/i'],
];

test('letter-journey: words follow the letter-sound rules', () => {
  const all = [...WORDS_PT[1], ...WORDS_PT[2], ...WORDS_PT[3]];
  assert.deepEqual([WORDS_PT[1].length, WORDS_PT[2].length, WORDS_PT[3].length], [12, 9, 8]);
  for (const w of all) {
    for (const [re, rule, mustMatch] of WORD_RULES) assert.equal(re.test(w.word), !!mustMatch, `${w.word}: ${rule}`);
    assert.equal(w.syllables.join(''), w.word, w.word);
    assert.ok(w.stress >= 0 && w.stress < w.syllables.length, w.word);
    assert.ok(w.icon && !w.hint, w.word);
  }
  for (const w of WORDS_PT[1]) {
    assert.equal(w.syllables.length, 2, w.word);
    assert.match(w.word, /[AU]$/, w.word);
  }
  for (const w of WORDS_PT[3]) assert.equal(w.syllables.length, 3, w.word);
  assert.equal(new Set(all.map((w) => w.word)).size, all.length);
});

test('letter-journey: CV/VC lists', () => {
  const abc = LETTERS_PT.map((l) => l.letter);
  assert.deepEqual(CV_VOWELS_PT, ['A', 'E', 'I', 'O', 'U']);
  for (const c of [...CV_CONSONANTS_PT, ...VC_CONSONANTS_PT]) assert.ok(abc.includes(c), c);
  for (const c of ['C', 'G', 'H', 'K', 'Q', 'W', 'X', 'Y']) assert.ok(!CV_CONSONANTS_PT.includes(c), c);
  assert.deepEqual(VC_CONSONANTS_PT, ['L', 'M', 'N', 'R', 'S']);
});

// ── prompt-guide ──
test('prompt-guide: 19 sounds with valid cues', () => {
  assert.equal(PROMPT_PT.length, 19);
  assert.equal(new Set(PROMPT_PT.map((s) => s.sound)).size, PROMPT_PT.length);
  const cats = CATEGORIES_PT.map((c) => c.id);
  for (const s of PROMPT_PT) {
    assert.ok(cats.includes(s.category), `${s.sound}: ${s.category}`);
    assert.ok(s.touchZone in TOUCH_ZONES, `${s.sound}: ${s.touchZone}`);
    if (s.touchZoneSecondary) assert.ok(s.touchZoneSecondary in TOUCH_ZONES, s.sound);
    assert.ok(s.direction in DIRECTION_ANGLES, s.sound);
    assert.ok(s.pressure in PRESSURE_LEVELS, s.sound);
    assert.ok(s.duration in DURATION_TYPES, s.sound);
    assert.equal(s.steps.length, 4, s.sound);
    assert.ok(s.description.length > 20, s.sound);
    assert.ok(Number.isInteger(s.arasaacId) && s.arasaacId > 0, s.sound);
  }
  for (const c of cats) assert.ok(PROMPT_PT.some((s) => s.category === c), c);
  assert.deepEqual(PROMPT_PT.filter((s) => s.analogy).map((s) => s.sound).sort(), ['ch', 'j', 'lh', 'nh', 'r', 'rr', 'z']);
});

// ── prosody-trainer ──
test('prosody-trainer: stress words', () => {
  const { twoSyllableWords: two, threeSyllableWords: three } = PROSODY_PT;
  for (const [list, n] of [[two, 2], [three, 3]]) {
    assert.equal(list.length, 10);
    for (const w of list) {
      assert.equal(w.syllables.length, n, w.word);
      assert.equal(w.syllables.join(''), w.word, w.word);
      assert.ok(w.stress >= 0 && w.stress < n, w.word);
    }
  }
  assert.deepEqual(count(two.map((w) => w.stress)), { 0: 5, 1: 5 });
  assert.deepEqual(count(three.map((w) => w.stress)), { 0: 3, 1: 4, 2: 3 });
});

const END = { statement: '.', question: '?', exclamation: '!' };

test('prosody-trainer: sentences, contours and rhythm', () => {
  const { intonationSentences, emotionData, rhythmPatterns, fullSentences } = PROSODY_PT;
  assert.deepEqual(count(intonationSentences.map((s) => s.type)), { statement: 3, question: 3, exclamation: 3 });
  for (const s of [...intonationSentences, ...fullSentences]) assert.ok(s.text.endsWith(END[s.type]), s.text);
  const pairs = [[intonationSentences, PROSODY_SV.intonationSentences], [emotionData, PROSODY_SV.emotionData], [fullSentences, PROSODY_SV.fullSentences]];
  for (const [pt, sv] of pairs) {
    for (const s of pt) {
      const label = s.text ?? s.sentence;
      assert.equal(s.contour.length, sv[0].contour.length, label);
      for (const v of s.contour) assert.ok(v >= 0 && v <= 100, label);
    }
  }
  assert.deepEqual(emotionData.map((e) => e.emotion), PROSODY_SV.emotionData.map((e) => e.emotion));
  assert.equal(fullSentences.length, 5);
  assert.equal(rhythmPatterns.length, 6);
  for (const r of rhythmPatterns) {
    assert.equal(r.beats.length, r.pattern.length, r.text);
    r.pattern.forEach((p, i) => assert.equal(r.beats[i], p === 'DA', r.text));
    assert.equal(r.syllables.length, r.pattern.length, r.text);
    assert.equal(r.syllables.join(''), letters(r.text), r.text);
  }
});

// ── melody-therapy ──
test('melody-therapy: 17 phrases, one note per syllable, two-pitch rule', () => {
  assert.equal(PHRASES_PT.length, 17);
  assert.equal(new Set(PHRASES_PT.map((p) => p.id)).size, PHRASES_PT.length);
  const svIds = new Set(PHRASES_SV.map((p) => p.id));
  const cats = MIT_CATEGORIES.map((c) => c.id);
  for (const p of PHRASES_PT) {
    assert.ok(!svIds.has(p.id), `${p.id} collides with a Swedish id (mit-progress)`);
    assert.ok(cats.includes(p.category), p.id);
    assert.equal(p.melody.length, p.syllables.length, p.id);
    for (const n of p.melody) assert.ok(n.note in NOTE_FREQ && n.duration > 0, p.id);
    assert.equal(p.syllables.join(''), letters(p.text), p.id);
    const top = p.melody[p.stress];
    p.melody.forEach((n, i) => {
      if (i === p.stress) return;
      assert.ok(NOTE_FREQ[n.note] < NOTE_FREQ[top.note], `${p.id}: note ${i}`);
      assert.ok(n.duration <= top.duration, `${p.id}: duration ${i}`);
    });
  }
  for (const c of cats) assert.ok(PHRASES_PT.some((p) => p.category === c), c);
});

// ── spoken-form maps ──
test('spoken-form maps have no orphan entries', () => {
  const phonemeTexts = new Set([
    ...SOUNDS_PT.map((s) => s.symbol),
    ...PROMPT_PT.map((s) => s.sound),
    ...LETTERS_PT.map((l) => l.sound),
  ]);
  for (const k of Object.keys(PHONEME_SAY_PT)) assert.ok(phonemeTexts.has(k), `PHONEME_SAY_PT.${k} is never spoken`);
  const ljTexts = new Set([
    ...LETTERS_PT.map((l) => l.sound),
    ...CV_CONSONANTS_PT.flatMap((c) => CV_VOWELS_PT.map((v) => c + v)),
    ...VC_CONSONANTS_PT.flatMap((c) => CV_VOWELS_PT.map((v) => v + c)),
    ...[1, 2, 3].flatMap((n) => WORDS_PT[n].flatMap((w) => [w.word, ...w.syllables])),
  ].map((s) => s.toLowerCase()));
  for (const k of Object.keys(LETTER_SAY_PT)) assert.ok(ljTexts.has(k), `letter-journey SAY_PT.${k} is never spoken`);
});
