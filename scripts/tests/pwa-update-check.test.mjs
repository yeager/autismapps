import test from 'node:test';
import assert from 'node:assert/strict';
import { requestServiceWorkerUpdate, watchForServiceWorkerUpdate } from '../../src/lib/pwa/update-check.js';

class FakeEventTarget {
	listeners = new Map();

	addEventListener(type, listener) {
		const listeners = this.listeners.get(type) ?? new Set();
		listeners.add(listener);
		this.listeners.set(type, listeners);
	}

	removeEventListener(type, listener) {
		this.listeners.get(type)?.delete(listener);
	}

	dispatch(type) {
		for (const listener of this.listeners.get(type) ?? []) listener();
	}
}

test('does not request an update while offline', async () => {
	let requested = false;
	const container = { getRegistration: async () => { requested = true; return null; } };

	assert.equal(await requestServiceWorkerUpdate(container, false), false);
	assert.equal(requested, false);
});

test('does nothing when the app has no service worker registration', async () => {
	const container = { getRegistration: async () => undefined };

	assert.equal(await requestServiceWorkerUpdate(container, true), false);
});

test('checks the registered service worker for an update', async () => {
	let updates = 0;
	const container = {
		getRegistration: async () => ({ update: async () => { updates += 1; } })
	};

	assert.equal(await requestServiceWorkerUpdate(container, true), true);
	assert.equal(updates, 1);
});

test('does not offer a reload when the first service worker installs', () => {
	const worker = Object.assign(new FakeEventTarget(), { state: 'installing' });
	const registration = Object.assign(new FakeEventTarget(), { active: null, installing: worker });
	let offered = false;

	watchForServiceWorkerUpdate(registration, () => { offered = true; });
	registration.dispatch('updatefound');
	worker.state = 'installed';
	worker.dispatch('statechange');

	assert.equal(offered, false);
});

test('offers a reload when a new worker installs over the active worker', () => {
	const worker = Object.assign(new FakeEventTarget(), { state: 'installing' });
	const registration = Object.assign(new FakeEventTarget(), { active: {}, installing: worker });
	let offered = false;

	watchForServiceWorkerUpdate(registration, () => { offered = true; });
	registration.dispatch('updatefound');
	worker.state = 'installed';
	worker.dispatch('statechange');

	assert.equal(offered, true);
	assert.equal(worker.listeners.get('statechange').size, 0);
});
