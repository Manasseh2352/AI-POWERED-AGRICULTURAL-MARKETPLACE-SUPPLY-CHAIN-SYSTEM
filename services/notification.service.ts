import { apiFetch } from "@/lib/axios";

// Notification types emitted by the backend (see notificationRepository).
export type NotificationType =
  | "CART_ITEM_ADDED"
  | "PAYMENT_SENT"
  | "ORDER_PLACED"
  | "PAYMENT_RECEIVED"
  | "ORDER_ACCEPTED"
  | "ORDER_PACKED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "ORDER_REJECTED"
  | "RECEIPT_CONFIRMED"
  | "ESCROW_RELEASED"
  | "WITHDRAWAL_REQUESTED";

// Shape returned by GET /{role}/notifications. Decimal-ish values inside `data`
// arrive as strings; coerce with Number() at the call site if needed.
export type AppNotification = {
  id: string;
  type: NotificationType | string;
  title: string;
  body: string;
  orderId?: string | null;
  data?: Record<string, any> | null;
  readAt?: string | null;
  createdAt: string;
};

export type NotificationList = {
  unreadCount: number;
  notifications: AppNotification[];
};

// Buyer and farmer share the same handlers (keyed on the authed user id); only
// the router prefix differs.
export type NotificationScope = "buyer" | "farmer";

const base = (scope: NotificationScope) => `/${scope}/notifications`;

export const NotificationService = {
  // List notifications (newest first) plus the current unread count.
  list: async (
    scope: NotificationScope,
    opts?: { limit?: number; offset?: number; unreadOnly?: boolean }
  ): Promise<NotificationList> => {
    const qs = new URLSearchParams();
    if (opts?.limit != null) qs.set("limit", String(opts.limit));
    if (opts?.offset != null) qs.set("offset", String(opts.offset));
    if (opts?.unreadOnly) qs.set("unread", "true");
    const suffix = qs.toString() ? `?${qs.toString()}` : "";

    const res = await apiFetch(`${base(scope)}${suffix}`);
    return {
      unreadCount: Number(res?.unreadCount ?? 0),
      notifications: Array.isArray(res?.notifications) ? res.notifications : [],
    };
  },

  unreadCount: async (scope: NotificationScope): Promise<number> => {
    const res = await apiFetch(`${base(scope)}/unread-count`);
    return Number(res?.unreadCount ?? 0);
  },

  markRead: async (scope: NotificationScope, id: string) => {
    return apiFetch(`${base(scope)}/${id}/read`, { method: "POST" });
  },

  markAllRead: async (scope: NotificationScope) => {
    return apiFetch(`${base(scope)}/read-all`, { method: "POST" });
  },

  // Buyer-only: record an "added to cart" notification (there is no server-side
  // cart, so the client reports the add). Best-effort — callers ignore failures.
  notifyCartItem: async (input: {
    productId: string;
    productName?: string;
    quantityKg?: number;
  }) => {
    return apiFetch(`/buyer/notifications/cart`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
