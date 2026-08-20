import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
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

type TimePickerType = 'hour' | 'minute' | 'period' | null;

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const hours = Array.from(
  { length: 12 },
  (_, index) => String(index + 1).padStart(2, '0'),
);

const minutes = Array.from(
  { length: 60 },
  (_, index) => String(index).padStart(2, '0'),
);

const periods = ['AM', 'PM'];

const Step3_BirthDetails = ({ control, watch, setValue }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTimePicker, setShowTimePicker] =
    useState<TimePickerType>(null);

  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const dateOfBirth = watch('dateOfBirth');
  const userGender = watch('userGender');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setValue('dateOfBirth', selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return '';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const updateTimeOfBirth = (
    hour: string,
    minute: string,
    period: string,
  ) => {
    if (hour && minute && period) {
      const formattedTime = `${hour}:${minute} ${period}`;

      setValue('timeOfBirth', formattedTime, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    setShowTimePicker(null);

    // Automatically open minute selector
    setTimeout(() => {
      setShowTimePicker('minute');
    }, 200);
  };

  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute);
    setShowTimePicker(null);

    // Automatically open AM/PM selector
    setTimeout(() => {
      setShowTimePicker('period');
    }, 200);
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);

    setShowTimePicker(null);

    updateTimeOfBirth(
      selectedHour,
      selectedMinute,
      period,
    );
  };

  const getPickerData = () => {
    switch (showTimePicker) {
      case 'hour':
        return hours;

      case 'minute':
        return minutes;

      case 'period':
        return periods;

      default:
        return [];
    }
  };

  const getPickerTitle = () => {
    switch (showTimePicker) {
      case 'hour':
        return 'Select Hour';

      case 'minute':
        return 'Select Minute';

      case 'period':
        return 'Select AM or PM';

      default:
        return '';
    }
  };

  const handleTimeItemPress = (item: string) => {
    if (showTimePicker === 'hour') {
      handleHourSelect(item);
    }

    if (showTimePicker === 'minute') {
      handleMinuteSelect(item);
    }

    if (showTimePicker === 'period') {
      handlePeriodSelect(item);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>
          Birth Details
        </SatoshiText>

        <SansText style={styles.subtitle}>
          Provide your birth information for accurate kundli
        </SansText>
      </View>

      <View style={styles.form}>
        {/* ================= DATE OF BIRTH ================= */}

        <Controller
          control={control}
          name="dateOfBirth"
          rules={{
            required: 'Date of birth is required',
          }}
          render={({ field: { value }, fieldState: { error } }) => (
            <View>
              <SansText style={styles.label}>
                Date of Birth
              </SansText>

              <TouchableOpacity
                style={[
                  styles.datePickerButton,
                  error && styles.datePickerError,
                ]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <View style={styles.datePickerContent}>
                  <SansText
                    style={[
                      styles.datePickerText,
                      !value && styles.datePickerPlaceholder,
                    ]}
                  >
                    {value
                      ? formatDate(value)
                      : 'Select Date of Birth'}
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

        {/* ================= TIME OF BIRTH ================= */}

        <Controller
          control={control}
          name="timeOfBirth"
          rules={{
            required: 'Time of birth is required',
          }}
          render={({ fieldState: { error } }) => (
            <View style={styles.timeContainer}>
              <SansText style={styles.label}>
                Time of Birth
              </SansText>

              <View
                style={[
                  styles.timeFields,
                  error && styles.timeFieldsError,
                ]}
              >
                {/* HOUR */}

                <TouchableOpacity
                  style={styles.timeField}
                  activeOpacity={0.8}
                  onPress={() => setShowTimePicker('hour')}
                >
                  <SansText
                    style={[
                      styles.timeFieldText,
                      !selectedHour &&
                        styles.timeFieldPlaceholder,
                    ]}
                  >
                    {selectedHour || 'HH'}
                  </SansText>
                </TouchableOpacity>

                <SansText style={styles.timeSeparator}>
                  :
                </SansText>

                {/* MINUTE */}

                <TouchableOpacity
                  style={styles.timeField}
                  activeOpacity={0.8}
                  onPress={() => setShowTimePicker('minute')}
                >
                  <SansText
                    style={[
                      styles.timeFieldText,
                      !selectedMinute &&
                        styles.timeFieldPlaceholder,
                    ]}
                  >
                    {selectedMinute || 'MM'}
                  </SansText>
                </TouchableOpacity>

                {/* AM / PM */}

                <TouchableOpacity
                  style={styles.periodField}
                  activeOpacity={0.8}
                  onPress={() => setShowTimePicker('period')}
                >
                  <SansText
                    style={[
                      styles.timeFieldText,
                      !selectedPeriod &&
                        styles.timeFieldPlaceholder,
                    ]}
                  >
                    {selectedPeriod || 'AM'}
                  </SansText>
                </TouchableOpacity>
              </View>

              {error && (
                <SansText style={styles.errorText}>
                  {error.message}
                </SansText>
              )}
            </View>
          )}
        />

        {/* ================= PLACE OF BIRTH ================= */}

        <FormInput
          control={control}
          name="placeOfBirth"
          label="Place of Birth"
          placeholder="Enter place of birth"
          rules={{
            required: 'Place of birth is required',
          }}
        />

        {/* ================= GENDER ================= */}

        <View style={styles.genderContainer}>
          <SansText style={styles.genderLabel}>
            Gender
          </SansText>

          <View style={styles.genderOptions}>
            {genders.map(gender => (
              <TouchableOpacity
                key={gender.value}
                style={[
                  styles.genderOption,
                  userGender === gender.value &&
                    styles.genderOptionActive,
                ]}
                onPress={() =>
                  setValue(
                    'userGender',
                    gender.value as any,
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    },
                  )
                }
                activeOpacity={0.8}
              >
                <SansText
                  style={[
                    styles.genderText,
                    userGender === gender.value &&
                      styles.genderTextActive,
                  ]}
                >
                  {gender.label}
                </SansText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ================= DATE PICKER ================= */}

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date()}
          mode="date"
          display={
            Platform.OS === 'ios'
              ? 'spinner'
              : 'default'
          }
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* ================= TIME PICKER MODAL ================= */}

      <Modal
        visible={showTimePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTimePicker(null)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={event => event.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <SatoshiText style={styles.modalTitle}>
                {getPickerTitle()}
              </SatoshiText>

              <TouchableOpacity
                onPress={() => setShowTimePicker(null)}
              >
                <SansText style={styles.closeText}>
                  Close
                </SansText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={getPickerData()}
              keyExtractor={item => item}
              numColumns={
                showTimePicker === 'period'
                  ? 2
                  : 4
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                styles.pickerList
              }
              renderItem={({ item }) => {
                const isSelected =
                  (showTimePicker === 'hour' &&
                    selectedHour === item) ||
                  (showTimePicker === 'minute' &&
                    selectedMinute === item) ||
                  (showTimePicker === 'period' &&
                    selectedPeriod === item);

                return (
                  <TouchableOpacity
                    style={[
                      styles.pickerItem,
                      showTimePicker === 'period' &&
                        styles.periodPickerItem,
                      isSelected &&
                        styles.pickerItemActive,
                    ]}
                    onPress={() =>
                      handleTimeItemPress(item)
                    }
                  >
                    <SansText
                      style={[
                        styles.pickerItemText,
                        isSelected &&
                          styles.pickerItemTextActive,
                      ]}
                    >
                      {item}
                    </SansText>
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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

  /* ================= DATE ================= */

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
  },

  datePickerText: {
    fontSize: 14,
    color: '#1a1a2e',
  },

  datePickerPlaceholder: {
    color: '#999',
  },

  /* ================= TIME ================= */

  timeContainer: {
    marginTop: 2,
  },

  timeFields: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  timeFieldsError: {
    borderColor: '#FF3B30',
  },

  timeField: {
    width: 70,
    height: 52,
    borderWidth: 1,
    borderColor: '#e7c555',
    backgroundColor: '#fdf5da',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodField: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#e7c555',
    backgroundColor: '#fdf5da',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeSeparator: {
    fontSize: 24,
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Bold',
  },

  timeFieldText: {
    fontSize: 16,
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Medium',
  },

  timeFieldPlaceholder: {
    color: '#999',
  },

  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },

  /* ================= GENDER ================= */

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

  /* ================= MODAL ================= */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '65%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
  },

  closeText: {
    fontSize: 14,
    color: '#D4AF37',
    fontFamily: 'Satoshi-Medium',
  },

  pickerList: {
    gap: 10,
  },

  pickerItem: {
    flex: 1,
    height: 50,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodPickerItem: {
    flex: 1,
  },

  pickerItemActive: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },

  pickerItemText: {
    fontSize: 16,
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Medium',
  },

  pickerItemTextActive: {
    color: '#D4AF37',
    fontFamily: 'Satoshi-Bold',
  },
});

export default Step3_BirthDetails;