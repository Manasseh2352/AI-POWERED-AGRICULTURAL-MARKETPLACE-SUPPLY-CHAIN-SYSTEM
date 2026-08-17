import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

type StatusMeta = {
  label: string;
  badge: string;
  text: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  progress: number;
};

const STATUS_META: Record<string, StatusMeta> = {
  CREATED: { label: "Awaiting Payment", badge: "bg-amber-100", text: "text-amber-800", icon: "clock-outline", progress: 15 },
  CONFIRMED: { label: "Confirmed", badge: "bg-emerald-100", text: "text-emerald-800", icon: "check-circle-outline", progress: 40 },
  FULFILLING: { label: "Being Processed", badge: "bg-sky-100", text: "text-sky-800", icon: "package-variant", progress: 60 },
  SHIPPED: { label: "In Transit", badge: "bg-indigo-100", text: "text-indigo-800", icon: "truck-delivery", progress: 80 },
  DELIVERED: { label: "Delivered", badge: "bg-emerald-100", text: "text-emerald-800", icon: "check-all", progress: 100 },
  CANCELLED: { label: "Cancelled", badge: "bg-rose-100", text: "text-rose-700", icon: "close-circle-outline", progress: 0 },
};

const statusMeta = (status: string): StatusMeta =>
  STATUS_META[status] ?? STATUS_META.CREATED;

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

export default function CurrentOrders() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await OrderService.getBuyerOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load orders", err);
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

            <Text className="mt-8 text-4xl font-bold text-slate-900">Your Orders</Text>
            <Text className="mt-2 text-sm text-slate-500">
              {orders.length > 0
                ? `Tracking ${orders.length} order${orders.length === 1 ? "" : "s"}.`
                : "Your placed orders will appear here."}
            </Text>

            {orders.length === 0 ? (
              <View className="mt-16 items-center justify-center">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5">
                  <MaterialCommunityIcons name="package-variant-closed" size={38} color="#9ca3af" />
                </View>
                <Text className="mt-6 text-lg font-semibold text-slate-700">No orders yet</Text>
                <Text className="mt-2 text-sm text-slate-500 text-center px-6">
                  Browse the marketplace and place your first order.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(buyer)/marketplace")}
                  className="mt-8 rounded-3xl bg-emerald-900 px-8 py-4"
                >
                  <Text className="text-base font-semibold text-white">Browse marketplace</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mt-6 gap-5">
                {orders.map((order) => {
                  const meta = statusMeta(order.status);
                  const groups = Array.isArray(order.shipmentGroups) ? order.shipmentGroups : [];
                  const allItems = groups.flatMap((g: any) => g.items ?? []);
                  const itemCount = allItems.length;
                  const totalKg = allItems.reduce((s: number, it: any) => s + num(it.quantity), 0);
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
                      className="overflow-hidden rounded-[32px] bg-white p-5 shadow-sm shadow-black/5"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-lg font-bold text-slate-900">
                            Order #{String(order.id).slice(0, 8).toUpperCase()}
                          </Text>
                          <Text className="text-sm text-slate-500">
                            {formatDate(order.createdAt)} · {itemCount} item
                            {itemCount === 1 ? "" : "s"} · {totalKg}kg
                          </Text>
                        </View>
                        <View className={`rounded-full px-3 py-1.5 flex-row items-center gap-1 ${meta.badge}`}>
                          <MaterialCommunityIcons name={meta.icon} size={14} color="#334155" />
                          <Text className={`text-xs font-bold ${meta.text}`}>{meta.label}</Text>
                        </View>
                      </View>

                      {/* Progress */}
                      <View className="mt-5">
                        <View className="h-2 rounded-full bg-slate-200">
                          <View
                            className={`h-full rounded-full ${
                              order.status === "CANCELLED" ? "bg-rose-500" : "bg-emerald-700"
                            }`}
                            style={{ width: `${meta.progress}%` }}
                          />
                        </View>
                      </View>

                      <View className="mt-5 flex-row items-center justify-between">
                        <View>
                          <Text className="text-xs uppercase tracking-[0.15em] text-slate-400">
                            Total
                          </Text>
                          <Text className="text-2xl font-bold text-emerald-900">{totalLabel}</Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                          <MaterialCommunityIcons
                            name={paid ? "check-circle" : "credit-card-clock-outline"}
                            size={18}
                            color={paid ? "#047857" : "#a16207"}
                          />
                          <Text
                            className={`text-sm font-semibold ${
                              paid ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            {paid ? "Paid" : "Payment pending"}
                          </Text>
                        </View>
                      </View>

                      {!paid && order.status !== "CANCELLED" && (
                        <TouchableOpacity
                          onPress={() => router.push(`/(buyer)/payment?orderId=${order.id}`)}
                          className="mt-5 rounded-3xl bg-emerald-900 px-5 py-4 items-center justify-center"
                        >
                          <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name="lock" size={16} color="#fff" />
                            <Text className="text-base font-semibold text-white">Complete Payment</Text>
                          </View>
                        </TouchableOpacity>
                      )}
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
