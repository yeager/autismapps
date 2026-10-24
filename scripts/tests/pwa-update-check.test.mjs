import test from 'node:test';
import assert from 'node:assert/strict';
import { requestServiceWorkerUpdate } from '../../src/lib/pwa/update-check.js';

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
