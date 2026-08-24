import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // AuthService.login persists the normalized user + token to the store
      // (and secure storage) internally, so we only route here.
      const response = await AuthService.login(email.trim(), password);

      // Hard-gate OTP challenge: a PENDING account can't get a token yet. Stash
      // the password in memory so the OTP screen can auto-retry login after
      // verification, then route to the OTP screen (purpose=LOGIN).
      if (response?.otpRequired) {
        useAuthStore.getState().setPendingPassword(password);
        router.push(
          `/(public)/auth/otp?purpose=${response.purpose ?? "LOGIN"}`
        );
        return;
      }

      if (!response?.accessToken) {
        throw new Error("Login failed: missing accessToken");
      }

      if (response.user?.role === "farmer") {
        router.replace("/(farmer)/dashboard");
      } else {
        router.replace("/(buyer)/home");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error?.message || "An error occurred");
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
      <View className="flex-row items-center border border-gray-300 rounded-xl px-4 mb-4">
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          className="flex-1 py-3 text-black"
        />
        <TouchableOpacity onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
          <MaterialCommunityIcons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>

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
