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
      iconBg: '#eaebe5',
    },
    {
      id: 'analyzeKundli',
      title: 'Analyze Kundli',
      description: 'Upload existing kundli for expert analysis',
      icon: ICONS.AnalyzeKundli,
      iconBg: '#eaebe5',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Choose Request Type</SatoshiText>
        <SansText style={styles.subtitle}>
          Select how you'd like to proceed with your kundli
        </SansText>
      </View>

      <View style={styles.optionsContainer}>
        {options.map(option => {
          const isActive = requestType === option.id;
          const IconComponent = option.icon;

          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, isActive && styles.optionCardActive]}
              onPress={() => setRequestType(option.id as any)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.iconContainerActive,
                ]}
              >
                <View
                  style={[styles.iconBg, { backgroundColor: option.iconBg }]}
                >
                  <IconComponent width={28} height={28} />
                </View>
              </View>
              <SatoshiText
                style={[
                  styles.optionTitle,
                  isActive && styles.optionTitleActive,
                ]}
              >
                {option.title}
              </SatoshiText>
              <SansText style={styles.optionDescription}>
                {option.description}
              </SansText>
              {isActive && (
                <View style={styles.checkmark}>
                  <SansText style={styles.checkmarkText}>✓</SansText>
                </View>
              )}
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
    fontSize: 22,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  optionCardActive: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.04)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  iconContainerActive: {
    backgroundColor: '#D4AF37',
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  optionTitleActive: {
    color: '#D4AF37',
  },
  optionDescription: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Step1_RequestType;
