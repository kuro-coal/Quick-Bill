import type { CurrencyDef, CustomCurrencyConfig, SymbolPlacement, TaxPreset, ThemeSwatch } from '../types/quickbill';

export const CURRENCIES: CurrencyDef[] = [
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', country: 'South Africa', decimals: 2, placement: 'prefix', space: true },
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States', decimals: 2, placement: 'prefix', space: false },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'Eurozone / EU', decimals: 2, placement: 'prefix', space: false },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom', decimals: 2, placement: 'prefix', space: false },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', country: 'Nigeria', decimals: 2, placement: 'prefix', space: false },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', country: 'Kenya', decimals: 2, placement: 'prefix', space: true },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', country: 'Ghana', decimals: 2, placement: 'prefix', space: false },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India', decimals: 2, placement: 'prefix', space: false },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia', decimals: 2, placement: 'prefix', space: false },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', country: 'Canada', decimals: 2, placement: 'prefix', space: false },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan', decimals: 0, placement: 'prefix', space: false },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'China', decimals: 2, placement: 'prefix', space: false },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', country: 'Brazil', decimals: 2, placement: 'prefix', space: true },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', country: 'Mexico', decimals: 2, placement: 'prefix', space: false },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', country: 'United Arab Emirates', decimals: 2, placement: 'prefix', space: true },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', country: 'Saudi Arabia', decimals: 2, placement: 'prefix', space: true },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore', decimals: 2, placement: 'prefix', space: false },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', country: 'New Zealand', decimals: 2, placement: 'prefix', space: false },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', country: 'Switzerland', decimals: 2, placement: 'prefix', space: true },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', country: 'South Korea', decimals: 0, placement: 'prefix', space: false },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', country: 'Philippines', decimals: 2, placement: 'prefix', space: false },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', country: 'Indonesia', decimals: 2, placement: 'prefix', space: true },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', country: 'Thailand', decimals: 2, placement: 'prefix', space: false },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', country: 'Poland', decimals: 2, placement: 'suffix', space: true },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', country: 'Sweden', decimals: 2, placement: 'suffix', space: true },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', country: 'Norway', decimals: 2, placement: 'suffix', space: true },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', country: 'Denmark', decimals: 2, placement: 'suffix', space: true },
  { code: 'BWP', symbol: 'P', name: 'Botswana Pula', country: 'Botswana', decimals: 2, placement: 'prefix', space: true },
  { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar', country: 'Namibia', decimals: 2, placement: 'prefix', space: false },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', country: 'Tanzania', decimals: 2, placement: 'prefix', space: true },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', country: 'Uganda', decimals: 0, placement: 'prefix', space: true },
  { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc', country: 'Rwanda', decimals: 0, placement: 'prefix', space: true },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha', country: 'Zambia', decimals: 2, placement: 'prefix', space: true },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', country: 'Egypt', decimals: 2, placement: 'prefix', space: false },
  { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham', country: 'Morocco', decimals: 2, placement: 'suffix', space: true },
  { code: 'MUR', symbol: 'Rs', name: 'Mauritian Rupee', country: 'Mauritius', decimals: 2, placement: 'prefix', space: true },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc', country: 'West Africa (WAEMU)', decimals: 0, placement: 'suffix', space: true },
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc', country: 'Central Africa (CEMAC)', decimals: 0, placement: 'suffix', space: true },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia', decimals: 2, placement: 'prefix', space: false },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', country: 'Vietnam', decimals: 0, placement: 'suffix', space: true },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', country: 'Hong Kong', decimals: 2, placement: 'prefix', space: false },
  { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', country: 'Taiwan', decimals: 2, placement: 'prefix', space: false },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', country: 'Pakistan', decimals: 2, placement: 'prefix', space: true },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', country: 'Bangladesh', decimals: 2, placement: 'prefix', space: false },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', country: 'Sri Lanka', decimals: 2, placement: 'prefix', space: true },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', country: 'Turkey', decimals: 2, placement: 'prefix', space: false },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel', country: 'Israel', decimals: 2, placement: 'prefix', space: false },
  { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar', country: 'Bahrain', decimals: 3, placement: 'prefix', space: true },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar', country: 'Kuwait', decimals: 3, placement: 'prefix', space: true },
  { code: 'JOD', symbol: 'JD', name: 'Jordanian Dinar', country: 'Jordan', decimals: 3, placement: 'prefix', space: true },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial', country: 'Oman', decimals: 3, placement: 'prefix', space: true },
  { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar', country: 'Tunisia', decimals: 3, placement: 'suffix', space: true },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', country: 'Chile', decimals: 0, placement: 'prefix', space: false },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', country: 'Colombia', decimals: 2, placement: 'prefix', space: false },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', country: 'Argentina', decimals: 2, placement: 'prefix', space: false },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', country: 'Peru', decimals: 2, placement: 'prefix', space: true },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', country: 'Czechia', decimals: 2, placement: 'suffix', space: true },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', country: 'Hungary', decimals: 2, placement: 'suffix', space: true },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', country: 'Romania', decimals: 2, placement: 'suffix', space: true },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Krona', country: 'Iceland', decimals: 0, placement: 'suffix', space: true },
  { code: 'CUSTOM', symbol: '¤', name: 'Custom Currency (Manual)', country: 'Any Country', decimals: 2, placement: 'prefix', space: false }
];

export const TAX_PRESETS: TaxPreset[] = [
  { id: 'ZA', name: 'South Africa (15% VAT)', label: 'VAT', rate: 15 },
  { id: 'GB', name: 'United Kingdom (20% VAT)', label: 'VAT', rate: 20 },
  { id: 'NG', name: 'Nigeria (7.5% VAT)', label: 'VAT', rate: 7.5 },
  { id: 'IN', name: 'India (18% GST)', label: 'GST', rate: 18 },
  { id: 'AU', name: 'Australia (10% GST)', label: 'GST', rate: 10 },
  { id: 'SG', name: 'Singapore (9% GST)', label: 'GST', rate: 9 },
  { id: 'KE', name: 'Kenya (16% VAT)', label: 'VAT', rate: 16 },
  { id: 'GH', name: 'Ghana (15% VAT)', label: 'VAT', rate: 15 },
  { id: 'AE', name: 'UAE (5% VAT)', label: 'VAT', rate: 5 },
  { id: 'EU', name: 'Eurozone (~20% VAT)', label: 'VAT', rate: 20 },
  { id: 'CA', name: 'Canada (5% GST)', label: 'GST', rate: 5 },
  { id: 'US', name: 'United States (Sales Tax - Custom %)', label: 'Sales Tax', rate: 0 },
  { id: 'NZ', name: 'New Zealand (15% GST)', label: 'GST', rate: 15 },
  { id: 'SA', name: 'Saudi Arabia (15% VAT)', label: 'VAT', rate: 15 },
  { id: 'CH', name: 'Switzerland (8.1% VAT)', label: 'VAT', rate: 8.1 },
  { id: 'JP', name: 'Japan (10% Tax)', label: 'Tax', rate: 10 },
  { id: 'BW', name: 'Botswana (14% VAT)', label: 'VAT', rate: 14 },
  { id: 'NA', name: 'Namibia (15% VAT)', label: 'VAT', rate: 15 },
  { id: 'PH', name: 'Philippines (12% VAT)', label: 'VAT', rate: 12 },
  { id: 'MX', name: 'Mexico (16% IVA)', label: 'IVA', rate: 16 },
  { id: 'NONE', name: '0% / Tax Exempt', label: 'Tax', rate: 0 },
  { id: 'CUSTOM', name: 'Custom Tax Rate', label: 'Tax', rate: 0 }
];

export const THEME_SWATCHES: ThemeSwatch[] = [
  { id: 'charcoal', name: 'Charcoal', color: '#1F2937', soft: '#F3F4F6', border: '#D1D5DB' },
  { id: 'forest', name: 'Forest Green', color: '#14532D', soft: '#F0FDF4', border: '#BBF7D0' },
  { id: 'blue', name: 'Deep Blue', color: '#1E3A8A', soft: '#EFF6FF', border: '#BFDBFE' },
  { id: 'burgundy', name: 'Burgundy', color: '#7F1D1D', soft: '#FEF2F2', border: '#FECACA' },
  { id: 'gold', name: 'Warm Gold', color: '#A16207', soft: '#FEFCE8', border: '#FDE68A' }
];

const REGION_MAP: Record<string, { curr: string; tax: string; label: string }> = {
  ZA: { curr: 'ZAR', tax: 'ZA', label: 'South Africa' },
  GB: { curr: 'GBP', tax: 'GB', label: 'United Kingdom' },
  UK: { curr: 'GBP', tax: 'GB', label: 'United Kingdom' },
  US: { curr: 'USD', tax: 'US', label: 'United States' },
  NG: { curr: 'NGN', tax: 'NG', label: 'Nigeria' },
  IN: { curr: 'INR', tax: 'IN', label: 'India' },
  AU: { curr: 'AUD', tax: 'AU', label: 'Australia' },
  SG: { curr: 'SGD', tax: 'SG', label: 'Singapore' },
  KE: { curr: 'KES', tax: 'KE', label: 'Kenya' },
  GH: { curr: 'GHS', tax: 'GH', label: 'Ghana' },
  AE: { curr: 'AED', tax: 'AE', label: 'UAE' },
  CA: { curr: 'CAD', tax: 'CA', label: 'Canada' },
  NZ: { curr: 'NZD', tax: 'NZ', label: 'New Zealand' },
  SA: { curr: 'SAR', tax: 'SA', label: 'Saudi Arabia' },
  CH: { curr: 'CHF', tax: 'CH', label: 'Switzerland' },
  JP: { curr: 'JPY', tax: 'JP', label: 'Japan' },
  BW: { curr: 'BWP', tax: 'BW', label: 'Botswana' },
  NA: { curr: 'NAD', tax: 'NA', label: 'Namibia' },
  PH: { curr: 'PHP', tax: 'PH', label: 'Philippines' },
  MX: { curr: 'MXN', tax: 'MX', label: 'Mexico' },
  BR: { curr: 'BRL', tax: 'CUSTOM', label: 'Brazil' },
  KR: { curr: 'KRW', tax: 'CUSTOM', label: 'South Korea' },
  CN: { curr: 'CNY', tax: 'CUSTOM', label: 'China' },
  PL: { curr: 'PLN', tax: 'EU', label: 'Poland' },
  SE: { curr: 'SEK', tax: 'EU', label: 'Sweden' },
  NO: { curr: 'NOK', tax: 'EU', label: 'Norway' },
  DK: { curr: 'DKK', tax: 'EU', label: 'Denmark' },
  DE: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  FR: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  ES: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  IT: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  NL: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  IE: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  PT: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  BE: { curr: 'EUR', tax: 'EU', label: 'Eurozone' },
  AT: { curr: 'EUR', tax: 'EU', label: 'Eurozone' }
};

export function resolveActiveCurrency(
  currencyCode: string,
  placement: SymbolPlacement,
  customCurrency: CustomCurrencyConfig
): CurrencyDef {
  if (currencyCode === 'CUSTOM') {
    return {
      code: (customCurrency.code || 'CUR').trim() || 'CUR',
      symbol: (customCurrency.symbol || '¤').trim() || '¤',
      name: 'Custom Currency',
      country: 'Custom',
      decimals: customCurrency.decimals ?? 2,
      placement: placement || 'prefix',
      space: true
    };
  }
  const found = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[1];
  return {
    ...found,
    placement: placement || found.placement
  };
}

export function formatMoney(amount: number, curr: CurrencyDef): string {
  const dec = Math.max(0, Math.min(3, Number(curr.decimals) || 0));
  const factor = Math.pow(10, dec);
  let rounded = Math.round((Number(amount) || 0) * factor) / factor;
  if (Object.is(rounded, -0)) rounded = 0;

  const isNeg = rounded < 0;
  const absVal = Math.abs(rounded);
  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  }).format(absVal);

  const sym = curr.symbol;
  const needsSpace = curr.space || /[A-Za-z]$/.test(sym) || curr.placement === 'suffix';
  const sp = needsSpace ? ' ' : '';
  const combined =
    curr.placement === 'suffix'
      ? `${formattedNum}${sp}${sym}`
      : `${sym}${sp}${formattedNum}`;

  return isNeg ? `-${combined}` : combined;
}

export function detectLocaleDefaults(rawLang?: string): {
  curr: string;
  tax: string;
  label: string;
  detectedLang: string;
} {
  const lang = (rawLang || 'en-US').trim();
  let region = '';
  if (lang.includes('-')) {
    region = lang.split('-').pop()!.toUpperCase();
  } else {
    const lower = lang.toLowerCase();
    if (lower === 'ja') region = 'JP';
    else if (lower === 'ko') region = 'KR';
    else if (lower === 'zh') region = 'CN';
    else if (['de', 'fr', 'es', 'it', 'nl', 'pt'].includes(lower)) region = 'DE';
  }

  if (REGION_MAP[region]) {
    return { ...REGION_MAP[region], detectedLang: lang };
  }
  return { curr: 'USD', tax: 'NONE', label: 'International', detectedLang: lang };
}
