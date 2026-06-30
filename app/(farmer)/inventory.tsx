import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const inventory = [
  {
    id: "1",
    name: "Heirloom Tomatoes",
    price: 4.5,
    unit: "/kg",
    image: require("@/assets/images/slide2.jpeg"),
    stock: { current: 850, total: 1000 },
    status: "In Stock",
    statusColor: "bg-emerald-100",
    statusTextColor: "text-emerald-700",
  },
  {
    id: "2",
    name: "Russet Potatoes",
    price: 1.2,
    unit: "/kg",
    image: require("@/assets/images/slide3.jpeg"),
    stock: { current: 120, total: 120 },
    status: "Low Stock",
    statusColor: "bg-yellow-100",
    statusTextColor: "text-yellow-700",
  },
  {
    id: "3",
    name: "Golden Wildflower Honey",
    price: 12.0,
    unit: "/jar",
    image: require("@/assets/images/Home.jpeg"),
    stock: { current: 45, total: 50 },
    status: "Reserved",
    statusColor: "bg-purple-100",
    statusTextColor: "text-purple-700",
  },
];

export default function Inventory() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🌾</Text>
              <Text className="text-2xl font-bold text-emerald-900">
                HarvestLink
              </Text>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="#14532d"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(farmer)/notifications")}
                className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={20}
                  color="#14532d"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* STATS GRID */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
              <Text className="text-xs text-gray-500 uppercase font-semibold">
                Total Stock
              </Text>
              <Text className="text-2xl font-bold text-emerald-900 mt-2">
                4,280 kg
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
              <Text className="text-xs text-gray-500 uppercase font-semibold">
                Active Listings
              </Text>
              <Text className="text-2xl font-bold text-emerald-900 mt-2">
                12 Items
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
              <Text className="text-xs text-gray-500 uppercase font-semibold">
                Reserved
              </Text>
              <Text className="text-2xl font-bold text-emerald-900 mt-2">
                850 kg
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
              <Text className="text-xs text-gray-500 uppercase font-semibold">
                Low Stock
              </Text>
              <Text className="text-2xl font-bold text-red-600 mt-2">
                3 Alerts
              </Text>
            </View>
          </View>
        </View>

        {/* ACTIVE INVENTORY */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900">
              Active Inventory
            </Text>
            <TouchableOpacity className="border border-gray-300 rounded-2xl px-4 py-2 flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="filter-outline"
                size={16}
                color="#374151"
              />
              <Text className="text-sm font-semibold text-gray-700">
                Filter
              </Text>
            </TouchableOpacity>
          </View>

          {/* INVENTORY CARDS */}
          <View className="space-y-4">
            {inventory.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-black/5"
              >
                {/* PRODUCT IMAGE WITH STATUS */}
                <View className="relative h-48 w-full">
                  <Image
                    source={item.image}
                    className="w-full h-full"
                    contentFit="cover"
                  />
                  <View
                    className={`absolute top-3 left-3 ${item.statusColor} rounded-full px-3 py-1`}
                  >
                    <Text
                      className={`text-xs font-bold ${item.statusTextColor}`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* PRODUCT INFO */}
                <View className="p-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-900">
                        {item.name}
                      </Text>
                      <Text className="text-sm font-semibold text-emerald-700 mt-1">
                        ${item.price.toFixed(2)}
                        {item.unit}
                      </Text>
                    </View>
                  </View>

                  {/* STOCK LEVEL PROGRESS */}
                  <View className="mt-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-xs text-gray-600 font-semibold">
                        Stock Level
                      </Text>
                      <Text className="text-xs text-gray-600 font-semibold">
                        {item.stock.current}kg/{item.stock.total}kg
                      </Text>
                    </View>
                    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-emerald-700"
                        style={{
                          width: `${(item.stock.current / item.stock.total) * 100}%`,
                        }}
                      />
                    </View>
                  </View>

                  {/* UPDATE STOCK BUTTON */}
                  <TouchableOpacity className="mt-4 bg-emerald-700 rounded-2xl py-3 items-center">
                    <Text className="text-white font-bold text-base">
                      Update Stock
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* STOCK VALUE TRENDS */}
        <View className="px-6 mt-8">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Stock Value Trends
          </Text>
          <View className="bg-white rounded-3xl p-6 shadow-sm shadow-black/5">
            {/* SIMPLE BAR CHART */}
            <View className="flex-row items-end gap-2 h-40 justify-center">
              <View className="items-center flex-1">
                <View
                  className="w-full bg-gray-300 rounded-t-lg"
                  style={{ height: "30%" }}
                />
                <Text className="text-xs text-gray-500 mt-2 font-semibold">
                  Mon
                </Text>
              </View>
              <View className="items-center flex-1">
                <View
                  className="w-full bg-gray-400 rounded-t-lg"
                  style={{ height: "50%" }}
                />
                <Text className="text-xs text-gray-500 mt-2 font-semibold">
                  Tue
                </Text>
              </View>
              <View className="items-center flex-1">
                <View
                  className="w-full bg-gray-300 rounded-t-lg"
                  style={{ height: "40%" }}
                />
                <Text className="text-xs text-gray-500 mt-2 font-semibold">
                  Wed
                </Text>
              </View>
              <View className="items-center flex-1">
                <View
                  className="w-full bg-emerald-500 rounded-t-lg"
                  style={{ height: "70%" }}
                />
                <Text className="text-xs text-gray-500 mt-2 font-semibold">
                  Thu
                </Text>
              </View>
              <View className="items-center flex-1">
                <View
                  className="w-full bg-emerald-600 rounded-t-lg"
                  style={{ height: "60%" }}
                />
                <Text className="text-xs text-gray-500 mt-2 font-semibold">
                  Fri
                </Text>
              </View>
              <View className="items-center flex-1">
                <View
                  className="w-full bg-emerald-700 rounded-t-lg"
                  style={{ height: "80%" }}
                />
                <Text className="text-xs text-gray-500 mt-2 font-semibold">
                  Sat
                </Text>
              </View>
              <View className="items-center flex-1">
                <View
                  className="w-full bg-amber-700 rounded-t-lg"
                  style={{ height: "90%" }}
                />
                <Text className="text-xs text-gray-500 mt-2 font-semibold">
                  Sun
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MARKET INSIGHTS */}
        <View className="px-6 mt-8 pb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Market Insights
          </Text>
          <View className="bg-gray-100 rounded-3xl p-4">
            <Text className="text-sm text-gray-600 leading-5">
              Demand for root vegetables is up 15% this week. Consider adjusting
              stock levels for your potatoes.
            </Text>
            <TouchableOpacity className="mt-4 border border-gray-400 rounded-2xl px-4 py-2 flex-row items-center gap-2">
              <Text className="text-sm font-semibold text-gray-700">
                View Analytics
              </Text>
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={16}
                color="#374151"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity className="absolute bottom-24 right-6 h-16 w-16 rounded-full bg-yellow-400 items-center justify-center shadow-lg shadow-yellow-400/40">
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
