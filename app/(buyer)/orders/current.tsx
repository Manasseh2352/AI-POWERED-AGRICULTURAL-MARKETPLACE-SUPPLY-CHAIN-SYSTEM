import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const activeShipments = [
  {
    id: "H-AI-29440",
    title: "Heirloom Tomato",
    price: 245.0,
    status: "In Transit",
    statusColor: "bg-amber-100 text-amber-700",
    badgeIcon: "truck-delivery",
    image: require("@/assets/images/Home.jpeg"),
    subtitle: "Batch #402",
    detailTitle: "HarvestAI Optimization",
    detailText:
      "Route optimized for freshness. Temperature controlled at 12°C to prevent bruising during transit.",
    progress: 60,
    progressLabels: ["Dispatched", "Arriving Tomorrow", "Delivered"],
    estimate: "Oct 24, 2:30 PM",
    button: "Track Live",
    highlight: "bg-emerald-50 border-emerald-100 text-emerald-900",
  },
  {
    id: "H-AI-29441",
    title: "Microgreen Sample Kit",
    price: 89.0,
    status: "Being Processed",
    statusColor: "bg-amber-100 text-amber-800",
    badgeIcon: "leaf",
    image: require("@/assets/images/slide3.jpeg"),
    subtitle: "Order ID: H-AI-29441",
    detailTitle: "Quality Assurance",
    detailText:
      "AI visual inspection completed. 99.8% freshness score verified. Preparing for eco-cold packaging.",
    progress: 35,
    progressLabels: ["Confirmed", "Packaging", "Shipped"],
    estimate: "Today, 5:00 PM",
    button: "View Receipt",
    highlight: "bg-amber-50 border-amber-100 text-amber-900",
  },
];

export default function CurrentOrders() {
    const router = useRouter();
    
  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8">
          <View className="flex-row items-center justify-between pt-4">
            
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
            Active Shipments
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Tracking 3 orders with real-time AI optimization.
          </Text>

          <View className="mt-6 space-y-5">
            {activeShipments.map((shipment) => (
              <View
                key={shipment.id}
                className="overflow-hidden rounded-[32px] bg-white shadow-sm shadow-black/5"
              >
                <View className="relative">
                  <Image
                    source={shipment.image}
                    contentFit="cover"
                    className="h-56 w-full"
                  />
                  <View className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 shadow-sm shadow-black/10">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name={shipment.badgeIcon as any}
                        size={16}
                        color="#14532d"
                      />
                      <Text className="text-xs font-semibold text-slate-900">
                        {shipment.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="p-5">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-2xl font-bold text-slate-900">
                        {shipment.title}
                      </Text>
                      <Text className="text-base text-slate-500">
                        {shipment.subtitle}
                      </Text>
                    </View>
                    <Text className="text-2xl font-bold text-emerald-900">
                      ${shipment.price.toFixed(2)}
                    </Text>
                  </View>

                  <View className="mt-5 rounded-[28px] border px-4 py-4 border-slate-200 bg-[#f7faf5]">
                    <Text className="text-sm font-bold text-slate-900">
                      {shipment.detailTitle}
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-slate-600">
                      {shipment.detailText}
                    </Text>
                  </View>

                  <View className="mt-5 space-y-3">
                    <View className="h-2 rounded-full bg-slate-200">
                      <View
                        className="h-full rounded-full bg-emerald-700"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </View>
                    <View className="flex-row items-center justify-between">
                      {shipment.progressLabels.map((label) => (
                        <Text key={label} className="text-xs text-slate-500">
                          {label}
                        </Text>
                      ))}
                    </View>
                  </View>

                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-sm text-slate-500">
                      Estimated Delivery
                    </Text>
                    <Text className="text-sm font-semibold text-slate-900">
                      {shipment.estimate}
                    </Text>
                  </View>

                  <TouchableOpacity className="mt-5 rounded-3xl bg-emerald-900 px-5 py-4 items-center justify-center">
                    <Text className="text-base font-semibold text-white">
                      {shipment.button}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-6 overflow-hidden rounded-[32px] bg-emerald-900 px-5 py-6 shadow-sm shadow-black/10">
            <Text className="text-xl font-bold text-white">
              Efficiency Boost
            </Text>
            <Text className="mt-3 text-sm leading-6 text-emerald-100">
              Your last 5 shipments arrived 12% faster than industry averages
              thanks to AI routing.
            </Text>
            <View className="mt-6 rounded-[28px] bg-[#0f3e18] p-5">
              <Text className="text-5xl font-bold text-white">-14%</Text>
              <Text className="mt-2 text-sm text-emerald-200">CO2 impact</Text>
            </View>
          </View>

          <View className="mt-6 overflow-hidden rounded-[32px] bg-white shadow-sm shadow-black/5">
            <View className="p-5">
              <Text className="text-xl font-bold text-slate-900">
                Fleet Map
              </Text>
              <Text className="mt-2 text-sm text-slate-500">
                Real-time distribution of your active inventory.
              </Text>
            </View>
            <View className="h-56 bg-slate-100" />
            <View className="absolute inset-x-0 bottom-6 flex-row items-center justify-center gap-3 px-5">
              <View className="h-3 w-3 rounded-full bg-emerald-700" />
              <View className="h-3 w-3 rounded-full bg-amber-700" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
