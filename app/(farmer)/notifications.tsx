import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timeLabel: string;
  unread: boolean;
  icon: "leaf" | "truck" | "account" | "bell";
};

function Icon({ name }: { name: NotificationItem["icon"] }) {
  // Keep MaterialCommunityIcons names as a safe union of known icon strings.
  const iconMap = {
    leaf: "leaf" as const,
    truck: "truck-outline" as const,
    account: "account-outline" as const,
    bell: "bell-outline" as const,
  };

  return (
    <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
      <MaterialCommunityIcons name={iconMap[name]} size={18} color="#fff" />
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={
        active
          ? "rounded-full bg-emerald-700 px-4 py-2"
          : "rounded-full bg-gray-100 px-4 py-2"
      }
    >
      <Text
        className={
          active
            ? "text-xs font-extrabold text-white"
            : "text-xs font-extrabold text-gray-700"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications: NotificationItem[] = useMemo(
    () => [
      {
        id: "n1",
        title: "New order",
        message: "Order #1027 placed for crop deliverables.",
        timeLabel: "2h ago",
        unread: true,
        icon: "truck",
      },
      {
        id: "n2",
        title: "Earnings updated",
        message: "Your weekly earnings have been credited.",
        timeLabel: "Yesterday",
        unread: true,
        icon: "account",
      },
      {
        id: "n3",
        title: "Inventory reminder",
        message: "Your stock for tomatoes is running low.",
        timeLabel: "3d ago",
        unread: false,
        icon: "leaf",
      },
      {
        id: "n4",
        title: "System notice",
        message: "New payout schedule is now available.",
        timeLabel: "1w ago",
        unread: false,
        icon: "bell",
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => n.unread);
    return notifications;
  }, [filter, notifications]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-extrabold text-gray-900">
                Notifications
              </Text>
              <Text className="mt-1 text-xs font-bold text-gray-500">
                Farmer updates & alerts
              </Text>
            </View>

            <View className="relative h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <MaterialCommunityIcons
                name="bell-outline"
                size={20}
                color="#059669"
              />
              {notifications.some((n) => n.unread) ? (
                <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-600" />
              ) : null}
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <Chip
            label="All"
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <Chip
            label="Unread"
            active={filter === "unread"}
            onPress={() => setFilter("unread")}
          />
        </View>

        <View className="mt-5">
          {filtered.length === 0 ? (
            <View className="mt-10 items-center">
              <Text className="text-sm font-bold text-gray-700">
                No notifications
              </Text>
              <Text className="mt-2 text-xs font-bold text-gray-500 text-center">
                You’re all caught up.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    // Placeholder for read-state / navigation.
                  }}
                >
                  <View
                    className={
                      item.unread
                        ? "mb-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3"
                        : "mb-3 rounded-2xl border border-gray-100 bg-white p-3"
                    }
                  >
                    <View className="flex-row items-start gap-3">
                      <Icon name={item.icon} />

                      <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text className="flex-1 text-sm font-extrabold text-gray-900">
                            {item.title}
                          </Text>
                          <Text className="ml-3 text-[11px] font-extrabold text-gray-500">
                            {item.timeLabel}
                          </Text>
                        </View>

                        <Text className="mt-1 text-xs font-bold text-gray-700">
                          {item.message}
                        </Text>

                        <View className="mt-2 flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2">
                            {item.unread ? (
                              <View className="h-2 w-2 rounded-full bg-emerald-600" />
                            ) : null}
                            <Text className="text-[11px] font-extrabold text-gray-500">
                              {item.unread ? "Unread" : "Read"}
                            </Text>
                          </View>

                          {item.unread ? (
                            <View className="rounded-full bg-emerald-600 px-3 py-1">
                              <Text className="text-[11px] font-extrabold text-white">
                                New
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
