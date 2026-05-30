import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const reviews = [
  {
    id: "1",
    name: "Marcus Chen",
    date: "Oct 12, 2023",
    rating: 5,
    comment:
      "The quality of this quinoa is exceptional. You can really tell it's heirloom variety— the nutty flavor is much more pronounced than store-bought options. Shipping was incredibly fast and the sustainable packaging is a big plus for me!",
    helpful: 24,
    verified: true,
    response:
      "Thank you so much Marcus! We take great pride in our traditional heirloom seeds. Glad to hear the flavor stood out for you. We're committed to that sustainable packaging for exactly the reasons you mentioned!",
  },
  {
    id: "2",
    name: "Sarah J.",
    date: "Oct 08, 2023",
    rating: 5,
    comment:
      "Great product overall. The delivery took a day longer than expected, but the quality of the grains made up for it. Very clean, no stones or husks. Will buy again in bulk.",
    helpful: 8,
    verified: true,
  },
  {
    id: "3",
    name: "Robert L.",
    date: "Sep 29, 2023",
    rating: 4,
    comment:
      "Perfect harvest quality. Exactly what I was looking for for my restaurant's new menu.",
    helpful: 12,
    verified: false,
  },
];

export default function Reviews() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#f2f6ef]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900">HarvestAI</Text>
            <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5">
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color="#14532d"
              />
            </TouchableOpacity>
          </View>

          <Text className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Product Feedback
          </Text>
          <Text className="mt-3 text-3xl font-bold text-slate-900">
            Premium Heirloom Quinoa
          </Text>
          <Text className="mt-2 text-sm text-slate-600">
            Produced by{" "}
            <Text className="font-semibold text-emerald-700">
              Green Valley Collective
            </Text>
          </Text>

          <View className="mt-6 rounded-[32px] bg-white p-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-5xl font-bold text-slate-900">4.8</Text>
                <View className="mt-2 flex-row items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <MaterialCommunityIcons
                      key={index}
                      name={index < 4 ? "star" : "star-outline"}
                      size={16}
                      color="#f59e0b"
                    />
                  ))}
                </View>
                <Text className="mt-2 text-sm text-slate-500">124 Reviews</Text>
              </View>
              <View className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <View key={stars} className="flex-row items-center gap-3">
                    <Text className="w-4 text-sm text-slate-500">{stars}</Text>
                    <View className="h-2 flex-1 rounded-full bg-slate-200">
                      <View
                        className={`h-full rounded-full ${stars === 5 ? "bg-emerald-700" : stars === 4 ? "bg-emerald-500" : "bg-slate-400"}`}
                        style={{
                          width: `${stars === 5 ? 70 : stars === 4 ? 50 : stars === 3 ? 35 : stars === 2 ? 20 : 10}%`,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            {[
              { label: "All Reviews", active: true },
              { label: "Most Recent", active: false },
              { label: "With Photos", active: false },
            ].map((chip) => (
              <TouchableOpacity
                key={chip.label}
                className={`rounded-full px-4 py-2 ${chip.active ? "bg-emerald-700" : "bg-white"}`}
              >
                <Text
                  className={`text-sm font-semibold ${chip.active ? "text-white" : "text-slate-700"}`}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-5 space-y-4">
            {reviews.map((review) => (
              <View
                key={review.id}
                className="rounded-[32px] bg-white p-5 shadow-sm shadow-black/5"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 rounded-full bg-emerald-700 items-center justify-center">
                      <Text className="text-base font-bold text-white">
                        {review.name.split(" ")[0][0]}
                      </Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-slate-900">
                        {review.name}
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {review.date}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <MaterialCommunityIcons
                        key={index}
                        name={index < review.rating ? "star" : "star-outline"}
                        size={16}
                        color="#f59e0b"
                      />
                    ))}
                  </View>
                </View>
                <Text className="mt-4 text-sm leading-6 text-slate-700">
                  {review.comment}
                </Text>
                {review.response ? (
                  <View className="mt-4 rounded-3xl bg-emerald-50 p-4">
                    <Text className="text-sm font-semibold text-emerald-700">
                      Response from Green Valley Collective
                    </Text>
                    <Text className="mt-2 text-sm leading-6 text-slate-700">
                      {review.response}
                    </Text>
                  </View>
                ) : null}
                <View className="mt-4 flex-row items-center justify-between">
                  <Text className="text-sm text-slate-500">
                    Helpful ({review.helpful})
                  </Text>
                  <TouchableOpacity>
                    <MaterialCommunityIcons
                      name="thumb-up-outline"
                      size={18}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity className="mt-6 mx-auto rounded-full bg-white px-8 py-3 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold text-emerald-700">
              Load More Reviews
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
