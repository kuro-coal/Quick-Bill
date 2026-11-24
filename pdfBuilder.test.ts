import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPdfFromJpegBytes } from './pdfBuilder';

test('produces valid PDF 1.4 structure with A4 MediaBox and exact xref', () => {
  const dummyJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0xff, 0xd9]);
  const pdf = buildPdfFromJpegBytes(dummyJpeg, 1654, 2339);
  const text = new TextDecoder('latin1').decode(pdf);

  assert.ok(text.startsWith('%PDF-1.4\n'));
  assert.ok(text.includes('/MediaBox [0 0 595.28 841.89]'));
  assert.ok(text.includes('/Width 1654 /Height 2339'));
  assert.ok(text.includes('/Length 8'));
  assert.ok(text.includes('xref\n0 6\n0000000000 65535 f \n'));
  assert.ok(text.endsWith('%%EOF'));
});
