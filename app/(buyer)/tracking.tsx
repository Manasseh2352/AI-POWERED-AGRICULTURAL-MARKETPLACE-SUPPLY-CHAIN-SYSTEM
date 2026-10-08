import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderService } from "@/services/order.service";

const STAGES = [
  { key: "PENDING", label: "Order confirmed", detail: "Your order was placed and confirmed." },
  { key: "PACKED", label: "Packed", detail: "Your produce has been packed for dispatch." },
  { key: "SHIPPED", label: "In transit", detail: "DHL is moving your package to the destination." },
  { key: "DELIVERED", label: "Delivered", detail: "The parcel has been delivered successfully." },
];

const statusIndex = (status?: string) => {
  if (!status) return 0;
  const map: Record<string, number> = { PENDING: 0, PACKED: 1, SHIPPED: 2, DELIVERED: 3, CANCELLED: 0 };
  return map[status] ?? 0;
};

const statusLabel = (status?: string) => {
  if (status === "DELIVERED") return "Delivered";
  if (status === "SHIPPED") return "In transit";
  if (status === "PACKED") return "Packed";
  if (status === "CANCELLED") return "Cancelled";
  return "Awaiting dispatch";
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

export default function Tracking() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const result = await OrderService.getBuyerOrder(orderId);
        if (isMounted) setOrder(result);
      } catch (error) {
        console.error("Failed to load order tracking", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const shipment = useMemo(() => {
    if (!order || !Array.isArray(order.shipmentGroups) || order.shipmentGroups.length === 0) {
      return null;
    }
    return order.shipmentGroups[0];
  }, [order]);

  const currentStatus = shipment?.status ?? "PENDING";
  const progressIndex = statusIndex(currentStatus);
  const trackingNumber = shipment?.trackingNumber ?? "DHL-NEW";
  const carrier = shipment?.carrier ?? "DHL";

  if (!orderId) {
    return (
      <SafeAreaView className="flex-1 bg-[#f4f7ef] px-5 pt-6">
        <Text className="text-xl font-bold text-slate-900">Tracking unavailable</Text>
        <Text className="mt-2 text-sm text-slate-500">No order was provided for shipment tracking.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 rounded-3xl bg-emerald-900 px-5 py-4"
        >
          <Text className="text-center text-base font-semibold text-white">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <MaterialCommunityIcons name="arrow-left" size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-slate-900">Shipment tracking</Text>
          <View className="h-10 w-10" />
        </View>

        {loading ? (
          <View className="mt-20 items-center justify-center">
            <ActivityIndicator size="large" color="#047857" />
          </View>
        ) : (
          <>
            <View className="mt-6 overflow-hidden rounded-[30px] bg-emerald-900 p-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200">{carrier}</Text>
                  <Text className="mt-3 text-2xl font-bold text-white">{trackingNumber}</Text>
                </View>
                <View className="rounded-full bg-white/10 p-3">
                  <MaterialCommunityIcons name="truck-fast" size={28} color="#d1fae5" />
                </View>
              </View>

              <View className="mt-5 flex-row items-center justify-between">
                <Text className="text-sm text-emerald-100">Current status</Text>
                <Text className="text-base font-bold text-white">{statusLabel(currentStatus)}</Text>
              </View>
            </View>

            <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-slate-500">Delivery progress</Text>
                <Text className="text-sm font-bold text-emerald-900">{Math.min(100, (progressIndex / 3) * 100).toFixed(0)}%</Text>
              </View>
              <View className="mt-4 h-2 rounded-full bg-slate-200">
                <View
                  className="h-2 rounded-full bg-emerald-700"
                  style={{ width: `${Math.min(100, (progressIndex / 3) * 100)}%` }}
                />
              </View>

              <View className="mt-5 gap-4">
                {STAGES.map((stage, index) => {
                  const isCurrent = index === progressIndex && currentStatus !== "CANCELLED";
                  const isDone = index < progressIndex && currentStatus !== "CANCELLED";

                  return (
                    <View key={stage.key} className="flex-row gap-3">
                      <View className="items-center">
                        <View
                          className={`h-5 w-5 rounded-full border-2 ${
                            isDone ? "border-emerald-700 bg-emerald-700" : isCurrent ? "border-emerald-700 bg-white" : "border-slate-300 bg-slate-100"
                          }`}
                        />
                        {index !== STAGES.length - 1 && (
                          <View className={`mt-2 h-9 w-0.5 ${isDone ? "bg-emerald-700" : "bg-slate-200"}`} />
                        )}
                      </View>

                      <View className="flex-1 pb-2">
                        <Text className={`text-base font-bold ${isCurrent || isDone ? "text-slate-900" : "text-slate-500"}`}>
                          {stage.label}
                        </Text>
                        <Text className="mt-1 text-sm text-slate-500">{stage.detail}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
              <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Shipment details</Text>
              <View className="mt-4 gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-slate-500">Carrier</Text>
                  <Text className="font-semibold text-slate-800">{carrier}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-500">Tracking number</Text>
                  <Text className="font-semibold text-slate-800">{trackingNumber}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-500">Destination</Text>
                  <Text className="font-semibold text-slate-800">{shipment?.destinationCountry ?? "—"}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-500">Last update</Text>
                  <Text className="font-semibold text-slate-800">{formatDate(shipment?.updatedAt ?? shipment?.createdAt)}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
