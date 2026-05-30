import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
  {
    id: "1",
    category: "Market Alert",
    title: "Price drop on Grains",
    description:
      "Current price for Premium Wheat is down by 4.2% in your region.",
    badge: "HARVEST GOLD",
    time: "2m ago",
    color: "bg-amber-100",
    accent: "border-amber-400",
    icon: "chart-line-down",
    badgeText: "text-amber-800",
  },
  {
    id: "2",
    category: "Logistics",
    title: "Order #1234 dispatched",
    description:
      "Your order of organic fertilizers has left the warehouse and is on its way.",
    badge: "Track Shipment",
    time: "15m ago",
    color: "bg-emerald-100",
    accent: "border-emerald-400",
    icon: "truck-delivery",
    badgeText: "text-emerald-800",
  },
  {
    id: "3",
    category: "AI Insight",
    title: "New AI Insight available",
    description:
      "Optimal harvest window for corn has shifted. View updated precision schedule.",
    badge: "",
    time: "1h ago",
    color: "bg-rose-100",
    accent: "border-rose-400",
    icon: "robot",
    badgeText: "text-rose-800",
  },
  {
    id: "4",
    category: "Marketplace",
    title: "Farmer Green Valley listed new batch",
    description:
      "50 tons of Grade A Organic Soybeans have just been listed for local pickup.",
    badge: "",
    time: "3h ago",
    color: "bg-slate-100",
    accent: "border-slate-300",
    icon: "storefront-outline",
    badgeText: "text-slate-700",
  },
];

export default function Notifications() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8">
          <View className="flex-row items-center justify-between pt-4">
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

            <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
          </View>

          <Text className="mt-8 text-4xl font-bold text-slate-900">
            Notifications
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Stay updated with your agricultural insights and orders.
          </Text>

          <View className="mt-6 space-y-4">
            {notifications.map((item) => (
              <View
                key={item.id}
                className={`overflow-hidden rounded-[32px] border ${item.accent} bg-white shadow-sm shadow-black/5`}
              >
                <View className="flex-row items-start gap-4 px-5 py-5">
                  <View
                    className={`h-14 w-14 rounded-3xl ${item.color} items-center justify-center`}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={20}
                      color="#14532d"
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between gap-3">
                      <View>
                        <Text className="text-sm font-semibold text-slate-900">
                          {item.category}
                        </Text>
                        <Text className="mt-2 text-lg font-semibold text-slate-900">
                          {item.title}
                        </Text>
                      </View>
                      <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {item.time}
                      </Text>
                    </View>
                    <Text className="mt-3 text-sm leading-6 text-slate-600">
                      {item.description}
                    </Text>
                    {item.badge ? (
                      <View className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1">
                        <Text
                          className={`text-[11px] font-bold uppercase tracking-[0.25em] ${item.badgeText}`}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-6 overflow-hidden rounded-[32px] bg-white shadow-sm shadow-black/5">
            <Image
              source={require("@/assets/images/slide2.jpeg")}
              contentFit="cover"
              className="h-56 w-full"
            />
            <View className="absolute inset-0 bg-slate-900/15" />
            <View className="absolute inset-x-0 bottom-0 p-6">
              <View className="mb-3 inline-flex rounded-full bg-emerald-900/10 px-4 py-2">
                <Text className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-900">
                  Pro Feature
                </Text>
              </View>
              <Text className="text-3xl font-bold text-white">
                Maximize your yield with Seasonal Projections
              </Text>
              <TouchableOpacity className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-3">
                <Text className="font-semibold text-emerald-900">
                  Explore Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
