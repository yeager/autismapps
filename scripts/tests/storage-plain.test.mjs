// plain() uses the $state.snapshot rune, so this test compiles the real module with the Svelte compiler
// (types stripped by Node) and checks the bug it fixes: a $state proxy can't be structured-cloned, which is
// what IndexedDB does on put() ("DataCloneError: #<Object> could not be cloned").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { compileModule } from 'svelte/compiler';

const SVELTE_CLIENT = import.meta.resolve('svelte/internal/client');

/** Compiles a .svelte.js module and imports it (data: URL; the runtime import points at node_modules) */
async function importRunesModule(code, filename) {
  const { js } = compileModule(code, { filename, generate: 'client', dev: false });
  const resolved = js.code.replaceAll(/(['"])svelte\/internal\/client\1/g, JSON.stringify(SVELTE_CLIENT));
  return import(`data:text/javascript;charset=utf-8,${encodeURIComponent(resolved)}`);
}

const plainSrc = stripTypeScriptTypes(
  readFileSync(new URL('../../src/lib/storage/plain.svelte.ts', import.meta.url), 'utf8'),
);
const { plain } = await importRunesModule(plainSrc, 'plain.svelte.js');

// A board shaped like the board-builder's: an array of cells and Dates, held in $state as a page does
const { makeBoard } = await importRunesModule(
  `export function makeBoard() {
     let board = $state({ name: 'x', cells: [{ index: 0, label: 'a', isEmpty: false }], createdAt: new Date(0) });
     return board;
   }`,
  'fixture.svelte.js',
);

test('a $state value is a proxy that structuredClone (IndexedDB) rejects', () => {
  assert.throws(() => structuredClone(makeBoard()), { name: 'DataCloneError' });
  // the old board-builder fix attempt: spreading the array still leaves proxied cells inside
  const board = makeBoard();
  assert.throws(() => structuredClone({ ...board, cells: [...board.cells] }), { name: 'DataCloneError' });
});

test('plain() returns a clonable deep copy that keeps the data and the Dates', () => {
  const copy = plain(makeBoard());
  const cloned = structuredClone(copy);
  assert.deepEqual(cloned.cells, [{ index: 0, label: 'a', isEmpty: false }]);
  assert.ok(cloned.createdAt instanceof Date);
  assert.equal(cloned.createdAt.getTime(), 0);
});

test('plain() leaves plain values as they are', () => {
  const data = { n: 1, list: [1, 2], when: new Date(5) };
  assert.deepEqual(plain(data), data);
});
