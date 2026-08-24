import { AuthService } from "@/services/auth.service";
import {
  ProfileService,
  type FarmerDashboard,
  type FarmerProfile,
} from "@/services/profile.service";
import { useAuthStore } from "@/store/authStore";
import { useMoney } from "@/lib/useMoney";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { format } = useMoney();

  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [dashboard, setDashboard] = useState<FarmerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([
      ProfileService.getFarmerProfile(),
      ProfileService.getFarmerDashboard(),
    ])
      .then(([p, d]) => {
        if (!alive) return;
        setProfile(p);
        setDashboard(d);
      })
      .catch(() => {
        if (!alive) return;
        setProfile(null);
        setDashboard(null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const displayName = profile?.farmName || user?.fullName || "Farmer";

  const StatValue = ({
    value,
    color = "#111827",
    className = "text-2xl font-bold text-gray-900 mt-1",
  }: {
    value: ReactNode;
    color?: string;
    className?: string;
  }) =>
    loading ? (
      <ActivityIndicator className="mt-1 self-start" color={color} />
    ) : (
      <Text className={className}>{value}</Text>
    );

  const QuickActionCard = ({
    title,
    desc,
    icon,
    isHighlight,
    onPress,
  }: {
    title: string;
    desc: string;
    icon: ReactNode;
    isHighlight?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-2xl p-4 mb-3 flex-row items-center ${
        isHighlight ? "bg-emerald-700" : "bg-gray-100"
      }`}
    >
      <View className="mr-4">{icon}</View>
      <View>
        <Text
          className={`font-bold ${isHighlight ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </Text>
        <Text
          className={`text-xs ${isHighlight ? "text-emerald-100" : "text-gray-500"}`}
        >
          {desc}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-4 bg-white">
          <TouchableOpacity>
            <MaterialCommunityIcons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-emerald-700">AgroTrade</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.push("/(farmer)/notifications")}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="#111827"
              />
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
              <TouchableOpacity onPress={() => router.push("/(farmer)/profile")}>
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={24}
                  color="#374151"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* GREETING SECTION */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900">
            {greeting}, {displayName}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Here's what's happening with your farm today.
          </Text>
        </View>

        {/* STATS CARDS */}
        <View className="px-6 flex-row gap-3 mb-6">
          {/* Live Listings */}
          <View className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-xs text-gray-500">Live Listings</Text>
                <StatValue value={dashboard?.totalProducts ?? 0} color="#047857" />
              </View>
              <MaterialCommunityIcons
                name="clipboard-text"
                size={28}
                color="#047857"
              />
            </View>
          </View>

          {/* Total Sales */}
          <View className="flex-1 bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Total Sales</Text>
                <StatValue
                  value={format(dashboard?.totalRevenue)}
                  color="#b45309"
                  className="text-xl font-bold text-gray-900 mt-1"
                />
              </View>
              <MaterialCommunityIcons name="cash" size={28} color="#b45309" />
            </View>
          </View>
        </View>

        {/* SECOND ROW STATS */}
        <View className="px-6 flex-row gap-3 mb-8">
          {/* Total Orders */}
          <View className="flex-1 bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-xs text-gray-500">Total Orders</Text>
                <StatValue value={dashboard?.totalOrders ?? 0} color="#1d4ed8" />
              </View>
              <MaterialCommunityIcons
                name="clipboard-list"
                size={28}
                color="#1d4ed8"
              />
            </View>
          </View>

          {/* Active Shipments */}
          <View className="flex-1 bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-xs text-gray-500">Active Shipments</Text>
                <StatValue value={dashboard?.activeShipments ?? 0} color="#c2410c" />
              </View>
              <MaterialCommunityIcons name="truck" size={28} color="#c2410c" />
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View className="px-6 mb-8">
          <Text className="text-xs font-bold text-gray-600 mb-4 tracking-wider">
            QUICK ACTIONS
          </Text>
          <QuickActionCard
            title="Upload Produce"
            desc="Add new items to marketplace"
            onPress={() => router.push("/(farmer)/upload")}
            icon={
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={24}
                color="#fff"
              />
            }
            isHighlight
          />
          <QuickActionCard
            title="View Orders"
            desc="Manage your current sales"
            onPress={() => router.push("/(farmer)/orders")}
            icon={
              <MaterialCommunityIcons
                name="clipboard-list"
                size={24}
                color="#047857"
              />
            }
          />
          <QuickActionCard
            title="Market Insights"
            desc="AI-driven price forecasts"
            onPress={() => router.push("/(ai)/insight")}
            icon={
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#047857"
              />
            }
          />
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
