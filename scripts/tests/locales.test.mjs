import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCALES, READY_LOCALES, DEFAULT_LOCALE,
  getLocaleDef, detectLocale, isReadyLocale, pick
} from '../../src/lib/i18n/locales.ts';

test('ready locales are sv, en, pt_BR in that order', () => {
  assert.deepEqual(READY_LOCALES.map((l) => l.code), ['sv', 'en', 'pt_BR']);
});

test('pt_BR definition', () => {
  const pt = getLocaleDef('pt_BR');
  assert.equal(pt.bcp47, 'pt-BR');
  assert.equal(pt.arasaac, 'br');
  assert.equal(pt.flag, '🇧🇷');
  assert.equal(pt.ready, true);
});

test('sv and en keep their BCP-47 tags', () => {
  assert.equal(getLocaleDef('sv').bcp47, 'sv-SE');
  assert.equal(getLocaleDef('en').bcp47, 'en-US');
});

test('unknown locale falls back to en', () => {
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(getLocaleDef('xx').code, 'en');
});

test('detectLocale maps browser languages', () => {
  assert.equal(detectLocale('pt-BR'), 'pt_BR');
  assert.equal(detectLocale('pt-PT'), 'pt_BR');
  assert.equal(detectLocale('pt'), 'pt_BR');
  assert.equal(detectLocale('sv-SE'), 'sv');
  assert.equal(detectLocale('sv'), 'sv');
  assert.equal(detectLocale('en-GB'), 'en');
  assert.equal(detectLocale('de-DE'), 'en');
  assert.equal(detectLocale(''), 'en');
  assert.equal(detectLocale(undefined), 'en');
});

test('isReadyLocale', () => {
  assert.equal(isReadyLocale('pt_BR'), true);
  assert.equal(isReadyLocale('de'), false);
  assert.equal(isReadyLocale('xx'), false);
});

test('pick: exact, then en, then sv', () => {
  assert.equal(pick({ sv: 'hund', en: 'dog', pt_BR: 'cachorro' }, 'pt_BR'), 'cachorro');
  assert.equal(pick({ sv: 'hund', en: 'dog' }, 'pt_BR'), 'dog');
  assert.equal(pick({ sv: 'hund' }, 'pt_BR'), 'hund');
  assert.equal(pick({ sv: 'hund', en: 'dog' }, 'sv'), 'hund');
  assert.equal(pick({ sv: [1], pt_BR: [2] }, 'en')[0], 1);
});

test('all locale codes are unique', () => {
  const codes = LOCALES.map((l) => l.code);
  assert.equal(new Set(codes).size, codes.length);
});
