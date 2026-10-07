import React, { useEffect, useMemo, useState } from 'react';
import {
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FormValues = {
  dob: Date | null;
  time: string;
  place: string;
};

type TimePickerType = 'hour' | 'minute' | 'period' | null;
type DatePickerType = 'day' | 'month' | 'year' | null;

const hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, '0'),
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0'),
);
const periods = ['AM', 'PM'];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR - 100;
// Newest first — feels natural when scrolling (common in date dropdowns)
const YEARS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i),
);

const daysInMonth = (month: number, year: number) => {
  // month is 1-based here
  return new Date(year, month, 0).getDate();
};

const BirthDetails = () => {
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<TimePickerType>(null);
  const [showDatePicker, setShowDatePicker] = useState<DatePickerType>(null);

  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  // Date dropdown state
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // 1-12 as string
  const [selectedYear, setSelectedYear] = useState('');

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { dob: null, time: '', place: '' },
    mode: 'onChange',
  });

  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();
  const dob = watch('dob');
  const time = watch('time');
  const place = watch('place');
  const user = useSelector((state: RootState) => state.auth.user);

  /* ================== DERIVED DAYS LIST ================== */
  const days = useMemo(() => {
    const month = parseInt(selectedMonth) || 1;
    const year = parseInt(selectedYear) || CURRENT_YEAR;
    const total = daysInMonth(month, year);
    return Array.from({ length: total }, (_, i) =>
      String(i + 1).padStart(2, '0'),
    );
  }, [selectedMonth, selectedYear]);

  /* ================== SYNC DOB -> selected* ================== */
  useEffect(() => {
    if (!dob) return;
    const d = String(dob.getDate()).padStart(2, '0');
    const m = String(dob.getMonth() + 1); // keep as "1".."12" for picker matching
    const y = String(dob.getFullYear());
    setSelectedDay(d);
    setSelectedMonth(m);
    setSelectedYear(y);
  }, [dob]);

  /* ================== SYNC selected* -> DOB ================== */
  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const d = parseInt(selectedDay);
      const m = parseInt(selectedMonth);
      const y = parseInt(selectedYear);
      const maxDay = daysInMonth(m, y);
      if (d > maxDay) {
        // clamp if user changed month/year to something with fewer days
        setSelectedDay(String(maxDay).padStart(2, '0'));
        return;
      }
      setValue('dob', new Date(y, m - 1, d), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedDay, selectedMonth, selectedYear, setValue]);

  /* ================== SYNC TIME from profile ================== */
  useEffect(() => {
    if (time) {
      const parts = time.split(' ');
      if (parts.length === 2) {
        const [h, m] = parts[0].split(':');
        setSelectedHour(h);
        setSelectedMinute(m);
        setSelectedPeriod(parts[1]);
      }
    }
  }, [time]);

  /* ================== FORMATTERS ================== */
  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return '';
    try {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  const formatDateForAPI = (date: Date | null) => {
    if (!date) return '';
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const isDateValid = (date: Date | null) =>
    !!date && date instanceof Date && !isNaN(date.getTime());

  /* ================== HYDRATE FROM PROFILE ================== */
  useEffect(() => {
    const profile = user?.profile;
    if (!profile) return;

    if (profile?.dateOfBirth) {
      try {
        let date: Date;
        if (profile.dateOfBirth.includes('/')) {
          const [dd, mm, yyyy] = profile.dateOfBirth.split('/');
          date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
        } else {
          date = new Date(profile.dateOfBirth);
        }
        if (!isNaN(date.getTime())) setValue('dob', date);
      } catch (e) {
        console.log('Error parsing date:', e);
      }
    }
    if (profile?.timeOfBirth) setValue('time', profile.timeOfBirth);
    if (profile?.placeOfBirth) setValue('place', profile.placeOfBirth);
  }, [user, setValue]);

  /* ================== VALIDATION ================== */
  const isFormValid =
    isDateValid(dob) &&
    selectedHour &&
    selectedMinute &&
    selectedPeriod &&
    place?.trim()?.length > 2;

  /* ================== SUBMIT ================== */
  const onSubmit = async (data: FormValues) => {
    try {
      const formattedDate = formatDateForAPI(data.dob);
      const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
      const payload = {
        dateOfBirth: formattedDate,
        timeOfBirth: formattedTime,
        placeOfBirth: data.place,
      };
      console.log('📤 Submitting payload:', payload);
      await updateProfile(payload).unwrap();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.log('❌ UPDATE PROFILE ERROR:', error?.data || error);
    }
  };

  /* ================== TIME HANDLERS ================== */
  const updateTimeOfBirth = (hour: string, minute: string, period: string) => {
    if (hour && minute && period) {
      setValue('time', `${hour}:${minute} ${period}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    setShowTimePicker(null);
    setTimeout(() => setShowTimePicker('minute'), 300);
  };
  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute);
    setShowTimePicker(null);
    setTimeout(() => setShowTimePicker('period'), 300);
  };
  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setShowTimePicker(null);
    updateTimeOfBirth(selectedHour, selectedMinute, period);
  };

  /* ================== DATE HANDLERS ================== */
  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setShowDatePicker(null);
    setTimeout(() => setShowDatePicker('month'), 300);
  };
  const handleMonthSelect = (monthIndex1Based: string) => {
    setSelectedMonth(monthIndex1Based);
    setShowDatePicker(null);
    setTimeout(() => setShowDatePicker('year'), 300);
  };
  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setShowDatePicker(null);
  };

  /* ================== PICKER DATA HELPERS ================== */
  const getTimePickerData = () => {
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

  const getTimePickerTitle = () => {
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
    if (showTimePicker === 'hour') handleHourSelect(item);
    else if (showTimePicker === 'minute') handleMinuteSelect(item);
    else if (showTimePicker === 'period') handlePeriodSelect(item);
  };

  // For Date picker (day / month / year)
  // Month data is [ [value, label], ... ] so we can show January instead of 1
  const getDatePickerData = (): { value: string; label: string }[] => {
    switch (showDatePicker) {
      case 'day':
        return days.map(d => ({ value: d, label: d }));
      case 'month':
        return MONTHS.map((name, i) => ({
          value: String(i + 1),
          label: name,
        }));
      case 'year':
        return YEARS.map(y => ({ value: y, label: y }));
      default:
        return [];
    }
  };

  const getDatePickerTitle = () => {
    switch (showDatePicker) {
      case 'day':
        return 'Select Day';
      case 'month':
        return 'Select Month';
      case 'year':
        return 'Select Year';
      default:
        return '';
    }
  };

  const isDateItemSelected = (value: string) => {
    if (showDatePicker === 'day') return selectedDay === value;
    if (showDatePicker === 'month') return selectedMonth === value;
    if (showDatePicker === 'year') return selectedYear === value;
    return false;
  };

  const handleDateItemPress = (value: string) => {
    if (showDatePicker === 'day') handleDaySelect(value);
    else if (showDatePicker === 'month') handleMonthSelect(value);
    else if (showDatePicker === 'year') handleYearSelect(value);
  };

  /* ================== DISPLAY TEXT ================== */
  const dobDisplay = dob ? formatDateForDisplay(dob) : 'Select Date of Birth';

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
              {/* ============== DOB ============== */}
              <Controller
                control={control}
                name="dob"
                rules={{ required: 'Date of birth is required' }}
                render={({ fieldState: { error } }) => (
                  <View>
                    <SansText style={styles.label}>Date of Birth</SansText>

                    {/* 3 field row: DD / MM / YYYY */}
                    <View style={styles.dateRow}>
                      <TouchableOpacity
                        style={[
                          styles.dateField,
                          error && styles.dateFieldError,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setShowDatePicker('day')}
                      >
                        <SansText
                          style={[
                            styles.dateFieldText,
                            !selectedDay && styles.dateFieldPlaceholder,
                          ]}
                        >
                          {selectedDay || 'DD'}
                        </SansText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.dateField,
                          styles.dateFieldFlexible,
                          error && styles.dateFieldError,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setShowDatePicker('month')}
                      >
                        <SansText
                          style={[
                            styles.dateFieldText,
                            !selectedMonth && styles.dateFieldPlaceholder,
                          ]}
                          numberOfLines={1}
                        >
                          {selectedMonth
                            ? MONTHS[parseInt(selectedMonth) - 1]
                            : 'Month'}
                        </SansText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.dateField,
                          error && styles.dateFieldError,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setShowDatePicker('year')}
                      >
                        <SansText
                          style={[
                            styles.dateFieldText,
                            !selectedYear && styles.dateFieldPlaceholder,
                          ]}
                        >
                          {selectedYear || 'YYYY'}
                        </SansText>
                      </TouchableOpacity>
                    </View>

                    {dob && (
                      <SansText style={styles.helperText}>
                        Selected: {dobDisplay}
                      </SansText>
                    )}

                    {error && (
                      <SansText style={styles.errorText}>
                        {error.message}
                      </SansText>
                    )}
                  </View>
                )}
              />

              {/* ============== TIME ============== */}
              <View style={styles.timeContainer}>
                <SansText style={styles.label}>Time of Birth</SansText>
                <View style={styles.timeFields}>
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

              {/* ============== PLACE ============== */}
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
            <View
              style={[
                styles.bottomContainer,
                { paddingBottom: insets.bottom + 16 },
              ]}
            >
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

        {/* ============== DATE PICKER MODAL ============== */}
        <Modal
          visible={showDatePicker !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(null)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowDatePicker(null)}
          >
            <Pressable
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <SatoshiText style={styles.modalTitle}>
                  {getDatePickerTitle()}
                </SatoshiText>
                <TouchableOpacity onPress={() => setShowDatePicker(null)}>
                  <SansText style={styles.closeText}>Close</SansText>
                </TouchableOpacity>
              </View>

              <FlatList
                data={getDatePickerData()}
                keyExtractor={item => item.value}
                numColumns={showDatePicker === 'month' ? 2 : 3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pickerList}
                renderItem={({ item }) => {
                  const isSelected = isDateItemSelected(item.value);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        showDatePicker === 'month' && styles.monthPickerItem,
                        isSelected && styles.pickerItemActive,
                      ]}
                      onPress={() => handleDateItemPress(item.value)}
                    >
                      <SansText
                        style={[
                          styles.pickerItemText,
                          isSelected && styles.pickerItemTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </SansText>
                    </TouchableOpacity>
                  );
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>

        {/* ============== TIME PICKER MODAL ============== */}
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
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <SatoshiText style={styles.modalTitle}>
                  {getTimePickerTitle()}
                </SatoshiText>
                <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                  <SansText style={styles.closeText}>Close</SansText>
                </TouchableOpacity>
              </View>

              <FlatList
                data={getTimePickerData()}
                keyExtractor={item => item}
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
  container: { flex: 1 },
  label: {
    fontSize: 14,
    color: '#0D0D0D',
    lineHeight: 26,
  },
  scrollContent: { paddingBottom: 160 },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 14,
  },

  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#F7F1DF',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#777',
    lineHeight: 16,
  },

  /* ============ DATE (DD / MM / YYYY) ============ */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateField: {
    width: 78,
    height: 52,
    borderWidth: 1,
    borderColor: '#e7c555',
    backgroundColor: '#fdf5da',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  dateFieldFlexible: {
    flex: 1,
    width: undefined,
  },
  dateFieldError: {
    borderColor: '#FF3B30',
  },
  dateFieldText: {
    fontSize: 14,
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Medium',
  },
  dateFieldPlaceholder: {
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },

  /* ============ TIME ============ */
  timeContainer: { marginTop: 2 },
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
  timeFieldPlaceholder: { color: '#999' },

  /* ============ MODAL ============ */
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
  pickerList: { gap: 10 },
  pickerItem: {
    flex: 1,
    height: 50,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  monthPickerItem: { flex: 1 },
  periodPickerItem: { flex: 1 },
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