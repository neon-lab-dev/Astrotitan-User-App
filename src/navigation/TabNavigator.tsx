// src/navigation/TabNavigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HomeNavigator from "./HomeNavigator";
import { CustomTabBar } from "../components/navigation/CustomTabBar";
import KundaliNavigator from "./KundaliNavigator";
import RemediesNavigator from "./RemediesNavigator";
import AstrologersNavigator from "./AstrologersNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

const hiddenRoutes = [
  "ArticleScreen",
  "HoroscopeScreen",
  "SelectZodiacSign",
  "ProductDetails",
  "PujaDetails",
  "ConsultationForm",
  "Queries",
  "QueryDetails",
  "RaiseQuerySuccess",
  "RaiseQuery",
  "SubscriptionScreen",
  "AddAddress",
  "AddressScreen",
  "BirthDetails",
  "PujaConsultationSuccess",
  "OrdersScreen",
  "OrdersDetails",
  "OrderSuccessful",
  "ChatHistory",
  "ProductReviews",
  "CartScreen",
  "CheckoutScreen",
  "AstrologerDetailsScreen",
  "RequestConsultationForm",
  "RequestedFormCompleted",
  "AstrologerChatScreen",
  "RequestedSessions",
  "NotificationScreen"
];

function shouldHideTabBar(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "";
  return hiddenRoutes.includes(routeName);
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={({ route }): any => ({
          title: "Home",
          tabIcon: { active: "homeActive", inactive: "homeInactive" },
          tabBarStyle: shouldHideTabBar(route) ? { display: "none" } : undefined,
        })}
      />
      <Tab.Screen
        name="KundaliTab"
        component={KundaliNavigator}
        options={({ route }): any => ({
          title: "Kundali",
          tabIcon: { active: "calendarActive", inactive: "calendarInactive" },
          tabBarStyle: shouldHideTabBar(route) ? { display: "none" } : undefined,
        })}
      />
      <Tab.Screen
        name="RemediesTab"
        component={RemediesNavigator}
        options={({ route }): any => ({
          title: "Pooja & Products",
          tabIcon: { active: "firePitActive", inactive: "firePitInactive" },
          tabBarStyle: shouldHideTabBar(route) ? { display: "none" } : undefined,
        })}
      />
      <Tab.Screen
        name="AstrologersTab"
        component={AstrologersNavigator}
        options={({ route }): any => ({
          title: "Astrologer",
          tabIcon: { active: "starActive", inactive: "starInactive" },
          tabBarStyle: shouldHideTabBar(route) ? { display: "none" } : undefined,
        })}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={({ route }): any => ({
          title: "Profile",
          tabIcon: { active: "userActive", inactive: "userInactive" },
          tabBarStyle: shouldHideTabBar(route) ? { display: "none" } : undefined,
        })}
      />
    </Tab.Navigator>
  );
}