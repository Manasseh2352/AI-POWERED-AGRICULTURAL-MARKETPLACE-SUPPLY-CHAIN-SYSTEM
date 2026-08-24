import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, Text, View } from "react-native";

export default function Notifications() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4 flex-1">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-extrabold text-gray-900">
                Notifications
              </Text>
              <Text className="mt-1 text-xs font-bold text-gray-500">
                Farmer updates & alerts
              </Text>
            </View>

            <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color="#059669"
              />
            </View>
          </View>

          {/* EMPTY STATE */}
          <View className="flex-1 items-center justify-center py-24">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <MaterialCommunityIcons
                name="bell-outline"
                size={32}
                color="#9ca3af"
              />
            </View>
            <Text className="mt-5 text-base font-extrabold text-gray-900">
              No notifications yet
            </Text>
            <Text className="mt-2 text-center text-xs font-bold text-gray-500">
              You're all caught up. Order and payout{"\n"}updates will appear
              here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
