import { useRoleStore } from "@/store/roleStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert
} from "react-native";
import { AuthService } from "@/services/auth.service";

export default function Register() {
  const router = useRouter();
  const role = useRoleStore((s) => s.role);

  // Buyer form state
  const [buyerForm, setBuyerForm] = useState({
    fullName: "",
    workEmail: "",
    phoneNumber: "",
    password: "",
    deliveryAddress: "",
    agreeToTerms: false,
  });

  // Farmer form state
  const [farmerForm, setFarmerForm] = useState({
    farmName: "",
    email: "",
    phoneNumber: "",
    password: "",
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [showBuyerPw, setShowBuyerPw] = useState(false);
  const [showFarmerPw, setShowFarmerPw] = useState(false);

  const handleBuyerChange = (field: string, value: any) => {
    setBuyerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFarmerChange = (field: string, value: any) => {
    setFarmerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuyerSubmit = async () => {
    if (!buyerForm.fullName || !buyerForm.workEmail || !buyerForm.phoneNumber || !buyerForm.password || !buyerForm.deliveryAddress) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!buyerForm.agreeToTerms) {
      Alert.alert("Error", "Please agree to Terms of Service");
      return;
    }
    if (buyerForm.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        fullName: buyerForm.fullName,
        email: buyerForm.workEmail.trim(),
        phone: buyerForm.phoneNumber,
        password: buyerForm.password,
        role: "buyer"
      });
      router.push(`/(public)/auth/otp?role=buyer`);
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerSubmit = async () => {
    if (!farmerForm.farmName || !farmerForm.email || !farmerForm.phoneNumber || !farmerForm.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!farmerForm.agreeToTerms) {
      Alert.alert("Error", "Please agree to Terms of Service");
      return;
    }
    if (farmerForm.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        fullName: farmerForm.farmName, // Using farm name as full name for now
        email: farmerForm.email.trim(),
        phone: farmerForm.phoneNumber,
        password: farmerForm.password,
        farmName: farmerForm.farmName,
        role: "farmer"
      });
      router.push(`/(public)/auth/otp?role=farmer`);
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // BUYER FORM
  if (role === "buyer") {
    return (
      <ScrollView className="flex-1 bg-[#f6faf4]" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-8">
          <View className="mb-6">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="leaf" size={28} color="#047857" />
              <Text className="text-2xl font-bold text-emerald-700">HarvestAI</Text>
            </View>
          </View>

          <Text className="text-3xl font-bold text-gray-900 mb-2">Become a Buyer</Text>
          <Text className="text-gray-500 mb-8">Fill in your details to start sourcing premium crops.</Text>

          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5">
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Full Name</Text>
              <TextInput
                placeholder="Johnathan Doe"
                value={buyerForm.fullName}
                onChangeText={(text) => handleBuyerChange("fullName", text)}
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Work Email</Text>
              <TextInput
                placeholder="john@company.com"
                value={buyerForm.workEmail}
                onChangeText={(text) => handleBuyerChange("workEmail", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Phone Number</Text>
              <TextInput
                placeholder="+1 (555) 000–0000"
                value={buyerForm.phoneNumber}
                onChangeText={(text) => handleBuyerChange("phoneNumber", text)}
                keyboardType="phone-pad"
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4">
                <TextInput
                  placeholder="Secure Password"
                  value={buyerForm.password}
                  onChangeText={(text) => handleBuyerChange("password", text)}
                  secureTextEntry={!showBuyerPw}
                  className="flex-1 py-3 text-gray-900"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowBuyerPw((s) => !s)} hitSlop={8}>
                  <MaterialCommunityIcons
                    name={showBuyerPw ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Delivery Address</Text>
              <TextInput
                placeholder="Enter your primary delivery location or HQ"
                value={buyerForm.deliveryAddress}
                onChangeText={(text) => handleBuyerChange("deliveryAddress", text)}
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            <View className="flex-row items-start mb-6 gap-3">
              <TouchableOpacity
                onPress={() => handleBuyerChange("agreeToTerms", !buyerForm.agreeToTerms)}
                className={`w-5 h-5 rounded-lg border-2 mt-0.5 items-center justify-center ${
                  buyerForm.agreeToTerms ? "bg-emerald-700 border-emerald-700" : "border-gray-300 bg-white"
                }`}
              >
                {buyerForm.agreeToTerms && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
              </TouchableOpacity>
              <Text className="flex-1 text-sm text-gray-600 leading-5">
                I agree to the <Text className="text-emerald-700 font-semibold">Terms of Service</Text> and <Text className="text-emerald-700 font-semibold">Privacy Policy</Text>.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleBuyerSubmit}
              disabled={loading}
              className={`rounded-2xl py-4 shadow-lg mb-4 items-center justify-center ${loading ? 'bg-emerald-400' : 'bg-emerald-700 shadow-emerald-700/20'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Create Buyer Account →</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center gap-1">
              <Text className="text-gray-600">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(public)/auth/login")}>
                <Text className="text-emerald-700 font-bold">Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // FARMER FORM
  if (role === "farmer") {
    return (
      <ScrollView className="flex-1 bg-[#f6faf4]" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-8">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="leaf" size={28} color="#047857" />
              <Text className="text-2xl font-bold text-emerald-700">HarvestAI</Text>
            </View>
          </View>

          <Text className="text-xs font-semibold text-gray-600 mb-2 tracking-wider">JOIN THE ECOSYSTEM</Text>
          <Text className="text-3xl font-bold text-gray-900 mb-2">Empower your yield with</Text>
          <Text className="text-3xl font-bold text-gray-900 mb-2">AI precision.</Text>

          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5 mt-8">
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Farm Name</Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4">
                <MaterialCommunityIcons name="barn" size={20} color="#6b7280" />
                <TextInput
                  placeholder="e.g. Green Valley Estates"
                  value={farmerForm.farmName}
                  onChangeText={(text) => handleFarmerChange("farmName", text)}
                  className="flex-1 py-3 text-gray-900 pl-2"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Email Address</Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4">
                <MaterialCommunityIcons name="email" size={20} color="#6b7280" />
                <TextInput
                  placeholder="farm@example.com"
                  value={farmerForm.email}
                  onChangeText={(text) => handleFarmerChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-3 text-gray-900 pl-2"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Phone Number</Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4">
                <MaterialCommunityIcons name="phone" size={20} color="#6b7280" />
                <TextInput
                  placeholder="+1 (555) 000–0000"
                  value={farmerForm.phoneNumber}
                  onChangeText={(text) => handleFarmerChange("phoneNumber", text)}
                  keyboardType="phone-pad"
                  className="flex-1 py-3 text-gray-900 pl-2"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4">
                <MaterialCommunityIcons name="lock" size={20} color="#6b7280" />
                <TextInput
                  placeholder="Secure Password"
                  value={farmerForm.password}
                  onChangeText={(text) => handleFarmerChange("password", text)}
                  secureTextEntry={!showFarmerPw}
                  className="flex-1 py-3 text-gray-900 pl-2"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowFarmerPw((s) => !s)} hitSlop={8}>
                  <MaterialCommunityIcons
                    name={showFarmerPw ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-start mb-6 gap-3">
              <TouchableOpacity
                onPress={() => handleFarmerChange("agreeToTerms", !farmerForm.agreeToTerms)}
                className={`w-5 h-5 rounded-lg border-2 mt-0.5 items-center justify-center ${
                  farmerForm.agreeToTerms ? "bg-emerald-700 border-emerald-700" : "border-gray-300 bg-white"
                }`}
              >
                {farmerForm.agreeToTerms && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
              </TouchableOpacity>
              <Text className="flex-1 text-sm text-gray-600 leading-5">
                I agree to the <Text className="text-emerald-700 font-semibold">Terms of Service</Text>.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleFarmerSubmit}
              disabled={loading}
              className={`rounded-2xl py-4 shadow-lg items-center justify-center ${loading ? 'bg-emerald-400' : 'bg-emerald-700 shadow-emerald-700/20'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-base">Create Farmer Account →</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
}
