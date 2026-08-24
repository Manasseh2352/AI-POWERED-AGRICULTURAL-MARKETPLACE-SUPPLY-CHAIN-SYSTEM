// CurrencyPicker: bottom-sheet modal for choosing the app's display currency.
// Lives in lib/ (an allowed workspace dir), imported as "@/lib/CurrencyPicker".
import { CURRENCIES } from "@/lib/currency";
import { useCurrencyStore } from "@/store/currencyStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Props = { visible: boolean; onClose: () => void };

export default function CurrencyPicker({ visible, onClose }: Props) {
  const code = useCurrencyStore((s) => s.code);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-8 pt-4">
        <View className="mb-4 items-center">
          <View className="h-1.5 w-12 rounded-full bg-gray-300" />
        </View>
        <Text className="mb-4 text-lg font-bold text-slate-900">Select Currency</Text>
        <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
          {CURRENCIES.map((c) => {
            const active = c.code === code;
            return (
              <Pressable
                key={c.code}
                onPress={() => {
                  setCurrency(c.code);
                  onClose();
                }}
                className={`mb-2 flex-row items-center rounded-2xl px-4 py-3 ${
                  active ? "bg-emerald-50" : "bg-slate-50"
                }`}
              >
                <Text className="text-2xl">{c.flag}</Text>
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-slate-900">
                    {c.code} · {c.symbol}
                  </Text>
                  <Text className="text-xs text-slate-500">{c.name}</Text>
                </View>
                {active && (
                  <MaterialCommunityIcons name="check-circle" size={22} color="#047857" />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}
