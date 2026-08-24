import { apiFetch } from "@/lib/axios";

// Line item shape the backend's placeOrderSchema expects.
export type OrderItemInput = {
  productId: string;
  quantityKg: number;
  unitPrice: number;
};

export type PlaceOrderInput = {
  items: OrderItemInput[];
  currency?: string;
  notes?: string;
  destinationName?: string;
  destinationAddress?: string;
  destinationPhone?: string;
  // Optional client-computed pricing overrides; backend recomputes otherwise.
  subtotalAmount?: number;
  taxAmount?: number;
  shippingAmount?: number;
  totalAmount?: number;
};

export const OrderService = {
  // Buyer places an order. Returns { ok, orderId, order, shipmentGroup, invoice }.
  createOrder: async (data: PlaceOrderInput) => {
    return apiFetch("/buyer/orders", {
      method: "POST",
      body: JSON.stringify({ currency: "USD", ...data }),
    });
  },

  // Buyer's own orders.
  getBuyerOrders: async () => {
    const res = await apiFetch("/buyer/orders");
    return res?.orders ?? [];
  },

  getBuyerOrder: async (orderId: string) => {
    const res = await apiFetch(`/buyer/orders/${orderId}`);
    return res?.order ?? null;
  },

  // Orders containing the authenticated farmer's products.
  getFarmerOrders: async () => {
    const res = await apiFetch("/farmer/orders");
    return res?.orders ?? [];
  },

  acceptOrder: async (orderId: string) => {
    return apiFetch(`/farmer/orders/${orderId}/accept`, { method: "POST" });
  },

  rejectOrder: async (orderId: string) => {
    return apiFetch(`/farmer/orders/${orderId}/reject`, { method: "POST" });
  },
};
