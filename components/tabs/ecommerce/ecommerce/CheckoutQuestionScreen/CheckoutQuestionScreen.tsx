import AuthTitle from "@/components/auth/AuthTitle";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ReusableButton from "@/components/reusable/ReusableButton/ReusableButton";
import { SansText } from "@/components/reusable/Text/SansText";
import StepHeader from "@/components/userDetailsForm/StepHeader";

import {
  nextStep,
  prevStep,
  setAnswer,
} from "@/redux/features/checkout/checkoutSlice";

import {
  RootState,
  store,
} from "@/redux/store";

import {
  router,
  useFocusEffect,
} from "expo-router";

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
    }, [step, value])
  );

  const handleBack = () => {
    if (step === 0) {
      router.back();
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