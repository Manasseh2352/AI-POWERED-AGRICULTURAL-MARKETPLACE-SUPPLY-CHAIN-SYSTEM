import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const orderCards = [
  {
    id: "HA-9082",
    status: "Processing",
    title: "Organic Nitrates (Bulk)",
    date: "May 24, 2024",
    estimate: "Est. delivery: May 28",
    price: 1240.0,
    image: require("@/assets/images/slide2.jpeg"),
    badge: "Processing",
    badgeClass: "bg-emerald-900/10 text-emerald-900",
    actionPrimary: "View Details",
    actionSecondary: "Reorder",
    statusIcon: "truck",
  },
  {
    id: "HA-8721",
    status: "Delivered",
    title: "Smart Irrigation Sensors",
    date: "May 12, 2024",
    estimate: "Delivered May 15",
    price: 450.5,
    image: require("@/assets/images/slide3.jpeg"),
    badge: "Delivered",
    badgeClass: "bg-emerald-900/10 text-emerald-900",
    actionPrimary: "Rate Order",
    actionSecondary: "Reorder",
    statusIcon: "check-circle",
  },
  {
    id: "HA-8640",
    status: "Cancelled",
    title: "Hybrid Corn Seeds",
    date: "Apr 28, 2024",
    estimate: "Refunded in full",
    price: 2800.0,
    image: require("@/assets/images/Home.jpeg"),
    badge: "Cancelled",
    badgeClass: "bg-rose-100 text-rose-700",
    actionPrimary: "Buy Again",
    actionSecondary: "",
    statusIcon: "close-circle",
  },
];

const tabs = [
  { id: "all", label: "All Orders" },
  { id: "processing", label: "Processing" },
  { id: "delivered", label: "Delivered" },
];

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = orderCards.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "processing") return order.status === "Processing";
    if (activeTab === "delivered") return order.status === "Delivered";
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8">
          <View className="flex-row items-center justify-between pt-4">
            <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="menu" size={20} color="#14532d" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-emerald-900">
              HarvestAI
            </Text>
            <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
          </View>

          <Text className="mt-8 text-4xl font-bold text-slate-900">
            Order History
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Track and manage your agricultural supplies.
          </Text>

          <View className="mt-6 flex-row gap-3">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-full px-4 py-3 ${
                    active ? "bg-emerald-900" : "bg-slate-200"
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${active ? "text-white" : "text-slate-700"}`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="mt-6 space-y-5">
            {filteredOrders.map((order) => (
              <View
                key={order.id}
                className="overflow-hidden rounded-[32px] bg-white px-5 py-5 shadow-sm shadow-black/5"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Order #{order.id}
                  </Text>
                  <View
                    className={`rounded-full px-3 py-1 ${order.badgeClass
                      .split(" ")
                      .filter((cls) => cls.startsWith("bg-"))
                      .join(" ")}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${order.badgeClass.split(" ").filter((cls) => cls.startsWith("text-"))[0]}`}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>

                <Text className="mt-4 text-2xl font-bold text-slate-900">
                  {order.title}
                </Text>

                <View className="mt-4 flex-row items-center gap-4">
                  <Image
                    source={order.image}
                    contentFit="cover"
                    className="h-20 w-20 rounded-3xl bg-slate-100"
                  />
                  <View className="flex-1">
                    <Text className="text-sm text-slate-500">{order.date}</Text>
                    <View className="mt-2 flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name={order.statusIcon as any}
                        size={16}
                        color="#14532d"
                      />
                      <Text className="text-sm text-slate-500">
                        {order.estimate}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-2xl font-bold text-emerald-900">
                    ${order.price.toFixed(2)}
                  </Text>
                </View>

                <View className="mt-6 flex-row gap-3">
                  <TouchableOpacity className="flex-1 rounded-full border border-emerald-800 px-4 py-3">
                    <Text className="text-center text-sm font-semibold text-emerald-900">
                      {order.actionPrimary}
                    </Text>
                  </TouchableOpacity>
                  {order.actionSecondary ? (
                    <TouchableOpacity className="flex-1 rounded-full bg-emerald-900 px-4 py-3">
                      <Text className="text-center text-sm font-semibold text-white">
                        {order.actionSecondary}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
