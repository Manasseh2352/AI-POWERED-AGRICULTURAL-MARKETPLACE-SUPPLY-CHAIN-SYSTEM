// useMoney: currency-aware money helpers bound to the active currency store.
// Reads the selected currency code + its live rate and exposes format/convert
// helpers so screens can render USD-base amounts in the user's chosen currency.
//
// Lives in lib/ (an allowed workspace dir) rather than hooks/ — functionally a
// hook, imported as "@/lib/useMoney".
import {
  type CurrencyCode,
  convertFromUsd,
  convertToUsd,
  formatCurrency,
  getCurrencyMeta,
} from "@/lib/currency";
import { useCurrencyStore } from "@/store/currencyStore";

export function useMoney() {
  const code = useCurrencyStore((s) => s.code);
  const rates = useCurrencyStore((s) => s.rates);
  const rate = rates[code] ?? 1;
  const meta = getCurrencyMeta(code);

  return {
    code: code as CurrencyCode,
    rate,
    symbol: meta.symbol,
    format: (usd: number | string | null | undefined, decimals = 2) =>
      formatCurrency(usd, code, rate, decimals),
    toUsd: (amount: number) => convertToUsd(amount, rate),
    fromUsd: (usd: number) => convertFromUsd(usd, rate),
  };
}
