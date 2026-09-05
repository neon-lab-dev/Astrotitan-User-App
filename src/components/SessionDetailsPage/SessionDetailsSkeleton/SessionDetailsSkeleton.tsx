import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonLoader from '../../reusable/SkeletonLoader/SkeletonLoade';

const SessionDetailsSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      {/* Profile Card Skeleton */}
      <View style={styles.skeletonProfileCard}>
        <View style={styles.skeletonProfileImageWrapper}>
          <SkeletonLoader
            width={56}
            height={56}
            borderRadius={28}
            array={[1]}
          />
        </View>
        <View style={styles.skeletonProfileInfo}>
          <SkeletonLoader
            width={150}
            height={16}
            borderRadius={8}
            array={[1]}
          />
          <SkeletonLoader
            width={100}
            height={12}
            borderRadius={8}
            array={[1]}
          />
        </View>
      </View>

      {/* Status Badge Skeleton */}
      <View style={styles.skeletonStatusContainer}>
        <SkeletonLoader width={90} height={24} borderRadius={12} array={[1]} />
      </View>

      {/* Session Details Skeleton */}
      <View style={styles.skeletonSection}>
        <SkeletonLoader width={140} height={16} borderRadius={8} array={[1]} />
        <View style={styles.skeletonDetailRow}>
          <SkeletonLoader width={60} height={12} borderRadius={8} array={[1]} />
          <SkeletonLoader width={80} height={12} borderRadius={8} array={[1]} />
        </View>
        <View style={styles.skeletonDetailRow}>
          <SkeletonLoader width={60} height={12} borderRadius={8} array={[1]} />
          <SkeletonLoader width={60} height={12} borderRadius={8} array={[1]} />
        </View>
        <View style={styles.skeletonDetailRow}>
          <SkeletonLoader width={60} height={12} borderRadius={8} array={[1]} />
          <SkeletonLoader
            width={100}
            height={12}
            borderRadius={8}
            array={[1]}
          />
        </View>
        <View style={styles.skeletonDetailRow}>
          <SkeletonLoader width={60} height={12} borderRadius={8} array={[1]} />
          <SkeletonLoader width={80} height={12} borderRadius={8} array={[1]} />
        </View>
      </View>

      {/* Recommendations Skeleton */}
      <View style={styles.skeletonSection}>
        <SkeletonLoader width={140} height={16} borderRadius={8} array={[1]} />
        <View style={styles.skeletonTextBlock}>
          <SkeletonLoader
            width="100%"
            height={12}
            borderRadius={8}
            array={[1]}
          />
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
        </View>
      </View>

      {/* Action Buttons Skeleton */}
      <View style={styles.skeletonActionContainer}>
        <View style={styles.skeletonButton}>
          <SkeletonLoader
            width="100%"
            height={48}
            borderRadius={24}
            array={[1]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    padding: 16,
  },
  skeletonProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  skeletonProfileImageWrapper: {
    marginRight: 14,
  },
  skeletonProfileInfo: {
    flex: 1,
    gap: 8,
  },
  skeletonStatusContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  skeletonSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  skeletonDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  skeletonTextBlock: {
    gap: 8,
    marginTop: 4,
  },
  skeletonActionContainer: {
    marginTop: 8,
    gap: 12,
  },
  skeletonButton: {
    width: '100%',
  },
});

export default SessionDetailsSkeleton;
