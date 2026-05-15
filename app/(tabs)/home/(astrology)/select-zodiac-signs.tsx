// Clean, reusable React Native Expo components based on your UI
// Assumes you already have SatoshiText and SansText components

import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import SelectZodiacScreen from "@/components/reusable/zodiacSigns/zodiacSigns";
import { router } from "expo-router";
import React from "react";
;


const SelectZodiacSign = () => {

  const handleContinue = (sign: string) => {
    router.replace({
      pathname: "/(tabs)/home/(astrology)/horoscope",
      params: { sign },
    });
  };
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader showBack={true}>
            <AuthTitle title="Select your zodiac sign"></AuthTitle>
        </AppHeader>
      <SelectZodiacScreen handleContinue={handleContinue} />
      </ScreenWrapper>
      </AnimatedScreen>
  );
};

export default SelectZodiacSign;

