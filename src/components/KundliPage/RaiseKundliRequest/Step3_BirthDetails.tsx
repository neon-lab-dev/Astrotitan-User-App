import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Control, Controller } from 'react-hook-form';

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
type DatePickerType = 'day' | 'month' | 'year' | null;

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const hours = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, '0'),
);

const minutes = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, '0'),
);

const periods = ['AM', 'PM'];

/* ================= DATE CONSTANTS ================= */

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

// Newest first — natural scroll for date-of-birth pickers
const YEARS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i),
);

/** Returns number of days in a given (1-based) month + year */
const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();

/* ================================================= */

const Step3_BirthDetails = ({ control, watch, setValue }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState<DatePickerType>(null);
  const [showTimePicker, setShowTimePicker] = useState<TimePickerType>(null);

  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  /* ============ DATE STATE ============ */
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // "1".."12"
  const [selectedYear, setSelectedYear] = useState('');

  const dateOfBirth = watch('dateOfBirth');
  const userGender = watch('userGender');
  const timeOfBirth = watch('timeOfBirth');

  /* ============ DAYS LIST (depends on month + year) ============ */
  const days = useMemo(() => {
    const month = parseInt(selectedMonth) || 1;
    const year = parseInt(selectedYear) || CURRENT_YEAR;
    const total = getDaysInMonth(month, year);
    return Array.from({ length: total }, (_, i) =>
      String(i + 1).padStart(2, '0'),
    );
  }, [selectedMonth, selectedYear]);

  /* ============ SYNC TIME: form -> local ============ */
  useEffect(() => {
    if (timeOfBirth) {
      const match = timeOfBirth.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
      if (match) {
        setSelectedHour(match[1].padStart(2, '0'));
        setSelectedMinute(match[2]);
        setSelectedPeriod(match[3].toUpperCase());
      }
    }
  }, [timeOfBirth]);

  /* ============ SYNC DATE: form -> local ============ */
  useEffect(() => {
    if (!dateOfBirth) return;
    // dateOfBirth may be a Date object OR a string
    let d: Date | null = null;
    if (dateOfBirth instanceof Date) {
      d = dateOfBirth;
    } else if (typeof dateOfBirth === 'string') {
      // try YYYY-MM-DD first, fallback to native parse
      const isoMatch = dateOfBirth.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        d = new Date(
          parseInt(isoMatch[1]),
          parseInt(isoMatch[2]) - 1,
          parseInt(isoMatch[3]),
        );
      } else {
        const parsed = new Date(dateOfBirth);
        if (!isNaN(parsed.getTime())) d = parsed;
      }
    }
    if (d && !isNaN(d.getTime())) {
      setSelectedDay(String(d.getDate()).padStart(2, '0'));
      setSelectedMonth(String(d.getMonth() + 1));
      setSelectedYear(String(d.getFullYear()));
    }
  }, [dateOfBirth]);

  /* ============ SYNC DATE: local -> form ============ */
  useEffect(() => {
    if (!selectedDay || !selectedMonth || !selectedYear) return;

    const day = parseInt(selectedDay);
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const maxDay = getDaysInMonth(month, year);

    if (day > maxDay) {
      // Clamp day if month/year changed to something shorter
      setSelectedDay(String(maxDay).padStart(2, '0'));
      return;
    }

    setValue('dateOfBirth', new Date(year, month - 1, day), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [selectedDay, selectedMonth, selectedYear, setValue]);

  /* ============ DISPLAY FORMATTER ============ */
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    try {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  /* ============ TIME HANDLERS ============ */
  const updateTimeOfBirth = (
    hour: string,
    minute: string,
    period: string,
  ) => {
    if (hour && minute && period) {
      setValue('timeOfBirth', `${hour}:${minute} ${period}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    setShowTimePicker(null);
    setTimeout(() => setShowTimePicker('minute'), 200);
  };

  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute);
    setShowTimePicker(null);
    setTimeout(() => setShowTimePicker('period'), 200);
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
    if (showTimePicker === 'hour') handleHourSelect(item);
    else if (showTimePicker === 'minute') handleMinuteSelect(item);
    else if (showTimePicker === 'period') handlePeriodSelect(item);
  };

  /* ============ DATE HANDLERS ============ */
  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setShowDatePicker(null);
    setTimeout(() => setShowDatePicker('month'), 200);
  };

  const handleMonthSelect = (monthIndex1Based: string) => {
    setSelectedMonth(monthIndex1Based);
    setShowDatePicker(null);
    setTimeout(() => setShowDatePicker('year'), 200);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setShowDatePicker(null);
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

  /* ============ DISPLAY HELPERS ============ */
  const monthLabel = selectedMonth
    ? MONTHS[parseInt(selectedMonth) - 1]
    : '';
  const dobHasAllParts = !!selectedDay && !!selectedMonth && !!selectedYear;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Birth Details</SatoshiText>
        <SansText style={styles.subtitle}>
          Provide your birth information for accurate kundli
        </SansText>
      </View>

      <View style={styles.form}>
        {/* ================= DATE OF BIRTH ================= */}
        <Controller
          control={control}
          name="dateOfBirth"
          rules={{ required: 'Date of birth is required' }}
          render={({ fieldState: { error } }) => (
            <View>
              <SansText style={styles.label}>Date of Birth</SansText>

              {/* DD / Month / YYYY row */}
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
                    {monthLabel || 'Month'}
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

              {dobHasAllParts && (
                <SansText style={styles.helperText}>
                  Selected: {formatDate(dateOfBirth)}
                </SansText>
              )}

              {error && (
                <SansText style={styles.errorText}>{error.message}</SansText>
              )}
            </View>
          )}
        />

        {/* ================= TIME OF BIRTH ================= */}
        <Controller
          control={control}
          name="timeOfBirth"
          rules={{ required: 'Time of birth is required' }}
          render={({ fieldState: { error } }) => (
            <View style={styles.timeContainer}>
              <SansText style={styles.label}>Time of Birth</SansText>

              <View style={styles.timeFields}>
                {/* HOUR */}
                <TouchableOpacity
                  style={[
                    styles.timeField,
                    error && styles.timeFieldError,
                  ]}
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
                  style={[
                    styles.timeField,
                    error && styles.timeFieldError,
                  ]}
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
                  style={[
                    styles.periodField,
                    error && styles.timeFieldError,
                  ]}
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

              {error && (
                <SansText style={styles.errorText}>{error.message}</SansText>
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
          rules={{ required: 'Place of birth is required' }}
        />

        {/* ================= GENDER ================= */}
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
                onPress={() =>
                  setValue('userGender', gender.value as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                activeOpacity={0.8}
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
              <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                <SansText style={styles.closeText}>Close</SansText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={getPickerData()}
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
    </View>
  );
};

export default Step3_BirthDetails;

/* =================================================================
   STYLES
================================================================= */

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

  /* ================= DATE (DD / Month / YYYY) ================= */

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

  timeFieldError: {
    borderColor: '#FF3B30',
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
    paddingHorizontal: 6,
  },

  monthPickerItem: {
    flex: 1,
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