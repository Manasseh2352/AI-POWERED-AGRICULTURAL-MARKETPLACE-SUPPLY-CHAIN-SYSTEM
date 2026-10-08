// Notification presentation helpers shared by the buyer and farmer notification
// screens. The data/network layer lives in services/notification.service.ts;
// this module only maps a notification type to an icon + colours and formats a
// compact relative timestamp.
import type MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";

import type { AppNotification } from "@/services/notification.service";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type NotificationVisual = {
  icon: IconName;
  color: string; // icon tint
  bg: string; // icon container background
};

const DEFAULT_VISUAL: NotificationVisual = {
  icon: "bell-outline",
  color: "#4b5563",
  bg: "#f3f4f6",
};

const VISUALS: Record<string, NotificationVisual> = {
  CART_ITEM_ADDED: { icon: "cart-plus", color: "#0369a1", bg: "#e0f2fe" },
  PAYMENT_SENT: { icon: "credit-card-check-outline", color: "#047857", bg: "#d1fae5" },
  PAYMENT_RECEIVED: { icon: "cash-plus", color: "#047857", bg: "#d1fae5" },
  ORDER_PLACED: { icon: "clipboard-list-outline", color: "#7c3aed", bg: "#ede9fe" },
  ORDER_ACCEPTED: { icon: "check-circle-outline", color: "#047857", bg: "#d1fae5" },
  ORDER_PACKED: { icon: "package-variant-closed", color: "#0369a1", bg: "#e0f2fe" },
  ORDER_SHIPPED: { icon: "truck-fast-outline", color: "#4338ca", bg: "#e0e7ff" },
  ORDER_DELIVERED: { icon: "check-all", color: "#047857", bg: "#d1fae5" },
  ORDER_REJECTED: { icon: "close-circle-outline", color: "#b91c1c", bg: "#fee2e2" },
  RECEIPT_CONFIRMED: { icon: "hand-coin-outline", color: "#047857", bg: "#d1fae5" },
  ESCROW_RELEASED: { icon: "cash-check", color: "#047857", bg: "#d1fae5" },
  WITHDRAWAL_REQUESTED: { icon: "bank-transfer-out", color: "#a16207", bg: "#fef3c7" },
};

export const notificationVisual = (type: string): NotificationVisual =>
  VISUALS[type] ?? DEFAULT_VISUAL;

export const isUnread = (n: Pick<AppNotification, "readAt">): boolean => !n.readAt;

// Compact relative time: "just now", "5m", "3h", "2d", else a short date.
export const formatNotificationTime = (iso?: string): string => {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diffMs = Date.now() - then;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};
