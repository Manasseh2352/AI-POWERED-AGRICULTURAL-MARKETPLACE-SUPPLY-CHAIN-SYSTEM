import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Slot, useRouter, useSegments } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BuyerIconName = React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

type BuyerNavItem = {
  path:
    | "/(buyer)/home"
    | "/(buyer)/marketplace"
    | "/(buyer)/cart"
    | "/(buyer)/orders/current"
    | "/(buyer)/profile";
  label: string;
  icon: BuyerIconName;
  match: string;
};

export default function BuyerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments.slice(1).join("/");

  const NavItem = ({ item }: { item: BuyerNavItem }) => {
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
              path: "/(buyer)/home",
              label: "Home",
              icon: "home" as const,
              match: "home",
            },
            {
              path: "/(buyer)/marketplace",
              label: "Marketplace",
              icon: "store" as const,
              match: "marketplace",
            },
            {
              path: "/(buyer)/cart",
              label: "Cart",
              icon: "cart" as const,
              match: "cart",
            },
            {
              path: "/(buyer)/orders/current",
              label: "Orders",
              icon: "receipt" as const,
              match: "orders/current",
            },
            {
              path: "/(buyer)/profile",
              label: "Profile",
              icon: "account" as const,
              match: "profile",
            },
          ] as BuyerNavItem[]
        ).map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </View>
    </SafeAreaView>
  );
}
