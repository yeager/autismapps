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
 * Notify when a worker has installed over an existing active worker. Check
 * workers that were already installing or waiting before the listener was
 * attached; a page opened during an update can otherwise miss `updatefound`.
 * @param {Pick<ServiceWorkerRegistration, 'active' | 'installing' | 'waiting' | 'addEventListener' | 'removeEventListener'>} registration
 * @param {() => void} onUpdateReady
 */
export function watchForServiceWorkerUpdate(registration, onUpdateReady) {
	let disposed = false;
	let notified = false;
	const watchedWorkers = new Map();

	function notifyUpdateReady() {
		if (disposed || notified || !registration.active) return;
		notified = true;
		onUpdateReady();
	}

	/** @param {ServiceWorker | null} worker */
	function watchInstallingWorker(worker) {
		if (!worker || !registration.active || watchedWorkers.has(worker)) return;

		const handleStateChange = () => {
			if (worker.state !== 'installed') return;
			worker.removeEventListener('statechange', handleStateChange);
			watchedWorkers.delete(worker);
			notifyUpdateReady();
		};

		watchedWorkers.set(worker, handleStateChange);
		worker.addEventListener('statechange', handleStateChange);
		// The worker may have reached `installed` before this listener was added.
		handleStateChange();
	}

	function handleUpdateFound() {
		watchInstallingWorker(registration.installing);
	}

	registration.addEventListener('updatefound', handleUpdateFound);
	if (registration.waiting && registration.active) notifyUpdateReady();
	else watchInstallingWorker(registration.installing);

	return () => {
		disposed = true;
		registration.removeEventListener('updatefound', handleUpdateFound);
		for (const [worker, listener] of watchedWorkers) worker.removeEventListener('statechange', listener);
		watchedWorkers.clear();
	};
}
