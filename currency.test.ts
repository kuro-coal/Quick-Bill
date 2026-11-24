import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENCIES,
  TAX_PRESETS,
  detectLocaleDefaults,
  formatMoney,
  resolveActiveCurrency
} from './currency';

test('supports 0, 2, and 3 decimal currencies with prefix and suffix placement', () => {
  const usd = resolveActiveCurrency('USD', 'prefix', { code: 'XYZ', symbol: '¤', decimals: 2 });
  assert.equal(formatMoney(1250.5, usd), '$1,250.50');

  const jpy = resolveActiveCurrency('JPY', 'prefix', { code: 'XYZ', symbol: '¤', decimals: 2 });
  assert.equal(formatMoney(1250.6, jpy), '¥1,251');

  const kwd = resolveActiveCurrency('KWD', 'prefix', { code: 'XYZ', symbol: '¤', decimals: 2 });
  assert.equal(formatMoney(45.125, kwd), 'KD 45.125');

  const pln = resolveActiveCurrency('PLN', 'suffix', { code: 'XYZ', symbol: '¤', decimals: 2 });
  assert.equal(formatMoney(99.9, pln), '99.90 zł');

  const zar = resolveActiveCurrency('ZAR', 'prefix', { code: 'XYZ', symbol: '¤', decimals: 2 });
  assert.equal(formatMoney(500, zar), 'R 500.00');
});

test('supports custom currency configuration', () => {
  const custom = resolveActiveCurrency('CUSTOM', 'suffix', {
    code: 'GLD',
    symbol: '✦',
    decimals: 3
  });
  assert.equal(formatMoney(10.5, custom), '10.500 ✦');
  assert.equal(formatMoney(-4.2, custom), '-4.200 ✦');
});

test('auto-detects locale currency and tax presets accurately', () => {
  assert.deepEqual(detectLocaleDefaults('en-ZA'), {
    curr: 'ZAR',
    tax: 'ZA',
    label: 'South Africa',
    detectedLang: 'en-ZA'
  });
  assert.deepEqual(detectLocaleDefaults('en-GB'), {
    curr: 'GBP',
    tax: 'GB',
    label: 'United Kingdom',
    detectedLang: 'en-GB'
  });
  assert.deepEqual(detectLocaleDefaults('ja'), {
    curr: 'JPY',
    tax: 'JP',
    label: 'Japan',
    detectedLang: 'ja'
  });
  assert.deepEqual(detectLocaleDefaults('xx-YY'), {
    curr: 'USD',
    tax: 'NONE',
    label: 'International',
    detectedLang: 'xx-YY'
  });
});

test('includes required global currencies and tax presets', () => {
  const codes = new Set(CURRENCIES.map((c) => c.code));
  for (const required of ['ZAR', 'USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'INR', 'AUD', 'CAD', 'JPY', 'BHD', 'KWD', 'JOD', 'CLP', 'UGX', 'KRW']) {
    assert.ok(codes.has(required), `Missing currency ${required}`);
  }
  const taxIds = new Set(TAX_PRESETS.map((t) => t.id));
  for (const requiredTax of ['ZA', 'GB', 'NG', 'IN', 'AU', 'SG', 'KE', 'GH', 'AE', 'EU', 'CA', 'NONE', 'CUSTOM']) {
    assert.ok(taxIds.has(requiredTax), `Missing tax preset ${requiredTax}`);
  }
});
