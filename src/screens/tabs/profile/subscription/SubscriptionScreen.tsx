import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

import { RootState } from "../../../../redux/store";

import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import { SUBSCRIPTION_PLANS } from "../../../../data/plans";
import SubscriptionCard from "../../../../components/tabs/profile/subscription/SubscriptionCard";
import { useCreateRazorpayOrderMutation, useGetMySubscriptionQuery, usePurchaseSubscriptionMutation } from "../../../../redux/features/subscribtion/subscriptionApi";
import ActiveSubscription from "../../../../components/tabs/profile/subscription/ActiveSubscription";
import CancelledSubscription from "../../../../components/tabs/profile/subscription/CancelledSubscription";
import ExpiredSubscription from "../../../../components/tabs/profile/subscription/ExpiredSubscription";
import CancelSubscription from "../../../../components/reusable/BottomSheet/CancelSubscription";
import BottomSheetService from "../../../../redux/features/ui/GlobalSheet/BottomSheetService";
import { useGetRazorpayKeyQuery } from "../../../../redux/features/orders/orderApi";
import RazorpayCheckout from "react-native-razorpay";


export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: string;

  features: string[];

  highlight?: boolean;
  isCurrent?: boolean;
}

export interface Subscription {
  _id: string;

  status: "active" | "cancelled" | "expired";

  isActive: boolean;

  startDate: string;

  endDate: string;

  cancelDate?: string;

  cancelReason?: string;

  remainingDays?: number;

  razorpaySubscriptionId?: string;
}
const SubscriptionScreen = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );
  const { data, isLoading, refetch } = useGetMySubscriptionQuery({});
  const [loading, setLoading] = useState(false);

  const { data: razorpayKeyData } =
    useGetRazorpayKeyQuery({});

  const razorpayKey =
    razorpayKeyData?.key;

  const [createRazorpayOrder] =
    useCreateRazorpayOrderMutation();

  const [purchaseSubscription] =
    usePurchaseSubscriptionMutation();
  const [showPlans, setShowPlans] = useState(false);
  const openCancelSubscriptionSheet = () => {
    BottomSheetService.open(
      <CancelSubscription
        onClose={() => BottomSheetService.close()}
        onSuccess={() => {
          refetch(); // Refresh subscription
          BottomSheetService.close();
        }}
      />,
      {
        height: 420,
        hasGradient: true,
      }
    );
  };

  const subscription = data?.data || {};

  const isActive =
    subscription?.status === "active" && subscription?.isActive === true;
  const isCancelled = subscription?.status === "cancelled";
  const isExpired =
    subscription?.status === "expired" ||
    (subscription?.endDate &&
      new Date(subscription.endDate) < new Date() &&
      !isCancelled);



  const handlePaymentSuccess = async () => {
  try {
    const response = await purchaseSubscription({}).unwrap();

    if (response.success) {
      refetch();
    }
  } catch (error) {
    console.log(error);

    Alert.alert(
      "Error",
      "Payment succeeded but subscription activation failed."
    );
  } finally {
    setLoading(false);
  }
};
  const openRazorpayPayment = (razorpayOrder: any) => {
  return new Promise((resolve, reject) => {
    const options = {
      description: "Premium Subscription Membership",
      image: "https://i.ibb.co.com/6JsDTXJh/logo.webp",
      currency: "INR",
      key: razorpayKey,
      amount: razorpayOrder.amount,
      name: "Astrotitan",
      order_id: razorpayOrder.id,

      prefill: {
        email: user?.email || "",
        contact: user?.phoneNumber || "",
        name: user?.name || "",
      },

      theme: {
        color: "#D4AF37",
      },

      modal: {
        backdropclose: false,
      },
    };

    RazorpayCheckout.open(options)
      .then((paymentData) => {
        resolve(paymentData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const handlePurchase = async () => {
  if (!user) {
    Alert.alert(
      "Login Required",
      "Please login to continue."
    );
    return;
  }

  try {
    setLoading(true);

    // STEP 1
    const response = await createRazorpayOrder({
      amount: 250,
    }).unwrap();

    const razorpayOrder = response.data;

    // STEP 2
    await openRazorpayPayment(razorpayOrder);

    // STEP 3
    await handlePaymentSuccess();
  } catch (error: any) {
    console.log(error);

    if (error?.code === "PAYMENT_CANCELLED") {
      Alert.alert(
        "Payment Cancelled",
        "You cancelled the payment."
      );
    } else {
      Alert.alert(
        "Payment Failed",
        error?.description ||
          "Unable to complete payment."
      );
    }

    setLoading(false);
  }
};

  if (isLoading) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader>
            <AuthTitle title="Subscriptions">
              <SansText style={{ fontSize: 16 }}>
                Loading...
              </SansText>
            </AuthTitle>
          </AppHeader>
          <SansText>Loading...</SansText>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  if (isActive) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader>
            <AuthTitle title="My Subscription">
              <SansText style={{ fontSize: 16 }}>
                You have an active Premium Plus subscription.
              </SansText>
            </AuthTitle>
          </AppHeader>

          <ScrollView
            contentContainerStyle={{
              padding: 16,
            }}
          >
            <ActiveSubscription
              subscription={subscription}
              onCancel={openCancelSubscriptionSheet}
            />
          </ScrollView>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }
  if (isCancelled && !showPlans) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader>
            <AuthTitle title="Subscription Cancelled">
              <SansText style={{ fontSize: 16 }}>
                Your Premium Plus subscription has been cancelled.
              </SansText>
            </AuthTitle>
          </AppHeader>

          <ScrollView
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1
            }}
            showsVerticalScrollIndicator={false}
          >
            <CancelledSubscription
              subscription={subscription}
              onResubscribe={handlePurchase}
              onCheckPlans={() => setShowPlans(true)}
            />
          </ScrollView>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }
  if (isExpired && !showPlans) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader>
            <AuthTitle title="Subscription Expired">
              <SansText style={{ fontSize: 16 }}>
                Your Premium Plus subscription has expired.
                Renew to continue enjoying premium features.
              </SansText>
            </AuthTitle>
          </AppHeader>

          <ScrollView
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1
            }}
            showsVerticalScrollIndicator={false}
          >
            <ExpiredSubscription
              onRenew={handlePurchase}
              onCheckPlans={() => setShowPlans(true)}
            />
          </ScrollView>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader>
          <AuthTitle title="Choose a plan">
            <SansText style={{ fontSize: 16 }}>
              Get uninterrupted access to astrologers and
              personalized guidance.
            </SansText>
          </AuthTitle>
        </AppHeader>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              gap: 22,
            }}
          >
            {SUBSCRIPTION_PLANS.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                loading={
                  loading &&
                  plan.id === "premium"
                }
                onPress={() => {
                  if (plan.id === "premium") {
                    handlePurchase();
                  }
                }}
              />
            ))}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SubscriptionScreen;