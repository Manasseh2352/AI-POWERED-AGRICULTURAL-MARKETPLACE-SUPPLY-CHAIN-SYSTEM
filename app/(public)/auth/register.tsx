import { useLoadingStore } from "@/store/loadingStore";
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
} from "react-native";

export default function Register() {
  const router = useRouter();
  const role = useRoleStore((s) => s.role);
  const setLoading = useLoadingStore((s) => s.setLoading);

  // Buyer form state
  const [buyerForm, setBuyerForm] = useState({
    fullName: "",
    workEmail: "",
    phoneNumber: "",
    interestType: "vegetables",
    deliveryAddress: "",
    agreeToTerms: false,
  });

  // Farmer form state
  const [farmerForm, setFarmerForm] = useState({
    farmName: "",
    phoneNumber: "",
    primaryCropType: "wheat",
    farmLocation: "",
    agreeToTerms: false,
  });

  const handleBuyerChange = (field: string, value: any) => {
    setBuyerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFarmerChange = (field: string, value: any) => {
    setFarmerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuyerSubmit = () => {
    if (
      !buyerForm.fullName ||
      !buyerForm.workEmail ||
      !buyerForm.phoneNumber ||
      !buyerForm.deliveryAddress
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (!buyerForm.agreeToTerms) {
      alert("Please agree to Terms of Service");
      return;
    }

    router.push(`/(public)/auth/otp?role=buyer`);
  };

  const handleFarmerSubmit = () => {
    if (
      !farmerForm.farmName ||
      !farmerForm.phoneNumber
      //   !farmerForm.farmLocation
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (!farmerForm.agreeToTerms) {
      alert("Please agree to Terms of Service");
      return;
    }

    router.push(`/(public)/auth/otp?role=farmer`);
  };

  if (!role) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  // BUYER FORM
  if (role === "buyer") {
    return (
      <ScrollView
        className="flex-1 bg-[#f6faf4]"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-8">
          {/* HEADER */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="leaf" size={28} color="#047857" />
              <Text className="text-2xl font-bold text-emerald-700">
                HarvestAI
              </Text>
            </View>
          </View>

          {/* TITLE */}
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Become a Buyer
          </Text>
          <Text className="text-gray-500 mb-8">
            Fill in your details to start sourcing premium crops.
          </Text>

          {/* FORM CARD */}
          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5">
            {/* FULL NAME */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </Text>
              <TextInput
                placeholder="Johnathan Doe"
                value={buyerForm.fullName}
                onChangeText={(text) => handleBuyerChange("fullName", text)}
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            {/* WORK EMAIL */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Work Email
              </Text>
              <TextInput
                placeholder="john@company.com"
                value={buyerForm.workEmail}
                onChangeText={(text) => handleBuyerChange("workEmail", text)}
                keyboardType="email-address"
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            {/* PHONE NUMBER */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </Text>
              <TextInput
                placeholder="+1 (555) 000–0000"
                value={buyerForm.phoneNumber}
                onChangeText={(text) => handleBuyerChange("phoneNumber", text)}
                keyboardType="phone-pad"
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            {/* INTEREST TYPE */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Interest Type
              </Text>
              <View className="border border-gray-300 rounded-2xl px-4 py-3 bg-white">
                {/* <Picker
                  selectedValue={buyerForm.interestType}
                  onValueChange={(value) =>
                    handleBuyerChange("interestType", value)
                  }
                  style={{ color: "#111" }}
                >
                  <Picker.Item label="Select interest" value="" />
                  <Picker.Item label="Vegetables" value="vegetables" />
                  <Picker.Item label="Fruits" value="fruits" />
                  <Picker.Item label="Grains" value="grains" />
                  <Picker.Item label="Livestock" value="livestock" />
                </Picker> */}
              </View>
            </View>

            {/* DELIVERY ADDRESS */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Delivery Address
              </Text>
              <TextInput
                placeholder="Enter your primary delivery location or HQ"
                value={buyerForm.deliveryAddress}
                onChangeText={(text) =>
                  handleBuyerChange("deliveryAddress", text)
                }
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-2xl px-4 py-3 text-gray-900"
                placeholderTextColor="#999"
              />
            </View>

            {/* TERMS CHECKBOX */}
            <View className="flex-row items-start mb-6 gap-3">
              <TouchableOpacity
                onPress={() =>
                  handleBuyerChange("agreeToTerms", !buyerForm.agreeToTerms)
                }
                className={`w-5 h-5 rounded-lg border-2 mt-0.5 items-center justify-center ${
                  buyerForm.agreeToTerms
                    ? "bg-emerald-700 border-emerald-700"
                    : "border-gray-300 bg-white"
                }`}
              >
                {buyerForm.agreeToTerms && (
                  <MaterialCommunityIcons name="check" size={14} color="#fff" />
                )}
              </TouchableOpacity>
              <Text className="flex-1 text-sm text-gray-600 leading-5">
                I agree to the{" "}
                <Text className="text-emerald-700 font-semibold">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-emerald-700 font-semibold">
                  Privacy Policy
                </Text>
                , including the verification of my buyer credentials.
              </Text>
            </View>

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              onPress={handleBuyerSubmit}
              className="bg-emerald-700 rounded-2xl py-4 shadow-lg shadow-emerald-700/20 mb-4"
            >
              <Text className="text-white text-center font-bold text-base">
                Create Buyer Account →
              </Text>
            </TouchableOpacity>

            {/* LOGIN LINK */}
            <View className="flex-row justify-center gap-1">
              <Text className="text-gray-600">Already have an account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/(public)/auth/login")}
              >
                <Text className="text-emerald-700 font-bold">Log in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FOOTER */}
          <View className="mt-8 items-center gap-6">
            <View className="flex-row gap-4 justify-center">
              <MaterialCommunityIcons
                name="tractor"
                size={24}
                color="#047857"
              />
              <MaterialCommunityIcons name="leaf" size={24} color="#047857" />
              <MaterialCommunityIcons name="star" size={24} color="#047857" />
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500">
                © 2024 HarvestAI Inc. All rights reserved.
              </Text>
              <View className="flex-row gap-4 mt-2">
                <TouchableOpacity>
                  <Text className="text-xs text-gray-500 font-semibold">
                    Support
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-xs text-gray-500 font-semibold">
                    Knowledge Base
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-xs text-gray-500 font-semibold">
                    API Docs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // FARMER FORM
  if (role === "farmer") {
    return (
      <ScrollView
        className="flex-1 bg-[#f6faf4]"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-8">
          {/* HEADER */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="leaf" size={28} color="#047857" />
              <Text className="text-2xl font-bold text-emerald-700">
                HarvestAI
              </Text>
            </View>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="#4b5563"
              />
            </TouchableOpacity>
          </View>

          {/* TITLE */}
          <Text className="text-xs font-semibold text-gray-600 mb-2 tracking-wider">
            JOIN THE ECOSYSTEM
          </Text>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Empower your yield with
          </Text>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            AI precision.
          </Text>
          <Text className="text-gray-500 mb-8 leading-6">
            Create your professional farmer profile to access smart market
            insights, real-time demand forecasting, and a direct network of
            premium buyers.
          </Text>

          {/* FORM CARD */}
          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5">
            {/* FARM NAME */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Farm Name
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4">
                <MaterialCommunityIcons name="barn" size={20} color="#6b7280" />
                <TextInput
                  placeholder="e.g. Green Valley Estates"
                  value={farmerForm.farmName}
                  onChangeText={(text) => handleFarmerChange("farmName", text)}
                  className="flex-1 py-3 text-gray-900"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* PHONE NUMBER */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4">
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color="#6b7280"
                />
                <TextInput
                  placeholder="+1 (555) 000–0000"
                  value={farmerForm.phoneNumber}
                  onChangeText={(text) =>
                    handleFarmerChange("phoneNumber", text)
                  }
                  keyboardType="phone-pad"
                  className="flex-1 py-3 text-gray-900"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* PRIMARY CROP TYPE */}
            {/* <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Primary Crop Type
              </Text>
              <View className="border border-gray-300 rounded-2xl px-4 py-3 bg-white flex-row items-center">
                <Text className="text-sm text-gray-500">Crop type</Text>
                <Picker
                  selectedValue={farmerForm.primaryCropType}
                  onValueChange={(value) =>
                    handleFarmerChange("primaryCropType", value)
                  }
                  style={{ color: "#111", flex: 1 }}
                >
                  <Picker.Item label="Select your main specialty" value="" />
                  <Picker.Item label="Wheat" value="wheat" />
                  <Picker.Item label="Maize" value="maize" />
                  <Picker.Item label="Rice" value="rice" />
                  <Picker.Item label="Vegetables" value="vegetables" />
                  <Picker.Item label="Fruits" value="fruits" />
                </Picker>
              </View>
            </View> */}

            {/* FARM LOCATION MAP */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-gray-900">
                  Farm Location
                </Text>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#047857"
                  />
                  <Text className="text-xs text-emerald-700 font-semibold">
                    Use Current GPS
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="bg-gray-700 rounded-2xl h-48 items-center justify-center">
                <View className="items-center gap-2">
                  <View className="w-12 h-12 rounded-full bg-emerald-700 items-center justify-center">
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={20}
                      color="#fff"
                    />
                  </View>
                  <Text className="text-white font-semibold">
                    Tap map to set pin
                  </Text>
                </View>
              </View>
            </View>

            {/* TERMS CHECKBOX */}
            <View className="flex-row items-start mb-6 gap-3">
              <TouchableOpacity
                onPress={() =>
                  handleFarmerChange("agreeToTerms", !farmerForm.agreeToTerms)
                }
                className={`w-5 h-5 rounded-lg border-2 mt-0.5 items-center justify-center ${
                  farmerForm.agreeToTerms
                    ? "bg-emerald-700 border-emerald-700"
                    : "border-gray-300 bg-white"
                }`}
              >
                {farmerForm.agreeToTerms && (
                  <MaterialCommunityIcons name="check" size={14} color="#fff" />
                )}
              </TouchableOpacity>
              <Text className="flex-1 text-sm text-gray-600 leading-5">
                I agree to the{" "}
                <Text className="text-emerald-700 font-semibold">
                  Terms of Service
                </Text>{" "}
                and confirm that my farm follows HarvestAI's organic
                sustainability standards.
              </Text>
            </View>

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              onPress={handleFarmerSubmit}
              className="bg-emerald-700 rounded-2xl py-4 shadow-lg shadow-emerald-700/20"
            >
              <Text className="text-white text-center font-bold text-base">
                Create Farmer Account →
              </Text>
            </TouchableOpacity>
          </View>

          {/* BOTTOM NAV PREVIEW */}
          <View className="mt-8 flex-row justify-around items-end pb-8">
            <View className="items-center gap-1">
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={24}
                color="#4b5563"
              />
              <Text className="text-xs text-gray-600">Market</Text>
            </View>
            <View className="items-center gap-1">
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#4b5563"
              />
              <Text className="text-xs text-gray-600">Insights</Text>
            </View>
            <View className="items-center gap-1">
              <MaterialCommunityIcons
                name="clipboard-text"
                size={24}
                color="#4b5563"
              />
              <Text className="text-xs text-gray-600">Orders</Text>
            </View>
            <View className="items-center gap-1 bg-emerald-700 rounded-full w-12 h-12 justify-center">
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={24}
                color="#fff"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
}
