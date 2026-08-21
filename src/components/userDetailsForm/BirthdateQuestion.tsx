/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SansText } from '../reusable/Text/SansText';

/**
 * Validate real date
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
 * Convert DD/MM/YYYY to Date object
 */
const parseDate = (dateStr: string) => {
  if (!dateStr || !isValidDate(dateStr)) return null;
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
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

/**
 * Format date for display (DD/MM/YYYY)
 */
const formatDateForDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  return dateStr; // Already in DD/MM/YYYY format
};

const BirthdateQuestion = ({ value, setValue, error }: any) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // For Android, close picker
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        setValue(formatDateToString(selectedDate));
      }
    } else {
      // iOS
      if (selectedDate) {
        setValue(formatDateToString(selectedDate));
      }
      setShowPicker(false);
    }
  };

  return (
    <View style={{ marginTop: 24 }}>
      <SansText style={styles.label}>Date of Birth</SansText>
      <TouchableOpacity
        style={[
          styles.datePickerButton,
          error && styles.datePickerError,
        ]}
        onPress={() => setShowPicker(true)}
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
          {error}
        </SansText>
      )}

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={parseDate(value) || new Date()}
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
  label: {
    fontSize: 14,
    color: '#0D0D0D',
    lineHeight: 26,
    marginBottom: 4,
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
});

export default BirthdateQuestion;