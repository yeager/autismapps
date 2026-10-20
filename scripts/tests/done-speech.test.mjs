import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const messages = (lang) => JSON.parse(read(`src/lib/i18n/messages/${lang}.json`));

test('en and sv keep the old spoken text; pt_BR says "selecionado" instead of the emoji', () => {
  // The emoji was read aloud by its name ("marca caixa de seleção branca"); only pt_BR was changed
  assert.equal(messages('en')['common.doneSpeech'], '{item} ✅');
  assert.equal(messages('sv')['common.doneSpeech'], '{item} ✅');
  const pt = messages('pt_BR')['common.doneSpeech'];
  assert.equal(pt, '{item}... selecionado');
  assert.ok(!pt.includes('✅'));
});

for (const app of ['day-planner', 'my-schedule']) {
  test(`${app} speaks a done item through common.doneSpeech, not with a hard-coded emoji`, () => {
    const src = read(`src/routes/apps/${app}/+page.svelte`);
    assert.match(src, /speak\(\$t\('common\.doneSpeech', \{ item: /);
    assert.doesNotMatch(src, /speak\(.*✅/);
  });
}
