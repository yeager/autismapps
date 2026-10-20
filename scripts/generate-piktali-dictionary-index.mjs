import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'src/routes/apps/picture-dictionary/+page.svelte');
const manifestPath = path.join(root, 'static/piktali-pictograms/manifest.json');
const outputPath = path.join(root, 'src/lib/piktali/dictionary-files.ts');
const aliases = {
  'ice cream': 'icecream', jacket: 'coat', socks: 'sock', 't-shirt': 'shirt', tv: 'television', pen: 'pencil'
};
const page = fs.readFileSync(pagePath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const bySymbol = new Map(manifest.pictograms.map(({ symbol, file }) => [symbol, file]));
const words = [...page.matchAll(/\ben:\s*'([^']+)'/g)].map((match) => match[1]);
const files = {};
for (const word of words) {
  const file = bySymbol.get(aliases[word] ?? word);
  if (file) files[word] = file;
}
const source = `/** Generated from the shared Piktali manifest. Do not edit manually. */\nexport const dictionaryPictogramFiles: Record<string, string> = ${JSON.stringify(files, null, 2)};\n`;
fs.writeFileSync(outputPath, source);
console.log(`Indexed ${Object.keys(files).length} of ${words.length} picture-dictionary words.`);
