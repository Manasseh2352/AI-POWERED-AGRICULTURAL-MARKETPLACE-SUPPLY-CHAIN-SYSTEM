import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderService } from "@/services/order.service";

const num = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const STATUS_LABEL: Record<string, string> = {
  CREATED: "Awaiting Payment",
  CONFIRMED: "Confirmed",
  FULFILLING: "Processing",
  SHIPPED: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusStyle = (status: string) => {
  if (status === "CANCELLED") return { badge: "bg-rose-100", text: "text-rose-700", icon: "close-circle" as const };
  if (status === "DELIVERED") return { badge: "bg-emerald-100", text: "text-emerald-800", icon: "check-circle" as const };
  if (status === "SHIPPED") return { badge: "bg-indigo-100", text: "text-indigo-800", icon: "truck" as const };
  if (status === "CREATED") return { badge: "bg-amber-100", text: "text-amber-800", icon: "clock-outline" as const };
  return { badge: "bg-sky-100", text: "text-sky-800", icon: "package-variant" as const };
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const tabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export default function OrderHistory() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await OrderService.getBuyerOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load order history", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab === "all") return true;
      if (activeTab === "delivered") return o.status === "DELIVERED";
      if (activeTab === "cancelled") return o.status === "CANCELLED";
      if (activeTab === "active")
        return !["DELIVERED", "CANCELLED"].includes(o.status);
      return true;
    });
  }, [orders, activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#047857" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#047857" />
          }
        >
          <View className="px-5 pb-8">
            <View className="flex-row items-center justify-between pt-4">
              <Text className="text-2xl font-bold text-emerald-900">HarvestAI</Text>
              <TouchableOpacity
                onPress={() => router.push("/(buyer)/notifications")}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
              >
                <MaterialCommunityIcons name="bell-outline" size={20} color="#14532d" />
              </TouchableOpacity>
            </View>

            <Text className="mt-8 text-4xl font-bold text-slate-900">Order History</Text>
            <Text className="mt-2 text-sm text-slate-500">
              Track and manage your produce orders.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-6"
              contentContainerStyle={{ gap: 10 }}
            >
              {tabs.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    className={`rounded-full px-5 py-3 ${active ? "bg-emerald-900" : "bg-slate-200"}`}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        active ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {filteredOrders.length === 0 ? (
              <View className="mt-16 items-center justify-center">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5">
                  <MaterialCommunityIcons name="history" size={38} color="#9ca3af" />
                </View>
                <Text className="mt-6 text-lg font-semibold text-slate-700">
                  {orders.length === 0 ? "No orders yet" : "Nothing in this filter"}
                </Text>
                <Text className="mt-2 text-sm text-slate-500 text-center px-6">
                  {orders.length === 0
                    ? "Your order history will appear here once you place an order."
                    : "Try a different tab to see your other orders."}
                </Text>
              </View>
            ) : (
              <View className="mt-6 gap-5">
                {filteredOrders.map((order) => {
                  const style = statusStyle(order.status);
                  const groups = Array.isArray(order.shipmentGroups) ? order.shipmentGroups : [];
                  const allItems = groups.flatMap((g: any) => g.items ?? []);
                  const itemCount = allItems.length;
                  const paid =
                    Array.isArray(order.payments) &&
                    order.payments.some((p: any) => p?.status === "PAID");
                  const currency = order.currency ?? "USD";
                  const total = num(order.totalAmount);
                  const totalLabel = `${currency === "USD" ? "$" : ""}${total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`;

                  return (
                    <View
                      key={order.id}
                      className="overflow-hidden rounded-[32px] bg-white px-5 py-5 shadow-sm shadow-black/5"
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Order #{String(order.id).slice(0, 8).toUpperCase()}
                        </Text>
                        <View className={`rounded-full px-3 py-1 flex-row items-center gap-1 ${style.badge}`}>
                          <MaterialCommunityIcons name={style.icon} size={13} color="#334155" />
                          <Text className={`text-xs font-semibold ${style.text}`}>
                            {STATUS_LABEL[order.status] ?? order.status}
                          </Text>
                        </View>
                      </View>

                      <View className="mt-4 flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-sm text-slate-500">{formatDate(order.createdAt)}</Text>
                          <Text className="mt-1 text-sm text-slate-500">
                            {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
                            {paid ? "Paid" : "Payment pending"}
                          </Text>
                        </View>
                        <Text className="text-2xl font-bold text-emerald-900">{totalLabel}</Text>
                      </View>

                      <View className="mt-5 flex-row gap-3">
                        {!paid && order.status !== "CANCELLED" ? (
                          <TouchableOpacity
                            onPress={() => router.push(`/(buyer)/payment?orderId=${order.id}`)}
                            className="flex-1 rounded-full bg-emerald-900 px-4 py-3"
                          >
                            <Text className="text-center text-sm font-semibold text-white">
                              Complete Payment
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => router.push("/(buyer)/orders/current")}
                            className="flex-1 rounded-full border border-emerald-800 px-4 py-3"
                          >
                            <Text className="text-center text-sm font-semibold text-emerald-900">
                              Track Order
                            </Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => router.push("/(buyer)/marketplace")}
                          className="flex-1 rounded-full bg-slate-100 px-4 py-3"
                        >
                          <Text className="text-center text-sm font-semibold text-slate-700">
                            Buy Again
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
