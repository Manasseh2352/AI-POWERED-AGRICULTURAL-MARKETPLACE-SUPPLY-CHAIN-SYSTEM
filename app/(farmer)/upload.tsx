import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductService, type ProductType } from "@/services/product.service";

const CROPS: {
  id: ProductType;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  freight: string;
}[] = [
  { id: "YAM", label: "Yam", icon: "food-drumstick-outline", freight: "Sea Freight" },
  { id: "TOMATO", label: "Tomato", icon: "fruit-cherries", freight: "Air Freight" },
  { id: "POTATO", label: "Potato", icon: "sprout", freight: "Sea Freight" },
];

export default function Upload() {
  const router = useRouter();

  const [productName, setProductName] = useState<ProductType | null>(null);
  const [quantityKg, setQuantityKg] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!productName) {
      Alert.alert("Select a crop", "Please choose which produce you are listing.");
      return;
    }
    const qty = Number(quantityKg);
    if (!Number.isFinite(qty) || qty <= 0) {
      Alert.alert("Invalid quantity", "Enter a quantity in kilograms greater than zero.");
      return;
    }
    const priceNum = unitPrice.trim() ? Number(unitPrice) : undefined;
    if (priceNum !== undefined && (!Number.isFinite(priceNum) || priceNum <= 0)) {
      Alert.alert("Invalid price", "Price per kg must be a number greater than zero, or leave it blank for market pricing.");
      return;
    }

    setSubmitting(true);
    try {
      await ProductService.createProduct({
        productName,
        quantityKg: qty,
        unitPriceOverride: priceNum,
        location: location.trim() || undefined,
        state: state.trim() || undefined,
        description: description.trim() || undefined,
      });
      Alert.alert("Produce listed", "Your produce is now live on the marketplace.");
      router.replace("/(farmer)/inventory");
    } catch (err: any) {
      Alert.alert("Could not list produce", err?.message || "Please try again.");
      setSubmitting(false);
    }
  };

  const selectedFreight = CROPS.find((c) => c.id === productName)?.freight;

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5 pt-4">
          {/* HEADER */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#14532d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-emerald-900">List Produce</Text>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="sprout" size={20} color="#14532d" />
            </View>
          </View>

          {/* CROP PICKER */}
          <Text className="mt-8 text-base font-semibold text-slate-900">Which crop?</Text>
          <View className="mt-4 flex-row gap-3">
            {CROPS.map((crop) => {
              const active = productName === crop.id;
              return (
                <TouchableOpacity
                  key={crop.id}
                  onPress={() => setProductName(crop.id)}
                  className={`flex-1 items-center rounded-3xl border px-3 py-5 ${
                    active ? "border-emerald-700 bg-emerald-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <View
                    className={`h-14 w-14 items-center justify-center rounded-full ${
                      active ? "bg-emerald-100" : "bg-slate-100"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name={crop.icon}
                      size={26}
                      color={active ? "#14532d" : "#64748b"}
                    />
                  </View>
                  <Text
                    className={`mt-3 text-sm font-semibold ${
                      active ? "text-emerald-900" : "text-slate-700"
                    }`}
                  >
                    {crop.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedFreight ? (
            <View className="mt-4 self-start rounded-full bg-amber-100 px-4 py-2">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name={selectedFreight === "Air Freight" ? "airplane" : "ferry"}
                  size={14}
                  color="#92400e"
                />
                <Text className="text-xs font-semibold text-amber-800">
                  Recommended: {selectedFreight}
                </Text>
              </View>
            </View>
          ) : null}

          {/* DETAILS */}
          <Text className="mt-8 text-base font-semibold text-slate-900">Listing Details</Text>
          <View className="mt-4 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5 gap-4">
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Quantity (kg) *</Text>
              <TextInput
                value={quantityKg}
                onChangeText={setQuantityKg}
                placeholder="e.g. 500"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Price per kg (USD)
              </Text>
              <TextInput
                value={unitPrice}
                onChangeText={setUnitPrice}
                placeholder="Leave blank for market price"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
              <Text className="mt-2 text-xs text-slate-400">
                If left blank, the system prices your produce from the latest market rate.
              </Text>
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Farm Location</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Town / area"
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">State / Region</Text>
              <TextInput
                value={state}
                onChangeText={setState}
                placeholder="Used for market pricing"
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Description (optional)</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Quality, grade, harvest date, etc."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
                style={{ textAlignVertical: "top" }}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className={`mt-6 rounded-[32px] px-6 py-4 items-center justify-center ${
              submitting ? "bg-emerald-400" : "bg-emerald-900"
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#fff" />
                <Text className="text-base font-semibold text-white">List Produce</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
