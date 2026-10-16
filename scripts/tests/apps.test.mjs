import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_APPS, isAvailableIn, isBlockedIn, NOT_ADAPTED_PT } from '../../src/lib/apps.ts';

const EXPECTED_PT_BLOCKED = [];

test('no app is blocked in pt_BR', () => {
  const blocked = [...new Set(ALL_APPS.filter((a) => !isAvailableIn(a, 'pt_BR')).map((a) => a.id))].sort();
  assert.deepEqual(blocked, [...EXPECTED_PT_BLOCKED].sort());
  assert.deepEqual([...NOT_ADAPTED_PT].sort(), [...EXPECTED_PT_BLOCKED].sort());
});

test('nothing ready is blocked in sv or en', () => {
  assert.equal(ALL_APPS.filter((a) => a.ready && !isAvailableIn(a, 'sv')).length, 0);
  assert.equal(ALL_APPS.filter((a) => a.ready && !isAvailableIn(a, 'en')).length, 0);
});

test('not-ready apps are unavailable everywhere; unavailableIn only affects its locales', () => {
  assert.equal(isAvailableIn({ ...ALL_APPS[0], ready: false }, 'sv'), false);
  assert.equal(isAvailableIn({ ...ALL_APPS[0], ready: true, unavailableIn: ['pt_BR'] }, 'sv'), true);
  assert.equal(isAvailableIn({ ...ALL_APPS[0], ready: true, unavailableIn: ['pt_BR'] }, 'pt_BR'), false);
});

test('isBlockedIn only looks at the locale, never at ready', () => {
  const { unavailableIn, ...base } = ALL_APPS[0];
  const ptApp = { ...base, unavailableIn: ['pt_BR'] };
  assert.equal(isBlockedIn(ptApp, 'pt_BR'), true);
  assert.equal(isBlockedIn(ptApp, 'sv'), false);
  assert.equal(isBlockedIn({ ...base, ready: false }, 'pt_BR'), false);
  assert.equal(isBlockedIn({ ...base, ready: false }, 'sv'), false);
});

test('every blocked id exists in the registry', () => {
  for (const id of EXPECTED_PT_BLOCKED) assert.ok(ALL_APPS.some((a) => a.id === id), id);
});
