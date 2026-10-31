# Public site root pages

These two landing pages are served from the shared Loopia `public_html` root:

- `index.html` for `autismappar.se`
- `index-en.html` for `autismapps.online`

The root `index.php` selects the language-specific file. Keep both copies in sync when changing the shared homepage, and upload only the changed page files. App instructions and printable materials live in the localized launcher at `/launcher/instruktioner/` and `/launcher/material/`.

Legacy pages link to `/instruktioner.html` and `/material.html`. Keep the root aliases with these landing pages so those old links continue to reach the localized launcher pages.
