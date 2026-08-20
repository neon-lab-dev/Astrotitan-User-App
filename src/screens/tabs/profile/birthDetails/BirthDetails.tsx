import React, { useEffect, useState } from 'react';

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useUpdateProfileMutation } from '../../../../redux/features/auth/authApi';
import { RootState } from '../../../../redux/store';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import FormInput from '../../../../components/reusable/InputField/FormInput';
import ReusableButton from '../../../../components/reusable/ReusableButton/ReusableButton';
import { SansText } from '../../../../components/reusable/Text/SansText';
import { SatoshiText } from '../../../../components/reusable/Text/SatoshiText';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import DateTimePicker from '@react-native-community/datetimepicker';

type FormValues = {
  dob: Date | null;
  time: string;
  place: string;
};

type TimePickerType = 'hour' | 'minute' | 'period' | null;

const hours = Array.from(
  { length: 12 },
  (_, index) => String(index + 1).padStart(2, '0')
);
const minutes = Array.from(
  { length: 60 },
  (_, index) => String(index).padStart(2, '0')
);
const periods = ['AM', 'PM'];

const BirthDetails = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<TimePickerType>(null);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      dob: null,
      time: '',
      place: '',
    },
    mode: 'onChange',
  });
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();
  const dob = watch('dob');
  const time = watch('time');
  const place = watch('place');
  const user = useSelector((state: RootState) => state.auth.user);

  // Parse existing time on load
  useEffect(() => {
    if (time) {
      const parts = time.split(' ');
      if (parts.length === 2) {
        const timeParts = parts[0].split(':');
        if (timeParts.length === 2) {
          setSelectedHour(timeParts[0]);
          setSelectedMinute(timeParts[1]);
          setSelectedPeriod(parts[1]);
        }
      }
    }
  }, [time]);

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return '';
    try {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date: Date | null) => {
    if (!date) return '';
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date for API:', error);
      return '';
    }
  };

  // Validate date
  const isDateValid = (date: Date | null) => {
    if (!date) return false;
    return date instanceof Date && !isNaN(date.getTime());
  };

  useEffect(() => {
    const profile = user?.profile;
    if (!profile) return;

    /* DATE */
    if (profile?.dateOfBirth) {
      try {
        let date: Date;
        if (profile.dateOfBirth.includes('/')) {
          const parts = profile.dateOfBirth.split('/');
          date = new Date(
            parseInt(parts[2]),
            parseInt(parts[1]) - 1,
            parseInt(parts[0])
          );
        } else {
          date = new Date(profile.dateOfBirth);
        }
        if (!isNaN(date.getTime())) {
          setValue('dob', date);
        }
      } catch (error) {
        console.log('Error parsing date:', error);
      }
    }

    /* TIME */
    if (profile?.timeOfBirth) {
      setValue('time', profile.timeOfBirth);
    }
    if (profile?.placeOfBirth) {
      setValue('place', profile.placeOfBirth);
    }
  }, [user, setValue]);

  const isFormValid =
    isDateValid(dob) &&
    selectedHour &&
    selectedMinute &&
    selectedPeriod &&
    place?.trim()?.length > 2;

  const onSubmit = async (data: FormValues) => {
    try {
      const formattedDate = formatDateForAPI(data.dob);

      // ✅ Use selected time components instead of data.time
      const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;

      const payload = {
        dateOfBirth: formattedDate,
        timeOfBirth: formattedTime,
        placeOfBirth: data.place,
      };

      console.log('📤 Submitting payload:', payload);

      const res = await updateProfile(payload).unwrap();
      console.log('✅ PROFILE UPDATED', res);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.log('❌ UPDATE PROFILE ERROR:', error?.data || error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('dob', selectedDate);
    }
  };

  const updateTimeOfBirth = (hour: string, minute: string, period: string) => {
    if (hour && minute && period) {
      const formattedTime = `${hour}:${minute} ${period}`;
      setValue('time', formattedTime, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    setShowTimePicker(null);
    setTimeout(() => {
      setShowTimePicker('minute');
    }, 300);
  };

  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute);
    setShowTimePicker(null);
    setTimeout(() => {
      setShowTimePicker('period');
    }, 300);
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setShowTimePicker(null);
    updateTimeOfBirth(selectedHour, selectedMinute, period);
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
    } else if (showTimePicker === 'minute') {
      handleMinuteSelect(item);
    } else if (showTimePicker === 'period') {
      handlePeriodSelect(item);
    }
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={40}
            contentContainerStyle={styles.scrollContent}
          >
            <AppBar title="Birth Details" />

            <View style={styles.formContainer}>
              {/* DOB */}
              <Controller
                control={control}
                name="dob"
                rules={{
                  required: 'Date of birth is required',
                }}
                render={({ field: { value }, fieldState: { error } }) => (
                  <View>
                    <SansText style={styles.label}>Date of Birth</SansText>
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
                            ? formatDateForDisplay(value)
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

              {/* TIME OF BIRTH - Custom Time Picker */}
              <View style={styles.timeContainer}>
                <SansText style={styles.label}>Time of Birth</SansText>

                <View style={styles.timeFields}>
                  {/* HOUR */}
                  <TouchableOpacity
                    style={styles.timeField}
                    activeOpacity={0.8}
                    onPress={() => setShowTimePicker('hour')}
                  >
                    <SansText
                      style={[
                        styles.timeFieldText,
                        !selectedHour && styles.timeFieldPlaceholder,
                      ]}
                    >
                      {selectedHour || 'HH'}
                    </SansText>
                  </TouchableOpacity>

                  <SansText style={styles.timeSeparator}>:</SansText>

                  {/* MINUTE */}
                  <TouchableOpacity
                    style={styles.timeField}
                    activeOpacity={0.8}
                    onPress={() => setShowTimePicker('minute')}
                  >
                    <SansText
                      style={[
                        styles.timeFieldText,
                        !selectedMinute && styles.timeFieldPlaceholder,
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
                        !selectedPeriod && styles.timeFieldPlaceholder,
                      ]}
                    >
                      {selectedPeriod || 'AM'}
                    </SansText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* PLACE */}
              <FormInput
                control={control}
                name="place"
                label="Birth Place"
                placeholder="Enter city, state, country...."
                rules={{
                  required: 'Birth place is required',
                  minLength: {
                    value: 3,
                    message: 'Enter valid birth place',
                  },
                  validate: (value: string) =>
                    /^[a-zA-Z\s,.-]+$/.test(value) ||
                    'Invalid characters entered',
                }}
              />
            </View>
          </KeyboardAwareScrollView>

          {/* FIXED BOTTOM */}
          {isFormValid && (
            <View style={styles.bottomContainer}>
              <ReusableButton
                title={showSuccess ? 'Details Saved!' : 'Save Birth Details'}
                onPress={handleSubmit(onSubmit)}
                width="100%"
                loading={updateLoading}
                disabled={updateLoading || showSuccess}
                variant="solid"
              />
              <SansText style={styles.footerText}>
                These details are used to generate accurate charts & insights
              </SansText>
            </View>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dob || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* TIME PICKER MODAL */}
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
              onPress={(event) => event.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <SatoshiText style={styles.modalTitle}>
                  {getPickerTitle()}
                </SatoshiText>
                <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                  <SansText style={styles.closeText}>Close</SansText>
                </TouchableOpacity>
              </View>

              <FlatList
                data={getPickerData()}
                keyExtractor={(item) => item}
                numColumns={showTimePicker === 'period' ? 2 : 4}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pickerList}
                renderItem={({ item }) => {
                  const isSelected =
                    (showTimePicker === 'hour' && selectedHour === item) ||
                    (showTimePicker === 'minute' && selectedMinute === item) ||
                    (showTimePicker === 'period' && selectedPeriod === item);

                  return (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        showTimePicker === 'period' && styles.periodPickerItem,
                        isSelected && styles.pickerItemActive,
                      ]}
                      onPress={() => handleTimeItemPress(item)}
                    >
                      <SansText
                        style={[
                          styles.pickerItemText,
                          isSelected && styles.pickerItemTextActive,
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
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default BirthDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#0D0D0D',
    lineHeight: 26,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 14,
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
    gap: 10,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#777',
    lineHeight: 16,
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
  },
  datePickerText: {
    fontSize: 14,
    color: '#1a1a2e',
  },
  datePickerPlaceholder: {
    color: '#999',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
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
    fontSize: 14,
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Medium',
  },
  timeFieldPlaceholder: {
    color: '#999',
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