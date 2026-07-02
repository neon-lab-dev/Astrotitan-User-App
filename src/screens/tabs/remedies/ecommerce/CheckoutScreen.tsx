import React, { useState } from "react";

import { useDispatch, useSelector, } from "react-redux";
import DeliveryAddressStep from "../../../../components/tabs/ecommerce/checkout/DeliveryAddressStep";
import OrderReviewStep from "../../../../components/tabs/ecommerce/checkout/OrderReviewStep";
import PaymentStep from "../../../../components/tabs/ecommerce/checkout/PaymentStep";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import CheckoutQuestionScreen from "../../../../components/tabs/ecommerce/ecommerce/CheckoutQuestionScreen/CheckoutQuestionScreen";
import { RootState } from "../../../../redux/store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useCreateProductOrderMutation, useGetRazorpayKeyQuery, useVerifyPaymentMutation } from "../../../../redux/features/orders/orderApi";
import { selectUser } from "../../../../redux/features/auth/authSlice";
import { clearCart } from "../../../../redux/features/cart/cartSlice";
import { Alert } from "react-native";
import RazorpayCheckout from 'react-native-razorpay';

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

    validate: (value: any) => !!value?.addressId,
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
    type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;
  
  const navigation = useNavigation<NavigationProp>();
  const step = useSelector(
    (state: RootState) =>
      state.checkout.step
  );

   const user = useSelector(selectUser) as any;
   const dispatch = useDispatch();
  
  const currentStep =
    checkoutSteps[step];

const [loading, setLoading] = useState<boolean>(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);
const { data: razorpayKeyData } = useGetRazorpayKeyQuery({});
const razorpayKey = razorpayKeyData?.key;
  const [createProductOrder] = useCreateProductOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

   const cartItems = useSelector(
    (state: RootState) =>
      state.cart.items
  );
const openRazorpayPayment = (order: any, razorpayOrder: any) => {
    return new Promise((resolve, reject) => {
      if (!RazorpayCheckout) {
            reject(new Error('Razorpay SDK not loaded'));
            return;
        }
      const options = {
        description: `Order #${order?.orderId}`,
        image: 'https://i.ibb.co.com/6JsDTXJh/logo.webp',
        currency: razorpayOrder?.currency,
        key: razorpayKey,
        amount: razorpayOrder?.amount,
        name: 'Astrotitan',
        order_id: razorpayOrder?.id,
        prefill: {
          email: user?.email || '',
          contact: user?.phoneNumber || '',
          name: user?.name || 'User',
        },
        theme: {
          color: '#d4af37',
        },
        modal: {
          // For Android back button behavior
          backdropclose: false,
        },
      };

      RazorpayCheckout.open(options)
        .then((data: any) => {
         
          resolve(data);
        })
        .catch((error: any) => {
          // ✅ Payment error or cancellation
          console.log('Payment error:', error);
          reject(error);
        });
    });
  };

  // ✅ Handle Place Order
  const handlePlaceProductOrder = async (formData: any) => {
    // Validate cart
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    // Validate address
    if (!formData?.deliveryAddress?.addressId) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    setLoading(true);
    setIsPlacingOrder(true);

    try {
      // Prepare order items
      const orderedItems = cartItems.map((item: any) => ({
        productId: item?.id,
        name: item?.name,
        quantity: item?.quantity,
        price: item?.price || 0,
      }));

      // Calculate total
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
        0,
      );
      // ✅ Step 1: Create order in backend
      const orderResponse = await createProductOrder({
        orderedItems,
        totalAmount: totalAmount,
        addressId: formData?.deliveryAddress?.addressId,
      }).unwrap();
      if (!orderResponse?.success) {
        throw new Error('Failed to create order');
      }

      const { order, razorpayOrder } = orderResponse.data;
      try {
        const paymentData = await openRazorpayPayment(order, razorpayOrder);
        // ✅ Step 3: Verify payment
        await handleVerifyPayment(
          paymentData?.razorpay_order_id,
          paymentData?.razorpay_payment_id,
          paymentData?.razorpay_signature,
          order?._id,
        );
        
      } catch (paymentError: any) {
        console.log('Payment cancelled or failed:', paymentError);
        if (paymentError?.code === 'PAYMENT_CANCELLED') {
          Alert.alert('Payment Cancelled', 'You cancelled the payment');
        } else {
          Alert.alert('Payment Failed', paymentError?.description || 'Something went wrong');
        }
        setLoading(false);
        setIsPlacingOrder(false);
      }

    } catch (error: any) {
      console.error('❌ Order creation error:', error);
      Alert.alert('Error', error?.message || 'Failed to place order');
      setLoading(false);
      setIsPlacingOrder(false);
    }
  };

  // ✅ Handle Verify Payment
  const handleVerifyPayment = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderId: string,
  ) => {
    try {
      const payload = {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderId,
      };

      const response = await verifyPayment(payload).unwrap();

      if (response.success) {
        // ✅ Clear cart
        dispatch(clearCart());
        
        // ✅ Navigate to success screen
        navigation.navigate('OrderSuccessful', {slug: orderId });
        
        Alert.alert('Success', 'Payment verified successfully!');
      } else {
        Alert.alert('Error', 'Payment verification failed');
        // navigation.navigate('PaymentFailed');
      }
    } catch (error: any) {
      console.error('❌ Payment verification error:', error);
      Alert.alert('Error', 'Payment verification failed');
      // navigation.navigate('PaymentFailed');
    } finally {
      setLoading(false);
      setIsPlacingOrder(false);
    }
  };


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
          handlePlaceProductOrder
        }
      >
        {currentStep.render}
      </CheckoutQuestionScreen></ScreenWrapper></AnimatedScreen>
  );
};

export default CheckoutScreen;