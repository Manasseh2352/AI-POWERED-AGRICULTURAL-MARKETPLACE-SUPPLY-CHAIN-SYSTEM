import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SETTINGS = [
  { label: "Account Settings", icon: "account-cog" as const },
  { label: "Saved Farms", icon: "sprout" as const },
  { label: "Saved Addresses", icon: "map-marker" as const },
  { label: "Notification Preferences", icon: "bell-outline" as const },
];

export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#eef6ee]">
      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="flex-row items-center justify-between pt-4">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 rounded-2xl bg-emerald-700 items-center justify-center">
              <MaterialCommunityIcons name="tractor" size={20} color="#fff" />
            </View>
            <Text className="text-xl font-bold text-emerald-900">
              HarvestAI
            </Text>
          </View>

          <TouchableOpacity 
          onPress={() => router.push("/(buyer)/notifications")}
          className="rounded-full bg-white p-3 shadow-sm shadow-black/5">
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color="#065f46"
            />
          </TouchableOpacity>
        </View>

        <View className="items-center mt-8">
          <View className="relative">
            <View className="h-40 w-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden items-center justify-center">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 h-12 w-12 items-center justify-center rounded-full bg-emerald-700 shadow-lg shadow-emerald-700/25">
              <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text className="mt-5 text-3xl font-bold text-slate-900">
            Julian Thorne
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="#6b7280"
            />
            <Text className="text-sm text-gray-500">Portland, Oregon</Text>
          </View>

          <View className="mt-4 rounded-full bg-emerald-100 px-5 py-2">
            <Text className="text-sm font-semibold text-emerald-700">
              Premium Buyer
            </Text>
          </View>
        </View>

        <View className="mt-8 flex-row gap-3">
          <View className="flex-1 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="h-12 w-12 rounded-2xl bg-emerald-50 items-center justify-center">
              <MaterialCommunityIcons name="leaf" size={20} color="#047857" />
            </View>
            <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Impact
            </Text>
            <Text className="mt-3 text-3xl font-bold text-slate-900">
              124kg
            </Text>
            <Text className="mt-1 text-sm text-gray-500">CO2 Saved</Text>
          </View>

          <View className="flex-1 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="h-12 w-12 rounded-2xl bg-rose-50 items-center justify-center">
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color="#9d174d"
              />
            </View>
            <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Orders
            </Text>
            <Text className="mt-3 text-3xl font-bold text-slate-900">42</Text>
            <Text className="mt-1 text-sm text-gray-500">This Year</Text>
          </View>
        </View>

        <Text className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          Account Settings
        </Text>

        <View className="mt-4 space-y-3">
          {SETTINGS.map((item) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              className="flex-row items-center gap-4 rounded-[28px] bg-white px-4 py-4 shadow-sm shadow-black/5"
            >
              <View className="h-12 w-12 rounded-2xl bg-emerald-50 items-center justify-center">
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color="#047857"
                />
              </View>
              <Text className="flex-1 text-base font-semibold text-slate-900">
                {item.label}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#9ca3af"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(public)/auth/login")}
          className="mt-6 flex-row items-center justify-center gap-2 rounded-[28px] border border-red-200 bg-white px-5 py-4 shadow-sm shadow-black/5"
        >
          <MaterialCommunityIcons name="logout" size={20} color="#b91c1c" />
          <Text className="text-sm font-semibold text-red-600">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
