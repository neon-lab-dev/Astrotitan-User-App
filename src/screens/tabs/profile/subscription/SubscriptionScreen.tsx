/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import SubscriptionCard from '../../../../components/tabs/profile/subscription/SubscriptionCard';
import {
  useCreateRazorpayOrderMutation,
  useGetMySubscriptionQuery,
  usePurchaseSubscriptionMutation,
} from '../../../../redux/features/subscribtion/subscriptionApi';
import ActiveSubscription from '../../../../components/tabs/profile/subscription/ActiveSubscription';
import CancelledSubscription from '../../../../components/tabs/profile/subscription/CancelledSubscription';
import ExpiredSubscription from '../../../../components/tabs/profile/subscription/ExpiredSubscription';
import CancelSubscription from '../../../../components/reusable/BottomSheet/CancelSubscription';
import BottomSheetService from '../../../../redux/features/ui/GlobalSheet/BottomSheetService';
import { useGetRazorpayKeyQuery } from '../../../../redux/features/orders/orderApi';
import RazorpayCheckout from 'react-native-razorpay';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import SkeletonLoader from '../../../../components/reusable/SkeletonLoader/SkeletonLoade';
import { useGetAllSubscriptionPlansQuery } from '../../../../redux/features/subscriptionPlan/subscriptionPlanApi';

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  numberOfConsultations: string;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  _id: string;
  status: 'active' | 'cancelled' | 'expired';
  isActive: boolean;
  startDate: string;
  endDate: string;
  cancelDate?: string;
  cancelReason?: string;
  remainingDays?: number;
  razorpaySubscriptionId?: string;
}
const SubscriptionSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      {/* Active Subscription Card Skeleton */}
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonHeaderRow}>
          <SkeletonLoader
            width={100}
            height={16}
            borderRadius={8}
            array={[1]}
          />
          <SkeletonLoader
            width={80}
            height={32}
            borderRadius={16}
            array={[1]}
          />
        </View>

        <View style={styles.skeletonTextBlock}>
          <SkeletonLoader
            width="80%"
            height={14}
            borderRadius={8}
            array={[1]}
          />
          <SkeletonLoader
            width="60%"
            height={12}
            borderRadius={8}
            array={[1]}
          />
        </View>

        <View style={styles.skeletonDivider} />

        <View style={styles.skeletonTextBlock}>
          <SkeletonLoader
            width="50%"
            height={12}
            borderRadius={8}
            array={[1]}
          />
          <SkeletonLoader
            width="70%"
            height={12}
            borderRadius={8}
            array={[1]}
          />
          <SkeletonLoader
            width="40%"
            height={12}
            borderRadius={8}
            array={[1]}
          />
        </View>

        <View style={styles.skeletonButton}>
          <SkeletonLoader
            width="100%"
            height={48}
            borderRadius={24}
            array={[1]}
          />
        </View>
      </View>

      {/* Subscription Plans Skeleton */}
      <View style={styles.skeletonSectionHeader}>
        <SkeletonLoader width={150} height={20} borderRadius={8} array={[1]} />
      </View>

      {/* Plan Cards Skeleton */}
      {[1, 2].map(item => (
        <View key={item} style={styles.skeletonPlanCard}>
          <View style={styles.skeletonPlanHeader}>
            <SkeletonLoader
              width={80}
              height={16}
              borderRadius={8}
              array={[1]}
            />
            <SkeletonLoader
              width={60}
              height={14}
              borderRadius={8}
              array={[1]}
            />
          </View>

          <View style={styles.skeletonPriceRow}>
            <SkeletonLoader
              width={100}
              height={28}
              borderRadius={8}
              array={[1]}
            />
            <SkeletonLoader
              width={50}
              height={14}
              borderRadius={8}
              array={[1]}
            />
          </View>

          <View style={styles.skeletonFeatures}>
            <SkeletonLoader
              width="90%"
              height={12}
              borderRadius={8}
              array={[1]}
            />
            <SkeletonLoader
              width="80%"
              height={12}
              borderRadius={8}
              array={[1]}
            />
            <SkeletonLoader
              width="85%"
              height={12}
              borderRadius={8}
              array={[1]}
            />
            <SkeletonLoader
              width="70%"
              height={12}
              borderRadius={8}
              array={[1]}
            />
          </View>

          <View style={styles.skeletonButton}>
            <SkeletonLoader
              width="100%"
              height={44}
              borderRadius={22}
              array={[1]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const SubscriptionScreen = () => {
  const { data: plans, isLoading: isPlansLoading } = useGetAllSubscriptionPlansQuery({});
  const subscriptionPlans = plans?.data?.data || [];
  console.log(subscriptionPlans);

  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isLoading, refetch } = useGetMySubscriptionQuery({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: razorpayKeyData } = useGetRazorpayKeyQuery({});
  const razorpayKey = razorpayKeyData?.key;
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [purchaseSubscription] = usePurchaseSubscriptionMutation();
  const [showPlans, setShowPlans] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const openCancelSubscriptionSheet = () => {
    BottomSheetService.open(
      <CancelSubscription
        onClose={() => BottomSheetService.close()}
        onSuccess={() => {
          refetch();
          BottomSheetService.close();
        }}
      />,
      {
        height: 420,
        hasGradient: true,
      },
    );
  };

  const subscription = data?.data || {};

  const isActive =
    subscription?.status === 'active' && subscription?.isActive === true;
  const isCancelled = subscription?.status === 'cancelled';
  const isExpired =
    subscription?.status === 'expired' ||
    (subscription?.endDate &&
      new Date(subscription.endDate) < new Date() &&
      !isCancelled);

  const handlePaymentSuccess = async () => {
    try {
      const payload = {
        subscriptionPlanId : selectedPlanId
      }
      const response = await purchaseSubscription(payload).unwrap();
      if (response.success) {
        refetch();
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Payment succeeded but subscription activation failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayPayment = (razorpayOrder: any) => {
    return new Promise((resolve, reject) => {
      const options = {
        description: 'Premium Subscription Membership',
        image: 'https://i.ibb.co.com/6JsDTXJh/logo.webp',
        currency: 'INR',
        key: razorpayKey,
        amount: razorpayOrder.amount,
        name: 'Astrotitan',
        order_id: razorpayOrder.id,
        prefill: {
          email: user?.email || '',
          contact: user?.phoneNumber || '',
          name: user?.name || '',
        },
        theme: {
          color: '#D4AF37',
        },
        modal: {
          backdropclose: false,
        },
      };

      RazorpayCheckout.open(options)
        .then(paymentData => {
          resolve(paymentData);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const handlePurchase = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to continue.');
      return;
    }

    try {
      setLoading(true);
      const response = await createRazorpayOrder({
        amount: 250,
      }).unwrap();
      const razorpayOrder = response.data;
      await openRazorpayPayment(razorpayOrder);
      await handlePaymentSuccess();
    } catch (error: any) {
      console.log(error);
      if (error?.code === 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment.');
      } else {
        Alert.alert(
          'Payment Failed',
          error?.description || 'Unable to complete payment.',
        );
      }
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      await Promise.all([refetch().unwrap()]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  if (isPlansLoading || isLoading) {
    return <SubscriptionSkeleton />;
  }

  // Active Subscription
  if (isActive) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppBar title="My Plan" />
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#af9a52"
                colors={['#816B22']}
                progressBackgroundColor="#FBF7EB"
              />
            }
            showsVerticalScrollIndicator={false}
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

  // Cancelled Subscription
  if (isCancelled && !showPlans) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppBar title="Subscription Plans" />
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#af9a52"
                colors={['#816B22']}
                progressBackgroundColor="#FBF7EB"
              />
            }
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

  // Expired Subscription
  if (isExpired && !showPlans) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppBar title="Subscription Expired" />
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#af9a52"
                colors={['#816B22']}
                progressBackgroundColor="#FBF7EB"
              />
            }
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

  // Show Plans (Default)
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar title="Choose a Plan" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 40,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#af9a52"
              colors={['#816B22']}
              progressBackgroundColor="#FBF7EB"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              gap: 22,
            }}
          >
            {subscriptionPlans?.map((plan: SubscriptionPlan) => (
              <SubscriptionCard
                key={plan._id}
                plan={plan}
                loading={isPlansLoading || loading}
                onPress={() => {
                  setSelectedPlanId(plan?._id);
                  handlePurchase();
                }}
              />
            ))}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  // ================= SKELETON STYLES =================
  skeletonContainer: {
    flex: 1,
    padding: 16,
  },

  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  skeletonHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  skeletonTextBlock: {
    gap: 8,
    marginBottom: 12,
  },

  skeletonDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },

  skeletonButton: {
    marginTop: 16,
  },

  skeletonSectionHeader: {
    marginBottom: 16,
  },

  skeletonPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  skeletonPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  skeletonPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  skeletonFeatures: {
    gap: 8,
    marginBottom: 16,
  },
});

export default SubscriptionScreen;
