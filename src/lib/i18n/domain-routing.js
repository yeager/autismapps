const DOMAIN_HOSTS = Object.freeze({
	sv: 'autismappar.se',
	en: 'autismapps.online'
});

/**
 * Return the canonical language-domain URL when a domain-backed locale is
 * selected from either production domain. Carry the selected locale in the URL
 * so saved choices on the target origin cannot override it. Local development
 * and locales without their own domain stay on the current origin.
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
	if (hostname === targetHost && !hadLocaleOverride) return null;

	url.protocol = 'https:';
	url.host = targetHost;
	// Carry the user's explicit choice across origins. Each domain has its own
	// localStorage, which may contain a different previously selected language.
	url.searchParams.set('locale', locale);
	return url.toString();
}

/**
 * Resolve a temporary locale query without letting an app override the
 * language domain. pt_BR has no dedicated domain; sv and en must match theirs.
 *
 * @param {string | null} value
 * @param {string | null} domainLocale
 * @returns {string | null}
 */
export function requestedLocaleFromParam(value, domainLocale) {
	const locale = value === 'pt-BR' ? 'pt_BR' : value;
	if (locale === 'pt_BR') return locale;
	return (locale === 'sv' || locale === 'en') && locale === domainLocale ? locale : null;
}
