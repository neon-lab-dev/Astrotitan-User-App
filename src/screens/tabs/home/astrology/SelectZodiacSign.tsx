/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import SelectZodiacScreen from '../../../../components/reusable/zodiacSigns/zodiacSigns';
import { RootStackParamList } from '../../../../navigation/types';
import AppBar from '../../../../components/reusable/AppBar/AppBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SelectZodiacSign = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = (sign: string) => {
    navigation.replace('HoroscopeScreen', {
      sign,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenWrapper>
        <AppBar title="Select Your Zodiac Sign" />

        <SelectZodiacScreen handleContinue={handleContinue} />
      </ScreenWrapper>
    </SafeAreaView>
  );
};

export default SelectZodiacSign;
