import { View, Dimensions } from "react-native";

import Slide1 from "./slide1";

const { width } = Dimensions.get("window");

// Each slide pushes the next slide's route itself (see the next/skip buttons
// in slide1-slide3), so this entry screen always shows the first slide.
export default function Onboarding() {
  return (
    <View className="flex-1 bg-black">

      {/* SLIDE (FULL SCREEN) */}
      <View style={{ width, flex: 1 }}>
        <Slide1 />
      </View>

    </View>
  );
}
