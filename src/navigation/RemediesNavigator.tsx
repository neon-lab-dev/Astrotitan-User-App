import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectZodiacSign from "../screens/tabs/home/astrology/SelectZodiacSign";
import RemediesScreen from "../screens/tabs/remedies/RemediesScreen";
import CartScreen from "../screens/tabs/remedies/ecommerce/CartScreen";
import ProductDetails from "../screens/tabs/remedies/ecommerce/ProductDetails";
import PujaDetails from "../screens/tabs/remedies/ecommerce/PujaDetails";
import IntentPuja from "../screens/tabs/remedies/ecommerce/IntentPuja";
import IntentProducts from "../screens/tabs/remedies/ecommerce/IntentProducts";
import OrderSuccessful from "../screens/tabs/remedies/ecommerce/OrderSuccessful";
import OrdersScreen from "../screens/tabs/remedies/orders/OrdersScreen";
import OrdersDetails from "../screens/tabs/remedies/orders/OrdersDetails";
import ProductReviews from "../screens/tabs/remedies/ecommerce/ProductReview";
import ConsultationForm from "../screens/tabs/remedies/ecommerce/ConsultationForm";
import PujaConsultationSuccess from "../screens/tabs/remedies/ecommerce/PujaConsultationSuccess";
import CheckoutScreen from "../screens/tabs/remedies/ecommerce/CheckoutScreen";

const Stack = createNativeStackNavigator();

export default function RemediesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >

      <Stack.Screen
        name="RemediesScreen"
        component={RemediesScreen}
      />

      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
      />
      <Stack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
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
        name="IntentProduct"
        component={IntentProducts}
      />
      <Stack.Screen
        name="IntentPuja"
        component={IntentPuja}
      />

      <Stack.Screen
        name="SelectZodiacSign"
        component={SelectZodiacSign}
      />
      <Stack.Screen
        name="OrdersScreen"
        component={OrdersScreen}
      />
      <Stack.Screen
        name="OrdersDetails"
        component={OrdersDetails}
      />
      <Stack.Screen
        name="OrderSuccessful"
        component={OrderSuccessful}
      />
      <Stack.Screen
        name="ProductReview"
        component={ProductReviews}
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