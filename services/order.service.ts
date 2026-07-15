import { apiFetch } from "@/lib/axios";

export const OrderService = {
  createOrder: async (data: any) => {
    const response = await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  getAllOrders: async () => {
    const response = await apiFetch("/orders");
    return response;
  },

  getFarmerOrders: async () => {
    const response = await apiFetch("/farmer/orders");
    return response;
  },

  getOrderById: async (id: string) => {
    const response = await apiFetch(`/orders/${id}`);
    return response;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await apiFetch(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response;
  },
};
