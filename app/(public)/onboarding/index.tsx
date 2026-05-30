import { View, Dimensions, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Slide1 from "./slide1";
import Slide2 from "./slide2";
import Slide3 from "./slide3";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const slides = [<Slide1 />, <Slide2 />, <Slide3 />];

  const next = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      router.replace("/(public)/choose-role");
    }
  };

  return (
    <View className="flex-1 bg-black">

      {/* SLIDE (FULL SCREEN) */}
      <View style={{ width, flex: 1 }}>
        {slides[step]}
      </View>

      
    </View>
  );
}