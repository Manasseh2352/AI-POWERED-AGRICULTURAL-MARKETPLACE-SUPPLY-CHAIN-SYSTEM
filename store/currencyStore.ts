import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  type CurrencyCode,
  DEFAULT_CURRENCY,
  STATIC_RATES,
  RATES_URL,
} from "@/lib/currency";

// Persisted keys. Currency preference isn't sensitive, so plain AsyncStorage
// (not SecureStore) — mirrors how the rest of non-secret app state is cached.
const CODE_KEY = "currency.code";
const RATES_KEY = "currency.rates";
const RATES_AT_KEY = "currency.ratesUpdatedAt";

// Refresh live rates at most this often; older than this is considered stale.
const STALE_MS = 12 * 60 * 60 * 1000; // 12h

type Rates = Record<string, number>;

// AsyncStorage can be unavailable at runtime — a JS/native version mismatch, a
// backend that isn't ready yet, or corrupt storage. Persisting the currency
// choice is a convenience, never critical (the app always has in-memory rates),
// so every write goes through here: fire-and-forget AND error-swallowing, so a
// storage failure can never surface as an uncaught promise rejection.
const persist = (key: string, value: string): void => {
  try {
    const p = AsyncStorage.setItem(key, value);
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch {
    // Native module missing/unavailable — non-fatal; choice just won't persist.
  }
};

interface CurrencyState {
  code: CurrencyCode;
  rates: Rates;
  ratesUpdatedAt: number | null;
  hydrated: boolean;

  setCurrency: (code: CurrencyCode) => void;
  hydrate: () => Promise<void>;
  refreshRates: (opts?: { force?: boolean }) => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  code: DEFAULT_CURRENCY,
  rates: { ...STATIC_RATES },
  ratesUpdatedAt: null,
  hydrated: false,

  setCurrency: (code) => {
    set({ code });
    persist(CODE_KEY, code);
  },

  hydrate: async () => {
    try {
      const [code, ratesRaw, atRaw] = await Promise.all([
        AsyncStorage.getItem(CODE_KEY),
        AsyncStorage.getItem(RATES_KEY),
        AsyncStorage.getItem(RATES_AT_KEY),
      ]);
      const parsedRates = ratesRaw ? (JSON.parse(ratesRaw) as Rates) : null;
      set({
        code: (code as CurrencyCode | null) ?? DEFAULT_CURRENCY,
        // Always keep the static rates as a floor so an unknown code never
        // divides by undefined.
        rates:
          parsedRates && typeof parsedRates === "object"
            ? { ...STATIC_RATES, ...parsedRates }
            : { ...STATIC_RATES },
        ratesUpdatedAt: atRaw ? Number(atRaw) : null,
      });
    } catch {
      // Corrupt/unavailable storage — keep in-memory defaults.
    } finally {
      set({ hydrated: true });
    }
    // Kick a background refresh if the cached rates are stale/missing.
    void get().refreshRates();
  },

  refreshRates: async (opts) => {
    const { ratesUpdatedAt } = get();
    const now = Date.now();
    if (!opts?.force && ratesUpdatedAt && now - ratesUpdatedAt < STALE_MS) {
      return; // still fresh
    }
    try {
      const res = await fetch(RATES_URL);
      const json = await res.json();
      if (
        json?.result === "success" &&
        json?.rates &&
        typeof json.rates === "object"
      ) {
        const rates: Rates = { ...STATIC_RATES, ...(json.rates as Rates) };
        set({ rates, ratesUpdatedAt: now });
        persist(RATES_KEY, JSON.stringify(rates));
        persist(RATES_AT_KEY, String(now));
      }
    } catch {
      // Offline or API down — keep whatever rates we already have.
    }
  },
}));
