import Loading from "@/components/ui/Loading";
import { useAuthStore } from "@/store/authStore";
import { useLoadingStore } from "@/store/loadingStore";
import { Image } from "expo-image";
import { Stack, useRouter, useSegments } from "expo-router";
import { cssInterop } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

cssInterop(Image, { className: "style" });

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const loading = useLoadingStore((s) => s.loading);
  const { user, token, hydrated, hydrate } = useAuthStore();

  useEffect(() => {
    // Restore token + user from secure storage before we decide where to route.
    hydrate();
  }, [hydrate]);

  // App is ready once auth has been restored from storage.
  const appReady = hydrated;

  useEffect(() => {
    if (!appReady || (segments as string[]).length === 0) return;

    const inPublic = segments[0] === "(public)";
    const inBuyer = segments[0] === "(buyer)";
    const inFarmer = segments[0] === "(farmer)";
    const inAI = segments[0] === "(ai)";
    const inShared = segments[0] === "(shared)";

    // Not logged in → force public flow
    if (!token) {
      if (!inPublic && !inAI && !inShared) {
        router.replace("/");
      }
      return;
    }

    // Logged in → keep the user inside their own stack, but NEVER yank them out
    // of the public funnel (onboarding/auth). Cold launch lands on "/" (exempt),
    // and login/OTP navigate explicitly — so a token-holder can still walk through
    // "Get Started" or sign in as a different account instead of being bounced home.
    if (user?.role === "buyer" && !inBuyer && !inShared && !inAI && !inPublic) {
      router.replace("/(buyer)/home");
    }

    if (user?.role === "farmer" && !inFarmer && !inShared && !inAI && !inPublic) {
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
