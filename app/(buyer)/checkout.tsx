import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderService } from "@/services/order.service";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useMoney } from "@/lib/useMoney";

export default function Checkout() {
  const router = useRouter();
  const { format } = useMoney();

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalKg = useCartStore((s) => s.totalItems());
  const clearCart = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"AIR" | "FLIGHT">("AIR");
  const [placing, setPlacing] = useState(false);

  // Prefill the recipient name from the signed-in buyer.
  useEffect(() => {
    if (user?.fullName) setName(user.fullName);
  }, [user?.fullName]);

  // If the cart empties (e.g. after placing), bounce back to the marketplace.
  useEffect(() => {
    if (items.length === 0 && !placing) {
      router.replace("/(buyer)/marketplace");
    }
  }, [items.length, placing, router]);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    if (!name.trim() || !address.trim() || !phone.trim()) {
      Alert.alert("Missing details", "Please enter the recipient name, delivery address, and phone number.");
      return;
    }

    setPlacing(true);
    try {
      const res = await OrderService.createOrder({
        items: items.map((i) => ({
          productId: i.product.id,
          quantityKg: i.quantityKg,
          unitPrice: i.product.pricePerKg,
        })),
        destinationName: name.trim(),
        destinationAddress: address.trim(),
        destinationPhone: phone.trim(),
        notes: notes.trim() || undefined,
        deliveryMethod,
      });

      const orderId = res?.orderId ?? res?.order?.id;
      if (!orderId) {
        throw new Error("Order was created but no order id was returned.");
      }

      clearCart();
      router.replace(`/(buyer)/payment?orderId=${orderId}`);
    } catch (err: any) {
      Alert.alert("Could not place order", err?.message || "Please try again.");
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#14532d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-emerald-900">Checkout</Text>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="shield-lock" size={20} color="#14532d" />
            </View>
          </View>

          <View className="mt-6 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="shield-check" size={16} color="#166534" />
              <Text className="text-sm font-semibold text-emerald-900">
                Secure, encrypted transaction
              </Text>
            </View>
          </View>

          {/* Delivery details */}
          <Text className="mt-8 text-base font-semibold text-slate-900">Delivery Details</Text>
          <View className="mt-4 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5 gap-4">
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Recipient Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Delivery Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Street, city, region"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
                style={{ textAlignVertical: "top" }}
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Notes (optional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Delivery instructions, preferred window, etc."
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
            </View>
          </View>

          <Text className="mt-8 text-base font-semibold text-slate-900">Delivery Method</Text>
          <View className="mt-4 rounded-[28px] bg-white p-4 shadow-sm shadow-black/5">
            {([
              { label: "Air Delivery", value: "AIR", subtitle: "Fastest and ideal for fresh produce" },
              { label: "Flight Delivery", value: "FLIGHT", subtitle: "Priority cargo option for larger loads" },
            ] as const).map((option) => {
              const active = deliveryMethod === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setDeliveryMethod(option.value)}
                  className={`mb-3 rounded-[24px] border p-4 ${
                    active ? "border-emerald-700 bg-emerald-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-900">{option.label}</Text>
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
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Order summary */}
          <Text className="mt-8 text-base font-semibold text-slate-900">Order Summary</Text>
          <View className="mt-4 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
            {items.map(({ product, quantityKg }) => (
              <View key={product.id} className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-slate-600 flex-1 pr-3" numberOfLines={1}>
                  {product.name} · {quantityKg}kg
                </Text>
                <Text className="text-sm font-semibold text-slate-900">
                  {format(product.pricePerKg * quantityKg)}
                </Text>
              </View>
            ))}
            <View className="my-3 h-px bg-slate-100" />
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-sm text-slate-600">Subtotal ({totalKg}kg)</Text>
              <Text className="text-sm font-semibold text-slate-900">{format(subtotal)}</Text>
            </View>
            <Text className="mt-2 text-xs text-slate-400">
              Shipping and tax are calculated and shown on the payment screen.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={placing}
            className={`mt-6 rounded-[32px] px-6 py-4 items-center justify-center ${
              placing ? "bg-emerald-400" : "bg-emerald-900"
            }`}
          >
            {placing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-white">Place Order</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
