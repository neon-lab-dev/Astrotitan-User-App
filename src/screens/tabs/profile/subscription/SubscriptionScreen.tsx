import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";

const SubscriptionScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("USER FROM REDUX:", user);

  return (
    <AnimatedScreen>
    <ScreenWrapper>

      <AppHeader>
        <AuthTitle title="Choose a plan">
          <SansText style={{ fontSize: 16 }}>
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
export default SubscriptionScreen;
