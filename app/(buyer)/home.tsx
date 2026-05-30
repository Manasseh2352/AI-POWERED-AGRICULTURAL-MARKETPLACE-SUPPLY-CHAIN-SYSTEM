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

const featured = {
  title: "Heritage Golden Wheat",
  subtitle: "Sustainable high-yield harvest from the Northern Plains.",
  tag: "In Season",
  image: require("@/assets/images/slide2.jpeg"),
};

const categories = [
  { id: "grains", label: "Grains", icon: "wheat" },
  { id: "vegetables", label: "Vegetables", icon: "leaf" },
  { id: "fruits", label: "Fruits", icon: "fruit-cherries" },
  { id: "dairy", label: "Dairy", icon: "cheese" },
];

const recommended = [
  {
    id: "r1",
    title: "Organic Potatoes",
    price: "$1.20/lb",
    image: require("@/assets/images/Home.jpeg"),
  },
  {
    id: "r2",
    title: "Heirloom Carrots",
    price: "$3.50/pk",
    image: require("@/assets/images/slide3.jpeg"),
  },
  {
    id: "r3",
    title: "Tuscan Kale",
    price: "$2.75/bu",
    image: require("@/assets/images/Home.jpeg"),
  },
  {
    id: "r4",
    title: "Fresh Herbs",
    price: "$1.50/pk",
    image: require("@/assets/images/slide2.jpeg"),
  },
];

export default function BuyerHome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-8">
          <View className="flex-row items-center justify-between">

            <Text className="text-2xl font-bold text-emerald-900">
              HarvestAI
            </Text>

            <TouchableOpacity 
             onPress={() => router.push("/(buyer)/notifications")}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
          </View>

          <Text className="mt-6 text-sm uppercase text-amber-700 font-semibold">
            Welcome back
          </Text>
          <Text className="mt-2 text-3xl font-bold text-slate-900">
            Hello, FreshMarket
          </Text>

          <View className="mt-4 rounded-3xl bg-white px-4 py-3 shadow-sm shadow-black/5">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#6b7280"
              />
              <TextInput
                placeholder="Search premium grains, vegetables, or farms"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base text-slate-900"
              />
            </View>
          </View>

          <View className="mt-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-slate-900">
              Featured Produce
            </Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-emerald-700">
                See All →
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(buyer)/marketplace")}
            className="mt-4 overflow-hidden rounded-3xl"
          >
            <Image
              source={featured.image}
              contentFit="cover"
              className="h-56 w-full rounded-3xl"
            />
            <View className="-mt-28 p-5">
              <View className="inline-flex items-start rounded-full bg-amber-100 px-3 py-1">
                <Text className="text-xs font-semibold text-amber-800">
                  {featured.tag}
                </Text>
              </View>
              <Text className="mt-3 text-2xl font-bold text-white">
                {featured.title}
              </Text>
              <Text className="mt-2 text-sm text-white/90">
                {featured.subtitle}
              </Text>
              <View className="mt-4">
                <TouchableOpacity className="inline-flex items-center rounded-full bg-white px-4 py-3">
                  <MaterialCommunityIcons
                    name="shopping"
                    size={18}
                    color="#14532d"
                  />
                  <Text className="ml-3 font-semibold text-emerald-900">
                    Order Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <Text className="mt-6 text-lg font-semibold text-slate-900">
            Quick Categories
          </Text>
          <View className="mt-4 flex-row items-center justify-between">
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} className="items-center">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={20}
                    color="#166534"
                  />
                </View>
                <Text className="mt-2 text-sm text-slate-700">{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mt-6 text-base font-semibold text-amber-700">
            Recommended for You
          </Text>
          <View
            className="mt-4"
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {recommended.map((p) => (
              <View
                key={p.id}
                className="rounded-[18px] bg-white p-3 shadow-sm shadow-black/5 relative"
                style={{ width: "48%", marginBottom: 16 }}
              >
                <View className="relative">
                  <Image
                    source={p.image}
                    contentFit="cover"
                    className="h-28 w-full rounded-2xl bg-slate-100"
                  />
                  <TouchableOpacity className="absolute top-2 right-2 h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                    <MaterialCommunityIcons
                      name="heart-outline"
                      size={16}
                      color="#14532d"
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  className="mt-3 font-semibold text-slate-900"
                  numberOfLines={2}
                >
                  {p.title}
                </Text>
                <Text className="text-sm text-emerald-900 mt-1">{p.price}</Text>

                <View className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <View
                    className="h-full rounded-full bg-emerald-700"
                    style={{ width: "32%" }}
                  />
                </View>

                <TouchableOpacity className="mt-3 rounded-md bg-emerald-900 py-2 items-center justify-center">
                  <Text className="text-sm font-semibold text-white">
                    Add to Cart
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View className="mt-6 rounded-2xl bg-emerald-900 p-4 shadow-sm shadow-black/10">
            <Text className="text-lg font-semibold text-white">
              Market Insights
            </Text>
            <Text className="mt-2 text-sm text-emerald-100">
              Grain prices are stabilizing. AI models predict a 5% decrease in
              wheat costs over the next 14 days.
            </Text>
            <View className="mt-4 h-24 rounded-md bg-emerald-800/30" />
          </View>

          <TouchableOpacity className="fixed right-6 bottom-28 h-12 w-12 items-center justify-center rounded-full bg-emerald-900 shadow-xl">
            <MaterialCommunityIcons
              name="chat-outline"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
