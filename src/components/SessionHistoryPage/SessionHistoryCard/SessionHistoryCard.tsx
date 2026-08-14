/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { formatDate } from '../../../utils/validators/dateValidators';
import { ICONS } from '../../../assets/svg';
import { useNavigation } from '@react-navigation/native';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#D4AF37';
    case 'scheduled':
      return '#2196F3';
    case 'ended':
      return '#4CAF50';
    default:
      return '#8E8E93';
  }
};

const SessionHistoryCard = ({ item } : any) => {
    const navigation = useNavigation<any>();
  const IconComponent = ICONS.RightArrow;
  return (
    // onPress={onPress}
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('SessionDetails', { id: item._id });
      }}
    >
      {/* Left Section - Image */}
      <Image
        source={{ uri: item?.astrologer?.profilePicture }}
        style={styles.profilePicture}
      />

      {/* Middle Section - Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <SatoshiText style={styles.userName} numberOfLines={1}>
            {item?.astrologer?.displayName}
          </SatoshiText>
          <View style={[styles.statusBadge, { backgroundColor: '#fef9eb' }]}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <SansText
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status}
            </SansText>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <SansText style={styles.typeText}>
            Req Type: {item?.method === 'chat' ? 'Chat' : 'Call'}
          </SansText>
          <SansText style={styles.dateText}>
            {formatDate(item.createdAt)}
          </SansText>
        </View>
        <View style={styles.bottomRow}>
          <SansText style={styles.typeText}>
            Consultation For: {item?.consultationFor}
          </SansText>
          <View style={styles.nextBtn}>
            <IconComponent width={16} height={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SessionHistoryCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Satoshi-Medium',
    textTransform: 'capitalize',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeText: {
    fontSize: 12,
    color: '#545456',
  },
  dateText: {
    fontSize: 11,
    color: '#545456',
  },
  nextBtn: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(98, 97, 106, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
