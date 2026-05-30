import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const products = [
  {
    id: "1",
    title: "Organic Greens",
    subtitle: "Heirloom Kale",
    price: "4.50",
    seller: "Green Valley Farms",
    badge: "Verified",
    badgeColor: "bg-emerald-100",
    badgeText: "text-emerald-700",
    image: require("@/assets/images/Home.jpeg"),
  },
  {
    id: "2",
    title: "Premium Grains",
    subtitle: "Hard Red Wheat",
    price: "1.20",
    seller: "Miller & Sons Co.",
    badge: "Trending",
    badgeColor: "bg-amber-100",
    badgeText: "text-amber-700",
    image: require("@/assets/images/slide2.jpeg"),
  },
  {
    id: "3",
    title: "Root Vegetables",
    subtitle: "Honey Carrots",
    price: "3.10",
    seller: "Sunrise Organic Ltd.",
    badge: "Verified",
    badgeColor: "bg-emerald-100",
    badgeText: "text-emerald-700",
    image: require("@/assets/images/slide3.jpeg"),
  },
  {
    id: "4",
    title: "Vegetable Mix",
    subtitle: "Bell Peppers",
    price: "5.80",
    seller: "Central Valley Growers",
    badge: "Trending",
    badgeColor: "bg-amber-100",
    badgeText: "text-amber-700",
    image: require("@/assets/images/Home.jpeg"),
  },
];

export default function Marketplace() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <View className="px-6 pt-4">
        <View className="flex-row items-center justify-between">
          
          <Text className="text-2xl font-bold text-emerald-900">HarvestAI</Text>
          <TouchableOpacity 
          onPress={() => router.push("/(buyer)/notifications")}
          className="rounded-2xl bg-white p-3 shadow-sm shadow-black/5">
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color="#14532d"
            />
          </TouchableOpacity>
        </View>

        <Text className="mt-6 text-3xl font-bold text-slate-900">
          Explore the Marketplace
        </Text>

        <View className="mt-6 rounded-3xl bg-white px-4 py-3 shadow-sm shadow-black/5">
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search fresh produce, grains, or farms"
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-slate-900"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 18 }}
        >
          {[
            { label: "Trending", active: true },
            { label: "Nearby", active: false },
            { label: "Organic", active: false },
          ].map((chip) => (
            <TouchableOpacity
              key={chip.label}
              className={`mr-3 rounded-full px-5 py-3 ${chip.active ? "bg-emerald-700" : "bg-white"}`}
            >
              <Text
                className={`text-sm font-semibold ${chip.active ? "text-white" : "text-slate-900"}`}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 120 }}
      >
        {products.map((product) => (
          <View
            key={product.id}
            className="mb-4 rounded-[32px] bg-white shadow-sm shadow-black/5 overflow-hidden"
          >
            <TouchableOpacity
              onPress={() => router.push(`/(buyer)/products/${product.id}`)}
              className="relative h-56 w-full bg-gray-100"
            >
              <Image
                source={product.image}
                contentFit="cover"
                className="h-full w-full"
              />
              <View
                className={`absolute left-4 top-4 rounded-full px-3 py-2 ${product.badgeColor}`}
              >
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name={
                      product.badge === "Verified"
                        ? "check-decagram"
                        : "trending-up"
                    }
                    size={16}
                    color={product.badge === "Verified" ? "#047857" : "#9a3412"}
                  />
                  <Text
                    className={`text-xs font-semibold ${product.badgeText}`}
                  >
                    {product.badge}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="p-5">
              <Text className="text-lg font-semibold text-slate-900">
                {product.title}
              </Text>
              <Text className="text-sm text-slate-500 mt-1">
                {product.subtitle}
              </Text>

              <View className="mt-4 flex-row items-end justify-between">
                <View>
                  <Text className="text-xl font-bold text-slate-900">
                    ${product.price}
                  </Text>
                  <Text className="text-xs text-slate-500">per kg</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="account"
                    size={16}
                    color="#6b7280"
                  />
                  <Text className="text-sm text-slate-500">
                    {product.seller}
                  </Text>
                </View>
              </View>

              <TouchableOpacity className="mt-6 rounded-3xl bg-emerald-900 py-4 items-center justify-center">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="cart" size={18} color="#fff" />
                  <Text className="text-sm font-semibold text-white">
                    Add to Cart
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity className="mx-6 mt-2 rounded-full bg-white px-6 py-4 items-center justify-center shadow-sm shadow-black/5">
          <Text className="text-sm font-semibold text-emerald-900">
            Load More Results
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push("/(buyer)/cart")}
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-amber-400 shadow-xl shadow-amber-400/30"
      >
        <MaterialCommunityIcons name="plus" size={28} color="#064e3b" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
