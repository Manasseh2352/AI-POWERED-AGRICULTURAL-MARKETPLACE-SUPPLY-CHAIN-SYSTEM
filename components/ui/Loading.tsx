import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <View className="rounded-3xl bg-white border border-gray-200 p-8 items-center shadow-lg shadow-black/5">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-4 text-base text-gray-700 font-medium text-center">
          {message}
        </Text>
      </View>
    </SafeAreaView>
  );
}
