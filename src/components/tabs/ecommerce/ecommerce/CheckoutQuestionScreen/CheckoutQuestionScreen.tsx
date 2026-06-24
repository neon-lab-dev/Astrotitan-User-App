


import React, {
  useEffect,
  useState,
} from "react";

import {
  BackHandler,
  ScrollView,
  View,
} from "react-native";

import {
  useDispatch,
  useSelector,
} from "react-redux";
import { RootState, store } from "../../../../../redux/store";
import { nextStep, prevStep, setAnswer } from "../../../../../redux/features/checkout/checkoutSlice";
import AppHeader from "../../../../reusable/AppHeader/AppHeader";
import StepHeader from "../../../../userDetailsForm/StepHeader";
import AuthTitle from "../../../../auth/AuthTitle";
import { SansText } from "../../../../reusable/Text/SansText";
import ReusableButton from "../../../../reusable/ReusableButton/ReusableButton";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

interface Props {
  questionKey: string;

  questionText: string;

  questionDescription: string;

  validate?: (
    value: any
  ) => boolean;

  initialValue?:
    | string
    | object
    | null;

  onFinalSubmit?: (
    data: any
  ) => void;

  children: (props: {
    value: any;

    setValue: (
      val: any
    ) => void;
  }) => React.ReactNode;
}

const CheckoutQuestionScreen: React.FC<
  Props
> = ({
  questionKey,
  questionText,
  questionDescription,
  children,
  validate,
  initialValue,
  onFinalSubmit,
}) => {
  const dispatch =
    useDispatch();

    const navigation = useNavigation<any>();

  // ✅ CORRECT SLICE
  const savedValue =
    useSelector(
      (
        state: RootState
      ) =>
        state.checkout
          .answers[
          questionKey
        ]
    );

  // ✅ CORRECT SLICE
  const step = useSelector(
    (
      state: RootState
    ) => state.checkout.step
  );

  const totalSteps = 3;

  const [value, setValue] =
    useState(
      savedValue ??
        initialValue
    );

  const isValid = validate
    ? validate(value)
    : true;

  useEffect(() => {
    if (
      savedValue !== undefined
    ) {
      setValue(savedValue);
    } else {
      setValue(
        initialValue
      );
    }
  }, [
    savedValue,
    initialValue,
  ]);

  const handleNext = () => {
    dispatch(
      setAnswer({
        key: questionKey,
        value,
      })
    );

    if (
      step ===
      totalSteps - 1
    ) {
      // ✅ CORRECT STORE PATH
      const finalData = {
        ...store.getState()
          .checkout.answers,

        [questionKey]:
          value,
      };

      onFinalSubmit?.(
        finalData
      );

      return;
    }

    dispatch(nextStep());
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress =
        () => {
          if (step > 0) {
            dispatch(
              setAnswer({
                key: questionKey,
                value,
              })
            );

            dispatch(
              prevStep()
            );

            return true;
          }

          return false;
        };

      const subscription =
        BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );

      return () =>
        subscription.remove();
    }, [
  step,
  value,
  dispatch,
  questionKey,
])
  );

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }

    dispatch(
      setAnswer({
        key: questionKey,
        value,
      })
    );

    dispatch(prevStep());
  };

  return (
    <View
      style={{
        flex: 1,
        
      }}
    >
      {/* HEADER */}
      <AppHeader
        onPressBack={
          handleBack
        }
        showBack={true}
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
              fontSize: 18,
            }}
          >
            {
              questionDescription
            }
          </SansText>
        </AuthTitle>
      </AppHeader>

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

      {/* FOOTER */}
      {isValid && (
        <View
          style={{
            padding: 16,

            backgroundColor:
              "#FBF7EB",

            borderTopRightRadius: 16,

            borderTopLeftRadius: 16,

          }}
        >
          <ReusableButton
            title={
              step ===
              totalSteps - 1
                ? "Place Order"
                : "Continue"
            }
            variant="solid"
            onPress={
              handleNext
            }
          />
        </View>
      )}
    </View>
  );
};

export default CheckoutQuestionScreen;