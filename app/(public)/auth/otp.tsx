import { useLoadingStore } from "@/store/loadingStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { DEV_BYPASS_OTP } from "@/constants/api";

export default function OTP() {
  const router = useRouter();
  const { role: rawRole } = useLocalSearchParams();
  const role = rawRole === "farmer" || rawRole === "buyer" ? rawRole : undefined;
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(57);
  const [verifying, setVerifying] = useState(false);
  const setLoading = useLoadingStore((s) => s.setLoading);
  const inputs = useRef<TextInput[]>([]);
  
  const pendingEmail = useAuthStore((s) => s.pendingEmail);

  useEffect(() => {
    if (!pendingEmail) {
      Alert.alert("Error", "No pending registration found.");
      router.replace("/(public)/auth/register");
    }
  }, [pendingEmail, router]);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const verify = useCallback(async () => {
    if (verifying) return;
    const otpValue = code.join("");
    
    // In strict mode we expect 6 digit OTP. 
    // The previous mockup used 4, but backend requires 6 digits.
    if (otpValue.length !== 6 && !DEV_BYPASS_OTP) {
        Alert.alert("Error", "Please enter a 6-digit OTP.");
        return;
    }

    setVerifying(true);
    setLoading(true);
    
    try {
      if (DEV_BYPASS_OTP) {
         console.warn("DEV_BYPASS_OTP is enabled. Bypassing OTP validation via fake setTimeout...");
         await new Promise(r => setTimeout(r, 800));
      } else {
         await AuthService.verifyOTP(pendingEmail!, otpValue);
      }

      if (role === "farmer") {
        router.replace("/(public)/auth/login"); // OTP verified, now they can login
      } else {
        router.replace("/(public)/auth/login"); // OTP verified, now they can login
      }
      
      Alert.alert("Success", "Account verified successfully. Please log in.");
      
    } catch (err: any) {
       Alert.alert("Verification Failed", err.message);
    } finally {
       setLoading(false);
       setVerifying(false);
    }
  }, [verifying, role, router, setLoading, code, pendingEmail]);

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

    if (value && index < 5) {
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
    Alert.alert("Info", "In a real app, an API call would be made here to resend the code.");
  };

  const fillFakeOTP = () => {
     setCode(["1", "2", "3", "4", "5", "6"]);
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
          Code sent to {pendingEmail}
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
              className="h-12 w-12 rounded-2xl border border-gray-200 bg-emerald-50 text-center text-xl font-bold text-gray-900"
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
          {verifying ? (
            <ActivityIndicator color="white" />
          ) : (
             <Text className="text-center text-base font-bold text-white">
              Verify & Continue →
            </Text>
          )}
        </TouchableOpacity>

        {DEV_BYPASS_OTP && (
           <TouchableOpacity onPress={fillFakeOTP} className="mt-4 py-2">
             <Text className="text-center text-red-500 font-bold">DEV BYPASS: Fill Code</Text>
           </TouchableOpacity>
        )}

        <View className="mt-6 items-center">
          <Text className="text-gray-400 text-sm">
            Secured by HarvestAI Guard
          </Text>
        </View>
      </View>
    </View>
  );
}
