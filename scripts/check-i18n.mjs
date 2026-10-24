#!/usr/bin/env node
// Validates pt_BR (and sv) dictionaries against en.
// Usage: node scripts/check-i18n.mjs            → checks all known dictionary pairs
//        node scripts/check-i18n.mjs --strict   → also fails on "same" and "long" warnings
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

export function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object') flatten(v, key, out);
    else out[key] = v ?? '';
  }
  return out;
}

export function placeholders(s) {
  return [...String(s).matchAll(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g)].map((m) => m[0]).sort((a, b) => (a.slice(1, -1) < b.slice(1, -1) ? -1 : a === b ? 0 : 1));
}

const isOnlySymbols = (s) => !/\p{L}{2,}/u.test(s); // emoji, numbers, punctuation

export function compareDicts(src, tgt, { allowSame = [], maxRatio = 1.6, minLen = 12 } = {}) {
  const S = flatten(src), T = flatten(tgt);
  const r = { missing: [], extra: [], placeholderMismatch: [], empty: [], same: [], long: [] };
  for (const k of Object.keys(S)) {
    if (!(k in T)) { r.missing.push(k); continue; }
    const s = String(S[k]), t = String(T[k]);
    if (t.trim() === '') r.empty.push(k);
    if (placeholders(s).join() !== placeholders(t).join()) r.placeholderMismatch.push(k);
    if (s === t && !isOnlySymbols(s) && !allowSame.includes(s)) r.same.push(k);
    if (s.length >= minLen && t.length > s.length * maxRatio) r.long.push(k);
  }
  for (const k of Object.keys(T)) if (!(k in S)) r.extra.push(k);
  return r;
}

// Values that are legitimately identical across languages
export const ALLOW_SAME = [
  'PECS®', 'PECS', 'TEACCH', 'ARASAAC', 'Autismappar', 'Autismapps', 'Talking Mats™', 'LAMP', 'Piper', 'Web Speech API',
  'OK', 'Ok', 'TTS', 'CC BY-NC-SA 4.0', 'CC BY-NC-SA 3.0', 'PROMPT', 'DTTC', 'ReST', 'MIT', 'TAKK', 'Bildstöd',
  // pt_BR: words spelled identically in Portuguese, syllables and units
  'Normal', 'min', 'Social', 'Timer', 'Quiz', 'Total:', 'Piano', 'apps', 'Diploma', 'Diplomas', 'Tempo', 'BPM',
  'Nasal', 'Volume', '{seconds}s', 'banana', 'bananas', 'Banana', 'pizza', 'Pizza', 'hospital', 'Hospital',
  'Ma', 'Pa', 'Ba', 'Mo', 'So', 'Da', 'Na', 'La',
  // pt_BR: tongue-viewer drill sequences (Swedish phonology, app not yet adapted for pt_BR)
  'ba-da-ga', 'pa-ta-ka', 'ma-na-nga', 'la-ra', 'si-sji-tji', 'rt-rd-rn-rl',
];

// pre-existing unused keys in sv.json; kept to leave Swedish untouched
export const KNOWN_EXTRA = ['letter.word.cat2'];

export const filterKnown = (list, known) => list.filter((k) => !known.includes(k));

const PAIRS = [
  ['src/lib/i18n/messages/en.json', 'src/lib/i18n/messages/sv.json', false],
  ['src/lib/i18n/messages/en.json', 'src/lib/i18n/messages/pt_BR.json', true],
  ['src/lib/data/i18n-en.json', 'src/lib/data/i18n-sv.json', false],
  ['src/lib/data/i18n-en.json', 'src/lib/data/i18n-pt_BR.json', true],
];

function main() {
  const strict = process.argv.includes('--strict');
  let failed = false;
  for (const [srcPath, tgtPath, checkSame] of PAIRS) {
    if (!existsSync(`${ROOT}${srcPath}`)) { console.log(`✗ ${srcPath}: arquivo de origem não existe`); failed = true; continue; }
    if (!existsSync(`${ROOT}${tgtPath}`)) { console.log(`- ${tgtPath}: (não existe ainda, pulando)`); continue; }
    const r = compareDicts(JSON.parse(readFileSync(`${ROOT}${srcPath}`, 'utf8')), JSON.parse(readFileSync(`${ROOT}${tgtPath}`, 'utf8')), { allowSame: ALLOW_SAME });
    r.extra = filterKnown(r.extra, KNOWN_EXTRA);
    const hard = ['missing', 'extra', 'placeholderMismatch', 'empty'];
    const soft = checkSame ? ['same', 'long'] : ['long'];
    console.log(`\n== ${tgtPath} vs ${srcPath}`);
    for (const kind of [...hard, ...soft]) {
      if (r[kind].length === 0) continue;
      console.log(`  ${kind}: ${r[kind].length}`);
      for (const k of r[kind].slice(0, 40)) console.log(`    ${k}`);
      if (hard.includes(kind) || strict) failed = true;
    }
    if ([...hard, ...soft].every((k) => r[k].length === 0)) console.log('  OK');
  }
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
