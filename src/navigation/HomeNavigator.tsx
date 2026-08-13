import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/tabs/home/HomeScreen";
import HoroscopeScreen from "../screens/tabs/home/astrology/HoroscopeScreen";
import SelectZodiacSign from "../screens/tabs/home/astrology/SelectZodiacSign";
import ArticleScreen from "../screens/tabs/home/article/ArticleScreen";
import SubscriptionScreen from "../screens/tabs/profile/subscription/SubscriptionScreen";
import NotificationScreen from "../screens/notification/notification";
import AstrologerDetailsScreen from "../screens/tabs/astrologers/astrologer/AstrologerDetailsScreen";
import PujaDetails from "../screens/tabs/remedies/ecommerce/PujaDetails";
import ProductDetails from "../screens/tabs/remedies/ecommerce/ProductDetails";
import CheckoutScreen from "../screens/tabs/remedies/ecommerce/CheckoutScreen";
import ConsultationForm from "../screens/tabs/remedies/ecommerce/ConsultationForm";
import PujaConsultationSuccess from "../screens/tabs/remedies/ecommerce/PujaConsultationSuccess";
import RequestConsultationForm from "../screens/tabs/astrologers/astrologer/RequestConsultationForm";
import AstrologerScreen from "../screens/tabs/astrologers/AstrologerScreen";
import CartScreen from "../screens/tabs/remedies/ecommerce/CartScreen";

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      {/* HOME */}

      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
      />

      {/* ARTICLE */}

      <Stack.Screen
        name="ArticleScreen"
        component={ArticleScreen}
      />

      <Stack.Screen
        name="HoroscopeScreen"
        component={HoroscopeScreen}
      />
       <Stack.Screen
              name="AstrologerScreen"
              component={AstrologerScreen}
            />

      <Stack.Screen
        name="SelectZodiacSign"
        component={SelectZodiacSign}
      />
      <Stack.Screen
        name="SubscriptionScreen"
        component={SubscriptionScreen}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
      <Stack.Screen
        name="AstrologerDetailsScreen"
        component={AstrologerDetailsScreen}
      />
      <Stack.Screen
        name="RequestConsultationForm"
        component={RequestConsultationForm}
      />
      <Stack.Screen
        name="PujaDetails"
        component={PujaDetails}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
      />
      <Stack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
      />
      <Stack.Screen
        name="ConsultationForm"
        component={ConsultationForm}
      />
      <Stack.Screen
        name="PujaConsultationSuccess"
        component={PujaConsultationSuccess}
      />
    </Stack.Navigator>
  );
}
