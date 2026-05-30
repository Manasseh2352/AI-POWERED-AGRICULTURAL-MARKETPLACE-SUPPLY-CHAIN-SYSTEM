import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Slot, useRouter, useSegments } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FarmerIconName = React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

type FarmerNavItem = {
  path:
    | "/(farmer)/dashboard"
    | "/(farmer)/inventory"
    | "/(farmer)/earnings"
    | "/(farmer)/orders";
  label: string;
  icon: FarmerIconName;
  match: string;
};

export default function FarmerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments.slice(1).join("/");

  const NavItem = ({ item }: { item: FarmerNavItem }) => {
    const isActive =
      currentRoute === item.match || currentRoute.endsWith(item.match);
    return (
      <TouchableOpacity
        onPress={() => router.push(item.path)}
        className={`flex-1 items-center justify-center py-3 ${
          isActive ? "bg-emerald-700 rounded-t-3xl" : ""
        }`}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={isActive ? "white" : "#4b5563"}
          style={{ marginBottom: 4 }}
        />
        <Text
          className={`text-xs font-bold ${
            isActive ? "text-white" : "text-gray-600"
          }`}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <Slot />
      </View>

      {/* BOTTOM NAVIGATION */}
      <View className="flex-row border-t border-gray-200 bg-white">
        {(
          [
            {
              path: "/(farmer)/dashboard",
              label: "Dashboard",
              icon: "view-dashboard" as const,
              match: "dashboard",
            },
            {
              path: "/(farmer)/inventory",
              label: "Inventory",
              icon: "package-variant" as const,
              match: "inventory",
            },
            {
              path: "/(farmer)/earnings",
              label: "Sales",
              icon: "trending-up" as const,
              match: "earnings",
            },
            {
              path: "/(farmer)/orders",
              label: "Orders",
              icon: "receipt" as const,
              match: "orders",
            },
          ] as FarmerNavItem[]
        ).map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </View>
    </SafeAreaView>
  );
}
