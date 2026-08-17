import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AiService } from "@/services/ai.service";

type Tool = {
  route: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tint: string;
};

const TOOLS: Tool[] = [
  {
    route: "/(ai)/pricing",
    title: "Price Prediction",
    subtitle: "Forecast the next-cycle market price per kg.",
    icon: "chart-line",
    tint: "bg-emerald-100",
  },
  {
    route: "/(ai)/demand",
    title: "Demand Forecast",
    subtitle: "Project daily demand over the coming weeks.",
    icon: "chart-bar",
    tint: "bg-sky-100",
  },
  {
    route: "/(ai)/crop-recommendation",
    title: "Crop Recommendation",
    subtitle: "Rank YAM, TOMATO & POTATO by market value.",
    icon: "sprout",
    tint: "bg-amber-100",
  },
];

const fmtMoney = (n?: number, currency = "USD") =>
  n === undefined
    ? "—"
    : `${currency === "USD" ? "$" : ""}${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

export default function Insight() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | undefined>();
  const [currency, setCurrency] = useState("USD");
  const [avgDemand, setAvgDemand] = useState<number | undefined>();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, d] = await Promise.all([
          AiService.predictPrice({}),
          AiService.forecastDemand({ horizonDays: 7 }),
        ]);
        if (!active) return;
        setPrice(p?.predictedPrice);
        setCurrency(p?.currency ?? "USD");
        const daily = Array.isArray(d?.forecast) && d.forecast.length
          ? d.forecast.reduce((s, v) => s + v, 0) / d.forecast.length
          : undefined;
        setAvgDemand(daily);
      } catch (err) {
        console.error("Failed to load AI snapshot", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
            <Text className="text-xl font-bold text-emerald-900">AI Insights</Text>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons name="brain" size={20} color="#14532d" />
            </View>
          </View>

          {/* HERO SNAPSHOT */}
          <View className="mt-6 rounded-[32px] bg-emerald-900 p-6 shadow-sm shadow-black/10">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="star-four-points" size={16} color="#fde68a" />
              <Text className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                Live Market Snapshot
              </Text>
            </View>

            {loading ? (
              <View className="py-6">
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <View className="mt-5 flex-row">
                <View className="flex-1">
                  <Text className="text-xs uppercase tracking-widest text-emerald-200">
                    Predicted Price
                  </Text>
                  <Text className="mt-1 text-3xl font-bold text-white">
                    {fmtMoney(price, currency)}
                  </Text>
                  <Text className="text-xs text-emerald-200">per kg · next cycle</Text>
                </View>
                <View className="w-px bg-emerald-700" />
                <View className="flex-1 pl-4">
                  <Text className="text-xs uppercase tracking-widest text-emerald-200">
                    Avg Daily Demand
                  </Text>
                  <Text className="mt-1 text-3xl font-bold text-white">
                    {avgDemand === undefined ? "—" : `${Math.round(avgDemand)}`}
                  </Text>
                  <Text className="text-xs text-emerald-200">kg · next 7 days</Text>
                </View>
              </View>
            )}
          </View>

          {/* TOOLS */}
          <Text className="mt-8 text-base font-semibold text-slate-900">Explore Tools</Text>
          <View className="mt-4 gap-4">
            {TOOLS.map((tool) => (
              <TouchableOpacity
                key={tool.route}
                onPress={() => router.push(tool.route as any)}
                className="flex-row items-center rounded-[28px] bg-white p-5 shadow-sm shadow-black/5"
              >
                <View className={`h-14 w-14 items-center justify-center rounded-3xl ${tool.tint}`}>
                  <MaterialCommunityIcons name={tool.icon} size={26} color="#14532d" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-base font-bold text-slate-900">{tool.title}</Text>
                  <Text className="mt-1 text-sm text-slate-500">{tool.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-6 flex-row items-center gap-2 px-1">
            <MaterialCommunityIcons name="information-outline" size={14} color="#9ca3af" />
            <Text className="flex-1 text-xs text-slate-400">
              Estimates are generated locally from live marketplace data. Use them as guidance, not a guarantee.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
