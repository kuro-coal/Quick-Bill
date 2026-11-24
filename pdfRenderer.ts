import type { QuickBillState } from '../types/quickbill';
import { formatMoney, resolveActiveCurrency } from './currency';
import { MODE_CONFIG, computeTotals, formatDisplayDate, formatDocNumber } from './invoiceMath';
import { buildPdfFromJpegBytes } from './pdfBuilder';

function loadImageAsync(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  const paragraphs = String(text).split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(/\s+/);
    let current = '';

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        if (current) {
          lines.push(current);
          current = '';
        }
        if (ctx.measureText(word).width > maxWidth) {
          let chunk = '';
          for (const ch of word) {
            if (ctx.measureText(chunk + ch).width <= maxWidth) {
              chunk += ch;
            } else {
              if (chunk) lines.push(chunk);
              chunk = ch;
            }
          }
          current = chunk;
        } else {
          current = word;
        }
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function renderDocumentToA4Canvas(state: QuickBillState): Promise<HTMLCanvasElement> {
  // Exact A4 proportion at 200 DPI
  const W = 1654;
  const H = 2339;
  const ML = 100;
  const MR = 1554;
  const CW = MR - ML;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize HTML5 Canvas for PDF export.');
  }

  const FONT = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  const accent = state.settings.themeColor || '#1E3A8A';
  const accentSoft = state.settings.themeSoft || '#EFF6FF';
  const accentBorder = state.settings.themeBorder || '#BFDBFE';

  const cfg = MODE_CONFIG[state.mode];
  const curr = resolveActiveCurrency(
    state.settings.currencyCode,
    state.settings.currencyPlacement,
    state.settings.customCurrency
  );
  const totals = computeTotals(
    state.doc.items,
    state.doc.discountType,
    state.doc.discountValue,
    state.settings.taxEnabled,
    state.settings.taxRate
  );

  // Clean A4 Paper Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Top Accent Bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, 18);

  // Load Logo if enabled
  let logoImg: HTMLImageElement | null = null;
  if (state.profile.logoDataUrl && state.profile.showLogo) {
    logoImg = await loadImageAsync(state.profile.logoDataUrl);
  }

  // --- HEADER LEFT (LOGO & BUSINESS INFO) ---
  let leftY = 74;
  if (logoImg && logoImg.width > 0 && logoImg.height > 0) {
    // Proportional to max-width: 180px; max-height: 64px on 794px A4
    const maxLogoW = 375;
    const maxLogoH = 134;
    const ratio = Math.min(maxLogoW / logoImg.width, maxLogoH / logoImg.height, 1);
    const drawW = Math.round(logoImg.width * ratio);
    const drawH = Math.round(logoImg.height * ratio);
    ctx.drawImage(logoImg, ML, leftY, drawW, drawH);
    leftY += drawH + 26;
  }

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `800 38px ${FONT}`;
  const bizTitle = state.profile.bizName.trim() || 'Your Business Name';
  for (const line of wrapText(ctx, bizTitle, 820)) {
    ctx.fillText(line, ML, leftY);
    leftY += 46;
  }
  leftY += 6;

  ctx.fillStyle = '#475569';
  ctx.font = `400 22px ${FONT}`;
  const bizInfoParts: string[] = [];
  if (state.profile.bizAddress.trim()) bizInfoParts.push(state.profile.bizAddress.trim());
  const cLine = [state.profile.bizPhone.trim(), state.profile.bizEmail.trim()].filter(Boolean).join('  •  ');
  if (cLine) bizInfoParts.push(cLine);
  if (state.profile.bizTaxId.trim()) bizInfoParts.push(`Tax ID: ${state.profile.bizTaxId.trim()}`);
  for (const line of wrapText(ctx, bizInfoParts.join('\n'), 820)) {
    ctx.fillText(line, ML, leftY);
    leftY += 31;
  }

  // --- HEADER RIGHT (DOC TITLE, STATUS STAMP, METADATA) ---
  let rightY = 74;
  ctx.textAlign = 'right';
  ctx.fillStyle = accent;
  ctx.font = `800 54px ${FONT}`;
  ctx.fillText(cfg.title, MR, rightY);
  rightY += 68;

  const isPaid = state.mode === 'RECEIPT';
  ctx.font = `800 18px ${FONT}`;
  const badgeW = ctx.measureText(cfg.badge).width + 32;
  const badgeH = 34;
  drawRoundedRect(ctx, MR - badgeW, rightY, badgeW, badgeH, 6);
  ctx.fillStyle = isPaid ? '#DCFCE7' : accentSoft;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = isPaid ? '#86EFAC' : accentBorder;
  ctx.stroke();

  ctx.fillStyle = isPaid ? '#166534' : accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cfg.badge, MR - badgeW / 2, rightY + badgeH / 2 + 1);
  rightY += badgeH + 24;

  ctx.textBaseline = 'top';
  const metaRows: [string, string][] = [
    [`${cfg.numLabel}:`, state.doc.docNumber.trim() || formatDocNumber(cfg.prefix, 1)],
    [`${cfg.issueLabel}:`, formatDisplayDate(state.doc.issueDate)]
  ];
  if (cfg.showDue) {
    metaRows.push([`${cfg.dueLabel}:`, formatDisplayDate(state.doc.dueDate)]);
  }

  for (const [k, v] of metaRows) {
    ctx.textAlign = 'right';
    ctx.font = `700 22px ${FONT}`;
    ctx.fillStyle = '#0F172A';
    const valW = ctx.measureText(v).width;
    ctx.fillText(v, MR, rightY);

    ctx.font = `500 22px ${FONT}`;
    ctx.fillStyle = '#64748B';
    ctx.fillText(k, MR - valW - 18, rightY);
    rightY += 34;
  }

  // Divider
  let y = Math.max(leftY, rightY) + 34;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(ML, y);
  ctx.lineTo(MR, y);
  ctx.stroke();
  y += 34;

  // --- CLIENT & HERO AMOUNT BAND ---
  const clientStartY = y;
  ctx.textAlign = 'left';
  ctx.fillStyle = accent;
  ctx.font = `800 18px ${FONT}`;
  ctx.fillText(cfg.clientHeading.toUpperCase(), ML, y);
  y += 28;

  ctx.fillStyle = '#0F172A';
  ctx.font = `700 28px ${FONT}`;
  for (const line of wrapText(ctx, state.doc.clientName.trim() || 'Client Name', 840)) {
    ctx.fillText(line, ML, y);
    y += 36;
  }
  y += 4;

  ctx.fillStyle = '#475569';
  ctx.font = `400 22px ${FONT}`;
  const cDetails: string[] = [];
  if (state.doc.clientContact.trim()) cDetails.push(state.doc.clientContact.trim());
  if (state.doc.clientTaxId.trim()) cDetails.push(`Tax ID: ${state.doc.clientTaxId.trim()}`);
  for (const line of wrapText(ctx, cDetails.join('\n'), 840)) {
    ctx.fillText(line, ML, y);
    y += 30;
  }

  const boxW = 480;
  const boxH = 122;
  drawRoundedRect(ctx, MR - boxW, clientStartY, boxW, boxH, 12);
  ctx.fillStyle = accentSoft;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = accentBorder;
  ctx.stroke();

  ctx.textAlign = 'right';
  ctx.fillStyle = accent;
  ctx.font = `800 18px ${FONT}`;
  ctx.fillText(cfg.amountLabel.toUpperCase(), MR - 28, clientStartY + 24);

  ctx.fillStyle = '#0F172A';
  ctx.font = `800 40px ${FONT}`;
  const heroAmtStr = formatMoney(totals.total, curr);
  if (ctx.measureText(heroAmtStr).width > boxW - 56) {
    ctx.font = `800 32px ${FONT}`;
  }
  ctx.fillText(heroAmtStr, MR - 28, clientStartY + 58);

  y = Math.max(y, clientStartY + boxH) + 38;

  // --- MEASURE TABLE + FOOTER FOR SINGLE A4 FIT ---
  const footerPayText = state.profile.bizPayment.trim();
  const footerNotesText = state.doc.notes.trim();
  const hasFooter = Boolean(footerPayText || footerNotesText);

  let footerHeightEstimate = 0;
  ctx.font = `400 20px ${FONT}`;
  const colW = footerPayText && footerNotesText ? 680 : CW - 40;
  const payWrapped = footerPayText ? wrapText(ctx, footerPayText, colW) : [];
  const notesWrapped = footerNotesText ? wrapText(ctx, footerNotesText, colW) : [];
  if (hasFooter) {
    footerHeightEstimate = Math.max(payWrapped.length, notesWrapped.length) * 28 + 96;
  }
  const totalsHeightEstimate = 210;
  const availableForTable = H - 80 - y - totalsHeightEstimate - footerHeightEstimate;

  let rowFontSize = 22;
  let rowLineH = 30;
  let rowPadY = 18;

  const measureTableHeight = (fSize: number, lH: number, pY: number) => {
    ctx.font = `400 ${fSize}px ${FONT}`;
    let h = 58;
    for (let i = 0; i < state.doc.items.length; i++) {
      const desc = state.doc.items[i].desc.trim() || `Item #${i + 1}`;
      const lines = wrapText(ctx, desc, 710);
      h += Math.max(1, lines.length) * lH + pY * 2;
    }
    return h;
  };

  if (measureTableHeight(rowFontSize, rowLineH, rowPadY) > availableForTable) {
    rowFontSize = 19;
    rowLineH = 25;
    rowPadY = 12;
  }
  if (measureTableHeight(rowFontSize, rowLineH, rowPadY) > availableForTable) {
    rowFontSize = 16;
    rowLineH = 21;
    rowPadY = 8;
  }

  // --- DRAW LINE ITEMS TABLE ---
  const thH = 56;
  ctx.fillStyle = accent;
  ctx.fillRect(ML, y, CW, thH);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 18px ${FONT}`;
  ctx.textBaseline = 'middle';
  const thMid = y + thH / 2 + 1;

  ctx.textAlign = 'left';
  ctx.fillText('DESCRIPTION', ML + 20, thMid);
  ctx.textAlign = 'right';
  ctx.fillText('QTY', ML + 930, thMid);
  ctx.fillText('UNIT PRICE', ML + 1210, thMid);
  ctx.fillText('AMOUNT', MR - 20, thMid);

  y += thH;
  ctx.textBaseline = 'top';

  state.doc.items.forEach((item, idx) => {
    const desc = item.desc.trim() || `Item #${idx + 1}`;
    const q = Math.max(0, Number(item.qty) || 0);
    const p = Math.max(0, Number(item.price) || 0);
    const lineAmt = q * p;

    ctx.font = `400 ${rowFontSize}px ${FONT}`;
    const descLines = wrapText(ctx, desc, 710);
    const rowH = Math.max(1, descLines.length) * rowLineH + rowPadY * 2;

    if (idx % 2 === 1) {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(ML, y, CW, rowH);
    }

    const textTop = y + rowPadY;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'left';
    ctx.font = `500 ${rowFontSize}px ${FONT}`;
    descLines.forEach((dl, li) => {
      ctx.fillText(dl, ML + 20, textTop + li * rowLineH);
    });

    ctx.textAlign = 'right';
    ctx.font = `400 ${rowFontSize}px ${FONT}`;
    ctx.fillStyle = '#334155';
    ctx.fillText(String(q), ML + 930, textTop);
    ctx.fillText(formatMoney(p, curr), ML + 1210, textTop);

    ctx.font = `700 ${rowFontSize}px ${FONT}`;
    ctx.fillStyle = '#0F172A';
    ctx.fillText(formatMoney(lineAmt, curr), MR - 20, textTop);

    y += rowH;
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ML, y);
    ctx.lineTo(MR, y);
    ctx.stroke();
  });

  // --- TOTALS BLOCK ---
  y += 28;
  const totLeft = MR - 520;
  const drawTotalLine = (label: string, val: string, valColor = '#0F172A') => {
    ctx.font = `500 22px ${FONT}`;
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'left';
    ctx.fillText(label, totLeft + 16, y);

    ctx.font = `700 22px ${FONT}`;
    ctx.fillStyle = valColor;
    ctx.textAlign = 'right';
    ctx.fillText(val, MR - 16, y);
    y += 38;
  };

  drawTotalLine('Subtotal', formatMoney(totals.subtotal, curr));

  if (totals.discount > 0) {
    const dLbl =
      state.doc.discountType === 'percent'
        ? `Discount (${Number(state.doc.discountValue) || 0}%)`
        : 'Discount';
    drawTotalLine(dLbl, `-${formatMoney(totals.discount, curr)}`, '#15803D');
  }

  if (state.settings.taxEnabled) {
    const tName = (state.settings.taxLabel || 'Tax').trim();
    drawTotalLine(`${tName} (${totals.taxRate}%)`, formatMoney(totals.taxAmount, curr));
  }

  y += 6;
  const gtH = 62;
  drawRoundedRect(ctx, totLeft, y, 520, gtH, 10);
  ctx.fillStyle = accent;
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.font = `800 24px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText(`Total (${curr.code})`, totLeft + 20, y + gtH / 2 + 1);
  ctx.textAlign = 'right';
  ctx.fillText(formatMoney(totals.total, curr), MR - 20, y + gtH / 2 + 1);

  y += gtH + 38;
  ctx.textBaseline = 'top';

  // --- PAYMENT DETAILS & NOTES ---
  if (hasFooter) {
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ML, y);
    ctx.lineTo(MR, y);
    ctx.stroke();
    y += 26;

    const drawInfoBox = (x: number, width: number, heading: string, lines: string[]) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = accent;
      ctx.font = `800 18px ${FONT}`;
      ctx.fillText(heading.toUpperCase(), x, y);

      const boxTop = y + 28;
      const boxHeight = Math.max(70, lines.length * 28 + 32);
      drawRoundedRect(ctx, x, boxTop, width, boxHeight, 10);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = `400 20px ${FONT}`;
      let ly = boxTop + 18;
      for (const ln of lines) {
        if (ly > H - 48) break;
        ctx.fillText(ln, x + 18, ly);
        ly += 28;
      }
    };

    if (footerPayText && footerNotesText) {
      const halfW = (CW - 28) / 2;
      ctx.font = `400 20px ${FONT}`;
      drawInfoBox(ML, halfW, 'Payment Details', wrapText(ctx, footerPayText, halfW - 36));
      drawInfoBox(ML + halfW + 28, halfW, 'Notes & Terms', wrapText(ctx, footerNotesText, halfW - 36));
    } else if (footerPayText) {
      ctx.font = `400 20px ${FONT}`;
      drawInfoBox(ML, CW, 'Payment Details', wrapText(ctx, footerPayText, CW - 36));
    } else if (footerNotesText) {
      ctx.font = `400 20px ${FONT}`;
      drawInfoBox(ML, CW, 'Notes & Terms', wrapText(ctx, footerNotesText, CW - 36));
    }
  }

  return canvas;
}

export async function generatePdfBlob(state: QuickBillState): Promise<Blob> {
  const canvas = await renderDocumentToA4Canvas(state);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const base64 = dataUrl.split(',')[1];
  const binStr = atob(base64);
  const imgBytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    imgBytes[i] = binStr.charCodeAt(i);
  }
  const pdfBytes = buildPdfFromJpegBytes(imgBytes, canvas.width, canvas.height);
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
