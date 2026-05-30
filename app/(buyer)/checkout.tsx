import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const deliveryMethods = [
  {
    id: "ai",
    title: "AI-Optimized Express",
    subtitle: "Next available harvest window",
    price: "$12.50",
    eta: "ETA: 4-6 Hours",
    recommended: true,
    icon: "sparkles",
  },
  {
    id: "ground",
    title: "Standard Ground",
    subtitle: "Scheduled route delivery",
    price: "$4.00",
    eta: "ETA: Tomorrow, 8 AM - 12 PM",
    recommended: false,
    icon: "truck",
  },
];

export default function Checkout() {
  const router = useRouter();
  const [selectedDelivery, setSelectedDelivery] = useState("ai");

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <Text className="text-xl font-bold text-emerald-900">Checkout</Text>
            <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="shield-lock"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
          </View>

          <View className="mt-6 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="shield-check"
                size={16}
                color="#166534"
              />
              <Text className="text-sm font-semibold text-emerald-900">
                Secure end-to-end encrypted transaction
              </Text>
            </View>
          </View>

          <Text className="mt-8 text-base font-semibold text-slate-900">
            Shipping Address
          </Text>
          <TouchableOpacity className="mt-4 flex-row items-center justify-between rounded-full bg-white px-3 py-2 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold text-emerald-800">
              Change
            </Text>
          </TouchableOpacity>

          <View className="mt-5 overflow-hidden rounded-[28px] bg-slate-100">
            <Image
              source={require("@/assets/images/Home.jpeg")}
              contentFit="cover"
              className="absolute inset-0 h-full w-full"
            />
            <View className="absolute inset-0 bg-slate-900/10" />
            <View className="relative p-5">
              <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-black/10">
                <Text className="text-base font-bold text-slate-900">
                  Green Valley Estate, Block 42
                </Text>
                <Text className="mt-2 text-sm text-slate-500">
                  Kansas River Valley, KS 66044
                </Text>
              </View>
            </View>
          </View>

          <Text className="mt-8 text-base font-semibold text-slate-900">
            Delivery Method
          </Text>
          <View className="mt-4 space-y-4">
            {deliveryMethods.map((method) => {
              const active = selectedDelivery === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedDelivery(method.id)}
                  className={`rounded-[28px] border px-4 py-4 ${
                    active
                      ? "border-emerald-700 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`h-14 w-14 rounded-3xl ${active ? "bg-emerald-100" : "bg-slate-100"} items-center justify-center`}
                    >
                      <MaterialCommunityIcons
                        name={method.icon as any}
                        size={22}
                        color={active ? "#14532d" : "#64748b"}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between gap-2">
                        <Text className="text-base font-semibold text-slate-900">
                          {method.title}
                        </Text>
                        <Text className="text-base font-bold text-slate-900">
                          {method.price}
                        </Text>
                      </View>
                      <Text className="mt-1 text-sm text-slate-500">
                        {method.subtitle}
                      </Text>
                      <View className="mt-3 flex-row items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                        <MaterialCommunityIcons
                          name="clock-time-three"
                          size={14}
                          color="#a16207"
                        />
                        <Text className="text-sm font-semibold text-amber-700">
                          {method.eta}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {method.recommended ? (
                    <View className="mt-4 self-start rounded-full bg-emerald-900 px-3 py-1">
                      <Text className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                        Recommended
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="mt-8 text-base font-semibold text-slate-900">
            Order Summary
          </Text>
          <View className="mt-4 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-sm text-slate-600">
                Premium Organic Wheat
              </Text>
              <Text className="text-sm font-semibold text-slate-900">
                $145.00
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-sm text-slate-600">
                Logistics & AI Routing
              </Text>
              <Text className="text-sm font-semibold text-slate-900">
                $12.50
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-sm text-slate-600">Tax (Est.)</Text>
              <Text className="text-sm font-semibold text-slate-900">
                $11.60
              </Text>
            </View>
            <View className="my-3 h-px bg-slate-100" />
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-base font-semibold text-slate-900">
                Total
              </Text>
              <Text className="text-2xl font-bold text-emerald-800">
                $169.10
              </Text>
            </View>
          </View>

          <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 rounded-3xl bg-slate-100 items-center justify-center">
                  <Text className="text-sm font-bold text-slate-900">VISA</Text>
                </View>
                <View>
                  <Text className="text-base font-semibold text-slate-900">
                    •••• 4421
                  </Text>
                  <Text className="text-sm text-slate-500">Expires 08/26</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-emerald-800">
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(buyer)/payment")}
            className="mt-6 rounded-[32px] bg-emerald-900 px-6 py-4 items-center justify-center"
          >
            <Text className="text-base font-semibold text-white">Pay Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
