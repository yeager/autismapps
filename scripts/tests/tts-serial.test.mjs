import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSerialQueue } from '../../src/lib/tts/serial.ts';

const tick = () => new Promise((r) => setTimeout(r, 5));

test('tasks run one at a time, in call order', async () => {
  const enqueue = createSerialQueue();
  let running = 0;
  let maxRunning = 0;
  const order = [];
  const task = (id) => async () => {
    running++;
    maxRunning = Math.max(maxRunning, running);
    await tick();
    order.push(id);
    running--;
    return id;
  };
  const results = await Promise.all([enqueue(task(1)), enqueue(task(2)), enqueue(task(3))]);
  assert.equal(maxRunning, 1);
  assert.deepEqual(order, [1, 2, 3]);
  assert.deepEqual(results, [1, 2, 3]);
});

test('a failing task rejects its own caller and does not block the next one', async () => {
  const enqueue = createSerialQueue();
  const failed = enqueue(async () => { await tick(); throw new Error('boom'); });
  const next = enqueue(async () => 'ok');
  await assert.rejects(failed, /boom/);
  assert.equal(await next, 'ok');
});
