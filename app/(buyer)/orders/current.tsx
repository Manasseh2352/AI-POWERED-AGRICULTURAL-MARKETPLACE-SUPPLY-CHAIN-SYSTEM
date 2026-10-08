import { useMoney } from "@/lib/useMoney";
import { OrderService } from "@/services/order.service";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  CREATED: {
    label: "Awaiting Payment",
    badge: "bg-amber-100",
    text: "text-amber-800",
    icon: "clock-outline",
    progress: 15,
  },
  CONFIRMED: {
    label: "Confirmed",
    badge: "bg-emerald-100",
    text: "text-emerald-800",
    icon: "check-circle-outline",
    progress: 40,
  },
  FULFILLING: {
    label: "Being Processed",
    badge: "bg-sky-100",
    text: "text-sky-800",
    icon: "package-variant",
    progress: 60,
  },
  SHIPPED: {
    label: "In Transit",
    badge: "bg-indigo-100",
    text: "text-indigo-800",
    icon: "truck-delivery",
    progress: 80,
  },
  DELIVERED: {
    label: "Delivered",
    badge: "bg-emerald-100",
    text: "text-emerald-800",
    icon: "check-all",
    progress: 100,
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-rose-100",
    text: "text-rose-700",
    icon: "close-circle-outline",
    progress: 0,
  },
};

const statusMeta = (status: string): StatusMeta =>
  STATUS_META[status] ?? STATUS_META.CREATED;

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function CurrentOrders() {
  const router = useRouter();
  const { format } = useMoney();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

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

  const handleDeleteOrder = async (orderId: string) => {
    Alert.alert(
      "Delete unpaid order?",
      "This action cannot be undone. The order will be removed if payment has not been completed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingOrderId(orderId);
            try {
              await OrderService.deleteOrder(orderId);
              await loadOrders();
              Alert.alert("Order deleted", "The unpaid order has been removed.");
            } catch (error: any) {
              Alert.alert("Unable to delete order", error?.message || "Please try again.");
            } finally {
              setDeletingOrderId(null);
            }
          },
        },
      ]
    );
  };

  const handleConfirmReceipt = async (orderId: string) => {
    Alert.alert(
      "Confirm receipt?",
      "Only confirm once you've received your order. This releases payment from escrow to the farmer and can't be undone.",
      [
        { text: "Not yet", style: "cancel" },
        {
          text: "Confirm receipt",
          onPress: async () => {
            setConfirmingOrderId(orderId);
            try {
              await OrderService.confirmReceived(orderId);
              await loadOrders();
              Alert.alert(
                "Receipt confirmed",
                "Thanks! We've released the payment to the farmer."
              );
            } catch (error: any) {
              Alert.alert(
                "Unable to confirm receipt",
                error?.message || "Please try again."
              );
            } finally {
              setConfirmingOrderId(null);
            }
          },
        },
      ]
    );
  };

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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#047857"
            />
          }
        >
          <View className="px-5 pb-8">
            <View className="flex-row items-center justify-between pt-4">
              <Text className="text-2xl font-bold text-emerald-900">
                HarvestAI
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(buyer)/notifications")}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={20}
                  color="#14532d"
                />
              </TouchableOpacity>
            </View>

            <Text className="mt-8 text-4xl font-bold text-slate-900">
              Your Orders
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              {orders.length > 0
                ? `Tracking ${orders.length} order${orders.length === 1 ? "" : "s"}.`
                : "Your placed orders will appear here."}
            </Text>

            {orders.length === 0 ? (
              <View className="mt-16 items-center justify-center">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5">
                  <MaterialCommunityIcons
                    name="package-variant-closed"
                    size={38}
                    color="#9ca3af"
                  />
                </View>
                <Text className="mt-6 text-lg font-semibold text-slate-700">
                  No orders yet
                </Text>
                <Text className="mt-2 text-sm text-slate-500 text-center px-6">
                  Browse the marketplace and place your first order.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(buyer)/marketplace")}
                  className="mt-8 rounded-3xl bg-emerald-900 px-8 py-4"
                >
                  <Text className="text-base font-semibold text-white">
                    Browse marketplace
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mt-6 gap-5">
                {orders.map((order) => {
                  const meta = statusMeta(order.status);
                  const groups = Array.isArray(order.shipmentGroups)
                    ? order.shipmentGroups
                    : [];
                  const allItems = groups.flatMap((g: any) => g.items ?? []);
                  const itemCount = allItems.length;
                  const totalKg = allItems.reduce(
                    (s: number, it: any) => s + num(it.quantity),
                    0,
                  );
                  const paid =
                    Array.isArray(order.payments) &&
                    order.payments.some((p: any) => p?.status === "PAID");
                  const total = num(order.totalAmount);
                  const totalLabel = format(total);
                  const delivered = order.status === "DELIVERED";
                  const receiptConfirmed = !!order.receiptConfirmedAt;

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
                        <View
                          className={`rounded-full px-3 py-1.5 flex-row items-center gap-1 ${meta.badge}`}
                        >
                          <MaterialCommunityIcons
                            name={meta.icon}
                            size={14}
                            color="#334155"
                          />
                          <Text className={`text-xs font-bold ${meta.text}`}>
                            {meta.label}
                          </Text>
                        </View>
                      </View>

                      {/* Delivered → prompt buyer to confirm receipt */}
                      {delivered && !receiptConfirmed && (
                        <View className="mt-4 flex-row items-center gap-1.5 self-start rounded-full bg-amber-100 px-3 py-1.5">
                          <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={14}
                            color="#a16207"
                          />
                          <Text className="text-xs font-bold text-amber-800">
                            Action needed · Confirm receipt
                          </Text>
                        </View>
                      )}
                      {receiptConfirmed && (
                        <View className="mt-4 flex-row items-center gap-1.5 self-start rounded-full bg-emerald-100 px-3 py-1.5">
                          <MaterialCommunityIcons
                            name="check-decagram"
                            size={14}
                            color="#047857"
                          />
                          <Text className="text-xs font-bold text-emerald-800">
                            Receipt confirmed
                          </Text>
                        </View>
                      )}

                      {/* Progress */}
                      <View className="mt-5">
                        <View className="h-2 rounded-full bg-slate-200">
                          <View
                            className={`h-full rounded-full ${
                              order.status === "CANCELLED"
                                ? "bg-rose-500"
                                : "bg-emerald-700"
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
                          <Text className="text-2xl font-bold text-emerald-900">
                            {totalLabel}
                          </Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                          <MaterialCommunityIcons
                            name={
                              paid
                                ? "check-circle"
                                : "credit-card-clock-outline"
                            }
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
                        <View className="mt-5 gap-3">
                          <TouchableOpacity
                            onPress={() =>
                              router.push(`/(buyer)/payment?orderId=${order.id}`)
                            }
                            className="rounded-3xl bg-emerald-900 px-5 py-4 items-center justify-center"
                          >
                            <View className="flex-row items-center gap-2">
                              <MaterialCommunityIcons
                                name="lock"
                                size={16}
                                color="#fff"
                              />
                              <Text className="text-base font-semibold text-white">
                                Complete Payment
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleDeleteOrder(order.id)}
                            disabled={deletingOrderId === order.id}
                            className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-3 items-center justify-center"
                          >
                            <Text className="text-base font-semibold text-rose-700">
                              {deletingOrderId === order.id ? "Deleting..." : "Delete order"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {paid && order.status !== "CANCELLED" && (
                        <TouchableOpacity
                          onPress={() =>
                            router.push(`/(buyer)/tracking?orderId=${order.id}`)
                          }
                          className="mt-3 rounded-3xl border border-emerald-800 bg-emerald-50 px-5 py-3 items-center justify-center"
                        >
                          <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons
                              name="truck-fast"
                              size={16}
                              color="#14532d"
                            />
                            <Text className="text-base font-semibold text-emerald-900">
                              Track shipment
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}

                      {delivered && !receiptConfirmed && (
                        <TouchableOpacity
                          onPress={() => handleConfirmReceipt(order.id)}
                          disabled={confirmingOrderId === order.id}
                          className="mt-3 rounded-3xl bg-emerald-900 px-5 py-4 items-center justify-center"
                        >
                          {confirmingOrderId === order.id ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <View className="flex-row items-center gap-2">
                              <MaterialCommunityIcons
                                name="hand-coin"
                                size={16}
                                color="#fff"
                              />
                              <Text className="text-base font-semibold text-white">
                                Confirm receipt
                              </Text>
                            </View>
                          )}
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
