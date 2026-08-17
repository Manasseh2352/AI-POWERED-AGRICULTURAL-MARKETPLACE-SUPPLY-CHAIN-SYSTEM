import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderService } from "@/services/order.service";
import { PaymentService, type PaymentMethod } from "@/services/payment.service";

type PaymentOption = {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  note?: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const paymentOptions: PaymentOption[] = [
  {
    id: "CARD",
    title: "Card Payment",
    subtitle: "Visa, Mastercard, Verve",
    note: "Funds held securely until inspection.",
    icon: "credit-card-outline",
  },
  {
    id: "BANK_TRANSFER",
    title: "Bank Transfer",
    subtitle: "Direct ACH or Wire",
    icon: "bank",
  },
  {
    id: "WALLET",
    title: "Wallet",
    subtitle: "Pay from your HarvestAI balance",
    icon: "wallet-outline",
  },
];

const num = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function Payment() {
  const router = useRouter();
  const { orderId: rawOrderId } = useLocalSearchParams();
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const [order, setOrder] = useState<any | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("CARD");
  const [paying, setPaying] = useState(false);

  const loadOrder = async () => {
    if (!orderId) {
      setLoadingOrder(false);
      return;
    }
    try {
      const o = await OrderService.getBuyerOrder(orderId);
      setOrder(o);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const items = useMemo(() => {
    if (!order?.shipmentGroups) return [];
    return order.shipmentGroups.flatMap((g: any) => g.items ?? []);
  }, [order]);

  const currency = order?.currency ?? "USD";
  const subtotal = num(order?.subtotalAmount);
  const tax = num(order?.taxAmount);
  const shipping = num(order?.shippingAmount);
  const total = num(order?.totalAmount);

  const hasPerishable = items.some(
    (it: any) => String(it?.product?.productName).toUpperCase() === "TOMATO"
  );
  const hasNonPerishable = items.some(
    (it: any) => String(it?.product?.productName).toUpperCase() !== "TOMATO"
  );

  const alreadyPaid =
    Array.isArray(order?.payments) &&
    order.payments.some((p: any) => p?.status === "PAID");

  const fmt = (n: number) =>
    `${currency === "USD" ? "$" : ""}${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handlePayment = async () => {
    if (!orderId) {
      Alert.alert("Error", "No order to pay for.");
      return;
    }
    setPaying(true);
    try {
      const res = await PaymentService.payForOrder(orderId, selectedPayment);
      if (res?.alreadyPaid) {
        Alert.alert("Already paid", "This order has already been paid for.");
      } else {
        Alert.alert("Payment successful", "Your order has been confirmed.");
      }
      router.replace("/(buyer)/orders/current");
    } catch (err: any) {
      Alert.alert("Payment failed", err?.message || "Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loadingOrder) {
    return (
      <SafeAreaView className="flex-1 bg-[#f4f7ef] items-center justify-center">
        <ActivityIndicator size="large" color="#047857" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-[#f4f7ef] items-center justify-center px-8">
        <MaterialCommunityIcons name="file-alert-outline" size={56} color="#9ca3af" />
        <Text className="mt-4 text-lg font-semibold text-slate-700 text-center">
          We couldn&apos;t find this order.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(buyer)/marketplace")}
          className="mt-6 rounded-3xl bg-emerald-900 px-6 py-3"
        >
          <Text className="text-white font-semibold">Back to marketplace</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const recommendedMode = hasPerishable ? "Air Freight" : "Sea Freight";

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-8">
          {/* HEADER */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#14532d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-emerald-900">Payment</Text>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="shield-lock" size={20} color="#14532d" />
            </View>
          </View>

          {/* SECURE BADGE */}
          <View className="mt-6 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="shield-check" size={16} color="#14532d" />
              <Text className="text-sm font-semibold text-emerald-900">Secure Checkout</Text>
            </View>
          </View>

          {/* TOTAL AMOUNT */}
          <View className="mt-8 items-center rounded-[32px] bg-white p-6 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Total Amount Due
            </Text>
            <Text className="mt-4 text-5xl font-bold text-slate-900">{fmt(total)}</Text>
            <View className="mt-3 flex-row items-center gap-2">
              <View
                className={`rounded-full px-3 py-1 ${
                  alreadyPaid ? "bg-emerald-100" : "bg-amber-100"
                }`}
              >
                <Text
                  className={`text-xs font-bold uppercase tracking-[0.2em] ${
                    alreadyPaid ? "text-emerald-800" : "text-amber-900"
                  }`}
                >
                  {alreadyPaid ? "Paid" : "Pending"}
                </Text>
              </View>
              <Text className="text-sm text-slate-600">
                Order #{String(order.id).slice(0, 8).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* PRICE BREAKDOWN */}
          <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
            {items.map((it: any) => (
              <View key={it.id} className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-slate-600 flex-1 pr-3" numberOfLines={1}>
                  {it.product?.productName
                    ? String(it.product.productName).charAt(0) +
                      String(it.product.productName).slice(1).toLowerCase()
                    : "Item"}{" "}
                  · {num(it.quantity)}
                  {it.unit ?? "kg"}
                </Text>
                <Text className="text-sm font-semibold text-slate-900">
                  {fmt(num(it.lineTotal))}
                </Text>
              </View>
            ))}
            <View className="my-3 h-px bg-slate-100" />
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-slate-500">Subtotal</Text>
              <Text className="text-sm font-semibold text-slate-900">{fmt(subtotal)}</Text>
            </View>
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-slate-500">Freight ({recommendedMode})</Text>
              <Text className="text-sm font-semibold text-slate-900">{fmt(shipping)}</Text>
            </View>
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-slate-500">Tax</Text>
              <Text className="text-sm font-semibold text-slate-900">{fmt(tax)}</Text>
            </View>
            <View className="my-3 h-px bg-slate-100" />
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-base font-bold text-slate-900">Total</Text>
              <Text className="text-xl font-bold text-emerald-800">{fmt(total)}</Text>
            </View>
          </View>

          {/* FREIGHT RECOMMENDATION */}
          <View className="mt-6 rounded-[28px] border-2 border-slate-100 bg-white p-5">
            <View className="flex-row items-center gap-4">
              <View
                className={`h-14 w-14 rounded-3xl items-center justify-center ${
                  hasPerishable ? "bg-sky-100" : "bg-blue-100"
                }`}
              >
                <MaterialCommunityIcons
                  name={hasPerishable ? "airplane" : "ferry"}
                  size={24}
                  color={hasPerishable ? "#0369a1" : "#1d4ed8"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900">{recommendedMode}</Text>
                <Text className="mt-0.5 text-sm text-slate-500">
                  {hasPerishable
                    ? "Temperature-controlled cargo for perishable produce."
                    : "Cost-effective bulk container freight."}
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row items-center gap-2">
              <View className="rounded-full bg-emerald-900 px-3 py-1 flex-row items-center gap-1">
                <MaterialCommunityIcons name="star-four-points" size={12} color="#fff" />
                <Text className="text-xs font-bold uppercase tracking-[0.15em] text-white">
                  AI Recommended
                </Text>
              </View>
              {hasPerishable && hasNonPerishable && (
                <Text className="text-xs text-slate-500 flex-1">
                  Mixed cart — routed by fastest safe mode.
                </Text>
              )}
            </View>
          </View>

          {/* PAYMENT METHOD SECTION */}
          <Text className="mt-8 text-base font-semibold text-slate-900">Payment Method</Text>
          <View className="mt-4 gap-4">
            {paymentOptions.map((option) => {
              const active = selectedPayment === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedPayment(option.id)}
                  disabled={alreadyPaid}
                  className={`rounded-[28px] border px-4 py-4 ${
                    active ? "border-emerald-700 bg-emerald-50" : "border-slate-200 bg-white"
                  } ${alreadyPaid ? "opacity-50" : ""}`}
                >
                  <View className="flex-row items-start gap-4">
                    <View
                      className={`h-14 w-14 rounded-3xl ${
                        active ? "bg-emerald-100" : "bg-slate-100"
                      } items-center justify-center`}
                    >
                      <MaterialCommunityIcons
                        name={option.icon}
                        size={22}
                        color={active ? "#14532d" : "#64748b"}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between gap-2">
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-slate-900">
                            {option.title}
                          </Text>
                          <Text className="mt-1 text-sm text-slate-500">{option.subtitle}</Text>
                        </View>
                        <View
                          className={`h-6 w-6 rounded-full border ${
                            active ? "border-emerald-700 bg-emerald-700" : "border-slate-300 bg-white"
                          }`}
                        >
                          {active ? (
                            <MaterialCommunityIcons
                              name="check"
                              size={16}
                              color="#fff"
                              style={{ alignSelf: "center", marginTop: 2 }}
                            />
                          ) : null}
                        </View>
                      </View>
                      {option.note ? (
                        <View className="mt-3 rounded-full bg-emerald-100/60 px-3 py-2">
                          <Text className="text-sm text-emerald-900">{option.note}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* PAY BUTTON */}
          <TouchableOpacity
            onPress={handlePayment}
            disabled={paying || alreadyPaid}
            className={`mt-8 rounded-[32px] px-6 py-4 items-center justify-center ${
              paying || alreadyPaid ? "bg-emerald-400" : "bg-emerald-900"
            }`}
          >
            {paying ? (
              <ActivityIndicator color="white" />
            ) : alreadyPaid ? (
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                <Text className="text-base font-semibold text-white">Order Paid</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="lock" size={20} color="#fff" />
                <Text className="text-base font-semibold text-white">Pay {fmt(total)}</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text className="mt-4 text-center text-sm text-slate-500">
            Encrypted with 256-bit AES protection
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
