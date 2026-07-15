import { apiFetch } from "@/lib/axios";
import { useLoadingStore } from "@/store/loadingStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  createdAt: string;
  items?: any[];
}

export default function FarmerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const setGlobalLoading = useLoadingStore((s) => s.setLoading);

  const fetchOrders = async () => {
    try {
      setError(null);
      const response = await apiFetch("/farmer/orders");

      if (response.error) {
        setError(response.error);
        setOrders([]);
      } else {
        setOrders(response.data || []);
      }
    } catch (err: any) {
      setError("Failed to fetch orders");
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#F59E0B",
      confirmed: "#3B82F6",
      shipped: "#8B5CF6",
      delivered: "#10B981",
      cancelled: "#EF4444",
    };
    return colors[status] || "#6B7280";
  };

  const getPaymentStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: "clock-outline",
      completed: "check-circle",
      failed: "alert-circle",
      refunded: "history",
    };
    return icons[status] || "help-circle";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="bg-emerald-800 px-4 py-6">
        <Text className="text-2xl font-bold text-white">Orders</Text>
        <Text className="text-emerald-100 mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
      >
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialCommunityIcons
              name="package-multiple"
              size={48}
              color="#9CA3AF"
            />
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
              <Text className="text-white font-semibold text-center">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialCommunityIcons
              name="inbox-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text className="text-gray-600 font-semibold mt-4">
              No orders yet
            </Text>
            <Text className="text-gray-500 mt-2 text-center px-8">
              Your orders will appear here once buyers purchase from you
            </Text>
          </View>
        ) : (
          <View className="px-4 py-4">
            {orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-lg p-4 mb-3 border border-gray-100 shadow-sm"
              >
                {/* ORDER HEADER */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm">Order ID</Text>
                    <Text className="text-gray-900 font-semibold mt-1">
                      {order.id.slice(0, 8).toUpperCase()}...
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-500 text-sm">Amount</Text>
                    <Text className="text-emerald-700 font-bold text-lg mt-1">
                      ₦{order.totalAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* DIVIDER */}
                <View className="h-px bg-gray-100 mb-3" />

                {/* STATUS BADGES */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2 flex-1">
                    <View
                      style={{
                        backgroundColor: getStatusColor(order.status) + "20",
                      }}
                      className="px-3 py-1 rounded-full"
                    >
                      <Text
                        style={{ color: getStatusColor(order.status) }}
                        className="font-semibold text-xs"
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                      <MaterialCommunityIcons
                        name={getPaymentStatusIcon(order.paymentStatus)}
                        size={14}
                        color={
                          order.paymentStatus === "completed"
                            ? "#10B981"
                            : "#F59E0B"
                        }
                      />
                      <Text className="text-gray-600 text-xs capitalize">
                        {order.paymentStatus}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ITEMS COUNT & DATE */}
                <View className="flex-row items-center justify-between text-xs text-gray-500">
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="package-multiple"
                      size={14}
                      color="#9CA3AF"
                    />
                    <Text>
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1 ? "item" : "items"}
                    </Text>
                  </View>
                  <Text>{formatDate(order.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
