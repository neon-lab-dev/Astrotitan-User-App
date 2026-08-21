/* eslint-disable react-native/no-inline-styles */
import NoteIcon from '@/assets/icons/navigation/note.svg';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View, StyleSheet } from 'react-native';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import { SansText } from '../../../../components/reusable/Text/SansText';
import { useGetMyConsultationBookingsQuery } from '../../../../redux/features/consultation/consultationApi';
import SkeletonLoader from '../../../../components/reusable/SkeletonLoader/SkeletonLoade';
import SessionHistoryCard from '../../../../components/SessionHistoryPage/SessionHistoryCard/SessionHistoryCard';
import AppBar from '../../../../components/reusable/AppBar/AppBar';

const SessionHistory = () => {
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

  const renderContent = () => {
    if (isBookingLoading) {
      return <SessionSkeleton />;
    }

    if (bookings.length <= 0) {
      return (
        <View style={styles.emptyContainer}>
          <NoteIcon height={124} width={124} />
          <SansText style={styles.emptyText}>No sessions yet</SansText>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {bookings.map((item: any) => (
            <SessionHistoryCard key={item._id} item={item} />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
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
            contentContainerStyle={styles.scrollContent}
            style={{ flex: 1 }}
          >
            <AppBar title="Session Logs" />

            <View style={styles.content}>
              {renderContent()}
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SessionHistory;

const SessionSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.skeletonItem}>
          <SkeletonLoader
            width={52}
            height={52}
            borderRadius={26}
            array={[1]}
          />

          <View style={styles.skeletonContent}>
            <SkeletonLoader
              width={'55%'}
              height={16}
              borderRadius={8}
              array={[1]}
            />
            <View style={{ height: 8 }} />
            <SkeletonLoader
              width={'35%'}
              height={12}
              borderRadius={8}
              array={[1]}
            />
            <View style={{ height: 8 }} />
            <SkeletonLoader
              width={'25%'}
              height={12}
              borderRadius={8}
              array={[1]}
            />
          </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#8E8E93',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom:16
  },
  skeletonContainer: {
    paddingVertical: 16,
    gap: 20,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
  },
});