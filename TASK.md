# Current project status

This repository is the source for the Autismappar Swedish site and the Autismapps English site. `main` is the working branch. The launcher app registry in `src/lib/apps.ts` is the source of truth for available tools; the current catalogue contains 72 app routes.

## Current workflow

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Build and verify the two localized Loopia trees:

```sh
npm run build:loopia-app-pages
npm run build:launcher:domains
npm run verify:launcher:locales
npm run audit:links
npm run audit:app-cards
npm run audit:pictograms
npm run check
npm test
```

See [README.md](README.md) for the shared Loopia document root, the Swedish and English upload paths, and the requirement to include versioned search catalogs in partial uploads. Preserve the existing `.htaccess` files and unrelated server files.

## Quality gates

- Keep Swedish (`autismappar.se`) and English (`autismapps.online`) content and metadata localized.
- Verify app cards, routes, search catalogs, and pictogram mappings with the scripts above after changing them.
- Confirm search behavior in both localized builds when changing catalog loading or search code. Loopia may continue serving cached files after upload.
- Portuguese pronunciation content that needs speech-language specialist review must remain identified as awaiting review.
- Test the actual hosted site separately after deployment; successful local builds and GitHub Actions do not prove the Loopia copy is current.

## Current verified baseline

The current `main` build has 72 app routes and 5,003 Piktali manifest assets in each localized tree. The repository checks verify localized route metadata, internal launcher links, app card targets, catalog assets, and the six Traffic Safety card pictograms. Update this snapshot when those counts or checks change.
