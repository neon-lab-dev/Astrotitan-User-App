/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import FeatureCard from '../../tabs/home/home/FeatureCard/FeatureCard';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';

const DailyHoroscope = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View
      style={{
        gap: 12,
        paddingHorizontal: 16,
      }}
    >
      <ContentSection title="Daily Horoscope">
        <SansText>
          A quick overview of how today’s planetary positions may influence your
          day.
        </SansText>
      </ContentSection>

      <FeatureCard
        title="Today's Cosmic Pulse"
        description="Tap to select your zodiac sign and reveal today’s guidance."
        ctaText="Reveal Today’s Insight"
        image={require('@/assets/images/consmos1.png')}
        onPress={() => navigation.navigate('SelectZodiacSign')}
        date={new Date()}
      />
    </View>
  );
};

export default DailyHoroscope;
