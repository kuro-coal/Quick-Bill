import type { CurrencyDef, DiscountType, DocMode, LineItem } from '../types/quickbill';
import { formatMoney } from './currency';

export interface ModeConfig {
  prefix: string;
  title: string;
  badge: string;
  numLabel: string;
  issueLabel: string;
  dueLabel: string;
  showDue: boolean;
  clientHeading: string;
  amountLabel: string;
  defaultNotes: string;
}

export const MODE_CONFIG: Record<DocMode, ModeConfig> = {
  INVOICE: {
    prefix: 'INV',
    title: 'INVOICE',
    badge: 'DUE',
    numLabel: 'Invoice #',
    issueLabel: 'Issue Date',
    dueLabel: 'Due Date',
    showDue: true,
    clientHeading: 'Bill To',
    amountLabel: 'Amount Due',
    defaultNotes: 'Thank you for your business. Please settle payment by the due date.'
  },
  QUOTE: {
    prefix: 'QUO',
    title: 'QUOTE',
    badge: 'ESTIMATE',
    numLabel: 'Quote #',
    issueLabel: 'Issue Date',
    dueLabel: 'Valid Until',
    showDue: true,
    clientHeading: 'Prepared For',
    amountLabel: 'Quoted Total',
    defaultNotes: 'This quote is valid for 14 days. Work begins upon approval.'
  },
  RECEIPT: {
    prefix: 'RCT',
    title: 'RECEIPT',
    badge: 'PAID IN FULL',
    numLabel: 'Receipt #',
    issueLabel: 'Payment Date',
    dueLabel: 'Reference Date',
    showDue: false,
    clientHeading: 'Received From',
    amountLabel: 'Amount Paid',
    defaultNotes: 'Payment received in full. Thank you for your business.'
  }
};

export interface ComputedTotals {
  subtotal: number;
  discount: number;
  taxable: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export function computeTotals(
  items: LineItem[],
  discountType: DiscountType,
  discountValue: number,
  taxEnabled: boolean,
  taxRate: number
): ComputedTotals {
  let subtotal = 0;
  for (const item of items) {
    const q = Math.max(0, Number(item.qty) || 0);
    const p = Math.max(0, Number(item.price) || 0);
    subtotal += q * p;
  }

  let discount = 0;
  const dVal = Math.max(0, Number(discountValue) || 0);
  if (discountType === 'percent') {
    discount = subtotal * (Math.min(100, dVal) / 100);
  } else if (discountType === 'flat') {
    discount = Math.min(subtotal, dVal);
  }

  const taxable = Math.max(0, subtotal - discount);
  const effectiveTaxRate = taxEnabled ? Math.max(0, Math.min(100, Number(taxRate) || 0)) : 0;
  const taxAmount = taxable * (effectiveTaxRate / 100);
  const total = taxable + taxAmount;

  return {
    subtotal,
    discount,
    taxable,
    taxRate: effectiveTaxRate,
    taxAmount,
    total
  };
}

export function formatDocNumber(prefix: string, counter: number): string {
  const num = Math.max(1, Math.floor(Number(counter) || 1));
  return `${prefix}-${String(num).padStart(3, '0')}`;
}

export function formatDisplayDate(iso: string): string {
  if (!iso) return '—';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function buildWhatsappSummary(params: {
  mode: DocMode;
  docNumber: string;
  bizName: string;
  bizPayment: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  discountType: DiscountType;
  discountValue: number;
  taxEnabled: boolean;
  taxLabel: string;
  taxRate: number;
  currency: CurrencyDef;
}): string {
  const cfg = MODE_CONFIG[params.mode];
  const totals = computeTotals(
    params.items,
    params.discountType,
    params.discountValue,
    params.taxEnabled,
    params.taxRate
  );
  const docNum = params.docNumber.trim() || formatDocNumber(cfg.prefix, 1);
  const biz = params.bizName.trim() || 'Business';
  const client = params.clientName.trim() || 'Client';

  const lines: string[] = [
    `*${cfg.title} ${docNum}*`,
    `From: ${biz}`,
    `To: ${client}`,
    `Date: ${formatDisplayDate(params.issueDate)}`
  ];

  if (cfg.showDue && params.dueDate) {
    lines.push(`${cfg.dueLabel}: ${formatDisplayDate(params.dueDate)}`);
  }

  lines.push('');
  lines.push('*Items:*');
  params.items.forEach((item, idx) => {
    const desc = item.desc.trim() || `Item #${idx + 1}`;
    const q = Math.max(0, Number(item.qty) || 0);
    const p = Math.max(0, Number(item.price) || 0);
    lines.push(`• ${desc} (${q} × ${formatMoney(p, params.currency)}) = ${formatMoney(q * p, params.currency)}`);
  });

  lines.push('');
  lines.push(`Subtotal: ${formatMoney(totals.subtotal, params.currency)}`);
  if (totals.discount > 0) {
    lines.push(`Discount: -${formatMoney(totals.discount, params.currency)}`);
  }
  if (params.taxEnabled) {
    const tName = (params.taxLabel || 'Tax').trim();
    lines.push(`${tName} (${totals.taxRate}%): ${formatMoney(totals.taxAmount, params.currency)}`);
  }
  lines.push(`*${cfg.amountLabel}: ${formatMoney(totals.total, params.currency)}*`);

  if (params.bizPayment.trim()) {
    lines.push('');
    lines.push('*Payment Details:*');
    lines.push(params.bizPayment.trim());
  }

  return lines.join('\n');
}
