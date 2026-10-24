import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fillPt, capitalizeSentences, PT_TOKEN } from '../../src/lib/sagostunden/grammar-pt.ts';
import { ALL_WORDS, wordLabel, wordPicto } from '../../src/lib/sagostunden/words.ts';
import { TEMPLATES } from '../../src/lib/sagostunden/templates.ts';

const SLOT_CATEGORY = { DJUR: 'djur', PLATS: 'platser', SAK: 'saker', MAT: 'mat', PERSON: 'personer', VERB: 'verb' };

const M = { text: 'gato', gender: 'm' };
const F = { text: 'vaca', gender: 'f' };

test('articles and contractions follow the gender', () => {
  const cases = [
    ['{o_X}', 'o gato', 'a vaca'], ['{um_X}', 'um gato', 'uma vaca'], ['{no_X}', 'no gato', 'na vaca'],
    ['{do_X}', 'do gato', 'da vaca'], ['{ao_X}', 'ao gato', 'à vaca'], ['{pelo_X}', 'pelo gato', 'pela vaca'],
    ['{seu_X}', 'seu gato', 'sua vaca'], ['{este_X}', 'este gato', 'esta vaca'], ['{X}', 'gato', 'vaca'],
  ];
  for (const [token, m, f] of cases) {
    assert.equal(fillPt(`x ${token}`, { X: M }), `X ${m}`, token);
    assert.equal(fillPt(`x ${token}`, { X: F }), `X ${f}`, token);
  }
});

test('gender choice picks by the slot, and by all slots for plurals', () => {
  assert.equal(fillPt('ficou {X|cansado|cansada}', { X: M }), 'Ficou cansado');
  assert.equal(fillPt('ficou {X|cansado|cansada}', { X: F }), 'Ficou cansada');
  assert.equal(fillPt('{A+B|juntos|juntas}', { A: F, B: M }), 'Juntos');
  assert.equal(fillPt('{A+B|juntos|juntas}', { A: F, B: F }), 'Juntas');
});

test('sentences start with a capital, but not after a closing quote', () => {
  assert.equal(capitalizeSentences('era uma vez. o gato pulou! e riu? sim.'), 'Era uma vez. O gato pulou! E riu? Sim.');
  assert.equal(capitalizeSentences('"oi!" disse a vaca. "tudo bem?" perguntou.'), '"Oi!" disse a vaca. "tudo bem?" perguntou.');
  assert.equal(capitalizeSentences('"este livro"'), '"Este livro"');
});

test('unknown slots stay visible so the data tests catch them', () => {
  assert.equal(fillPt('{o_NADA}', { X: M }), '{o_NADA}');
});

test('the token pattern recognises every form', () => {
  const found = '{X} {o_X} {um_X} {no_X} {do_X} {ao_X} {pelo_X} {seu_X} {este_X} {X|a|b} {X+Y|a|b}'.match(PT_TOKEN);
  assert.equal(found.length, 11);
});

test('every word has a pt-BR form; nouns have a gender, verbs do not', () => {
  for (const w of ALL_WORDS) {
    assert.ok(w.pt_BR && w.pt_BR.text, `${w.id}: no pt_BR`);
    assert.equal(w.pt_BR.text, w.pt_BR.text.normalize('NFC'), w.id);
    assert.doesNotMatch(w.pt_BR.text, /[åäö]/i, w.id);
    if (w.category === 'verb') assert.equal(w.pt_BR.gender, undefined, `${w.id}: verbs take no gender`);
    else assert.ok(['m', 'f'].includes(w.pt_BR.gender), `${w.id}: missing gender`);
  }
  for (const cat of Object.values(SLOT_CATEGORY)) {
    const texts = ALL_WORDS.filter((w) => w.category === cat).map((w) => w.pt_BR.text);
    assert.equal(new Set(texts).size, texts.length, `${cat}: repeated pt word`);
  }
  const ids = ALL_WORDS.map((w) => wordPicto(w, 'pt_BR'));
  assert.equal(new Set(ids).size, ids.length, 'two pt words share a pictogram');
});

test('labels and pictograms follow the story language', () => {
  const sjorovare = ALL_WORDS.find((w) => w.id === 'sjörövare');
  assert.equal(wordLabel(sjorovare, 'sv'), 'sjörövare');
  assert.equal(wordLabel(sjorovare, 'pt_BR'), 'capitão');
  assert.equal(wordPicto(sjorovare, 'sv'), 6180);
  assert.equal(wordPicto(sjorovare, 'pt_BR'), 24937);
});

test('every template has localized titles and five Portuguese paragraphs with valid tokens', () => {
  assert.equal(TEMPLATES.length, 25);
  for (const t of TEMPLATES) {
    assert.ok(t.title.sv && t.title.en && t.title.pt_BR, `${t.id}: localized titles`);
    assert.equal(t.paragraphs.pt_BR.length, t.paragraphs.sv.length, `${t.id}: paragraph count`);
    for (const p of t.paragraphs.pt_BR) {
      const braces = p.match(/\{[^}]*\}/g) ?? [];
      const tokens = p.match(PT_TOKEN) ?? [];
      assert.equal(tokens.length, braces.length, `${t.id}: unknown token in "${p}"`);
      for (const token of tokens) {
        const [, form, names, masc] = new RegExp(PT_TOKEN.source).exec(token);
        for (const name of names.split('+')) assert.ok(t.slots.includes(name), `${t.id}: ${token} uses an undeclared slot`);
        if (names === 'VERB') assert.ok(!form && masc === undefined, `${t.id}: ${token} — VERB takes no article or gender`);
      }
      assert.doesNotMatch(p, /\b(em|de|a|por) \{o_/, `${t.id}: needs a contraction (no/do/ao/pelo) in "${p}"`);
    }
  }
});

test('every template renders cleanly with every word of every slot', () => {
  const byCat = (cat) => ALL_WORDS.filter((w) => w.category === cat);
  const slotOf = (w) => ({ text: w.pt_BR.text, gender: w.pt_BR.gender });
  let renders = 0;
  for (const t of TEMPLATES) {
    const base = Object.fromEntries(t.slots.map((s) => [s, slotOf(byCat(SLOT_CATEGORY[s])[0])]));
    for (const slot of t.slots) {
      for (const w of byCat(SLOT_CATEGORY[slot])) {
        const slots = { ...base, [slot]: slotOf(w) };
        for (const p of t.paragraphs.pt_BR) {
          const out = fillPt(p, slots);
          renders++;
          assert.doesNotMatch(out, /[{}]/, `${t.id}: leftover token in "${out}"`);
          assert.doesNotMatch(out, / {2}| [,.!?]/, `${t.id}: bad spacing in "${out}"`);
          assert.match(out, /^["“]?\p{Lu}/u, `${t.id}: lowercase start in "${out}"`);
        }
      }
    }
  }
  assert.ok(renders > 2500, `only ${renders} renders`);
});
