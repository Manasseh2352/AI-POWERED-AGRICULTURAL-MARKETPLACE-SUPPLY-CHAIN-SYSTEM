import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Slide1() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/(public)/onboarding/slide2");
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
        <View className="mt-4 h-72 overflow-hidden rounded-2xl mx-6">
          <Image
            source={require("@/assets/images/Home.jpeg")}
            className="w-full h-full"
            contentFit="cover"
          />
        </View>

        {/* VERIFIED FARMER CARD */}
        <View className="mx-6 mt-6 flex-row items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-lg shadow-black/5">
          <View className="w-12 h-12 rounded-full bg-emerald-700 items-center justify-center">
            <Text className="text-lg">✓</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">Verified Farmer</Text>
            <Text className="text-base font-semibold text-gray-900">
              Green Valley Estates
            </Text>
          </View>
        </View>

        {/* DIVIDER */}
        <View className="mx-6 mt-6 h-1 bg-gray-200 rounded-full" />

        {/* MAIN HEADLINE */}
        <View className="mx-6 mt-8">
          <Text className="text-4xl font-bold text-gray-900">
            Direct from <Text className="text-emerald-700">Farm</Text>
          </Text>
        </View>

        {/* DESCRIPTION */}
        <Text className="mx-6 mt-4 text-center text-base text-gray-600 leading-6">
          Experience a revolutionary marketplace where AI connects you directly
          with local growers for the freshest seasonal produce.
        </Text>

        {/* FEATURE CARDS */}
        <View className="mx-6 mt-8 flex-row gap-3">
          <View className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <Text className="text-3xl mb-2">🌿</Text>
            <Text className="text-sm font-bold text-gray-900">
              100% Organic
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Certified eco-friendly
            </Text>
          </View>

          <View className="flex-1 bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <Text className="text-3xl mb-2">⏱️</Text>
            <Text className="text-sm font-bold text-gray-900">
              Farm to Door
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Delivery in 24 hours
            </Text>
          </View>
        </View>

        {/* DOTS INDICATOR */}
        <View className="flex-row justify-center gap-2 mt-10">
          <View className="w-2 h-2 rounded-full bg-emerald-700" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
        </View>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          onPress={handleNext}
          className="mx-6 mt-8 bg-emerald-700 rounded-2xl py-4 mb-8 shadow-lg shadow-emerald-700/20"
        >
          <Text className="text-center text-white font-bold text-base">
            Next →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
