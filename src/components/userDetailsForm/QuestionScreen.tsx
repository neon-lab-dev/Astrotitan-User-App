/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {
  BackHandler,
  ScrollView,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import AppHeader from '../reusable/AppHeader/AppHeader';
import ReusableButton from '../reusable/ReusableButton/ReusableButton';

import {RootState, store} from '../../redux/store';

import {
  nextStep,
  prevStep,
  setAnswer,
} from '../../redux/features/userDetailsForm/userDetailsDormSlice';

interface Props {
  questionKey: string;
  questionText: string;
  questionDescription: string;

  validate?: (value: any) => boolean;

  initialValue?: string | object | null;

  onFinalSubmit?: (data: any) => void;

  loading?: boolean;

  children: (props: {
    value: string;
    setValue: (val: string) => void;
  }) => React.ReactNode;
}

const QuestionScreen: React.FC<Props> = ({
  questionKey,
  questionText,
  questionDescription,
  children,
  validate,
  initialValue,
  loading,
  onFinalSubmit,
}) => {
  const dispatch = useDispatch();

  // Get Android/iOS safe-area dimensions
  const insets = useSafeAreaInsets();

  const savedValue = useSelector(
    (state: RootState) =>
      state.userDetailForm.answers[questionKey],
  );

  const step = useSelector(
    (state: RootState) =>
      state.userDetailForm.step,
  );

  const totalSteps = 6;

  const [value, setValue] = useState(
    savedValue ?? initialValue,
  );

  const isValid = validate
    ? validate(value)
    : true;

  /**
   * Handle Continue / Submit
   */
  const handleNext = () => {
    dispatch(
      setAnswer({
        key: questionKey,
        value,
      }),
    );

    // Last step
    if (step === totalSteps - 1) {
      const finalData = {
        ...store.getState().userDetailForm.answers,
        [questionKey]: value,
      };

      onFinalSubmit?.(finalData);

      return;
    }

    dispatch(nextStep());
  };

  /**
   * Handle Android hardware back button
   */
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (step > 0) {
          dispatch(
            setAnswer({
              key: questionKey,
              value,
            }),
          );

          dispatch(prevStep());

          return true;
        }

        return false;
      };

      const subscription =
        BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress,
        );

      return () => subscription.remove();
    }, [
      step,
      value,
      dispatch,
      questionKey,
    ]),
  );

  /**
   * Handle AppHeader back button
   */
  const handleBack = () => {
    dispatch(
      setAnswer({
        key: questionKey,
        value,
      }),
    );

    if (step > 0) {
      dispatch(prevStep());
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FBF7EB',
      }}
    >
      {/* =========================================
          HEADER
      ========================================== */}

      <AppHeader
        onPressBack={handleBack}
        showBack={true}
        step={step}
        totalSteps={totalSteps}
        title={questionText}
        description={questionDescription}
      />

      {/* =========================================
          SCROLL AREA
      ========================================== */}

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,

            // Extra space so content isn't hidden
            // behind the button container
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children({
            value,
            setValue: (newValue: any) => {
              setValue(newValue);
            },
          })}
        </ScrollView>
      </View>

      {/* =========================================
          BOTTOM BUTTON
      ========================================== */}

      {isValid && (
        <View
          style={{
            paddingTop: 16,
            paddingHorizontal: 16,

            /*
             * IMPORTANT:
             *
             * Android navigation/gesture bar can have
             * different heights on different devices.
             *
             * This automatically adds the required
             * bottom safe-area space.
             */
            paddingBottom: Math.max(
              insets.bottom,
              16,
            ),

            backgroundColor: '#FBF7EB',

            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
          }}
        >
          <ReusableButton
            title={
              step === totalSteps - 1
                ? 'Submit'
                : 'Continue'
            }
            variant="solid"
            onPress={handleNext}
            loading={loading}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(QuestionScreen);