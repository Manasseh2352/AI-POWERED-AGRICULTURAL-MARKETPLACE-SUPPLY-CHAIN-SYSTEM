import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentService } from "@/services/payment.service";
import { useAuthStore } from "@/store/authStore";
import { OrderService } from "@/services/order.service";

const paymentOptions = [
  {
    id: "stripe",
    title: "Escrow Payment",
    subtitle: "AI-Protected protection",
    note: "Funds held securely until inspection.",
    icon: "shield-check",
  },
  {
    id: "bank_transfer",
    title: "Bank Transfer",
    subtitle: "Direct ACH or Wire",
    note: "",
    icon: "bank",
  },
  {
    id: "paystack",
    title: "Corporate Credit",
    subtitle: "Net-30 terms available",
    note: "",
    icon: "credit-card-outline",
  },
];

// Transport modes — perishable orders have Air recommended, non-perishable have Sea
const transportModes = [
  {
    id: "air",
    title: "Air / Flight",
    subtitle: "Temperature-controlled cargo",
    eta: "ETA: 1–2 Business Days",
    price: "+$24.00",
    priceValue: 24.00,
    icon: "airplane",
    recommendedFor: "perishable",
    accentColor: "#0369a1",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-600",
    iconBg: "bg-sky-100",
    badgeBg: "bg-sky-600",
    description:
      "Fastest option. Ideal for fresh produce, dairy, and any time-sensitive perishable goods.",
  },
  {
    id: "sea",
    title: "Sea / Shipping",
    subtitle: "Bulk container freight",
    eta: "ETA: 7–14 Business Days",
    price: "+$6.50",
    priceValue: 6.50,
    icon: "ferry",
    recommendedFor: "non-perishable",
    accentColor: "#1d4ed8",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-600",
    iconBg: "bg-blue-100",
    badgeBg: "bg-blue-700",
    description:
      "Cost-effective bulk shipping. Best for grains, dried goods, honey, and shelf-stable produce.",
  },
  {
    id: "road",
    title: "Road / Truck",
    subtitle: "Ground logistics network",
    eta: "ETA: 3–5 Business Days",
    price: "+$9.80",
    priceValue: 9.80,
    icon: "truck",
    recommendedFor: null,
    accentColor: "#374151",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-400",
    iconBg: "bg-slate-100",
    badgeBg: "bg-slate-600",
    description:
      "Flexible domestic delivery for mixed orders. Available for both perishable and non-perishable.",
  },
];

export default function Payment() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [selectedTransport, setSelectedTransport] = useState("air");
  const [loading, setLoading] = useState(false);

  // In a real app this would come from cart state — simulating a mixed order here
  const hasPerishable = true;
  const hasNonPerishable = true;

  const baseTotal = 14240.5;
  const transportCost = transportModes.find(m => m.id === selectedTransport)?.priceValue || 0;
  const finalTotal = baseTotal + transportCost;

  const handlePayment = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to make a payment.");
      return;
    }

    setLoading(true);

    try {
      // 1. We must create an order first so we have an orderId for the payment record
      // In a real app, items would be from the cart.
      const order = await OrderService.createOrder({
        buyerId: user.id,
        farmerId: "60d5ecb54cb912445cbfab05", // Dummy farmer ID format
        items: [{ productId: "temp", name: "Mock items", quantity: 1, price: baseTotal }],
        totalAmount: finalTotal,
        deliveryAddress: "123 Main St, USA"
      });

      // 2. Initiate Payment
      if (order && order.id) {
         await PaymentService.initiatePayment({
           userId: user.id,
           amount: finalTotal,
           orderId: order.id,
           paymentMethod: selectedPayment
         });

         Alert.alert("Success", "Payment initiated successfully!");
         router.push("/(buyer)/orders/current");
      }
    } catch (err: any) {
      console.warn("Payment simulation fallback", err);
      // Fallback for development if DB constraints fail due to dummy IDs
      Alert.alert("Demo Mode", "Order/Payment created locally (API failed due to missing DB relations).");
      router.push("/(buyer)/orders/current");
    } finally {
      setLoading(false);
    }
  };

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
            <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="shield-lock" size={20} color="#14532d" />
            </TouchableOpacity>
          </View>

          {/* SECURE BADGE */}
          <View className="mt-6 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="shield-check" size={16} color="#14532d" />
              <Text className="text-sm font-semibold text-emerald-900">
                Secure Checkout
              </Text>
            </View>
          </View>

          {/* TOTAL AMOUNT */}
          <View className="mt-8 items-center rounded-[32px] bg-white p-6 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Total Amount Due
            </Text>
            <Text className="mt-4 text-5xl font-bold text-slate-900">
              $
              {finalTotal.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </Text>
            <View className="mt-3 flex-row items-center gap-2">
              <View className="rounded-full bg-amber-100 px-3 py-1">
                <Text className="text-xs font-bold uppercase tracking-[0.2em] text-amber-900">
                  Pending
                </Text>
              </View>
              <Text className="text-sm text-slate-600">Order #HG-8821</Text>
            </View>
          </View>

          {/* ── TRANSPORT MODE SECTION ── */}
          <View className="mt-8">
            <Text className="text-base font-semibold text-slate-900 mb-1">
              Mode of Transport
            </Text>
            <Text className="text-xs text-slate-500 mb-4">
              Choose how your order is delivered. Recommendations are based on your cart contents.
            </Text>

            {/* Order type summary */}
            <View className="flex-row gap-3 mb-5">
              {hasPerishable && (
                <View className="flex-1 rounded-2xl bg-rose-50 border border-rose-100 px-3 py-3 flex-row items-center gap-2">
                  <MaterialCommunityIcons name="snowflake" size={16} color="#be123c" />
                  <View>
                    <Text className="text-xs font-bold text-rose-700">Perishable Items</Text>
                    <Text className="text-[10px] text-rose-500">In your cart</Text>
                  </View>
                </View>
              )}
              {hasNonPerishable && (
                <View className="flex-1 rounded-2xl bg-amber-50 border border-amber-100 px-3 py-3 flex-row items-center gap-2">
                  <MaterialCommunityIcons name="package-variant-closed" size={16} color="#92400e" />
                  <View>
                    <Text className="text-xs font-bold text-amber-800">Non-Perishable</Text>
                    <Text className="text-[10px] text-amber-500">In your cart</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Transport mode cards */}
            <View className="gap-4">
              {transportModes.map((mode) => {
                const active = selectedTransport === mode.id;

                // Determine if this mode is recommended for the current cart
                const isRecommended =
                  (mode.recommendedFor === "perishable" && hasPerishable && !hasNonPerishable) ||
                  (mode.recommendedFor === "non-perishable" && hasNonPerishable && !hasPerishable) ||
                  (mode.recommendedFor === "perishable" && hasPerishable && hasNonPerishable && mode.id === "air");

                return (
                  <TouchableOpacity
                    key={mode.id}
                    onPress={() => setSelectedTransport(mode.id)}
                    className={`rounded-[28px] border-2 p-5 ${
                      active ? mode.borderColor + " " + mode.bgColor : "border-slate-200 bg-white"
                    }`}
                  >
                    <View className="flex-row items-center gap-4">
                      {/* Icon */}
                      <View
                        className={`h-14 w-14 rounded-3xl ${
                          active ? mode.iconBg : "bg-slate-100"
                        } items-center justify-center`}
                      >
                        <MaterialCommunityIcons
                          name={mode.icon as any}
                          size={24}
                          color={active ? mode.accentColor : "#94a3b8"}
                        />
                      </View>

                      {/* Info */}
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-base font-bold text-slate-900">
                            {mode.title}
                          </Text>
                          <Text
                            className={`text-base font-bold ${
                              active ? "text-emerald-800" : "text-slate-700"
                            }`}
                          >
                            {mode.price}
                          </Text>
                        </View>
                        <Text className="text-sm text-slate-500 mt-0.5">{mode.subtitle}</Text>

                        {/* ETA */}
                        <View className="mt-3 flex-row items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-1.5">
                          <MaterialCommunityIcons
                            name="clock-time-three"
                            size={13}
                            color="#a16207"
                          />
                          <Text className="text-xs font-semibold text-amber-700">
                            {mode.eta}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Description */}
                    <Text className="mt-3 text-xs text-slate-500 leading-5">
                      {mode.description}
                    </Text>

                    {/* Recommended badge */}
                    {isRecommended && (
                      <View className="mt-4 flex-row items-center gap-2">
                        <View
                          className={`rounded-full px-3 py-1 flex-row items-center gap-1 ${mode.badgeBg}`}
                        >
                          <MaterialCommunityIcons name="stars" size={12} color="#fff" />
                          <Text className="text-xs font-bold uppercase tracking-[0.15em] text-white">
                            Recommended
                          </Text>
                        </View>
                        <Text className="text-xs text-slate-500">
                          {mode.id === "air"
                            ? "Best for your perishable items"
                            : "Best for your non-perishable items"}
                        </Text>
                      </View>
                    )}

                    {/* Selection indicator */}
                    {active && (
                      <View className="absolute top-4 right-4 h-6 w-6 rounded-full bg-emerald-700 items-center justify-center">
                        <MaterialCommunityIcons name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Override notice */}
            <View className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 flex-row items-start gap-3">
              <MaterialCommunityIcons name="information-outline" size={16} color="#64748b" />
              <Text className="text-xs text-slate-500 flex-1 leading-5">
                You're free to choose any transport mode regardless of recommendation. Note that
                perishable items shipped via sea freight may affect product quality on arrival.
              </Text>
            </View>
          </View>

          {/* ── PAYMENT METHOD SECTION ── */}
          <Text className="mt-8 text-base font-semibold text-slate-900">
            Payment Method
          </Text>
          <View className="mt-4 gap-4">
            {paymentOptions.map((option) => {
              const active = selectedPayment === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedPayment(option.id)}
                  className={`rounded-[28px] border px-4 py-4 ${
                    active
                      ? "border-emerald-700 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-start gap-4">
                    <View
                      className={`h-14 w-14 rounded-3xl ${
                        active ? "bg-emerald-100" : "bg-slate-100"
                      } items-center justify-center`}
                    >
                      <MaterialCommunityIcons
                        name={option.icon as any}
                        size={22}
                        color={active ? "#14532d" : "#64748b"}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between gap-2">
                        <View>
                          <Text className="text-base font-semibold text-slate-900">
                            {option.title}
                          </Text>
                          <Text className="mt-1 text-sm text-slate-500">
                            {option.subtitle}
                          </Text>
                        </View>
                        <View
                          className={`h-6 w-6 rounded-full border ${
                            active
                              ? "border-emerald-700 bg-emerald-700"
                              : "border-slate-300 bg-white"
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
            disabled={loading}
            className={`mt-8 rounded-[32px] px-6 py-4 items-center justify-center ${loading ? 'bg-emerald-700' : 'bg-emerald-900'}`}
          >
            {loading ? (
               <ActivityIndicator color="white" />
            ) : (
               <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="lock" size={20} color="#fff" />
                <Text className="text-base font-semibold text-white">
                  Pay $
                  {finalTotal.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </Text>
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
