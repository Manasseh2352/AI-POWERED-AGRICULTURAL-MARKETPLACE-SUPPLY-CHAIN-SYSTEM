import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToastStore, type ToastType } from "@/store/toastStore";

// Static class strings per type (Tailwind needs the full literals to include
// them in the bundle).
const STYLES: Record<
  ToastType,
  {
    container: string;
    icon: string;
    iconColor: string;
    title: string;
    body: string;
    action: string;
    actionLabel: string;
  }
> = {
  success: {
    container: "bg-emerald-900",
    icon: "check-circle",
    iconColor: "#6ee7b7",
    title: "text-white",
    body: "text-emerald-100",
    action: "bg-white/20",
    actionLabel: "text-white",
  },
  error: {
    container: "bg-rose-600",
    icon: "alert-circle",
    iconColor: "#ffe4e6",
    title: "text-white",
    body: "text-rose-100",
    action: "bg-white/20",
    actionLabel: "text-white",
  },
  info: {
    container: "bg-slate-800",
    icon: "information",
    iconColor: "#e2e8f0",
    title: "text-white",
    body: "text-slate-300",
    action: "bg-white/15",
    actionLabel: "text-white",
  },
  warn: {
    // Amber for two-step destructive confirmations — visually distinct so it
    // reads as "this needs a second press", not as an error.
    container: "bg-amber-500",
    icon: "alert",
    iconColor: "#451a03",
    title: "text-amber-950",
    body: "text-amber-950/80",
    action: "bg-amber-950/15",
    actionLabel: "text-amber-950",
  },
};

export default function Toast() {
  const insets = useSafeAreaInsets();
  const { visible, type, title, message, actions, hide } = useToastStore();

  // Held in useState (not useRef) so nothing ref-like is read during render,
  // and created lazily so the Animated.Value identity survives re-renders.
  // Note: react-native-web does not export useAnimatedValue, so this must not
  // rely on it.
  const [translateY] = useState(() => new Animated.Value(-140));
  const [opacity] = useState(() => new Animated.Value(0));

  // The native driver only exists on native; on web Animated falls back to JS
  // (and warns) unless this is false.
  const nativeDriver = Platform.OS !== "web";

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: nativeDriver,
          friction: 8,
          tension: 64,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: nativeDriver,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -140,
          duration: 220,
          useNativeDriver: nativeDriver,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: nativeDriver,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity, nativeDriver]);

  const styles = STYLES[type];

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        opacity,
        transform: [{ translateY }],
        pointerEvents: "box-none",
      }}
    >
      <View style={{ paddingTop: insets.top + 8, pointerEvents: "box-none" }}>
        <Pressable
          onPress={hide}
          accessibilityRole="alert"
          className={`mx-4 flex-row items-start gap-3 rounded-2xl px-4 py-4 shadow-lg shadow-black/20 ${styles.container}`}
        >
          <MaterialCommunityIcons
            name={styles.icon as any}
            size={20}
            color={styles.iconColor}
            style={{ marginTop: 1 }}
          />
          <View className="flex-1">
            <Text className={`text-sm font-bold ${styles.title}`}>{title}</Text>
            {message ? (
              <Text className={`mt-0.5 text-xs leading-5 ${styles.body}`}>{message}</Text>
            ) : null}
            {actions?.length ? (
              <View className="mt-3 flex-row flex-wrap gap-2">
                {actions.map((a) => (
                  <Pressable
                    key={a.label}
                    onPress={a.onPress}
                    hitSlop={6}
                    className={`rounded-full px-3 py-1.5 ${styles.action}`}
                  >
                    <Text className={`text-xs font-bold ${styles.actionLabel}`}>
                      {a.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}
