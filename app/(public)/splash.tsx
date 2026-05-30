import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export default function SplashScreen() {
  return (
    <View className="flex-1 bg-[#f6faf4] items-center justify-center px-6">
      <View className="items-center mt-24">
        <View className="rounded-3xl bg-white p-4 shadow-lg shadow-black/5">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 72, height: 72 }}
            contentFit="contain"
            className=""
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
