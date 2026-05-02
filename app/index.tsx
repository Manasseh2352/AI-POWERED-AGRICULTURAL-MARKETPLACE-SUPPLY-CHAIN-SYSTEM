import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      className="flex-1 justify-center items-center bg-yellow-200"
    >
      <Text className="text-3xl font-bold text-red-500">Hello World</Text>
      <Text className="text-lg text-blue-600 italic">Hi, this is my first app</Text>
    </View>
  );
}
