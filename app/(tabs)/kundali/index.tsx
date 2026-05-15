// Clean, reusable React Native Expo components based on your UI
// Assumes you already have SatoshiText and SansText components

import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { RootState } from "@/redux/store";
import React from "react";
import { ScrollView, Text } from "react-native";
import { useSelector } from "react-redux";

const Kundali = () => {
const user = useSelector((state: RootState) => state.auth.user);
console.log("USER FROM REDUX:", user);
  return (
    <AnimatedScreen>
    <ScreenWrapper>
      <ScrollView style={{ flex: 1, }}>
        <Text> Kundali</Text>

      </ScrollView></ScreenWrapper></AnimatedScreen>
  );
};
export default Kundali;