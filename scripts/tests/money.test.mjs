import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currencyFor } from '../../src/lib/money.ts';

test('Swedish and English keep kronor exactly as before', () => {
  for (const code of ['sv', 'en']) {
    const c = currencyFor(code);
    assert.deepEqual(c.coins.map((x) => x.label), ['1 kr', '2 kr', '5 kr', '10 kr']);
    assert.deepEqual(c.bills.map((x) => x.label), ['20 kr', '50 kr', '100 kr', '200 kr', '500 kr']);
  }
});

test('pt_BR uses reais: 1 coin and 2..200 bills', () => {
  const c = currencyFor('pt_BR');
  assert.deepEqual(c.coins.map((x) => x.value), [1]);
  assert.deepEqual(c.bills.map((x) => x.value), [2, 5, 10, 20, 50, 100, 200]);
  assert.equal(c.coins[0].label, 'R$ 1');
  assert.equal(c.bills[6].label, 'R$ 200');
});

test('pt_BR spoken amount handles singular/plural', () => {
  const c = currencyFor('pt_BR');
  assert.equal(c.spoken(1), '1 real');
  assert.equal(c.spoken(0), '0 reais');
  assert.equal(c.spoken(7), '7 reais');
});

test('unit shown next to the total', () => {
  assert.equal(currencyFor('pt_BR').unit(1), 'real');
  assert.equal(currencyFor('pt_BR').unit(3), 'reais');
});
