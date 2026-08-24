import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AiService, type DemandForecast } from "@/services/ai.service";

const HORIZONS = [7, 14, 30];

const formatDay = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function Demand() {
  const router = useRouter();

  const [horizon, setHorizon] = useState(14);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemandForecast | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runForecast = async (days: number) => {
    setHorizon(days);
    setLoading(true);
    setError(null);
    try {
      const res = await AiService.forecastDemand({ horizonDays: days });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "Could not generate a forecast.");
    } finally {
      setLoading(false);
    }
  };

  const forecast = result?.forecast ?? [];
  const dates = result?.dates ?? [];
  const units = result?.units ?? "kg";
  const maxVal = forecast.length ? Math.max(...forecast, 1) : 1;
  const total = forecast.reduce((s, v) => s + v, 0);
  const avg = forecast.length ? total / forecast.length : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-4">
          {/* HEADER */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="#14532d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-emerald-900">Demand Forecast</Text>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="chart-bar" size={20} color="#14532d" />
            </View>
          </View>

          {/* HORIZON SELECTOR */}
          <Text className="mt-6 text-sm font-semibold text-slate-700">Forecast horizon</Text>
          <View className="mt-3 flex-row gap-3">
            {HORIZONS.map((h) => {
              const active = h === horizon;
              return (
                <TouchableOpacity
                  key={h}
                  onPress={() => runForecast(h)}
                  disabled={loading}
                  className={`flex-1 rounded-2xl py-3 items-center ${active ? "bg-emerald-900" : "bg-white"}`}
                >
                  <Text className={`text-sm font-semibold ${active ? "text-white" : "text-slate-700"}`}>
                    {h} days
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!result && !loading ? (
            <TouchableOpacity
              onPress={() => runForecast(horizon)}
              className="mt-5 rounded-2xl bg-emerald-900 px-6 py-4 items-center justify-center"
            >
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="trending-up" size={18} color="#fff" />
                <Text className="text-base font-semibold text-white">Run Forecast</Text>
              </View>
            </TouchableOpacity>
          ) : null}

          {loading ? (
            <View className="mt-10 items-center">
              <ActivityIndicator size="large" color="#047857" />
            </View>
          ) : null}

          {error ? (
            <View className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4">
              <Text className="text-rose-700">{error}</Text>
            </View>
          ) : null}

          {/* SUMMARY */}
          {result && !loading ? (
            <>
              <View className="mt-6 flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
                  <Text className="text-xs uppercase tracking-widest text-slate-400">Total</Text>
                  <Text className="mt-1 text-2xl font-bold text-emerald-900">
                    {Math.round(total).toLocaleString()}
                  </Text>
                  <Text className="text-xs text-slate-400">{units} over {horizon}d</Text>
                </View>
                <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
                  <Text className="text-xs uppercase tracking-widest text-slate-400">Daily Avg</Text>
                  <Text className="mt-1 text-2xl font-bold text-emerald-900">
                    {Math.round(avg).toLocaleString()}
                  </Text>
                  <Text className="text-xs text-slate-400">{units} / day</Text>
                </View>
              </View>

              {/* BAR LIST */}
              <View className="mt-6 rounded-[28px] bg-white p-5 shadow-sm shadow-black/5">
                <Text className="text-sm font-semibold text-slate-900 mb-4">
                  Projected daily demand
                </Text>
                {forecast.length === 0 ? (
                  <Text className="text-sm text-slate-500">No forecast data available.</Text>
                ) : (
                  forecast.map((v, i) => (
                    <View key={i} className="flex-row items-center py-1.5">
                      <Text className="w-16 text-xs text-slate-500">{formatDay(dates[i])}</Text>
                      <View className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                        <View
                          className="h-full rounded-full bg-emerald-600"
                          style={{ width: `${Math.max(4, (v / maxVal) * 100)}%` }}
                        />
                      </View>
                      <Text className="w-16 text-right text-xs font-semibold text-slate-700">
                        {Math.round(v)}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
