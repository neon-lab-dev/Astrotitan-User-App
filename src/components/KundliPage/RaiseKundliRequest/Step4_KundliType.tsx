// components/RaiseKundliRequest/Step4_KundliType.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Control } from 'react-hook-form';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';
import { KundliFormData, TKundliType } from './types';

type Props = {
  control: Control<KundliFormData>;
  watch: any;
  setValue: any;
};

const kundliTypes: { label: string; value: TKundliType; icon: string }[] = [
  { label: 'Birth Chart', value: 'birthChart', icon: '🌟' },
  { label: 'Compatibility', value: 'compatibility', icon: '💑' },
  { label: 'Career', value: 'career', icon: '💼' },
  { label: 'Marriage', value: 'marriage', icon: '💒' },
  { label: 'Yearly', value: 'yearly', icon: '📅' },
  { label: 'Love', value: 'love', icon: '❤️' },
  { label: 'Health', value: 'health', icon: '🏥' },
  { label: 'Finance', value: 'finance', icon: '💰' },
  { label: 'Education', value: 'education', icon: '📚' },
  { label: 'Business', value: 'business', icon: '🏢' },
  { label: 'Child', value: 'child', icon: '👶' },
  { label: 'Foreign Travel', value: 'foreignTravel', icon: '✈️' },
  { label: 'Property', value: 'property', icon: '🏠' },
  { label: 'Dosha Analysis', value: 'doshaAnalysis', icon: '🔮' },
  { label: 'Gemstone', value: 'gemstone', icon: '💎' },
];

const Step4_KundliType = ({ watch, setValue }: Props) => {
  const selectedType = watch('kundliType');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Select Kundli Type</SatoshiText>
        <SansText style={styles.subtitle}>
          Choose the type of kundli you want
        </SansText>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        <View style={styles.grid}>
          {kundliTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeOption,
                selectedType === type.value && styles.typeOptionActive,
              ]}
              onPress={() => setValue('kundliType', type.value)}
              activeOpacity={0.7}
            >
              <SansText style={styles.typeIcon}>{type.icon}</SansText>
              <SansText
                style={[
                  styles.typeLabel,
                  selectedType === type.value && styles.typeLabelActive,
                ]}
                numberOfLines={2}
              >
                {type.label}
              </SansText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeOption: {
    width: '30%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#c4c092',
    alignItems: 'center',
  },
  typeOptionActive: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
  },
  typeLabelActive: {
    color: '#D4AF37',
  },
});

export default Step4_KundliType;