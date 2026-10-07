import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import SelectZodiacScreen from '../../../../components/reusable/zodiacSigns/zodiacSigns';
import { RootStackParamList } from '../../../../navigation/types';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SelectZodiacSign = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = (sign: string) => {
    navigation.replace('HoroscopeScreen', {
      sign,
    });
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar title="Select Your Zodiac Sign" />
        <SelectZodiacScreen handleContinue={handleContinue} />
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SelectZodiacSign;
