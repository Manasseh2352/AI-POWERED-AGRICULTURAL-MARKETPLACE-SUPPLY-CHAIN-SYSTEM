import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Slide2() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/(public)/onboarding/slide3");
  };

  const handleSkip = () => {
    router.replace("/(public)/choose-role");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-4">
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl">🌾</Text>
            <Text className="text-2xl font-bold text-emerald-700">
              HarvestAI
            </Text>
          </View>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-gray-800 font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* BACKGROUND IMAGE */}
        <View className="mt-4 h-72 overflow-hidden rounded-2xl mx-6 relative">
          <Image
            source={require("@/assets/images/Home.jpeg")}
            className="w-full h-full"
            contentFit="cover"
          />
          <View className="absolute inset-0 bg-black/20" />

          {/* DEMAND UP CARD */}
          <View className="absolute top-8 left-6 bg-white rounded-2xl px-4 py-3 flex-row items-center gap-3 shadow-lg shadow-black/10">
            <View className="w-10 h-10 rounded-full bg-yellow-400 items-center justify-center">
              <Text className="text-lg">📈</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Demand Up</Text>
              <Text className="text-lg font-bold text-emerald-700">
                +12.5% Wheat
              </Text>
            </View>
          </View>

          {/* OPTIMAL HARVEST CARD */}
          <View className="absolute bottom-12 right-6 bg-white rounded-2xl px-4 py-3 flex-row items-center gap-3 shadow-lg shadow-black/10">
            <View>
              <Text className="text-xs text-gray-500">Optimal Harvest</Text>
              <Text className="text-lg font-bold text-gray-900">85%</Text>
            </View>
            <View className="w-12 h-1 bg-emerald-700 rounded-full" />
          </View>
        </View>

        {/* MAIN HEADLINE */}
        <View className="mx-6 mt-8">
          <Text className="text-4xl font-bold text-gray-900">
            AI–Powered Growth
          </Text>
        </View>

        {/* DESCRIPTION */}
        <Text className="mx-6 mt-4 text-center text-base text-gray-600 leading-6">
          Unlock precision agriculture with real-time market insights and demand
          predictions tailored to your farm's ecosystem.
        </Text>

        {/* FEATURE CARDS */}
        <View className="mx-6 mt-8 flex-row gap-3">
          <View className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100 items-center">
            <Text className="text-3xl mb-2">📊</Text>
            <Text className="text-sm font-bold text-gray-900 text-center">
              Trend Analysis
            </Text>
          </View>

          <View className="flex-1 bg-yellow-50 rounded-2xl p-4 border border-yellow-100 items-center">
            <Text className="text-3xl mb-2">✨</Text>
            <Text className="text-sm font-bold text-gray-900 text-center">
              Smart Forecasting
            </Text>
          </View>
        </View>

        {/* DOTS INDICATOR */}
        <View className="flex-row justify-center gap-2 mt-10">
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-emerald-700" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
        </View>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          onPress={handleNext}
          className="mx-6 mt-8 bg-emerald-700 rounded-2xl py-4 shadow-lg shadow-emerald-700/20"
        >
          <Text className="text-center text-white font-bold text-base">
            Next →
          </Text>
        </TouchableOpacity>

        {/* SKIP LINK */}
        <TouchableOpacity
          onPress={handleSkip}
          className="items-center mt-4 mb-8"
        >
          <Text className="text-gray-600 font-semibold">Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
