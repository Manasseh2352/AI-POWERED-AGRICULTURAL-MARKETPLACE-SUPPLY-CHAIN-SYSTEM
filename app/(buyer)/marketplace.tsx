import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ProductService, type UiProduct } from "@/services/product.service";
import { useCartStore } from "@/store/cartStore";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";

function ProductCard({
  product,
  router,
  onAdd,
}: {
  product: UiProduct;
  router: ReturnType<typeof useRouter>;
  onAdd: (p: UiProduct) => void;
}) {
  const imageUrl = product.images?.[0] || FALLBACK_IMAGE;
  const perishable = product.perishable;

  return (
    <View className="mb-4 rounded-[32px] bg-white shadow-sm shadow-black/5 overflow-hidden">
      <TouchableOpacity
        onPress={() => router.push(`/(buyer)/products/${product.id}`)}
        className="relative h-56 w-full bg-gray-100"
      >
        <Image source={{ uri: imageUrl }} contentFit="cover" className="h-full w-full" />

        {/* Transport mode pill */}
        <View
          className={`absolute right-4 top-4 rounded-full px-3 py-1 flex-row items-center gap-1 ${
            perishable ? "bg-sky-600" : "bg-blue-700"
          }`}
        >
          <MaterialCommunityIcons
            name={perishable ? "airplane" : "ferry"}
            size={12}
            color="#fff"
          />
          <Text className="text-xs font-bold text-white">
            {perishable ? "Air" : "Sea"}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="p-5">
        <Text className="text-lg font-semibold text-slate-900">{product.name}</Text>
        <Text className="text-sm text-slate-500 mt-1" numberOfLines={1}>
          {product.description}
        </Text>

        <View className="mt-4 flex-row items-end justify-between">
          <View>
            <Text className="text-xl font-bold text-slate-900">
              ${product.pricePerKg.toFixed(2)}
            </Text>
            <Text className="text-xs text-slate-500">per kg</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="account" size={16} color="#6b7280" />
            <Text className="text-sm text-slate-500" numberOfLines={1}>
              {product.seller}
            </Text>
          </View>
        </View>

        <Text className="mt-1 text-xs text-slate-400">
          {product.quantityKg.toLocaleString()}kg available
        </Text>

        <TouchableOpacity
          onPress={() => onAdd(product)}
          className="mt-6 rounded-3xl bg-emerald-900 py-4 items-center justify-center"
        >
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="cart" size={18} color="#fff" />
            <Text className="text-sm font-semibold text-white">Add to Cart</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Marketplace() {
  const router = useRouter();

  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const addItem = useCartStore((s) => s.addItem);
  const cartCount = useCartStore((s) => s.items.length);

  const loadProducts = async () => {
    try {
      const data = await ProductService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, []);

  const handleAdd = (p: UiProduct) => {
    addItem(p, 1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.productName.toLowerCase().includes(q)
    );
  }, [products, search]);

  const perishableProducts = filtered.filter((p) => p.perishable);
  const nonPerishableProducts = filtered.filter((p) => !p.perishable);

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      {/* STICKY HEADER */}
      <View className="px-6 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-emerald-900">HarvestAI</Text>
          <TouchableOpacity
            onPress={() => router.push("/(buyer)/notifications")}
            className="rounded-2xl bg-white p-3 shadow-sm shadow-black/5"
          >
            <MaterialCommunityIcons name="bell-outline" size={20} color="#14532d" />
          </TouchableOpacity>
        </View>

        <Text className="mt-6 text-3xl font-bold text-slate-900">
          Explore the Marketplace
        </Text>

        {/* SEARCH BAR */}
        <View className="mt-6 rounded-3xl bg-white px-4 py-3 shadow-sm shadow-black/5">
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search produce or farms"
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              className="flex-1 text-base text-slate-900"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <MaterialCommunityIcons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* PRODUCT LIST */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#047857" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 6, paddingTop: 18, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#047857" />
          }
        >
          {filtered.length === 0 && (
            <View className="py-10 items-center justify-center">
              <MaterialCommunityIcons name="basket-off-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 mt-4 text-center px-4">
                {products.length === 0
                  ? "No products available yet. Pull down to refresh."
                  : "No products match your search."}
              </Text>
            </View>
          )}

          {/* ── PERISHABLE SECTION ── */}
          {perishableProducts.length > 0 && (
            <View className="px-2 mb-2">
              <View className="flex-row items-center gap-3 mb-4">
                <View className="flex-row items-center gap-2 bg-rose-100 rounded-full px-4 py-2">
                  <MaterialCommunityIcons name="snowflake" size={16} color="#be123c" />
                  <Text className="text-sm font-bold text-rose-700 uppercase tracking-wider">
                    Perishable
                  </Text>
                </View>
                <View className="flex-1 h-px bg-rose-200" />
                <View className="flex-row items-center gap-1 bg-sky-50 border border-sky-200 rounded-full px-3 py-1">
                  <MaterialCommunityIcons name="airplane" size={13} color="#0369a1" />
                  <Text className="text-xs font-semibold text-sky-700">Air Freight</Text>
                </View>
              </View>

              <View className="mb-4 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 flex-row items-start gap-3">
                <MaterialCommunityIcons name="information-outline" size={16} color="#be123c" />
                <Text className="text-xs text-rose-700 flex-1 leading-5">
                  These items require temperature-controlled air freight to preserve freshness during transit.
                </Text>
              </View>

              {perishableProducts.map((product) => (
                <ProductCard key={product.id} product={product} router={router} onAdd={handleAdd} />
              ))}
            </View>
          )}

          {/* ── NON-PERISHABLE SECTION ── */}
          {nonPerishableProducts.length > 0 && (
            <View className="px-2 mt-6 mb-2">
              <View className="flex-row items-center gap-3 mb-4">
                <View className="flex-row items-center gap-2 bg-amber-100 rounded-full px-4 py-2">
                  <MaterialCommunityIcons name="package-variant-closed" size={16} color="#92400e" />
                  <Text className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                    Non-Perishable
                  </Text>
                </View>
                <View className="flex-1 h-px bg-amber-200" />
                <View className="flex-row items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                  <MaterialCommunityIcons name="ferry" size={13} color="#1d4ed8" />
                  <Text className="text-xs font-semibold text-blue-700">Sea Freight</Text>
                </View>
              </View>

              <View className="mb-4 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 flex-row items-start gap-3">
                <MaterialCommunityIcons name="information-outline" size={16} color="#92400e" />
                <Text className="text-xs text-amber-800 flex-1 leading-5">
                  Bulk, shelf-stable produce shipped cost-effectively via sea freight containers.
                </Text>
              </View>

              {nonPerishableProducts.map((product) => (
                <ProductCard key={product.id} product={product} router={router} onAdd={handleAdd} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* FAB with cart count */}
      <TouchableOpacity
        onPress={() => router.push("/(buyer)/cart")}
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-amber-400 shadow-xl shadow-amber-400/30"
      >
        <MaterialCommunityIcons name="cart" size={28} color="#064e3b" />
        {cartCount > 0 && (
          <View className="absolute -right-1 -top-1 h-6 w-6 items-center justify-center rounded-full bg-emerald-900">
            <Text className="text-xs font-bold text-white">{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
