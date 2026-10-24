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

/**
 * Notify only when a new worker installs over an existing active worker.
 * The first install also changes the page controller, but is not an update.
 * @param {Pick<ServiceWorkerRegistration, 'active' | 'installing' | 'addEventListener' | 'removeEventListener'>} registration
 * @param {() => void} onUpdateReady
 */
export function watchForServiceWorkerUpdate(registration, onUpdateReady) {
	function handleUpdateFound() {
		const installing = registration.installing;
		if (!installing || !registration.active) return;
		const worker = /** @type {ServiceWorker} */ (installing);

		function handleStateChange() {
			if (worker.state !== 'installed') return;
			worker.removeEventListener('statechange', handleStateChange);
			onUpdateReady();
		}

		worker.addEventListener('statechange', handleStateChange);
	}

	registration.addEventListener('updatefound', handleUpdateFound);
	return () => registration.removeEventListener('updatefound', handleUpdateFound);
}
