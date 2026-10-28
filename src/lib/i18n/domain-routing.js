const DOMAIN_HOSTS = Object.freeze({
	sv: 'autismappar.se',
	en: 'autismapps.online'
});

/**
 * Return the canonical language-domain URL when a ready, domain-backed locale
 * is selected from either production domain. Local development and locales
 * without their own domain stay on the current origin.
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
	if (!isProductionDomain || hostname === targetHost) return null;

	url.protocol = 'https:';
	url.host = targetHost;
	return url.toString();
}
