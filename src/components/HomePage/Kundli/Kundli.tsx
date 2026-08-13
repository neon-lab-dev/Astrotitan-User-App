/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import FeatureCard from '../../tabs/home/home/FeatureCard/FeatureCard';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';

const Kundli = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View
      style={{
        gap: 12,
        paddingHorizontal: 16,
      }}
    >
      <ContentSection title="Kundli">
        <SansText>
          A short insight from your birth chart based on today’s planetary
          movement.
        </SansText>
      </ContentSection>

      <FeatureCard
        title="Today’s Chart Insight"
        description="Saturn influences discipline & patience."
        image={require('@/assets/images/consmos2.png')}
        onPress={() => {
          navigation.getParent()?.navigate('KundaliTab');
        }}
        height={214}
      />
    </View>
  );
};

export default Kundli;
