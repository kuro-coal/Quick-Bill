export type DocMode = 'INVOICE' | 'QUOTE' | 'RECEIPT';

export type SymbolPlacement = 'prefix' | 'suffix';

export type DiscountType = 'none' | 'percent' | 'flat';

export interface CurrencyDef {
  code: string;
  symbol: string;
  name: string;
  country: string;
  decimals: 0 | 2 | 3;
  placement: SymbolPlacement;
  space: boolean;
}

export interface TaxPreset {
  id: string;
  name: string;
  label: string;
  rate: number;
}

export interface ThemeSwatch {
  id: string;
  name: string;
  color: string;
  soft: string;
  border: string;
}

export interface LineItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

export interface BusinessProfile {
  logoDataUrl: string;
  showLogo: boolean;
  bizName: string;
  bizPhone: string;
  bizEmail: string;
  bizAddress: string;
  bizTaxId: string;
  bizPayment: string;
}

export interface CustomCurrencyConfig {
  code: string;
  symbol: string;
  decimals: 0 | 2 | 3;
}

export interface QuickBillSettings {
  currencyCode: string;
  currencyPlacement: SymbolPlacement;
  customCurrency: CustomCurrencyConfig;
  taxPreset: string;
  taxEnabled: boolean;
  taxLabel: string;
  taxRate: number;
  themeColor: string;
  themeSoft: string;
  themeBorder: string;
  counters: Record<DocMode, number>;
  localeHintDismissed: boolean;
  localeLabel: string;
}

export interface DocumentDraft {
  docNumber: string;
  docNumberCustom: boolean;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientContact: string;
  clientTaxId: string;
  items: LineItem[];
  discountType: DiscountType;
  discountValue: number;
  notes: string;
  notesCustom: boolean;
}

export interface QuickBillState {
  mode: DocMode;
  profile: BusinessProfile;
  settings: QuickBillSettings;
  doc: DocumentDraft;
}
