import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 px-5 pb-8">
          <View className="flex-row items-center justify-between pt-4">
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

            <Text className="text-2xl font-bold text-emerald-900">
              HarvestAI
            </Text>

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color="#14532d"
              />
            </View>
          </View>

          <Text className="mt-8 text-4xl font-bold text-slate-900">
            Notifications
          </Text>
          <Text className="mt-2 text-sm text-slate-500">
            Stay updated with your orders and insights.
          </Text>

          {/* EMPTY STATE */}
          <View className="flex-1 items-center justify-center py-24">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="bell-outline"
                size={32}
                color="#9ca3af"
              />
            </View>
            <Text className="mt-5 text-lg font-bold text-slate-900">
              No notifications yet
            </Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
              You're all caught up. Updates about your orders{"\n"}and the
              marketplace will show up here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
