import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AstrologerScreen from "../screens/tabs/astrologers/AstrologerScreen";
import AstrologerDetailsScreen from "../screens/tabs/astrologers/astrologer/AstrologerDetailsScreen";
import ChatHistory from "../screens/tabs/astrologers/(chat)/ChatHistory";
import RequestConsultationForm from "../screens/tabs/astrologers/astrologer/RequestConsultationForm";
import RequestedFormCompleted from "../screens/tabs/astrologers/astrologer/RequestedFormCompleted";
import AstrologerChatScreen from "../screens/tabs/astrologers/(chat)/AstrologerChatScreen";
import RequestedSessions from "../screens/tabs/astrologers/(chat)/RequestedSessions";

const Stack = createNativeStackNavigator();

export default function AstrologersNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      {/* HOME */}

      <Stack.Screen
        name="AstrologerScreen"
        component={AstrologerScreen}
      />

      <Stack.Screen
        name="AstrologerDetailsScreen"
        component={AstrologerDetailsScreen}
      />
      <Stack.Screen
        name="ChatHistory"
        component={ChatHistory}
      />
      <Stack.Screen
        name="AstrologerChatScreen"
        component={AstrologerChatScreen}
      />
      <Stack.Screen
        name="RequestConsultationForm"
        component={RequestConsultationForm}
      />
      <Stack.Screen
        name="RequestedFormCompleted"
        component={RequestedFormCompleted}
      />
      <Stack.Screen
        name="RequestedSessions"
        component={RequestedSessions}
      />
    </Stack.Navigator>
  );
}