import Loading from "@/components/ui/Loading";
import { useLoadingStore } from "@/store/loadingStore";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { cssInterop } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
// import { getToken } from "@/lib/storage";
// import { useRoleStore } from "@/store/roleStore";

cssInterop(Image, { className: "style" });

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //   const router = useRouter();
  //   const segments = useSegments();

  // const [appReady, setAppReady] = useState(false);
  // const { role } = useRoleStore(); // buyer | farmer | null

  // useEffect(() => {
  //   const init = async () => {
  //     const token = await getToken();

  //     setAppReady(true);
  //     await SplashScreen.hideAsync();

  //     const inPublic = segments[0] === "(public)";
  //     const inBuyer = segments[0] === "(buyer)";
  //     const inFarmer = segments[0] === "(farmer)";

  //     // Not logged in → force public flow
  //     if (!token) {
  //       if (!inPublic) router.replace("/(public)/onboarding");
  //       return;
  //     }

  //     // Logged in → route by role
  //     if (role === "buyer" && !inBuyer) {
  //       router.replace("/(buyer)/home");
  //     }

  //     if (role === "farmer" && !inFarmer) {
  //       router.replace("/(farmer)/dashboard");
  //     }
  //   };

  //   init();
  // }, [role]);

  // if (!appReady) return null;
  const loading = useLoadingStore((s) => s.loading);

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
