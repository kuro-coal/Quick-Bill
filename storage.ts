import type { QuickBillState } from '../types/quickbill';
import { CURRENCIES, TAX_PRESETS, detectLocaleDefaults } from './currency';
import { MODE_CONFIG, formatDocNumber } from './invoiceMath';

export const STORAGE_KEY = 'quickbill_state_v1';

export function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createDefaultState(): QuickBillState {
  const lang =
    typeof navigator !== 'undefined'
      ? navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US'
      : 'en-US';
  const loc = detectLocaleDefaults(lang);
  const currObj = CURRENCIES.find((c) => c.code === loc.curr) || CURRENCIES[1];
  const taxObj =
    TAX_PRESETS.find((t) => t.id === loc.tax) || TAX_PRESETS.find((t) => t.id === 'NONE')!;

  return {
    mode: 'INVOICE',
    profile: {
      logoDataUrl: '',
      showLogo: true,
      bizName: '',
      bizPhone: '',
      bizEmail: '',
      bizAddress: '',
      bizTaxId: '',
      bizPayment: ''
    },
    settings: {
      currencyCode: currObj.code,
      currencyPlacement: currObj.placement,
      customCurrency: { code: 'XYZ', symbol: '¤', decimals: 2 },
      taxPreset: taxObj.id,
      taxEnabled: taxObj.rate > 0,
      taxLabel: taxObj.label,
      taxRate: taxObj.rate,
      themeColor: '#1E3A8A',
      themeSoft: '#EFF6FF',
      themeBorder: '#BFDBFE',
      counters: { INVOICE: 1, QUOTE: 1, RECEIPT: 1 },
      localeHintDismissed: false,
      localeLabel: loc.label
    },
    doc: {
      docNumber: formatDocNumber('INV', 1),
      docNumberCustom: false,
      issueDate: todayISO(0),
      dueDate: todayISO(14),
      clientName: '',
      clientContact: '',
      clientTaxId: '',
      items: [{ id: 'item-1', desc: '', qty: 1, price: 0 }],
      discountType: 'none',
      discountValue: 0,
      notes: MODE_CONFIG.INVOICE.defaultNotes,
      notesCustom: false
    }
  };
}

export function loadState(): { state: QuickBillState; isFirstVisit: boolean } {
  const def = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { state: def, isFirstVisit: true };
    }
    const parsed = JSON.parse(raw) as Partial<QuickBillState>;
    const merged: QuickBillState = {
      mode: parsed.mode || def.mode,
      profile: { ...def.profile, ...(parsed.profile || {}) },
      settings: {
        ...def.settings,
        ...(parsed.settings || {}),
        customCurrency: {
          ...def.settings.customCurrency,
          ...(parsed.settings?.customCurrency || {})
        },
        counters: {
          ...def.settings.counters,
          ...(parsed.settings?.counters || {})
        }
      },
      doc: {
        ...def.doc,
        ...(parsed.doc || {}),
        items:
          Array.isArray(parsed.doc?.items) && parsed.doc.items.length > 0
            ? parsed.doc.items
            : def.doc.items
      }
    };
    return { state: merged, isFirstVisit: false };
  } catch {
    return { state: def, isFirstVisit: true };
  }
}

export function persistState(state: QuickBillState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
