/**
 * Request a service worker update without disturbing the current page.
 * @param {Pick<ServiceWorkerContainer, 'getRegistration'> | null | undefined} container
 * @param {boolean} online
 */
export async function requestServiceWorkerUpdate(container, online) {
	if (!container || !online) return false;
	const registration = await container.getRegistration();
	if (!registration) return false;
	await registration.update();
	return true;
}
