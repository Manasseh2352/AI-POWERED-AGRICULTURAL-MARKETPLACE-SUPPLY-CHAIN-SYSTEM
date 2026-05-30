import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 3 seconds, then show main content
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View className="flex-1 bg-[#f6faf4] items-center justify-center px-6">
        <View className="items-center mt-24">
          <View className="rounded-3xl bg-white p-4 shadow-lg shadow-black/5">
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 72, height: 72 }}
              contentFit="contain"
            />
          </View>

          <Text className="text-3xl font-extrabold text-emerald-800 mt-6">
            HarvestAI
          </Text>

          <Text className="text-center text-gray-500 mt-2 max-w-[80%]">
            Cultivating the future of agricultural commerce.
          </Text>

          <View className="mt-8 w-40 h-1 bg-emerald-800 rounded-full" />
        </View>

        <View className="absolute bottom-12 items-center flex-row items-center gap-2">
          <MaterialCommunityIcons name="robot" size={16} color="#9ca3af" />
          <Text className="text-gray-400">POWERED BY AI</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Image
        source={require("@/assets/images/Home.jpeg")}
        className="absolute w-full h-full"
        contentFit="cover"
        blurRadius={1}
      />

      <View className="flex-1 justify-end mb-20 items-left p-2">
        <Text className="text-3xl font-bold text-white w-80">
          Connect Directly with the Source.
        </Text>

        <Text className="text-lg text-gray-300 mt-5 w-90">
          Empowering farmers and buyers with AI driven insight for a transparent
          supply chain.
        </Text>

        {/* GET STARTED → ONBOARDING */}
        <TouchableOpacity
          onPress={() => router.push("/(public)/onboarding/slide1")}
          className="bg-[#2E7D32] px-6 py-5 w-full rounded-lg mt-5"
        >
          <Text className="text-white font-bold text-xl text-center">
            Get started
          </Text>
        </TouchableOpacity>

        {/* LOGIN */}
        <TouchableOpacity
          onPress={() => router.push("/(public)/auth/login")}
          className="bg-gray-500 px-6 py-5 w-full rounded-lg mt-4"
        >
          <Text className="text-white font-bold text-xl text-center">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
