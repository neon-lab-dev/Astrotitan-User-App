// components/RaiseKundliRequest/ProgressIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SansText } from '../../reusable/Text/SansText';

type Props = {
  currentStep: number;
  totalSteps: number;
};

const ProgressIndicator = ({ currentStep, totalSteps }: Props) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <SansText style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </SansText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default ProgressIndicator;