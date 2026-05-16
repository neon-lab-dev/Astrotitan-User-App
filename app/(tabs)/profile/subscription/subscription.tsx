// Clean, reusable React Native Expo components based on your UI
// Assumes you already have SatoshiText and SansText components

import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import LogoutSection from '@/components/reusable/BottomSheet/LogoutSection';
import { SansText } from "@/components/reusable/Text/SansText";
import BottomSheetService from '@/redux/features/ui/GlobalSheet/BottomSheetService';
import { RootState } from "@/redux/store";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

const Subscription = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("USER FROM REDUX:", user);

  const onPressLogout = () => {
    BottomSheetService.open(
      <LogoutSection onCancel={BottomSheetService.close} onLogout={() => { }} />,
      {
        height: 400,
        hasGradient: true,
      }
    );
  };

  return (
    <AnimatedScreen>
    <ScreenWrapper>

      <AppHeader  onPressBack={()=>{router.back()}}>
        <AuthTitle title="Choose a plan">
          <SansText style={{ fontSize: 18 }}>
            Get uninterrupted access to astrologers and personalized guidance.
          </SansText>
        </AuthTitle>
      </AppHeader>
      <ScrollView style={{ flex: 1, paddingBottom: 0 }}>
        <View style={{ paddingHorizontal: 16, gap: 24, paddingVertical: 24 }}>
          

        </View>


        {/* DELETE */}

      </ScrollView></ScreenWrapper></AnimatedScreen>)
};
export default Subscription;
