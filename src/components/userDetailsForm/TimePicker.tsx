// components/TimePicker.tsx

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, FlatList, Pressable } from 'react-native';
import { SansText } from '../reusable/Text/SansText';
import { SatoshiText } from '../reusable/Text/SatoshiText';

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

const TimePicker = ({ value, setValue }: any) => {
  const [showTimePicker, setShowTimePicker] = useState<TimePickerType>(null);

  const hoursVal = value?.hours || '';
  const minutesVal = value?.minutes || '';
  const periodVal = value?.period || '';

  const update = (key: string, val: string) => {
    setValue({
      ...value,
      [key]: val,
    });
  };

  const handleHourSelect = (hour: string) => {
    update('hours', hour);
    setShowTimePicker(null);
    setTimeout(() => {
      setShowTimePicker('minute');
    }, 300);
  };

  const handleMinuteSelect = (minute: string) => {
    update('minutes', minute);
    setShowTimePicker(null);
    setTimeout(() => {
      setShowTimePicker('period');
    }, 300);
  };

  const handlePeriodSelect = (period: string) => {
    update('period', period);
    setShowTimePicker(null);
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
    <View>
      <View style={styles.container}>
        {/* HOUR */}
        <TouchableOpacity
          style={styles.timeField}
          activeOpacity={0.8}
          onPress={() => setShowTimePicker('hour')}
        >
          <SansText
            style={[
              styles.timeFieldText,
              !hoursVal && styles.timeFieldPlaceholder,
            ]}
          >
            {hoursVal || 'HH'}
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
              !minutesVal && styles.timeFieldPlaceholder,
            ]}
          >
            {minutesVal || 'MM'}
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
              styles.periodText,
              !periodVal && styles.timeFieldPlaceholder,
            ]}
          >
            {periodVal || 'AM'}
          </SansText>
        </TouchableOpacity>
      </View>

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
                  (showTimePicker === 'hour' && hoursVal === item) ||
                  (showTimePicker === 'minute' && minutesVal === item) ||
                  (showTimePicker === 'period' && periodVal === item);

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

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
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
    width: 70, // Changed from flex: 1 to fixed width
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
  periodText: {
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