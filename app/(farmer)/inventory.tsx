import { ProductService, type UiProduct } from "@/services/product.service";
import { toast } from "@/store/toastStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";

export default function Inventory() {
  const router = useRouter();

  const [inventory, setInventory] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Promise chain instead of async/await: state is only touched from async
  // callbacks, so the mount effect never updates state synchronously.
  const loadData = () => {
    return ProductService.getMyProducts()
      .then((products) => setInventory(products))
      .catch((e) => console.error("Failed to load inventory", e))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const handleDelete = async (item: UiProduct) => {
    const message = `"${item.name}" will be permanently removed from the marketplace. This cannot be undone.`;

    // Native gets the OS alert with Cancel/Delete buttons. react-native-web's
    // Alert.alert is a no-op (no button support), so web uses the browser's
    // native confirm dialog instead.
    const confirmed =
      Platform.OS === "web"
        ? window.confirm(`Delete listing?\n\n${message}`)
        : await new Promise<boolean>((resolve) => {
            Alert.alert("Delete listing?", message, [
              { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
              { text: "Delete", style: "destructive", onPress: () => resolve(true) },
            ]);
          });

    if (!confirmed) return;

    try {
      await ProductService.deleteProduct(item.id);
      setInventory((prev) => prev.filter((p) => p.id !== item.id));
      toast.success("Listing deleted", `"${item.name}" has been removed.`);
    } catch (e: any) {
      toast.error("Could not delete", e?.message || "Please try again.");
    }
  };

  const totalStock = inventory.reduce(
    (acc, curr) => acc + (curr.quantityKg || 0),
    0,
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#047857"
          />
        }
      >
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
              <TouchableOpacity
                onPress={() => router.push("/(farmer)/upload")}
                className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
              >
                <MaterialCommunityIcons name="plus" size={20} color="#14532d" />
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
                {totalStock.toLocaleString()} kg
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
              <Text className="text-xs text-gray-500 uppercase font-semibold">
                Active Listings
              </Text>
              <Text className="text-2xl font-bold text-emerald-900 mt-2">
                {inventory.length} {inventory.length === 1 ? "Item" : "Items"}
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
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#047857" className="mt-10" />
          ) : inventory.length === 0 ? (
            <View className="py-10 items-center justify-center">
              <MaterialCommunityIcons
                name="package-variant"
                size={48}
                color="#9ca3af"
              />
              <Text className="text-gray-500 mt-4 text-center">
                You have no products listed.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(farmer)/upload")}
                className="mt-6 rounded-3xl bg-emerald-900 px-8 py-4"
              >
                <Text className="text-base font-semibold text-white">
                  List your first produce
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-4">
              {inventory.map((item) => (
                <View
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-black/5 mb-4"
                >
                  <View className="relative h-48 w-full">
                    <Image
                      source={{ uri: item.images?.[0] || FALLBACK_IMAGE }}
                      className="w-full h-full"
                      contentFit="cover"
                    />
                    <View className="absolute top-3 left-3 bg-emerald-100 rounded-full px-3 py-1">
                      <Text className="text-xs font-bold text-emerald-700">
                        Listed
                      </Text>
                    </View>
                  </View>

                  <View className="p-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900">
                          {item.name}
                        </Text>
                        <Text className="text-sm font-semibold text-emerald-700 mt-1">
                          ${item.pricePerKg.toFixed(2)}/kg
                        </Text>
                      </View>
                      {item.location ? (
                        <View className="flex-row items-center gap-1 mr-2">
                          <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={14}
                            color="#9ca3af"
                          />
                          <Text className="text-xs text-gray-500">
                            {item.location}
                          </Text>
                        </View>
                      ) : null}
                      <TouchableOpacity
                        onPress={() => handleDelete(item)}
                        className="h-9 w-9 items-center justify-center rounded-full bg-rose-50"
                        accessibilityLabel={`Delete ${item.name} listing`}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={18}
                          color="#e11d48"
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="mt-3">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-gray-600 font-semibold">
                          Stock Quantity
                        </Text>
                        <Text className="text-xs text-gray-600 font-semibold">
                          {item.quantityKg.toLocaleString()} kg
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
        <View className="h-32" />
      </ScrollView>

      {/* FAB → upload produce */}
      <TouchableOpacity
        onPress={() => router.push("/(farmer)/upload")}
        className="absolute bottom-24 right-6 h-16 w-16 rounded-full bg-yellow-400 items-center justify-center shadow-lg shadow-yellow-400/40"
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
