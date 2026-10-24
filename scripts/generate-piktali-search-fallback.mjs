import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'static/piktali-pictograms/manifest.json');
const outputPath = path.join(root, 'src/lib/piktali/search-fallback.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (!Array.isArray(manifest.pictograms)) throw new Error('Piktali manifest has no pictograms array');

const pictograms = manifest.pictograms.map(({ id, symbol, labels, file }) => {
  if (!id || !symbol || !labels || !file) throw new Error(`Invalid Piktali pictogram: ${symbol ?? id ?? 'unknown'}`);
  return { id, symbol, labels, file };
});

fs.writeFileSync(outputPath, `${JSON.stringify({ pictograms })}\n`);
console.log(`Wrote a local search fallback for ${pictograms.length} Piktali pictograms.`);
