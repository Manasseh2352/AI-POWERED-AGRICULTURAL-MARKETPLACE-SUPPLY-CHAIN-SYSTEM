import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialCart = [
  {
    id: "1",
    title: "Heirloom Tomatoes",
    label: "Organic",
    price: 4.99,
    unit: "kg",
    quantity: 2,
    image: require("@/assets/images/Home.jpeg"),
  },
  {
    id: "2",
    title: "Premium White Maize",
    label: "Verified Yield",
    price: 12.5,
    unit: "bu",
    quantity: 50,
    change: "+2.4%",
    image: require("@/assets/images/slide2.jpeg"),
  },
];

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 8.2;
  const total = subtotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-emerald-900">
              HarvestAI
            </Text>
            <TouchableOpacity 
            onPress={() => router.push("/(buyer)/notifications")}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
          </View>

          <Text className="mt-8 text-4xl font-bold text-slate-900">
            Your Harvest
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Review and optimize your agricultural intake.
          </Text>

          <View className="mt-6 space-y-4">
            {cartItems.map((item) => (
              <View
                key={item.id}
                className="rounded-[32px] bg-white p-4 shadow-sm shadow-black/5"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-start gap-4">
                    <Image
                      source={item.image}
                      contentFit="cover"
                      className="h-24 w-24 rounded-3xl bg-slate-100"
                    />
                    <View className="flex-1 justify-between">
                      <Text className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </Text>
                      <View className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1">
                        <Text className="text-xs font-semibold text-emerald-700">
                          {item.label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={22}
                      color="#4b5563"
                    />
                  </TouchableOpacity>
                </View>

                <View className="mt-5 flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-emerald-900">
                      ${item.price.toFixed(2)}/{item.unit}
                    </Text>
                    {item.change ? (
                      <View className="mt-1 flex-row items-center gap-1">
                        <MaterialCommunityIcons
                          name="trending-up"
                          size={16}
                          color="#a16207"
                        />
                        <Text className="text-sm font-semibold text-amber-700">
                          {item.change}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View className="flex-row items-center rounded-full bg-slate-100 px-3 py-2">
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, -1)}
                      className="h-10 w-10 items-center justify-center rounded-full bg-white"
                    >
                      <MaterialCommunityIcons
                        name="minus"
                        size={20}
                        color="#475569"
                      />
                    </TouchableOpacity>
                    <Text className="mx-4 text-lg font-semibold text-slate-900">
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1)}
                      className="h-10 w-10 items-center justify-center rounded-full bg-emerald-700"
                    >
                      <MaterialCommunityIcons
                        name="plus"
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-4 rounded-[32px] bg-emerald-50 p-5 shadow-sm shadow-black/5">
            <View className="flex-row items-start gap-3">
              <View className="mt-1 h-10 w-10 rounded-3xl bg-emerald-700 items-center justify-center">
                <MaterialCommunityIcons name="star" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-emerald-900">
                  AI-Optimized Shipping
                </Text>
                <Text className="mt-2 text-sm leading-6 text-slate-700">
                  We&apos;ve bundled your order with 3 nearby local routes to
                  reduce carbon footprint and cost.
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row items-center justify-between border-t border-emerald-200 pt-4">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-2xl bg-white">
                  <MaterialCommunityIcons
                    name="truck"
                    size={18}
                    color="#14532d"
                  />
                </View>
                <Text className="text-sm text-slate-700">
                  Estimated Delivery:{" "}
                  <Text className="font-semibold text-slate-900">May 24</Text>
                </Text>
              </View>
              <Text className="text-lg font-bold text-amber-900">$8.20</Text>
            </View>
          </View>

          <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between pb-4">
              <Text className="text-base text-slate-500">Subtotal</Text>
              <Text className="text-base font-semibold text-slate-900">
                ${subtotal.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between pb-4">
              <Text className="text-base text-slate-500">Shipping</Text>
              <Text className="text-base font-semibold text-slate-900">
                ${shipping.toFixed(2)}
              </Text>
            </View>
            <View className="h-px bg-slate-100" />
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-slate-900">Total</Text>
              <Text className="text-2xl font-bold text-emerald-800">
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(buyer)/checkout")}
            className="mt-6 rounded-[32px] bg-emerald-900 px-6 py-5 items-center justify-center"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-base font-semibold text-white">
                Proceed to Checkout
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
