import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductService, type UiProduct } from "@/services/product.service";
import { useCartStore } from "@/store/cartStore";
import { useMoney } from "@/lib/useMoney";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const productId = Array.isArray(id) ? id[0] : id;

  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const cartCount = useCartStore((s) => s.items.length);
  const { format } = useMoney();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      try {
        const p = await ProductService.getProductById(productId);
        if (active) setProduct(p);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f2f6ef] items-center justify-center">
        <ActivityIndicator size="large" color="#047857" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-[#f2f6ef] items-center justify-center px-8">
        <MaterialCommunityIcons name="basket-off-outline" size={56} color="#9ca3af" />
        <Text className="mt-4 text-lg font-semibold text-slate-700 text-center">
          This product is no longer available.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 rounded-3xl bg-emerald-900 px-6 py-3"
        >
          <Text className="text-white font-semibold">Back to marketplace</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const maxStock = Math.max(1, Math.floor(product.quantityKg));
  const imageUrl = product.images?.[0] || FALLBACK_IMAGE;
  const lineTotal = product.pricePerKg * quantity;

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(maxStock, q + 1));

  const handleAddToCart = () => {
    addItem(product, quantity);
    Alert.alert(
      "Added to cart",
      `${quantity}kg of ${product.name} added to your cart.`,
      [
        { text: "Keep shopping", style: "cancel" },
        { text: "View cart", onPress: () => router.push("/(buyer)/cart") },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f2f6ef]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative">
          <Image source={{ uri: imageUrl }} contentFit="cover" className="h-96 w-full bg-slate-200" />
          <View className="absolute inset-x-0 top-4 flex-row items-center justify-between px-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white/90"
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#14532d" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(buyer)/cart")}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white/90"
            >
              <MaterialCommunityIcons name="cart-outline" size={20} color="#14532d" />
              {cartCount > 0 && (
                <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-emerald-900">
                  <Text className="text-[10px] font-bold text-white">{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="-mt-14 rounded-t-[36px] bg-white px-6 pt-6 pb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <View className="self-start rounded-full bg-emerald-50 px-3 py-1">
                <Text className="text-xs font-semibold text-emerald-700">
                  {product.productName}
                </Text>
              </View>
              <Text className="mt-4 text-3xl font-bold text-slate-900">{product.name}</Text>
            </View>
            <View className="items-end">
              <Text className="text-3xl font-bold text-emerald-900">
                {format(product.pricePerKg)}
              </Text>
              <Text className="text-xs text-slate-500">per kg</Text>
            </View>
          </View>

          {/* Stock facts */}
          <View className="mt-4 flex-row gap-3">
            <View className="flex-1 rounded-3xl bg-slate-50 px-4 py-5">
              <Text className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Available
              </Text>
              <Text className="mt-3 text-2xl font-bold text-slate-900">
                {product.quantityKg.toLocaleString()}
              </Text>
              <Text className="text-xs text-slate-500">kg in stock</Text>
            </View>
          </View>

          {/* Seller */}
          <View className="mt-6 rounded-[32px] bg-emerald-50 p-5">
            <View className="flex-row items-center gap-3">
              <View className="h-14 w-14 rounded-full bg-emerald-700 items-center justify-center">
                <MaterialCommunityIcons name="account" size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900">{product.seller}</Text>
                <Text className="text-sm text-slate-600">
                  Verified Producer{product.location ? ` • ${product.location}` : ""}
                </Text>
              </View>
            </View>
          </View>

          <Text className="mt-8 text-xl font-bold text-slate-900">About this Harvest</Text>
          <Text className="mt-3 text-sm leading-6 text-slate-600">{product.description}</Text>

          {product.destinationCountry ? (
            <View className="mt-4 flex-row items-center gap-2">
              <MaterialCommunityIcons name="earth" size={16} color="#0369a1" />
              <Text className="text-sm text-slate-600">
                Export destination:{" "}
                <Text className="font-semibold text-slate-900">{product.destinationCountry}</Text>
              </Text>
            </View>
          ) : null}

          {/* Quantity selector + add to cart */}
          <View className="mt-8 rounded-[36px] bg-slate-100 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-slate-600">Quantity (kg)</Text>
              <Text className="text-sm font-semibold text-emerald-800">
                Subtotal {format(lineTotal)}
              </Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between gap-4">
              <View className="flex-row items-center rounded-full bg-white px-4 py-3">
                <TouchableOpacity
                  onPress={decrement}
                  className="h-10 w-10 items-center justify-center rounded-full bg-slate-200"
                >
                  <MaterialCommunityIcons name="minus" size={20} color="#475569" />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-bold text-slate-900">{quantity}</Text>
                <TouchableOpacity
                  onPress={increment}
                  className="h-10 w-10 items-center justify-center rounded-full bg-emerald-700"
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleAddToCart}
                className="flex-1 rounded-3xl bg-emerald-900 py-4 items-center justify-center"
              >
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="cart" size={18} color="#fff" />
                  <Text className="text-base font-semibold text-white">Add to Cart</Text>
                </View>
              </TouchableOpacity>
            </View>
            {quantity >= maxStock && (
              <Text className="mt-3 text-xs text-amber-700">
                You&apos;ve reached the available stock for this listing.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
