/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SansText } from '../reusable/Text/SansText';
import { SatoshiText } from '../reusable/Text/SatoshiText';

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

/* ================= VALIDATION / PARSE ================= */

/**
 * Validate real date (DD/MM/YYYY)
 */
const isValidDate = (date: string) => {
  if (!date) return false;

  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  if (!regex.test(date)) return false;

  const [day, month, year] = date.split('/').map(Number);
  const d = new Date(year, month - 1, day);

  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
};

/**
 * Convert Date object to DD/MM/YYYY
 */
const formatDateToString = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/* ================= TYPES ================= */

type DatePickerType = 'day' | 'month' | 'year' | null;

/* ================= COMPONENT ================= */

const BirthdateQuestion = ({ value, setValue, error }: any) => {
  const [showDatePicker, setShowDatePicker] = useState<DatePickerType>(null);

  /* ---------- LOCAL STATE (DD / MM / YYYY as strings) ---------- */
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // "1".."12"
  const [selectedYear, setSelectedYear] = useState('');

  /* ---------- DAYS LIST (depends on month + year) ---------- */
  const days = useMemo(() => {
    const month = parseInt(selectedMonth) || 1;
    const year = parseInt(selectedYear) || CURRENT_YEAR;
    const total = getDaysInMonth(month, year);
    return Array.from({ length: total }, (_, i) =>
      String(i + 1).padStart(2, '0'),
    );
  }, [selectedMonth, selectedYear]);

  /* ---------- SYNC: incoming `value` (DD/MM/YYYY) -> local state ---------- */
  useEffect(() => {
    if (!value) {
      // Clear local state if parent cleared the value
      setSelectedDay('');
      setSelectedMonth('');
      setSelectedYear('');
      return;
    }
    if (!isValidDate(value)) return;
    const [dd, mm, yyyy] = value.split('/');
    setSelectedDay(dd);
    setSelectedMonth(String(parseInt(mm))); // strip leading zero -> "1".."12"
    setSelectedYear(yyyy);
  }, [value]);

  /* ---------- SYNC: local state -> outgoing `setValue` (DD/MM/YYYY) ---------- */
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

    const date = new Date(year, month - 1, day);
    const formatted = formatDateToString(date);

    // Only fire when the string actually changed to avoid feedback loops
    if (formatted !== value) {
      setValue(formatted);
    }
  }, [selectedDay, selectedMonth, selectedYear, setValue, value]);

  /* ---------- HANDLERS ---------- */
  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setShowDatePicker(null);
    // Auto-advance to Month
    setTimeout(() => setShowDatePicker('month'), 200);
  };

  const handleMonthSelect = (month1Based: string) => {
    setSelectedMonth(month1Based);
    setShowDatePicker(null);
    // Auto-advance to Year
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

  /* ---------- DISPLAY HELPERS ---------- */
  const monthLabel = selectedMonth
    ? MONTHS[parseInt(selectedMonth) - 1]
    : '';

  return (
    <View style={{ marginTop: 24 }}>
      <SansText style={styles.label}>Date of Birth</SansText>

      {/* DD / Month / YYYY */}
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[styles.dateField, error && styles.datePickerError]}
          onPress={() => setShowDatePicker('day')}
          activeOpacity={0.8}
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
          onPress={() => setShowDatePicker('month')}
          activeOpacity={0.8}
        >
          <SansText
            style={[
              styles.dateFieldText,
              !selectedMonth && styles.datePickerPlaceholder,
            ]}
            numberOfLines={1}
          >
            {monthLabel || 'Month'}
          </SansText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateField, error && styles.datePickerError]}
          onPress={() => setShowDatePicker('year')}
          activeOpacity={0.8}
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

      {error && <SansText style={styles.errorText}>{error}</SansText>}

      {/* ---------- DATE PICKER MODAL ---------- */}
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
    </View>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#0D0D0D',
    lineHeight: 26,
    marginBottom: 4,
  },

  /* ---------- DATE ROW ---------- */
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
  dateFieldText: {
    fontSize: 14,
    color: '#1a1a2e',
  },
  datePickerPlaceholder: {
    color: '#999',
  },
  datePickerError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
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

export default BirthdateQuestion;