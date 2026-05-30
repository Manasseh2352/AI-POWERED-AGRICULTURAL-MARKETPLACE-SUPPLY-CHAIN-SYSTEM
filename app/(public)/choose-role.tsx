import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useRoleStore } from "@/store/roleStore";

export default function ChooseRole() {
  const router = useRouter();
  const [selected, setSelected] = useState<"buyer" | "farmer" | null>(null);

  const setRole = useRoleStore((s) => s.setRole);

const handleContinue = () => {
  if (!selected) return;

  setRole(selected);

  router.push("/(public)/auth/register");
};

  const Card = ({
    type,
    title,
    desc,
    img,
  }: {
    type: "buyer" | "farmer";
    title: string;
    desc: string;
    img: any;
  }) => {
    const isActive = selected === type;

    return (
      <Animated.View entering={FadeInDown.duration(500)}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setSelected(type)}
          className={`rounded-3xl p-5 border-2 mb-4 ${
            isActive ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"
          }`}
        >
          <Animated.View entering={ZoomIn.duration(300)} className="items-center">

            {/* IMAGE WRAPPER */}
            <View
              className={`rounded-2xl p-3 ${
                isActive ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Image
                source={img}
                style={{ width: 130, height: 130 }}
                contentFit="contain"
              />
            </View>

            {/* TITLE */}
            <Text className="text-xl font-bold mt-4 text-gray-800">
              {title}
            </Text>

            {/* DESCRIPTION */}
            <Text className="text-gray-500 text-center mt-2 leading-5">
              {desc}
            </Text>

            {/* SELECTED BADGE */}
            {isActive && (
              <View className="mt-4 bg-green-600 px-4 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">
                  SELECTED
                </Text>
              </View>
            )}

          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">

      {/* HEADER */}
      <Animated.Text
        entering={FadeInDown.duration(400)}
        className="text-3xl font-bold text-center text-gray-800"
      >
        Choose Your Role
      </Animated.Text>

      <Text className="text-gray-500 text-center mt-2 mb-8">
        Select how you want to use AgroLink
      </Text>

      {/* CARDS */}
      <View>

        <Card
          type="buyer"
          title="Buyer"
          desc="Buy fresh farm produce directly from verified farmers at fair prices."
          img={require("@/assets/images/logo.png")}
        />

        <Card
          type="farmer"
          title="Farmer"
          desc="Sell your produce, manage inventory, and reach thousands of buyers."
          img={require("@/assets/images/logo.png")}
        />

      </View>

      {/* BUTTON */}
      <Animated.View entering={FadeInDown.delay(300)}>
        <TouchableOpacity
          disabled={!selected}
          onPress={handleContinue}
          className={`mt-6 p-4 rounded-2xl ${
            selected ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <Text className="text-white text-center font-bold text-base">
            Continue
          </Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}