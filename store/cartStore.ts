import { create } from "zustand";
import type { UiProduct } from "@/services/product.service";

export type CartItem = {
  product: UiProduct;
  // Quantity in kg the buyer wants to purchase.
  quantityKg: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: UiProduct, quantityKg?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantityKg: number) => void;
  clear: () => void;
  // Derived helpers (called from components; cheap to recompute).
  totalItems: () => number;
  subtotal: () => number;
};

// Clamp a requested quantity to at least 1kg and no more than the listing's
// available stock so a buyer can never order more than a farmer has.
const clampQty = (qty: number, available: number) => {
  const max = Math.max(1, Math.floor(available || 0));
  const q = Math.floor(qty);
  if (!Number.isFinite(q) || q < 1) return 1;
  return Math.min(q, max);
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantityKg = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        const next = clampQty(
          existing.quantityKg + quantityKg,
          product.quantityKg
        );
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantityKg: next } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { product, quantityKg: clampQty(quantityKg, product.quantityKg) },
        ],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  setQuantity: (productId, quantityKg) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId
          ? { ...i, quantityKg: clampQty(quantityKg, i.product.quantityKg) }
          : i
      ),
    })),

  clear: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantityKg, 0),

  subtotal: () =>
    get().items.reduce(
      (sum, i) => sum + i.product.pricePerKg * i.quantityKg,
      0
    ),
}));
