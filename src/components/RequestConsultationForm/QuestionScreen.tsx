/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppHeader from '../reusable/AppHeader/AppHeader';
import ReusableButton from '../reusable/ReusableButton/ReusableButton';
import { RootState, store } from '../../redux/store';
import {
  nextStep,
  prevStep,
  setAnswer,
} from '../../redux/features/RequestConsultationForm/RequestConsultationFormSlice';

interface Props {
  questionKey: string;
  questionText: string;
  questionDescription: string;
  validate?: (value: any) => boolean;
  initialValue?: any;
  onFinalSubmit?: (data: any) => void;
  children: (props: {
    value: any;
    setValue: (val: any) => void;
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
  const navigation = useNavigation<any>();

  const dispatch = useDispatch();

  const savedValue = useSelector(
    (state: RootState) => state.userDetailForm.answers[questionKey],
  );

  const step = useSelector((state: RootState) => state.userDetailForm.step);

  const totalSteps = 3;

  const [value, setValue] = useState<any>(savedValue ?? initialValue);

  useEffect(() => {
    if (savedValue !== undefined) {
      setValue(savedValue);
    } else {
      setValue(initialValue);
    }
  }, [savedValue, initialValue]);

  // ==================================================
  // VALIDATION
  // ==================================================

  const isValid = validate ? validate(value) : true;

  const handleNext = () => {
    dispatch(
      setAnswer({
        key: questionKey,

        value,
      }),
    );
    if (step === totalSteps - 1) {
      const currentAnswers = store.getState().userDetailForm.answers;

      const finalData = {
        ...currentAnswers,

        [questionKey]: value,
      };

      console.log('FINAL FORM DATA:', finalData);
      onFinalSubmit?.(finalData);

      return;
    }
    dispatch(nextStep());
  };

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

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [step, value, dispatch, questionKey]),
  );

  // ==================================================
  // HEADER BACK
  // ==================================================

  const handleBack = () => {
    dispatch(
      setAnswer({
        key: questionKey,
        value,
      }),
    );

    if (step === 0) {
      navigation.goBack();
      return;
    }
    dispatch(prevStep());
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
        onPressBack={handleBack}
        step={step}
        totalSteps={totalSteps}
        title={questionText}
        description={questionDescription}
      />

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
          showsVerticalScrollIndicator={false}
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

            backgroundColor: '#FBF7EB',

            borderTopRightRadius: 12,

            borderTopLeftRadius: 12,
          }}
        >
          <ReusableButton
            title={step === totalSteps - 1 ? 'Book Appointment' : 'Continue'}
            variant="solid"
            onPress={handleNext}
            loading={loading}
          />
        </View>
      )}
    </View>
  );
};

export default QuestionScreen;
