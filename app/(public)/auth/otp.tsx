import { useLoadingStore } from "@/store/loadingStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OTP() {
  const router = useRouter();
  const { role: rawRole } = useLocalSearchParams();
  const role =
    rawRole === "farmer" || rawRole === "buyer" ? rawRole : undefined;
  const [code, setCode] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(57);
  const [verifying, setVerifying] = useState(false);
  const setLoading = useLoadingStore((s) => s.setLoading);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const verify = useCallback(() => {
    if (verifying) return;
    setVerifying(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerifying(false);
      if (role === "farmer") {
        router.replace("/(farmer)/dashboard");
      } else {
        router.replace("/(buyer)/home");
      }
    }, 800);
  }, [verifying, role, router, setLoading]);

  useEffect(() => {
    if (verifying) return;
    if (code.every((digit) => digit !== "")) {
      verify();
    }
  }, [code, verifying, verify]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const updateCode = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...code];
    next[index] = value;
    setCode(next);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const resendCode = () => {
    setSeconds(57);
  };

  return (
    <View className="flex-1 bg-[#f6faf4] px-6 justify-center">
      <View className="mx-auto w-full max-w-xl rounded-[36px] bg-white p-6 shadow-xl shadow-black/5">
        <View className="items-center mb-6">
          <View className="rounded-3xl bg-green-700 p-4">
            <MaterialCommunityIcons name="check-bold" size={28} color="#fff" />
          </View>
        </View>

        <Text className="text-3xl font-bold text-center text-gray-900">
          Verification Code
        </Text>
        <Text className="text-center text-sm text-gray-500 mt-2">
          Code sent to +234 812 •••• 90
        </Text>

        <View className="mt-10 flex-row justify-between">
          {code.map((value, index) => (
            <TextInput
              key={index}
              ref={(element) => {
                if (element) inputs.current[index] = element;
              }}
              value={value}
              onChangeText={(text) => updateCode(index, text)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(index, nativeEvent.key)
              }
              keyboardType="number-pad"
              maxLength={1}
              className="h-16 w-16 rounded-3xl border border-gray-200 bg-emerald-50 text-center text-2xl font-bold text-gray-900"
            />
          ))}
        </View>

        <View className="mt-8 items-center">
          <Text className="text-gray-500">Didn't receive the code?</Text>
          <TouchableOpacity onPress={resendCode} disabled={seconds > 0}>
            <Text
              className={`mt-2 text-base font-bold ${
                seconds > 0 ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {seconds > 0
                ? `Resend in 0:${seconds.toString().padStart(2, "0")}`
                : "Resend code"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={verify}
          disabled={verifying || code.some((digit) => digit === "")}
          className={`mt-10 rounded-3xl py-4 shadow-lg shadow-emerald-700/20 ${
            verifying || code.some((digit) => digit === "")
              ? "bg-emerald-300"
              : "bg-emerald-700"
          }`}
        >
          <Text className="text-center text-base font-bold text-white">
            {verifying ? "Verifying..." : "Verify & Continue →"}
          </Text>
        </TouchableOpacity>

        <View className="mt-6 items-center">
          <Text className="text-gray-400 text-sm">
            Secured by HarvestAI Guard
          </Text>
        </View>
      </View>
    </View>
  );
}
