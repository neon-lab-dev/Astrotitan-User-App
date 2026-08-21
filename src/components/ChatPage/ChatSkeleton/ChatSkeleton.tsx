// components/Chat/ChatSkeleton.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from '../../reusable/SkeletonLoader/SkeletonLoade';

const ChatSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerSkeleton}>
        <View style={styles.profileSkeleton}>
          <SkeletonLoader width={48} height={48} borderRadius={28} array={[1]} />
          <View style={styles.textSkeleton}>
            <SkeletonLoader width={120} height={16} borderRadius={8} array={[1]} />
            <SkeletonLoader width={80} height={12} borderRadius={8} array={[1]} />
          </View>
        </View>
        <SkeletonLoader width={110} height={40} borderRadius={20} array={[1]} />
      </View>

      {/* Messages Skeleton */}
      <View style={styles.messagesContainer}>
        {/* Received messages */}
        <View style={styles.receivedMessage}>
          <SkeletonLoader width="70%" height={40} borderRadius={10} array={[1]} />
          <SkeletonLoader width="30%" height={12} borderRadius={8} array={[1]} />
        </View>

        {/* Sent messages */}
        <View style={styles.sentMessage}>
          <SkeletonLoader width="60%" height={40} borderRadius={10} array={[1]} />
          <SkeletonLoader width="25%" height={12} borderRadius={8} array={[1]} />
        </View>

        <View style={styles.receivedMessage}>
          <SkeletonLoader width="65%" height={40} borderRadius={10} array={[1]} />
          <SkeletonLoader width="35%" height={12} borderRadius={8} array={[1]} />
        </View>

        <View style={styles.sentMessage}>
          <SkeletonLoader width="55%" height={40} borderRadius={10} array={[1]} />
          <SkeletonLoader width="28%" height={12} borderRadius={8} array={[1]} />
        </View>

        <View style={styles.receivedMessage}>
          <SkeletonLoader width="75%" height={40} borderRadius={10} array={[1]} />
          <SkeletonLoader width="32%" height={12} borderRadius={8} array={[1]} />
        </View>
      </View>

      {/* Input Skeleton */}
      <View style={styles.inputSkeleton}>
        <SkeletonLoader width="82%" height={52} borderRadius={10} array={[1]} />
        <SkeletonLoader width={52} height={52} borderRadius={26} array={[1]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2E3',
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  profileSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSkeleton: {
    marginLeft: 10,
    gap: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 14,
    gap: 16,
  },
  receivedMessage: {
    alignItems: 'flex-start',
    gap: 4,
  },
  sentMessage: {
    alignItems: 'flex-end',
    gap: 4,
  },
  inputSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 12,
  },
});

export default ChatSkeleton;