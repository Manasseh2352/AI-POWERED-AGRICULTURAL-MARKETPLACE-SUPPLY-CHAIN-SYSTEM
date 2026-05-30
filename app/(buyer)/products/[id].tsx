import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProductType = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  unit: string;
  image: any;
  producer: string;
  rating: number;
  reviews: number;
  quality: string;
  season: string;
  description: string;
  nutrition: {
    label: string;
    value: string;
    sub: string;
    color: string;
    textColor: string;
  }[];
};

const products: Record<string, ProductType> = {
  "1": {
    id: "1",
    name: "Organic Heirloom Tomatoes",
    subtitle: "Premium Organic",
    price: "4.50",
    unit: "per kg",
    image: require("@/assets/images/Home.jpeg"),
    producer: "Green Valley Farms",
    rating: 4.9,
    reviews: 1200,
    quality: "98%",
    season: "Late Summer",
    description:
      "Our heirloom tomatoes are vine-ripened and harvested at the peak of sweetness. Using AI-driven soil monitoring, Green Valley ensures optimal nutrient density and flavor profiles that mass-market varieties can't match.",
    nutrition: [
      {
        label: "Vitamin C",
        value: "40%",
        sub: "DV",
        color: "bg-rose-100",
        textColor: "text-rose-700",
      },
      {
        label: "Fiber",
        value: "12%",
        sub: "DV",
        color: "bg-emerald-100",
        textColor: "text-emerald-700",
      },
      {
        label: "Cals",
        value: "22",
        sub: "per 100g",
        color: "bg-amber-100",
        textColor: "text-amber-700",
      },
      {
        label: "Lycopene",
        value: "High Content",
        sub: "",
        color: "bg-stone-100",
        textColor: "text-stone-700",
      },
    ],
  },
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = products[(id as string) ?? "1"] || products["1"];
  const [quantity, setQuantity] = useState(1);

  return (
    <SafeAreaView className="flex-1 bg-[#f2f6ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image
            source={product.image}
            contentFit="cover"
            className="h-96 w-full"
          />
          <View className="absolute inset-x-0 top-4 flex-row items-center justify-between px-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white/90"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white/90">
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={20}
                  color="#14532d"
                />
              </TouchableOpacity>
              <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white/90">
                <MaterialCommunityIcons
                  name="share-variant"
                  size={20}
                  color="#14532d"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="-mt-14 rounded-t-[36px] bg-white px-6 pt-6 pb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <View className="rounded-full bg-emerald-50 px-3 py-1">
                <Text className="text-xs font-semibold text-emerald-700">
                  {product.subtitle.toUpperCase()}
                </Text>
              </View>
              <Text className="mt-4 text-3xl font-bold text-slate-900">
                {product.name}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-3xl font-bold text-emerald-900">
                ${product.price}
              </Text>
              <Text className="text-xs text-slate-500">{product.unit}</Text>
            </View>
          </View>

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1 rounded-3xl bg-slate-50 px-4 py-5">
              <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                AI Quality
              </Text>
              <Text className="mt-3 text-2xl font-bold text-slate-900">
                {product.quality}
              </Text>
              <Text className="text-xs text-slate-500">Grade A</Text>
            </View>
            <View className="flex-1 rounded-3xl bg-slate-50 px-4 py-5">
              <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Season
              </Text>
              <Text className="mt-3 text-2xl font-bold text-slate-900">
                {product.season}
              </Text>
              <Text className="text-xs text-slate-500">Harvest cycle</Text>
            </View>
          </View>

          <View className="mt-6 rounded-[32px] bg-emerald-50 p-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-14 w-14 rounded-full bg-emerald-700 items-center justify-center">
                  <MaterialCommunityIcons
                    name="account"
                    size={24}
                    color="#fff"
                  />
                </View>
                <View>
                  <Text className="text-base font-bold text-slate-900">
                    {product.producer}
                  </Text>
                  <Text className="text-sm text-slate-600">
                    Verified Producer • {product.rating.toFixed(1)} (
                    {product.reviews.toFixed(1)}k reviews)
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/(buyer)/products/reviews?productId=${product.id}`,
                  )
                }
              >
                <Text className="text-sm font-semibold text-emerald-800">
                  View Reviews
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
            <Text className="text-base font-bold text-slate-900">
              Market Trends
            </Text>
            <View className="mt-3 flex-row items-end justify-between gap-2">
              {[
                { color: "#d1fae5", height: 18 },
                { color: "#a7f3d0", height: 22 },
                { color: "#d1fae5", height: 20 },
                { color: "#a7f3d0", height: 24 },
                { color: "#86efac", height: 26 },
                { color: "#047857", height: 28 },
              ].map((bar, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: bar.color,
                    width: 20,
                    height: bar.height,
                    borderRadius: 999,
                  }}
                />
              ))}
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-sm text-slate-500">
                Price is currently stable with high demand expected next harvest
                cycle.
              </Text>
              <Text className="text-sm font-semibold text-emerald-700">
                +2.4% vs last week
              </Text>
            </View>
          </View>

          <Text className="mt-8 text-xl font-bold text-slate-900">
            Nutritional Profile
          </Text>
          <View className="mt-4 flex-row flex-wrap justify-between gap-3">
            <View className="w-[48%] rounded-3xl bg-rose-50 p-5">
              <Text className="text-xs uppercase tracking-[0.25em] text-rose-600">
                Vitamin C
              </Text>
              <Text className="mt-3 text-2xl font-bold text-rose-700">
                40% DV
              </Text>
            </View>
            <View className="w-[48%] rounded-3xl bg-emerald-50 p-5">
              <Text className="text-xs uppercase tracking-[0.25em] text-emerald-700">
                Fiber
              </Text>
              <Text className="mt-3 text-2xl font-bold text-emerald-900">
                12% DV
              </Text>
            </View>
            <View className="w-[48%] rounded-3xl bg-amber-50 p-5">
              <Text className="text-xs uppercase tracking-[0.25em] text-amber-700">
                Cals
              </Text>
              <Text className="mt-3 text-2xl font-bold text-amber-900">22</Text>
              <Text className="text-xs text-slate-500">per 100g</Text>
            </View>
            <View className="w-[48%] rounded-3xl bg-stone-100 p-5">
              <Text className="text-xs uppercase tracking-[0.25em] text-stone-600">
                Lycopene
              </Text>
              <Text className="mt-3 text-2xl font-bold text-stone-900">
                High Content
              </Text>
            </View>
          </View>

          <Text className="mt-8 text-xl font-bold text-slate-900">
            About this Harvest
          </Text>
          <Text className="mt-3 text-sm leading-6 text-slate-600">
            {product.description}
          </Text>

          <View className="mt-8 flex-row items-center justify-between gap-4 rounded-[36px] bg-slate-100 px-4 py-4">
            <View className="flex-row items-center rounded-full bg-white px-4 py-3">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-200"
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={20}
                  color="#475569"
                />
              </TouchableOpacity>
              <Text className="mx-4 text-lg font-bold text-slate-900">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="h-10 w-10 items-center justify-center rounded-full bg-emerald-700"
              >
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="flex-1 rounded-3xl bg-emerald-900 py-4 items-center justify-center">
              <Text className="text-base font-semibold text-white">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
