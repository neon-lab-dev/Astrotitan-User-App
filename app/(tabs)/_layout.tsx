import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Tabs, useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export type CustomTabOptions = BottomTabNavigationOptions & {
  tabIcon?: {
    active: string;
    inactive: string;
  };
  isCenter?: boolean;
};

export default function TabsLayout() {
  const segments = useSegments();

  const currentRoute = segments[segments.length - 1];

  const hiddenRoutes = [
    "(astrology)",
    "remedy-details",
    "category",
    "saved-remedies",
    "address",
    "add-address",
    "settings",
    "subscriptions",
    "notifications",
    "kundali-result",
    "kundali-history",
    "compatibility",
    "add-address-success",
    "astrologer-details",
    "booking",
    "(reviews)",
    "(orders)",
    "(ecommerce)",
    "article",
    "edit-profile",
    "settings",
    "subscriptions",
    "notifications",
    "(astrologer)",
    "daily-horoscope",
    "zodiac-details",
    "spiritual-article",
    "cart",
    "checkout",
    "order-sucessfull",
    "intent-remedies",
    "birth-details",
    "(query)",
    "personal-information"
  ];
const hideTabBar = segments.some((segment) =>
  hiddenRoutes.includes(segment)
);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) =>
          hideTabBar ? null : <CustomTabBar {...props} />
        }
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      >
        <Tabs.Screen
          name="home"
          options={
            {
              tabIcon: {
                active: "homeActive",
                inactive: "homeInactive",
              },
              title: "Home",
            } as CustomTabOptions
          }
        />

        <Tabs.Screen
          name="kundali"
          options={
            {
              tabIcon: {
                active: "calendarActive",
                inactive: "calendarInactive",
              },
              title: "Kundali",
            } as CustomTabOptions
          }
        />

        <Tabs.Screen
          name="remedies"
          options={
            {
              tabIcon: {
                active: "firePitActive",
                inactive: "firePitInactive",
              },
              title: "Remedies",
            } as CustomTabOptions
          }
        />

        <Tabs.Screen
          name="astrologers"
          options={
            {
              tabIcon: {
                active: "starActive",
                inactive: "starInactive",
              },
              title: "Astrologer",
            } as CustomTabOptions
          }
        />

        <Tabs.Screen
          name="profile"
          options={
            {
              tabIcon: {
                active: "userActive",
                inactive: "userInactive",
              },
              title: "Profile",
            } as CustomTabOptions
          }
        />
      </Tabs>
    </SafeAreaView>
  );
}