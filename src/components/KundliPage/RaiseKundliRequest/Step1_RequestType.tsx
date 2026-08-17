import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';
import { ICONS } from '../../../assets/svg';

type Props = {
  requestType: 'generateKundli' | 'analyzeKundli';
  setRequestType: (type: 'generateKundli' | 'analyzeKundli') => void;
};

const Step1_RequestType = ({ requestType, setRequestType }: Props) => {
  const options = [
    {
      id: 'generateKundli',
      title: 'Generate Kundli',
      description: 'Create a new kundli from your birth details',
      icon: ICONS.GenerateKundli,
    },
    {
      id: 'analyzeKundli',
      title: 'Analyze Kundli',
      description: 'Upload existing kundli for expert analysis',
      icon: ICONS.AnalyzeKundli,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Choose Request Type</SatoshiText>
        <SansText style={styles.subtitle}>
          Select how you'd like to proceed
        </SansText>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isActive = requestType === option.id;
          const IconComponent = option.icon;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isActive && styles.optionCardActive,
              ]}
              onPress={() => setRequestType(option.id as any)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={[
                  styles.iconWrapper,
                ]}>
                  <IconComponent width={24} height={24} />
                </View>
                <View style={styles.textContent}>
                  <SatoshiText style={[
                    styles.optionTitle,
                    isActive && styles.optionTitleActive,
                  ]}>
                    {option.title}
                  </SatoshiText>
                  <SansText style={styles.optionDescription}>
                    {option.description}
                  </SansText>
                </View>
                {isActive && (
                  <View style={styles.checkmark}>
                    <SansText style={styles.checkmarkText}>✓</SansText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
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
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  optionCardActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.04)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fffbe2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#363641',
    marginBottom: 2,
  },
  optionTitleActive: {
    color: '#D4AF37',
  },
  optionDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default Step1_RequestType;