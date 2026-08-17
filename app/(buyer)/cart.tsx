import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cartStore";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";

export default function Cart() {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalKg = useCartStore((s) => s.totalItems());

  const empty = items.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#14532d" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-emerald-900">HarvestAI</Text>
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/notifications")}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons name="bell-outline" size={20} color="#14532d" />
            </TouchableOpacity>
          </View>

          <Text className="mt-8 text-4xl font-bold text-slate-900">Your Harvest</Text>
          <Text className="mt-2 text-sm text-slate-500">
            Review your selected produce before checkout.
          </Text>

          {empty ? (
            <View className="mt-16 items-center justify-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5">
                <MaterialCommunityIcons name="cart-outline" size={38} color="#9ca3af" />
              </View>
              <Text className="mt-6 text-lg font-semibold text-slate-700">
                Your cart is empty
              </Text>
              <Text className="mt-2 text-sm text-slate-500 text-center px-6">
                Browse the marketplace and add fresh produce to get started.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(buyer)/marketplace")}
                className="mt-8 rounded-3xl bg-emerald-900 px-8 py-4"
              >
                <Text className="text-base font-semibold text-white">Browse marketplace</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View className="mt-6 gap-4">
                {items.map(({ product, quantityKg }) => {
                  const imageUrl = product.images?.[0] || FALLBACK_IMAGE;
                  const atMax = quantityKg >= Math.floor(product.quantityKg);
                  return (
                    <View
                      key={product.id}
                      className="rounded-[32px] bg-white p-4 shadow-sm shadow-black/5"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-start gap-4 flex-1">
                          <Image
                            source={{ uri: imageUrl }}
                            contentFit="cover"
                            className="h-24 w-24 rounded-3xl bg-slate-100"
                          />
                          <View className="flex-1 justify-between">
                            <Text className="text-lg font-semibold text-slate-900">
                              {product.name}
                            </Text>
                            <View className="mt-2 self-start rounded-full bg-emerald-100 px-3 py-1">
                              <Text className="text-xs font-semibold text-emerald-700">
                                {product.perishable ? "Air Freight" : "Sea Freight"}
                              </Text>
                            </View>
                            <Text className="mt-2 text-xs text-slate-400">
                              {product.seller}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(product.id)}>
                          <MaterialCommunityIcons name="delete-outline" size={22} color="#4b5563" />
                        </TouchableOpacity>
                      </View>

                      <View className="mt-5 flex-row items-center justify-between">
                        <View>
                          <Text className="text-2xl font-bold text-emerald-900">
                            ${(product.pricePerKg * quantityKg).toFixed(2)}
                          </Text>
                          <Text className="text-xs text-slate-500">
                            ${product.pricePerKg.toFixed(2)}/kg · {quantityKg}kg
                          </Text>
                        </View>

                        <View className="flex-row items-center rounded-full bg-slate-100 px-3 py-2">
                          <TouchableOpacity
                            onPress={() => setQuantity(product.id, quantityKg - 1)}
                            className="h-10 w-10 items-center justify-center rounded-full bg-white"
                          >
                            <MaterialCommunityIcons name="minus" size={20} color="#475569" />
                          </TouchableOpacity>
                          <Text className="mx-4 text-lg font-semibold text-slate-900">
                            {quantityKg}
                          </Text>
                          <TouchableOpacity
                            onPress={() => setQuantity(product.id, quantityKg + 1)}
                            disabled={atMax}
                            className={`h-10 w-10 items-center justify-center rounded-full ${
                              atMax ? "bg-emerald-200" : "bg-emerald-700"
                            }`}
                          >
                            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Summary */}
              <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
                <View className="flex-row items-center justify-between pb-4">
                  <Text className="text-base text-slate-500">Items</Text>
                  <Text className="text-base font-semibold text-slate-900">
                    {items.length} · {totalKg}kg
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pb-4">
                  <Text className="text-base text-slate-500">Subtotal</Text>
                  <Text className="text-base font-semibold text-slate-900">
                    ${subtotal.toFixed(2)}
                  </Text>
                </View>
                <View className="h-px bg-slate-100" />
                <Text className="mt-4 text-xs text-slate-400">
                  Shipping and tax are calculated at checkout based on freight mode and destination.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(buyer)/checkout")}
                className="mt-6 rounded-[32px] bg-emerald-900 px-6 py-5 items-center justify-center"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-base font-semibold text-white">Proceed to Checkout</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
