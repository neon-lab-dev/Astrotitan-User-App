/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import FormInput from '../../../../components/reusable/InputField/FormInput';
import { useBookPujaMutation } from '../../../../redux/features/puja/pujaApi';
import ReusableButton from '../../../../components/reusable/ReusableButton/ReusableButton';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import { SansText } from '../../../../components/reusable/Text/SansText';
import DateTimePicker from '@react-native-community/datetimepicker';

type FormValues = {
  name: string;
  phoneNumber: string;
  preferredDate: Date | null;
  purposeOfPuja: string;
};

const ConsultationForm = () => {
  const route = useRoute<any>();
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pujaId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;

  const [bookPuja, { isLoading }] = useBookPujaMutation();

  const { control, setValue, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      preferredDate: null, // Use null instead of empty string
      purposeOfPuja: '',
    },
  });

  const preferredDate = watch('preferredDate');

  // Format date safely
  const formatDateSafe = (date: Date | null) => {
    if (!date) return 'Select Preferred Date';
    try {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Select Preferred Date';
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('preferredDate', selectedDate);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (!data.preferredDate) {
        console.error('No date selected');
        return;
      }

      const formattedDate = data.preferredDate.toISOString();

      const payload = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        pujaId: pujaId,
        preferredDate: formattedDate,
        purposeOfPuja: data.purposeOfPuja,
      };

      await bookPuja(payload).unwrap();
      navigation.navigate('PujaConsultationSuccess');
    } catch (error) {
      console.log('BOOKING ERROR:', error);
    }
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar title="Book Puja" />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <FormInput
              control={control}
              name="name"
              label="Full Name"
              placeholder="Enter your name"
              rules={{ required: 'Name is required' }}
            />

            <FormInput
              control={control}
              name="phoneNumber"
              label="Mobile Number"
              variant="phone"
              callingCode="91"
              placeholder="Enter mobile number"
              rules={{
                required: 'Mobile number cannot be empty!',
                minLength: {
                  value: 10,
                  message: 'Enter valid number',
                },
                maxLength: {
                  value: 10,
                  message: 'Enter valid number',
                },
              }}
            />

            <Controller
              control={control}
              name="preferredDate"
              rules={{ required: 'Preferred date is required' }}
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <SansText style={styles.label}>Preferred Date</SansText>
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
                        {formatDateSafe(value)}
                      </SansText>
                    </View>
                  </TouchableOpacity>
                  {error && (
                    <SansText style={styles.errorText}>
                      {error.message}
                    </SansText>
                  )}
                </View>
              )}
            />

            <FormInput
              control={control}
              name="purposeOfPuja"
              label="Purpose Of Puja"
              placeholder="Explain your purpose"
              multiline
              numberOfLines={4}
              rules={{ required: 'Purpose is required' }}
            />
          </ScrollView>

          <View style={styles.bottomContainer}>
            <ReusableButton
              title="Book Puja"
              width="100%"
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={preferredDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            // Remove maximumDate to allow future dates
            // OR set it to a future date if needed
            // minimumDate={new Date()} // Optional: prevent past dates
          />
        )}
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default ConsultationForm;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#F7F1DF',
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
    borderColor: '#e7c555',
    backgroundColor: '#fdf5da',
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
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});
