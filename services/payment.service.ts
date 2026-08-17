import { apiFetch } from "@/lib/axios";

export type PaymentMethod =
  | "CARD"
  | "BANK_TRANSFER"
  | "CASH_ON_DELIVERY"
  | "WALLET";

export const PaymentService = {
  // Simulated gateway: charges an order the buyer owns and marks it PAID.
  // Idempotent on the backend — paying an already-paid order returns the
  // existing payment with alreadyPaid: true.
  payForOrder: async (orderId: string, method: PaymentMethod = "CARD") => {
    return apiFetch(`/buyer/orders/${orderId}/pay`, {
      method: "POST",
      body: JSON.stringify({ method }),
    });
  },
};
