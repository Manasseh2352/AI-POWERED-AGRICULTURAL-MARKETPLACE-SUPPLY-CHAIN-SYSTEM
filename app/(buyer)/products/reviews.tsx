import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Reviews() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f2f6ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      >
        <View className="flex-1 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900">HarvestAI</Text>
            <View className="h-11 w-11" />
          </View>

          <Text className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Product Feedback
          </Text>
          <Text className="mt-3 text-3xl font-bold text-slate-900">Reviews</Text>

          {/* EMPTY STATE */}
          <View className="flex-1 items-center justify-center py-24">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="star-outline"
                size={32}
                color="#9ca3af"
              />
            </View>
            <Text className="mt-5 text-lg font-bold text-slate-900">
              No reviews yet
            </Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
              This product hasn't received any reviews.{"\n"}Check back later.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
