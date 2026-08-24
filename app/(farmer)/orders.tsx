import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
import { OrderService } from "@/services/order.service";
import { useMoney } from "@/lib/useMoney";

const num = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

type StatusMeta = {
  label: string;
  color: string;
  bg: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const STATUS_META: Record<string, StatusMeta> = {
  CREATED: { label: "Awaiting Approval", color: "#92400e", bg: "#fef3c7", icon: "clock-outline" },
  CONFIRMED: { label: "Confirmed", color: "#047857", bg: "#d1fae5", icon: "check-circle-outline" },
  FULFILLING: { label: "Processing", color: "#0369a1", bg: "#e0f2fe", icon: "package-variant" },
  SHIPPED: { label: "In Transit", color: "#4338ca", bg: "#e0e7ff", icon: "truck-delivery" },
  DELIVERED: { label: "Delivered", color: "#047857", bg: "#d1fae5", icon: "check-all" },
  CANCELLED: { label: "Rejected", color: "#b91c1c", bg: "#fee2e2", icon: "close-circle-outline" },
};

const statusMeta = (status: string): StatusMeta => STATUS_META[status] ?? STATUS_META.CREATED;

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

export default function FarmerOrders() {
  const { format } = useMoney();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setError(null);
      const data = await OrderService.getFarmerOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch orders");
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const handleAccept = (orderId: string) => {
    Alert.alert("Accept order", "Confirm this order and reserve the produce for shipment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          setActingId(orderId);
          try {
            await OrderService.acceptOrder(orderId);
            await fetchOrders();
          } catch (err: any) {
            Alert.alert("Could not accept", err?.message || "Please try again.");
          } finally {
            setActingId(null);
          }
        },
      },
    ]);
  };

  const handleReject = (orderId: string) => {
    Alert.alert("Reject order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          setActingId(orderId);
          try {
            await OrderService.rejectOrder(orderId);
            await fetchOrders();
          } catch (err: any) {
            Alert.alert("Could not reject", err?.message || "Please try again.");
          } finally {
            setActingId(null);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="bg-emerald-800 px-4 pt-14 pb-6">
        <Text className="text-2xl font-bold text-white">Orders</Text>
        <Text className="text-emerald-100 mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#047857" />
        }
        className="flex-1"
      >
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#047857" />
            <Text className="text-gray-500 mt-4">Loading orders...</Text>
          </View>
        ) : error ? (
          <View className="mx-4 mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-red-800 font-semibold">Error</Text>
            <Text className="text-red-700 mt-2">{error}</Text>
            <TouchableOpacity
              onPress={fetchOrders}
              className="mt-4 bg-red-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialCommunityIcons name="inbox-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-600 font-semibold mt-4">No orders yet</Text>
            <Text className="text-gray-500 mt-2 text-center px-8">
              Your orders will appear here once buyers purchase from you
            </Text>
          </View>
        ) : (
          <View className="px-4 py-4">
            {orders.map((order) => {
              const meta = statusMeta(order.status);
              const groups = Array.isArray(order.shipmentGroups) ? order.shipmentGroups : [];
              const items = groups.flatMap((g: any) => g.items ?? []);
              const itemCount = items.length;
              const paid =
                Array.isArray(order.payments) &&
                order.payments.some((p: any) => p?.status === "PAID");
              const total = num(order.totalAmount);
              const totalLabel = format(total);
              const isPending = order.status === "CREATED";
              const busy = actingId === order.id;

              return (
                <View
                  key={order.id}
                  className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
                >
                  {/* ORDER HEADER */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm">Order ID</Text>
                      <Text className="text-gray-900 font-semibold mt-1">
                        {String(order.id).slice(0, 8).toUpperCase()}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-500 text-sm">Amount</Text>
                      <Text className="text-emerald-700 font-bold text-lg mt-1">{totalLabel}</Text>
                    </View>
                  </View>

                  {/* DIVIDER */}
                  <View className="h-px bg-gray-100 mb-3" />

                  {/* STATUS BADGES */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <View
                      style={{ backgroundColor: meta.bg }}
                      className="px-3 py-1 rounded-full flex-row items-center gap-1"
                    >
                      <MaterialCommunityIcons name={meta.icon} size={13} color={meta.color} />
                      <Text style={{ color: meta.color }} className="font-semibold text-xs">
                        {meta.label}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialCommunityIcons
                        name={paid ? "check-circle" : "clock-outline"}
                        size={14}
                        color={paid ? "#10B981" : "#F59E0B"}
                      />
                      <Text className="text-gray-600 text-xs">
                        {paid ? "Paid" : "Payment pending"}
                      </Text>
                    </View>
                  </View>

                  {/* ITEMS */}
                  {items.slice(0, 3).map((it: any) => (
                    <View key={it.id} className="flex-row items-center justify-between py-1">
                      <Text className="text-sm text-gray-600 flex-1 pr-3" numberOfLines={1}>
                        {it.product?.productName ? titleCase(it.product.productName) : "Item"} ·{" "}
                        {num(it.quantity)}
                        {it.unit ?? "kg"}
                      </Text>
                      <Text className="text-sm font-semibold text-gray-800">
                        {format(num(it.lineTotal))}
                      </Text>
                    </View>
                  ))}

                  {/* ITEMS COUNT & DATE */}
                  <View className="flex-row items-center justify-between mt-3">
                    <View className="flex-row items-center gap-1">
                      <MaterialCommunityIcons name="package-variant" size={14} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-500">{formatDate(order.createdAt)}</Text>
                  </View>

                  {/* ACCEPT / REJECT (only while awaiting approval) */}
                  {isPending && (
                    <View className="flex-row gap-3 mt-4">
                      <TouchableOpacity
                        onPress={() => handleReject(order.id)}
                        disabled={busy}
                        className="flex-1 rounded-full border border-rose-300 py-3 items-center justify-center"
                      >
                        {busy ? (
                          <ActivityIndicator color="#b91c1c" />
                        ) : (
                          <Text className="text-sm font-semibold text-rose-700">Reject</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleAccept(order.id)}
                        disabled={busy}
                        className="flex-1 rounded-full bg-emerald-800 py-3 items-center justify-center"
                      >
                        {busy ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text className="text-sm font-semibold text-white">Accept</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
