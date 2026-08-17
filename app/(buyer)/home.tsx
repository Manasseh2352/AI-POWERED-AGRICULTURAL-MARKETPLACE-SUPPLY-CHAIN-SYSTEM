import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ProductService, type UiProduct, type ProductType } from "@/services/product.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";

const categories: { id: ProductType; label: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"] }[] = [
  { id: "YAM", label: "Yam", icon: "food-drumstick-outline" },
  { id: "TOMATO", label: "Tomato", icon: "fruit-cherries" },
  { id: "POTATO", label: "Potato", icon: "sprout" },
];

export default function BuyerHome() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const cartCount = useCartStore((s) => s.items.length);

  const buyerName =
    useAuthStore.getState().user?.fullName ||
    useAuthStore.getState().user?.email ||
    "";

  const [visited, setVisited] = useState<boolean | null>(null);
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    const KEY = "buyerHomeVisited";
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const seen = raw === "true";
        if (!isMounted) return;
        setVisited(seen);
        if (!seen) await AsyncStorage.setItem(KEY, "true");
      } catch {
        if (!isMounted) return;
        setVisited(true);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await ProductService.getAllProducts();
        if (active) setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const featured = products[0];
  const recommended = products.slice(0, 4);

  const submitSearch = () => {
    router.push("/(buyer)/marketplace");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-emerald-900">HarvestAI</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => router.push("/(buyer)/cart")}
                className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
              >
                <MaterialCommunityIcons name="cart-outline" size={20} color="#14532d" />
                {cartCount > 0 && (
                  <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-emerald-900">
                    <Text className="text-[10px] font-bold text-white">{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(buyer)/notifications")}
                className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
              >
                <MaterialCommunityIcons name="bell-outline" size={20} color="#14532d" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mt-6 text-sm uppercase text-amber-700 font-semibold">
            {visited ? "Welcome Back" : "Welcome"}
          </Text>
          <Text className="mt-2 text-3xl font-bold text-slate-900">
            Hello, {buyerName || "Buyer"}
          </Text>

          <View className="mt-4 rounded-3xl bg-white px-4 py-3 shadow-sm shadow-black/5">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
              <TextInput
                placeholder="Search fresh produce or farms"
                placeholderTextColor="#9ca3af"
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={submitSearch}
                returnKeyType="search"
                className="flex-1 text-base text-slate-900"
              />
            </View>
          </View>

          {/* Featured */}
          <View className="mt-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-slate-900">Featured Produce</Text>
            <TouchableOpacity onPress={() => router.push("/(buyer)/marketplace")}>
              <Text className="text-sm font-semibold text-emerald-700">See All →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="mt-8 items-center justify-center py-10">
              <ActivityIndicator size="large" color="#047857" />
            </View>
          ) : featured ? (
            <TouchableOpacity
              onPress={() => router.push(`/(buyer)/products/${featured.id}`)}
              className="mt-4 overflow-hidden rounded-3xl"
            >
              <Image
                source={{ uri: featured.images?.[0] || FALLBACK_IMAGE }}
                contentFit="cover"
                className="h-56 w-full rounded-3xl bg-slate-200"
              />
              <View className="-mt-28 p-5">
                <View className="self-start rounded-full bg-amber-100 px-3 py-1">
                  <Text className="text-xs font-semibold text-amber-800">
                    {featured.perishable ? "Air Freight" : "Sea Freight"}
                  </Text>
                </View>
                <Text className="mt-3 text-2xl font-bold text-white">{featured.name}</Text>
                <Text className="mt-2 text-sm text-white/90" numberOfLines={2}>
                  {featured.description}
                </Text>
                <View className="mt-4 flex-row">
                  <View className="flex-row items-center rounded-full bg-white px-4 py-3">
                    <MaterialCommunityIcons name="shopping" size={18} color="#14532d" />
                    <Text className="ml-2 font-semibold text-emerald-900">
                      ${featured.pricePerKg.toFixed(2)}/kg
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View className="mt-4 rounded-3xl bg-white p-8 items-center">
              <MaterialCommunityIcons name="sprout-outline" size={40} color="#9ca3af" />
              <Text className="mt-3 text-sm text-slate-500 text-center">
                No produce listed yet. Check back soon.
              </Text>
            </View>
          )}

          {/* Categories */}
          <Text className="mt-6 text-lg font-semibold text-slate-900">Browse Crops</Text>
          <View className="mt-4 flex-row items-center justify-around">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push("/(buyer)/marketplace")}
                className="items-center"
              >
                <View className="h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <MaterialCommunityIcons name={cat.icon} size={24} color="#166534" />
                </View>
                <Text className="mt-2 text-sm text-slate-700">{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recommended */}
          {recommended.length > 0 && (
            <>
              <Text className="mt-6 text-base font-semibold text-amber-700">
                Recommended for You
              </Text>
              <View
                className="mt-4"
                style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}
              >
                {recommended.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => router.push(`/(buyer)/products/${p.id}`)}
                    className="rounded-[18px] bg-white p-3 shadow-sm shadow-black/5"
                    style={{ width: "48%", marginBottom: 16 }}
                  >
                    <Image
                      source={{ uri: p.images?.[0] || FALLBACK_IMAGE }}
                      contentFit="cover"
                      className="h-28 w-full rounded-2xl bg-slate-100"
                    />
                    <Text className="mt-3 font-semibold text-slate-900" numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text className="text-sm text-emerald-900 mt-1">
                      ${p.pricePerKg.toFixed(2)}/kg
                    </Text>
                    <TouchableOpacity
                      onPress={() => addItem(p, 1)}
                      className="mt-3 rounded-xl bg-emerald-900 py-2 items-center justify-center"
                    >
                      <Text className="text-sm font-semibold text-white">Add to Cart</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View className="mt-2 rounded-2xl bg-emerald-900 p-5 shadow-sm shadow-black/10">
            <Text className="text-lg font-semibold text-white">Market Insights</Text>
            <Text className="mt-2 text-sm text-emerald-100">
              Explore AI-powered price predictions and demand forecasts to time your purchases.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(ai)/insight")}
              className="mt-4 self-start rounded-full bg-white px-4 py-2"
            >
              <Text className="text-sm font-semibold text-emerald-900">Open AI Insights →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
