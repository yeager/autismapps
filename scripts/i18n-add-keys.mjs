#!/usr/bin/env node
// Adds new keys to the flat i18n dictionaries while preserving their exact format
// (CRLF/LF, 2-space indent, trailing-newline or not).
// Usage: node scripts/i18n-add-keys.mjs <keys.json> [--force]
// keys.json: { "some.key": { "en": "...", "sv": "...", "pt_BR": "..." } }
// - en and sv are required for every key; pt_BR is required for every key when pt_BR.json exists.
// - Every locale value present (en, sv, pt_BR) must be a string.
// - Refuses to overwrite an existing key unless --force.
// - A file that would receive 0 keys is left untouched (not re-saved).
// - Two-pass: everything is validated across ALL files first; nothing is written on any problem.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LANGS = ['en', 'sv', 'pt_BR'];

const args = process.argv.slice(2);
const force = args.includes('--force');
const inputPath = args.find((a) => !a.startsWith('--'));
if (!inputPath) { console.error('usage: i18n-add-keys.mjs <keys.json> [--force]'); process.exit(2); }
const input = JSON.parse(readFileSync(inputPath, 'utf8'));
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = `${ROOT}src/lib/i18n/messages`;

function load(path) {
  const raw = readFileSync(path, 'utf8');
  return { path, data: JSON.parse(raw), crlf: raw.includes('\r\n'), finalNl: /\r?\n$/.test(raw) };
}
function save(f) {
  let out = JSON.stringify(f.data, null, 2);
  if (f.crlf) out = out.replace(/\n/g, '\r\n');
  if (f.finalNl) out += f.crlf ? '\r\n' : '\n';
  writeFileSync(f.path, out, 'utf8');
}

const files = {};
for (const lang of LANGS) {
  const path = `${DIR}/${lang}.json`;
  if (existsSync(path)) files[lang] = load(path);
}

const problems = [];
const validKeys = [];
for (const [key, vals] of Object.entries(input)) {
  if (!vals || typeof vals !== 'object' || Array.isArray(vals)) { problems.push(`${key}: value must be an object { en, sv, pt_BR }`); continue; }
  validKeys.push(key);
  if (vals.en === undefined || vals.sv === undefined) problems.push(`${key}: en and sv are required`);
  if (files.pt_BR && vals.pt_BR === undefined) problems.push(`${key}: pt_BR is required (pt_BR.json exists)`);
  for (const lang of LANGS) {
    if (vals[lang] !== undefined && typeof vals[lang] !== 'string') problems.push(`${key}: ${lang} must be a string (got ${typeof vals[lang]})`);
  }
}

for (const [lang, f] of Object.entries(files)) {
  for (const key of validKeys) {
    if (input[key][lang] === undefined) continue;
    if (key in f.data && !force) problems.push(`${lang}: key exists: ${key} (use --force)`);
  }
}

if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`);
  console.error('Nothing was written.');
  process.exit(1);
}

for (const [lang, f] of Object.entries(files)) {
  let added = 0;
  for (const key of validKeys) {
    const val = input[key][lang];
    if (val === undefined) continue;
    f.data[key] = val;
    added++;
  }
  if (added === 0) { console.log(`- ${lang}.json: 0 keys, not saved`); continue; }
  save(f);
  console.log(`✓ ${lang}.json: ${added} key(s) written`);
}
