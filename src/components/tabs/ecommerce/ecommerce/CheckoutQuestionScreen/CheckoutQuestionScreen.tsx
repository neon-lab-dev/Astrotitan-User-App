/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../../../../../redux/store';
import {
  nextStep,
  prevStep,
  setAnswer,
} from '../../../../../redux/features/checkout/checkoutSlice';
import ReusableButton from '../../../../reusable/ReusableButton/ReusableButton';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../../../reusable/AppHeader/AppHeader';

interface Props {
  questionKey: string;
  questionText: string;
  questionDescription: string;
  initialValue?: string | object | null;
  onFinalSubmit?: (data: any) => void;
  children: (props: {
    value: any;
    setValue: (val: any) => void;
  }) => React.ReactNode;
}

const CheckoutQuestionScreen: React.FC<Props> = ({
  questionKey,
  questionText,
  questionDescription,
  children,
  initialValue,
  onFinalSubmit,
}) => {
  const dispatch = useDispatch();
  const savedValue = useSelector(
    (state: RootState) => state.checkout.answers[questionKey],
  );
  const step = useSelector((state: RootState) => state.checkout.step);
  const totalSteps = 3;
  const [value, setValue] = useState(savedValue ?? initialValue);

  useEffect(() => {
    if (savedValue !== undefined) {
      setValue(savedValue);
    } else {
      setValue(initialValue);
    }
  }, [savedValue, initialValue]);

  const handleNext = () => {
    dispatch(
      setAnswer({
        key: questionKey,
        value,
      }),
    );

    if (step === totalSteps - 1) {
      // CORRECT STORE PATH
      const finalData = {
        ...store.getState().checkout.answers,

        [questionKey]: value,
      };

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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <AppHeader
        title={questionText}
        description={questionDescription}
        step={step}
        totalSteps={totalSteps}
      />

      {/* CONTENT */}
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,

            paddingBottom: 40,
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

      {/* FOOTER */}
        <View
          style={{
            padding: 16,

            backgroundColor: '#FBF7EB',

            borderTopRightRadius: 16,

            borderTopLeftRadius: 16,
          }}
        >
          <ReusableButton
            title={step === totalSteps - 1 ? 'Place Order' : 'Continue'}
            variant="solid"
            onPress={handleNext}
          />
        </View>
    </View>
  );
};

export default CheckoutQuestionScreen;
