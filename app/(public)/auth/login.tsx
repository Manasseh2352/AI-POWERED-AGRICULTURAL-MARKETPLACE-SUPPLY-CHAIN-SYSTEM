import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-white px-6 justify-center">

      <Text className="text-3xl font-bold text-center mb-8">
        Welcome Back
      </Text>

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      {/* PASSWORD */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/(buyer)/home")}
        className="bg-green-600 py-4 rounded-xl"
      >
        <Text className="text-white text-center font-bold">
          Login
        </Text>
      </TouchableOpacity>

      {/* GO TO REGISTER */}
      <TouchableOpacity
        onPress={() => router.push("/(public)/auth/register")}
        className="mt-4"
      >
        <Text className="text-center text-gray-500">
          Don’t have an account? Sign up
        </Text>
      </TouchableOpacity>

    </View>
  );
}