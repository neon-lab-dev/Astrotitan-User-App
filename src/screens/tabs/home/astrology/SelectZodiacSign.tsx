import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import SelectZodiacScreen from "../../../../components/reusable/zodiacSigns/zodiacSigns";

import { RootStackParamList } from "../../../../navigation/types";

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const SelectZodiacSign = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = (sign: string) => {
    navigation.replace("HoroscopeScreen", {
      sign,
    });
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenWrapper>
        <AppHeader showBack={true}>
          <AuthTitle title="Select your zodiac sign" />
        </AppHeader>

        <SelectZodiacScreen
          handleContinue={handleContinue}
        />
      </ScreenWrapper>
    </SafeAreaView>
  );
};

export default SelectZodiacSign;