import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const [dismissedAdvisory, setDismissedAdvisory] = useState(false);

  const QuickActionCard = ({
    title,
    desc,
    icon,
    isHighlight,
  }: {
    title: string;
    desc: string;
    icon: ReactNode;
    isHighlight?: boolean;
  }) => (
    <TouchableOpacity
      className={`rounded-2xl p-4 mb-3 flex-row items-center ${
        isHighlight ? "bg-emerald-700" : "bg-gray-100"
      }`}
    >
      <View className="mr-4">{icon}</View>
      <View>
        <Text
          className={`font-bold ${isHighlight ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </Text>
        <Text
          className={`text-xs ${isHighlight ? "text-emerald-100" : "text-gray-500"}`}
        >
          {desc}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ActivityItem = ({
    icon,
    title,
    desc,
    status,
    time,
    badgeColor,
  }: {
    icon: ReactNode;
    title: string;
    desc: string;
    status: string;
    time: string;
    badgeColor?: string;
  }) => (
    <View className="flex-row items-start gap-3 mb-4 pb-4 border-b border-gray-200">
      <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-900">{title}</Text>
        <Text className="text-xs text-gray-500 mt-1">{desc}</Text>
        <View
          className={`mt-2 px-2 py-1 rounded-full w-fit ${badgeColor || "bg-yellow-100"}`}
        >
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              name="circle-outline"
              size={12}
              color="#ca8a04"
            />
            <Text
              className={`text-xs font-semibold ${badgeColor ? "text-white" : "text-yellow-800"}`}
            >
              {status}
            </Text>
          </View>
        </View>
      </View>
      <Text className="text-xs text-gray-500">{time}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-4 bg-white">
          <TouchableOpacity>
            <MaterialCommunityIcons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-emerald-700">AgroTrade</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="#111827"
              />
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={24}
                color="#374151"
              />
            </View>
          </View>
        </View>

        {/* GREETING SECTION */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900">
            Good morning, Green Valley Farms
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Here's what's happening with your harvest today.
          </Text>
        </View>

        {/* STATS CARDS */}
        <View className="px-6 flex-row gap-3 mb-6">
          {/* Live Listings */}
          <View className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-xs text-gray-500">Live Listings</Text>
                <Text className="text-2xl font-bold text-gray-900 mt-1">
                  12
                </Text>
              </View>
              <View className="bg-emerald-700 px-2 py-1 rounded-lg">
                <Text className="text-xs text-white font-bold">+2 new</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="clipboard-text"
              size={28}
              color="#047857"
            />
          </View>

          {/* Total Sales */}
          <View className="flex-1 bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
            <View>
              <Text className="text-xs text-gray-500">Total Sales</Text>
              <Text className="text-xl font-bold text-gray-900 mt-1">
                ₦2.4M
              </Text>
            </View>
            <MaterialCommunityIcons name="cash" size={28} color="#b45309" />
          </View>
        </View>

        {/* SECOND ROW STATS */}
        <View className="px-6 flex-row gap-3 mb-8">
          {/* Pending Orders */}
          <View className="flex-1 bg-red-50 rounded-2xl p-4 border border-red-100">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-xs text-gray-500">Pending Orders</Text>
                <Text className="text-2xl font-bold text-gray-900 mt-1">5</Text>
              </View>
              <View className="bg-red-600 px-2 py-1 rounded-lg">
                <Text className="text-xs text-white font-bold">!</Text>
              </View>
            </View>
            <Text className="text-xs text-red-700 mt-2 font-semibold">
              Action Required
            </Text>
          </View>

          {/* Market Trend */}
          <View className="flex-1 bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <View>
              <Text className="text-xs text-gray-500">Market Trend</Text>
              <Text className="text-lg font-bold text-emerald-700 mt-1">
                +12%
              </Text>
            </View>
            <Text className="text-xs text-gray-600 mt-2 font-semibold">
              High Demand
            </Text>
            <MaterialCommunityIcons
              name="trending-up"
              size={24}
              color="#047857"
            />
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View className="px-6 mb-8">
          <Text className="text-xs font-bold text-gray-600 mb-4 tracking-wider">
            QUICK ACTIONS
          </Text>
          <QuickActionCard
            title="Upload Produce"
            desc="Add new items to marketplace"
            icon={
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={24}
                color="#fff"
              />
            }
            isHighlight
          />
          <QuickActionCard
            title="View Orders"
            desc="Manage your current sales"
            icon={
              <MaterialCommunityIcons
                name="clipboard-list"
                size={24}
                color="#047857"
              />
            }
          />
          <QuickActionCard
            title="Market Insights"
            desc="AI-driven price forecasts"
            icon={
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#047857"
              />
            }
          />
        </View>

        {/* RECENT ACTIVITY */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xs font-bold text-gray-600 tracking-wider">
              RECENT ACTIVITY
            </Text>
            <TouchableOpacity>
              <Text className="text-xs text-emerald-700 font-bold">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ActivityItem
            icon={
              <MaterialCommunityIcons name="cart" size={18} color="#047857" />
            }
            title="New Order: 200kg Premium Maize"
            desc="Purchased by Lagos Flour Mills"
            status="Pending Confirmation"
            time="2h"
            badgeColor="bg-yellow-100"
          />

          <ActivityItem
            icon={
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={18}
                color="#047857"
              />
            }
            title="Listing Verified"
            desc='"Organic Cocoa Beans" is now live on the marketplace."'
            status="Published"
            time="5h"
            badgeColor="bg-emerald-100"
          />

          <ActivityItem
            icon={
              <MaterialCommunityIcons
                name="cash-multiple"
                size={18}
                color="#047857"
              />
            }
            title="Payout Dispatched"
            desc="₦450,000 sent to your verified bank account."
            status="Completed"
            time="Yesterday"
            badgeColor="bg-emerald-100"
          />
        </View>

        {/* AI ADVISORY */}
        {!dismissedAdvisory && (
          <View className="mx-6 mb-8 bg-emerald-700 rounded-3xl p-6 overflow-hidden">
            {/* Background image effect */}
            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-3">
                <MaterialCommunityIcons
                  name="flash"
                  size={14}
                  color="#d1fae5"
                />
                <Text className="text-white text-xs font-bold tracking-wider">
                  AI ADVISORY
                </Text>
              </View>
              <Text className="text-white text-lg font-bold mb-2">
                Yams prices are predicted to rise 15% next week.
              </Text>
              <Text className="text-emerald-100 text-sm leading-5">
                Our AI analyzed weather patterns and logistics data. We
                recommend holding your current stock for 5 more days to maximize
                profit.
              </Text>
            </View>

            <TouchableOpacity className="bg-white rounded-full py-3 mb-3">
              <Text className="text-center text-emerald-700 font-bold text-sm">
                See Detailed Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setDismissedAdvisory(true)}>
              <Text className="text-center text-white text-sm font-semibold">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* YAM HARVEST TRENDS */}
        <View className="mx-6 mb-8 bg-yellow-100 rounded-2xl h-32 overflow-hidden relative">
          <Image
            source={require("@/assets/images/Home.jpeg")}
            style={{ width: "100%", height: "100%", opacity: 0.6 }}
          />
          <View className="absolute inset-0 items-center justify-between p-4 flex-row">
            <Text className="text-sm font-bold text-gray-900">
              Yam Harvest Trends
            </Text>
            <TouchableOpacity className="w-8 h-8 rounded-full bg-emerald-700 items-center justify-center">
              <Text className="text-white font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
