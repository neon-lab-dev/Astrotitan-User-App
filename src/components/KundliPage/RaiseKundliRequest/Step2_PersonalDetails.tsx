import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Control } from 'react-hook-form';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';
import FormInput from '../../reusable/InputField/FormInput';
import { KundliFormData } from './types';

type Props = {
  control: Control<KundliFormData>;
  isAnalyzeMode?: boolean;
};

const Step2_PersonalDetails = ({ control, isAnalyzeMode = false }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Personal Details</SatoshiText>
        <SansText style={styles.subtitle}>
          {isAnalyzeMode 
            ? 'Tell us about yourself so we can analyze your kundli' 
            : 'Tell us about yourself'}
        </SansText>
      </View>

      <View style={styles.form}>
        <FormInput
          control={control}
          name="userName"
          label="Full Name"
          placeholder="Enter your full name"
          rules={{ required: 'Full name is required' }}
        />

        <FormInput
          control={control}
          name="userPhoneNumber"
          label="Phone Number"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          rules={{
            required: 'Phone number is required',
            minLength: {
              value: 10,
              message: 'Enter a valid phone number',
            },
          }}
        />

        {/* userNotes - Required Textarea */}
        <FormInput
          control={control}
          name="userNotes"
          label="Your Concern / Query"
          placeholder="Briefly describe your concern..."
          multiline
          numberOfLines={4}
          style={styles.textArea}
          rules={{ 
            required: 'Please describe your concern or query' 
          }}
        />
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
  form: {
    gap: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default Step2_PersonalDetails;