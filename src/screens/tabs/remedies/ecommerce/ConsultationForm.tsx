/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  FlatList,
  Pressable,
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
import { SatoshiText } from '../../../../components/reusable/Text/SatoshiText';

/* ==================================================
   DATE DROPDOWN CONSTANTS
================================================== */

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

const YEARS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i),
);

/** Number of days in a given (1-based) month + year */
const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();

type DatePickerType = 'day' | 'month' | 'year' | null;

/* ================================================== */

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

  /* ---- DROPDOWN PICKER STATE (replaces native calendar) ---- */
  const [showDatePicker, setShowDatePicker] = useState<DatePickerType>(null);

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const pujaId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;

  const [bookPuja, { isLoading }] = useBookPujaMutation();

  const { control, setValue, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      preferredDate: null,
      purposeOfPuja: '',
    },
  });

  const preferredDate = watch('preferredDate');

  /* ==================================================
     DAYS LIST (depends on month + year)
  ================================================== */

  const days = useMemo(() => {
    const month = parseInt(selectedMonth) || 1;
    const year = parseInt(selectedYear) || CURRENT_YEAR;
    const total = getDaysInMonth(month, year);
    return Array.from({ length: total }, (_, i) =>
      String(i + 1).padStart(2, '0'),
    );
  }, [selectedMonth, selectedYear]);

  /* ==================================================
     SYNC: form value -> chips
  ================================================== */

  useEffect(() => {
    if (!preferredDate) {
      setSelectedDay('');
      setSelectedMonth('');
      setSelectedYear('');
      return;
    }
    setSelectedDay(String(preferredDate.getDate()).padStart(2, '0'));
    setSelectedMonth(String(preferredDate.getMonth() + 1));
    setSelectedYear(String(preferredDate.getFullYear()));
  }, [preferredDate]);

  /* ==================================================
     SYNC: chips -> form value
  ================================================== */

  useEffect(() => {
    if (!selectedDay || !selectedMonth || !selectedYear) return;

    const day = parseInt(selectedDay);
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const maxDay = getDaysInMonth(month, year);

    if (day > maxDay) {
      // Clamp day if month/year changes to a shorter month
      setSelectedDay(String(maxDay).padStart(2, '0'));
      return;
    }

    const next = new Date(year, month - 1, day);

    // Only update if it actually changed
    if (
      !preferredDate ||
      next.getFullYear() !== preferredDate.getFullYear() ||
      next.getMonth() !== preferredDate.getMonth() ||
      next.getDate() !== preferredDate.getDate()
    ) {
      setValue('preferredDate', next, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedDay, selectedMonth, selectedYear, preferredDate, setValue]);

  /* ==================================================
     DROPDOWN HANDLERS
  ================================================== */

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setShowDatePicker(null);
    setTimeout(() => setShowDatePicker('month'), 200);
  };

  const handleMonthSelect = (month1Based: string) => {
    setSelectedMonth(month1Based);
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

  const isDateItemSelected = (v: string) => {
    if (showDatePicker === 'day') return selectedDay === v;
    if (showDatePicker === 'month') return selectedMonth === v;
    if (showDatePicker === 'year') return selectedYear === v;
    return false;
  };

  const handleDateItemPress = (v: string) => {
    if (showDatePicker === 'day') handleDaySelect(v);
    else if (showDatePicker === 'month') handleMonthSelect(v);
    else if (showDatePicker === 'year') handleYearSelect(v);
  };

  /* ==================================================
     FORMATTER
  ================================================== */

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

  /* ==================================================
     SUBMIT (unchanged)
  ================================================== */

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
        <AppBar title="Book Pooja" />

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
                  value: 4,
                  message: 'Enter valid number',
                },
              }}
            />

            <Controller
              control={control}
              name="preferredDate"
              rules={{ required: 'Preferred date is required' }}
              render={({ fieldState: { error } }) => (
                <View>
                  <SansText style={styles.label}>Preferred Date</SansText>

                  {/* DD / Month / YYYY dropdown row */}
                  <View style={styles.dateRow}>
                    <TouchableOpacity
                      style={[
                        styles.dateField,
                        error && styles.datePickerError,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setShowDatePicker('day')}
                    >
                      <SansText
                        style={[
                          styles.dateFieldText,
                          !selectedDay && styles.datePickerPlaceholder,
                        ]}
                      >
                        {selectedDay || 'DD'}
                      </SansText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.dateField,
                        styles.dateFieldFlexible,
                        error && styles.datePickerError,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setShowDatePicker('month')}
                    >
                      <SansText
                        style={[
                          styles.dateFieldText,
                          !selectedMonth && styles.datePickerPlaceholder,
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
                        error && styles.datePickerError,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setShowDatePicker('year')}
                    >
                      <SansText
                        style={[
                          styles.dateFieldText,
                          !selectedYear && styles.datePickerPlaceholder,
                        ]}
                      >
                        {selectedYear || 'YYYY'}
                      </SansText>
                    </TouchableOpacity>
                  </View>

                  {preferredDate && (
                    <SansText style={styles.helperText}>
                      Selected: {formatDateSafe(preferredDate)}
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

            <FormInput
              control={control}
              name="purposeOfPuja"
              label="Purpose Of Pooja"
              placeholder="Explain your purpose"
              multiline
              numberOfLines={4}
              rules={{ required: 'Purpose is required' }}
            />
            <ReusableButton
              title="Book Pooja"
              width="100%"
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </ScrollView>
        </View>

        {/* ==================================================
            DATE PICKER MODAL (Day / Month / Year)
        ================================================== */}

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
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default ConsultationForm;

/* ==================================================
   STYLES
================================================== */

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 20,
  },
  label: {
    fontSize: 14,
    color: '#0D0D0D',
    lineHeight: 26,
  },

  /* ---------- DATE ROW (DD / Month / YYYY) ---------- */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateField: {
    width: 78,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e7c555',
    backgroundColor: '#fdf5da',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  dateFieldFlexible: {
    flex: 1,
    width: undefined,
  },
  dateFieldText: {
    fontSize: 14,
    color: '#1a1a2e',
  },
  datePickerError: {
    borderColor: '#FF3B30',
  },
  datePickerPlaceholder: {
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },

  /* ---------- MODAL ---------- */
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