/* eslint-disable react-native/no-inline-styles */

import React, {
  useEffect,
  useState,
} from 'react';

import {
  BackHandler,
  ScrollView,
  View,
} from 'react-native';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import AuthTitle from '../auth/AuthTitle';
import AppHeader from '../reusable/AppHeader/AppHeader';
import ReusableButton from '../reusable/ReusableButton/ReusableButton';
import { SansText } from '../reusable/Text/SansText';

import {
  RootState,
  store,
} from '../../redux/store';

import StepHeader from '../userDetailsForm/StepHeader';

import {
  nextStep,
  prevStep,
  setAnswer,
} from '../../redux/features/RequestConsultationForm/RequestConsultationFormSlice';


interface Props {
  questionKey: string;

  questionText: string;

  questionDescription: string;

  validate?: (
    value: any,
  ) => boolean;

  initialValue?: any;

  onFinalSubmit?: (
    data: any,
  ) => void;

  children: (props: {
    value: any;

    setValue: (
      val: any,
    ) => void;
  }) => React.ReactNode;

  loading: boolean;
}


const QuestionScreen: React.FC<Props> = ({
  questionKey,

  questionText,

  questionDescription,

  children,

  validate,

  initialValue,

  onFinalSubmit,

  loading = false,
}) => {

  const navigation =
    useNavigation<any>();

  const dispatch =
    useDispatch();

  // ==================================================
  // SAME REDUX SLICE AS REQUEST CONSULTATION SCREEN
  // ==================================================

  const savedValue =
    useSelector(
      (
        state: RootState,
      ) =>
        state.userDetailForm
          .answers[
            questionKey
          ],
    );

  const step =
    useSelector(
      (
        state: RootState,
      ) =>
        state.userDetailForm
          .step,
    );

  /*
   * There are ALWAYS 3 steps:
   *
   * 0 = method
   * 1 = guidance
   * 2 = reason + date + slot
   */
  const totalSteps = 3;

  // ==================================================
  // LOCAL VALUE
  // ==================================================

  const [
    value,
    setValue,
  ] = useState<any>(
    savedValue ??
      initialValue,
  );

  // ==================================================
  // SYNC REDUX VALUE
  // ==================================================

  useEffect(() => {

    if (
      savedValue !==
      undefined
    ) {
      setValue(
        savedValue,
      );
    } else {
      setValue(
        initialValue,
      );
    }

  }, [
    savedValue,
    initialValue,
  ]);

  // ==================================================
  // VALIDATION
  // ==================================================

  const isValid =
    validate
      ? validate(value)
      : true;

  // ==================================================
  // NEXT
  // ==================================================

  const handleNext =
    () => {

      /*
       * First save current answer.
       */
      dispatch(
        setAnswer({
          key:
            questionKey,

          value,
        }),
      );

      /*
       * STEP 3
       *
       * step = 2
       *
       * This is the LAST step.
       */
      if (
        step ===
        totalSteps - 1
      ) {

        /*
         * Read the latest Redux
         * state AFTER including
         * current answer.
         */
        const currentAnswers =
          store.getState()
            .userDetailForm
            .answers;

        const finalData = {
          ...currentAnswers,

          [questionKey]:
            value,
        };

        console.log(
          'FINAL FORM DATA:',
          finalData,
        );

        /*
         * ONLY HERE do we submit.
         */
        onFinalSubmit?.(
          finalData,
        );

        return;
      }

      /*
       * Step 1 -> Step 2
       *
       * Step 2 -> Step 3
       */
      dispatch(
        nextStep(),
      );
    };

  // ==================================================
  // HARDWARE BACK
  // ==================================================

  useFocusEffect(
    React.useCallback(
      () => {

        const onBackPress =
          () => {

            if (
              step > 0
            ) {

              dispatch(
                setAnswer({
                  key:
                    questionKey,

                  value,
                }),
              );

              dispatch(
                prevStep(),
              );

              return true;
            }

            return false;
          };

        const subscription =
          BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress,
          );

        return () =>
          subscription.remove();

      },
      [
        step,
        value,
        dispatch,
        questionKey,
      ],
    ),
  );

  // ==================================================
  // HEADER BACK
  // ==================================================

  const handleBack =
    () => {

      dispatch(
        setAnswer({
          key:
            questionKey,

          value,
        }),
      );

      if (
        step === 0
      ) {

        navigation.goBack();

        return;
      }

      dispatch(
        prevStep(),
      );
    };

  // ==================================================
  // UI
  // ==================================================

  return (
    <View
      style={{
        flex: 1,
      }}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <AppHeader
        onPressBack={
          handleBack
        }
        showBack
      >

        <StepHeader
          step={step}
          total={totalSteps}
        />

        <AuthTitle
          title={
            questionText
          }
        >
          <SansText
            style={{
              fontSize: 16,
            }}
          >
            {
              questionDescription
            }
          </SansText>
        </AuthTitle>

      </AppHeader>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <View
        style={{
          flex: 1,
        }}
      >

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >

          {children({
            value,
            setValue,
          })}

        </ScrollView>

      </View>

      {/* ==================================================
          CONTINUE BUTTON
      ================================================== */}

      {isValid && (
        <View
          style={{
            padding: 16,

            backgroundColor:
              '#FBF7EB',

            borderTopRightRadius:
              12,

            borderTopLeftRadius:
              12,
          }}
        >

          <ReusableButton
            title={
              step ===
              totalSteps - 1
                ? 'Book Appointment'
                : 'Continue'
            }
            variant="solid"
            onPress={
              handleNext
            }
            loading={
              loading
            }
          />

        </View>
      )}

    </View>
  );
};

export default QuestionScreen;