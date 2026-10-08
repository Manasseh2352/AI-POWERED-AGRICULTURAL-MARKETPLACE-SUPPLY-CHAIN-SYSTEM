import { apiFetch } from "@/lib/axios";

// Farmer escrow wallet. All monetary fields are Decimal(18,2) serialized as
// STRINGS in JSON and denominated in the wallet's own currency (USD base).
// Coerce with Number() before arithmetic; render via useMoney().format(...).
export type Wallet = {
  id: string;
  farmerProfileId: string;
  currency: string;
  availableBalance: string; // withdrawable (escrow released on buyer receipt)
  escrowBalance: string; // held until the buyer confirms delivery
  createdAt: string;
  updatedAt: string;
};

export type WalletTransactionType =
  | "ESCROW_HOLD"
  | "ESCROW_RELEASE"
  | "ESCROW_REVERSAL"
  | "WITHDRAWAL";

export type WalletTransaction = {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: string;
  currency: string;
  orderId?: string | null;
  note?: string | null;
  availableBalanceAfter: string;
  escrowBalanceAfter: string;
  createdAt: string;
};

export const WalletService = {
  getWallet: async (): Promise<Wallet | null> => {
    const res = await apiFetch("/farmer/wallet");
    return res?.wallet ?? null;
  },

  listTransactions: async (opts?: {
    limit?: number;
    offset?: number;
  }): Promise<WalletTransaction[]> => {
    const qs = new URLSearchParams();
    if (opts?.limit != null) qs.set("limit", String(opts.limit));
    if (opts?.offset != null) qs.set("offset", String(opts.offset));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";

    const res = await apiFetch(`/farmer/wallet/transactions${suffix}`);
    return Array.isArray(res?.transactions) ? res.transactions : [];
  },

  // Request a payout. `amount` is in the wallet's base currency (USD) and must
  // be <= availableBalance or the backend responds 400. Returns { wallet,
  // withdrawal } with the post-withdrawal balances.
  requestWithdrawal: async (
    amount: number
  ): Promise<{ wallet: Wallet; withdrawal: any }> => {
    const res = await apiFetch("/farmer/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    return { wallet: res?.wallet, withdrawal: res?.withdrawal };
  },
};
