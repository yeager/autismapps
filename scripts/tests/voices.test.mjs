import { test } from 'node:test';
import assert from 'node:assert/strict';
import { voicesForLang, VOICES_PT, DEFAULT_VOICE_PT, EXTRA_PATH_MAP, CUSTOM_VOICE_URLS, VOICES_SV, VOICES_EN, RETIRED_VOICES } from '../../src/lib/tts/voices.ts';

test('pt_BR gets the 3 Brazilian voices with cadu as default', () => {
  assert.deepEqual(voicesForLang('pt_BR').map((v) => v.id), [
    'pt_BR-faber-medium', 'pt_BR-cadu-medium', 'pt_BR-jeff-medium',
  ]);
  assert.equal(DEFAULT_VOICE_PT, 'pt_BR-cadu-medium');
});

test('retired voices are out of the lists but keep their PATH_MAP entry (to delete a downloaded copy)', () => {
  assert.deepEqual(RETIRED_VOICES, ['pt_BR-edresson-low']);
  for (const id of RETIRED_VOICES) {
    assert.ok(![...VOICES_SV, ...VOICES_EN, ...VOICES_PT].some((v) => v.id === id), id);
    assert.ok(EXTRA_PATH_MAP[id], id);
    assert.equal(CUSTOM_VOICE_URLS[id], undefined, id);
  }
});

test('sv and en voice lists are unchanged', () => {
  assert.equal(voicesForLang('sv'), VOICES_SV);
  assert.equal(voicesForLang('en'), VOICES_EN);
  assert.equal(voicesForLang('xx'), VOICES_EN);
});

test('every pt voice has a path-map entry and rhasspy download URLs', () => {
  for (const v of VOICES_PT) {
    assert.match(EXTRA_PATH_MAP[v.id], new RegExp(`^pt/pt_BR/.+/${v.id}\\.onnx$`));
    assert.match(CUSTOM_VOICE_URLS[v.id].model, /^https:\/\/huggingface\.co\/rhasspy\/piper-voices\/resolve\/main\/pt\/pt_BR\//);
    assert.ok(CUSTOM_VOICE_URLS[v.id].config.endsWith('.onnx.json'));
  }
});
