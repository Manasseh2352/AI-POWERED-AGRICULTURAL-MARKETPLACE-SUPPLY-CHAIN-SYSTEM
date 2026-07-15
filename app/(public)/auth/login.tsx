import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { saveToken } from "@/lib/storage";

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      
      const { user, token } = response;
      await saveToken(token);
      setAuth(user, token);

      if (user.role === 'farmer') {
        router.replace("/(farmer)/dashboard");
      } else {
        router.replace("/(buyer)/home");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-black"
      />

      {/* PASSWORD */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-black"
      />

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`py-4 rounded-xl items-center justify-center ${loading ? 'bg-green-400' : 'bg-green-600'}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Login</Text>
        )}
      </TouchableOpacity>

      {/* GO TO REGISTER */}
      <TouchableOpacity
        onPress={() => router.push("/(public)/auth/register")}
        className="mt-4"
        disabled={loading}
      >
        <Text className="text-center text-gray-500">
          Don’t have an account? Sign up
        </Text>
      </TouchableOpacity>

    </View>
  );
}