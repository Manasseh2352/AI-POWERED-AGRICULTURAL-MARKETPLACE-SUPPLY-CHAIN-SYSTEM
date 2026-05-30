import { View, Text } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  title: string;
  description: string;
  image: any;
};

export default function OnboardingSlide({ title, description, image }: Props) {
  return (
    <View className="flex-1">

      {/* BACKGROUND IMAGE */}
      <Image
        source={image}
        className="absolute w-full h-full"
        contentFit="cover"
      />

      {/* DARK OVERLAY (optional but recommended for readability) */}
      <View className="absolute w-full h-full bg-black/30" />

      {/* CONTENT */}
      <View className="flex-1 items-center justify-center px-6">

        <Animated.Text
          entering={FadeInDown.duration(600)}
          className="text-2xl font-bold text-white text-center"
        >
          {title}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(200).duration(600)}
          className="text-gray-200 mt-4 text-center leading-6"
        >
          {description}
        </Animated.Text>

      </View>

    </View>
  );
}