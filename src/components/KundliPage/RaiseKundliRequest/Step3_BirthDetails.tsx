import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';
import FormInput from '../../reusable/InputField/FormInput';
import { KundliFormData } from './types';

type Props = {
  control: Control<KundliFormData>;
  watch: any;
  setValue: any;
};

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const Step3_BirthDetails = ({ control, watch, setValue }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateOfBirth = watch('dateOfBirth');
  const userGender = watch('userGender');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('dateOfBirth', selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Birth Details</SatoshiText>
        <SansText style={styles.subtitle}>
          Provide your birth information for accurate kundli
        </SansText>
      </View>

      <View style={styles.form}>
        {/* Date of Birth */}
        <Controller
          control={control}
          name="dateOfBirth"
          rules={{ required: 'Date of birth is required' }}
          render={({ field: { value }, fieldState: { error } }) => (
            <View>
              <SansText style={styles.label}>Date of Birth</SansText>
              <TouchableOpacity
                style={[
                  styles.datePickerButton,
                  error && styles.datePickerError,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.datePickerContent}>
                  <SansText
                    style={[
                      styles.datePickerText,
                      !value && styles.datePickerPlaceholder,
                    ]}
                  >
                    {value ? formatDate(value) : 'Select Date of Birth'}
                  </SansText>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />

        <FormInput
          control={control}
          name="timeOfBirth"
          label="Time of Birth"
          placeholder="e.g. 10:30 AM"
          rules={{ required: 'Time of birth is required' }}
        />

        <FormInput
          control={control}
          name="placeOfBirth"
          label="Place of Birth"
          placeholder="Enter place of birth"
          rules={{ required: 'Place of birth is required' }}
        />

        {/* Gender Selection */}
        <View style={styles.genderContainer}>
          <SansText style={styles.genderLabel}>Gender</SansText>
          <View style={styles.genderOptions}>
            {genders.map(gender => (
              <TouchableOpacity
                key={gender.value}
                style={[
                  styles.genderOption,
                  userGender === gender.value && styles.genderOptionActive,
                ]}
                onPress={() => setValue('userGender', gender.value as any)}
              >
                <SansText
                  style={[
                    styles.genderText,
                    userGender === gender.value && styles.genderTextActive,
                  ]}
                >
                  {gender.label}
                </SansText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
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
  label: {
    fontSize: 14,
    color: '#0D0D0D',
    lineHeight: 26,
  },
  datePickerButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
   borderColor: "#e7c555",
    backgroundColor: "#fdf5da",
  },
  datePickerError: {
    borderColor: '#FF3B30',
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  datePickerText: {
    fontSize: 14,
    color: '#1a1a2e',
  },
  datePickerPlaceholder: {
    color: '#999',
  },
  genderContainer: {
    marginBottom: 4,
  },
  genderLabel: {
    fontSize: 14,
    color: '#1a1a2e',
    marginBottom: 8,
    fontFamily: 'Satoshi-Medium',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  genderOptionActive: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  genderText: {
    fontSize: 14,
    color: '#5a5a5a',
    fontFamily: 'Satoshi-Medium',
  },
  genderTextActive: {
    color: '#D4AF37',
  },
});

export default Step3_BirthDetails;
