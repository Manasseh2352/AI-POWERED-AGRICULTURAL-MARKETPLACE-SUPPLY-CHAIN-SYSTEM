import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { OrderService } from "@/services/order.service";
import { WalletService, type Wallet } from "@/services/wallet.service";
import { useMoney } from "@/lib/useMoney";

const num = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const isPaid = (order: any) =>
  Array.isArray(order?.payments) && order.payments.some((p: any) => p?.status === "PAID");

const orderItems = (order: any): any[] => {
  const groups = Array.isArray(order?.shipmentGroups) ? order.shipmentGroups : [];
  return groups.flatMap((g: any) => g.items ?? []);
};

// Farmer revenue = sum of produce line totals (excludes buyer-side shipping/tax).
const produceRevenue = (order: any) =>
  orderItems(order).reduce((s, it) => s + num(it.lineTotal), 0);

const unitsInOrder = (order: any) =>
  orderItems(order).reduce((s, it) => s + num(it.quantity), 0);

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const STATUS_LABEL: Record<string, string> = {
  CREATED: "Awaiting approval",
  CONFIRMED: "Confirmed",
  FULFILLING: "Processing",
  SHIPPED: "In transit",
  DELIVERED: "Delivered",
  CANCELLED: "Rejected",
};

export default function Earnings() {
  const router = useRouter();
  const { format } = useMoney();

  const [orders, setOrders] = useState<any[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const loadOrders = async () => {
    try {
      const [data, walletData] = await Promise.all([
        OrderService.getFarmerOrders(),
        WalletService.getWallet().catch(() => null),
      ]);
      setOrders(Array.isArray(data) ? data : []);
      setWallet(walletData);
    } catch (err) {
      console.error("Failed to load earnings", err);
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

  const available = num(wallet?.availableBalance);
  const escrow = num(wallet?.escrowBalance);

  const handleWithdraw = () => {
    if (withdrawing) return;
    if (available <= 0) {
      Alert.alert(
        "Nothing to withdraw",
        "Your available balance is empty. Funds are released once buyers confirm they've received their orders."
      );
      return;
    }
    Alert.alert(
      "Withdraw funds",
      `Request a payout of ${money(available)} from your available balance?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Withdraw",
          onPress: async () => {
            setWithdrawing(true);
            try {
              const res = await WalletService.requestWithdrawal(available);
              if (res?.wallet) setWallet(res.wallet);
              Alert.alert(
                "Withdrawal requested",
                `${money(available)} is on its way to your account.`
              );
            } catch (error: any) {
              Alert.alert(
                "Withdrawal failed",
                error?.message || "Please try again in a moment."
              );
            } finally {
              setWithdrawing(false);
            }
          },
        },
      ]
    );
  };

  const stats = useMemo(() => {
    let earned = 0;
    let pending = 0;
    let unitsSold = 0;
    let paidCount = 0;

    for (const o of orders) {
      if (o.status === "CANCELLED") continue;
      const rev = produceRevenue(o);
      if (isPaid(o)) {
        earned += rev;
        unitsSold += unitsInOrder(o);
        paidCount += 1;
      } else {
        pending += rev;
      }
    }
    return { earned, pending, unitsSold, paidCount };
  }, [orders]);

  const money = (n: number) => format(n);

  const recent = useMemo(
    () => orders.filter((o) => o.status !== "CANCELLED").slice(0, 12),
    [orders]
  );

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
              <Text className="text-2xl font-bold text-emerald-900">Sales & Earnings</Text>
              <TouchableOpacity
                onPress={() => router.push("/(ai)/insight")}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
              >
                <MaterialCommunityIcons name="chart-line" size={20} color="#14532d" />
              </TouchableOpacity>
            </View>

            {/* HERO — total earned */}
            <View className="mt-6 rounded-[32px] bg-emerald-900 p-6 shadow-sm shadow-black/10">
              <Text className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200">
                Total Earned
              </Text>
              <Text className="mt-3 text-5xl font-bold text-white">{money(stats.earned)}</Text>
              <View className="mt-4 flex-row items-center gap-2">
                <View className="rounded-full bg-emerald-700 px-3 py-1">
                  <Text className="text-xs font-semibold text-emerald-50">
                    {stats.paidCount} paid {stats.paidCount === 1 ? "order" : "orders"}
                  </Text>
                </View>
                <View className="rounded-full bg-emerald-700 px-3 py-1">
                  <Text className="text-xs font-semibold text-emerald-50">
                    {Math.round(stats.unitsSold).toLocaleString()} kg sold
                  </Text>
                </View>
              </View>
            </View>

            {/* WALLET — available + escrow balances */}
            <View className="mt-4 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                    <MaterialCommunityIcons
                      name="wallet-outline"
                      size={18}
                      color="#047857"
                    />
                  </View>
                  <Text className="text-base font-semibold text-slate-900">
                    Wallet
                  </Text>
                </View>
                <Text className="text-xs font-medium text-slate-400">
                  {wallet?.currency ?? "USD"}
                </Text>
              </View>

              <View className="mt-5 flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs uppercase tracking-widest text-slate-400">
                    Available
                  </Text>
                  <Text className="mt-1 text-2xl font-bold text-emerald-900">
                    {money(available)}
                  </Text>
                  <Text className="text-xs text-slate-400">withdrawable</Text>
                </View>
                <View className="w-px bg-slate-100" />
                <View className="flex-1">
                  <Text className="text-xs uppercase tracking-widest text-slate-400">
                    In escrow
                  </Text>
                  <Text className="mt-1 text-2xl font-bold text-amber-700">
                    {money(escrow)}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    held until delivery
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleWithdraw}
                disabled={withdrawing || available <= 0}
                className={`mt-5 flex-row items-center justify-center gap-2 rounded-3xl px-5 py-4 ${
                  available > 0 ? "bg-emerald-900" : "bg-slate-200"
                }`}
              >
                {withdrawing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialCommunityIcons
                    name="bank-transfer-out"
                    size={18}
                    color={available > 0 ? "#fff" : "#94a3b8"}
                  />
                )}
                <Text
                  className={`text-base font-semibold ${
                    available > 0 ? "text-white" : "text-slate-400"
                  }`}
                >
                  {withdrawing ? "Requesting..." : "Withdraw"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* SECONDARY STATS */}
            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#a16207" />
                  <Text className="text-xs uppercase tracking-widest text-slate-400">Pending</Text>
                </View>
                <Text className="mt-2 text-2xl font-bold text-amber-700">{money(stats.pending)}</Text>
                <Text className="text-xs text-slate-400">awaiting payment</Text>
              </View>
              <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="receipt" size={16} color="#047857" />
                  <Text className="text-xs uppercase tracking-widest text-slate-400">Orders</Text>
                </View>
                <Text className="mt-2 text-2xl font-bold text-emerald-900">{orders.length}</Text>
                <Text className="text-xs text-slate-400">total received</Text>
              </View>
            </View>

            {/* RECENT SALES */}
            <Text className="mt-8 text-base font-semibold text-slate-900">Recent Sales</Text>
            {recent.length === 0 ? (
              <View className="mt-6 items-center justify-center rounded-[28px] bg-white p-10 shadow-sm shadow-black/5">
                <MaterialCommunityIcons name="cash-multiple" size={40} color="#9ca3af" />
                <Text className="mt-4 text-sm text-slate-500 text-center">
                  No sales yet. Orders you receive will show up here.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(farmer)/upload")}
                  className="mt-6 rounded-3xl bg-emerald-900 px-8 py-4"
                >
                  <Text className="text-base font-semibold text-white">List produce</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mt-4 gap-3">
                {recent.map((order) => {
                  const paid = isPaid(order);
                  const rev = produceRevenue(order);
                  const items = orderItems(order);
                  return (
                    <View
                      key={order.id}
                      className="flex-row items-center rounded-[24px] bg-white p-4 shadow-sm shadow-black/5"
                    >
                      <View
                        className={`h-11 w-11 items-center justify-center rounded-2xl ${
                          paid ? "bg-emerald-100" : "bg-amber-100"
                        }`}
                      >
                        <MaterialCommunityIcons
                          name={paid ? "cash-check" : "clock-outline"}
                          size={20}
                          color={paid ? "#047857" : "#a16207"}
                        />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-bold text-slate-900">
                          Order #{String(order.id).slice(0, 8).toUpperCase()}
                        </Text>
                        <Text className="text-xs text-slate-500">
                          {formatDate(order.createdAt)} · {items.length}{" "}
                          {items.length === 1 ? "item" : "items"} ·{" "}
                          {STATUS_LABEL[order.status] ?? order.status}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-base font-bold text-emerald-900">{money(rev)}</Text>
                        <Text
                          className={`text-xs font-semibold ${
                            paid ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {paid ? "Paid" : "Pending"}
                        </Text>
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
