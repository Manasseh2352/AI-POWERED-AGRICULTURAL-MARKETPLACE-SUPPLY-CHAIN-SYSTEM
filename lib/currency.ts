// Currency model + Hermes-safe conversion/formatting.
//
// The whole app stores and computes money in USD (the DB base). This module is
// the display/input-conversion layer: it turns a USD amount into the user's
// chosen currency for display, and a typed amount back into USD for saving.
//
// Formatting avoids Intl/toLocaleString, which is unreliable on Hermes (Android)
// — same manual grouping approach as the original `formatMoney`.

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "NGN"
  | "KES"
  | "ZAR"
  | "GHS"
  | "CAD";

export type CurrencyMeta = {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
};

export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

// Offline / first-run fallback: approximate units of each currency per 1 USD.
// Live rates from RATES_URL overwrite these once fetched.
export const STATIC_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1550,
  KES: 129,
  ZAR: 18.2,
  GHS: 15.3,
  CAD: 1.36,
};

// Free, keyless endpoint. Response shape:
//   { result: "success", base_code: "USD", rates: { USD:1, EUR:0.92, ... }, ... }
export const RATES_URL = "https://open.er-api.com/v6/latest/USD";

const CURRENCY_BY_CODE: Record<string, CurrencyMeta> = CURRENCIES.reduce(
  (acc, c) => {
    acc[c.code] = c;
    return acc;
  },
  {} as Record<string, CurrencyMeta>
);

export const getCurrencyMeta = (code: CurrencyCode): CurrencyMeta =>
  CURRENCY_BY_CODE[code] ?? CURRENCIES[0];

// rate = units of `code` per 1 USD.
export const convertFromUsd = (amountUsd: number, rate: number): number =>
  (Number(amountUsd) || 0) * (rate || 1);

export const convertToUsd = (amount: number, rate: number): number =>
  (Number(amount) || 0) / (rate || 1);

// Convert a USD base amount into `code` at `rate`, then render
// "<symbol><grouped-integer>.<decimals>". Hermes-safe (toFixed + regex only).
export const formatCurrency = (
  amountUsd: number | string | null | undefined,
  code: CurrencyCode,
  rate: number,
  decimals = 2
): string => {
  const meta = getCurrencyMeta(code);
  const converted = convertFromUsd(Number(amountUsd ?? 0) || 0, rate);
  const sign = converted < 0 ? "-" : "";
  const fixed = Math.abs(converted).toFixed(decimals); // e.g. "1234.50"
  const [intPart, decPart] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const body = decPart ? `${grouped}.${decPart}` : grouped;
  return `${sign}${meta.symbol}${body}`;
};
