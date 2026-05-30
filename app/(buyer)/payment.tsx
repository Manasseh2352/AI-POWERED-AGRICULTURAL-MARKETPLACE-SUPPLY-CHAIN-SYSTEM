import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const paymentOptions = [
  {
    id: "escrow",
    title: "Escrow Payment",
    subtitle: "AI-Protected protection",
    note: "Funds held securely until inspection.",
    icon: "shield-check",
  },
  {
    id: "bank",
    title: "Bank Transfer",
    subtitle: "Direct ACH or Wire",
    note: "",
    icon: "bank",
  },
  {
    id: "credit",
    title: "Corporate Credit",
    subtitle: "Net-30 terms available",
    note: "",
    icon: "credit-card-outline",
  },
];

export default function Payment() {
  const router = useRouter();
  const [selected, setSelected] = useState("escrow");
  const total = 14240.5;

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-8">
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
                color="#14532d"
              />
              <Text className="text-sm font-semibold text-emerald-900">
                Secure Checkout
              </Text>
            </View>
          </View>

          <View className="mt-8 items-center rounded-[32px] bg-white p-6 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Total Amount Due
            </Text>
            <Text className="mt-4 text-5xl font-bold text-slate-900">
              $
              {total.toLocaleString(undefined, {
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

          <Text className="mt-8 text-base font-semibold text-slate-900">
            Payment Method
          </Text>
          <View className="mt-4 space-y-4">
            {paymentOptions.map((option) => {
              const active = selected === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelected(option.id)}
                  className={`rounded-[28px] border px-4 py-4 ${
                    active
                      ? "border-emerald-700 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-start gap-4">
                    <View
                      className={`h-14 w-14 rounded-3xl ${active ? "bg-emerald-100" : "bg-slate-100"} items-center justify-center`}
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
                          className={`h-6 w-6 rounded-full border ${active ? "border-emerald-700 bg-emerald-700" : "border-slate-300 bg-white"}`}
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
                          <Text className="text-sm text-emerald-900">
                            {option.note}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(buyer)/orders/current")}
            className="mt-8 rounded-[32px] bg-emerald-900 px-6 py-4 items-center justify-center"
          >
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="lock" size={20} color="#fff" />
              <Text className="text-base font-semibold text-white">
                Pay $
                {total.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </TouchableOpacity>

          <Text className="mt-4 text-center text-sm text-slate-500">
            Encrypted with 256-bit AES protection
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
