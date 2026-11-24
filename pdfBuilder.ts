/**
 * Pure client-side PDF 1.4 binary builder embedding a baseline JPEG image
 * onto a single A4 page (595.28 x 841.89 pt). Zero external dependencies.
 */
export function buildPdfFromJpegBytes(
  imgBytes: Uint8Array,
  pixelWidth: number,
  pixelHeight: number
): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let offset = 0;
  const offsets: number[] = [0];

  const pushBytes = (uint8: Uint8Array) => {
    chunks.push(uint8);
    offset += uint8.length;
  };
  const pushStr = (str: string) => pushBytes(encoder.encode(str));

  // PDF 1.4 Header with binary comment bytes
  pushBytes(
    new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a,
      0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a
    ])
  );

  // Obj 1: Catalog
  offsets[1] = offset;
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Obj 2: Pages
  offsets[2] = offset;
  pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // Obj 3: Page (A4 = 595.28 x 841.89 pt)
  offsets[3] = offset;
  pushStr(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n'
  );

  // Obj 4: Image XObject (/DCTDecode)
  offsets[4] = offset;
  pushStr(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
  );
  pushBytes(imgBytes);
  pushStr('\nendstream\nendobj\n');

  // Obj 5: Page Content Stream
  const contentStream = 'q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';
  offsets[5] = offset;
  pushStr(`5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`);

  // XRef Table
  const xrefStart = offset;
  pushStr('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) {
    pushStr(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
  }

  // Trailer
  pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  const result = new Uint8Array(offset);
  let cursor = 0;
  for (const chunk of chunks) {
    result.set(chunk, cursor);
    cursor += chunk.length;
  }
  return result;
}
