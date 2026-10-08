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
import { SafeAreaView } from "react-native-safe-area-context";

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
      const res = await NotificationService.list("buyer", { limit: 50 });
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
      NotificationService.markRead("buyer", n.id).catch((err) => {
        console.warn("markRead failed", err);
      });
    }
    if (n.orderId) {
      router.push(`/(buyer)/orders/current`);
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
      await NotificationService.markAllRead("buyer");
    } catch (err) {
      console.warn("markAllRead failed", err);
      load();
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#047857"
          />
        }
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
                name={unreadCount > 0 ? "bell-badge" : "bell-outline"}
                size={20}
                color="#14532d"
              />
            </View>
          </View>

          <View className="mt-8 flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-4xl font-bold text-slate-900">
                Notifications
              </Text>
              <Text className="mt-2 text-sm text-slate-500">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread update${unreadCount === 1 ? "" : "s"}.`
                  : "Stay updated with your orders and insights."}
              </Text>
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAll}
                disabled={markingAll}
                className="ml-3 rounded-full bg-emerald-100 px-4 py-2"
              >
                <Text className="text-xs font-bold text-emerald-800">
                  {markingAll ? "..." : "Mark all read"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center py-24">
              <ActivityIndicator size="large" color="#047857" />
            </View>
          ) : notifications.length === 0 ? (
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
                You&apos;re all caught up. Updates about your orders{"\n"}and the
                marketplace will show up here.
              </Text>
            </View>
          ) : (
            <View className="mt-6 gap-3">
              {notifications.map((n) => {
                const visual = notificationVisual(n.type);
                const unread = isUnread(n);
                return (
                  <TouchableOpacity
                    key={n.id}
                    activeOpacity={0.7}
                    onPress={() => handleTap(n)}
                    className={`flex-row items-start rounded-[24px] p-4 shadow-sm shadow-black/5 ${
                      unread ? "bg-white" : "bg-white/60"
                    }`}
                  >
                    <View
                      className="h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: visual.bg }}
                    >
                      <MaterialCommunityIcons
                        name={visual.icon}
                        size={20}
                        color={visual.color}
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`flex-1 text-sm ${
                            unread
                              ? "font-bold text-slate-900"
                              : "font-semibold text-slate-600"
                          }`}
                        >
                          {n.title}
                        </Text>
                        <Text className="ml-2 text-xs text-slate-400">
                          {formatNotificationTime(n.createdAt)}
                        </Text>
                      </View>
                      {!!n.body && (
                        <Text className="mt-1 text-xs text-slate-500">
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
    </SafeAreaView>
  );
}
