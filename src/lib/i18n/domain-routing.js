/** @type {Readonly<Record<string, string>>} */
const DOMAIN_HOSTS = Object.freeze({
	sv: 'autismappar.se',
	en: 'autismapps.online',
	pt_BR: 'autismapps.online'
});

/**
 * Return the canonical language-domain URL when a ready locale is selected
 * from either production domain. Swedish uses autismappar.se; English and
 * Brazilian Portuguese use autismapps.online. Carry the selected locale in
 * the URL so saved choices on the target origin cannot override it. Local
 * development and unsupported locales stay on the current origin.
 *
 * @param {string} locale
 * @param {string | URL} currentUrl
 * @returns {string | null}
 */
export function getLocaleDomainRedirect(locale, currentUrl) {
	const targetHost = DOMAIN_HOSTS[locale] ?? null;
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
 * language domain. Brazilian Portuguese is allowed on the non-Swedish domain.
 *
 * @param {string | null} value
 * @param {string | null} domainLocale
 * @returns {string | null}
 */
export function requestedLocaleFromParam(value, domainLocale) {
	const locale = value === 'pt-BR' ? 'pt_BR' : value;
	if (locale === 'pt_BR') return domainLocale === 'sv' ? null : locale;
	return (locale === 'sv' || locale === 'en') && locale === domainLocale ? locale : null;
}

/**
 * Return a saved non-domain locale only when it is compatible with the current
 * host. The Swedish domain must not restore Brazilian Portuguese; the English
 * domain may restore it because all non-Swedish locales use autismapps.online.
 * Local development may restore any saved ready locale.
 *
 * @param {string | null} locale
 * @param {string | null} domainLocale
 * @returns {string | null}
 */
export function savedLocaleOverride(locale, domainLocale) {
	if (!locale) return null;
	if (!domainLocale) return locale;
	if (domainLocale === 'sv') return null;
	return locale === 'pt_BR' ? locale : null;
}
