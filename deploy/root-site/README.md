# Public site root pages

These two landing pages are served from the shared Loopia `public_html` root:

- `index.html` for `autismappar.se`
- `index-en.html` for `autismapps.online`

The root `index.php` selects the language-specific file. Keep both copies in sync when changing the shared homepage, and upload only the changed page files. App instructions and printable materials live in the localized launcher at `/launcher/instruktioner/` and `/launcher/material/`.

Legacy pages link to `/instruktioner.html` and `/material.html`. Keep the root aliases with these landing pages so those old links continue to reach the localized launcher pages.

The shared root rewrite configuration is tracked in `.htaccess`. Upload it as `public_html/.htaccess` when changed. On `autismappar.se`, legacy `/launcher/…` URLs redirect to the Swedish build at `/launcher-sv/…`, so the URL base matches the prerendered SvelteKit files. `autismapps.online` continues to use `/launcher/`.
