/* eslint-disable react-native/no-inline-styles */

import BookIcon from '@/assets/icons/visual/intent/book.svg';
import BriefcaseIcon from '@/assets/icons/visual/intent/briefcase.svg';
import HeartIcon from '@/assets/icons/visual/intent/favourite.svg';
import MarriageIcon from '@/assets/icons/visual/intent/marriage.svg';
import TieIcon from '@/assets/icons/visual/intent/tie.svg';
import WellnessIcon from '@/assets/icons/visual/intent/wellness.svg';
import ChatIcon from '@/assets/icons/actions/bubble-chat.svg';
import CallIcon from '@/assets/icons/visual/call.svg';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import SelectableOptions from '../../../../components/reusable/SelectableOptions/SelectableOptions';
import { RootState } from '../../../../redux/store';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import QuestionScreen from '../../../../components/RequestConsultationForm/QuestionScreen';
import {
  useBookConsultationMutation,
} from '../../../../redux/features/consultation/consultationApi';
import {
  useGetAllSlotsByAstrologerIdQuery,
} from '../../../../redux/features/slot/slotApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppInput from './../../../../components/reusable/InputField/AppInput';
import { SansText } from '../../../../components/reusable/Text/SansText';


const RequestConsultationForm = () => {
  const route = useRoute<any>();
  const astrologerId = route.params?.id as string;
  const navigation = useNavigation<any>();

  const step = useSelector(
    (state: RootState) => state.userDetailForm.step,
  );

  const savedMode = useSelector(
    (state: RootState) =>
      state.userDetailForm.answers?.mode,
  );

  const savedGuidance = useSelector(
    (state: RootState) =>
      state.userDetailForm.answers?.guidance,
  );

  const savedRequestMessage = useSelector(
    (state: RootState) =>
      state.userDetailForm.answers?.requestMessage,
  );

  const [bookConsultation, { isLoading }] =
    useBookConsultationMutation();

  // ==================================================
  // CONSULTATION STATE
  // ==================================================

  const [method, setMethod] = useState<string>(
    savedMode || '',
  );

  const [requestMessage, setRequestMessage] =
    useState<string>(
      savedRequestMessage || '',
    );

  // ==================================================
  // DATE STATE
  // ==================================================

  const [selectedDate, setSelectedDate] =
    useState<Date>(new Date());

  const [showDatePicker, setShowDatePicker] =
    useState<boolean>(false);

  // ==================================================
  // SLOT STATE
  // ==================================================

  const [selectedSlotId, setSelectedSlotId] =
    useState<string | null>(null);

  const [bookedSlotId, setBookedSlotId] =
    useState<string | null>(null);

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formattedDate =
    `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(
      selectedDate.getDate(),
    ).padStart(2, '0')}`;

  // ==================================================
  // GET AVAILABLE SLOTS
  //
  // API IS ONLY CALLED FOR CALL
  // ==================================================

  const {
    data,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
  } =
    useGetAllSlotsByAstrologerIdQuery(
      {
        id: astrologerId,
        date: formattedDate,
      },
      {
        skip: method !== 'call',
      },
    );

  const slots =
    data?.data?.slots || [];

  // ==================================================
  // CLEAR SLOT WHEN DATE CHANGES
  // ==================================================

  useEffect(() => {
    setSelectedSlotId(null);
    setBookedSlotId(null);
  }, [selectedDate]);

  // ==================================================
  // WHEN METHOD CHANGES
  // ==================================================

  useEffect(() => {
    if (savedMode) {
      setMethod(savedMode);
    }
  }, [savedMode]);

  // ==================================================
  // FINAL SUBMIT
  // ==================================================

  const handleFinalSubmit = async (
    formData: any,
  ) => {
    try {
      const payload: any = {
        astrologer: astrologerId,

        method: formData.mode,

        consultationFor:
          formData.guidance,

        /*
         * Reason/message behind consultation
         */
        requestMessage:
          formData.requestMessage || '',
      };

      // ==================================================
      // CALL ONLY:
      // ADD SLOT INFORMATION
      // ==================================================

      if (
        formData.mode === 'call'
      ) {
        if (!selectedSlotId) {
          Alert.alert(
            'Select a slot',
            'Please select an available time slot.',
          );

          return;
        }

        if (!bookedSlotId) {
          Alert.alert(
            'Slot unavailable',
            'The selected slot is no longer available.',
          );

          return;
        }

        payload.bookedSlotId =
          selectedSlotId;

        payload.slotId =
          bookedSlotId;
      }

      console.log(
        'BOOK CONSULTATION PAYLOAD:',
        payload,
      );

      const response =
        await bookConsultation(
          payload,
        ).unwrap();

      console.log(
        'BOOK CONSULTATION RESPONSE:',
        response,
      );

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
      console.log(
        'Booking Failed:',
        error,
      );

      Alert.alert(
        'Error',
        error?.data?.message ||
        'Something went wrong while booking the consultation.',
      );
    }
  };

  // ==================================================
  // QUESTIONS
  // ==================================================

  const questions = [

    // ==================================================
    // STEP 1
    // ==================================================

    {
      key: 'mode',

      initialValue: savedMode || '',

      text: 'Consult astrologer',

      description:
        'This helps us generate more accurate insights.',

      render: ({
        value,
        setValue,
      }: any) => (
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
            onChange={(
              newValue: string,
            ) => {
              setMethod(newValue);

              setValue(newValue);

              /*
               * If user changes from CALL to CHAT,
               * remove any previously selected slot.
               */
              if (
                newValue !== 'call'
              ) {
                setSelectedSlotId(
                  null,
                );

                setBookedSlotId(
                  null,
                );
              }
            }}
          />
        </View>
      ),

      validate: (
        value: string,
      ) => !!value,
    },

    // ==================================================
    // STEP 2
    // ==================================================

    {
      key: 'guidance',

      initialValue:
        savedGuidance || [],

      text:
        'What would you like guidance on?',

      description:
        'Select your primary focus areas.',

      render: ({
        value,
        setValue,
      }: any) => (
        <View
          style={{
            marginTop: 24,
          }}
        >
          <SelectableOptions
            options={[
              {
                label:
                  'Wealth & Finance',
                value:
                  'Wealth & Finance',
                icon: TieIcon,
              },

              {
                label:
                  'Education',
                value:
                  'Education',
                icon: BookIcon,
              },

              {
                label:
                  'Marriage',
                value:
                  'marriage',
                icon:
                  MarriageIcon,
              },

              {
                label:
                  'Health & Wellness',
                value:
                  'Health & Wellness',
                icon:
                  WellnessIcon,
              },

              {
                label:
                  'Career Growth',
                value:
                  'Career Growth',
                icon:
                  BriefcaseIcon,
              },

              {
                label:
                  'Love & Relationship',
                value:
                  'Love & Relationship',
                icon:
                  HeartIcon,
              },
            ]}
            value={value}
            onChange={
              setValue
            }
          />
        </View>
      ),

      validate: (
        value: any,
      ) =>
        Array.isArray(value)
          ? value.length > 0
          : !!value,
    },

    // ==================================================
    // STEP 3
    // ==================================================

    {
      key: 'requestMessage',

      initialValue:
        savedRequestMessage || '',

      text:
        'Tell us more about your consultation',

      description:
        'Share the reason or question you would like guidance on.',

      render: ({
        value,
        setValue,
      }: any) => (
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
            placeholder="Tell the astrologer what you would like to discuss or get guidance on."
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
                  color: "#0D0D0D",
                  lineHeight: 26,

                }}
              >
                Select Date
              </SansText>

              <Pressable
                onPress={() =>
                  setShowDatePicker(
                    true,
                  )
                }
                style={{
                  paddingVertical: 14,
                  marginBottom: 20,
                  borderRadius: 10,
                  borderWidth: 1.2,
                  borderColor: "#e7c555",
                  backgroundColor: "#fdf5da",
                  flex: 1,
                  paddingHorizontal: 16,

                }}
              >
                <SansText
                  style={{
                    fontSize: 15,
                    color: '#222',
                  }}
                >
                  {selectedDate.toLocaleDateString(
                    'en-IN',
                    {
                      weekday:
                        'short',
                      day: '2-digit',
                      month:
                        'short',
                      year:
                        'numeric',
                    },
                  )}
                </SansText>
              </Pressable>

              {/* ==============================
                  NATIVE CALENDAR
              ============================== */}

              {showDatePicker && (
                <DateTimePicker
                  value={
                    selectedDate
                  }
                  mode="date"
                  display="calendar"
                  minimumDate={
                    new Date()
                  }
                  onChange={(
                    event,
                    date,
                  ) => {
                    setShowDatePicker(
                      false,
                    );

                    if (
                      date &&
                      event.type !==
                      'dismissed'
                    ) {
                      setSelectedDate(
                        date,
                      );
                    }
                  }}
                />
              )}

              {/* ==============================
                  AVAILABLE SLOTS
              ============================== */}

              <View
                style={{
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                  marginBottom: 12,
                }}
              >
                <SansText
                  style={{
                    fontSize: 15,
                    color:
                      '#222',
                  }}
                >
                  Available Slots
                </SansText>

                <SansText
                  style={{
                    fontSize: 13,
                    color:
                      '#777',
                  }}
                >
                  {selectedDate.toLocaleDateString(
                    'en-IN',
                    {
                      weekday:
                        'short',
                      day: '2-digit',
                      month:
                        'short',
                    },
                  )}
                </SansText>
              </View>

              {/* ==============================
                  SLOT LOADING
              ============================== */}

              {(
                isSlotsLoading ||
                isSlotsFetching
              ) && (
                  <SansText
                    style={{
                      fontSize: 14,
                      color:
                        '#777',
                      marginBottom:
                        12,
                    }}
                  >
                    Loading available
                    slots...
                  </SansText>
                )}

              {/* ==============================
                  NO SLOTS
              ============================== */}

              {!isSlotsLoading &&
                !isSlotsFetching &&
                slots.length ===
                0 && (
                  <View
                    style={{
                      paddingVertical:
                        20,
                    }}
                  >
                    <SansText
                      style={{
                        fontSize:
                          14,
                        color:
                          '#777',
                        textAlign:
                          'center',
                      }}
                    >
                      No slots are
                      available
                      for this
                      date.
                    </SansText>
                  </View>
                )}

              {/* ==============================
                  SLOT LIST
              ============================== */}

              {slots.map(
                (
                  slot: any,
                ) => {
                  const isSelected =
                    selectedSlotId ===
                    slot?._id;

                  return (
                    <Pressable
                      key={
                        slot?._id
                      }
                      disabled={slot.isBooked}
                      onPress={() => {
                        setSelectedSlotId(slot?._id ?? null);

                        setBookedSlotId(
                          data?.data?._id ?? null,
                        );
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: isSelected
                          ? '#e7c555'
                          : slot.isBooked
                            ? '#D1D1D1'
                            : '#E5E5E5',

                        backgroundColor: isSelected
                          ? '#fdf5da'
                          : slot.isBooked
                            ? '#F5F5F5'
                            : '#FFF',
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
                        {slot?.startTime ||
                          slot?.start || slot?.from}{' '}
                        -{' '}
                        {slot?.endTime || slot?.end || slot?.to}
                      </SansText>
                    </Pressable>
                  );
                },
              )}
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
      validate: (
        value: string,
      ) => {
        const hasReason =
          !!value &&
          value.trim().length >
          0;

        if (!hasReason) {
          return false;
        }

        if (
          method === 'call'
        ) {
          return !!selectedSlotId;
        }

        return true;
      },
    },
  ];

  // ==================================================
  // CURRENT QUESTION
  // ==================================================

  const currentQuestion =
    questions[step];

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
          key={
            currentQuestion.key
          }
          questionKey={
            currentQuestion.key
          }
          questionDescription={
            currentQuestion.description
          }
          questionText={
            currentQuestion.text
          }
          validate={
            currentQuestion.validate
          }
          initialValue={
            currentQuestion.initialValue
          }
          onFinalSubmit={
            handleFinalSubmit
          }
          loading={
            isLoading
          }
        >
          {currentQuestion.render}
        </QuestionScreen>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default RequestConsultationForm;