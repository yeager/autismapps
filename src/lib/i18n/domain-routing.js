const DOMAIN_HOSTS = Object.freeze({
	sv: 'autismappar.se',
	en: 'autismapps.online'
});

/**
 * Return the canonical language-domain URL when a ready, domain-backed locale
 * is selected from either production domain. Remove any explicit locale query
 * override so the selected domain's default language can take effect. Local
 * development and locales without their own domain stay on the current origin.
 *
 * @param {string} locale
 * @param {string | URL} currentUrl
 * @returns {string | null}
 */
export function getLocaleDomainRedirect(locale, currentUrl) {
	const targetHost = locale === 'sv' || locale === 'en' ? DOMAIN_HOSTS[locale] : null;
	if (!targetHost) return null;

	const url = new URL(currentUrl);
	const hostname = url.hostname.toLowerCase();
	const isProductionDomain = Object.values(DOMAIN_HOSTS).some(
		(host) => hostname === host || hostname.endsWith(`.${host}`)
	);
	if (!isProductionDomain) return null;

	const hadLocaleOverride = url.searchParams.has('locale');
	url.searchParams.delete('locale');
	if (hostname === targetHost && !hadLocaleOverride) return null;

	url.protocol = 'https:';
	url.host = targetHost;
	return url.toString();
}
