import React from "react";

import { useSelector, } from "react-redux";
import DeliveryAddressStep from "../../../../components/tabs/ecommerce/checkout/DeliveryAddressStep";
import OrderReviewStep from "../../../../components/tabs/ecommerce/checkout/OrderReviewStep";
import PaymentStep from "../../../../components/tabs/ecommerce/checkout/PaymentStep";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import CheckoutQuestionScreen from "../../../../components/tabs/ecommerce/ecommerce/CheckoutQuestionScreen/CheckoutQuestionScreen";
import { RootState } from "../../../../redux/store";

const checkoutSteps = [
  {
    key: "deliveryAddress",

    initialValue: {
      addressId: "",
    },

    text: "Delivery Address",

    description:
      "Choose where your order should be delivered.",

    render: ({
      value,
      setValue,
    }: any) => (
      <DeliveryAddressStep
        value={value}
        setValue={setValue}
      />
    ),

    validate: (value: any) => {
      return (
        value?.addressLine1?.trim() &&
        value?.addressLine2?.trim() &&
        value?.state?.trim() &&
        value?.pincode?.trim() &&
        value?.type?.trim()
      );
    },
  },

  {
    key: "orderReview",

    initialValue: {},

    text: "Review Your Order",

    description:
      "Verify your products before payment.",

    render: ({
      value,
      setValue,
    }: any) => (
      <OrderReviewStep
        value={value}
        setValue={setValue}
      />
    ),

    validate: () => true,
  },

  {
    key: "payment",

    initialValue: {
      paymentMethod: "cod",
    },

    text: "Payment Method",

    description:
      "Complete your order securely.",

    render: ({
      value,
      setValue,
    }: any) => (
      <PaymentStep
        value={value}
        setValue={setValue}
      />
    ),

    validate: (value: any) =>
      !!value,
  },
];

const CheckoutScreen = () => {
  const step = useSelector(
    (state: RootState) =>
      state.checkout.step
  );
  const handleFinalSubmit =
    async (formData: any) => {
      try {
        console.log(
          "FINAL CHECKOUT DATA:",
          formData
        );

        // PLACE ORDER API HERE

        // Example:
        // await placeOrder(formData);

        // router.replace(
        //   "/(tabs)/remedies/(ecommerce)/order-sucessfull"
        // );

      } catch (err) {
        console.log(
          "CHECKOUT ERROR:",
          err
        );
      }
    };

  const currentStep =
    checkoutSteps[step];

  if (!currentStep) return null;

  return (<AnimatedScreen>
    <ScreenWrapper>
      <CheckoutQuestionScreen
        key={currentStep.key}
        questionKey={
          currentStep.key
        }
        questionDescription={
          currentStep.description
        }
        questionText={
          currentStep.text
        }
        validate={
          currentStep.validate
        }
        initialValue={
          currentStep.initialValue
        }
        onFinalSubmit={
          handleFinalSubmit
        }
      >
        {currentStep.render}
      </CheckoutQuestionScreen></ScreenWrapper></AnimatedScreen>
  );
};

export default CheckoutScreen;