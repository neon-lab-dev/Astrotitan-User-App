/* eslint-disable react-native/no-inline-styles */

import BookIcon from '@/assets/icons/visual/intent/book.svg';
import BriefcaseIcon from '@/assets/icons/visual/intent/briefcase.svg';
import HeartIcon from '@/assets/icons/visual/intent/favourite.svg';
import MarriageIcon from '@/assets/icons/visual/intent/marriage.svg';
import TieIcon from '@/assets/icons/visual/intent/tie.svg';
import WellnessIcon from '@/assets/icons/visual/intent/wellness.svg';
import ChatIcon from '@/assets/icons/actions/bubble-chat.svg';
import CallIcon from '@/assets/icons/visual/call.svg';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import SelectableOptions from '../../../../components/reusable/SelectableOptions/SelectableOptions';
import { RootState } from '../../../../redux/store';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import QuestionScreen from '../../../../components/RequestConsultationForm/QuestionScreen';
import { useBookConsultationMutation } from '../../../../redux/features/consultation/consultationApi';
import { useGetAllSlotsByAstrologerIdQuery } from '../../../../redux/features/slot/slotApi';
import AppInput from './../../../../components/reusable/InputField/AppInput';
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

// Newest first — natural scroll for date pickers
const YEARS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i),
);

/** Number of days in a given (1-based) month + year */
const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();

type DatePickerType = 'day' | 'month' | 'year' | null;

const RequestConsultationForm = () => {
  const route = useRoute<any>();
  const astrologerId = route.params?.id as string;
  const navigation = useNavigation<any>();

  const step = useSelector((state: RootState) => state.userDetailForm.step);

  const savedMode = useSelector(
    (state: RootState) => state.userDetailForm.answers?.mode,
  );

  const savedGuidance = useSelector(
    (state: RootState) => state.userDetailForm.answers?.guidance,
  );

  const savedRequestMessage = useSelector(
    (state: RootState) => state.userDetailForm.answers?.requestMessage,
  );

  const [bookConsultation, { isLoading }] = useBookConsultationMutation();

  // CONSULTATION STATE

  const [method, setMethod] = useState<string>(savedMode || '');

  const [requestMessage, setRequestMessage] = useState<string>(
    savedRequestMessage || '',
  );

  // DATE STATE

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // DROPDOWN PICKER STATE (replaces native DateTimePicker)
  const [showDatePicker, setShowDatePicker] = useState<DatePickerType>(null);

  // DD / MM / YYYY chip state (mirrors `selectedDate`)
  const [selectedDay, setSelectedDay] = useState<string>(
    String(new Date().getDate()).padStart(2, '0'),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    String(new Date().getFullYear()),
  );

  // SLOT STATE

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [bookedSlotId, setBookedSlotId] = useState<string | null>(null);

  // FORMAT DATE

  const formattedDate = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1,
  ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  // GET AVAILABLE SLOTS

  const {
    data,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
  } = useGetAllSlotsByAstrologerIdQuery(
    {
      id: astrologerId,
      date: formattedDate,
    },
    {
      skip: method !== 'call',
    },
  );

  const slots = data?.data?.slots || [];

  // CLEAR SLOT WHEN DATE CHANGES

  useEffect(() => {
    setSelectedSlotId(null);
    setBookedSlotId(null);
  }, [selectedDate]);

  // WHEN METHOD CHANGES

  useEffect(() => {
    if (savedMode) {
      setMethod(savedMode);
    }
  }, [savedMode]);

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
     SYNC: selectedDate -> chips
  ================================================== */

  useEffect(() => {
    setSelectedDay(String(selectedDate.getDate()).padStart(2, '0'));
    setSelectedMonth(String(selectedDate.getMonth() + 1));
    setSelectedYear(String(selectedDate.getFullYear()));
  }, [selectedDate]);

  /* ==================================================
     SYNC: chips -> selectedDate
  ================================================== */

  useEffect(() => {
    if (!selectedDay || !selectedMonth || !selectedYear) return;

    const day = parseInt(selectedDay);
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const maxDay = getDaysInMonth(month, year);

    if (day > maxDay) {
      // Clamp if month/year changed to something shorter (e.g. 31 -> Feb)
      setSelectedDay(String(maxDay).padStart(2, '0'));
      return;
    }

    const next = new Date(year, month - 1, day);

    // Only update if the date actually changed, to avoid re-triggering
    if (
      next.getFullYear() !== selectedDate.getFullYear() ||
      next.getMonth() !== selectedDate.getMonth() ||
      next.getDate() !== selectedDate.getDate()
    ) {
      setSelectedDate(next);
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  /* ==================================================
     DATE DROPDOWN HANDLERS
  ================================================== */

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

  /* ==================================================
     FINAL SUBMIT
  ================================================== */

  const handleFinalSubmit = async (formData: any) => {
    try {
      const payload: any = {
        astrologer: astrologerId,
        method: formData.mode,
        consultationFor: formData.guidance,
        requestMessage: formData.requestMessage || '',
      };

      if (formData.mode === 'call') {
        if (!selectedSlotId) {
          Alert.alert('Select a slot', 'Please select an available time slot.');

          return;
        }

        if (!bookedSlotId) {
          Alert.alert(
            'Slot unavailable',
            'The selected slot is no longer available.',
          );

          return;
        }

        payload.bookedSlotId = selectedSlotId;

        payload.slotId = bookedSlotId;
      }

      console.log('BOOK CONSULTATION PAYLOAD:', payload);

      const response = await bookConsultation(payload).unwrap();

      console.log('BOOK CONSULTATION RESPONSE:', response);

      navigation.reset({
        index: 1,

        routes: [
          {
            name: 'AstrologerScreen',
          },
          {
            name: 'RequestedFormCompleted',
          },
        ],
      });
    } catch (error: any) {
      console.log('Booking Failed:', error);

      Alert.alert(
        'Error',
        error?.data?.message ||
          'Something went wrong while booking the consultation.',
      );
    }
  };

  // QUESTIONS
  const questions = [
    // ==================================================
    // STEP 1
    // ==================================================

    {
      key: 'mode',
      initialValue: savedMode || '',
      text: 'Consult Astrologer',
      description: 'This helps us generate more accurate insights.',

      render: ({ value, setValue }: any) => (
        <View
          style={{
            marginTop: 24,
          }}
        >
          <SelectableOptions
            options={[
              {
                label: 'Call',
                value: 'call',
                icon: CallIcon,
              },
              {
                label: 'Chat',
                value: 'chat',
                icon: ChatIcon,
              },
            ]}
            value={value}
            onChange={(newValue: string) => {
              setMethod(newValue);

              setValue(newValue);

              /*
               * If user changes from CALL to CHAT,
               * remove any previously selected slot.
               */
              if (newValue !== 'call') {
                setSelectedSlotId(null);

                setBookedSlotId(null);
              }
            }}
          />
        </View>
      ),

      validate: (value: string) => !!value,
    },

    // ==================================================
    // STEP 2
    // ==================================================

    {
      key: 'guidance',

      initialValue: savedGuidance || [],

      text: 'What would you like guidance on?',

      description: 'Select your primary focus areas.',

      render: ({ value, setValue }: any) => (
        <View
          style={{
            marginTop: 24,
          }}
        >
          <SelectableOptions
            options={[
              {
                label: 'Wealth & Finance',
                value: 'Wealth & Finance',
                icon: TieIcon,
              },

              {
                label: 'Education',
                value: 'Education',
                icon: BookIcon,
              },

              {
                label: 'Marriage',
                value: 'marriage',
                icon: MarriageIcon,
              },

              {
                label: 'Health & Wellness',
                value: 'Health & Wellness',
                icon: WellnessIcon,
              },

              {
                label: 'Career Growth',
                value: 'Career Growth',
                icon: BriefcaseIcon,
              },

              {
                label: 'Love & Relationship',
                value: 'Love & Relationship',
                icon: HeartIcon,
              },
            ]}
            value={value}
            onChange={setValue}
          />
        </View>
      ),

      validate: (value: any) =>
        Array.isArray(value) ? value.length > 0 : !!value,
    },

    // ==================================================
    // STEP 3
    // ==================================================

    {
      key: 'requestMessage',

      initialValue: savedRequestMessage || '',

      text: 'Tell us more about your consultation',

      description: 'Share the reason or question you would like guidance on.',

      render: ({ value, setValue }: any) => (
        <View
          style={{
            marginTop: 24,
          }}
        >
          <AppInput
            label="Share your concern"
            value={typeof value === 'string' ? value : ''}
            onChangeText={(text: string) => {
              setValue(text);
              setRequestMessage(text);
            }}
            placeholder="Tell the astrologer about your concern."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            style={{
              height: 100,
              textAlignVertical: 'top',
            }}
          />

          {/* ==================================================
              CALL ONLY
              DATE + SLOT
          ================================================== */}

          {method === 'call' && (
            <>
              {/* ==============================
                  DATE
              ============================== */}

              <SansText
                style={{
                  marginBottom: 10,
                  marginTop: 10,

                  fontSize: 14,
                  color: '#0D0D0D',
                  lineHeight: 26,
                }}
              >
                Select Date
              </SansText>

              {/* DD / Month / YYYY dropdown row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowDatePicker('day')}
                  activeOpacity={0.8}
                  style={{
                    width: 78,
                    height: 52,
                    borderRadius: 10,
                    borderWidth: 1.2,
                    borderColor: '#e7c555',
                    backgroundColor: '#fdf5da',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 6,
                  }}
                >
                  <SansText
                    style={{
                      fontSize: 15,
                      color: '#222',
                    }}
                  >
                    {selectedDay || 'DD'}
                  </SansText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDatePicker('month')}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 10,
                    borderWidth: 1.2,
                    borderColor: '#e7c555',
                    backgroundColor: '#fdf5da',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 6,
                  }}
                >
                  <SansText
                    style={{
                      fontSize: 15,
                      color: '#222',
                    }}
                    numberOfLines={1}
                  >
                    {selectedMonth
                      ? MONTHS[parseInt(selectedMonth) - 1]
                      : 'Month'}
                  </SansText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDatePicker('year')}
                  activeOpacity={0.8}
                  style={{
                    width: 78,
                    height: 52,
                    borderRadius: 10,
                    borderWidth: 1.2,
                    borderColor: '#e7c555',
                    backgroundColor: '#fdf5da',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 6,
                  }}
                >
                  <SansText
                    style={{
                      fontSize: 15,
                      color: '#222',
                    }}
                  >
                    {selectedYear || 'YYYY'}
                  </SansText>
                </TouchableOpacity>
              </View>

              {/* ==============================
                  AVAILABLE SLOTS
              ============================== */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <SansText
                  style={{
                    fontSize: 15,
                    color: '#222',
                  }}
                >
                  Available Slots
                </SansText>

                <SansText
                  style={{
                    fontSize: 13,
                    color: '#777',
                  }}
                >
                  {selectedDate.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                  })}
                </SansText>
              </View>

              {/* ==============================
                  SLOT LOADING
              ============================== */}

              {(isSlotsLoading || isSlotsFetching) && (
                <SansText
                  style={{
                    fontSize: 14,
                    color: '#777',
                    marginBottom: 12,
                  }}
                >
                  Loading available slots...
                </SansText>
              )}

              {/* ==============================
                  NO SLOTS
              ============================== */}

              {!isSlotsLoading && !isSlotsFetching && slots.length === 0 && (
                <View
                  style={{
                    paddingVertical: 20,
                  }}
                >
                  <SansText
                    style={{
                      fontSize: 14,
                      color: '#777',
                      textAlign: 'center',
                    }}
                  >
                    No slots are available for this date.
                  </SansText>
                </View>
              )}

              {/* ==============================
                  SLOT LIST
              ============================== */}

              {slots
                ?.filter((slot: any) => !slot.isBooked)
                .map((slot: any) => {
                  const isSelected = selectedSlotId === slot?._id;

                  return (
                    <TouchableOpacity
                      key={slot?._id}
                      onPress={() => {
                        setSelectedSlotId(slot?._id ?? null);
                        setBookedSlotId(data?.data?._id ?? null);
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: isSelected ? '#e7c555' : '#E5E5E5',
                        backgroundColor: isSelected ? '#fdf5da' : '#FFF',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 15,
                        marginBottom: 10,
                      }}
                    >
                      <SansText
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#222',
                        }}
                      >
                        {slot?.startTime || slot?.start || slot?.from} -{' '}
                        {slot?.endTime || slot?.end || slot?.to}
                      </SansText>
                    </TouchableOpacity>
                  );
                })}
            </>
          )}
        </View>
      ),

      /*
       * Step 3 is always valid when there is a reason.
       *
       * For CALL:
       * reason + slot required.
       *
       * For CHAT:
       * only reason required.
       */
      validate: (value: string) => {
        const hasReason = !!value && value.trim().length > 0;

        if (!hasReason) {
          return false;
        }

        if (method === 'call') {
          return !!selectedSlotId;
        }

        return true;
      },
    },
  ];

  const currentQuestion = questions[step];

  if (!currentQuestion) {
    return null;
  }

  // ==================================================
  // SCREEN
  // ==================================================

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <QuestionScreen
          key={currentQuestion.key}
          questionKey={currentQuestion.key}
          questionDescription={currentQuestion.description}
          questionText={currentQuestion.text}
          validate={currentQuestion.validate}
          initialValue={currentQuestion.initialValue}
          onFinalSubmit={handleFinalSubmit}
          loading={isLoading}
        >
          {currentQuestion.render}
        </QuestionScreen>

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
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.45)',
              justifyContent: 'flex-end',
            }}
            onPress={() => setShowDatePicker(null)}
          >
            <Pressable
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: '65%',
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 30,
              }}
              onPress={e => e.stopPropagation()}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <SatoshiText
                  style={{
                    fontSize: 18,
                    fontFamily: 'Satoshi-Bold',
                    color: '#1a1a2e',
                  }}
                >
                  {getDatePickerTitle()}
                </SatoshiText>

                <TouchableOpacity onPress={() => setShowDatePicker(null)}>
                  <SansText
                    style={{
                      fontSize: 14,
                      color: '#D4AF37',
                      fontFamily: 'Satoshi-Medium',
                    }}
                  >
                    Close
                  </SansText>
                </TouchableOpacity>
              </View>

              <FlatList
                data={getDatePickerData()}
                keyExtractor={item => item.value}
                numColumns={showDatePicker === 'month' ? 2 : 3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => {
                  const isSelected = isDateItemSelected(item.value);

                  return (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 50,
                        margin: 5,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: isSelected ? '#D4AF37' : '#E5E5E5',
                        backgroundColor: isSelected
                          ? 'rgba(212, 175, 55, 0.12)'
                          : '#FFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 6,
                      }}
                      onPress={() => handleDateItemPress(item.value)}
                    >
                      <SansText
                        style={{
                          fontSize: 16,
                          color: isSelected ? '#D4AF37' : '#1a1a2e',
                          fontFamily: isSelected
                            ? 'Satoshi-Bold'
                            : 'Satoshi-Medium',
                        }}
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

export default RequestConsultationForm;