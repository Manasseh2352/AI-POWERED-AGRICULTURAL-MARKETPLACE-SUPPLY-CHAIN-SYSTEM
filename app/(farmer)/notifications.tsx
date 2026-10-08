import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  formatNotificationTime,
  isUnread,
  notificationVisual,
} from "@/lib/notification";
import {
  NotificationService,
  type AppNotification,
} from "@/services/notification.service";

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const load = async () => {
    try {
      const res = await NotificationService.list("farmer", { limit: 50 });
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  // Optimistically flip a single notification to read, then persist.
  const handleTap = async (n: AppNotification) => {
    if (isUnread(n)) {
      setNotifications((prev) =>
        prev.map((x) =>
          x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      NotificationService.markRead("farmer", n.id).catch((err) => {
        console.warn("markRead failed", err);
      });
    }
    if (n.orderId) {
      router.push(`/(farmer)/orders`);
    }
  };

  const handleMarkAll = async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((x) => (x.readAt ? x : { ...x, readAt: now }))
    );
    setUnreadCount(0);
    try {
      await NotificationService.markAllRead("farmer");
    } catch (err) {
      console.warn("markAllRead failed", err);
      load();
    } finally {
      setMarkingAll(false);
    }
  };

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#059669"
          />
        }
      >
        <View className="mt-4 flex-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-extrabold text-gray-900">
                Notifications
              </Text>
              <Text className="mt-1 text-xs font-bold text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                  : "Farmer updates & alerts"}
              </Text>
            </View>

            {unreadCount > 0 ? (
              <TouchableOpacity
                onPress={handleMarkAll}
                disabled={markingAll}
                className="rounded-full bg-emerald-100 px-4 py-2"
              >
                <Text className="text-xs font-extrabold text-emerald-700">
                  {markingAll ? "..." : "Mark all read"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={20}
                  color="#059669"
                />
              </View>
            )}
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center py-24">
              <ActivityIndicator size="large" color="#059669" />
            </View>
          ) : notifications.length === 0 ? (
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
                You&apos;re all caught up. Order and payout{"\n"}updates will appear
                here.
              </Text>
            </View>
          ) : (
            <View className="mt-5 gap-2.5">
              {notifications.map((n) => {
                const visual = notificationVisual(n.type);
                const unread = isUnread(n);
                return (
                  <TouchableOpacity
                    key={n.id}
                    activeOpacity={0.7}
                    onPress={() => handleTap(n)}
                    className={`flex-row items-start rounded-2xl border p-3.5 ${
                      unread
                        ? "border-emerald-100 bg-emerald-50/40"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <View
                      className="h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: visual.bg }}
                    >
                      <MaterialCommunityIcons
                        name={visual.icon}
                        size={18}
                        color={visual.color}
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`flex-1 text-sm ${
                            unread
                              ? "font-extrabold text-gray-900"
                              : "font-bold text-gray-600"
                          }`}
                        >
                          {n.title}
                        </Text>
                        <Text className="ml-2 text-[11px] font-bold text-gray-400">
                          {formatNotificationTime(n.createdAt)}
                        </Text>
                      </View>
                      {!!n.body && (
                        <Text className="mt-1 text-xs font-medium text-gray-500">
                          {n.body}
                        </Text>
                      )}
                    </View>
                    {unread && (
                      <View className="ml-2 mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
