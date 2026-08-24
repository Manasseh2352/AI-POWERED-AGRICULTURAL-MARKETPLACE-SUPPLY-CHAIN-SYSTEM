import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AiService, type CropRecommendation } from "@/services/ai.service";
import { PRODUCT_LABELS, type ProductType } from "@/services/product.service";

type Risk = "LOW" | "MEDIUM" | "HIGH";
const RISKS: Risk[] = ["LOW", "MEDIUM", "HIGH"];

const CROP_ICON: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>["name"]> = {
  YAM: "food-drumstick-outline",
  SWEET_POTATO: "carrot",
  CASSAVA: "food-variant",
  WATER_YAM: "leaf",
};

const titleCase = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "Crop";

export default function CropRecommendationScreen() {
  const router = useRouter();

  const [state, setState] = useState("");
  const [risk, setRisk] = useState<Risk>("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AiService.recommendCrop({
        state: state.trim() || undefined,
        riskProfile: risk,
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "Could not generate recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const recommendations = result?.recommendations ?? [];

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View className="px-5 pt-4">
          {/* HEADER */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#14532d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-emerald-900">Crop Advisor</Text>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="sprout" size={20} color="#14532d" />
            </View>
          </View>

          <Text className="mt-6 text-sm text-slate-500">
            Ranks the supported tubers (Yam, Sweet Potato, Cassava, Water Yam) by current market value so you can plant what pays.
          </Text>

          {/* INPUTS */}
          <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">Region / State (optional)</Text>
            <TextInput
              value={state}
              onChangeText={setState}
              placeholder="e.g. Benue"
              placeholderTextColor="#9ca3af"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
            />

            <Text className="text-sm font-semibold text-slate-700 mt-4 mb-2">Risk appetite</Text>
            <View className="flex-row gap-3">
              {RISKS.map((r) => {
                const active = r === risk;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRisk(r)}
                    className={`flex-1 rounded-2xl py-3 items-center ${active ? "bg-emerald-900" : "bg-slate-100"}`}
                  >
                    <Text className={`text-xs font-semibold ${active ? "text-white" : "text-slate-600"}`}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={runRecommendation}
              disabled={loading}
              className={`mt-5 rounded-2xl px-6 py-4 items-center justify-center ${loading ? "bg-emerald-400" : "bg-emerald-900"}`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#fff" />
                  <Text className="text-base font-semibold text-white">Get Recommendations</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4">
              <Text className="text-rose-700">{error}</Text>
            </View>
          ) : null}

          {/* RESULTS */}
          {recommendations.length > 0 ? (
            <View className="mt-6 gap-4">
              {recommendations.map((rec, i) => {
                const pct = Math.round((rec.confidence ?? 0) * 100);
                const crop = String(rec.cropName ?? "").toUpperCase();
                const label = PRODUCT_LABELS[crop as ProductType] ?? titleCase(rec.cropName);
                return (
                  <View key={`${crop}-${i}`} className="rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
                    <View className="flex-row items-center gap-4">
                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                        <MaterialCommunityIcons
                          name={CROP_ICON[crop] ?? "leaf"}
                          size={24}
                          color="#14532d"
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-lg font-bold text-slate-900">{label}</Text>
                          {i === 0 ? (
                            <View className="rounded-full bg-amber-100 px-3 py-1">
                              <Text className="text-xs font-bold text-amber-800">Top Pick</Text>
                            </View>
                          ) : null}
                        </View>
                        {rec.notes ? (
                          <Text className="mt-0.5 text-sm text-slate-500">{rec.notes}</Text>
                        ) : null}
                      </View>
                    </View>

                    <View className="mt-4">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-slate-500">Market value score</Text>
                        <Text className="text-xs font-semibold text-emerald-800">{pct}%</Text>
                      </View>
                      <View className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <View
                          className="h-full rounded-full bg-emerald-600"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
