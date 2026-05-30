import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Slide3() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("/(public)/choose-role");
  };

  const handleSkip = () => {
    router.replace("/(public)/choose-role");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView
        className="flex-1 bg-gray-900"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-4 z-10">
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl">🌾</Text>
            <Text className="text-2xl font-bold text-white">HarvestAI</Text>
          </View>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-gray-300 font-semibold">SKIP</Text>
          </TouchableOpacity>
        </View>

        {/* BACKGROUND IMAGE */}
        <View className="mt-4 h-80 overflow-hidden rounded-2xl mx-6 relative">
          <Image
            source={require("@/assets/images/Home.jpeg")}
            className="w-full h-full"
            contentFit="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          {/* LOCK ICON - TOP RIGHT */}
          <View className="absolute top-6 right-6 w-16 h-16 rounded-3xl bg-gray-600/40 items-center justify-center border border-gray-400/20">
            <Text className="text-3xl">🔒</Text>
          </View>
        </View>

        {/* FEATURE CARDS CONTAINER */}
        <View className="mx-6 mt-8 space-y-4">
          {/* REAL-TIME FLEET TRACKING */}
          <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex-row items-center gap-4 border border-white/10">
            <View className="w-12 h-12 rounded-2xl bg-emerald-700 items-center justify-center">
              <Text className="text-2xl">🚚</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Real-Time Fleet Tracking
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                Monitor your harvest from soil to silo with AI-optimized
                routing.
              </Text>
            </View>
          </View>

          {/* ESCROW-BACKED PAYMENTS */}
          <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex-row items-center gap-4 border border-white/10">
            <View className="w-12 h-12 rounded-2xl bg-yellow-500 items-center justify-center">
              <Text className="text-2xl">🛡️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Escrow-Backed Payments
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                Smart contracts ensure funds are only released upon verified
                delivery.
              </Text>
            </View>
          </View>
        </View>

        {/* MAIN HEADLINE */}
        <View className="mx-6 mt-10">
          <Text className="text-4xl font-bold text-white">
            Secure Logistics & <Text className="text-emerald-400">Safe</Text>
          </Text>
          <Text className="text-4xl font-bold text-emerald-400">Payments.</Text>
        </View>

        {/* DESCRIPTION */}
        <Text className="mx-6 mt-4 text-base text-gray-300 leading-6">
          Connect directly with verified logistics partners. Your transactions
          are protected by HarvestAI's autonomous escrow system.
        </Text>

        {/* DOTS INDICATOR */}
        <View className="flex-row justify-center gap-2 mt-10">
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-2 h-2 rounded-full bg-gray-600" />
          <View className="w-3 h-3 rounded-full bg-emerald-400" />
        </View>

        {/* GET STARTED BUTTON */}
        <TouchableOpacity
          onPress={handleGetStarted}
          className="mx-6 mt-10 bg-emerald-700 rounded-2xl py-4 shadow-lg shadow-emerald-700/30"
        >
          <Text className="text-center text-white font-bold text-base">
            Get Started →
          </Text>
        </TouchableOpacity>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
