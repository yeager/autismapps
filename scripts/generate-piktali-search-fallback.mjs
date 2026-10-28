import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'static/piktali-pictograms/manifest.json');
const outputPath = path.join(root, 'src/lib/piktali/search-fallback.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (!Array.isArray(manifest.pictograms)) throw new Error('Piktali manifest has no pictograms array');

const approved = manifest.pictograms.filter(({ pictogramStatus, review }) => pictogramStatus === 'approved'
	&& review?.translation === 'approved'
	&& review?.aacUsability === 'approved'
	&& review?.pictogram === 'approved'
	&& review?.commercialRights === 'approved');
if (!approved.length) throw new Error('Piktali manifest has no fully reviewed production pictograms');

	const pictograms = approved.map(({ id, symbol, labels, file, pictogramStatus, review }) => {
  if (!id || !symbol || !labels || !file) throw new Error(`Invalid Piktali pictogram: ${symbol ?? id ?? 'unknown'}`);
	return {
		id,
		symbol,
		labels,
		file,
		pictogramStatus,
		review: {
			translation: review.translation,
			aacUsability: review.aacUsability,
			pictogram: review.pictogram,
			commercialRights: review.commercialRights
		}
	};
});

fs.writeFileSync(outputPath, `${JSON.stringify({ pictograms })}\n`);
console.log(`Wrote a local search fallback for ${pictograms.length} fully reviewed Piktali pictograms.`);
