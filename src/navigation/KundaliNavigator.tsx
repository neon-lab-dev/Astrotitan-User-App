import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KundliScreen from "../screens/tabs/kundali/KundliScreen";
import KundliRequestDetails from "../screens/tabs/kundali/KundliRequestDetails";

const Stack = createNativeStackNavigator();

export default function KundaliNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >

      <Stack.Screen
        name="KundliScreen"
        component={KundliScreen}
      />

      <Stack.Screen
        name="KundliRequestDetails"
        component={KundliRequestDetails}
      />

    </Stack.Navigator>
  );
}