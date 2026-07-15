import Loading from "@/components/ui/Loading";
import { useAuthStore } from "@/store/authStore";
import { useLoadingStore } from "@/store/loadingStore";
import { Image } from "expo-image";
import { Stack, useRouter, useSegments } from "expo-router";
import { cssInterop } from "nativewind";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

cssInterop(Image, { className: "style" });

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [appReady, setAppReady] = useState(false);
  const loading = useLoadingStore((s) => s.loading);
  const { user, token } = useAuthStore();

  useEffect(() => {
    // App is ready once zustand store is initialized
    setAppReady(true);
  }, []);

  useEffect(() => {
    if (!appReady || segments.length === 0) return;

    const inPublic = segments[0] === "(public)";
    const inBuyer = segments[0] === "(buyer)";
    const inFarmer = segments[0] === "(farmer)";
    const inAI = segments[0] === "(ai)";
    const inShared = segments[0] === "(shared)";

    // Not logged in → force public flow
    if (!token) {
      if (!inPublic && !inAI && !inShared) {
        router.replace("/(public)/splash");
      }
      return;
    }

    // Logged in → route by role
    if (user?.role === "buyer" && !inBuyer && !inShared && !inAI) {
      router.replace("/(buyer)/home");
    }

    if (user?.role === "farmer" && !inFarmer && !inShared && !inAI) {
      router.replace("/(farmer)/dashboard");
    }
  }, [appReady, user, token, segments]);

  if (!appReady) {
    return <Loading message="Starting..." />; // Prevents blank white screen
  }

  return (
    <SafeAreaProvider>
      {loading ? (
        <Loading message="Please wait..." />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </SafeAreaProvider>
  );
}
