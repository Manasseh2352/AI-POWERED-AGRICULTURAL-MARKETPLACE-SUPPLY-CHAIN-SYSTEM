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
import { AiService, type PricePrediction } from "@/services/ai.service";
import { useMoney } from "@/lib/useMoney";

export default function Pricing() {
  const router = useRouter();
  const { format } = useMoney();

  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricePrediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AiService.predictPrice({
        region: region.trim() || undefined,
        state: region.trim() || undefined,
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "Could not generate a prediction.");
    } finally {
      setLoading(false);
    }
  };

  const info = result?.modelInfo;

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
            <Text className="text-xl font-bold text-emerald-900">Price Prediction</Text>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="chart-line" size={20} color="#14532d" />
            </View>
          </View>

          <Text className="mt-6 text-sm text-slate-500">
            Estimate the next-cycle market price per kg. Add a region to anchor the estimate, or leave it blank for a market-wide average.
          </Text>

          {/* INPUT */}
          <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">Region / State (optional)</Text>
            <TextInput
              value={region}
              onChangeText={setRegion}
              placeholder="e.g. Kano"
              placeholderTextColor="#9ca3af"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-slate-900"
            />
            <TouchableOpacity
              onPress={runPrediction}
              disabled={loading}
              className={`mt-4 rounded-2xl px-6 py-4 items-center justify-center ${loading ? "bg-emerald-400" : "bg-emerald-900"}`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="calculator-variant-outline" size={18} color="#fff" />
                  <Text className="text-base font-semibold text-white">Predict Price</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4">
              <Text className="text-rose-700">{error}</Text>
            </View>
          ) : null}

          {/* RESULT */}
          {result ? (
            <View className="mt-6 rounded-[32px] bg-emerald-900 p-6 shadow-sm shadow-black/10 items-center">
              <Text className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200">
                Predicted Price
              </Text>
              <Text className="mt-3 text-5xl font-bold text-white">
                {format(result.predictedPrice)}
              </Text>
              <Text className="mt-1 text-sm text-emerald-200">
                per kg · {result.horizon ?? "next-cycle"}
              </Text>
            </View>
          ) : null}

          {info ? (
            <View className="mt-4 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
              <Text className="text-sm font-semibold text-slate-900">How this was calculated</Text>
              <View className="mt-3 gap-2">
                <Row label="Engine" value={String(info.engine ?? "—")} />
                <Row label="Method" value={String(info.method ?? "—")} />
                {info.samples !== undefined ? (
                  <Row label="Data points" value={String(info.samples)} />
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-slate-500">{label}</Text>
      <Text className="text-sm font-semibold text-slate-800 capitalize">{value}</Text>
    </View>
  );
}
