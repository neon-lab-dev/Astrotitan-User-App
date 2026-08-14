// components/RaiseKundliRequest/ProgressIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';

type Props = {
  currentStep: number;
  totalSteps: number;
  label?: string;
};

const ProgressIndicator = ({ currentStep, totalSteps, label }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <View style={styles.labelDot} />
          <SatoshiText style={styles.label}>{label || 'Progress'}</SatoshiText>
        </View>
        <View style={styles.counterContainer}>
          <SatoshiText style={styles.counterCurrent}>{currentStep}</SatoshiText>
          <SansText style={styles.counterTotal}>/{totalSteps}</SansText>
        </View>
      </View>

      <View style={styles.track}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index + 1 <= currentStep;
          const isCurrent = index + 1 === currentStep;
          return (
            <View
              key={index}
              style={[
                styles.segment,
                isActive && styles.segmentActive,
                isCurrent && styles.segmentCurrent,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    color: '#1a1a2e',
    letterSpacing: -0.2,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  counterCurrent: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#D4AF37',
  },
  counterTotal: {
    fontSize: 13,
    color: '#B0B0B0',
    fontFamily: 'Satoshi-Medium',
  },
  track: {
    flexDirection: 'row',
    gap: 5,
    height: 4,
  },
  segment: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    height: 4,
  },
  segmentActive: {
    backgroundColor: '#D4AF37',
  },
  segmentCurrent: {
    backgroundColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default ProgressIndicator;