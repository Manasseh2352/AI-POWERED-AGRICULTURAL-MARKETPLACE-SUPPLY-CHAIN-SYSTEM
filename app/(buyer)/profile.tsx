import { useRoleStore } from "@/store/roleStore";
import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/services/auth.service";
import {
  ProfileService,
  formatMoney,
  type BuyerDashboard,
} from "@/services/profile.service";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SETTINGS = [
  { label: "Account Settings", icon: "account-cog" as const },
  { label: "Saved Farms", icon: "sprout" as const },
  { label: "Saved Addresses", icon: "map-marker" as const },
  { label: "Notification Preferences", icon: "bell-outline" as const },
];

export default function Profile() {
  const router = useRouter();
  const setRole = useRoleStore((s) => s.setRole);
  const user = useAuthStore((s) => s.user);

  const [dashboard, setDashboard] = useState<BuyerDashboard | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let alive = true;
    ProfileService.getBuyerDashboard()
      .then((d) => alive && setDashboard(d))
      .catch(() => alive && setDashboard(null))
      .finally(() => alive && setLoadingStats(false));
    return () => {
      alive = false;
    };
  }, []);

  const switchToFarmer = () => {
    setRole("farmer");
    router.replace("/(farmer)/dashboard");
  };

  const handleLogout = () => {
    // Clear the persisted token + user, then return to the landing ("/"), which
    // has the Login / Get Started actions. (The root layout also redirects on a
    // cleared token; navigating here avoids a flash of the buyer UI.)
    AuthService.logout();
    router.replace("/");
  };

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
            className="rounded-full bg-white p-3 shadow-sm shadow-black/5"
          >
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
            {user?.fullName || "Your Account"}
          </Text>
          {user?.email ? (
            <View className="mt-2 flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="email-outline"
                size={16}
                color="#6b7280"
              />
              <Text className="text-sm text-gray-500">{user.email}</Text>
            </View>
          ) : null}
        </View>

        <View className="mt-8 flex-row gap-3">
          <View className="flex-1 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="h-12 w-12 rounded-2xl bg-emerald-50 items-center justify-center">
              <MaterialCommunityIcons name="package-variant" size={20} color="#047857" />
            </View>
            <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Orders
            </Text>
            {loadingStats ? (
              <ActivityIndicator className="mt-3 self-start" color="#047857" />
            ) : (
              <Text className="mt-3 text-3xl font-bold text-slate-900">
                {dashboard?.totalOrders ?? 0}
              </Text>
            )}
            <Text className="mt-1 text-sm text-gray-500">Total orders</Text>
          </View>

          <View className="flex-1 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="h-12 w-12 rounded-2xl bg-rose-50 items-center justify-center">
              <MaterialCommunityIcons
                name="cash-multiple"
                size={20}
                color="#9d174d"
              />
            </View>
            <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Spent
            </Text>
            {loadingStats ? (
              <ActivityIndicator className="mt-3 self-start" color="#9d174d" />
            ) : (
              <Text className="mt-3 text-3xl font-bold text-slate-900">
                {formatMoney(dashboard?.totalSpent)}
              </Text>
            )}
            <Text className="mt-1 text-sm text-gray-500">All time</Text>
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
          onPress={switchToFarmer}
          className="mt-6 rounded-[28px] bg-emerald-700 px-5 py-4 shadow-sm shadow-emerald-700/10"
        >
          <Text className="text-sm font-semibold text-white text-center">
            Switch to Farmer Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-[28px] border border-red-200 bg-white px-5 py-4 shadow-sm shadow-black/5"
        >
          <MaterialCommunityIcons name="logout" size={20} color="#b91c1c" />
          <Text className="text-sm font-semibold text-red-600">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
