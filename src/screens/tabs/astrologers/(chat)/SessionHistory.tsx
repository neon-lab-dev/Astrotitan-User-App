/* eslint-disable react-native/no-inline-styles */
import NoteIcon from '@/assets/icons/navigation/note.svg';

import React, { useCallback, useState } from 'react';

import { RefreshControl, ScrollView, View } from 'react-native';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import AppHeader from '../../../../components/reusable/AppHeader/AppHeader';
import AuthTitle from '../../../../components/auth/AuthTitle';
import { SansText } from '../../../../components/reusable/Text/SansText';
import ReusableButton from '../../../../components/reusable/ReusableButton/ReusableButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useGetMyConsultationBookingsQuery } from '../../../../redux/features/consultation/consultationApi';
import SkeletonLoader from '../../../../components/reusable/SkeletonLoader/SkeletonLoade';
import SessionHistoryCard from '../../../../components/SessionHistoryPage/SessionHistoryCard/SessionHistoryCard';

const SessionHistory = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    data: consultationBookings,
    isLoading: isBookingLoading,
    refetch,
  } = useGetMyConsultationBookingsQuery({});
  const bookings = consultationBookings?.data?.data || [];

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
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#816B22"
              colors={['#816B22']}
              progressBackgroundColor="#FBF7EB"
            />
          }
        >
          <AppHeader showBack={false}>
            <AuthTitle titleFontSize={17} title="Session Logs" />
          </AppHeader>

          <View
            style={{
              flex: 1,
            }}
          >
            {isBookingLoading ? (
              <SessionSkeleton />
            ) : bookings.length <= 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <NoteIcon height={124} width={124} />

                <SansText
                  style={{
                    marginTop: 16,
                    textAlign: 'center',
                  }}
                >
                  No sessions yet
                </SansText>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    paddingVertical: 16,
                  }}
                >
                  {bookings.map((item: any) => (
                    <SessionHistoryCard key={item._id} item={item} />
                  ))}
                </View>
              </ScrollView>
            )}

            {/* BUTTON */}

            <ReusableButton
              onPress={() => navigation.navigate('RequestedSessions')}
              style={{ marginVertical: 16 }}
              title="View Requested Sessions"
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SessionHistory;

const SessionSkeleton = () => {
  return (
    <View
      style={{
        paddingVertical: 16,
        gap: 20,
      }}
    >
      {[1, 2, 3, 4, 5].map(item => (
        <View
          key={item}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          {/* Avatar */}

          <SkeletonLoader
            width={52}
            height={52}
            borderRadius={26}
            array={[1]}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 12,
            }}
          >
            {/* Name */}

            <SkeletonLoader
              width={'55%'}
              height={16}
              borderRadius={8}
              array={[1]}
            />

            <View style={{ height: 8 }} />

            {/* Description */}

            <SkeletonLoader
              width={'35%'}
              height={12}
              borderRadius={8}
              array={[1]}
            />

            <View style={{ height: 8 }} />

            {/* Date */}

            <SkeletonLoader
              width={'25%'}
              height={12}
              borderRadius={8}
              array={[1]}
            />
          </View>

          {/* Arrow */}

          <SkeletonLoader
            width={20}
            height={20}
            borderRadius={10}
            array={[1]}
          />
        </View>
      ))}
    </View>
  );
};
