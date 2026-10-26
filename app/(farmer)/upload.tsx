import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
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
import { chooseImageSource } from "@/lib/imagePick";
import { useMoney } from "@/lib/useMoney";

const MAX_PHOTOS = 5;

const CROPS: {
  id: ProductType;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}[] = [
  { id: "YAM", label: "Yam", icon: "food-drumstick-outline" },
  { id: "SWEET_POTATO", label: "Sweet Potato", icon: "carrot" },
  { id: "CASSAVA", label: "Cassava", icon: "food-variant" },
  { id: "WATER_YAM", label: "Water Yam", icon: "leaf" },
];

export default function Upload() {
  const router = useRouter();
  const { code, symbol, toUsd } = useMoney();

  const [productName, setProductName] = useState<ProductType | null>(null);
  const [quantityKg, setQuantityKg] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddPhoto = async () => {
    if (images.length >= MAX_PHOTOS) return;
    const uri = await chooseImageSource();
    if (!uri) return;
    setImages((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, uri]));
  };

  const removePhoto = (uri: string) => {
    setImages((prev) => prev.filter((u) => u !== uri));
  };

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
    // Price is entered in the chosen display currency; convert to the USD base
    // the backend stores. Identity when the chosen currency is USD.
    const enteredPrice = unitPrice.trim() ? Number(unitPrice) : undefined;
    if (enteredPrice !== undefined && (!Number.isFinite(enteredPrice) || enteredPrice <= 0)) {
      Alert.alert("Invalid price", "Price per kg must be a number greater than zero, or leave it blank for market pricing.");
      return;
    }
    const priceUsd = enteredPrice !== undefined ? toUsd(enteredPrice) : undefined;

    setSubmitting(true);
    try {
      // Upload any attached photos first, then create the listing with their URLs.
      let uploadedUrls: string[] = [];
      if (images.length) {
        uploadedUrls = await Promise.all(
          images.map((uri) => ProductService.uploadProductImage(uri))
        );
      }

      await ProductService.createProduct({
        productName,
        quantityKg: qty,
        unitPriceOverride: priceUsd,
        location: location.trim() || undefined,
        state: state.trim() || undefined,
        description: description.trim() || undefined,
        images: uploadedUrls.length ? uploadedUrls : undefined,
      });
      Alert.alert("Produce listed", "Your produce is now live on the marketplace.");
      router.replace("/(farmer)/inventory");
    } catch (err: any) {
      Alert.alert("Could not list produce", err?.message || "Please try again.");
      setSubmitting(false);
    }
  };

  const pricePreviewUsd =
    unitPrice.trim() && code !== "USD" ? toUsd(Number(unitPrice) || 0) : null;

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
          <View className="mt-4 flex-row flex-wrap justify-between">
            {CROPS.map((crop) => {
              const active = productName === crop.id;
              return (
                <TouchableOpacity
                  key={crop.id}
                  onPress={() => setProductName(crop.id)}
                  style={{ width: "48%" }}
                  className={`items-center rounded-3xl border px-3 py-5 mb-3 ${
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

          {/* PHOTOS */}
          <Text className="mt-8 text-base font-semibold text-slate-900">Photos</Text>
          <Text className="mt-1 text-xs text-slate-400">
            Add up to {MAX_PHOTOS} photos from your camera or gallery — buyers see these first.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerStyle={{ gap: 12, paddingRight: 4 }}
          >
            {images.map((uri) => (
              <View key={uri} className="relative">
                <Image
                  source={{ uri }}
                  style={{ width: 96, height: 96, borderRadius: 20 }}
                  contentFit="cover"
                />
                <TouchableOpacity
                  onPress={() => removePhoto(uri)}
                  className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-rose-600"
                >
                  <MaterialCommunityIcons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < MAX_PHOTOS ? (
              <TouchableOpacity
                onPress={handleAddPhoto}
                disabled={submitting}
                className="h-24 w-24 items-center justify-center rounded-[20px] border-2 border-dashed border-emerald-300 bg-emerald-50"
              >
                <MaterialCommunityIcons name="camera-plus-outline" size={26} color="#047857" />
                <Text className="mt-1 text-xs font-semibold text-emerald-700">Add</Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>

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
                Price per kg ({symbol} {code})
              </Text>
              <TextInput
                value={unitPrice}
                onChangeText={setUnitPrice}
                placeholder="Leave blank for market price"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
              />
              {pricePreviewUsd !== null ? (
                <Text className="mt-2 text-xs font-semibold text-emerald-700">
                  ≈ ${pricePreviewUsd.toFixed(2)} USD
                </Text>
              ) : null}
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
