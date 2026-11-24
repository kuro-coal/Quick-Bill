import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveActiveCurrency } from './currency';
import { buildWhatsappSummary, computeTotals, formatDocNumber } from './invoiceMath';

test('computes subtotal, percentage discount, tax, and total accurately', () => {
  const items = [
    { id: '1', desc: 'Pipe Repair', qty: 2, price: 750 },
    { id: '2', desc: 'Copper Fitting', qty: 4, price: 125 }
  ];
  const totals = computeTotals(items, 'percent', 10, true, 15);
  assert.equal(totals.subtotal, 2000);
  assert.equal(totals.discount, 200);
  assert.equal(totals.taxable, 1800);
  assert.equal(totals.taxAmount, 270);
  assert.equal(totals.total, 2070);
});

test('caps flat discount at subtotal and handles disabled tax', () => {
  const items = [{ id: '1', desc: 'Design', qty: 1, price: 100 }];
  const totals = computeTotals(items, 'flat', 500, false, 20);
  assert.equal(totals.subtotal, 100);
  assert.equal(totals.discount, 100);
  assert.equal(totals.taxable, 0);
  assert.equal(totals.taxAmount, 0);
  assert.equal(totals.total, 0);
});

test('formats sequential document numbers with padding', () => {
  assert.equal(formatDocNumber('INV', 1), 'INV-001');
  assert.equal(formatDocNumber('QUO', 14), 'QUO-014');
  assert.equal(formatDocNumber('RCT', 105), 'RCT-105');
});

test('builds WhatsApp summary with chosen currency and totals', () => {
  const zar = resolveActiveCurrency('ZAR', 'prefix', { code: 'XYZ', symbol: '¤', decimals: 2 });
  const summary = buildWhatsappSummary({
    mode: 'INVOICE',
    docNumber: 'INV-007',
    bizName: 'Cape Craft Plumbing',
    bizPayment: 'FNB Acc 123456',
    clientName: 'Thabo M.',
    issueDate: '2026-11-24',
    dueDate: '2026-12-08',
    items: [{ id: '1', desc: 'Valve Replacement', qty: 2, price: 500 }],
    discountType: 'none',
    discountValue: 0,
    taxEnabled: true,
    taxLabel: 'VAT',
    taxRate: 15,
    currency: zar
  });
  assert.match(summary, /\*INVOICE INV-007\*/);
  assert.match(summary, /From: Cape Craft Plumbing/);
  assert.match(summary, /To: Thabo M\./);
  assert.match(summary, /VAT \(15%\): R 150\.00/);
  assert.match(summary, /\*Amount Due: R 1,150\.00\*/);
  assert.match(summary, /FNB Acc 123456/);
});
